'use strict'
 var mongoose= require('mongoose');
  var Schema= mongoose.Schema;

  var cursoAlumnoSchema= Schema({
    id_curso: String,
    id_alumno:String,
    tratamientos:[{
      id_tratamiento: String,
      cantidad:String
    }]
  });
  module.exports= mongoose.model('CursoAlumno',cursoAlumnoSchema);
