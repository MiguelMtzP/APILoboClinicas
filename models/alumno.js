'use strict'
var  mongoose= require("mongoose");

var Schema = mongoose.Schema;
var AlumnoEsquema=Schema({
    nombre:String,
    apellidos: String,
    matricula: String,
    correo: String,
    contrasena:String
});
module.exports= mongoose.model('Alumno',AlumnoEsquema);
