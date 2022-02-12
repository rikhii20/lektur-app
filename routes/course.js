const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { isTeacher, isLogin } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-files");

router.post("/create", isTeacher, uploadCloud("image", "image"), createCourse);
router.get("/fetch", getAllCourses);
router.get("/fetch/:courseId", getCourse);
router.put(
  "/edit/:courseId",
  isTeacher,
  uploadCloud("image", "image"),
  updateCourse,
);
router.delete("/delete/:courseId", isTeacher, deleteCourse);

module.exports = router;
