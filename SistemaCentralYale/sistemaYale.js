var bodyParser = require('body-parser');
var request = require('request');
var axios = require('axios');
var errores = 0;

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
