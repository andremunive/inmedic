const Doctor = require('./DoctorModel');
const bcrypt = require("bcryptjs");
const { generateAccessToken } = require('../../helpers/jwt');
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


module.exports = {
    doctorSignUp
}