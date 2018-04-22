#include <PubSubClient.h>
#include <ESP8266WiFi.h>

//DEFINES
#define TOPIC_SUBSCRIBE        "claves"
#define TOPIC_PUBLISH          "unidadResidencial/inmueble/hub/cerradura"
#define SIZE_BUFFER_DATA       60

//VARIABLES
const char* idDevice = "ArquiHub";
boolean     stringComplete = false;
boolean     init_flag = false;
String      inputString = "";
char        bufferData [SIZE_BUFFER_DATA];

// CLIENTE WIFI & MQTT
WiFiClient    clientWIFI;
PubSubClient  clientMQTT(clientWIFI);

// CONFIG WIFI
const char* ssid = "Rodriguez Gonzalez";
const char* password = "1234rogo";

// CONFIG MQTT
IPAddress serverMQTT (192,168,0,105);
const uint16_t portMQTT = 8083;
// const char* usernameMQTT = "admin";
// const char* passwordMQTT = "admin";

void connectWIFI() {
  // Conectar a la red WiFi
//  Serial.println();
//  Serial.print("Connecting to ");
//  Serial.println(ssid);

  if(WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
    delay(100);
  }

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
//    Serial.print(".");
  }
//  Serial.println("");
  Serial.println("connected$");
//  Serial.println(WiFi.localIP());
}

void reconnectWIFI() {
  // Conectar a la red WiFi
  if(WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
  }

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.write(payload, length);
  Serial.println();
}

void setup() {
  Serial.begin(9600);
  inputString.reserve(100);

  clientMQTT.setServer(serverMQTT, portMQTT);
  clientMQTT.setCallback(callback);
  connectWIFI();
  delay(1000);
}

void processData() {
  boolean conectMQTT;
  if (WiFi.status() == WL_CONNECTED) {
    if(init_flag == false) {
      init_flag = true;

      conectMQTT= false;
      if (!clientMQTT.connected()) {
        // if (!clientMQTT.connect(idDevice, usernameMQTT, passwordMQTT)) {
        if (clientMQTT.connect(idDevice)) {
          conectMQTT = true;
        }
      }
      else {
        conectMQTT = true;
      }

      if(conectMQTT) {
        if(clientMQTT.subscribe(TOPIC_SUBSCRIBE)) {
          Serial.println("subscribed$");
        }
      }
    }
    if (stringComplete && clientMQTT.connected()) {
      if(clientMQTT.publish(TOPIC_PUBLISH, bufferData)) {
        inputString = "";
        stringComplete = false;
      }
      else
      {
        inputString = "";
        stringComplete = false;
       }
      init_flag = false;
    }
  }
  else {
    connectWIFI();
    init_flag = false;
  }
  clientMQTT.loop();
}

void receiveData() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '}') {
      inputString.toCharArray(bufferData, SIZE_BUFFER_DATA);
      stringComplete = true;
    }
  }
  if(inputString != ""){
    Serial.println(inputString);
      if(!stringComplete){
          inputString="";
        }
  }
}

void loop() {
  receiveData();
  processData();
}

