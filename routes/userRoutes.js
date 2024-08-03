const express = require('express');
const { userSignup, userSignin, addInWallet, transferMoney, getUserById, getProfile, getAllUsers } = require('../controllers/userConroller');
const { userAuthMiddleware } = require('../middleware/userMiddleware');

const router = express.Router();

router.post('/signup', userSignup)
router.post('/signin', userSignin)
router.post('/add',userAuthMiddleware, addInWallet)
router.post('/transfer',userAuthMiddleware, transferMoney)
router.get('/user-details/:id',userAuthMiddleware, getUserById)
router.get('/get-profile',userAuthMiddleware, getProfile)
router.get('/get-all-users',userAuthMiddleware, getAllUsers)

module.exports = router;