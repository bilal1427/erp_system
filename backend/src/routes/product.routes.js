const express = require("express");
const { createProduct, getProducts } = require("../controllers/product.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");
const { validateProduct } = require("../validators/product.validator");

const router = express.Router();

router.post(
    "/",
    authenticate,
    requireRole("ADMIN"),
    validate(validateProduct),
    createProduct
);

router.get(
    "/",
    authenticate,
    requireRole("ADMIN", "SALES_USER"),
    getProducts
);

module.exports = router;
