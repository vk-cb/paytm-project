const express = require('express');
const { userSignup, userSignin, addInWallet, transferMoney, getUserById, getProfile } = require('../controllers/userConroller');
const { userAuthMiddleware } = require('../middleware/userMiddleware');

const router = express.Router();

router.post('/signup', userSignup)
router.post('/signin', userSignin)
router.post('/add',userAuthMiddleware, addInWallet)
router.post('/transfer',userAuthMiddleware, transferMoney)
router.get('/user-details/:id',userAuthMiddleware, getUserById)
router.get('/get-profile',userAuthMiddleware, getProfile)

module.exports = router;