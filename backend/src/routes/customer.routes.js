const express = require("express");
const {
    createCustomer,
    getCustomers
} = require("../controllers/customer.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");
const { validateCustomer } = require("../validators/customer.validator");

const router = express.Router();

router.post(
    "/",
    authenticate,
    requireRole("ADMIN", "SALES_USER"),
    validate(validateCustomer),
    createCustomer
);

router.get(
    "/",
    authenticate,
    requireRole("ADMIN", "SALES_USER"),
    getCustomers
);

module.exports = router;