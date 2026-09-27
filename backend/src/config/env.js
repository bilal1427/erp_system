require("dotenv").config();

const env = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",

    database: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    },

    clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};

const requiredVariables = [
    "DB_HOST",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "JWT_SECRET"
];

for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}

module.exports = env;