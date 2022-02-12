const express = require("express")
const router = express.Router()
const { isTeacher, isLogin } = require("../middlewares/auth");

const {
    createAssessment,
    getAllAssessment,
    getAssessment,
    updateAssessment,
    deleteAssessment,
    deleteAnswer,
    createAnswer
} = require("../controllers/assessmentController")

router.post("/post", isTeacher, createAssessment)
router.post("/post/:question_id", isTeacher, createAnswer)
router.delete("/post/:question_id", isTeacher, deleteAnswer)


router.get("/:question_id", isTeacher, getAssessment)
router.put("/update/:question_id", isTeacher, updateAssessment)
router.delete("/delete/:question_id", isTeacher, deleteAssessment)
router.get("/", getAllAssessment)


module.exports = router