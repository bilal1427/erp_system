const pool = require("../config/db");

const getInventory = async () => {
    const result = await pool.query(
        `
        SELECT
            i.id,
            p.id AS product_id,
            p.product_code,
            p.product_name,
            p.category,
            p.unit,
            i.physical_quantity,
            i.reserved_quantity,
            (i.physical_quantity - i.reserved_quantity) AS available_quantity
        FROM inventory i
        JOIN products p
            ON p.id = i.product_id
        ORDER BY p.id ASC
        `
    );

    return result.rows;
};

module.exports = {
    getInventory
};