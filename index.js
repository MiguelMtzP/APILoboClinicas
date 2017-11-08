'use strict'
var mongoose = require('mongoose');
var app = require("./app");
var puerto= process.env.PORT||3000;

mongoose.connect('mongodb://localhost:27017/DBappPracticasEstoma',(err,res)=>{
  if (err) {
    throw err;
  }else{
    console.log("Conexion a la BD correcta!");
    app.listen(puerto,()=>{
      console.log("Api RestFull funcionando en el puerto: "+puerto);
    })
  }
})
