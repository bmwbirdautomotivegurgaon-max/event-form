import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set JSON content type
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, pax, contact, email } = req.body;

  console.log('--- API: Send Email Triggered ---');
  console.log('Request Body:', { name, pax, contact, email });
  console.log('Env Check:', {
    hasUser: !!process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS
  });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('CRITICAL: Missing environment variables for email.');
    return res.status(500).json({ message: 'Server configuration error: Missing credentials.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Send email to the organizer
    const info = await transporter.sendMail({
      from: `"BMW RSVP Portal" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: `New RSVP: Dhurandhar Premiere - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #C5A059;">New Registration</h2>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Guests:</strong> ${pax}</p>
          <p><strong>Contact:</strong> ${contact}</p>
          <p><strong>Email:</strong> ${email}</p>
          <br />
          <p style="font-size: 12px; color: #888;">Sent from BMW Bird Automotive RSVP App</p>
        </div>
      `,
    });

    console.log('Email sent successfully:', info.messageId);
    return res.status(200).json({ message: 'Email sent successfully', id: info.messageId });
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ message: 'Failed to send email: ' + error.message });
  }
}