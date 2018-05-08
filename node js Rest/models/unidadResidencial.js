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
   inmuebles: [{
      type: Schema.Types.ObjectId,
      ref:'inmuebles'
    }]
});

module.exports = mongoose.model("unidadesResidenciales", unidadResidencial);
