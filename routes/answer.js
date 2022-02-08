const express = require("express");
const router = express.Router();

const {
    addAnswer, getAnswer
} = require("../controllers/answer");

router.post('/', addAnswer);
router.get('/', getAnswer);

module.exports = router;