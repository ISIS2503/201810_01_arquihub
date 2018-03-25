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
            console.log('errosrasfjabf')
          };
          console.log(media);
          res.json({media});
        }); console.log('JUEPUTA');
      })

    .post(function(req, res) {

        var alarma = new alarmas();      // create a new instance of the Bear model
        alarma.name = req.body.alarma;
        alarma.descripcion = req.body.descripcion;
        alarma.date = req.body.date;
        alarma.codigo = req.body.codigo; // set the bears name (comes from the request)

        // save the bear and check for errors
        alarma.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Alarma created!' });
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
