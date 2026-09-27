const pool = require("../config/db");

const createCustomer = async ({
    companyName,
    contactPerson,
    mobile,
    email,
    city
}) => {
    const result = await pool.query(
        `
        INSERT INTO customers
            (company_name, contact_person, mobile, email, city)
        VALUES
            ($1, $2, $3, $4, $5)
        RETURNING id, company_name, contact_person, mobile, email, city, created_at
        `,
        [companyName, contactPerson, mobile, email, city]
    );

    return result.rows[0];
};

const getCustomers = async () => {
    const result = await pool.query(
        `
        SELECT
            id,
            company_name,
            contact_person,
            mobile,
            email,
            city,
            created_at
        FROM customers
        ORDER BY id DESC
        `
    );

    return result.rows;
};

module.exports = {
    createCustomer,
    getCustomers
};