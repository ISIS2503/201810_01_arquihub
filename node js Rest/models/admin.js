var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var admin   = new Schema({
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

module.exports = mongoose.model("admin", admin);
