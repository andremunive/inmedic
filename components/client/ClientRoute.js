'use strict'

var express = require("express")
var clientController = require('./ClientController');

var api = express.Router();

//Create new client
api.post('/client', clientController.clientSignUp);

module.exports = api;