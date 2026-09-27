const express = require("express");
const { loginController } = require("../controllers/auth.controller");
const { validate } = require("../middleware/validate.middleware");
const { validateLogin } = require("../validators/auth.validator");

const router = express.Router();

router.post("/login", validate(validateLogin), loginController);

module.exports = router;
