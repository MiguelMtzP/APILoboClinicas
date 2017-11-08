const mongoose = require('mongoose');
var Schema= mongoose.Schema;
var ConsultaSchema=Schema({
  fecha:String,
  id_paciente:String,
  id_cursoAlumno: String,
  id_alumno:String,
  ef: String,
  observaciones: String,
  tratamientos:[{
    id_tratamiento: String,
    nombre:String,
    valido:Boolean

  }]
});
module.exports = mongoose.model('Consulta',ConsultaSchema);
