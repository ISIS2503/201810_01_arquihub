var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var admin   = new Schema({
    name: String,
    id: String,
    estado: Boolean,
    unidadesResidenciales: [{
      type: Schema.Types.ObjectId,
      ref:'unidadesResidenciales'
    }]
});

module.exports = mongoose.model("admin", admins);
