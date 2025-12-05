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
import clientPromise from "@/app/lib/mongodb";

// DISABLED: Generate access code for attendee
// function generateAccessCode() {
//   return (
//     Math.random().toString(36).substring(2, 6).toUpperCase() +
//     "-" +
//     Math.random().toString(36).substring(2, 6).toUpperCase()
//   );
// }

// Prevent Gmail threading (unique subject identifier)
function generateEmailThreadBreaker() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Determine salutation based on name
function getSalutation(name: string): string {
  const femalePatterns = [/a$/, /i$/, /ia$/, /sha$/, /she$/, /shi$/];
  const nameWords = name.trim().split(" ");
  const firstName = nameWords[0].toLowerCase();
  const isFemale = femalePatterns.some((pattern) => pattern.test(firstName));
  return isFemale ? "Ms." : "Mr.";
}

export async function POST(request: Request) {
  try {
    const { name, pax, contact, email } = await request.json();

    console.log("API Triggered with Data:", { name, pax, contact, email });

    // DISABLED: Generate access code
    // const accessCode = generateAccessCode();

    //
    // ----------------------
    // 1) SAVE FORM DATA TO MONGODB (PRIMARY)
    // ----------------------
    //
    let dbSaved = false;

    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);

      const result = await db.collection("form_submissions").insertOne({
        name,
        pax,
        contact,
        email,
        // DISABLED: accessCode removed from database save
        // accessCode,
        agreeWhatsApp: true,
        submittedAt: new Date(),
      });

      console.log("Form data saved to MongoDB with ID:", result.insertedId);
      dbSaved = true;
    } catch (dbError: any) {
      console.error("MongoDB Save Error:", dbError);
    }

    // If database save fails, return error before attempting email
    if (!dbSaved) {
      return Response.json(
        { message: "Failed to save registration data. Please try again." },
        { status: 500 }
      );
    }

    //
    // ----------------------
    // 2) SEND CONFIRMATION EMAIL TO ATTENDEE (OPTIONAL)
    // ----------------------
    //
    let emailSent = false;
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const salutation = getSalutation(name);

      const attendeeEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="padding: 30px; background-color: #fff;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${salutation} ${name},</p>
            
            <p style="color: #555; line-height: 1.8; margin-bottom: 15px;">
              Thank you for confirming your attendance. We are pleased to inform you that your tickets for <strong>${pax} adult${
        pax > 1 ? "s" : ""
      }</strong> have been successfully reserved.
            </p>

            <p style="color: #555; line-height: 1.8; margin-bottom: 20px;">
              Please present this email at the entrance on arrival. Our team will be available to assist you and guide you to the auditorium.
            </p>

            <!-- DISABLED: Access code display in email
            <div style="background-color: #f0f0f0; padding: 20px; border-left: 4px solid #C5A059; margin: 25px 0;">
              <p style="margin: 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">Your Reservation Code</p>
              <p style="margin: 15px 0 0 0; font-size: 28px; font-weight: bold; color: #C5A059; font-family: monospace; letter-spacing: 3px;"></p>
            </div>
            -->

            <p style="color: #666; line-height: 1.8; margin: 25px 0;">
              Wishing you a wonderful and enjoyable cinematic experience.
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 30px; margin-bottom: 5px; font-weight: bold;">
              Warm regards,
            </p>
            <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.8;">
              <strong>PVR INOX</strong> | <strong>Bird Automotive</strong> | <strong>EO Gurgaon</strong>
            </p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"PVR INOX | Bird Automotive" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Confirmation of Your Ticket Reservation – PVR INOX | Bird Automotive | EO Gurgaon`,
        html: attendeeEmailHtml,
      });

      console.log("Attendee confirmation email sent to:", email);
      emailSent = true;
    } catch (emailError: any) {
      console.warn("Email send error (non-blocking):", emailError.message);
      // Don't fail the request - data is already saved in DB
    }

    return Response.json(
      {
        success: true,
        message: "Registration confirmed. Your data has been saved.",
        // DISABLED: accessCode removed from response
        // accessCode,
        emailSent,
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
