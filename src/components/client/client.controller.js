const Client = require('./client.model');
const Doctor = require('../doctor/doctor.model');
const bcrypt = require("bcryptjs");
const { generateAccessToken } = require('../../helpers/jwt');
const ApiError = require('../../utils/ApiError');

const clientSignup = async (req, res, next) => {
     try {
      //Get user input

      const input = { name, lastName, documentNumber, phoneNumber, address, perfil, gender, email, password, birthDate, role } = req.body;
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
        perfil,
        gender,
        email,
        password:encryptedPassword,
        birthDate,
        role
      }).then((client)=>{
         _client = client
         res.status(200).json(_client);
      }).catch((error)=>{
        console.log(error)
      })

     } catch (err) {
       next(err);
     }
  };

// const clientLogin = async (req,res,next)=> {
//     var data = req.body;
//     var clientArr = [];

//     clientArr = await client.find({email:data.email});

//     if(clientArr.length == 0){
//         res.status(200).send({message:'User not found', data: undefined})
//     }else{
//         //Login
//         let user = clientArr[0];
//         bcrypt.compare(data.password, user.password, async function(error, check){
//             if(check){
//                 res.status(200).send({data:user, token: jwt.createToken(user)});
//             }else{
//                 res.status(200).send({message: 'Check the password'});
//             }
//         })
//     }
// };

const ClientLogin = async (req,res,next)=> {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json({message: "All input is required" } );
    }
    // Validate if user exist in our database
    const client = await Client.findOne({ email });

    if (client && (await bcrypt.compare(password, client.password))) {

      const accessToken = generateAccessToken(client._id, client.role);
      res.status(200).json({accessToken});
    }else{
      res.status(404).json({message: "User not found"});
    }
    
  } catch (err) {
    next(err);
    console.log(err);
  }
};

// const findDoctor = async (where) => {

//   const doctor = await Doctor.findOne({ where });
//   if (!doctor) {
//     throw new ApiError('doctor not found', 400);
//   }

//   return doctor;
// };

const getDoctor = async (req, res, next) => {
  // try {
  //   const { params } = req;

  //   const doctor = await findDoctor({ _id: Number(params._id) });

  //   res.json(doctor);
  // } catch (err) {
  //   next(err);
  // }

  Doctor.find({ name: req.params.name }).exec()
  .then((docs) => {
      res.status(200).json(docs); //
  })
  .catch((error) => {
      console.log(error)
      res.status(404).json({message: "Not data Found"})
  })
console.log('rev')


};



module.exports = {
    clientSignup,
    ClientLogin,
    getDoctor
}