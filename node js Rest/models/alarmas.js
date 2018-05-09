// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var alarmas   = new Schema({

    tipo: String,
    codigo: String,
    fecha: Date,
    descripcion: String,
    cerradura:{
      type: Schema.Types.ObjectId,
      ref:'cerradura'
    }
    inmueble:{
      type: Schema.Types.ObjectId,
      ref:'inmueble'
    }
    unidadResidencial:{
      type: Schema.Type.ObjectId,
      ref:'unidadResidencial'
    }
});

module.exports = mongoose.model('alarmas', alarmas);
