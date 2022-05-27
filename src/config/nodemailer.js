const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'inmedic066@gmail.com', // generated ethereal user
    pass: 'gdhhglqgnpksfbcw', // generated ethereal password
  },
});

const enviarCorreoRecuperacion = async function enviarMail(email, user) {
  await transporter.sendMail({
    from: '"Cita" <inmedic066@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Su solicitud de cita ha sido realizada', // Subject line
    html: `<h3>Hola 'Nombre de titular de la cita'</h3>
          <p></p>
          <br>
          <a href="${user}">${user}</a>
          
          <p>Atentamente, <br>  
          Trinos-API</p>`, // html body
  });
};

module.exports = {
  transporter,
  enviarCorreoRecuperacion,
};