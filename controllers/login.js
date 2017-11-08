'use strict'
var Alumno= require('../models/alumno');
var jwt = require('jsonwebtoken');
var config= require('../config');

function login(req,res) {
  var usr=req.body.usr;
  var pass=req.body.password;

  Alumno.find({"matricula":usr,"contrasena":pass},(err,founded)=>{
    if (err) {
      res.status(500).send({msj:"error en el servidor"})
    }else {
      if (founded.length==0) {
        console.log(founded);
        res.status(403).send({msj:"Datos no validos"})

      }else {
        var user= founded[0];
            //tipo 1 identifica a los alumnos
        var payload = {"id":user._id,"tipo":1};
        var token = jwt.sign(payload, config.secretOrKey);
        console.log(user);
        res.status(200).send({"token":token,"usr":user});
      }
    }
  });
}
function singin(req,res) {
  let alumno =new Alumno();
  let parametros= req.body;
  alumno.nombre= parametros.nombre;
  alumno.apellidos=parametros.apellidos;
  alumno.matricula=parametros.matricula;
  alumno.correo=parametros.correo;
  alumno.contrasena=parametros.contrasena;
  alumno.cursos=[];

  alumno.save((err,user)=>{
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }else {
      //tipo 1 identifica a los alumnos
      var payload = {"id":user._id,"tipo":1};
      var token = jwt.sign(payload, config.secretOrKey);
      console.log(user);
      res.status(200).send({"token":token,"usr":user});
    }
  });
}

module.exports={login,singin};
