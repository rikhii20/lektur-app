const express = require("express");
const router = express.Router();
const { isTeacher, isLogin } = require("../middlewares/auth");

const {
  createAssessment,
  getAssessment,
  deleteAssessment,
} = require("../controllers/assessmentController");

const { updateQuestion } = require("../controllers/questionController");
const { updateOption } = require("../controllers/optionController");

router.post("/create", isTeacher, createAssessment);
router.get("/fetch", isLogin, getAssessment);
router.delete("/delete/:question_id", isTeacher, deleteAssessment);

router.put("/question/edit", isTeacher, updateQuestion);
router.put("/option/edit", isTeacher, updateOption);

module.exports = router;