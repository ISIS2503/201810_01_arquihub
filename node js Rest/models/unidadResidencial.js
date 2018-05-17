// app/models/unidadResidencial.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var unidadResidencial   = new Schema({
    name: String,
    codigo: String,
    estado: Boolean,
    barrio:{
      type: Schema.Types.ObjectId,
      ref:'barrio'
    },
    admin:{
      type: Schema.Types.ObjectId,
      ref:'admin'
    },
   inmuebles: [{
      type: Schema.Types.ObjectId,
      ref:'inmuebles'
    }],
    seguridad:{
      type: Schema.Types.ObjectId,
      ref:'seguridad'
    }
});

module.exports = mongoose.model("unidadesResidenciales", unidadResidencial);
