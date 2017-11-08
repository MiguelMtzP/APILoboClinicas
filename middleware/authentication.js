'use strict'

var Alumno =require('../models/alumno');
var Profesor =require('../models/profesor');

var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

const config = require('../config');

var strategy = new JwtStrategy(config, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  if (jwt_payload.tipo==1) { // Es un usuario Alumno
    console.log("detecto a alumno======================");
    Alumno.findById(jwt_payload.id,(err,user)=>{
      if (err||!user) {
        console.log("error o no encontro usuario");
        next(null, false);
      }else {
        console.log("middlewareAuth aprobado");
        next(null, user);
      }
    });
  }else {  //es un usuario profesor
    console.log("detecto a Profesor======================");
    Profesor.findById(jwt_payload.id,(err,user)=>{
      if (err||!user) {
        console.log("error o no encontro usuario");
        next(null, false);
      }else {
        console.log("middlewareAuth aprobado");
        next(null, user);
      }
    });
  }

});

passport.use(strategy);

module.exports= passport;
