// app/models/cerradura.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var cerradura   = new Schema({
    name: String,
    codigo: String,
    hub:{
      type: Schema.Types.ObjectId,
      ref:'hub'
    },
    alarmas:[{
      type: Schema.Types.ObjectId,
      ref:'alarmas'
    }]
});

module.exports = mongoose.model('cerraduras', cerradura);
