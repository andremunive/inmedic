const Doctor = require('../doctor/DoctorModel');
const Client = require('../client/ClientModel');
const { generateAccessToken, toInvalidTokens } = require('../../helpers/jwt');
const ApiError = require('../../utils/ApiError');
const bcrypt = require("bcryptjs");
const AuthSerializer = require("../../Serializers/AuthSerializer");
const UserSerializer = require('../../Serializers/UserSerializer');

const findUser = async (where) => {
    console.log("WHERE",where);
    Object.assign(where, { active: true });
   
    const doctor = await Doctor.findOne( where );
    console.log("USER_DOCTOR",doctor);
    const client = await Client.findOne( where );
    console.log("USER_CLIENT",client);
    if (doctor) { 
        return doctor;
    } else{
        if(client) {
            return client;
        } else {
            throw new ApiError('User not found 1', 400);
        }   
    }
};

const findUserId = async (where) => {
    console.log("WHERE",where);
    Object.assign(where, { active: true });
   
    const doctor = await Doctor.findById( where );
    console.log("USER_DOCTOR",doctor);
    const client = await Client.findById( where );
    console.log("USER_CLIENT",client);
    if (doctor) { 
        return doctor;
    } else{
        if(client) {
            return client;
        } else {
            throw new ApiError('User not found 1', 400);
        }   
    }
};


const login = async (req, res, next) => {

    try {

        const { email, password } = req.body;
        //Validate user input
        if (!(email && password)) {
          throw new ApiError('All field are required');
        }
    
        const user = await findUser({email: email});
        console.log("USER_FOUND: ",user);

        if (!(await bcrypt.compare(password, user.password))) {
            console.log(user.password);
            throw new ApiError('User not found 2' , 400);
        }

        const loginDate = {
            lastLoginDate: new Date(),
        }
      
        Object.assign(user, loginDate);
      
        await user.save();
      
        const accessToken = generateAccessToken(user._id, user.role);
      
      
        res.json(new AuthSerializer(accessToken,user.role));

    } catch (err) {
        next(err);
    }
    
}

const updateUser = async (req, res, next) => {
    try {
        const {params, body} = req;

        const userId = String(params._id);
        console.log("USERid: ",userId);
        req.isUserAuthorized(userId);

        const user = await findUserId({_id: userId});
        console.log("USER 2", user);

        const userPayload = {
            email: body.email,
            address: body.address,
            perfil: body.perfil,
            phoneNumber: body.phoneNumber,
        };

        if (Object.values(userPayload).some((val) => val === undefined)) {
            throw new ApiError('Payload can only contain username, email or name', 400);
        }

        Object.assign(user, userPayload);

        await user.save();

        res.json(new UserSerializer(user));


    } catch (err) {
        next(err);
    }
};

const deactivateUser = async (req, res, next) => {
    try {
      const { params } = req;
  
      const userId = String(params._id);
      console.log("USER_ID: ", userId);
      req.isUserAuthorized(userId);
  
      const user = await findUserId({ _id: userId });
  
      Object.assign(user, { active: false });
  
      await user.save();
  
      res.json(new UserSerializer(null));
    } catch (err) {
      next(err);
    }
  };


const logOut = async (req, res, next) => {
    try {
        const user = await findUserId({_id: req.user.id});
        console.log("UserLogout: ",user);
        const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : "";
        toInvalidTokens(accessToken);
        res.json(new UserSerializer(user));
      } catch (err) {
        next(err);
      }
};


module.exports = {
    login,
    updateUser,
    logOut,
    deactivateUser
}