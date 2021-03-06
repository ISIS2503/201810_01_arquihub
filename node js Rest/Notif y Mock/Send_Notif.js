var https = require('http'); //https usado en internet, creo que no es express
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosquitto.org')
//FALTA QUE SE CONECTA A MQTT Y ARME LA PETICION CON LO QUE DIGA ESA VAINA, WEY
console.log(client);
console.log('empezando');


client.on('connect', function () {
  console.log('conectado al mqtt');
  client.subscribe('alarmas');
  
})

client.on('error', function(error){
	console.log("HUBO UN ERROR DE ALGO");
})
 

 
client.on('message', function (topic, message) {

  console.log('el mensaje que me llego fue: ');
  console.log(message.toString())
  client.end()
})

/**
 * HOW TO Make an HTTP Call - POST
 */
// do a POST request
// create the JSON object
jsonObject = JSON.stringify({
 "emailDestino" : "email@fake.com",
 "email" : "yale@notificacion.fake"
});
 
// prepare the header
var postheaders = {
    'Content-Type' : 'application/json',
    'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
};
 
// the post options
var optionspost = {
    host : 'localhost',
    port : 8080,
    path : '/api/notif',
    method : 'POST',
    headers : postheaders
};
 
console.info('Options prepared:');
console.info(optionspost);
console.info('Do the POST call');
 
// do the POST call
var reqPost = https.request(optionspost, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);
 
    res.on('data', function(d) {
        console.info('POST result:\n');
        process.stdout.write(d);
        console.info('\n\nPOST completed');
    });
});
 
// write the json data
reqPost.write(jsonObject);
reqPost.end();
reqPost.on('error', function(e) {
    console.error(e);
});


