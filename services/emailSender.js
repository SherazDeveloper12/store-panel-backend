const axios = require('axios');

exports.sendOtpEmail = async (toEmail, otp) => {
  return axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: {
        email: process.env.BREVO_FROM_EMAIL,
        name: process.env.BREVO_FROM_NAME
      },
      to: [{ email: toEmail }],
      subject: 'Your verification code',
      htmlContent: `
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
      `,
      textContent: `Your OTP is ${otp}. It expires in 5 minutes.`
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