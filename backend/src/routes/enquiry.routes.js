const express = require("express");
const {
    createEnquiry,
    getEnquiries
} = require("../controllers/enquiry.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    requireRole("ADMIN", "SALES_USER"),
    createEnquiry
);

router.get(
    "/",
    authenticate,
    requireRole("ADMIN", "SALES_USER"),
    getEnquiries
);

module.exports = router;