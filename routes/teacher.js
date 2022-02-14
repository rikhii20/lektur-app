const express = require("express");
const {
  getTeacherDashboard,
  approvedCourse,
} = require("../controllers/teacherController");
const router = express.Router();
const { isTeacher } = require("../middlewares/auth");

router.put("/approved", isTeacher, approvedCourse);
router.get("/dashboard", isTeacher, getTeacherDashboard);

module.exports = router;
