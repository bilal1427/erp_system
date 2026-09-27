const pool = require("../config/db");
const { comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

const login = async (email, password) => {
    const result = await pool.query(
        `
        SELECT id, name, email, password_hash, role
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    const passwordValid = await comparePassword(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken({
        id: user.id,
        userId: user.id,
        email: user.email,
        role: user.role
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = {
    login
};
