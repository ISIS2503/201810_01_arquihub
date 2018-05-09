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
    res.status(200).json(barrio);
  },
  darBarrioNombre: async(req,res,next) =>{
    console.log('get por nombre');
    var {nombreBarrio} = req.params;
    var barrio = await Barrio.find({ name: nombreBarrio });
    res.status(200).json(barrio);
  },
  editarBarrio: async(req,res,next)=>{
    console.log('put barrios');
    var {barrioId}=req.params;
    var newBarrio = req.body;
    var result =await Barrio.findByIdAndUpdate(barrioId,newBarrio);
    res.status(200).json({success:true});
  },
  borrarBarrio: async(req,res,next)=>{
    var {barrioId}=req.params;
    var barrio = await Barrio.remove(barrioId);
    res.status(200).json({ message: 'Borrado Correctamente' });
  },
// servicios de inmuebles por cada unidad Residencial
  darUnidadesBarrio: async(req,res,next) =>{
    console.log('get by id barrio');
    var {barrioId}= req.params;
    var barrio = await Barrio.findById(barrioId).populate('unidadesResidenciales');
    res.status(200).json(barrio);
  },
  alarmasMensualPorBarrio: async(req,res,next) =>{
    console.log('get barrio por nombre');
    var {idBarrio} = req.params;
    var barrio = await Barrio.findById(idBarrio);

    console.log(barrio);
    var unidades = [];
    unidades = barrio.unidadesResidenciales;
    console.log('inmuebles de las unidades');
    console.log(unidades);

if(unidades.length == null)
{
  console.log("no hay unidades");
}
else
{
  for(i = 0; i < unidades.length; i++) {
    
    var idUnidad = unidades[i];
    console.log(idUnidad);
    console.log('inmuebles de cada unidad');
    var inmuebles = [];
    inmuebles = unidades[i].inmuebles;
    console.log(inmuebles);
    
    if (inmuebles.length = 0)
    {
      res.json({error: 'Esta unidad residencial no tiene ningún inmueble'});
    }
    else
    {
        for(i = 0; i < inmuebles.length; i++) {

    var idInmbueble = inmuebles[i]._id;
    console.log('hubs de cada inmueble');
    var hubs = [];
    hubs = await Inmueble.findById(idInmbueble).populate('hubs');

    for (i = 0; i < hubs.length; i++) {

    var idHub = hubs[i]._id;
    console.log('inmuebles de cada unidad');
    var cerraduras = [];
    cerraduras = await UnidadResidencial.findById(idHub).populate('cerraduras');


    for (i = 0; i < cerraduras.length; i++) {

    var idCerradura = cerraduras[i]._id;
    console.log('alarmas de cada cerradura');
    var alarmas = [];
    alarmas = await UnidadResidencial.findById(idCerradura).populate('alarmas');
          
           }

          }
        
         }
       
        }
      }  
    }
  res.json({alarmas});
 },
  nuevaUnidadBarrio: async(req,res,next)=>{

    var {barrioId} = req.params;
    var newUnidad = new UnidadResidencial(req.body);
    var bar = await Barrio.findById(barrioId);
    newUnidad.barrio = bar;
    console.log(bar);
    await newUnidad.save();
    bar.unidadesResidenciales.push(newUnidad);
    await bar.save();
    res.status(201).json(bar);

  }

}