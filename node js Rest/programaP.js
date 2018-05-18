var mqtt = require('mqtt') // importar mqtt
var client = mqtt.connect('mqtt://m14.cloudmqtt.com:15871',{username:	'ttoxzhcr', password:	'L7dlgbCgXVm-'})
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var http = require('http')
var request = require('request');
var parser = require('json-parser');


client.on('connect', function() { //Cuando se conecte
  console.log('Se conectó a MQTT');
  client.subscribe('claves')
  client.subscribe('pruebaMQTT')
  client.publish('pruebaMQTT', 'Prueba MQTT Correcta')
  client.subscribe('alarmas')
  client.subscribe('HealthCheck')
})
/*
var options = {
  hostname: '172.24.42.123',
  port: 8080,
  path:('/api/alerta'),
  method: 'POST',
  headers:{
    'Content-Type': 'aplication/json',
    'Authorization': 'Bearer FALTAESTO'
  }
}*/

client.on('message', function(topic, message) { //Cuando haya un mensaje
  //message is Buffer
  var erga = {}
  console.log("=======================MENSAJE RECIBIDO EN MQTT=============================")
  console.log('Topico: ' + topic);
  var msg = message.toString();
  if (topic == "alarmas") {
    var obje = JSON.parse(msg)

    var obj = JSON.stringify(obje)

    if (obje.tipo == 1) {//Aquí hacemos la peticion post al servidor principal
      // Set the headers
      console.log(obj)
      var headers = {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YWZjNjNiODY2NmVkZDBjMjQzOGM3MjAiLCJpYXQiOjE1MjY1OTMxMjksImV4cCI6MTUyNzgwMjcyOSwicm9sIjoieWFsZSJ9.0yck4CDXftsqUeRyeLpPL_TaslCCONirskT-H-Y2Wu0'
      }
      // Configure the request
      var options = {
          url: 'http://172.24.42.123:8080/api/alerta',
          method: 'POST',
          headers: headers,

          json:obje
      }
      // Start the request
      request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              // Print out the response body
              console.log(body )
          }
      })
      // // create a new instance of the Bear model
    } else if(obje.tipo == 2) {
      // Set the headers
      var headers = {
        'Content-Type': 'aplication/json',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YWZjNjNiODY2NmVkZDBjMjQzOGM3MjAiLCJpYXQiOjE1MjY1OTMxMjksImV4cCI6MTUyNzgwMjcyOSwicm9sIjoieWFsZSJ9.0yck4CDXftsqUeRyeLpPL_TaslCCONirskT-H-Y2Wu0'
      }
      // Configure the request
      var options = {
          url: 'http://172.24.42.123:8080/api/healthcheck',
          method: 'POST',
          headers: headers,
          body: obj,
          json: true
      }
      // Start the request
      request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              // Print out the response body
              console.log(body)
          }
      })
    }
  }
else{
  console.log("que putas")
}})
