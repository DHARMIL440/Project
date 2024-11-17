import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.your-email-provider.com', // Example SMTP server
  port: 587,
  secure: false, // Set to true if using a secure connection
  auth: {
    user: 'your-email@example.com', // Your email
    pass: 'your-email-password',    // Your email password or app password
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'your-email@example.com',
      to,
      subject,
      text,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
