const express = require("express");
const router = express.Router();

const {
  register,
  login,
  resetPassword,
  editProfile,
  uploadImage,
  forgotPassword,
  loginGoogle,
} = require("../controllers/userController");
const {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  editProfileSchema,
} = require("../helpers/joi-schema");
const { validate } = require("../middlewares/validator");
const { isLogin } = require("../middlewares/auth");

const passport = require("passport");
require("../helpers/passport");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/profile", isLogin, validate(editProfileSchema), editProfile);
router.put("/upload", isLogin, uploadImage);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  loginGoogle
);

module.exports = router;
