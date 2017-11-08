'use strict'

var Curso= require('../models/curso');
var Alumno= require('../models/alumno');
var CursoAlumno= require('../models/cursoAlumno');
var Paciente= require('../models/paciente')
var Profesor= require('../models/profesor')
var Cita = require('../models/cita');
var Tratamiento = require('../models/tratamiento');
var Clinica = require('../models/clinica');
var Consulta = require('../models/consulta');
var path= require ('path');

function getfoto(req,res) {

  res.sendFile(path.resolve('./UserProfilePhotos/'+req.params.id+'.jpeg'));
}

function uploadfoto(req,res){
  if (typeof req.file != "undefined") {
    res.send({msj:"ok",subida:req.file})

    }else {
      res.status(500).send({msj:"Fallo al subir foto"})

    }
}

function getPerfil(req,res) {
  res.status(200).send({user:req.user});
}

function updatePerfil(req,res) {
  let cambios=req.body;
  Alumno.findByIdAndUpdate(req.user._id,cambios,(err,updated)=>{
    if (err) {
      console.log(err);
      res.status(406).send(err);
    }else {
      res.status(200).send({msj:"perfil actualizado"});
    }
  });
}
//******************* CONSULTAS **********************+++++
function getConsultas(req,res) {
  let idPaciente= req.params.idPaciente;
  Consulta.find({id_paciente:idPaciente},(err,consultas)=>{
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }else {
      res.status(200).send({consultas:consultas});
    }
  });
}
function addConsulta(req,res){
  let consulta= new Consulta();
  let params = req.body;
  consulta.fecha= params.fecha;
  consulta.id_paciente= params.id_paciente;
  consulta.tratamientos= params.tratamientos;
  consulta.id_cursoAlumno= params.id_cursoAlumno;
  consulta.id_alumno= params.id_alumno;
  consulta.ef= params.ef;
  consulta.observaciones= params.observaciones;

  consulta.save((err,saved)=>{
    if (err) {
      res.status(500).send({msj:"Fallo el servidor"});

    } else {
      res.status(200).send({saved:saved});

    }
  });
}

function getCursos(req,res) {
  Curso.find({},(err,cursos)=>{
    if (err) {
      res.status(500).send({msj:"Fallo el servidor"});
    } else {
      Clinica.populate(cursos,{path:"id_clinica"},(err,cursosP)=>{
        if (err) {
          res.status(500).send({msj:"Fallo el servidor"});
        } else {
          res.status(200).send({cursos:cursosP});
        }
      });
    }
  });
}

function inscribirCurso(req,res) {
    let id_alumno= req.user._id;
    let id_curso=req.params.idCurso;
    let inscripcion=new CursoAlumno();
    inscripcion.id_curso=id_curso;
    inscripcion.id_alumno=id_alumno;
    Curso.findById(id_curso,(err,curso)=>{
      if (err) {
        res.status(500).send({msj:"Fallo el servidor"});

      } else {
        Clinica.findById(curso.id_clinica,(err,clinica)=>{
          if (err) {
            res.status(500).send({msj:"Fallo el servidor"});

          } else {
            inscripcion.tratamientos=clinica.tratamientos;
            inscripcion.save((err,saved)=>{
              if (err) {
                res.status(500).send({msj:"Fallo el servidor"});

              } else {
                res.status(200).send({inscrito:inscripcion});
              }
            });
          }
        })
      }
    })
}

function getMisCursos(req,res) {
  console.log(req.user);

  CursoAlumno.find({id_alumno:req.user._id},(err,result)=>{
    if (err) {
      res.status(500).send({msj:"Fallo el servidor"});
    } else {
      Curso.populate(result,{path:"id_curso"},(err,cursosp)=>{
        if (err) {
          res.status(500).send({msj:"Fallo el servidor"});

        } else {
          Profesor.populate(cursosp,{path:"id_curso.id_profesor", select:['nombre','apellidos']},(err,final)=>{
            if (err) {
              res.status(500).send({msj:"Fallo el servidor"});

            } else {
              Tratamiento.populate(final,{path:"tratamientos.id_tratamiento"},(err,conTratam)=>{
                if (err) {
                  res.status(500).send({msj:"Fallo el servidor"});
                } else {
                  res.status(200).send({cursos:conTratam});
                }
              })

            }
          });
        }
      });
    }
  });
  /*Curso.populate(req.user,{path:"cursos.id_curso"},(err,alumno)=>{
    //  QUEDA PENDIENTE LIMPIEAR EL RESULTADO DEL POPULATE
    if (err) {
      res.status(500).send({msj:"Fallo el metodo populate"})
    }else {
      res.status(200).send({cursos:alumno.cursos});
    }
  });*/
}

function getCurso(req,res) {
  let id_curso=req.params.idCurso;
  let id_usuario=req.user._id;
  let respuesta;

  Curso.findById(id_curso,(err,curso)=>{
    if (err) {
      res.status(500).send({msj:"Fallo el servidor"});
    } else {
      Clinica.populate(curso,{path:"id_clinica"},(err,result)=>{
        if (err) {
          res.status(500).send({msj:"Fallo el servidor"});
        } else {
          Tratamiento.populate(result,{path:"id_clinica.tratamientos.id_tratamiento"},(err,resultado)=>{
            if (err) {
              res.status(500).send({msj:"error en servidor"});
            }else {
              Profesor.populate(resultado,{path:"id_profesor",select:['nombre','apellidos','correo']},(err,final)=>{
                if (err) {
                  res.status(500).send({msj:"error en servidor"});
                } else {
                  respuesta=final;
                  CursoAlumno.find({id_alumno:id_usuario,id_curso:id_curso},(err,founded)=>{
                    if (err) {
                      res.status(500).send({msj:"error en servidor"});
                    } else {
                      if (founded.length>0) {
                        console.log(founded);
                        res.status(200).send({curso:respuesta,inscrito:"si",tratamientos:founded[0].tratamientos});
                      } else {
                        res.status(200).send({curso:respuesta,inscrito:"no"});
                      }
                    }
                  });
                }
              });
            }
          });
        }
      })
    }
  })
}

//================== PACIENTES =====================

function getPacientes(req,res) {
  let id = req.user._id;
  Paciente.find({"id_alumno":id},(err,pacientes)=>{
    if (err) {
      res.status(500).send({msj:"error en el servidor"})
    }else {
      if (pacientes.length==0) {
        res.status(404).send({msj:"El alumno no tiene pacientes asignados"})
      }else {
        res.status(200).send({"pacientes":pacientes});
      }
    }
  });
}

function getPaciente(req,res) {
  let id = req.params.id;
  Paciente.findById(id,(err,paciente)=>{
    if (err) {
      res.status(500).send({msj:"error en el servidor"})
    }else {
      if (!paciente) {
        res.status(404).send({msj:"no se encontro al paciente"})
      }else {
        res.status(200).send({paciente});
      }
    }
  });
}

function savePaciente(req,res) {
  let paciente=new Paciente();
  let p= req.body;
  paciente.nombre=p.nombre;
  paciente.apellidos=p.apellidos;
  paciente.edad=p.edad;
  paciente.sexo=p.sexo;
  paciente.datos_tutor=p.datos_tutor;
  paciente.telefono=p.telefono;
  paciente.direccion=p.direccion;
  paciente.ocupacion=p.ocupacion;
  paciente.id_alumno=req.user._id;
  paciente.app=p.app;
  paciente.ahf=p.ahf;
  paciente.ef=p.ef;

  paciente.save((err,saved)=>{
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }else {
      res.status(200).send(saved);
    }
  });

}

function updatePaciente(req,res) {
  let cambios = req.body;
  let id_paciente= req.params.id;
  Paciente.findByIdAndUpdate(id_paciente,cambios,{},(err,updated)=>{
    if (err) {
      console.log(err);
      res.status(500).send({msj:"error en servidor"});
    }else {
      res.status(200).send({msj:"paciente acualizado"});
    }
  });
}

function deletePaciente(req,res) {
  let id_paciente=req.params.id;
  Cita.find({id_paciente:id_paciente},(err,citas)=>{
    if (err) {
      console.log(err);
      res.status(500).send({msj:"error en servidor"});
    }else {
      if (!citas) {
        console.log("no hay citas que eliminar");
      }else {
        console.log(citas.length);
        for (var i = 0; i < citas.length; i++) {
          citas[i].remove((err,removed)=>{
            if (err) {
              console.log(err+" error al eliminar cita");
              //res.status(500).send({msj:"Error servidor"});
            }else {
              console.log(i+ ".- Cita eliminada correctamente");
            }
          });
        }
      }
    }
  });

  Consulta.find({id_paciente:id_paciente},(err,consultas)=>{
    if (err) {
      console.log(err);
      res.status(500).send({msj:"error en servidor"});
    }else {
      if (!consultas) {
        console.log("no hay consultas que eliminar");
      }else {
        console.log(consultas.length);
        for (var i = 0; i < consultas.length; i++) {
          consultas[i].remove((err,removed)=>{
            if (err) {
              console.log(err+" error al eliminar consulta");
              //res.status(500).send({msj:"Error servidor"});
            }else {
              console.log(i+ ".- consulta eliminada correctamente");
            }
          });
        }
      }
    }
  });


  Paciente.findById(id_paciente,(err,paciente)=>{
    if (err) {
      res.status(500).send({msj:"error en el servidor"});
    }else {
      if (!paciente) {
        res.status(404).send({msj:"no se encontro el paciente"});
      }else {
        paciente.remove((err,removed)=>{
          if (err) {
            res.status(500).send({msj:"error en el servidor"});
          }else {
            res.status(200).send({msj:"Paciente Eliminado correctamente"});
          }
        })
      }
    }
  });
}

function getCitas(req,res) {
  let id = req.user._id;
  Cita.find({"id_alumno":id},(err,citas)=>{
    if (err) {
      res.status(500).send({msj:"error en el servidor"})
    }else {
      if (!citas || citas.length==0) {
        res.status(404).send({msj:"El alumno no tiene Citas pendientes"})
      }else {

        Paciente.populate(citas,{path:"id_paciente"},(err,citas)=>{
          if (err) {
            res.status(500).send({msj:"Fallo el metodo populate 15201"})
          }else {
            res.status(200).send({"citas":citas});
          }
        });
      }
    }
  });
}
 function getCita(req,res) {
   let id = req.params.id;
   Cita.findById(id,(err,cita)=>{
     if (err) {
       res.status(500).send({msj:"Fallo el peticion"})
     }else {
       Paciente.populate(cita,{path:"id_paciente"},(err,cita)=>{
         if (err) {
           res.status(500).send({msj:"Fallo el metodo populate"});
         }else {
           res.status(200).send({"cita":cita});
         }
       });
     }
   });
 }
function addCita (req,res) {
  let cita = new Cita();
  let p=req.body;

  cita.fecha_hora=p.fecha_hora;
  cita.id_paciente=p.id_paciente;
  cita.id_alumno=req.user._id;
  cita.asunto=p.asunto;

  cita.save((err,saved)=>{
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }else {
      res.status(200).send(saved);
    }
  });

}

function updateCita(req,res) {
  let cambios = req.body;
  let id_cita= req.params.id;
  Cita.findByIdAndUpdate(id_cita,cambios,(err,updated)=>{
    if (err) {
      console.log(err);
      res.status(500).send({msj:"error en servidor"});
    }else {
      res.status(200).send({msj:"Cita acualizada"});
    }
  });
}

function deleteCita(req,res) {
  let id_cita=req.params.id;
  Cita.findById(id_cita,(err,cita)=>{
    if (err) {
      res.status(500).send({msj:"error en el servidor"});
    }else {
      if (!cita) {
        res.status(404).send({msj:"no se encontro la cita"});
      }else {
        cita.remove((err,removed)=>{
          if (err) {
            res.status(500).send({msj:"error en el servidor"});
          }else {
            res.status(200).send({msj:"Cita eliminada correctamente"});
          }
        })
      }
    }
  });
}

module.exports={
  getPerfil,
  deleteCita,
  deletePaciente,
  updatePerfil,
  getCurso,
  getCursos,
  getMisCursos,
  savePaciente,
  getPacientes,
  updatePaciente,
  updateCita,
  addCita,
  getCitas,
  getCita,
  uploadfoto,
  inscribirCurso,
  getPaciente,
  getfoto,
  addConsulta,
  getConsultas
}
