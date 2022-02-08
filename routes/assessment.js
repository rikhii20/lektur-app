const express = require("express");
const router = express.Router();

const {
	createAssessment, getAllAssessment, getAssessment, updateAssessment, deleteAssessment,
} = require("../controllers/assessment");


router.post('/', createAssessment);
router.get('/:id', getAssessment);
router.put('/:id', updateAssessment);
router.delete('/:id', deleteAssessment);

router.get('/', getAllAssessment);

module.exports = router;