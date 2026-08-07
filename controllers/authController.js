const authModel = require('../models/authmodel');

const Otp = require('../models/otpmodel');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { sendOtpEmail } = require('../services/emailSender');
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
    console.log("registering a user", req.body);
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


    const newUser = new authModel({ userName, password, email, storeName, isAuthenticated: false, });
    newUser.storeID = newUser._id.toString(); // Generate storeID from last 6 characters of _id
    console.log("new user", newUser);
    await newUser.save();
    res.status(200).json({ status: 'success', message: 'User registered successfully. Please verify your email.', user: { _id: newUser._id, userName: newUser.userName, email: newUser.email, storeName: newUser.storeName, storeID: newUser.storeID }, });

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

    const user = await authModel.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found`);
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
    console.log(`Generated OTP for user ${user.email}: ${otp}`);
    const subject = 'Your verification code';
    const message = `
        <div style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial, Helvetica, sans-serif;">
          <div style="max-width:580px;margin:24px auto;padding:0 8px;">
            <div style="background:#ffffff;border:1px solid #d9d9d9;border-radius:14px;overflow:hidden;box-shadow:0 3px 12px rgba(0,0,0,0.14);">
              <div style="background:#e60000;padding:34px 24px;text-align:center;">
                <div style="color:#ffffff;font-size:30px;line-height:1.2;font-weight:700;">Store Pannel</div>
              </div>
              <div style="padding:56px 28px 36px;text-align:center;color:#111111;">
                <p style="margin:0 0 14px;font-size:20px;line-height:1.6;">
                  We Welcome you to our Store Pannel! Your one time password is given below
                </p>
                <div style="margin:0 0 16px;color:#e60000;font-size:28px;line-height:1.2;font-weight:700;letter-spacing:2px;">
                  ${otp}
                </div>
                <p style="margin:0 0 12px;font-size:18px;line-height:1.6;">
                  This code will expire in 05 minutes.
                </p>
                <p style="margin:0;font-size:18px;line-height:1.6;">
                  Please don't share this code with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    await sendOtpEmail(email, otp, subject, message)

    return res.status(200).json({ success: true, message: 'OTP sent to your email' });

  } catch (error) {
    console.error('sendOtp error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await authModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const existingOtp = await Otp.findOne({ userId: user._id, otp });
    if (!existingOtp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or OTP has been Expired' });
    }
    // Check if OTP is expired
    
    const MAX_ATTEMPTS = 5;
    const existingOtpWithAttempts = await Otp.findOne({ userId: user._id, otp });
    if (existingOtpWithAttempts.attempts >= MAX_ATTEMPTS) {
      await Otp.deleteOne({ userId: user._id, otp });
      return res.status(400).json({ success: false, message: 'Maximum OTP verification attempts exceeded. Request a new OTP.' });
    }
    if (existingOtpWithAttempts.otp !== otp) {
      existingOtpWithAttempts.attempts += 1;
      await existingOtpWithAttempts.save();
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    // Mark user as verified
    await authModel.findByIdAndUpdate(user._id, { isAuthenticated: true });
    // Delete the used OTP
    await Otp.deleteOne({ userId: user._id, otp });
    const Verfieduser = await authModel.findById(user._id);
    const JWTToken = jwt.sign({ _id: Verfieduser._id, email: Verfieduser.email, role: Verfieduser.role, storeName: Verfieduser.storeName, storeID: Verfieduser.storeID }, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, message: 'OTP verified successfully', user: Verfieduser, token: JWTToken, isAuthenticated: Verfieduser.isAuthenticated });
  } catch (error) {
    console.error('verifyOtp error:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
}
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
    const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET,);
    res.status(200).json({ status: 'success', message: 'Login successful', user: { _id: user._id, username: user.username, email: user.email }, token });
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
  verifyOtp,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers
};