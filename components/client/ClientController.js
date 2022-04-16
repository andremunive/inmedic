'use strict'

var client = require('./ClientModel');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../../helpers/jwt');

const clientSignUp = async function(req, res){
    var data = req.body;
    console.log('DATA => ',req.body)
    var clientArr = [];

    clientArr = await client.find({email:data.email});

    if(clientArr.length == 0 && data.password){
        bcrypt.hash(data.password,null,null, async function(err, hash){
            if(hash){
                data.password = hash;
                var signUp = await client.create(data);
                res.status(200).send();
            }else{
                res.status(200).send({message:'Error encrypting password', data: undefined});
            }
        })
    }else{
        res.status(200).send({message:'Error on data. ', data: undefined});
    }
}

module.exports = {
    clientSignUp
}