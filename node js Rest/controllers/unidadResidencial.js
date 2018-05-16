var UnidadResidencial = require('../models/unidadResidencial');
var Inmueble = require('../models/inmueble');
var modeloUsuario = require("../models/usuario");
var Admin = require("../models/admin");
var Hub = require('../models/hub');
var Cerradura = require('../models/cerradura');
const services = require('../services');
var jwt = require('jwt-simple');
const config = require('../config')
var auth = require('../middlewares/auth')

module.exports = {
  // servicios de Unidad Residencial
  unidades: async (req, res, next) => {

    //Obtengo el token de la peticion
    token = auth.getToken();
    console.log(services.decodiToken(token))
    if (services.esYale(token)) {
      console.log('get unidades yale')
      var todasUnidades = await UnidadResidencial.find({});
      res.status(200).json(todasUnidades);
    } else if (services.esAdmin(token)) {
      console.log('get unidades de un admin');
      var unidades = await Admin.findById(services.decodeToken.user).populate('unidadesResidenciales');
      res.status(200).json(unidades);
    }
    else if (services.esSeguridad(token)) {
      console.log('get unidades seguridad')
      var unidades = await Admin.findById(services.decodeToken.user).populate('unidadesResidenciales');
      res.status(200).json(unidades);
    }
    else if(services.esPropietario(token)){
      console.log('get unidades propietario')
      var unidades = await Admin.findById(services.decodeToken.user).populate('unidadesResidenciales');
      res.status(200).json(unidades);
    }
  },
  nuevaUnidad: async (req, res, next) => {
    if (services.esAdmin || services.esYale) {
      console.log('post unidades');
      var newUnidad = new UnidadResidencial(req.body);
      var unidad = await newUnidad.save();
      res.status(201).json(unidad);
    }
  },
  darUnidad: async (req, res, next) => {
    if (services.esAdmin || services.esYale) {
      console.log('get by id unidad');
      var {
        unidadId
      } = req.params;
      var unidad = await UnidadResidencial.findById(unidadId);
      res.status(200).json(unidad);
    }
  },
  editarUnidad: async (req, res, next) => {
    if (services.esAdmin || services.esYale) {
      console.log('put unidades');
      var {
        unidadId
      } = req.params;
      var newUnidad = req.body;
      var result = await UnidadResidencial.findByIdAndUpdate(unidadId, newUnidad);
      res.status(200).json({success: true});
    }
  },
  editarEstadoUnidad: async (req, res, next) => {
    if (services.esAdmin || services.esYale) {
      var {
        unidadId
      } = req.params;
      var unidad = await UnidadResidencial.findById(unidadId);
      unidad.estado = req.body.estado;
      var result = await UnidadResidencial.findByIdAndUpdate(unidadId, unidad);
      res.status(200).json({success: true});
    }
  },
  borrarUnidad: async (req, res, next) => {
    if (services.esAdmin || services.esYale) {
      var {
        unidadId
      } = req.params;
      var unidad = await UnidadResidencial.remove(unidadId);
      res.status(200).json({message: 'Borrado Correctamente'});
    }
  },
  // servicios de inmuebles por cada unidad Residencial
  darUnidadInmuebles: async (req, res, next) => {
    if (services.esAdmin || services.esYale) {
      console.log('get by id unidad');
      var {
        unidadId
      } = req.params;
      var unidad = await UnidadResidencial.findById(unidadId).populate('inmuebles');
      res.status(200).json(unidad);
    }
  },
  nuevoUnidadInmueble: async (req, res, next) => {

    if (services.esAdmin || services.esYale) {
      var {
        unidadId
      } = req.params;
      var newInmueble = new Inmueble(req.body);
      var unidadRes = await UnidadResidencial.findById(unidadId);
      newInmueble.unidad = unidadRes;
      await newInmueble.save();
      unidadRes.inmuebles.push(newInmueble);
      await unidadRes.save();
      res.status(201).json(newInmueble);
    }
  }
}
