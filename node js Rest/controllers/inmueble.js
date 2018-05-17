var Inmueble = require('../models/inmueble');
var Hub = require('../models/hub');
var UnidadResidencial = require('../models/unidadResidencial');
var modeloUsuario = require("../models/usuario");
var Admin = require("../models/admin");
var seguridad = require("../models/seguridad")
var Hub = require('../models/hub');
var Cerradura = require('../models/cerradura');
const services = require('../services');
var jwt = require('jwt-simple');
const config = require('../config')
var auth = require('../middlewares/auth')
var mongoose = require('mongoose');

module.exports = {

  inmuebles: async(req,res,next) =>{
    token = auth.getToken();
    if (services.esYale(token)) {

      var todosInmuebles = await Inmueble.find({});
      res.status(200).json(todosInmuebles);
    } else if (services.esAdmin(token)) {

      var inmuebles = await Admin.findById(services.decodeToken.user).populate('unidadesResidenciales').populate('inmuebles');
      res.status(200).json(inmuebles);
    }
    else if (services.esSeguridad(token)) {

      var inmuebles = await seguridad.findById(services.decodeToken.user).populate('unidadesResidenciales').populate('inmuebles');
      res.status(200).json(inmuebles);
    }
    else if(services.esPropietario(token)){
      var inmuebles = await modeloUsuario.findById(services.decodeToken.user).populate('inmuebles');
      res.status(200).json(inmuebles);
    }
  },
  darInmueble: async(req,res,next) =>{
    var {inmuebleId}= req.params;
    var inmueble = await Inmueble.findById(inmuebleId);
    res.status(200).json(inmueble);
  },
  editarInmueble: async(req,res,next)=>{
    var {inmuebleId}=req.params;
    var newInmueble = req.body;
    var result =await Inmueble.findByIdAndUpdate(inmuebleId,newInmueble);
    res.status(200).json({success:true});
  },
  editarEstadoInmueble: async(req,res,next)=>{
    var {inmuebleId}=req.params;
    var inmueble = await Inmueble.findById(inmuebleId);
    inmueble.estado = req.body.estado;
    var result =await Inmueble.findByIdAndUpdate(inmuebleId,inmueble);
    res.status(200).json({success:true});
  },
  darInmuebleHubs: async(req,res,next) =>{
    var {inmuebleId}=req.params;
    var inmueble = await Inmueble.findById(inmuebleId).populate('hubs');
    res.status(200).json(inmueble);
  },
  nuevoInmuebleHub: async(req,res,next)=>{
    var {inmuebleId}=req.params;
    var newHub= new Hub(req.body);
    var inmueble = await Inmueble.findById(inmuebleId);
    newHub.inmueble = inmueble;
    await newHub.save();
    inmueble.hubs.push(newHub);
    await inmueble.save();
    res.status(201).json(newHub);
  },
  asignarPropietario: async(req, res, next)=>{

    var {inmuebleId} = req.params;
    var propietarioId = mongoose.Types.ObjectId(req.body.id);
    var inmueble = await Inmueble.findById(inmuebleId)
    var propietario = await modeloUsuario.findById(propietarioId)
    inmueble.propietario = propietario
    await inmueble.save()
    propietario.inmuebles.push(inmueble);
    await propietario.save();
    res.status(200).json(inmueble.propietario)
  },
  nuevoInmueble: async(req,res,next)=>{

  }
}
