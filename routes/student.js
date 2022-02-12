const express = require("express");
const {
  getPopupContent,
  getPopupMaterial,
} = require("../controllers/courseController");
const {
  createStudentProgress,
  getStudentProgress,
} = require("../controllers/studentContentController");
const {
  enrollCourse,
  approvedCourse,
  getStudentDashboard,
} = require("../controllers/studentController");
const router = express.Router();
const { isLogin, isTeacher } = require("../middlewares/auth");

router.post("/enroll", isLogin, enrollCourse);
router.post("/content/unlocked/create", isLogin, createStudentProgress);
router.get("/popup/content", isLogin, getPopupContent);
router.get("/popup/material", isLogin, getPopupMaterial);
router.get("/dashboard", isLogin, getStudentDashboard);
router.get("/content/unlocked/fetch", isLogin, getStudentProgress);
router.put("/approved", isTeacher, approvedCourse);

module.exports = router;
