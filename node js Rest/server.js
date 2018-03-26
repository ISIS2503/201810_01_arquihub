// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var alarmas     = require('./models/alarmas');
var unidadController     = require('./controllers/unidadResidencial');
var inmuebleController     = require('./controllers/inmueble');
var hubController     = require('./controllers/hub');
var cerraduraController     = require('./controllers/cerradura');

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
var url = 'mongodb://localhost:27017/ArquiHub';

mongoose.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database joined");
});
console.log(mongoose.connection.readyState);
var db = mongoose.connection;
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  console.log(mongoose.connection.readyState);
});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------

router.route('/alarmas')

      .get(function(req, res) {
      console.log('entró 1');
      alarmas.find({}, function finded(err, media){
          if(err){
            console.log('error')
          };
          console.log(media);

          var ret = [];

          for(i = 0; i < media.length; i++) {
            var m = new alarmas();
            m.tipo = media[i].tipo;
            m.codigo = media[i].codigo;
            m.fecha = media[i].fecha;
            m.descripcion = media[i].descripcion;
            ret[i] = m;
          }

          res.json({ret});
        }); console.log('ENCONTRÉ LAS ALARMAS');
      })

    .post(function(req, res) {
      const dateformat = require('dateformat');
       let today = new Date();
       var fechita = (dateformat(today, 'dddd, mmmm dS, yyyy, h:MM:ss TT')).toString();
        var alarma = new alarmas();      // create a new instance of the Bear model
        alarma.tipo = req.body.tipo;
        alarma.codigo = req.body.codigo;
        alarma.fecha = (dateformat(new Date(), 'dddd, mmmm dS, yyyy, h:MM:ss TT')).toString();
        alarma.descripcion = req.body.descripcion; 
        alarma.unidadResidencial = req.body.unidadResidencial;
        alarma.propietarioInmueble = req.body.propietarioInmueble;

        // save the bear and check for errors
        alarma.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Alarma creada' });
        });

    });
router.route('/alarmas/propietario/:idPropietario')


      .get(function(req, res) {
      console.log('entró 1');
      alarmas.find(({ 'propietarioInmueble': req.params.idPropietario }), function finded(err, media){
          if(err){
            console.log('error')
          };

          if (media.length > 0)
          {
           var ret = [];

            for(i = 0; i < media.length; i++) {
            var m = new alarmas();
            m.tipo = media[i].tipo;
            m.codigo = media[i].codigo;
            m.fecha = media[i].fecha;
            m.descripcion = media[i].descripcion;
            m.propietarioInmueble = media[i].propietarioInmueble;
            ret[i] = m;
          }
          res.json({ret});
        }
         else 
        {
            console.log('El propietario no tiene inmuebles');
             res.json({error: 'El propietario no tiene inmuebles'});
          }
        });
    });

 router.route('/alarmas/administrador/:idUnidadResidencial')

      .get(function(req, res) {
      console.log('entró al administrador');
      alarmas.find(({ 'unidadResidencial': req.params.idUnidadResidencial}), function finded(err, media){
          if(err){
            console.log('error')
          };
          console.log(media);

          if (media.length > 0)
          {
           var ret = [];

            for(j = 0; j < media.length; j++) {
            var m = new alarmas();
            m.tipo = media[j].tipo;
            m.codigo = media[j].codigo;
            m.fecha = media[j].fecha;
            m.descripcion = media[j].descripcion;
            m.unidadResidencial = media[j].unidadResidencial;
            ret[j] = m;
            console.log("sapoperro");
          }
          console.log("sapoperro5");
          res.json({ret});
        }
         else 
        {
            console.log('Esta unidad residencial no tiene ningún inmueble');
             res.json({error: 'Esta unidad residencial no tiene ningún inmueble'});
          }
        });
    });

// ruta de /unidadResidencial
// ----------------------------------------------------
router.route('/unidadResidencial')
    .get(unidadController.unidades)
    .post(unidadController.nuevaUnidad);
router.route('/unidadResidencial/:unidadId')
    .get(unidadController.darUnidad)
    .put(unidadController.editarUnidad)
    .delete(unidadController.borrarUnidad);
router.route('/unidadResidencial/:unidadId/inmuebles')
    .get(unidadController.darUnidadInmuebles)
    .post(unidadController.nuevoUnidadInmueble);
// ruta de /inmuebles
// ----------------------------------------------------
router.route('/inmuebles')
    .get(inmuebleController.inmuebles);
router.route('/inmuebles/:inmuebleId')
    .get(inmuebleController.darInmueble)
    .put(inmuebleController.editarInmueble);
router.route('/inmuebles/:inmuebleId/hubs')
    .get(inmuebleController.darInmuebleHubs)
    .post(inmuebleController.nuevoInmuebleHub);
// ruta de /hubs
// ----------------------------------------------------
router.route('/hubs')
    .get(hubController.hubs);
router.route('/hubs/:hubId')
    .get(hubController.darHub)
    .put(hubController.editarHub);
router.route('/hubs/:hubId/cerradura')
    .get(hubController.darHubCerraduras)
    .post(hubController.nuevoHubCerradura);
// ruta de /hubs
// ----------------------------------------------------
router.route('/cerraduras')
    .get(cerraduraController.cerraduras);
router.route('/cerraduras/:cerraduraId')
    .get(cerraduraController.darCerradura)
    .put(cerraduraController.editarCerradura);


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
