const express = require("express")
const doctorController = require('./doctor.controller');
const consultController = require('../consulta/consultController');
const {authDoctorMiddleware} = require('./doctorMiddleware')
const api = express.Router();

//Create new client
api.post('/signup', doctorController.doctorSignUp);
api.post('/login', doctorController.doctorLogin);
api.post('/services', authDoctorMiddleware, consultController.Consult);

module.exports = api;