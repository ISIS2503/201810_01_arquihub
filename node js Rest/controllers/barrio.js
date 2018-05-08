var Barrio = require('../models/barrio');
var Inmueble = require('../models/inmueble');
var UnidadResidencial = require('../models/unidadResidencial');


module.exports = {
// servicios de Unidad Residencial
  barrios: async(req,res,next) =>{
    console.log('get barrios');
    var barrios = await Barrio.find({});
    res.status(200).json(barrios);
  },
  nuevoBarrio: async(req,res,next) =>{
    console.log('post unidades');
    var newBarrio = new Barrio(req.body);
    var barrio = await newBarrio.save();
    res.status(201).json(barrio);
  },
  darBarrio: async(req,res,next) =>{
    console.log('get by id barrio');
    var {barrioId}= req.params;
    var barrio = await Barrio.findById(barrioId);
    res.status(200).json(unidad);
  },
  editarBarrio: async(req,res,next)=>{
    console.log('put barrios');
    var {barrioId}=req.params;
    var newBarrio = req.body;
    var result =await Barrio.findByIdAndUpdate(barrioId,newBarrio);
    res.status(200).json({success:true});
  },
  borrarBarrios: async(req,res,next)=>{
    var {barrioId}=req.params;
    var barrio = await Barrio.remove(barrioId);
    res.status(200).json({ message: 'Borrado Correctamente' });
  },
// servicios de inmuebles por cada unidad Residencial
  darUnidadesBarrio: async(req,res,next) =>{
    console.log('get by id barrio');
    var {barrioId}= req.params;
    var barrio = await Barrio.findById(barrioId).populate('barrios');
    res.status(200).json(barrio);
  },
  nuevaUnidadBarrio: async(req,res,next)=>{
    var {barrioId}=req.params;
    var newUnidad = new UnidadResidencial(req.body);
    var bar = await Barrio.findById(barrioId);
    newUnidad.barrio = bar;
    await newUnidad.save();
    bar.unidades.push(newUnidad);
    await bar.save();
    res.status(201).json(newUnidad);
  }

}
