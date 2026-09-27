const express = require("express");

const quotationController = require("../controllers/quotation.controller");
const salesOrderController = require("../controllers/salesOrder.controller");

const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    quotationController.createQuotation
);

router.get(
    "/",
    quotationController.getQuotations
);

router.patch(
    "/:id/status",
    quotationController.updateQuotationStatus
);

router.post(
    "/:id/convert",
    salesOrderController.convertQuotation
);

module.exports = router;