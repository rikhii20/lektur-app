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
const upload = require("../middlewares/upload-image");

router.post("/", isTeacher, upload.single("image"), createCourse);
router.get("/", getAllCourses);
router.get("/:courseId", getCourse);
router.put("/:courseId", upload.single("image"), updateCourse);
router.delete("/:courseId", deleteCourse);

module.exports = router;
