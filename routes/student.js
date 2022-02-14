const express = require("express");
const {
  enrollCourse,
  createStudentProgress,
  getPopupContent,
  getPopupMaterial,
  getStudentProgress,
  getStudentCourses,
} = require("../controllers/studentController");
const router = express.Router();
const { isLogin, isTeacher } = require("../middlewares/auth");

router.post("/enroll", isLogin, enrollCourse);
router.post("/content/unlocked/create", isLogin, createStudentProgress);
router.get("/popup/content", isLogin, getPopupContent);
router.get("/popup/material", isLogin, getPopupMaterial);
router.get("/dashboard", isLogin, getStudentCourses);
router.get("/content/unlocked/fetch", isLogin, getStudentProgress);

module.exports = router;
