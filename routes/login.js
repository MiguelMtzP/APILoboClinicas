'use strict'

const express = require('express');
var loginController =require ('../controllers/login');
var api= express.Router();

api.post('/login',loginController.login);
api.post('/singin',loginController.singin);
module.exports = api;
