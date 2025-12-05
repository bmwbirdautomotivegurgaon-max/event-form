import nodemailer from "nodemailer";

// Generate email thread breaker
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

    // Check email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("CRITICAL: Missing environment variables for email.");
      return Response.json(
        { message: "Server configuration error: Missing credentials." },
        { status: 500 }
      );
    }

    const emailThreadBreaker = generateEmailThreadBreaker();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //
    // ----------------------
    // 1) SEND ORGANIZER NOTIFICATION EMAIL
    // ----------------------
    //
    await transporter.sendMail({
      from: `"BMW RSVP Portal" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New RSVP (${emailThreadBreaker}): Dhurandhar Premiere - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #C5A059;">New Registration</h2>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Guests:</strong> ${pax}</p>
          <p><strong>Contact:</strong> ${contact}</p>
          <p><strong>Email:</strong> ${email}</p>
          <br />
          <p style="font-size: 12px; color: #888;">Sent from BMW Bird Automotive RSVP Form</p>
        </div>
      `,
    });

    console.log("Organizer notification email sent");

    //
    // ----------------------
    // 2) SEND CONFIRMATION EMAIL TO ATTENDEE
    // ----------------------
    //
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

    return Response.json(
      {
        success: true,
        message: "Email sent successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API ERROR:", error);
    return Response.json(
      { message: "Failed to send email: " + error.message },
      { status: 500 }
    );
  }
}
