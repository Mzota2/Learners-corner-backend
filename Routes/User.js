const {signIn, signUp, getUser, updateUser, logOut,deleteUser, getAllUsers, validateAccount} = require('../Controllers/User');
const {verifyAccessToken} = require('../Auth/Auth');

const express = require('express');
const router = express.Router();

router.route('/user/signin').post(signIn);
router.route('/user/signup').post(signUp);
router.route('/user/signout').get(logOut);
router.route('/users').get(getAllUsers);
router.route('/user/confirm/:token').get(validateAccount);
router.route('/user').get(verifyAccessToken, getUser);
router.route('/user/:id').put(updateUser).delete(verifyAccessToken, deleteUser);

module.exports = router;
