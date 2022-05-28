const nodemailer = require('nodemailer');
const path = require('path')
const hbs = require('nodemailer-express-handlebars')



// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'inmedic066@gmail.com', // generated ethereal user
    pass: 'gdhhglqgnpksfbcw', // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false
}
});

const enviarCorreoSolicitud = async function enviarMail(email, appoinmentId, doctorName) {

  transporter.use('compile', hbs({
    viewEngine: {
      extName: '.handlebars',
      partialsDir: path.join(__dirname, "templates"),//your path, views is a folder inside the source folder
      layoutsDir: path.join(__dirname, "templates"),
      defaultLayout: ''//set this one empty and provide your template below,
    },
    viewPath: path.join(__dirname, "templates"),
    extName: '.handlebars',
   }));

  await transporter.sendMail({
    from: '"Cita" <inmedic066@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Cita generada', // Subject line
    template:'generada',
    context: {
      citaID: appoinmentId,
      doctorName: doctorName
  }  // html body
  });
};

const enviarCorreoCitaRechazada = async function enviarMail(email, appoinmentId, reason) {

  transporter.use('compile', hbs({
    viewEngine: {
      extName: '.handlebars',
      partialsDir: path.join(__dirname, "templates"),//your path, views is a folder inside the source folder
      layoutsDir: path.join(__dirname, "templates"),
      defaultLayout: ''//set this one empty and provide your template below,
    },
    viewPath: path.join(__dirname, "templates"),
    extName: '.handlebars',
   }));
   console.log("reason:"+ reason)
  await transporter.sendMail({
    from: '"Cita" <inmedic066@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Cita rechazada', // Subject line
    template:'rechazada',
    context: {
      citaID: appoinmentId,
      reason: reason
    }  // html body
  });
};

const enviarCorreoCitaAprobada = async function enviarMail(email, appoinment, tipoLugar, lugar) {

  transporter.use('compile', hbs({
    viewEngine: {
      extName: '.handlebars',
      partialsDir: path.join(__dirname, "templates"),//your path, views is a folder inside the source folder
      layoutsDir: path.join(__dirname, "templates"),
      defaultLayout: ''//set this one empty and provide your template below,
    },
    viewPath: path.join(__dirname, "templates"),
    extName: '.handlebars',
   }));

  await transporter.sendMail({
    from: '"Cita" <inmedic066@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Cita aprobada', // Subject line
    template:'aprobada',
    context: {
      citaID: appoinment._id,
      cita_fecha: appoinment.date,
      cita_hora:appoinment.hour,
      cita_modalidad:appoinment.tipoConsult,
      reunion:tipoLugar,
      lugar:lugar
    }  // html body
  });

};


module.exports = {
  transporter,
  enviarCorreoSolicitud,
  enviarCorreoCitaRechazada,
  enviarCorreoCitaAprobada
};