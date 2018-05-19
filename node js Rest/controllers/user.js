'use strict'

const mongoose = require('mongoose')
const yaleModel = require('../models/yale')
const secModel = require('../models/seguridad')
const adminModel = require('../models/admin')
const userModel = require('../models/usuario')
const service = require('../services')
const session = require('express-session')
const validator = require('express-validator')
var auth = require('../middlewares/auth')

const signUp =function(req, res) {
  var token = auth.getToken();
  var user = 1;
  var rol = req.body.rol
  if (rol == "yale") {
    user = new yaleModel(req.body)
  } else if (!service.esYale(token)) {
    res.status(400).json({error: "No tiene permisos para realizar esta accion"})
  } else {
    if (rol == "seguridad")
      user = new secModel(req.body)
    else if (rol == "admin")
      user = new adminModel(req.body)
    else if (rol == "propietario")
      user = new userModel(req.body)
  }
  user.save((err) => {
    if (err)
      res.status(500).send({message: 'Error al crear el usuario: ${err}'})
    return res.status(201).json(user);
  })
}

const logueado = function(req, res) {

  yaleModel.find({
    email: req.body.email,
    password: req.body.password
  }, (err, user) => {
    if (err) {
      return res.status(404).send({message: 'Este usuario y esta contraseña no existen'})
    } else if (user.length > 0) {
      req.session.user = user
      req.user = user
      user.estado = true;
      res.status(200).send({
        message: 'Te has logueado',
        token: service.createToken(user[0])
      })
    } else {
      secModel.find({
        email: req.body.email,
        password: req.body.password
      }, (err, user) => {
        if (err) {
          return res.status(404).send({message: 'Este usuario y esta contraseña no existen'})
        } else if (user.length > 0) {
          req.session.user = user
          req.user = user
          user.estado = true;
          res.status(200).send({
            message: 'Te has logueado',
            token: service.createToken(user[0])
          })
        } else {
          adminModel.find({
            email: req.body.email,
            password: req.body.password
          }, (err, user) => {
            if (err) {
              return res.status(404).send({message: 'Este usuario y esta contraseña no existen'})
            } else if (user.length > 0) {
              req.session.user = user
              req.user = user
              user.estado = true;
              res.status(200).send({
                message: 'Te has logueado',
                token: service.createToken(user[0])
              })
            } else {
              userModel.find({
                email: req.body.email,
                password: req.body.password
              }, (err, user) => {
                if (err) {
                  return res.status(404).send({message: 'Este usuario y esta contraseña no existen'})
                } else if (user.length > 0) {
                  req.session.user = user
                  req.user = user
                  user.estado = true;
                  res.status(200).send({
                    message: 'Te has logueado',
                    token: service.createToken(user[0])
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}
function loginDashboard (username, password,callback){

  secModel.find({
    email: username,
    password: password
  }, (err, user) => {
    if (user.length > 0) {
      console.log("usuario encontrado" + user[0]);
      callback(null, true);
    }
    else{
      callback(null, false);
    }

  });
}
function darInmueblePropietarioInfo(){

}
module.exports = {
  signUp,
  logueado,
  loginDashboard
}
