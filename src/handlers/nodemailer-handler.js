import 'dotenv/config';
import nodemailer from 'nodemailer';

const nodemailerOpts = {
  host: String(process.env.MAILTRAP_HOST),
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: String(process.env.MAILTRAP_USER),
    pass: String(process.env.MAILTRAP_PASS),
  },
};

const transport = nodemailer.createTransport(nodemailerOpts);

const userRegister = async (data) => {
  const { email, name, token } = data;
  const url = `${process.env.FRONTEND_URL}/confirm/${token}`;
  const mailOpts = {
    from: '"Uptask - Project manager" - <noreply@uptask.com>',
    to: `"${name}" - ${email}`,
    subject: 'Confirm account',
    text: 'Confirm your account in Uptask',
    html: `
      <p>Hello ${name}. Please, confirm your account.</p>
      <p>To confirm, follow the <a href="${url}">link</a>.</p>
      <p>Or copy and paste the next address:</p>
      <p>${url}</p>
      <p>Ignore this email if you do not create an account in Uptask.</p>
    `,
  };
  await transport.sendMail(mailOpts);
};

const userRecovery = async (data) => {
  const { email, token } = data;
  const url = `${process.env.FRONTEND_URL}/forgotpassword/${token}`;
  const mailOpts = {
    from: '"Uptask - Project manager" - <noreply@uptask.com>',
    to: email,
    subject: 'Recovery steps',
    text: 'Please, follow this steps to recover your account in Uptask',
    html: `
      <p>Follow the <a href="${url}">link</a>.</p>
      <p>Or copy and paste the next address:</p>
      <p>${url}</p>
      <p>Ignore this email if you do not create an account in Uptask.</p>
    `,
  };
  await transport.sendMail(mailOpts);
};

export {
  userRegister,
  userRecovery,
};
