const Client = require('./ClientModel');
const Doctor = require('../doctor/DoctorModel');
//const Consult = require('../doctor/ConsultModel');
const bcrypt = require("bcryptjs");
const ApiError = require('../../utils/ApiError');
const UserSerializer = require('../../Serializers/UserSerializer');
const DoctorsSerializer = require('../../Serializers/DoctorsSerializer');

const clientSignup = async (req, res, next) => {
     try {
      //Get user input

      const input = { name, lastName, documentNumber, phoneNumber, address, gender, email, password, birthDate, role } = req.body;
      let inputArray = Object.keys(input);

      // Validate user input
      if (inputArray.every((ele)=> input[ele] != "" && input[ele] != undefined )) {
      }else{
         throw new ApiError("All input is required",400);
        }
    //   if (password !== passwordConfirmation) {
    //      throw new ApiError("Passwords do not match",400);
    //     }

      // Validamos la existencia del usuario en la base de datos
      let oldUser;
      await Client.findOne({ email: input.email }).then((client)=>{
        oldUser = client;
      }).catch((error)=>{
           console.log(error)
      })
      
  
      if (oldUser != null) {
        throw new ApiError("User Already Exist. Please Login",400);
      }
  
      // Encrypt user password
      let encryptedPassword ;
      await bcrypt.hash(input.password, 10).then((resul)=>{
        encryptedPassword = resul
      }).catch((error)=>{
        console.log("Encripting Error",error)
      })
  
      // Creamos un usuario en la DB
      let _client; 
      await Client.create({
        name,
        lastName,
        documentNumber,
        phoneNumber,
        address,
        gender,
        email,
        password:encryptedPassword,
        birthDate,
        role
      }).then((client)=>{
         _client = client
         res.status(200).json(new UserSerializer(_client));
      }).catch((error)=>{
        console.log(error)
      })

     } catch (err) {
       next(err);
     }
  };


const GetServices = async (req, res, next) => {

  try {
    const {params} = req;
    req.isRole('user');
    const specialization = await Doctor.find({specialization: params.search});
    console.log(specialization);
    const name = await Doctor.find({name: params.search});
    console.log(name);
    const services = await Doctor.find({services: params.search});
    console.log(services);

    if(specialization.length){
      console.log("ENTRO 1");
      doctor = specialization;
    }else {
      if (name.length) {
        console.log("ENTRO 2");
        doctor = name;
      } else {
        if (services.length) {
          console.log("ENTRO 3");
          doctor = services;
        } else {
          throw new ApiError("No found", 400);
        }
      }
    }
    

    res.json(new DoctorsSerializer(doctor, await req.getPaginationInfo(Doctor)));

  } catch (err) {
    next(err);
  }
};

// const logOut = async (req, res, next) => {
//   try {
//       const user = await Client.findOne({_id: req.client._id});
//       const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : "";
//       toInvalidTokens(accessToken);
//       res.json(new UserSerializer(user));
//     } catch (err) {
//       next(err);
//     }
//   };


module.exports = {
    clientSignup,
    GetServices,
};