'use strict'

var express = require("express")
var clientController = require('./client.controller');

var api = express.Router();

//Create new client
api.post('/signup', clientController.clientSignUp);
api.post('/login', clientController.clientLogin);

module.exports = api;