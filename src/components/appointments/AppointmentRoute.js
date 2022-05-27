const express = require("express");
const AppointmentController = require('./AppointmentController.js');
const { paginationMiddleware } = require('../middlewares/PaginationMiddleware');
const { authMiddleware } = require('../middlewares/UserMiddleware');

const api = express.Router();

//Create new client
api.post('/reject', authMiddleware, AppointmentController.reject);

api.get('/getByDoctor/:doctorId', authMiddleware, AppointmentController.getAppointmentsByDoctorId);

module.exports = api;