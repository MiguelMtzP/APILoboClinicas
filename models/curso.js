var mongoose= require('mongoose');
var Schema=mongoose.Schema;

var CursoSchema= Schema({
  nombre:String,
  id_clinica:String,
  id_profesor:String,
  password:String
});

module.exports= mongoose.model('Curso',CursoSchema);
