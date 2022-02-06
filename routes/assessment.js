const express = require("express");
const router = express.Router();

const { createAssignment, getAssignment, getAllAssignment } = require("../controllers/assessment");


router.post('/', createAssignment);

router.get('/:questionId', getAssignment);

router.get('/', getAllAssignment);

module.exports = router;