var modeloUsuario = require("../models/usuario");
var modeloClave = require("../models/clave");

module.exports = {

  darUsuarios: async (req, res, next) => {
    var usuarios = await modeloUsuario.find({});
    console.log(Claves.usuarios);
    res.status(200).json(usuarios);
  },
  nuevoUsuario: async(req,res,next) =>{

    console.log('post usuarios');
    var newUsuario = new modeloUsuario(req.body);
    var usuario = await newUsuario.save();
    var emailP = req.body.email;
    var passwordP = req.body.password;

    var request = require("request");
 
  var options = { method: 'POST',
  url: 'https://arquihub.auth0.com/dbconnections/signup',
  headers: { 'content-type': 'application/json' },
  body: 
   {
     client_id: '4J0_qCiehUxj8hJIZbg5SbSBUUpHdoWA',
     email:emailP,
     password: passwordP,
     connection: 'Username-Password-Authentication'
   },
  json: true };
request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

    var usuario = await newUsario.save();
    res.status(201).json(usuario);
  },
  darUsuario: async(req,res,next) =>{
    console.log('get by id usuario');
    var {usuarioId} = req.params;
    var usuario = await modeloUsuario.findById(usuarioId);
    res.status(200).json(unidad);
  },
  editarUsuario: async(req,res,next)=>{
    console.log('put usuario');
    var {usuarioId} = req.params;
    var newUsuario = req.body;
    var result =await modeloUsuario.findByIdAndUpdate(usuarioId,newUsuario);
    res.status(200).json({success:true});
  },
  editarEstadoUsuario: async(req,res,next)=>{
    var {usuarioId} = req.params;
    var user = await modeloUsuario.findById(usuarioId);
    user.estado = req.body.estado;
    var result = await modeloUsuario.findByIdAndUpdate(usuarioId,user);
    res.status(200).json({success:true});
  },
  borrarUsuario: async(req,res,next)=>{
    var {usuarioId}=req.params;
    var user = await modeloUsuario.remove(usuarioId);
    res.status(200).json({ message: 'Borrado correctamente' });
  },
// servicios de claves por cada usuario
  darClavesUsuario: async(req,res,next) =>{
    console.log('get by id usuario');
    var {idUsuario} = req.params;
    var usuario = await modeloUsuario.findById(idUsuario).populate('claves');
    res.status(200).json(usuario);
  },
  nuevaClaveUsuario: async(req,res,next)=>{
    var {idUsuario} =req.params;
    var newClave = new modeloClave(req.body);
    var user = await modeloUsuario.findById(idUsuario);
    newClave.unidad = user;
    await newClave.save();
    user.claves.push(newClave);
    await user.save();
    res.status(201).json(newClave);
  }
};
