const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const enquiryRoutes = require("./routes/enquiry.routes");
const quotationRoutes = require("./routes/quotation.routes");
const salesOrderRoutes = require("./routes/salesOrder.routes");
const dispatchRoutes = require("./routes/dispatch.routes");
const { errorMiddleware } = require("./middleware/error.middleware");

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
    cors({
        origin: env.clientUrl,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Request logging
if (env.nodeEnv !== "test") {
    app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
}

// Body parsing with size limit
app.use(express.json({ limit: "10kb" }));

// Auth rate limiter — stricter for login
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." }
});

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." }
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/customers", apiLimiter, customerRoutes);
app.use("/api/products", apiLimiter, productRoutes);
app.use("/api/inventory", apiLimiter, inventoryRoutes);
app.use("/api/enquiries", apiLimiter, enquiryRoutes);
app.use("/api/quotations", apiLimiter, quotationRoutes);
app.use("/api/sales-orders", apiLimiter, salesOrderRoutes);
app.use("/api/dispatches", apiLimiter, dispatchRoutes);

app.get("/", (req, res) => {
    res.json({ success: true, message: "ERP System API is running" });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

module.exports = app;
