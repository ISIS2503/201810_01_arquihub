'use strict'

const mongoose = require('mongoose')
const userModel = require('../models/usuario')
const service = require('../services')
const session = require('express-session')
const validator = require('express-validator')

function signUp(req, res) {
	
    const user = new userModel({

       email: req.body.email,
       name: req.body.name,
       password: req.body.password,
       rol: req.body.rol
    })

    user.save((err) => {
    if (err) res.status(500).send({message:'Error al crear el usuario: ${err}'})

    return res.status(201).json(user);
    })
}

const logueado = function(req, res) {

   userModel.findOne({ email: req.body.email, password: req.body.password}, (err, user) => {
    
    if (err) {
      return res.status(404).send({ message: 'Este usuario y esta contraseña no existen'})
  }
    else if (!user){
      return res.status(404).send({ message: ' 1Este usuario y esta contraseña no existen'})
    }
    else if(user === null){
      return res.status(404).send({ message: '2Este usuario y esta contraseña no existen'})
    }
    else if (user.length === 0)
    {
      return res.status(404).send({ message: 'Este usuario y esta contraseña no existen3'})
    }
  else {

    req.session.user = user
    req.user = user
    user.estado = true;
    res.status(200).send({
      message: 'Te has logueado',
      token: service.createToken(user)
     })
  }
  console.log(logueado);
 })
}
module.exports = 
{
	signUp,
	logueado
}