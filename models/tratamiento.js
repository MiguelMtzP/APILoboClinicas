'use strict'
 var mongoose= require('mongoose');
 var Schema= mongoose.Schema;

 var tratamientoSchema= Schema({
   nombre:String
 });
  module.exports= mongoose.model('Tratamiento',tratamientoSchema);
