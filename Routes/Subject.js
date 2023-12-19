const express  = require('express');
const router = express.Router();
const {createSubject, getAllSubjects, getSubject, updateSubject, deleteSubject} = require('../Controllers/Subject');

router.route('/subjects').post(createSubject).get(getAllSubjects);
router.route('/subjects/:id').put(updateSubject).get(getSubject).delete(deleteSubject);

module.exports = router;