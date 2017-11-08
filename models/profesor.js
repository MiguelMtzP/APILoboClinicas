'use strict'
const mongoose = require('mongoose');
var  Schema= mongoose.Schema;

var profesorSchema= Schema({
  nombre:String,
  apellidos:String,
  correo: String,
  contrasena: String
});

module.exports = mongoose.model('Profesor',profesorSchema);
