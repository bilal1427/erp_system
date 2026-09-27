const dispatchService = require("../services/dispatch.service");


// ======================================================
// CREATE DISPATCH
// ======================================================

const createDispatch = async (req, res, next) => {

    try {

        const dispatch =
            await dispatchService.createDispatch({
                salesOrderId: req.params.id,
                vehicleNumber: req.body.vehicleNumber,
                driverName: req.body.driverName,
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