const express = require('express');
const { register, login, getProfile, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect,  getProfile);
router.post('/google', googleLogin);



module.exports = router;