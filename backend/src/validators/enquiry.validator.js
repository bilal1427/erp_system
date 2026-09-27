const isPositiveInteger = (value) =>
    Number.isInteger(Number(value)) && Number(value) > 0;

const validateEnquiry = (req) => {
    const body = req.body || {};
    const customerId = body.customerId ?? body.customer_id;
    const enquiryDate = body.enquiryDate ?? body.enquiry_date;
    const requiredDate = body.requiredDate ?? body.required_date;
    const products = body.products ?? body.items;
    const errors = [];

    if (!isPositiveInteger(customerId)) {
        errors.push("A valid customer is required");
    }
    if (enquiryDate && Number.isNaN(Date.parse(enquiryDate))) {
        errors.push("Enquiry date must be a valid date");
    }
    if (requiredDate && Number.isNaN(Date.parse(requiredDate))) {
        errors.push("Required date must be a valid date");
    }
    if (enquiryDate && requiredDate && requiredDate < enquiryDate) {
        errors.push("Required date cannot be before enquiry date");
    }
    if (!Array.isArray(products) || products.length === 0) {
        errors.push("At least one product is required");
    } else {
        const productIds = [];
        products.forEach((item, index) => {
            const productId = item?.productId ?? item?.product_id;
            const quantity = item?.quantity;
            if (!isPositiveInteger(productId)) {
                errors.push(`Product ${index + 1} must be valid`);
            } else {
                productIds.push(Number(productId));
            }
            if (!isPositiveInteger(quantity)) {
                errors.push(`Product ${index + 1} quantity must be a positive whole number`);
            }
        });
        if (new Set(productIds).size !== productIds.length) {
            errors.push("A product can only be added once");
        }
    }

    return errors;
};

module.exports = { validateEnquiry };
