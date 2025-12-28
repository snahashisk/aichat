import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';


export const sendEmail = async({email, emailType, userId}:any) => {
  try {
      //configure mail for usage
      const hashedVerifyToken = await bcrypt.hash(userId.toString(), 10);
      const hashedResetToken = await bcrypt.hash(userId.toString(), 5);

      if (emailType === 'VERIFY') {
        await User.findByIdAndUpdate(userId, { $set: {verifyToken: hashedVerifyToken, verifyTokenExpiry: Date.now() + 3600000}})
      }else if (emailType === 'RESET') {
        await User.findByIdAndUpdate(userId, { $set: {forgotPasswordToken: hashedResetToken, forgotPasswordTokenExpiry: Date.now() + 3600000}})
      }

    // Looking to send emails in production? Check out our Email API/SMTP product!
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASSWORD
        }
});

    const mailOptions = {
    from: process.env.MAIL_ID,
    to: email,
    subject: emailType === 'VERIFY' ? "Verify Your Email!!!" : "Reset Your Password!!!",
    html: `<p>
    Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedVerifyToken}">Here</a> ${emailType === 'VERIFY' ? "verify your email" : "reset your password"} 
    or copy and paste the link below in your browser.
    <br> ${process.env.DOMAIN}/verifyemail?token=${hashedVerifyToken}
    </p>`,
    }
    const mailResponse = await transporter.sendMail(mailOptions)
    return mailResponse;
  } catch (error:any) {
    throw new Error(error.message)
  }
}