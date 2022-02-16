const express = require("express");
const {
  approvedCourse,
  getTeacherCourses,
} = require("../controllers/teacherController");
const router = express.Router();
const { isTeacher } = require("../middlewares/auth");

router.put("/approved", isTeacher, approvedCourse);
router.get("/dashboard", isTeacher, getTeacherCourses);

module.exports = router;
