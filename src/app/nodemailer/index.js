const { env } = require("process");
const handlebars = require("handlebars");
const fs = require("fs");
const nodemailer = require("nodemailer");
const sendEmail = async (mailObj) => {
  const { from, to, subject, text, html } = mailObj;
  try {
    // Đọc nội dung của file html.hbs
    const templateFile = fs.readFileSync(html, "utf8");

    // Sử dụng Handlebars để truyền dữ liệu vào template HTML
    const template = handlebars.compile(templateFile);
    const htmlsend = template({
      text: text,
    });
    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {
        user: env.EMAIL_LOGIN,
        pass: env.EMAIL_PASSWORD,
      },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: from, //senderaddress
      to: to, //listofreceivers
      subject: subject, //subjectline
      // text: text, //plaintextbody
      html: htmlsend,
    });
    console.log(`Messagesent: ${info.messageId}`);
    return `Messagesent: ${info.messageId}`;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Something went wrong in the sendmail method. Error:${error.message}`
    );
  }
};

module.exports = sendEmail;
