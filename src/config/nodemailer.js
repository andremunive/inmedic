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

const enviarCorreoSolicitud = async function enviarMail(email, appoinmentId, doctorName) {
  await transporter.sendMail({
    from: '"Cita" <inmedic066@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'cita generada', // Subject line
    html: `<h3>Cita generada exitosamente</h3>
          <p>cita id "${appoinmentId}"</p>
          <br>
          <a href="${doctorName}">${doctorName}</a>
          
          <p>Atentamente, <br>  
          Inmedic</p>`, // html body
  });
};

module.exports = {
  transporter,
  enviarCorreoSolicitud,
};