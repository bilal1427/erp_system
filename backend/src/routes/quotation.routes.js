const express = require("express");

const quotationController = require("../controllers/quotation.controller");
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

module.exports = router;