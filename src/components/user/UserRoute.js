const express = require("express");
const UserController = require('./UserController');
const {authMiddleware} = require('../middlewares/UserMiddleware');

const api = express.Router();

api.post('/login', UserController.login);
api.put('/:_id', authMiddleware ,UserController.updateUser );
api.post('/logout',authMiddleware, UserController.logOut);
api.delete('/:_id',authMiddleware, UserController.deactivateUser);

module.exports = api;