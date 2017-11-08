const mongoose = require('mongoose');
var Schema= mongoose.Schema;
var CitaSchema= Schema({
  fecha_hora: String,
  id_paciente: String,
  id_alumno: String,
  asunto:String
});
module.exports= mongoose.model('Cita',CitaSchema);
