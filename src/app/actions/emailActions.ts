"use server";

export async function sendEmailAction({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      // Dynamic require to prevent TypeScript module resolution error if nodemailer isn't in dependencies
      try {
        const nodemailer = eval("require")("nodemailer");
        const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Apex CRM" <no-reply@apexcrm.io>`,
          to,
          subject,
          text: text || subject,
          html,
        });

        console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
        return { success: true, delivered: true };
      } catch (err) {
        console.log(`[EMAIL LOGGED (Nodemailer not installed)] To: ${to} | Subject: ${subject}`);
        return { success: true, delivered: false, note: "Nodemailer package not installed" };
      }
    } else {
      console.log(`[EMAIL LOGGED (No SMTP Configured)] To: ${to} | Subject: ${subject}`);
      return { success: true, delivered: false, note: "Logged to console (SMTP credentials not set)" };
    }
  } catch (error: any) {
    console.error("Error in sendEmailAction:", error);
    return { success: false, error: error.message };
  }
}

export async function sendWelcomeEmailAction(userEmail: string, companyName: string, userName: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 30px;">
      <div style="max-width: 550px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h2 style="color: #4f46e5; margin-top: 0;">Welcome to Apex CRM! 🎉</h2>
        <p style="color: #334155;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #334155;">Your company account for <strong>${companyName}</strong> has been successfully set up and activated.</p>
        <div style="margin: 25px 0;">
          <a href="${process.env.NEXTAUTH_URL || "http://localhost:3001"}/login" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Log In to CRM Dashboard</a>
        </div>
        <p style="color: #64748b; font-size: 13px;">If you have any questions, reply directly to this email.</p>
      </div>
    </div>
  `;
  return sendEmailAction({
    to: userEmail,
    subject: `Welcome to Apex CRM - ${companyName}`,
    html,
  });
}
