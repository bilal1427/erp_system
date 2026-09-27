const express = require("express");
const { getInventory } = require("../controllers/inventory.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

router.get(
    "/",
    authenticate,
    requireRole("ADMIN", "SALES_USER"),
    getInventory
);

module.exports = router;