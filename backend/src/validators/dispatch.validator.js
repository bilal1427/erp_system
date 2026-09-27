const validateDispatch = (req) => {
    const body = req.body || {};
    const salesOrderId = body.salesOrderId ?? body.sales_order_id;
    const errors = [];
    if (!Number.isInteger(Number(salesOrderId)) || Number(salesOrderId) <= 0) {
        errors.push("A valid sales order is required");
    }
    if (typeof (body.vehicleNumber ?? body.vehicle_number) !== "string" ||
        !(body.vehicleNumber ?? body.vehicle_number).trim()) {
        errors.push("Vehicle number is required");
    }
    if (typeof (body.driverName ?? body.driver_name) !== "string" ||
        !(body.driverName ?? body.driver_name).trim()) {
        errors.push("Driver name is required");
    }
    return errors;
};

module.exports = { validateDispatch };
