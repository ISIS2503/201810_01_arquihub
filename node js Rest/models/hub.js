// app/models/hub.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var hub   = new Schema({
    name: String,
    codigo: String,
    inmueble:{
      type: Schema.Types.ObjectId,
      ref:'inmueble'
    },
    cerraduras: [{
      type: Schema.Types.ObjectId,
      ref:'cerraduras'
    }]
});

module.exports = mongoose.model('hubs', hub);
