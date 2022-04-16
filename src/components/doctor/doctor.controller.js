'use strict'

var doctor = require('./doctor.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../../helpers/jwt');

const doctorSignUp = async function(req, res){
    var data = req.body;
    console.log('DATA => ',req.body)
    var doctorArr = [];

    doctorArr = await doctor.find({email:data.email});

    if(doctorArr.length == 0 && data.password){
        bcrypt.hash(data.password,null,null, async function(err, hash){
            if(hash){
                data.password = hash;
                var signUp = await doctor.create(data);
                res.status(200).send();
            }else{
                res.status(200).send({message:'Error encrypting password', data: undefined});
            }
        })
    }else{
        res.status(200).send({message:'Error on data. ', data: undefined});
    }
}

const doctorLogin = async function(req,res){
    var data = req.body;
    var doctorArr = [];

    doctorArr = await doctor.find({email:data.email});

    if(doctorArr.length == 0){
        res.status(200).send({message:'User not found', data: undefined})
    }else{
        //Login
        let user = doctorArr[0];
        bcrypt.compare(data.password, user.password, async function(error, check){
            if(check){
                res.status(200).send({data:user, token: jwt.createToken(user)});
            }else{
                res.status(200).send({message: 'Check the password'});
            }
        })
    }
}

module.exports = {
    doctorSignUp,
    doctorLogin
}