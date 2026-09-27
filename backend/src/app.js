const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const enquiryRoutes = require("./routes/enquiry.routes");


const app = express();

app.use(
    cors({
        origin: env.clientUrl
    })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ERP System API is running"
    });
});

module.exports = app;