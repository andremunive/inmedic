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
  tls: {
    rejectUnauthorized: false
}
});

const enviarCorreoSolicitud = async function enviarMail(email, appoinmentId, doctorName) {
  await transporter.sendMail({
    from: '"Cita" <inmedic066@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'cita generada', // Subject line
    html: 
    `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
</head>
<body style="background-color: #f4f4f4; font-family: Roboto, arial, sans-serif;">
    <div style=" height: 140px; margin: 0; padding: 0;"> 
    </div>
    
    <div style="max-width: 500px; background-color: rgb(249, 249, 249); margin: -80px auto 0 auto;">
     
        <div style="height: 65px; background-color: #00B0FF;  
        font-size: 30px; font-weight: 700; 
        margin-top: 20px;  color:#ffffff;">
           
           <p style="text-align:left;padding:15px;color:#ffffff;">InMedic</p>  
        </div>
        <br/>
        <div style="text-align: center; ">
            <p style="
            width: 432px;
            height: 45px;
           
            top: 82px;
            margin: 0 auto;
            font-family: 'Kadwa';
            font-style: normal;
            font-weight: 700;
            font-size: 28px;
            line-height: 56px;            
            color: #00B0FF;">Cita generada exitosamente</p>
        </div>

        <div style="
        width: 407px;
        height: 126px;
        padding-left: 22px;
        top: 159px;
        font-family: 'Kadwa';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 30px;
        text-align: center;
        color: #000000;">
  <p style="padding-left: 22px; font-weight: bold; ">Su solicitud de cita con id ${appoinmentId} 
    ha sido generada y enviada exitosamente al médico ${doctorName}. Una vez este dé una respuesta, será notificado por este medio.</p>
    <p style="
    width: 407px;
    height: 79px;
    padding-left: 22px;
    top: 317px;
    
    font-family: 'Kadwa';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
   text-align: center;
    margin: 0 auto;
    color: #5B5B5B;">El médico cuenta con un plazo de 24 horas para dar respuesta a su solicitud. 
        Una vez cumplido este plazo, su cita será cancelada autamaticamente.</p>

</div>

          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
    </div>  
</body>
</html>`

  });
};

const enviarCorreoCitaRechazada = async function enviarMail(email, appoinmentId, doctorName) {
  await transporter.sendMail({
    from: '"Cita" <inmedic066@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'cita rechazada', // Subject line
    html: `<h3>Cita generada exitosamente</h3>
          <p>cita id "${appoinmentId}"</p>
          <br>
          <a href="${doctorName}">${doctorName}</a>
          
          <p>Atentamente, <br>  
          Trinos-API</p>`, // html body
  });
};

module.exports = {
  transporter,
  enviarCorreoSolicitud,
  enviarCorreoCitaRechazada
};