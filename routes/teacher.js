const express = require("express");
const {
  approvedCourse,
  getTeacherCourses,
  getStudents,
} = require("../controllers/teacherController");
const router = express.Router();
const { isTeacher } = require("../middlewares/auth");

router.put("/approved", isTeacher, approvedCourse);
router.get("/dashboard", isTeacher, getTeacherCourses);
router.get("/course/students", isTeacher, getStudents);

module.exports = router;
