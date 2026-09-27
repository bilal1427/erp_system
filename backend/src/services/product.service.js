const pool = require("../config/db");

const createProduct = async ({
    productCode,
    productName,
    category,
    unit,
    basePrice
}) => {
    const result = await pool.query(
        `
        INSERT INTO products
            (product_code, product_name, category, unit, base_price)
        VALUES
            ($1, $2, $3, $4, $5)
        RETURNING
            id,
            product_code,
            product_name,
            category,
            unit,
            base_price
        `,
        [productCode, productName, category, unit, basePrice]
    );

    return result.rows[0];
};

const getProducts = async () => {
    const result = await pool.query(
        `
        SELECT
            id,
            product_code,
            product_name,
            category,
            unit,
            base_price
        FROM products
        ORDER BY id ASC
        `
    );

    return result.rows;
};

module.exports = {
    createProduct,
    getProducts
};