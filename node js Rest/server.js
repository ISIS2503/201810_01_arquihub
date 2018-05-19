// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var alarmas = require('./models/alarmas');
var unidadController = require('./controllers/unidadResidencial');
var inmuebleController = require('./controllers/inmueble');
var hubController = require('./controllers/hub');
var cerraduraController = require('./controllers/cerradura');
var claveController = require('./controllers/clave');
var barrioController = require('./controllers/barrio');
var usuarioController = require('./controllers/usuario');
var alarmaController = require('./controllers/alarma')

var express = require('express'); // call express
var app = express(); // define our app using express

var bodyParser = require('body-parser');
const session = require('express-session');
const validator = require('express-validator');
const hbs = require('express-handlebars');

var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/ArquiHub';

var mqtt = require('mqtt') // importar mqtt
var client = mqtt.connect('mqtt://172.24.42.92:8083')

app.engine('.hbs', hbs({defaultLayout: 'default', extname: '.hbs'}))
app.set('view engine', '.hbs');
app.use('/healthcheck', require('express-healthcheck'));
app.use(validator());
app.use(session({secret: "hs982y4htewforwi", resave: false, saveUninitialized: true}));

const auth = require('./middlewares/auth');
const userCtrl = require('./controllers/user');

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var portSS = process.env.PORT || 3000;
var path = require('path');

//Variables para el Health check
var tiempoSinHealthCheck = 0;
var cadaSegundo;

//CONEXIÓN A BASE DE DATOS
// =============================================================================
mongoose.connect(url, function(err, db) {
  if (err)
    throw err;
  console.log("Database joined");
});
//console.log(mongoose.connection.readyState + "acá");  Estado de la conexión con MongoDB
var db = mongoose.connection;
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port


// =============================================================================
cadaSegundo = setInterval(loop1sec, 1000);

//Health Checks recibidos de las cerraduras, loop de un segundo para el health check
function loop1sec() {
  if (tiempoSinHealthCheck > 60) {
    cerraduraController.cerraduraEnAlarma(1, 2);
    console.log("\n CERRADURA FUERA DE SERVICIO \n Tiempo sin servicio aproximado: " + tiempoSinHealthCheck)
    clearInterval(cadaSegundo);
    return;
  } else if (tiempoSinHealthCheck == 30)
    console.log("HUB FUERA DE LINEA POR 30 SEG")
    //console.log("Tiempo: "+tiempoSinHealthCheck)
  console.log(tiempoSinHealthCheck)
  tiempoSinHealthCheck++;

}

var reiniciarIntervalo = function() {
  if (tiempoSinHealthCheck > 60) {
    cadaSegundo = setInterval(loop1sec, 1000)
  }
  cerraduraController.cerraduraEnAlarma(1, 1);
  tiempoSinHealthCheck = 0;
}
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening: ' + req.path + ' ' + req.method);
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  console.log(mongoose.connection.readyState);
});

// more routes for our API will happen here

//AUTHORIZATION
// =============================================================================

router.route('/signup').post(auth.isAuth, userCtrl.signUp);
router.route('/signin').post(userCtrl.logueado);
router.route('/private').get(auth.isAuth, (req, res) => {
  res.status(200).send({message: 'Tienes acceso'})
})

// rutas sericios REST
// =============================================================================

router.route('/alarmas/silenciar').post(function(req, res) {
  client.publish('alarma', req.body);
});
//Consultar alarmas mensuales para inmueble
router.route('/alarmas/mensual/:idInmueble').get(function(req, res) {
  var cutoff = new Date();
  cutoff.setDate(cutoff.getMonth());
  alarmas.find(({
    'inmueble': req.params.idInmueble,
    'fecha': {
      $eq: cutoff
    }
  }), function finded(err, media) {
    if (err)
      console.log(err)
    if (media.length > 0) {
      var ret = [];
      for (j = 0; j < media.length; j++) {
        var m = new alarmas(media[j]);
        ret[j] = m;
      }
      res.json({ret});
    } else {
      res.json({error: 'Este inmueble no tiene ninguna alarma'})
    }
  })
});

//Consultar alarmas mensuales para unidad Residencial
router.route('/alarmas/mensualUnidad/:idUnidad').get(function(req, res) {
  var cutoff = new Date();
  cutoff.setDate(cutoff.getMonth());
  alarmas.find(({
    'unidadResidencial': req.params.idInmueble,
    'fecha': {
      $eq: cutoff
    }
  }), function finded(err, media) {
    if (err)
      console.log(err)
    if (media.length > 0) {
      var ret = [];
      for (j = 0; j < media.length; j++) {
        var m = new alarmas(media[j]);
        ret[j] = m;
      }
      res.json({ret});
    } else {
      res.json({error: 'Este inmueble no tiene ninguna alarma'})
    }
  })
});

router.route('/alarmas').get(auth.isAuth, alarmaController.alarmas, (req, res) => {});
router.route('/alerta').post(auth.isAuth, alarmaController.llegoAlarma, (req, res) => {});
router.route('/healthcheck').post(auth.isAuth, alarmaController.llegoHealthCheck, (req, res) => {});
//ruta para claves
router.route('/claves').get(claveController.claves).post(claveController.nuevaClave).delete(claveController.deleteClaves);
router.route('/claves/:claveId').delete(claveController.deleteClave).put(claveController.editclave);

//rutas para barrios
router.route('/barrios').get(barrioController.barrios).post(barrioController.nuevoBarrio);
router.route('/barrios/:nombreBarrio').get(barrioController.darBarrioNombre);
router.route('/barrios/:barrioId').get(barrioController.darBarrio).put(barrioController.editarBarrio).delete(barrioController.borrarBarrio);
router.route('/barrios/:barrioId/unidadResidencial').get(barrioController.darUnidadesBarrio).post(barrioController.nuevaUnidadBarrio);
router.route('/barrios/:idBarrio/mensual').get(barrioController.alarmasMensualPorBarrio);

// ruta de usuarios
// ----------------------------------------------------
router.route('/usuarios').get(usuarioController.darUsuarios);
router.route('/usuarios/:usuarioId').get(usuarioController.darUsuario).put(usuarioController.editarUsuario).delete(usuarioController.borrarUsuario);
router.route('/usuarios/:usuarioId/estado').put(usuarioController.editarEstadoUsuario);
router.route('/usuarios/:usuarioId/claves').get(usuarioController.darClavesUsuario).post(usuarioController.nuevaClaveUsuario);

// ruta de /unidadResidencial
// ----------------------------------------------------
router.route('/unidadResidencial').get(auth.isAuth, unidadController.unidades, (req, res) => {}).post(unidadController.nuevaUnidad);
router.route('/unidadResidencial/:unidadId').get(unidadController.darUnidad).put(auth.isAuth, unidadController.editarUnidad, (req, res) => {}).delete(auth.isAuth, unidadController.borrarUnidad, (req, res) => {});
router.route('/unidadResidencial/:unidadId/estado').put(unidadController.editarEstadoUnidad);
router.route('/unidadResidencial/:unidadId/inmuebles').get(unidadController.darUnidadInmuebles).post(unidadController.nuevoUnidadInmueble);
router.route('/unidadResidencial/:unidadId/board').get(auth.isAuth, unidadController.board, (req, res) => {});
router.route('/unidadResidencial/:unidadId/asignarAdmin').post(unidadController.asignarAdminUnidad)
router.route('/unidadResidencial/:unidadId/asignarSeguridad').post(unidadController.asignarSeguridadUnidad)

// ruta de /inmuebles
// ----------------------------------------------------
router.route('/inmuebles').get(auth.isAuth, inmuebleController.inmuebles, (req, res) => {});
router.route('/inmuebles/:inmuebleId').get(inmuebleController.darInmueble).put(inmuebleController.editarInmueble);
router.route('/inmuebles/:inmuebleId/estado').put(inmuebleController.editarEstadoInmueble);
router.route('/inmuebles/:inmuebleId/hubs').get(inmuebleController.darInmuebleHubs).post(inmuebleController.nuevoInmuebleHub);
router.route('/inmuebles/:inmuebleId/asignarPropietario').post(inmuebleController.asignarPropietario);
// ruta de /hubs
// ----------------------------------------------------
router.route('/hubs').get(hubController.hubs);
router.route('/hubs/:hubId').get(hubController.darHub).put(hubController.editarHub);
router.route('/hubs/:hubId/estado').put(hubController.editarEstadoHub);
router.route('/hubs/:hubId/cerradura').get(hubController.darHubCerraduras).post(hubController.nuevoHubCerradura);
// ruta de /hubs
// ----------------------------------------------------

router.route('/cerraduras').get(cerraduraController.cerraduras);
router.route('/cerraduras/:cerraduraId').get(cerraduraController.darCerradura).put(cerraduraController.editarCerradura);
router.route('/cerraduras/:cerraduraId/estado').put(cerraduraController.editarEstadoCerradura);
router.route('/cerraduras/:cerraduraId/alarma').post(cerraduraController.nuevaAlarmaCerradura);
router.route('/cerraduras').get(cerraduraController.cerraduras);
router.route('/cerraduras/:cerraduraId').get(cerraduraController.darCerradura).put(cerraduraController.editarCerradura);
router.route('/cerraduras/:cerraduraId/estado').put(cerraduraController.editarEstadoCerradura);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

exports.reiniciarIntervalo = reiniciarIntervalo;
// web Socket
// =============================================================================

server.listen(portSS, () => {
  console.log('Server Socket listening at port ', portSS);
});
// Routing
app.use(express.static(path.join(__dirname, 'public')));
// Chatroom

var numUsers = 0;

io.on('connection', (socket) => {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('login', (username, password) => {

    // we store the username in the socket session for this client
    var acceso =  userCtrl.loginDashboard(username, password, function(err, result){
      if(result){
        socket.username = username;
        ++numUsers;
        socket.emit('complete_login', {
          numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
          username: socket.username,
          numUsers: numUsers
        });
      }
      else{
        socket.emit('login_error', {
          numUsers: numUsers
        });
      }
    });


  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
