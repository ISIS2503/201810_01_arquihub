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
  rol: user.rol,
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
	return decoded
}

function esAdmin (token) {
  
  if (decodeToken(token) !== null)
  {
    if(decodeToken(token).rol == "admin")
    {
      return true
    }
    else return false
  }
  else return false
}

function esYale (token) {
  
  
  if (decodeToken(token) !== null)
  {
    if(decodeToken(token).rol == "yale")
    {
      return true
    }
    else return false
  }
  else return false
}

function esSeguridad (token) {
  
  
  if (decodeToken(token) !== null)
  {
    if(decodeToken(token).rol == "seguridad")
    {
      return true
    }
    else return false
  }
  else return false
}
function esPropietario (token) {
  
  if (decodeToken(token) !== null)
  {
    if(decodeToken(token).rol == "propietario")
    {
      return true
    }
    else return false
  }
  else return false
}
module.exports = {
 
 createToken,
 decodeToken,
 esAdmin,
 esSeguridad,
 esPropietario,
 esYale

}