const dispatchService = require("../services/dispatch.service");


// ======================================================
// CREATE DISPATCH
// ======================================================

const createDispatch = async (req, res, next) => {

    try {

        const body = req.body || {};
        const dispatch =
            await dispatchService.createDispatch({
                salesOrderId: body.salesOrderId ?? body.sales_order_id ?? req.params.id,
                vehicleNumber: body.vehicleNumber ?? body.vehicle_number,
                driverName: body.driverName ?? body.driver_name,
                createdBy: req.user.userId
            });

        return res.status(201).json({
            success: true,
            message: "Sales Order dispatched successfully",
            data: dispatch
        });

    } catch (error) {

        next(error);

    }
};


// ======================================================
// GET DISPATCHES
// ======================================================

const getDispatches = async (req, res, next) => {

    try {

        const dispatches =
            await dispatchService.getDispatches();

        return res.status(200).json({
            success: true,
            data: dispatches
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    createDispatch,
    getDispatches
};
