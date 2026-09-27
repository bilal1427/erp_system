const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");

const app = express();

app.use(
    cors({
        origin: env.clientUrl
    })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ERP System API is running"
    });
});

module.exports = app;