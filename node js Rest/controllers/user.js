'use strict'

const mongoose = require('mongoose')
const yaleModel = require('../models/yale')
const secModel = require('../models/seguridad')
const adminModel = require('../models/admin')
const userModel = require('../models/usuario')
const service = require('../services')
const session = require('express-session')
const validator = require('express-validator')

function signUp(req, res) {
  var user = 1;
  var rol = req.body.rol
  if (rol == "yale")
    user = new yaleModel(req.body)
  else if (rol == "seguridad")
    user = new secModel(req.body)
  else if (rol == "admin")
    user = new adminModel(req.body)
  else if (user == "propietario")
    user = new userModel(req.body)
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
      res.status(200).send({message: 'Te has logueado', token: service.createToken(user[0])})
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
          res.status(200).send({message: 'Te has logueado', token: service.createToken(user[0])})
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
              res.status(200).send({message: 'Te has logueado', token: service.createToken(user[0])})
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
                  res.status(200).send({message: 'Te has logueado', token: service.createToken(user[0])})
                }
              })}
          })}

      })}})}
    module.exports = {
      signUp,
      logueado
    }
