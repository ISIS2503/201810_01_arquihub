var UnidadResidencial = require('../models/unidadResidencial');
var Inmueble = require('../models/inmueble');
var modeloUsuario = require("../models/usuario");
var Admin = require("../models/admin");
var seguridad = require("../models/seguridad")
var Hub = require('../models/hub');
var Cerradura = require('../models/cerradura');
const services = require('../services');
var jwt = require('jwt-simple');
const config = require('../config')
var auth = require('../middlewares/auth')
var alarmas = require('../models/alarmas')

module.exports = {
  alarmas: async (req, res, err) => {
    token = auth.getToken()
    var id = services.decodiToken(token).u
    if (services.esYale(token)) {
      console.log('get unidades yale')
      var todasUnidades = await alarmas.find({});
      res.status(200).json(todasUnidades);
    } else if (services.esAdmin(token)) {
      console.log('get unidades de un admin');
      var unidadesAdmin = await Admin.findById(services.decodiToken(token).user).populate('unidadesResidenciales');
      var media = await alarmas.find({})
      var ret = [];
      if (media.length > 0) {
        for (i = 0; i < media.length; i++) {
          var m = new alarmas(media[i]);
          if (unidadesAdmin.includes(m.unidadResidencial))
            ret[i] = m;
          }
        res.status(200).json(ret);
      } else if (services.esSeguridad(token)) {
        var unidadesSeguridad = await seguridad.findById(services.decodiToken(token).user).populate('unidadesResidenciales');
        var media = await alarmas.find({})
        var ret = [];
        if (media.length > 0) {
          for (i = 0; i < media.length; i++) {
            var m = new alarmas(media[i]);
            if (unidadesSeguridad.includes(m.unidadResidencial))
              ret[i] = m;
            }
          res.status(200).json(ret);
        } else if (services.esPropietario(token)) {
          var unidadesSeguridad = await modeloUsuario.findById(services.decodiToken(token).user).populate('inmueble');
          console.log(unidadesSeguridad)
          var media = await alarmas.find({})
          var ret = [];
          if (media.length > 0) {
            for (i = 0; i < media.length; i++) {
              var m = new alarmas(media[i]);
              if (unidadesSeguridad.includes(m.inmueble))
                ret[i] = m;
              }
            res.status(200).json(ret);
          }
        }
      }
    }
  }
}