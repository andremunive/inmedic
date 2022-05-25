const express = require("express");
const ClientController = require('./ClientController');
const { paginationMiddleware } = require('../middlewares/PaginationMiddleware');
const {authMiddleware} = require('../middlewares/UserMiddleware');

const api = express.Router();

//Create new client
api.post('/signup', ClientController.clientSignup);
<<<<<<< HEAD
// Get service
api.post('/services', authMiddleware, paginationMiddleware, ClientController.GetServices);
=======
// MainSearch
api.post('/services', authMiddleware, paginationMiddleware, ClientController.GetServices);
// Get profile doctor
>>>>>>> 98c6fb10fd804a92fcb1a1e99993d8ccf6c15099
api.get('/profile/:idDoctor', authMiddleware, ClientController.ProfileDoctor);

module.exports = api;