const customerService = require("../services/customer.service");

const createCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.createCustomer(req.body);

        return res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer
        });
    } catch (error) {
        next(error);
    }
};

const getCustomers = async (req, res, next) => {
    try {
        const customers = await customerService.getCustomers();

        return res.status(200).json({
            success: true,
            data: customers
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCustomer,
    getCustomers
};