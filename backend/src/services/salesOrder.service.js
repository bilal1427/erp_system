const pool = require("../config/db");


// ======================================================
// CONVERT ACCEPTED QUOTATION INTO SALES ORDER
// ======================================================

const convertQuotationToSalesOrder = async ({
    quotationId,
    createdBy
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Get quotation
        const quotationResult = await client.query(
            `
            SELECT
                id,
                quotation_number,
                customer_id,
                status,
                grand_total
            FROM quotations
            WHERE id = $1
            FOR UPDATE
            `,
            [quotationId]
        );

        if (quotationResult.rows.length === 0) {
            throw new Error("Quotation not found");
        }

        const quotation = quotationResult.rows[0];

        // 2. Only ACCEPTED quotations can become Sales Orders
        if (quotation.status !== "ACCEPTED") {
            throw new Error(
                "Only ACCEPTED quotations can be converted into Sales Orders"
            );
        }

        // 3. Prevent duplicate Sales Order
        const existingOrder = await client.query(
            `
            SELECT id, order_number
            FROM sales_orders
            WHERE quotation_id = $1
            `,
            [quotationId]
        );

        if (existingOrder.rows.length > 0) {
            throw new Error(
                `Sales Order already exists for this quotation: ${existingOrder.rows[0].order_number}`
            );
        }

        // 4. Get quotation items
        const itemsResult = await client.query(
            `
            SELECT
                product_id,
                quantity
            FROM quotation_items
            WHERE quotation_id = $1
            `,
            [quotationId]
        );

        if (itemsResult.rows.length === 0) {
            throw new Error(
                "Quotation has no items"
            );
        }

        // 5. Generate Sales Order number
        const numberResult = await client.query(
            `
            SELECT COALESCE(MAX(id), 0) + 1 AS next_number
            FROM sales_orders
            `
        );

        const orderNumber = `SO-${String(
            numberResult.rows[0].next_number
        ).padStart(5, "0")}`;

        // 6. Create Sales Order
        const orderResult = await client.query(
            `
            INSERT INTO sales_orders
            (
                order_number,
                customer_id,
                quotation_id,
                order_date,
                total_amount,
                status,
                created_by
            )
            VALUES
            (
                $1,
                $2,
                $3,
                CURRENT_DATE,
                $4,
                'PENDING',
                $5
            )
            RETURNING
                id,
                order_number,
                customer_id,
                quotation_id,
                order_date,
                total_amount,
                status,
                created_by,
                created_at
            `,
            [
                orderNumber,
                quotation.customer_id,
                quotation.id,
                quotation.grand_total,
                createdBy
            ]
        );

        const salesOrder = orderResult.rows[0];

        // 7. Copy quotation items into Sales Order items
        for (const item of itemsResult.rows) {
            await client.query(
                `
                INSERT INTO sales_order_items
                (
                    sales_order_id,
                    product_id,
                    quantity
                )
                VALUES
                (
                    $1,
                    $2,
                    $3
                )
                `,
                [
                    salesOrder.id,
                    item.product_id,
                    item.quantity
                ]
            );
        }

        await client.query("COMMIT");

        return salesOrder;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
};


// ======================================================
// GET ALL SALES ORDERS
// ======================================================

const getSalesOrders = async () => {

    const result = await pool.query(
        `
        SELECT
            so.id,
            so.order_number,
            so.customer_id,
            c.company_name,
            so.quotation_id,
            q.quotation_number,
            so.order_date,
            so.total_amount,
            so.status,
            so.created_by,
            so.created_at
        FROM sales_orders so

        JOIN customers c
            ON c.id = so.customer_id

        JOIN quotations q
            ON q.id = so.quotation_id

        ORDER BY so.id DESC
        `
    );

    return result.rows;
};


// ======================================================
// CONFIRM SALES ORDER + RESERVE INVENTORY
// ======================================================

const confirmSalesOrder = async ({
    salesOrderId
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // 1. Lock Sales Order
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
            throw new Error(
                "Sales Order not found"
            );
        }

        const salesOrder = orderResult.rows[0];

        // 2. Sales Order must be PENDING
        if (salesOrder.status !== "PENDING") {
            throw new Error(
                `Sales Order cannot be confirmed because its current status is ${salesOrder.status}`
            );
        }

        // 3. Get Sales Order items
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

        // 4. Check and reserve inventory
        for (const item of itemsResult.rows) {

            // IMPORTANT:
            // FOR UPDATE prevents concurrent reservations
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

            const availableQuantity =
                inventory.physical_quantity -
                inventory.reserved_quantity;

            // 5. Prevent reservation beyond available stock
            if (item.quantity > availableQuantity) {

                throw new Error(
                    `Insufficient inventory for product ${item.product_id}. Available: ${availableQuantity}, Requested: ${item.quantity}`
                );
            }

            // 6. Increase reserved quantity
            await client.query(
                `
                UPDATE inventory
                SET reserved_quantity =
                    reserved_quantity + $1
                WHERE product_id = $2
                `,
                [
                    item.quantity,
                    item.product_id
                ]
            );
        }

        // 7. Change Sales Order status
        const updatedOrderResult = await client.query(
            `
            UPDATE sales_orders
            SET status = 'CONFIRMED'
            WHERE id = $1
            RETURNING
                id,
                order_number,
                customer_id,
                quotation_id,
                order_date,
                total_amount,
                status,
                created_by,
                created_at
            `,
            [salesOrderId]
        );

        await client.query("COMMIT");

        return updatedOrderResult.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
};


module.exports = {
    convertQuotationToSalesOrder,
    getSalesOrders,
    confirmSalesOrder
};