const express = require("express");
const {
  enrollCourse,
  getStudent,
  getPopupContent,
  getPopupMaterial,
} = require("../controllers/studentController");
const router = express.Router();
const { isTeacher, isLogin } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-files");

router.post("/enroll/:id", isLogin, enrollCourse);
router.get("/", isLogin, getStudent);
router.get("/popup/content/:id", isLogin, getPopupContent);
router.get("/popup/material/:id", isLogin, getPopupMaterial);

module.exports = router;
