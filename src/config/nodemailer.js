const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'inmedic066@gmail.com', // generated ethereal user
    pass: '1q2w3e4r5t789456', // generated ethereal password
  },
});

const enviarCorreoRecuperacion = async function enviarMail(email, token) {
  await transporter.sendMail({
    from: '"Cita" <>', // sender address
    to: email, // list of receivers
    subject: 'Su solicitud de cita ha sido realizada', // Subject line
    html: `<b>Hi,</b>
          <p></p>
          <br>
          
          <p>Atentamente, <br>  
          Trinos-API</p>`, // html body
  });
};

module.exports = {
  transporter,
  enviarCorreoRecuperacion,
};