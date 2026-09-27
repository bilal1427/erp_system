const express = require("express");
const dispatchController = require("../controllers/dispatch.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");
const { validateDispatch } = require("../validators/dispatch.validator");

const router = express.Router();

router.use(authenticate);

router.get("/", dispatchController.getDispatches);

router.post(
    "/",
    requireRole("ADMIN"),
    validate(validateDispatch),
    dispatchController.createDispatch
);

module.exports = router;
