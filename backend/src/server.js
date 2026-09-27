const env = require("./config/env");
const app = require("./app");
const pool = require("./config/db");

const startServer = async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("Database connection successful");

        const server = app.listen(env.port, () => {
            console.log(`Server running on http://localhost:${env.port}`);
        });

        const shutdown = async (signal) => {
            console.log(`${signal} received. Shutting down gracefully...`);
            server.close(async () => {
                await pool.end();
                console.log("Database pool closed.");
                process.exit(0);
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();
