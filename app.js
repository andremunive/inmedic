require("dotenv").config();
require("./src/config/database").connect();
const express = require("express");
const ErrorSerializer = require('./src/Serializers/BaseSerializer');
const clientRoutes = require('./src/components/client/ClientRoute');
const doctorRoutes = require('./src/components/doctor/DoctorRoute');
const userRoutes = require('./src/components/user/UserRoute');
//const consultRoutes = require('./src/components/consulta/consultRoute');

const app = express();

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

    //prueba mongo
    // const clientModel = require ("./src/components/client/client.model"); 
    // let resul;
    // clientModel.findOne({email:'andre@gmail.com'}).then((myClient)=>{
    //    resul = myClient;
    //    console.log("cliente prueba",resul);
    // }).catch((error)=>{
    //   console.log(error)
    // })



    // findBy ID
    // const clientModel = require ("./src/components/client/client.model"); 
    // let resul;
    // clientModel.findById('6265c4af94698d42d2fb3966').then((myClient)=>{
    //    resul = myClient;
    //    console.log("cliente prueba",resul);
    // }).catch((error)=>{
    //   console.log(error)
    // })
   
    //create CLIENT
     //prueba mongo
    // const consultModel = require ("./src/components/consulta/consultModel"); 
    // let resul;
    // const newConsult = {

    // }
    // consultModel.create(newConsult).then((myConsult)=>{
    //    resul = myConsult;
    //    console.log("cliente prueba",resul);
    // }).catch((error)=>{
    //   console.log(error)
    // })
   

module.exports = app;