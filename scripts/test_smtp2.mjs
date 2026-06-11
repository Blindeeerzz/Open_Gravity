import nodemailer from "nodemailer";

async function test() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "hachiman69@gmail.com",
      pass: "yikw jqoh prov ugla",
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
