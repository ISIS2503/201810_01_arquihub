var Inmueble = require('../models/inmueble');
var Hub = require('../models/hub');


module.exports = {

  inmuebles: async(req,res,next) =>{
    var inmuebles = await Inmueble.find({});
    res.status(200).json(inmuebles);

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
  }
}
