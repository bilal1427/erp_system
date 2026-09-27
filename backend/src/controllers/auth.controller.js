const { login } = require("../services/auth.service");

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const result = await login(email, password);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error) {
        if (error.message === "Invalid email or password") {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        next(error);
    }
};

module.exports = {
    loginController
};