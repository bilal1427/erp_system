const validateProduct = (req) => {
    const body = req.body || {};
    const errors = [];

    if (typeof body.productCode !== "string" || !body.productCode.trim()) {
        errors.push("Product code is required");
    }

    if (typeof body.productName !== "string" || !body.productName.trim()) {
        errors.push("Product name is required");
    }

    if (typeof body.category !== "string" || !body.category.trim()) {
        errors.push("Category is required");
    }

    if (typeof body.unit !== "string" || !body.unit.trim()) {
        errors.push("Unit is required");
    }

    const price = Number(body.basePrice);
    if (!Number.isFinite(price) || price < 0) {
        errors.push("Base price must be zero or greater");
    }

    return errors;
};

module.exports = { validateProduct };
