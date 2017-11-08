const mongoose = require('mongoose');

var Schema= mongoose.Schema;

var PacienteSchema= Schema({
  nombre:String,
  apellidos:String,
  edad:String,
  sexo:String,
  datos_tutor:{
    nombre:String,
    apellidos:String,
    sexo:String,
    telefono:String,
  },
  telefono:String,
  direccion:String,
  ocupacion:String,
  id_alumno:String,
  app:String,
  ahf:String,
  ef: String
});

module.exports= mongoose.model('Paciente',PacienteSchema);
