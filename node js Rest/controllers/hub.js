var Hub = require('../models/hub');
var Cerradura = require('../models/cerradura');

module.exports = {

  hubs: async(req,res,next) =>{
    var hubs = await Hub.find({});
    res.status(200).json(hubs);

  },
  darHub: async(req,res,next) =>{
    var {hubId}= req.params;
    var hub = await Hub.findById(hubId);
    res.status(200).json(hub);
  },
  editarHub: async(req,res,next)=>{
    var {hubId}=req.params;
    var newHub = req.body;
    var result =await Hub.findByIdAndUpdate(hubId,newHub);
    res.status(200).json({success:true});
  },
  editarEstadoHub: async(req,res,next)=>{
    var {hubId}=req.params;
    var hub = await Hub.findById(hubId);
    hub.estado = req.body.estado;
    var result =await Hub.findByIdAndUpdate(hubId,hub);
    res.status(200).json({success:true});
  },
  darHubCerraduras: async(req,res,next) =>{
    var {hubId}=req.params;
    var hub = await Hub.findById(hubId).populate('cerraduras');
    res.status(200).json(hub);
  },
  nuevoHubCerradura: async(req,res,next)=>{
    var {hubId}=req.params;
    var newCerradura= new Hub(req.body);
    var hub = await Hub.findById(hubId);
    newCerradura.hub = hub;
    await newCerradura.save();
    hub.cerraduras.push(newCerradura);
    await hub.save();
    res.status(201).json(newCerradura);
  }
}
