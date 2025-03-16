// emailService.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.trustygroup.co',
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to send email
export const sendEmail = async ({ fromName, fromEmail, to, subject, message }) => {
  const mailOptions = {
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html: message // Send HTML content
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
