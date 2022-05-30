const express = require("express");
const AppointmentController = require('./AppointmentController.js');
const { paginationMiddleware } = require('../middlewares/PaginationMiddleware');
const { authMiddleware } = require('../middlewares/UserMiddleware');

const api = express.Router();

//Create new client
api.post('/reject', authMiddleware, AppointmentController.reject);

api.post('/approve', authMiddleware, AppointmentController.approve);

api.get('/getByDoctor/:doctorId', authMiddleware, AppointmentController.getAppointmentsByDoctorId);

api.get('/getByClient/:clientId', authMiddleware, AppointmentController.getAppointmentsByClientId);


module.exports = api;