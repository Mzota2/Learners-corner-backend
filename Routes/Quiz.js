const express  = require('express');
const router = express.Router();
const {createQuiz, getAllQuizzes, getQuiz, updateQuiz, deleteQuiz} = require('../Controllers/Quiz');

router.route('/quizzes').post(createQuiz).get(getAllQuizzes);
router.route('/quizzes/:id').put(updateQuiz).get(getQuiz).delete(deleteQuiz);

module.exports = router;