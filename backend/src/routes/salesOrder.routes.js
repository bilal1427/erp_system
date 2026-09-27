const express = require("express");

const salesOrderController = require("../controllers/salesOrder.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// Authentication required
router.use(authenticate);

// Get all Sales Orders
router.get(
    "/",
    salesOrderController.getSalesOrders
);

// Confirm Sales Order - ADMIN only
router.post(
    "/:id/confirm",
    requireRole("ADMIN"),
    salesOrderController.confirmSalesOrder
);

module.exports = router;