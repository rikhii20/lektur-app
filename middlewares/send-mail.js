const nodemailer = require("nodemailer");

module.exports = async (email, subject, content) => {
  try {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });
      let info = await transporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to: email,
        subject: subject,
        text: "",
        html: content,
      });
      console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
      console.log(error);

  }
  
};
