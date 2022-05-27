const express = require("express");
const ClientController = require('./ClientController');
const { paginationMiddleware } = require('../middlewares/PaginationMiddleware');
const { authMiddleware } = require('../middlewares/UserMiddleware');

const api = express.Router();

//Create new client
api.post('/signup', ClientController.clientSignup);
// Get service
api.post('/services', authMiddleware, paginationMiddleware, ClientController.GetServices);

api.get('/profile/:idDoctor', authMiddleware, ClientController.ProfileDoctor);

api.post('/review/:_id', authMiddleware, ClientController.ReviewDoctor);

api.post('/cita', authMiddleware, ClientController.AgendarCita);

api.get('/appointments/:doctorId', authMiddleware, ClientController.getAppointmentsByDoctorId);


module.exports = api;