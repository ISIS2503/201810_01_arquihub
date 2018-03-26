var UnidadResidencial = require('../models/unidadResidencial');
var Inmueble = require('../models/inmueble');
var Hub = require('../models/hub');
var Cerradura = require('../models/cerradura');


module.exports = {
// servicios de Unidad Residencial
  unidades: async(req,res,next) =>{
    console.log('get unidades');
    var unidades = await UnidadResidencial.find({});
    res.status(200).json(unidades);
  },
  nuevaUnidad: async(req,res,next) =>{
    console.log('post unidades');
    var newUnidad = new UnidadResidencial(req.body);
    var unidad = await newUnidad.save();
    res.status(201).json(unidad);
  },
  darUnidad: async(req,res,next) =>{
    console.log('get by id unidad');
    var {unidadId}= req.params;
    var unidad = await UnidadResidencial.findById(unidadId);
    res.status(200).json(unidad);
  },
  editarUnidad: async(req,res,next)=>{
    console.log('put unidades');
    var {unidadId}=req.params;
    var newUnidad = req.body;
    var result =await UnidadResidencial.findByIdAndUpdate(unidadId,newUnidad);
    res.status(200).json({success:true});
  },
  editarEstadoUnidad: async(req,res,next)=>{
    var {unidadId}=req.params;
    var unidad = await UnidadResidencial.findById(unidadId);
    unidad.estado = req.body.estado;
    var result =await UnidadResidencial.findByIdAndUpdate(unidadId,unidad);
    res.status(200).json({success:true});
  },
  borrarUnidad: async(req,res,next)=>{
    var {unidadId}=req.params;
    var unidad = await UnidadResidencial.remove(unidadId);
    res.status(200).json({ message: 'Borrado Correctamente' });
  },
// servicios de inmuebles por cada unidad Residencial
  darUnidadInmuebles: async(req,res,next) =>{
    console.log('get by id unidad');
    var {unidadId}= req.params;
    var unidad = await UnidadResidencial.findById(unidadId).populate('inmuebles');
    res.status(200).json(unidad);
  },
  nuevoUnidadInmueble: async(req,res,next)=>{
    var {unidadId}=req.params;
    var newInmueble = new Inmueble(req.body);
    var unidadRes = await UnidadResidencial.findById(unidadId);
    newInmueble.unidad = unidadRes;
    await newInmueble.save();
    unidadRes.inmuebles.push(newInmueble);
    await unidadRes.save();
    res.status(201).json(newInmueble);
  }

}
