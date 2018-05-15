'use strict'


const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')
var modeloUsuario = require("../models/usuario");


function createToken (user) {
	const payload = {
	sub: user._id,
	iat: moment().unix(),
	exp: moment().add(14, 'days').unix(),
	}

	return jwt.encode(payload, config.SECRET_TOKEN)
}

const decodeToken = function(token) {

	const decoded = new Promise((resolve, reject)=> {
		try {
         
         const payload = jwt.decode(token, config.SECRET_TOKEN)
         
         if(payload.exp <= moment().unix()) {
		reject({
			status:401,
			message:'El token ha expirado'
		})
	  }

	  	resolve(payload.sub)
		} catch(err) {
			reject({
			status: 500,
			message: 'Invalid token'
		})
	   }
	})
	console.log(decoded)
	return decoded
}

function esAdmin (req, res) {
  
  if (decodeToken !== null)
  {
    usuario = new userModel (modeloUsuario.findById(decodeToken.user))
    if (usuario.rol === "admin")
    {
      return true;
    }
      else
    {
    return false;
    }
  }
}

function esSeguridad (req, res) {
  
  if (decodeToken !== null)
  {
    usuario = new userModel (decodeToken.user)
    if (usuario.rol === "seguridad")
    {
      return true;
    }
      else
    {
    return false;
    }
  }
}
function esPropietario (req, res) {
  
  if (decodeToken !== null)
  {
    usuario = new userModel (decodeToken.user)
    if (usuario.rol === "propietario")
    {
      return true;
    }
      else
    {
    return false;
    }
  }
}
module.exports = {
 
 createToken,
 decodeToken,
 esAdmin,
 esSeguridad,
 esPropietario

}