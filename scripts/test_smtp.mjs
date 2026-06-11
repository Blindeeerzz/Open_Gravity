import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "hachiman69@gmail.com",
    pass: "yikw jqoh prov ugla",
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
