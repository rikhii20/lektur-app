const express = require("express");
const { register, login, forgotPassword, resetPassword } = require("../controllers/user");
const { registerSchema, loginSchema, resetPasswordSchema } = require("../helpers/joi-schema");
const { validate } = require("../middlewares/validator");
const router = express.Router();


router.post("/register", validate(registerSchema) ,register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password",validate(resetPasswordSchema), resetPassword)

module.exports = router;