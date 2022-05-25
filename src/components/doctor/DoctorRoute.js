const express = require("express")
const doctorController = require('./DoctorController');
const {authMiddleware} = require('../middlewares/UserMiddleware')
const api = express.Router();

//Create new client
api.post('/signup', doctorController.doctorSignUp);
//Add doctor consult
api.post('/:_id', authMiddleware, doctorController.Addconsult);

module.exports = api;