var modeloUsuario = require("../models/usuario");
var modeloClave = require("../models/clave");

var usuarioIniciado = null;

module.exports = {

  darUsuarios: async (req, res, next) => {
    console.log('get usuarios');
    var usuarios = await modeloUsuario.find({});
    res.status(200).json(usuarios);
  },
  login: async(req,res,next) =>{
      
    console.log('login usuario');
    var {usuarioId} = req.params;
    var usuario = await modeloUsuario.findById(usuarioId);

    var emailP = usuario.email;
    var passwordP = usuario.password;

  var request = require("request");
  var options = { method: 'POST',
  url: 'https://arquihub.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: 
   { client_id: 't4imRyiQXZ1mYpStwtGBAzwsuPwQe0Fk', email: emailP, password: passwordP,
    client_secret: 'S15sWA52fApT-VsIp1GAgI0j_ZJWXtofxN--GEOTALyGREfe3oCPJXgMilv-aPxr',
    audience: 'uniandes.edu.co/arquihub',
    grant_type:'client_credentials'},
    json:true };
request(options, function (error, response, body) {
  if (error) throw new Error(error);

console.log(body);
var token = body.access_token;
console.log(token);
});
    res.status(201).json(usuario);

 var usuarioIniciado = usuario;
},
  nuevoUsuario: async(req,res,next) =>{

    console.log('post usuarios');
    var newUsuario = new modeloUsuario(req.body);
    var usuario = await newUsuario.save();
    var emailP = req.body.email;
    var passwordP = req.body.password;
    var rolsito = req.body.rol;

    var request = require("request");
 
  var options = { method: 'POST',
  url: 'https://arquihub.auth0.com/dbconnections/signup',
  headers: { 'content-type': 'application/json' },
  body:
   {
     client_id: 't4imRyiQXZ1mYpStwtGBAzwsuPwQe0Fk',
     email:emailP,
     password: passwordP,
     rol: rolsito,
     connection: 'Username-Password-Authentication'
   },
  json: true };
request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
    res.status(201).json(usuario);
    usuarioIniciado = usuario;
  },
  darUsuario: async(req,res,next) =>{

    console.log('get by id usuario');
    var {usuarioId} = req.params;
    var usuario = await modeloUsuario.findById(usuarioId);
    res.status(200).json(usuario);

  },
  editarUsuario: async(req,res,next)=>{
    console.log('login usuario');
    var {usuarioId} = req.params;
    var usuario = await modeloUsuario.findById(usuarioId);

    var emailP = usuario.email;
    var passwordP = usuario.password;

  var request = require("request");
  var options = { method: 'POST',
  url: 'https://arquihub.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: 
   { client_id: 't4imRyiQXZ1mYpStwtGBAzwsuPwQe0Fk', email: emailP, password: passwordP,
    client_secret: 'S15sWA52fApT-VsIp1GAgI0j_ZJWXtofxN--GEOTALyGREfe3oCPJXgMilv-aPxr',
    audience: 'uniandes.edu.co/arquihub',
    grant_type:'client_credentials'},
    json:true };
request(options, function (error, response, body) {
  if (error) throw new Error(error);

console.log(body);
var token = body.access_token;
console.log(token);
});
    res.status(201).json(usuario);

 var autorizacionUsuario = usuario.rol;

if (autorizacionUsuario.equals("administrador") || autorizacionUsuario.equals("propietario") || autorizacionUsuario.equals("seguridad"))
{
   res.json({error: 'Este usuario no está autorizado para editar otros usuarios'});
}
else {
    console.log('put usuario');
    var {usuarioId} = req.params;
    var newUsuario = req.body;
    var result =await modeloUsuario.findByIdAndUpdate(usuarioId,newUsuario);
    res.status(200).json({success:true});
  }
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

  var request = require("request");
  var options = { method: 'POST',
  url: 'https://arquihub.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: 
   { client_id: 't4imRyiQXZ1mYpStwtGBAzwsuPwQe0Fk', email: emailP, password: passwordP,
    client_secret: 'S15sWA52fApT-VsIp1GAgI0j_ZJWXtofxN--GEOTALyGREfe3oCPJXgMilv-aPxr',
    audience: 'uniandes.edu.co/arquihub',
    grant_type:'client_credentials'},
    json:true };
request(options, function (error, response, body) {
  if (error) throw new Error(error);

console.log(body);
var token = body.access_token;
console.log(token);
});
    res.status(201).json(usuario);

 var autorizacionUsuario = usuario.rol;

if (autorizacionUsuario.equals("administrador") || autorizacionUsuario.equals("seguridad"))
{
   res.json({error: 'Este usuario no está autorizado para ver estas claves'});
}
else {
    console.log('get by id usuario');
    var {idUsuario} = req.params;
    var usuario = await modeloUsuario.findById(idUsuario).populate('claves');
    res.status(200).json(usuario);
  }
},
  nuevaClaveUsuario: async(req,res,next)=>{

    console.log('login usuario');
    var {usuarioId} = req.params;
    var usuario = await modeloUsuario.findById(usuarioId);
    console.log(usuario);
    var autorizacionUsuario = usuario.rol;

if (autorizacionUsuario == "administrador" || autorizacionUsuario == "seguridad")
{
   res.json({error: 'Este usuario no está autorizado para crear claves'});
}
else{
    var newClave = new modeloClave(req.body);
    var user = await modeloUsuario.findById(usuarioId);
    newClave.usuario = user;
    await newClave.save();
    user.claves.push(newClave);
    await user.save();
    res.status(201).json(newClave);
  }
  }
};
