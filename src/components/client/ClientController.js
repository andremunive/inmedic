const Client = require('./ClientModel');
const Doctor = require('../doctor/DoctorModel');
const bcrypt = require("bcryptjs");
const ApiError = require('../../utils/ApiError');
const UserSerializer = require('../../Serializers/UserSerializer');
const DoctorsSerializer = require('../../Serializers/DoctorsSerializer');

const consultModel = require('../doctor/ConsultModel');
const ConsultSerializer = require('../../Serializers/ConsultSerializer');

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
     console.log("search: ", body.search);
     console.log("city: ", body.city);

      const doctorBySpecialization = await Doctor.find({specialization:{$regex: body.search.trim(), $options: "$i"}, 
      city: {$regex: body.city.trim(), $options: "i"}});

      const doctorByName = await Doctor.find({name:{$regex: body.search.trim(), $options: "$i"}, 
      city: {$regex: body.city.trim(), $options: "i"}});

      const doctorByServices = await Doctor.find({services:{$regex: body.search.trim(), $options: "$i"}, 
      city: {$regex: body.city.trim(), $options: "i"}});
      
        let doctor = [];
        doctor = doctorByServices.length ? doctorByServices : doctor;
        doctor = doctorByName.length ? doctorByName : doctor;
        doctor = doctorBySpecialization.length ? doctorBySpecialization : doctor;

        let resultConsults = [];
        let myIndex = 0;

        doctor.forEach(async (doc) => {
          await consultModel.find({name: doc.name}).then((profileSearch)=> {
            resultConsults= [...resultConsults,...profileSearch];
            myIndex += 1;
            console.log("#######******",resultConsults);
            
            if (myIndex === doctor.length) {

              if (resultConsults.length === 0 ) {
                res.send({status: "user not found", data: null});
              } else {
              res.json(new ConsultSerializer(resultConsults));
              }
            }
          })
        })  


      

  
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

const ProfileDoctor = async (req, res, next) => {

  try {
    const {params} = req;
    req.isRole('user');

    const profileDoctor = await ConsultModel.find({idDoctor: params.idDoctor});
    console.log("Profile doctor: ",profileDoctor);


    if (! profileDoctor) return new ApiError("Profile doctor not found", 400);

    

    res.status(200).json(profileDoctor);

  } catch (err) {
    next(err);
  }
};



module.exports = {
    clientSignup,
    GetServices,
    ProfileDoctor
};