const authModel = require('../models/authmodel');
const mongoose = require('mongoose');
const crypto = require('crypto');

var jwt = require('jsonwebtoken');
 const RESEND_COOLDOWN_SECONDS = 60;
const getAllUsers = async (req, res) => {
    try {
        const users = await authModel.find({});
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}
const registerUser = async (req, res) => {
    try {
        console.log("registering a user",req.body);
        const { userName, storeName, password, email } = req.body;
        const users = await authModel.find();
        const existingUser = users.find(user => user.email === email);
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already in use',
                error: 'Regisertation Failed: Error registering user with this email'
            }
            );
        }
       
      
        const newUser = new authModel({ userName, password, email, storeName, isAuthenticated: false,  });
        newUser.storeID =  newUser._id.toString(); // Generate storeID from last 6 characters of _id
       console.log("new user",newUser);
        await newUser.save();
        res.status(200).json({ status: 'success', message: 'User registered successfully. Please verify your email.', user: { _id: newUser._id, userName: newUser.userName, email: newUser.email },  });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error registering user', error: error.message });

    }
}
const sendOtp = async (req, res) => {
   
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isAuthenticated) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }

    // Check cooldown — prevent spamming resend
    const existingOtp = await Otp.findOne({ userId: user._id }).sort({ createdAt: -1 });
    if (existingOtp) {
      const secondsSinceLastSend = (Date.now() - existingOtp.lastSentAt) / 1000;
      if (secondsSinceLastSend < RESEND_COOLDOWN_SECONDS) {
        const waitTime = Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSinceLastSend);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitTime}s before requesting another OTP`
        });
      }
      // Delete old OTP so only one valid OTP exists at a time
      await Otp.deleteMany({ userId: user._id });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    await Otp.create({
      userId: user._id,
      otp,
      lastSentAt: new Date()
    });

    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Your verification code',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
    });

    return res.status(200).json({ success: true, message: 'OTP sent to your email' });

  } catch (error) {
    console.error('sendOtp error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await authModel.find();
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'user not found' });
        }
        if (user.password !== password) {
            return res.status(401).json({ status: 'error', message: 'Wrong password' });
        }
        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, );
        res.status(200).json({ status: 'success', message: 'Login successful', user: { _id: user._id, username: user.username, email: user.email } , token});
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error logging in', error: error.message });
    }
}
const getUserProfile = async (req, res) => {
    try {
        token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const user = await authModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
    
        res.status(200).json({ status: 'success', user });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching user profile', error: error.message });
    }
}
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const userToBeUpdate = await authModel.findById(userId);
        if (!userToBeUpdate) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        const updatingUser = await userToBeUpdate.set(updates);
        const updatedUser = await updatingUser.save();
        console.log("Updated User:", updatedUser);
        res.status(200).json({ status: 'success', message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error updating user profile', error: error.message });
    }
}

module.exports = {
    registerUser,
    sendOtp,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers
};