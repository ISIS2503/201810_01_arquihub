// app/models/usuario.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var usuario   = new Schema({

    email: String,
    name: String,
    password: String,
    estado: Boolean,
    rol: String,
    estado: Boolean,
    claves: [{
      type: Schema.Types.ObjectId,
      ref:'claves'
    }]
});

module.exports = mongoose.model('usuarios', usuario);

