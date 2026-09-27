const validateLogin = (req) => {
    const body = req.body || {};
    const errors = [];

    if (typeof body.email !== "string" || !body.email.trim()) {
        errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
        errors.push("Email must be valid");
    }

    if (typeof body.password !== "string" || !body.password) {
        errors.push("Password is required");
    }

    return errors;
};

module.exports = { validateLogin };
