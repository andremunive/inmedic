const Client = require('./ClientModel');
const Doctor = require('../doctor/DoctorModel');
const bcrypt = require("bcryptjs");
const ApiError = require('../../utils/ApiError');
const UserSerializer = require('../../Serializers/UserSerializer');
const DoctorsSerializer = require('../../Serializers/DoctorsSerializer');
const ConsultModel = require('../doctor/ConsultModel');

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
    const {body} = req;
    req.isRole('user');
    const specialization = await Doctor.find({specialization: body.search});
    console.log(specialization);
    const name = await Doctor.find({name: body.search});
    console.log(name);
    const services = await Doctor.find({services: body.search});
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

const ProfileDoctor = async (req, res, next) => {

  try {
    const {params} = req;
    req.isRole('user');

    const profileDoctor = await ConsultModel.find({idDoctor: params.idDoctor});
    console.log("Profile doctor: ",profileDoctor);


    if (! profileDoctor.length) return new ApiError("Profile doctor not found", 400);

    

    res.status(200).json(profileDoctor);

  } catch (err) {
    next(err);
  }
};


module.exports = {
    clientSignup,
    GetServices,
    ProfileDoctor,
};