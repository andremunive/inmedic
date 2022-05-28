require("dotenv").config();
require("./src/config/database").connect();
const express = require("express");
const http = require("http");
const ErrorSerializer = require('./src/Serializers/BaseSerializer');
const clientRoutes = require('./src/components/client/ClientRoute');
const doctorRoutes = require('./src/components/doctor/DoctorRoute');
const userRoutes = require('./src/components/user/UserRoute');
const appointmentRoutes =require('./src/components/appointments/AppointmentRoute');
//const consultRoutes = require('./src/components/consulta/consultRoute');

const app = express();

app.set('port', process.env.PORT || 3001);
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use((req,res,next) =>{
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Headers', 'Authorization, X-API, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
     res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
     next();

});

app.use('/client' ,clientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/user', userRoutes);
app.use('/appointment', appointmentRoutes);
//app.use('/consult', consultRoutes);



app.use((req, res, next) => {
    res.status(404);
    res.json(new ErrorSerializer('Not found', null));
  });
  
  app.use((err, req, res, next) => {
    const {
      statusCode = 500,
      message,
    } = err;
  
    res.status(statusCode);
    res.json(new ErrorSerializer(message, null));
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server on port ${app.get('port')}`);
});

module.exports = app;