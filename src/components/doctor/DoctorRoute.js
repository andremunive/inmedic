const express = require("express")
const doctorController = require('./DoctorController');
//const consultController = require('../consulta/consultController');
const {authMiddleware} = require('../middlewares/UserMiddleware')
const api = express.Router();

//Create new doctor
api.post('/signup', doctorController.doctorSignUp);
//Add doctor consult
api.post('/:name', authMiddleware, doctorController.Addconsult);

module.exports = api;