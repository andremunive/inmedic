const express = require("express");
const ClientController = require('./client.controller');
const {authCLientMiddleware} = require('./clientMiddleware');

const api = express.Router();

//Create new client
api.post('/signup', ClientController.clientSignup);
api.post('/login', ClientController.ClientLogin);
api.get('/:_id', authCLientMiddleware, ClientController.getDoctor);  

module.exports = api;