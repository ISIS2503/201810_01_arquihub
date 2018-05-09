var bodyParser = require('body-parser');
var request = require('request');
var axios = require('axios');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://172.24.42.92:8083')
var errores = 0;

client.on('connect', function() { //Cuando se conecte
  //client.publish('unidadResidencial/inmueble/hub/cerradura/api')
})

function getHealthCheck() {
  request('http://localhost:8080/healthcheck', function(error, response, body) {
    if (error) {
      errores++;
      console.log('Tiempo fuera de linea aproximado: ' + (errores*30) + '\n' )
      console.log('Error:', error);
    }
    if (errores > 1) {
      console.log("\n HUB FUERA DE LINEA \n ---------------------------------------------------------")
      console.log('Error detectado:', error);// Print the error if one occurred
      clearInterval(interval);
      client.publish('alarma', "HUB FUERA DE LINEA")
      return;
    }
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    console.log('-------------------------------------------------------------------')
    errores = 0;
  })
};
getHealthCheck();
var interval = setInterval(function() {
  getHealthCheck()
}, 30000)
