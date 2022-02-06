const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { isTeacher } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-image");

router.post("/", isTeacher, uploadCloud("image"), createCourse);
router.get("/", getAllCourses);
router.get("/:courseId", getCourse);
router.put("/:courseId", uploadCloud("image"), updateCourse);
router.delete("/:courseId", deleteCourse);

module.exports = router;
