'use strict'

const express = require('express');
var AlumnoController =require ('../controllers/alumno');
var api= express.Router();
var middlewareAuth = require('../middleware/authentication');
var multer =require("multer");

api.get('/',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.getPerfil);
api.put('/',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.updatePerfil);
api.get('/getFotoPerfil/:id',AlumnoController.getfoto);

api.post('/cargaFotoPerfil',
  middlewareAuth.authenticate('jwt', { session: false }),

  // middleware PARA SUBIR FOTOS
  multer({storage:multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, 'UserProfilePhotos/')
      },
      filename: function (req, file, cb) {
          var ext= file.mimetype.split("/")[1];
          cb(null, req.user.id+"."+ext)
    }
  })
}).single('perfil'),
  AlumnoController.uploadfoto
);

api.get('/cursos',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.getCursos);
api.get('/curso/:idCurso',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.getCurso);
api.get('/misCursos',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.getMisCursos);
api.put('/inscribirCurso/:idCurso',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.inscribirCurso);

api.get('/pacientes',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.getPacientes);
api.get('/paciente/:id',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.getPaciente);
api.post('/paciente',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.savePaciente);
api.put('/paciente/:id',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.updatePaciente);
api.delete('/paciente/:id',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.deletePaciente);

api.post('/consulta',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.addConsulta);
api.get('/consultas/:idPaciente',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.getConsultas);

api.get('/citas',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.getCitas);
api.get('/cita/:id',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.getCita);
api.post('/cita',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.addCita);
api.put('/cita/:id',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.updateCita);
api.delete('/cita/:id',middlewareAuth.authenticate('jwt', { session: false }),AlumnoController.deleteCita);

module.exports = api;
