const express = require("express");
const ConsultController = require('./consultController');
const {authDoctorMiddleware} = require('../doctor/doctorMiddleware');

const api = express.Router();

//Create new client
// api.post('/', authDoctorMiddleware,ConsultController.Consult);

module.exports = api;