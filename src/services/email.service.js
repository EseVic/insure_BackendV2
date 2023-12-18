const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
require("dotenv").config();

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

// const transporter = nodemailer.createTransport(
//   {
//     service: "Hotmail",
//     auth: {
//       user: "insure97@outlook.com",
//       pass: "246@insure"
//     }
//   }
// );


// var transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "137074b02806a9",
//     pass: "59607538edfa92"
//   }
// });

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: process.env.EMAIL_FROM, to, subject, text};
  // console.log(msg)
 const trans =  await transport.sendMail(msg);
 console.log(trans)
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl =`https://insure-personal-git-alice-home-alice2212.vercel.app/Auth/resetpassword?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendAgentRegistrationEmail = async (to, companyName) => {
  const subject = 'Agent Onboarding';
  const resetPasswordUrl = `https://insure-personal-git-alice-home-alice2212.vercel.app/auth/agent/registration`;
  const text = `Dear user,
@ ${companyName} has requested to you to be an agent,  click on this link: ${resetPasswordUrl} 
to accept the request and make sure you use your registered email ${to}`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `https://insure-personal-git-alice-home-alice2212.vercel.app/auth/otp/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendAgentRegistrationEmail,
};
