const express = require("express");
const ClientController = require('./ClientController');
const { paginationMiddleware } = require('../middlewares/PaginationMiddleware');
const {authMiddleware} = require('../middlewares/UserMiddleware');

const api = express.Router();

//Create new client
api.post('/signup', ClientController.clientSignup);
// Get service
api.post('/services', authMiddleware, paginationMiddleware, ClientController.GetServices);
api.get('/profile/:idDoctor', authMiddleware, ClientController.ProfileDoctor);

module.exports = api;