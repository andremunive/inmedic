const express = require("express");
const ClientController = require('./ClientController');
const {authCLientMiddleware} = require('./ClientMiddleware');
const { paginationMiddleware } = require('./paginationMiddleware');

const api = express.Router();

//Create new client
api.post('/signup', ClientController.clientSignup);
//api.post('/login', ClientController.ClientLogin);
api.get('/services/:specialization', authCLientMiddleware, paginationMiddleware, ClientController.GetServices);
api.post('/logout',authCLientMiddleware, ClientController.logOut)

module.exports = api;