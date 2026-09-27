const pool = require("../config/db");

const createQuotation = async ({
    enquiryId,
    validUntil,
    products,
    createdBy
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check enquiry
        const enquiryResult = await client.query(
            `
            SELECT id, customer_id, status
            FROM enquiries
            WHERE id = $1
            `,
            [enquiryId]
        );

        if (enquiryResult.rows.length === 0) {
            throw new Error("Enquiry not found");
        }

        const enquiry = enquiryResult.rows[0];

        // Generate quotation number
        const numberResult = await client.query(
            `
            SELECT COALESCE(MAX(id), 0) + 1 AS next_number
            FROM quotations
            `
        );

        const quotationNumber = `QUO-${String(
            numberResult.rows[0].next_number
        ).padStart(5, "0")}`;

        let grandTotal = 0;

        const quotationItems = [];

        // Calculate every quotation item
        for (const item of products) {

            const productResult = await client.query(
                `
                SELECT id, product_name, base_price
                FROM products
                WHERE id = $1
                `,
                [item.productId]
            );

            if (productResult.rows.length === 0) {
                throw new Error(
                    `Product ${item.productId} not found`
                );
            }

            const product = productResult.rows[0];

            const quantity = Number(item.quantity);

            const unitPrice =
                item.unitPrice !== undefined
                    ? Number(item.unitPrice)
                    : Number(product.base_price);

            const discountPercent =
                item.discountPercent !== undefined
                    ? Number(item.discountPercent)
                    : 0;

            const gstPercent =
                item.gstPercent !== undefined
                    ? Number(item.gstPercent)
                    : 18;

            if (quantity <= 0) {
                throw new Error(
                    "Quantity must be greater than 0"
                );
            }

            if (unitPrice < 0) {
                throw new Error(
                    "Unit price cannot be negative"
                );
            }

            if (
                discountPercent < 0 ||
                discountPercent > 100
            ) {
                throw new Error(
                    "Discount must be between 0 and 100"
                );
            }

            if (
                gstPercent < 0 ||
                gstPercent > 100
            ) {
                throw new Error(
                    "GST must be between 0 and 100"
                );
            }

            // Base amount
            const baseAmount =
                quantity * unitPrice;

            // Discount
            const discountAmount =
                baseAmount *
                (discountPercent / 100);

            // Taxable amount
            const taxableAmount =
                baseAmount - discountAmount;

            // GST
            const gstAmount =
                taxableAmount *
                (gstPercent / 100);

            // Final line amount
            const lineAmount =
                taxableAmount + gstAmount;

            grandTotal += lineAmount;

            quotationItems.push({
                productId: product.id,
                quantity,
                unitPrice,
                discountPercent,
                gstPercent,
                lineAmount
            });
        }

        // Create quotation
        const quotationResult = await client.query(
            `
            INSERT INTO quotations
            (
                quotation_number,
                enquiry_id,
                customer_id,
                valid_until,
                status,
                grand_total,
                created_by
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                'DRAFT',
                $5,
                $6
            )
            RETURNING
                id,
                quotation_number,
                enquiry_id,
                customer_id,
                valid_until,
                status,
                grand_total,
                created_by,
                created_at
            `,
            [
                quotationNumber,
                enquiryId,
                enquiry.customer_id,
                validUntil,
                grandTotal,
                createdBy
            ]
        );

        const quotation = quotationResult.rows[0];

        // Insert quotation items
        for (const item of quotationItems) {

            await client.query(
                `
                INSERT INTO quotation_items
                (
                    quotation_id,
                    product_id,
                    quantity,
                    unit_price,
                    discount_percent,
                    gst_percent,
                    line_amount
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                )
                `,
                [
                    quotation.id,
                    item.productId,
                    item.quantity,
                    item.unitPrice,
                    item.discountPercent,
                    item.gstPercent,
                    item.lineAmount
                ]
            );
        }

        // Mark enquiry as QUOTED
        await client.query(
            `
            UPDATE enquiries
            SET status = 'QUOTED'
            WHERE id = $1
            `,
            [enquiryId]
        );

        await client.query("COMMIT");

        return quotation;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
};


const getQuotations = async () => {

    const result = await pool.query(
        `
        SELECT
            q.id,
            q.quotation_number,
            q.enquiry_id,
            e.enquiry_number,
            q.customer_id,
            c.company_name,
            q.valid_until,
            q.status,
            q.grand_total,
            q.created_by,
            q.created_at
        FROM quotations q
        JOIN enquiries e
            ON e.id = q.enquiry_id
        JOIN customers c
            ON c.id = q.customer_id
        ORDER BY q.id DESC
        `
    );

    return result.rows;
};


const updateQuotationStatus = async ({
    quotationId,
    status
}) => {

    const allowedStatuses = [
        "DRAFT",
        "SENT",
        "ACCEPTED",
        "REJECTED"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error(
            "Invalid quotation status"
        );
    }

    const result = await pool.query(
        `
        UPDATE quotations
        SET status = $1
        WHERE id = $2
        RETURNING
            id,
            quotation_number,
            enquiry_id,
            customer_id,
            valid_until,
            status,
            grand_total,
            created_by,
            created_at
        `,
        [status, quotationId]
    );

    if (result.rows.length === 0) {
        throw new Error(
            "Quotation not found"
        );
    }

    return result.rows[0];
};


module.exports = {
    createQuotation,
    getQuotations,
    updateQuotationStatus
};