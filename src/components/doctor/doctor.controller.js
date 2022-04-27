const Doctor = require('./doctor.model');
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
  


    // var doctorArr = [];

    // doctorArr = await Doctor.find({email:data.email});

    // if(doctorArr.length == 0 && data.password){
    //     bcrypt.hash(data.password,null,null, async function(err, hash){
    //         if(hash){
    //             data.password = hash;
    //             var signUp = await Doctor.create(data);
    //             res.status(200).send();
    //         }else{
    //             res.status(200).send({message:'Error encrypting password', data: undefined});
    //         }
    //     })
    // }else{
    //     res.status(200).send({message:'Error on data. ', data: undefined});
    // }
};

const doctorLogin = async (req,res, next) => {

    try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          res.status(400).json({message: "All input is required" } );
        }
        // Validate if user exist in our database
        const doctor = await Doctor.findOne({ email });
    
        if (doctor && (await bcrypt.compare(password, doctor.password))) {
    
          const accessToken = generateAccessToken(doctor._id, doctor.role);
          res.status(200).json({accessToken});
        }else{
          res.status(404).json({message: "User not found"});
        }
        
      } catch (err) {
        next(err);
        console.log(err);
      }



    // var doctorArr = [];

    // doctorArr = await Doctor.find({email:data.email});

    // // if(doctorArr.length == 0){
    // //     res.status(200).send({message:'User not found', data: undefined})
    // // }else{
    // //     //Login
    // //     let user = doctorArr[0];
    // //     bcrypt.compare(data.password, user.password, async function(error, check){
    // //         if(check){
    // //             res.status(200).send({data:user, token: jwt.createToken(user)});
    // //         }else{
    // //             res.status(200).send({message: 'Check the password'});
    // //         }
    // //     })
    // // }
};

module.exports = {
    doctorSignUp,
    doctorLogin
}