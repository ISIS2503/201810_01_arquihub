// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var alarmas   = new Schema({

    tipo: String,
    codigo: String,
    fecha: String,
    descripcion: String,
    unidadResidencial: Number,
    propietarioInmueble: Number,
    cerradura:Number
});

module.exports = mongoose.model('alarmas', alarmas);
