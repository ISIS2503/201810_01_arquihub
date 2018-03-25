
var Cerradura = require('../models/cerradura');

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
  }
}
