require("dotenv").config();
require("./src/config/database").connect();
const express = require("express");
const ErrorSerializer = require('./src/Serializers/BaseSerializer');
const clientRoutes = require('./src/components/client/client.route');
const doctorRoutes = require('./src/components/doctor/doctor.route');

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
   
    // create CLIENT
     // //prueba mongo
    // const clientModel = require ("./src/components/client/client.model"); 
    // let resul;
    // const newClient = {
    //   "name":"Daniel",
    //   "lastName" : "Meza",
    //   "documentNumber": "1123456129",
    //   "phoneNumber": "3003452289",
    //   "address": "Cra.25 #45-04",
    //   "perfil" : "foto.png",
    //   "gender" : "Masculino",
    //   "email": "danydaniel10m@hotmail.com",
    //   "password" : "23456",
    //   "birthDate" : "09/03/1999",
    //   "role": "user"
    // }
    // clientModel.create(newClient).then((myClient)=>{
    //    resul = myClient;
    //    console.log("cliente prueba",resul);
    // }).catch((error)=>{
    //   console.log(error)
    // })
   

module.exports = app;