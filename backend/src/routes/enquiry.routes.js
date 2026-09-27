const express = require("express");
const {
    createEnquiry,
    getEnquiries
} = require("../controllers/enquiry.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");
const { validateEnquiry } = require("../validators/enquiry.validator");

const router = express.Router();

router.post(
    "/",
    authenticate,
    requireRole("ADMIN", "SALES_USER"),
    validate(validateEnquiry),
    createEnquiry
);

router.get(
    "/",
    authenticate,
    requireRole("ADMIN", "SALES_USER"),
    getEnquiries
);

module.exports = router;
