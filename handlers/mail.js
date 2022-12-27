const nodeMailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const { htmlToText } = require("html-to-text");
const promisify = require("es6-promisify");

const transport = nodeMailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// TODO - Dive deeper into this to understand how it works!!!
const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  // Generates inline CSS which improves how many browsers the CSS will function in (moves styles from a border="20px" format to style="border:20px;")
  const inlined = juice(html);
  return inlined;
};

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText(html);
  const mailOptions = {
    from: `Chris DeCleene <noreply@gmail.com>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text,
  };

  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
