// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var alarmas     = require('./models/alarmas');
var unidadController     = require('./controllers/unidadResidencial');
var inmuebleController     = require('./controllers/inmueble');
var hubController     = require('./controllers/hub');
var cerraduraController     = require('./controllers/cerradura');
var claveController = require('./controllers/clave');
var barrioController = require('./controllers/barrio');
var usuarioController = require('./controllers/usuario');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var url = 'mongodb://localhost:27017/ArquiHub';
var mqtt = require('mqtt')                  // importar mqtt
var client  = mqtt.connect('mqtt://172.24.42.92:8083') ///// FALTA CONFIGURAR ESTO, IP de donde está alojado el MQTT
app.use('/healthcheck', require('express-healthcheck')());

//Variables para el Health check
var tiempoSinHealthCheck = 0;
var cadaSegundo;


//CONEXIÓN A BASE DE DATOS
// =================================================================================
mongoose.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database joined");
});
//console.log(mongoose.connection.readyState + "acá");  //Estado de la conexión con MongoDB
var db = mongoose.connection;
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// CONEXION A TOPICO MQTT
// ==============================================================================
client.on('connect', function () {   //Cuando se conecte
  console.log('Se conectó a MQTT');
  client.subscribe('claves')
  client.subscribe('pruebaMQTT')
  client.publish('pruebaMQTT', 'Prueba MQTT Correcta')
  client.subscribe('alarmas')
  client.subscribe('HealthCheck')

  //client.publish('unidadResidencial/inmueble/hub/cerradura/api')
})

client.on('message', function (topic, message) { //Cuando haya un mensaje
  //message is Buffer
  console.log("=======================MENSAJE RECIBIDO EN MQTT=============================")
  console.log('Topico: '+ topic);
  if(topic == 'alarmas'){
   var alarma = new alarmas();      // create a new instance of the Bear model
   var obj = JSON.parse(message);
   alarma.tipo = obj.body.tipo;
   alarma.codigo = obj.body.codigo;
   alarma.descripcion = obj.body.descripcion;
   alarma.unidadResidencial = obj.body.unidadResidencial;
   alarma.propietarioInmueble = obj.body.propietarioInmueble;
   alarma.cerradura = obj.body.cerradura;
  //save the bear and check for errors
  alarma.save(function(err) {
     if (err)
         res.send(err);

     res.json({ message: 'Alarma created!' });
  });
}
  else if(topic == 'HealthCheck')
  {
    tiempoSinHealthCheck = 0;
    clearInterval(cadaSegundo);
    setTimeout(reiniciarInterval,1)
  }
  console.log('Mensaje:  ' + message.toString())
  console.log("===========================================================================")
})
cadaSegundo = setInterval(loop1sec,1000);

//Health Checks recibidos de las cerraduras, loop de un segundo para el health check
function loop1sec() {
  if(tiempoSinHealthCheck > 60)
  {
    console.log("\n CERRADURA FUERA DE SERVICIO \n Tiempo sin servicio aproximado: " + tiempoSinHealthCheck)
    clearInterval(cadaSegundo);
    //cerrarInterval();

    return;
  }
  //console.log("Tiempo: "+tiempoSinHealthCheck)
  tiempoSinHealthCheck ++;
}
function reiniciarInterval()
{
  tiempoSinHealthCheck=0;
  cadaSegundo = setInterval(loop1sec,1000);
}

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening: '+ req.path+ ' ' +req.method);
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  console.log(mongoose.connection.readyState);
});

// more routes for our API will happen here

// on routes that end in /ALARMAS
// ----------------------------------------------------
router.route('/login')


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
        alarma.cerradura = req.body.cerradura;

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

//rutas para barrios
router.route('/barrios')
    .get(barrioController.barrios)
    .post(barrioController.nuevoBarrio);
router.route('/barrios/:nombreBarrio')
    .get(barrioController.darBarrioNombre);
router.route('/barrios/:barrioId')
    .get(barrioController.darBarrio)
    .put(barrioController.editarBarrio)
    .delete(barrioController.borrarBarrio);
router.route('/barrios/:barrioId/unidadResidencial')
    .get(barrioController.darUnidadesBarrio)
    .post(barrioController.nuevaUnidadBarrio);
router.route('/barrios/:idBarrio/mensual')
    .get(barrioController.alarmasMensualPorBarrio);

//ruta para claves
router.route('/claves')
    .get(claveController.claves)
    .post(claveController.nuevaClave)
    .delete(claveController.deleteClaves);
router.route('/claves/:claveId')
    .delete(claveController.deleteClave)
    .put(claveController.editclave);

// ruta de usuarios
// ----------------------------------------------------
router.route('/usuarios')
    .get(usuarioController.darUsuarios)
    .post(usuarioController.nuevoUsuario);
router.route('/usuarios/:usuarioId')
    .get(usuarioController.darUsuario)
    .put(usuarioController.editarUsuario)
    .delete(usuarioController.borrarUsuario);
router.route('/usuarios/:usuarioId/login')
    .post(usuarioController.login);
router.route('/usuarios/:usuarioId/estado')
    .put(usuarioController.editarEstadoUsuario);
router.route('/usuarios/:idUsuario/claves')
    .get(usuarioController.darClavesUsuario)
    .post(usuarioController.nuevaClaveUsuario);

// ruta de /unidadResidencial
// ----------------------------------------------------
router.route('/unidadResidencial')
    .get(unidadController.unidades)
    .post(unidadController.nuevaUnidad);
router.route('/unidadResidencial/:unidadId')
    .get(unidadController.darUnidad)
    .put(unidadController.editarUnidad)
    .delete(unidadController.borrarUnidad);
router.route('/unidadResidencial/:unidadId/estado')
    .put(unidadController.editarEstadoUnidad);
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
router.route('/inmuebles/:inmuebleId/estado')
    .put(inmuebleController.editarEstadoInmueble);
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
router.route('/hubs/:hubId/estado')
    .put(hubController.editarEstadoHub);
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
router.route('/cerraduras/:cerraduraId/estado')
    .put(cerraduraController.editarEstadoCerradura);
router.route('/cerraduras/:cerraduraId/alarma')
    .post(cerraduraController.nuevaAlarmaCerradura);   


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
