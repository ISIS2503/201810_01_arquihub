var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var yale   = new Schema({
  email: String,
  name: String,
  password: String,
  rol: String,
    estado: Boolean,
});

module.exports = mongoose.model("yale", yale);
