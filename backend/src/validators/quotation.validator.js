const isPositiveInteger = (value) =>
    Number.isInteger(Number(value)) && Number(value) > 0;

const validateQuotation = (req) => {
    const body = req.body || {};
    const enquiryId = body.enquiryId ?? body.enquiry_id;
    const items = body.products ?? body.items;
    const errors = [];
    if (!isPositiveInteger(enquiryId)) errors.push("A valid enquiry is required");
    if (!Array.isArray(items) || items.length === 0) {
        errors.push("At least one quotation item is required");
        return errors;
    }
    const productIds = [];
    items.forEach((item, index) => {
        const productId = item?.productId ?? item?.product_id;
        const quantity = item?.quantity;
        const unitPrice = item?.unitPrice ?? item?.unit_price;
        const discount = item?.discountPercent ?? item?.discount_percent ?? 0;
        const gst = item?.gstPercent ?? item?.gst_percent ?? 18;
        if (!isPositiveInteger(productId)) errors.push(`Item ${index + 1} must have a valid product`);
        else productIds.push(Number(productId));
        if (!isPositiveInteger(quantity)) errors.push(`Item ${index + 1} quantity must be a positive whole number`);
        if (unitPrice !== undefined && (String(unitPrice).trim() === "" || !Number.isFinite(Number(unitPrice)) || Number(unitPrice) < 0)) {
            errors.push(`Item ${index + 1} price must be zero or greater`);
        }
        if (!Number.isFinite(Number(discount)) || Number(discount) < 0 || Number(discount) > 100) {
            errors.push(`Item ${index + 1} discount must be between 0 and 100`);
        }
        if (!Number.isFinite(Number(gst)) || Number(gst) < 0 || Number(gst) > 100) {
            errors.push(`Item ${index + 1} GST must be between 0 and 100`);
        }
    });
    if (new Set(productIds).size !== productIds.length) errors.push("A product can only be added once");
    return errors;
};

module.exports = { validateQuotation };
