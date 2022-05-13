const express = require("express")
const doctorController = require('./DoctorController');
const consultController = require('../consulta/consultController');
const {authDoctorMiddleware} = require('./DoctorMiddleware')
const api = express.Router();

//Create new client
api.post('/signup', doctorController.doctorSignUp);
//api.post('/login', doctorController.doctorLogin);
api.post('/services', authDoctorMiddleware, consultController.Consult);

module.exports = api;