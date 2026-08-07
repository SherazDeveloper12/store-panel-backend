const express = require('express');
const authRouter = express.Router();
const verifyToken = require('../middlewares/verifytoken');
const { registerUser, loginUser, getUserProfile, updateUserProfile , getAllUsers, sendOtp, verifyOtp} = require('../controllers/authController');
// Route to register a new user
authRouter.post('/register', registerUser);
// Route to send an OTP for verification
authRouter.post('/sendOtp', sendOtp )
//  Route to verify the OTP
authRouter.post('/verifyOtp', verifyOtp )
// Route to login a user
authRouter.post('/login', loginUser);
// Route to get user profile
authRouter.get('/profile', verifyToken, getUserProfile);
// Route to update user profile
authRouter.put('/update/:id', verifyToken, updateUserProfile);
// Route to get all users (admin only)
authRouter.get('/users', verifyToken, getAllUsers); 
module.exports = authRouter;