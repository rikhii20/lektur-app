const express = require('express')
const router = express.Router()
const { createCourse, getAllCourses, getCourse, updateCourse, deleteCourse} = require('../controllers/courseController')
const upload = require('../middlewares/upload-image')

router.post('/', upload.single('image'), createCourse)
router.get('/', getAllCourses)
router.get('/:courseId', getCourse)
router.put('/:courseId', upload.single('image'), updateCourse)
router.delete('/:courseId', deleteCourse)

module.exports = router