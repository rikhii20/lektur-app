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
const { uploadCloud } = require("../middlewares/upload-files");

router.post("/", isTeacher, uploadCloud("image", "image"), createCourse);
router.get("/", getAllCourses);
router.get("/:courseId", getCourse);
router.put("/:courseId", isTeacher, uploadCloud("image", "image"), updateCourse);
router.delete("/:courseId", deleteCourse);

module.exports = router;
