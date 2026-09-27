const validate = (validator) => {
    return (req, res, next) => {
        try {
            const errors = validator(req);

            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    validate
};