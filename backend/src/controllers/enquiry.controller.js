const enquiryService = require("../services/enquiry.service");

const createEnquiry = async (req, res, next) => {
    try {
        const body = req.body || {};
        const enquiry = await enquiryService.createEnquiry({
            ...body,
            customerId: body.customerId ?? body.customer_id,
            enquiryDate: body.enquiryDate ?? body.enquiry_date,
            requiredDate: body.requiredDate ?? body.required_date,
            products: body.products ?? body.items,
            createdBy: req.user.userId
        });

        return res.status(201).json({
            success: true,
            message: "Enquiry created successfully",
            data: enquiry
        });
    } catch (error) {
        next(error);
    }
};

const getEnquiries = async (req, res, next) => {
    try {
        const enquiries = await enquiryService.getEnquiries();

        return res.status(200).json({
            success: true,
            data: enquiries
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEnquiry,
    getEnquiries
};
