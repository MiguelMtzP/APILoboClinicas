'use strict'
 var mongoose= require('mongoose');
  var Schema= mongoose.Schema;

  var clinicaSchema= Schema({
    nombre: String,
    tratamientos:[{
      id_tratamiento: String,
      cantidad:String
    }]
  });
  module.exports= mongoose.model('Clinica',clinicaSchema);
