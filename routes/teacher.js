const express = require("express");
const { getTeacherDashboard } = require("../controllers/courseController");
const { approvedCourse } = require("../controllers/studentController");
const router = express.Router();
const { isTeacher } = require("../middlewares/auth");

router.put("/approved", isTeacher, approvedCourse);
router.get("/dashboard", isTeacher, getTeacherDashboard);

module.exports = router;
