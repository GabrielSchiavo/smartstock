import nodemailer from "nodemailer";

function createTransport() {
  if (process.env.NODE_ENV === "production") {
    // Real emails
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_SMTP_USER,
        pass: process.env.GMAIL_SMTP_PASS,
      },
    });
  }

  // Captured by Ethereal
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USERNAME,
      pass: process.env.ETHEREAL_PASSWORD,
    },
  });
}

export const transporter = createTransport();
