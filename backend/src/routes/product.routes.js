const express = require("express");
const {
    createProduct,
    getProducts
} = require("../controllers/product.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    requireRole("ADMIN"),
    createProduct
);

router.get(
    "/",
    authenticate,
    requireRole("ADMIN", "SALES_USER"),
    getProducts
);

module.exports = router;