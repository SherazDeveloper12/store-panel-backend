const axios = require('axios');

exports.sendOtpEmail = async (toEmail, otp, subject, message) => {
  return axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: {
        email: process.env.BREVO_FROM_EMAIL,
        name: process.env.BREVO_FROM_NAME
      },
      to: [{ email: toEmail }],
      subject: subject,
      htmlContent: message,
      // textContent: `Your OTP is ${otp}. It expires in 5 minutes.`
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );
};