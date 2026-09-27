const quotationService = require("../services/quotation.service");

const createQuotation = async (req, res, next) => {
    try {
        const body = req.body || {};
        const quotation =
            await quotationService.createQuotation({
                enquiryId: body.enquiryId ?? body.enquiry_id,
                validUntil: body.validUntil ?? body.valid_until,
                products: (body.products ?? body.items ?? []).map((item) => ({
                    productId: item.productId ?? item.product_id,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice ?? item.unit_price,
                    discountPercent: item.discountPercent ?? item.discount_percent,
                    gstPercent: item.gstPercent ?? item.gst_percent
                })),
                createdBy: req.user.userId
            });

        return res.status(201).json({
            success: true,
            message: "Quotation created successfully",
            data: quotation
        });

    } catch (error) {
        next(error);
    }
};


const getQuotations = async (req, res, next) => {
    try {
        const quotations =
            await quotationService.getQuotations();

        return res.status(200).json({
            success: true,
            data: quotations
        });

    } catch (error) {
        next(error);
    }
};


const updateQuotationStatus = async (req, res, next) => {
    try {
        const quotation =
            await quotationService.updateQuotationStatus({
                quotationId: req.params.id,
                status: req.body?.status
            });

        return res.status(200).json({
            success: true,
            message: "Quotation status updated successfully",
            data: quotation
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createQuotation,
    getQuotations,
    updateQuotationStatus
};
