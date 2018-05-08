// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var alarmas   = new Schema({

    tipo: String,
    codigo: String,
    fecha: String,
    descripcion: String,
    cerradura:{
      type: Schema.Types.ObjectId,
      ref:'cerradura'
    }
});

module.exports = mongoose.model('alarmas', alarmas);
