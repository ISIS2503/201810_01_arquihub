var Clave = require("../models/clave");
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://172.24.42.92:8083')
var mongoose = require('mongoose');
// CONEXION A TOPICO MQTT
// ==============================================================================




module.exports = {
  claves: async (req, res, next) => {
    var Claves = await Clave.find({});
    console.log("Cantidad de claves actual: "+Claves.length);
    res.status(200).json(Claves);

  },
  editclave: async (req, res, next) => {
    var isnum = /^\d+$/.test(req.body.pass);
    if(!isnum)
    {
      res.status(411).json({message: "La clave debe contener únicamente números"});
    }
    else if (req.body.pass.length != 4) {
      res.status(411).json({ message: "La clave debe ser de 4 digitos" });
    } else {
      var claver = await Clave.find({pass:req.body.pass});
      if(claver.length !=0)
      {
        console.log("Ya existe una clave con esa combinación");
        res.status(400).json({message:"Ya existe una clave con esa combinación"});
      }else{
      Clave.findOneAndUpdate({index:req.params.claveId}, {pass: req.body.pass}, {new:true},function(err, result){
        if(err)
        {
          console.log(err)
          res.status(500).json({message: err})
        }
        else
        {
          if(result ==null)
          {
            console.log("Error: No existe ninguna clave con ese id")
            res.status(500).json({message: "No existe ninguna clave con ese id"})
          }
          else
          {
            console.log("La clave con index: "+ req.params.claveId +" fue cambiada a: "+result.pass);
            client.publish('claves', "PUT;"+req.params.claveId+";"+req.body.pass+"$")
            res.status(200).json({message: "Clave editada correctamente"})
          }
        }
    });
    }
  }},
  nuevaClave: async (req, res, next) => {
    var total = await Clave.count();
    var isnum = /^\d+$/.test(req.body.pass);

    if (total >= 20) {
      res.status(411).json({ message: "Ya hay 20 claves" });
      return next();
    } else {
      if(!isnum)
      {
        console.log("Formato de clave incorrecta: La clave debe contener únicamente números");
        res.status(411).json({message: "Formato de clave incorrecta: La clave debe contener únicamente números"});
      }
      else if (req.body.pass.length != 4) {
        console.log("Formato de clave incorrecta: La clave debe ser de 4 digitos");
        res.status(411).json({ message: "Formato de clave incorrecta: La clave debe ser de 4 digitos" });
      } else {
        var claver = await Clave.find({$or: [{index: req.body.index}, {pass:req.body.pass}]});
        console.log("Cantidad de Claves actuales: "+total);
        if(claver.length !=0)
        {
          console.log("Ya existe una clave con esa combinación o con ese index");
          res.status(400).json({error:"Ya existe una clave con esa combinación o con ese index"});
        }
        else{
        var clave = new Clave();
        clave.pass = req.body.pass;
        clave.index = req.body.index;
        client.publish('claves',"POST;"+clave.index+";" + clave.pass + "$")
        clave.save(function(err) {
          if (err) res.send(err);
          res.json({ message: "Clave creada" });
        });
      }}

    }
  },nuevaClaveHorario: async (req, res, next) => {
    var total = await Clave.count();
    var isnum = /^\d+$/.test(req.body.pass);

    if (total >= 20) {
      res.status(411).json({ message: "Ya hay 20 claves" });
      return next();
    }
    else {
        if(!isnum)
        {
          console.log("Formato de clave incorrecta: La clave debe contener únicamente números");
          res.status(411).json({message: "Formato de clave incorrecta: La clave debe contener únicamente números"});
        }
        else if (req.body.pass.length != 4) {
          console.log("Formato de clave incorrecta: La clave debe ser de 4 digitos");
          res.status(411).json({ message: "Formato de clave incorrecta: La clave debe ser de 4 digitos" });
        }
        else {
          var claver = await Clave.find({$or: [{index: req.body.index}, {pass:req.body.pass}]});
          console.log("Cantidad de Claves actuales: "+total);
          if(claver.length !=0)
          {
            console.log("Ya existe una clave con esa combinación o con ese index");
            res.status(400).json({error:"Ya existe una clave con esa combinación o con ese index"});
          }
          else{
            var clave = new Clave();
            clave.pass = req.body.pass;
            clave.index = req.body.index;
            clave.horaInicio= req.body.horaInicio;
            clave.minutoInicio=req.body.minutoInicio;
            clave.horaFin=req.body.horaFin;
            clave.minutoFin=req.body.minutoFin;
            clave.horario=true;
            clave.dias.push(req.body.lunes);
            clave.dias.push(req.body.martes);
            clave.dias.push(req.body.miercoles);
            clave.dias.push(req.body.jueves);
            clave.dias.push(req.body.viernes);
            clave.dias.push(req.body.sabado);
            clave.dias.push(req.body.domingo);
            inicioHorario(clave);
            clave.save(function(err) {
              if (err) res.send(err);
              res.json({ message: "Clave creada" });
            });
          }
      }
    }
  },
  deleteClaves: async (req, res, next) => {
    Clave.remove(function(err) {
      if (err) {
        res.send(err);
      }
      else{
      client.publish('claves',"DELETEALL$")
      res.json({ message: "Claves Borradas" });}
    });
    for (i = 0; i < horario.length; i++) {
        finHorario(horario[i]);
    }
  },deleteClave: async (req, res, next) => {
    var { claveId } = req.params;
    var clave = await Clave.findOneAndRemove({index:req.params.claveId});
    if(clave!=null)
    {
      for (i = 0; i < horario.length; i++) {
        if(horario[i].index==req.params.claveId){
          finHorario(horario[i]);
        }
      }
      client.publish('claves',"DELETE;"+req.params.claveId+"$")
      res.status(200).json({ message: "Clave Borrada Correctamente" });
    }
    else
      {res.status(500).json({message: "No existe una clave con ese Id"});}
  }
};
function inicioHorario(clave){
  // siguiente hora
  var ahora = new Date();
  console.log('lanzado',ahora);
  var momento = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), clave.horaInicio, clave.minutoInicio);
  //proximo dia
  var diaActual = ahora.getDay()+1;
  var difDias = 1;
  if(momento>ahora ){
    diaActual= diaActual-1;
    var difDias = 0;
  }

  while(difDias < 8)
  {
    if(clave.dias[diaActual%7])
    {
      break;
    }
    diaActual= diaActual+1;
    difDias = difDias+1;
  }
  if(difDias < 8){ // la hora era anterior a la hora actual, debo sumar un día
      momento = new Date(momento.getTime()+1000*60*60*24*difDias);
      console.log('para ser ejecutado en',momento);
      clave.timout = setTimeout(function(){
          horaInicio(clave);
      },momento.getTime()-ahora.getTime());
  }
  else{
    console.log("Fin del horario");
  }
}

function horaInicio(clave){
  // POST de clave
  client.publish('claves',"POST;"+clave.index+";" + clave.pass + "$")
  // siguiente hora
  var ahora = new Date();
  console.log('lanzado',ahora);

  var momento = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), clave.horaFin, clave.minutoFin);
  if(momento<=ahora){ // la hora era anterior a la hora actual, debo sumar un día
      momento = new Date(momento.getTime()+1000*60*60*24);
  }
  console.log('para ser ejecutado en',momento);

  clave.timout = setTimeout(function(){
      horaFin();
  },momento.getTime()-ahora.getTime());
}

function horaFin(clave){
  // DELETE de clave
  client.publish('claves',"DELTE;"+clave.index+ "$")
  // siguiente hora
  var ahora = new Date();
  console.log('lanzado',ahora);
  var momento = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), clave.horaInicio, clave.minutoInicio);
  //proximo dia
  var diaActual = ahora.getDay()+1;
  var difDias = 1;
  if(momento>ahora ){
    diaActual= diaActual-1;
    var difDias = 0;
  }

  while(difDias < 7)
  {
    if(clave.dias[diaActual%7])
    {
      break;
    }
    diaActual= diaActual+1;
    difDias = difDias+1;
  }
  if(difDias < 7){ // la hora era anterior a la hora actual, debo sumar un día
      momento = new Date(momento.getTime()+1000*60*60*24*difDias);
      console.log('para ser ejecutado en',momento);
      clave.timout = setTimeout(function(){
          horaInicio(clave);
      },momento.getTime()-ahora.getTime());
  }
  else{
    console.log("Fin del horario");
  }


}

function finHorario(clave){
  clearTimeout(clave.timout);
  console.log("Horario Cancelado");
}
