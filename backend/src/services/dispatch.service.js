const pool = require("../config/db");


// ======================================================
// CREATE DISPATCH
// ======================================================

const createDispatch = async ({
    salesOrderId,
    vehicleNumber,
    driverName,
    createdBy
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        await client.query("LOCK TABLE dispatches IN SHARE ROW EXCLUSIVE MODE");


        // ------------------------------------------------
        // 1. Get and lock Sales Order
        // ------------------------------------------------

        const orderResult = await client.query(
            `
            SELECT
                id,
                order_number,
                status
            FROM sales_orders
            WHERE id = $1
            FOR UPDATE
            `,
            [salesOrderId]
        );

        if (orderResult.rows.length === 0) {
            throw new Error("Sales Order not found");
        }

        const salesOrder = orderResult.rows[0];


        // ------------------------------------------------
        // 2. Only CONFIRMED orders can be dispatched
        // ------------------------------------------------

        if (salesOrder.status === "CANCELLED") {
            throw new Error(
                "Cancelled Sales Orders cannot be dispatched"
            );
        }

        if (salesOrder.status !== "CONFIRMED") {
            throw new Error(
                `Sales Order cannot be dispatched because its current status is ${salesOrder.status}`
            );
        }


        // ------------------------------------------------
        // 3. Prevent duplicate dispatch
        // ------------------------------------------------

        const existingDispatch = await client.query(
            `
            SELECT
                id,
                dispatch_number
            FROM dispatches
            WHERE sales_order_id = $1
            `,
            [salesOrderId]
        );

        if (existingDispatch.rows.length > 0) {
            throw new Error(
                `Sales Order has already been dispatched: ${existingDispatch.rows[0].dispatch_number}`
            );
        }


        // ------------------------------------------------
        // 4. Get Sales Order items
        // ------------------------------------------------

        const itemsResult = await client.query(
            `
            SELECT
                product_id,
                quantity
            FROM sales_order_items
            WHERE sales_order_id = $1
            `,
            [salesOrderId]
        );

        if (itemsResult.rows.length === 0) {
            throw new Error(
                "Sales Order has no items"
            );
        }


        // ------------------------------------------------
        // 5. Lock inventory and validate reservation
        // ------------------------------------------------

        for (const item of itemsResult.rows) {

            const inventoryResult = await client.query(
                `
                SELECT
                    id,
                    product_id,
                    physical_quantity,
                    reserved_quantity
                FROM inventory
                WHERE product_id = $1
                FOR UPDATE
                `,
                [item.product_id]
            );

            if (inventoryResult.rows.length === 0) {
                throw new Error(
                    `Inventory not found for product ${item.product_id}`
                );
            }

            const inventory = inventoryResult.rows[0];


            // The order quantity must have been reserved
            if (
                Number(inventory.reserved_quantity) <
                Number(item.quantity)
            ) {
                throw new Error(
                    `Insufficient reserved inventory for product ${item.product_id}`
                );
            }


            // Physical stock must also be sufficient
            if (
                Number(inventory.physical_quantity) <
                Number(item.quantity)
            ) {
                throw new Error(
                    `Insufficient physical inventory for product ${item.product_id}`
                );
            }


            // ------------------------------------------------
            // 6. Reduce physical AND reserved quantities
            // ------------------------------------------------

            await client.query(
                `
                UPDATE inventory
                SET
                    physical_quantity = physical_quantity - $1,
                    reserved_quantity = reserved_quantity - $1
                WHERE product_id = $2
                `,
                [
                    item.quantity,
                    item.product_id
                ]
            );
        }


        // ------------------------------------------------
        // 7. Generate dispatch number
        // ------------------------------------------------

        const numberResult = await client.query(
            `
            SELECT COALESCE(MAX(id), 0) + 1 AS next_number
            FROM dispatches
            `
        );

        const dispatchNumber = `DSP-${String(
            numberResult.rows[0].next_number
        ).padStart(5, "0")}`;


        // ------------------------------------------------
        // 8. Create dispatch record
        // ------------------------------------------------

        const dispatchResult = await client.query(
            `
            INSERT INTO dispatches
            (
                dispatch_number,
                sales_order_id,
                dispatch_date,
                vehicle_number,
                driver_name,
                created_by
            )
            VALUES
            (
                $1,
                $2,
                CURRENT_DATE,
                $3,
                $4,
                $5
            )
            RETURNING
                id,
                dispatch_number,
                sales_order_id,
                dispatch_date,
                vehicle_number,
                driver_name,
                created_by,
                created_at
            `,
            [
                dispatchNumber,
                salesOrderId,
                vehicleNumber,
                driverName,
                createdBy
            ]
        );


        // ------------------------------------------------
        // 9. Mark Sales Order as DISPATCHED
        // ------------------------------------------------

        await client.query(
            `
            UPDATE sales_orders
            SET status = 'DISPATCHED'
            WHERE id = $1
            `,
            [salesOrderId]
        );


        await client.query("COMMIT");

        return dispatchResult.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
};


// ======================================================
// GET ALL DISPATCHES
// ======================================================

const getDispatches = async () => {

    const result = await pool.query(
        `
        SELECT
            d.id,
            d.dispatch_number,
            d.sales_order_id,
            so.order_number,
            d.dispatch_date,
            d.vehicle_number,
            d.driver_name,
            d.created_by,
            d.created_at
        FROM dispatches d
        JOIN sales_orders so
            ON so.id = d.sales_order_id
        ORDER BY d.id DESC
        `
    );

    return result.rows;
};


module.exports = {
    createDispatch,
    getDispatches
};
