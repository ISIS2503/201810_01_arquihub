var Clave = require("../models/clave");
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://172.24.42.92:8083')
var mongoose = require('mongoose');
// CONEXION A TOPICO MQTT
// ==============================================================================




module.exports = {
  claves: async (req, res, next) => {
    var Claves = await Clave.find({});
    console.log(Claves.length);
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
        if(!mongoose.Types.ObjectId.isValid(req.params.claveId))
        {
          res.status(500).json({message: "Id Inválido"});
          console.log("Id Inválido")
        }
        else{
      Clave.findByIdAndUpdate(req.params.claveId, {pass: req.body.pass}, {new:true},function(err, result){
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
            console.log("La clave fue cambiada a: "+result.pass);
            res.status(200).json({message: "Clave editada correctamente"})
          }
        }
    });}
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
        var claver = await Clave.find({pass:req.body.pass});
        console.log(total);
        if(claver.length !=0)
        {
          console.log("Ya existe una clave con esa combinación");
          res.status(400).json({message:"Ya existe una clave con esa combinación"});
        }
        else{
        var clave = new Clave();
        clave.pass = req.body.pass;
        client.publish('claves', clave.pass)
        clave.save(function(err) {
          if (err) res.send(err);
          res.json({ message: "Clave creada" });
        });
      }}

    }
  },
  deleteClaves: async (req, res, next) => {
    Clave.remove(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Claves Borradas" });
    });
  },
  deleteClave: async (req, res, next) => {
    var { claveId } = req.params;
    if(!mongoose.Types.ObjectId.isValid(claveId))
    {
      res.status(500).json({message: "Id Inválido"});
      console.log("Id Inválido")
    }
    else
    {
      var clave = await Clave.findByIdAndRemove(claveId);
      if(clave!=null)
        res.status(200).json({ message: "Clave Borrada Correctamente" });
      else
        res.status(500).json({message: "No existe una clave con ese Id"});
  }}
};
