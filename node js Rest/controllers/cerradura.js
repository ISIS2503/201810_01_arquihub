
var Cerradura = require('../models/cerradura');
var Alarma = require('../models/alarmas');

module.exports = {

  cerraduras: async(req,res,next) =>{
    var cerraduras = await Cerradura.find({});
    res.status(200).json(cerraduras);
  },
  darCerradura: async(req,res,next) =>{
    var {cerraduraId}= req.params;
    var cerradura = await Cerradura.findById(cerraduraId);
    res.status(200).json(cerradura);
  },
  editarCerradura: async(req,res,next)=>{
    var {cerraduraId}=req.params;
    var newCerradura = req.body;
    var result =await Cerradura.findByIdAndUpdate(cerraduraId,newCerradura);
    res.status(200).json({success:true});
  },
  editarEstadoCerradura: async(req,res,next)=>{
    var {cerraduraId}=req.params;
    var cerradura = await Cerradura.findById(cerraduraId);
    cerradura.estado = req.body.estado;
    var result =await Cerradura.findByIdAndUpdate(cerraduraId,cerradura);
    res.status(200).json({success:true});
  },
  nuevaAlarmaCerradura: async(req,res,next)=>{
    var {cerraduraId} = req.params;
    var newAlarma = new Alarma(req.body);
    var cerradura = await Cerradura.findById(cerraduraId);
    newAlarma.cerradura = cerradura;
    await newAlarma.save();
    cerradura.alarmas.push(newAlarma);
    await cerradura.save();
    res.status(201).json(cerradura);
}

}
