const salesOrderService = require("../services/salesOrder.service");


// ======================================================
// CONVERT QUOTATION → SALES ORDER
// ======================================================

const convertQuotation = async (req, res, next) => {

    try {

        const salesOrder =
            await salesOrderService.convertQuotationToSalesOrder({
                quotationId: req.params.id,
                createdBy: req.user.userId
            });

        return res.status(201).json({
            success: true,
            message: "Quotation converted to Sales Order successfully",
            data: salesOrder
        });

    } catch (error) {

        next(error);

    }
};


// ======================================================
// GET SALES ORDERS
// ======================================================

const getSalesOrders = async (req, res, next) => {

    try {

        const salesOrders =
            await salesOrderService.getSalesOrders();

        return res.status(200).json({
            success: true,
            data: salesOrders
        });

    } catch (error) {

        next(error);

    }
};


// ======================================================
// CONFIRM SALES ORDER
// ======================================================

const confirmSalesOrder = async (req, res, next) => {

    try {

        const salesOrder =
            await salesOrderService.confirmSalesOrder({
                salesOrderId: req.params.id
            });

        return res.status(200).json({
            success: true,
            message: "Sales Order confirmed and inventory reserved successfully",
            data: salesOrder
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    convertQuotation,
    getSalesOrders,
    confirmSalesOrder
};