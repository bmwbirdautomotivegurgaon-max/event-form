// import nodemailer from "nodemailer";

// // Generate a random unique code to prevent Gmail threading
// function generateCode() {
//   return Math.random().toString(36).substring(2, 10).toUpperCase();
// }

// export async function POST(request: Request) {
//   try {
//     const { name, pax, contact, email } = await request.json();

//     console.log("--- API: Send Email Triggered ---");
//     console.log("Request Body:", { name, pax, contact, email });

//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//       console.error("CRITICAL: Missing environment variables for email.");
//       return Response.json(
//         { message: "Server configuration error: Missing credentials." },
//         { status: 500 }
//       );
//     }

//     // Create the random ID
//     const uniqueId = generateCode();

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const info = await transporter.sendMail({
//       from: `"BMW RSVP Portal" <${process.env.EMAIL_USER}>`,
//       to: process.env.EMAIL_USER,
//       subject: `New RSVP (${uniqueId}): Dhurandhar Premiere - ${name}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
//           <h2 style="color: #C5A059;">New Registration</h2>
//           <hr style="border: 1px solid #eee;" />
//           <p><strong>Name:</strong> ${name}</p>
//           <p><strong>Guests:</strong> ${pax}</p>
//           <p><strong>Contact:</strong> ${contact}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <br />
//           <p style="font-size: 12px; color: #888;">Sent from BMW Bird Automotive RSVP Form</p>
//         </div>
//       `,
//     });

//     console.log("Email sent successfully:", info.messageId);

//     return Response.json(
//       {
//         message: "Email sent successfully",
//         id: info.messageId,
//         code: uniqueId,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Nodemailer Error:", error);
//     return Response.json(
//       { message: "Failed to send email: " + error.message },
//       { status: 500 }
//     );
//   }
// }

import nodemailer from "nodemailer";
import twilio from "twilio";

// Generate access code (used for email + WhatsApp)
function generateAccessCode() {
  return (
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

// Prevent Gmail threading (unique subject identifier)
function generateEmailThreadBreaker() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const { name, pax, contact, email } = await request.json();

    console.log("API Triggered with Data:", { name, pax, contact, email });

    // Check email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return Response.json(
        { message: "Missing email credentials" },
        { status: 500 }
      );
    }

    // Check Twilio credentials (optional until upgraded)
    const canSendWhatsApp =
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM;

    // Generate both codes
    const accessCode = generateAccessCode();
    const emailBreaker = generateEmailThreadBreaker();

    //
    // ----------------------
    // 1) SEND EMAIL TO ORGANIZER
    // ----------------------
    //
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"BMW RSVP Portal" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New RSVP (${emailBreaker}): Dhurandhar Premiere - ${name}`,
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: auto; color: #333;">
          <h2 style="color: #C5A059;">New Registration</h2>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Guests:</strong> ${pax}</p>
          <p><strong>Contact:</strong> ${contact}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Access Code:</strong> ${accessCode}</p>
          <br/>
          <p style="font-size: 12px; color: #777;">BMW Bird Automotive RSVP System</p>
        </div>
      `,
    });

    console.log("Organizer email sent");

    //
    // ----------------------
    // 2) SEND WHATSAPP TO ATTENDEE
    // ----------------------
    //
    if (canSendWhatsApp) {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID as string,
        process.env.TWILIO_AUTH_TOKEN as string
      );

      const whatsappMessage = `
Thank you for confirming your attendance, Mr. ${name}.
Your tickets for ${pax} adults have been reserved.

Your Access Code: ${accessCode}

Please present this message at the entrance, and our team will guide you to the auditorium.
Wishing you an enjoyable cinematic experience.

PVR INOX × Bird Automotive
      `;

      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        to: `whatsapp:+91${contact}`,
        body: whatsappMessage.trim(),
      });

      console.log("WhatsApp message sent!");
    } else {
      console.log(
        "WhatsApp not sent — Twilio credentials missing (expected until upgrade)."
      );
    }

    //
    // ----------------------
    // SUCCESS RESPONSE
    // ----------------------
    //
    return Response.json(
      {
        success: true,
        message: "Email sent. WhatsApp queued (if Twilio enabled).",
        accessCode,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API ERROR:", error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
