const express = require("express");
const router = express.Router();
const { isTeacher } = require("../middlewares/auth");

const {
  createAssessment,
  getAssessment,
  deleteAssessment,
} = require("../controllers/assessmentController");

router.post("/create", isTeacher, createAssessment);
router.get("/:question_id", isTeacher, getAssessment);
router.delete("/delete/:question_id", isTeacher, deleteAssessment);

module.exports = router;
