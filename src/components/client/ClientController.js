const Client = require('./ClientModel');
const Doctor = require('../doctor/DoctorModel');
const Consult = require('../consulta/consultModel');
const bcrypt = require("bcryptjs");
const { generateAccessToken ,toInvalidTokens } = require('../../helpers/jwt');
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

// const ClientLogin = async (req,res,next)=> {
//   try {
//     // Get user input
//     const { email, password } = req.body;

//     // Validate user input
//     if (!(email && password)) {
//       res.status(400).json({message: "All input is required" } );
//     }
//     // Validate if user exist in our database
//     const client = await Client.findOne({ email });

//     if (client && (await bcrypt.compare(password, client.password))) {

//       const accessToken = generateAccessToken(client._id, client.role);
//       res.status(200).json({accessToken});
//     }else{
//       res.status(404).json({message: "User not found"});
//     }
    
//   } catch (err) {
//     next(err);
//     console.log(err);
//   }
// };

const GetServices = async (req, res, next) => {

  try {
    const {params} = req;

    const doctor = await Doctor.find({specialization: params.specialization});

    res.json(new DoctorsSerializer(doctor, await req.getPaginationInfo(Doctor)));

  } catch (err) {
    next(err);
  }
};

const logOut = async (req, res, next) => {
  try {
      const user = await Client.findOne({_id: req.client._id});
      const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : "";
      toInvalidTokens(accessToken);
      res.json(new UserSerializer(user));
    } catch (err) {
      next(err);
    }
  };


module.exports = {
    clientSignup,
    GetServices,
    logOut
};