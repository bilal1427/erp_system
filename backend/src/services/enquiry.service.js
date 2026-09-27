const pool = require("../config/db");

const createEnquiry = async ({
    customerId,
    enquiryDate,
    requiredDate,
    products,
    notes,
    createdBy
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Keep the number allocation and insert together so concurrent
        // requests cannot select the same next enquiry number.
        await client.query("LOCK TABLE enquiries IN SHARE ROW EXCLUSIVE MODE");

        const enquiryNumberResult = await client.query(
            `
            SELECT COALESCE(MAX(id), 0) + 1 AS next_number
            FROM enquiries
            `
        );

        const enquiryNumber = `ENQ-${String(
            enquiryNumberResult.rows[0].next_number
        ).padStart(5, "0")}`;

        const enquiryResult = await client.query(
            `
            INSERT INTO enquiries
                (
                    enquiry_number,
                    customer_id,
                    enquiry_date,
                    required_date,
                    notes,
                    status,
                    created_by
                )
            VALUES
                ($1, $2, $3, $4, $5, 'NEW', $6)
            RETURNING
                id,
                enquiry_number,
                customer_id,
                enquiry_date,
                required_date,
                notes,
                status,
                created_by
            `,
            [
                enquiryNumber,
                customerId,
                enquiryDate,
                requiredDate,
                notes || null,
                createdBy
            ]
        );

        const enquiry = enquiryResult.rows[0];

        for (const item of products) {
            await client.query(
                `
                INSERT INTO enquiry_items
                    (enquiry_id, product_id, quantity)
                VALUES
                    ($1, $2, $3)
                `,
                [
                    enquiry.id,
                    item.productId ?? item.product_id,
                    item.quantity
                ]
            );
        }

        await client.query("COMMIT");

        return enquiry;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getEnquiries = async () => {
    const result = await pool.query(
        `
        SELECT
            e.id,
            e.enquiry_number,
            e.customer_id,
            c.company_name,
            e.enquiry_date,
            e.required_date,
            e.notes,
            e.status,
            e.created_by,
            COALESCE(
                json_agg(json_build_object(
                    'product_id', ei.product_id,
                    'product_name', p.product_name,
                    'quantity', ei.quantity
                )) FILTER (WHERE ei.id IS NOT NULL),
                '[]'::json
            ) AS items
        FROM enquiries e
        JOIN customers c
            ON c.id = e.customer_id
        LEFT JOIN enquiry_items ei
            ON ei.enquiry_id = e.id
        LEFT JOIN products p
            ON p.id = ei.product_id
        GROUP BY e.id, c.company_name
        ORDER BY e.id DESC
        `
    );

    return result.rows;
};

module.exports = {
    createEnquiry,
    getEnquiries
};
