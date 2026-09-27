const validateInventoryUpdate = (req) => {
    const body = req.body || {};
    const errors = [];

    const physical = Number(body.physicalQuantity ?? body.physical_quantity);
    if (!Number.isInteger(physical) || physical < 0) {
        errors.push("Physical quantity must be a non-negative integer");
    }

    return errors;
};

module.exports = { validateInventoryUpdate };
