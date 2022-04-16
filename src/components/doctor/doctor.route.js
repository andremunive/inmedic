'use strict'

var express = require("express")
var doctorController = require('./doctor.controller');

var api = express.Router();

//Create new client
api.post('/signup', doctorController.doctorSignUp);
api.post('/login', doctorController.doctorLogin);

module.exports = api;