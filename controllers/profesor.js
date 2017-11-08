'use strict'

var jwt = require('jsonwebtoken');
var config= require('../config');
var path= require ('path');

var Curso= require('../models/curso');
var Alumno= require('../models/alumno');
var CursoAlumno= require('../models/cursoAlumno');
var Paciente= require('../models/paciente')
var Cita = require('../models/cita');
var Consulta = require('../models/consulta');
var Profesor = require('../models/profesor');
var Clinica = require('../models/clinica');
var Tratamiento = require('../models/tratamiento');


function getprofes(req,res) {
  Profesor.find({},(err,profes)=>{
    if (err) {
      res.status(500).send({msj:"error en el servidor"})
    }else {
      if (profes.length==0) {
        console.log(profes);
        res.status(403).send({msj:"no hay profesores"});

      }else {

        res.status(200).send({"profes":profes});
      }
    }
  })
}

function getclinicas(req,res) {
  Clinica.find({},(err,clinicas)=>{
    if (err) {
      res.status(500).send({msj:"error en el servidor"})
    }else {
      if (clinicas.length==0) {
        console.log(clinicas);
        res.status(403).send({msj:"no hay clinicas"});

      }else {

        res.status(200).send({"clinicas":clinicas});
      }
    }
  })
}

function gettratamientos(req,res) {
  Tratamiento.find({},(err,tratamientos)=>{
    if (err) {
      res.status(500).send({msj:"error en el servidor"})
    }else {
      if (tratamientos.length==0) {
        console.log(tratamientos);
        res.status(403).send({msj:"no hay tratamientos"});

      }else {

        res.status(200).send({"tratamientos":tratamientos});
      }
    }
  })
}

function setclinica(req,res) {
  let clinica= new Clinica();
  let params= req.body;
  clinica.nombre=params.nombre;
  clinica.save((err,saved)=>{
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }else {
      res.status(200).send({saved:saved});
    }
  });
}
function settratamiento(req,res) {
  let tratamiento= new Tratamiento();
  let params= req.body;
  tratamiento.nombre=params.nombre;
  tratamiento.save((err,saved)=>{
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }else {
      res.status(200).send({saved:saved});
    }
  });
}


function login(req,res) {
  var usr=req.body.correo;
  var pass=req.body.contrasena;

  Profesor.find({"correo":usr,"contrasena":pass},(err,founded)=>{
    if (err) {
      res.status(500).send({msj:"error en el servidor"})
    }else {
      if (founded.length==0) {
        console.log(founded);
        res.status(403).send({msj:"Datos no validos"})

      }else {
        var user= founded[0];
            //tipo 2 identifica a los profesores
        var payload = {"id":user._id,"tipo":2};
        var token = jwt.sign(payload, config.secretOrKey);
        console.log(user);
        res.status(200).send({"token":token,"usr":user});
      }
    }
  });
}

function singin(req,res) {
  let profesor=new Profesor();
  let parametros= req.body;
  profesor.nombre= parametros.nombre;
  profesor.apellidos=parametros.apellidos;
  profesor.correo=parametros.correo;
  profesor.contrasena=parametros.contrasena;

  profesor.save((err,user)=>{
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }else {
      //tipo 2 identifica a los profesores
      var payload = {"id":user._id,"tipo":2};
      var token = jwt.sign(payload, config.secretOrKey);
      console.log(user);
      res.status(200).send({"token":token,"usr":user});
    }
  });
}

function getcursos(req,res) {
  Curso.find({id_profesor:req.user._id},(err,cursos)=>{
    if (err) {
      res.status(500).send({msj:"error en servidor"});
    } else {
      if (cursos.length==0) {
        res.status(403).send({msj:"no hay cursos"});
      } else {
        res.status(200).send({cursos:cursos});
      }
    }
  });
}
function getAlumnos(req,res) {
  let idCurso=req.params.idCurso;
  CursoAlumno.find({id_curso:idCurso},{"tratamientos":0},(err,result)=>{
    if (err) {
      res.status(500).send({msj:"error en servidor"});
    } else {
      if (result.length==0) {
        res.status(403).send({msj:"no hay alumnos inscritos"});
      } else {
        Alumno.populate(result,{path:"id_alumno", select:['nombre','apellidos','correo','matricula']},(err,alumnos)=>{
          if (err) {
            res.status(500).send({msj:"error en servidor"});
          } else {
            res.status(200).send({alumnos:alumnos});
          }
        });
      }
    }
  });
}

function getCurso(req,res) {
  let id= req.params.id;
  Curso.findById(id,(err,curso)=>{
    if (err) {
      res.status(500).send({msj:"error en servidor"});
    } else {
      Clinica.populate(curso,{path:"id_clinica",select:["nombre","tratamientos"]},(err,cursoPopulado)=>{
        if (err) {
          res.status(500).send({msj:"error en servidor"});
        }else {
          Tratamiento.populate(cursoPopulado,{path:"id_clinica.tratamientos.id_tratamiento"},(err,resultado)=>{
            if (err) {
              res.status(500).send({msj:"error en servidor"});
            }else {
              res.status(200).send({curso:resultado});

              /* Ejemplo POPULATE con exclusion

              Alumno.populate(resultado,{path:"alumnos.id_alumno",select:["nombre","correo","matricula","apellidos"]},(err,resultado2)=>{
                if (err) {
                  res.status(500).send({msj:"error en servidor"});
                }else {
                  res.status(200).send({curso:resultado2});
                }
              });*/
            }
          });
        }
      });
    }
  });
}
function saveCurso(req,res) {
  var curso= new Curso();
  var parametros= req.body;
  curso.nombre=parametros.nombre;
  curso.id_clinica=parametros.id_clinica;
  curso.id_profesor=parametros.id_profesor;
  curso.password=parametros.password;
  curso.save((err,saved)=>{
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }else {
      res.status(200).send({curso:saved});
    }
  });
}
function getConsultasPendientes(req,res){
  var alumno=req.params.idAlumno;
  var curso=req.params.idCurso;
  CursoAlumno.find({id_curso:curso,id_alumno:alumno},(err,inscripcion)=>{
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }else {
      var cursoAlumno=inscripcion[0]._id.toString(); //Se convierte a string por que es un object_id
      Consulta.aggregate(
        [
          {
          $match:
              {
                  "id_alumno":alumno,
                  "id_cursoAlumno" : cursoAlumno
              }
          }
          ,{$project:{
                  "observaciones":1,
                  "ef":1,
                  "tratamientos":1,
                  "fecha":1,
                  "id_paciente":1
              }
          },
          {
              $unwind:"$tratamientos"
          },
          {$match:
              {
                  "tratamientos.valido":false
              }
          }
          /*
          */
        ],(err,result)=>{
            if (err) {
              console.log(err);
              res.status(500).send(err);
            }else {
              res.status(200).send({consultas:result});
            }
          })
    }
  });
}
module.exports={
  getprofes,getclinicas,gettratamientos,setclinica,settratamiento,
  login,
  singin,
  getcursos,
  getCurso,
  saveCurso,
  getConsultasPendientes,
  getAlumnos
};
