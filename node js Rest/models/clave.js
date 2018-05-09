var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var clave   = new Schema({
  //Clave debe ser de 4 digitos máximo
    index: Number,
    pass: String,
    horaInicio: Number,
    minutoInicio: Number,
    horaFin: Number,
    minutoFin: Number,
    horario: Boolean,
    dias: [{
      type: Boolean
    }]
});



module.exports = mongoose.model('claves', clave);
