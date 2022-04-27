const express = require("express");
const ClientController = require('./client.controller');
const {authMiddleware} = require('../../middleware/authMiddleware');

const api = express.Router();

//Create new client
api.post('/signup', ClientController.clientSignup);
api.post('/login', ClientController.ClientLogin);
api.get('/:name', authMiddleware, ClientController.getDoctor);

module.exports = api;