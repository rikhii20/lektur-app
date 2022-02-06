const express = require("express")
const { addQuestion, getQuestions } = require("../controllers/question")
const router = express.Router()

router.post("/", addQuestion)
router.get("/", getQuestions)
module.exports = router