// server.js
//ESTE REST SE DEBE LLAMAR POR OTRO PROGRAMA QUE SI RECIBE DE MQTT, DEBERIA ESCUCHAR EN UN PUERTO
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
//const passport = require('passport');
//const Auth0Strategy = require('passport-auth0');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next){console.log('something is happening omg');
	next();
	})
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
//router.post('/sendNotif', function(req, res) {
    //res.json({ message: 'hooray! welcome to our api!' });
  //  res.send('se envia la notif');
//});
router.route('/notif')
	.post(function(req, res){
		console.log('ME ESTAN LLAMANDO AHHHHH');
		algo = req.body.emailDestino;
		fake = req.body.email;
		
		//res.json({"Message": "Se envia la notif al email" + algo });
		res.send('se envio la notificacion al email ' + algo + ' desde ' + fake);
	});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('things kind of work on port ' + port);
