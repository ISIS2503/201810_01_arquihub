var modeloUsuario = require("../models/usuario");
var modeloClave = require("../models/clave");

var usuarioIniciado = null;

module.exports = {

  darUsuarios: async (req, res, next) => {
    console.log('get usuarios');
    var usuarios = await modeloUsuario.find({});
    res.status(200).json(usuarios);
  },
  darUsuario: async(req,res,next) =>{
    console.log('get by id usuario');
    var {usuarioId}= req.params;
    var usuario = await modeloUsuario.findById(usuarioId);
    res.status(200).json(usuario);
  },
  editarUsuario: async(req,res,next)=>{
    console.log('password usuario');
    var {usuarioId} = req.params;
    var usuario = await modeloUsuario.findById(usuarioId);

    var emailP = usuario.email;
    var passwordP = usuario.password;
 
    console.log('put usuario');
    var {usuarioId} = req.params;
    var newUsuario = req.body;
    var result = await modeloUsuario.findByIdAndUpdate(usuarioId,newUsuario);
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

    console.log('login usuario');
    var {usuarioId} = req.params;
    var usuario = await modeloUsuario.findById(usuarioId);

    var emailP = usuario.email;
    var passwordP = usuario.password;

    console.log('get by id usuario');
    var {idUsuario} = req.params;
    var usuario = await modeloUsuario.findById(idUsuario).populate('claves');
    res.status(200).json(usuario);
},
  nuevaClaveUsuario: async(req,res,next)=>{

    var {usuarioId} = req.params;
    var usuario = await modeloUsuario.findById(usuarioId);
    console.log(usuario);

    var newClave = new modeloClave(req.body);
    var user = await modeloUsuario.findById(usuarioId);
    newClave.usuario = user;
    await newClave.save();
    user.claves.push(newClave);
    await user.save();
    res.status(201).json(newClave);
  }
};
