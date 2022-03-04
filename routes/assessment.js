const express = require("express");
const router = express.Router();
const { isTeacher, isLogin } = require("../middlewares/auth");

const {
  createAssessment,
  getAssessment,
  deleteAssessment,
  updateQuestion,
  updateOption,
  getAssessmentKey,
} = require("../controllers/assessmentController");

router.post("/create", isTeacher, createAssessment);
router.get("/fetch", isLogin, getAssessment);
router.get("/fetch/key", isLogin, getAssessmentKey);
router.delete("/delete/:question_id", isTeacher, deleteAssessment);

router.put("/question/edit", isTeacher, updateQuestion);
router.put("/option/edit", isTeacher, updateOption);

module.exports = router;
