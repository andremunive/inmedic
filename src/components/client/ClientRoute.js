const express = require("express");
const ClientController = require('./ClientController');
const {authCLientMiddleware} = require('./ClientMiddleware');
const { paginationMiddleware } = require('./paginationMiddleware');

const api = express.Router();

//Create new client
api.post('/signup', ClientController.clientSignup);
// Get service
api.post('/services/all', authCLientMiddleware, paginationMiddleware, ClientController.GetServices);

module.exports = api;