import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

    await transporter.sendMail({
        from: `"JapaExpress" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
    });
}
