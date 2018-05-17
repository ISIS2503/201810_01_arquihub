// app/models/inmueble.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var inmueble   = new Schema({
    name: String,
    codigo: String,
    estado: Boolean,
    unidad:{
      type: Schema.Types.ObjectId,
      ref:'unidadResidencial'
    },
    hubs: [{
      type: Schema.Types.ObjectId,
      ref:'hubs'
    }],
    propietario:{
      type: Schema.Types.ObjectId,
      ref:'usuarios'
    }
});

module.exports = mongoose.model('inmuebles', inmueble);
