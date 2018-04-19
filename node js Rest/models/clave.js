var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var clave   = new Schema({
  //Clave debe ser de 4 digitos máximo

    pass: String
});

module.exports = mongoose.model('claves', clave);
