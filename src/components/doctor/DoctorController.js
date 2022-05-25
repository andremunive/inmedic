const Doctor = require('./DoctorModel');
const bcrypt = require("bcryptjs");
const ConsultSchema= require('./ConsultModel');
//const { generateAccessToken } = require('../../helpers/jwt');
const ConsultSerializer = require('../../Serializers/ConsultSerializer');
const ApiError = require('../../utils/ApiError');

const doctorSignUp = async (req, res,next) => {

    try{

        var data = req.body;
        console.log('DATA => ',req.body)

        if (!data) {
           throw new ApiError("All input is required",400);
        }

              // Validamos la existencia del usuario en la base de datos
      let oldUser;
      await Doctor.findOne({ email: data.email }).then((doctor)=>{

           oldUser = doctor;
      }).catch((error)=>{
           console.log(error)
      })

      if (oldUser != null) {
        throw new ApiError("User Already Exist. Please Login",400);
      }
  
      // Encrypt user password
      let encryptedPassword ;
      await bcrypt.hash(data.password, 10).then((resul)=>{
        encryptedPassword = resul
        data.password = encryptedPassword
      }).catch((error)=>{
        console.log("Encripting Error",error)
      })

      let _doctor;
      await Doctor.create(data)
      .then((doctor)=>{
        _doctor = doctor
        res.status(200).json(_doctor);
     }).catch((error)=>{
       console.log(error)
     }); 

    } catch (err) {
        next(err);
    }
};

const addPrescription = async (req,res,next) => {
  const {details} = req.body;
  

}

const Addconsult = async (req, res,next) => {

  try {
    
    const {body, params} = req;
    
    req.isUserAuthorized(params._id);
    const doctor = await Doctor.findById({_id: params._id});
    console.log(doctor);
    
    

    if(!doctor)  throw new ApiError("User not found", 400);
  
    let consult = new ConsultSchema({
        idDoctor: doctor._id,
        perfil: doctor.perfil,
        name: doctor.name,
        description: body.description,
        description2: body.description2,
        specialization: doctor.specialization,
        services: doctor.services,
        tipoConsulta: body.tipoConsulta,
        precio: body.precio,
    })
  
    consult = await consult.save();
  
    if(!consult) 
     throw new ApiError("consult cannot be created ", 500);
  
    res.status(200).json(consult);

  } catch(err) {
    next(err);
  }
};

module.exports = {
    doctorSignUp,
    Addconsult
}