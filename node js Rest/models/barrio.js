// app/models/barrio.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var barrio   = new Schema({
    name: String,
    estado: Boolean,
    unidadesResidenciales: [{
      type: Schema.Types.ObjectId,
      ref:'unidadesResidenciales'
    }]
});

module.exports = mongoose.model("barrios", barrio);