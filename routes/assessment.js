const express = require("express");
const router = express.Router();
const { isTeacher, isLogin } = require("../middlewares/auth");

const {
  createAssessment,
  getAssessment,
  deleteAssessment,
} = require("../controllers/assessmentController");

router.post("/create", isTeacher, createAssessment);
router.get("/fetch", isLogin, getAssessment);
router.delete("/delete/:question_id", isTeacher, deleteAssessment);

module.exports = router;
