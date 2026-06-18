import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "contact@willmax.ai",
      pass: process.env.SMTP_PASS || "yikw jqoh prov ugla",
    },
  });

  try {
    const success = await transporter.verify();
    console.log("Server is ready to take our messages:", success);
  } catch (error) {
    console.log("Error:", error.message);
  }
  process.exit();
}

test();

