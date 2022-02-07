const express = require("express");
const { register, login } = require("../controllers/userController");
const { registerSchema, loginSchema } = require("../helpers/joi-schema");
const { validate } = require("../middlewares/validator");
const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
