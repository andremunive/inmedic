const { Route } = require("express");
const express = require("express");
const UserController = require('./UserController');
const {UserMiddleware} = require('./UserMiddleware');

const api = express.Router();

api.post('/login', UserController.login);
api.post('/:_id', )

module.exports = api;