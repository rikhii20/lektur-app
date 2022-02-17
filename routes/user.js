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
  fetchAccountInfo,
  deleteImage,
  changePassword,
  loginFacebook,
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
const { uploadCloud } = require("../middlewares/upload-files");
require("../helpers/passport");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.put("/edit", isLogin, validate(editProfileSchema), editProfile);
router.put("/upload", isLogin, uploadCloud("image", "image") ,uploadImage);
router.get("/profile", isLogin, fetchAccountInfo);
router.delete("/delete-image", isLogin, deleteImage);
router.put("/change-password", isLogin, changePassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  loginGoogle,
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
    session: false,
  }),
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  loginFacebook,
);

module.exports = router;
