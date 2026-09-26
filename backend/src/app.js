const express = require("express");
const cors = require("cors");
const env = require("./config/env");

const app = express();

app.use(
    cors({
        origin: env.clientUrl
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ERP System API is running"
    });
});

module.exports = app;