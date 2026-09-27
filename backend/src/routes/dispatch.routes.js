const express = require("express");

const dispatchController = require("../controllers/dispatch.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// Authentication required
router.use(authenticate);

// Get all dispatches
router.get(
    "/",
    dispatchController.getDispatches
);

// Create dispatch - ADMIN only
router.post(
    "/:id",
    requireRole("ADMIN"),
    dispatchController.createDispatch
);

module.exports = router;