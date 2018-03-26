// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var alarmas   = new Schema({
    
    name: String,
    codigo: String,
    date: String,
    descripcion: String,
    unidadResidencial: Number,
    propietarioInmueble: Number,
});

module.exports = mongoose.model('alarmas', alarmas);
