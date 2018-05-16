var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var seguridad   = new Schema({
  email: String,
  name: String,
  password: String,
  rol: String,
    estado: Boolean,
    unidadesResidenciales: [{
      type: Schema.Types.ObjectId,
      ref:'unidadesResidenciales'
    }]
});

module.exports = mongoose.model("seguridad", seguridad);
