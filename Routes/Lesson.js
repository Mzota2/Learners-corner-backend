const express  = require('express');
const router = express.Router();
const {createLesson, getAllLessons, getLesson, updateLesson, deleteLesson} = require('../Controllers/Lesson');

router.route('/lessons').post(createLesson).get(getAllLessons);
router.route('/lessons/:id').put(updateLesson).get(getLesson).delete(deleteLesson);

module.exports = router;