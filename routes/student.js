const express = require("express");
const {
  enrollCourse,
  getStudent,
} = require("../controllers/studentController");
const router = express.Router();
const { isTeacher, isLogin } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-files");

router.post("/enroll/:id", isLogin, enrollCourse);
router.get("/", isLogin, getStudent);

module.exports = router;
