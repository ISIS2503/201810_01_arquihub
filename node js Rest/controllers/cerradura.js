var Cerradura = require('../models/cerradura');
var Alarma = require('../models/alarmas');
var hub = require('../controllers/hub')

module.exports = {

  cerraduras: async (req, res, next) => {
    var cerraduras = await Cerradura.find({});
    res.status(200).json(cerraduras);
  },
  darCerradura: async (req, res, next) => {
    var {
      cerraduraId
    } = req.params;
    var cerradura = await Cerradura.findById(cerraduraId);
    res.status(200).json(cerradura);
  },
  editarCerradura: async (req, res, next) => {
    var {
      cerraduraId
    } = req.params;
    var newCerradura = req.body;
    var result = await Cerradura.findByIdAndUpdate(cerraduraId, newCerradura);
    res.status(200).json({success: true});
  },
  editarEstadoCerradura: async (req, res, next) => {
    var {
      cerraduraId
    } = req.params;
    var cerradura = await Cerradura.findById(cerraduraId);
    cerradura.estado = req.body.estado;
    var result = await Cerradura.findByIdAndUpdate(cerraduraId, cerradura);
    res.status(200).json({success: true});
  },
  nuevaAlarmaCerradura: async (req, res, next) => {
    var {
      cerraduraId
    } = req.params;
    var newAlarma = new Alarma(req.body);
    var cerradura = await Cerradura.findById(cerraduraId);
    newAlarma.cerradura = cerradura;
    await newAlarma.save();
    cerradura.alarmas.push(newAlarma);
    await cerradura.save();
    res.status(201).json(cerradura);
  },
  cerraduraEnAlarma: async (codigo, situacion) => {
    var cerra = await Cerradura.find({
      codigo: codigo
    }, '_id')
    var cerradur = await Cerradura.find({codigo: codigo})
    var cerri = await Cerradura.findByIdAndUpdate(cerra[0]._id, {situacion: situacion})
    var hubenalarma = await hub.hubEnAlarmas(cerradur[0].hub, situacion)
    if(situacion == 4){
    setTimeout(async () => {
      console.log("cerró");
      await Cerradura.findByIdAndUpdate(cerra[0]._id, {situacion: 1})
    }, 30000)}
  }

}
