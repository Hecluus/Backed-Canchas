const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.CUENTA_GMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const enviarEmail = async (correo, link) => {
  await transporter.sendMail({
    from: '"Recuperar contraseña" <golazogourmet@gmail.com>',
    to: correo,
    subject: "Recuperación de contraseña",
    html: `<b>Ingrese al siguiente link para cambiar su contraseña:</b>
      <a href="${link}">${link}</a>`,
  });
}

module.exports = {
  enviarEmail
};