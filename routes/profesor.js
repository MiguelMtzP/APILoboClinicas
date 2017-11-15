'use strict'

const express = require('express');
var ProfesorController =require ('../controllers/profesor');
var api= express.Router();
var middlewareAuth = require('../middleware/authentication');
var multer =require("multer");

api.post('/login',ProfesorController.login);
api.post('/singin',ProfesorController.singin);
api.get('/getcursos',middlewareAuth.authenticate('jwt', { session: false }),ProfesorController.getcursos);
api.get('/getAlumnos/:idCurso',middlewareAuth.authenticate('jwt', { session: false }),ProfesorController.getAlumnos);
api.get('/getInscripcionAlumno/:idCurso/:idAlumno',middlewareAuth.authenticate('jwt', { session: false }),ProfesorController.getInscripcion);
api.get('/getcurso/:id',middlewareAuth.authenticate('jwt', { session: false }),ProfesorController.getCurso);
api.get('/getconsultas-Realizadas-Curso/:idAlumno/:idCurso',middlewareAuth.authenticate('jwt', { session: false }),ProfesorController.getconsultasRealizadasCurso);
api.put('/valida-tratamiento/:idConsulta/:idTratamiento',middlewareAuth.authenticate('jwt', { session: false }),ProfesorController.validaTratamiento);
api.post('/crearCurso',middlewareAuth.authenticate('jwt', { session: false }),ProfesorController.saveCurso);
//api.get('/getprofes',ProfesorController.getprofes);

api.get('/getclinicas',middlewareAuth.authenticate('jwt', { session: false }),ProfesorController.getclinicas);
api.post('/setclinica',ProfesorController.setclinica);
api.get('/gettratamientos',ProfesorController.gettratamientos);
api.post('/settratamiento',ProfesorController.settratamiento);

module.exports = api;
