'use strict'

const express = require('express');
const bodyParser = require('body-parser');
var app = express();
var cors = require('cors')
var middlewareAuth = require('./middleware/authentication');

// rutas de la api
var api= require('./routes/alumno');
var apiLogin= require('./routes/login');
var apiProfesor= require('./routes/profesor');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cors());
//middleware para permitir metodos
app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY,Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
  res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
  res.header('Allow','GET, POST, PUT, DELETE')
  next();
});
app.use(middlewareAuth.initialize());
app.use('/profesor',apiProfesor);
app.use('/alumno',api);
app.use('/',apiLogin);
module.exports = app;
