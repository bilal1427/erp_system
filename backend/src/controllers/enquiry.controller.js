const enquiryService = require("../services/enquiry.service");

const createEnquiry = async (req, res, next) => {
    try {
        const enquiry = await enquiryService.createEnquiry({
            ...req.body,
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