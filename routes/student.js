const express = require("express");
const {
  enrollCourse,
  getProfile,
} = require("../controllers/studentController");
const router = express.Router();
const { isLogin } = require("../middlewares/auth");

router.post("/enroll", isLogin, enrollCourse);
router.get("/profile", isLogin, getProfile);

module.exports = router;
