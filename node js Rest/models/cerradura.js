// app/models/cerradura.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var cerradura   = new Schema({
    name: String,
    codigo: Number,
    estado: Boolean,
    situacion: Number,
    hub:{
      type: Schema.Types.ObjectId,
      ref:'hub'
    },
    alarmas:[{
      type: Schema.Types.ObjectId,
      ref:'alarmas'
    }],
    inmueble:{
      type:Schema.Types.ObjectId,
      ref:'inmuebles'
    }
});

module.exports = mongoose.model('cerraduras', cerradura);
