const quotationService = require("../services/quotation.service");

const createQuotation = async (req, res, next) => {
    try {
        const quotation =
            await quotationService.createQuotation({
                ...req.body,
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
                status: req.body.status
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