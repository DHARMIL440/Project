// In pages/api/sendEmail.js or app/api/sendEmail/route.js

import sendEmail from "@/utils/sendEmail";  // Assuming your sendEmail function is here

export async function POST(req, res) {
  try {
    const { email, subject, message } = await req.json();

    // Call the send email function with provided details
    await sendEmail(email, subject, message);

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error in sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
