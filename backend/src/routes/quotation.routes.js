const express = require("express");

const quotationController = require("../controllers/quotation.controller");
const salesOrderController = require("../controllers/salesOrder.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");
const { validateQuotation } = require("../validators/quotation.validator");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    requireRole("ADMIN", "SALES_USER"),
    validate(validateQuotation),
    quotationController.createQuotation
);

router.get(
    "/",
    quotationController.getQuotations
);

router.patch(
    "/:id/status",
    requireRole("ADMIN", "SALES_USER"),
    quotationController.updateQuotationStatus
);

router.post(
    "/:id/convert",
    requireRole("ADMIN", "SALES_USER"),
    salesOrderController.convertQuotation
);

module.exports = router;
