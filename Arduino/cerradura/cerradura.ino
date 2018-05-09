// ===================== General ================
//Button pin
const int CONTACT_PIN = 11;

//R LED pin
const int R_LED_PIN = 13;

//G LED pin
const int G_LED_PIN = 12;

//B LED pin
const int B_LED_PIN = 10;

//Door state
boolean open;

//Attribute that defines the button state
boolean buttonState;

//Current time when the button is tapped
long currTime = 0;

long currTimeKeypad = 0;

long currTimeBattery = 0;
//======================== health check=======================

long currTimeHealth = 0;

//====================== PIR ==================
//choose the pin for the LED
const int ledPin = 22;

//PIR sensor pin 
const int inputPin = 2;

//variable for reading the PIR pin status
int val = 0;

// state of PIR. we start, assuming no motion detected
int pirState = LOW;
//====================== Batery ================

//Minimum voltage required for an alert
const double MIN_VOLTAGE = 1.2;

//Battery indicator
const int BATTERY_LED = 23;

//Battery measure pin
const int BATTERY_PIN = A0;

//Current battery charge
double batteryCharge;
//====================== Wifi module ===================

//Battery measure pin
const int wifiPin = 24;
boolean     stringComplete = false;
String      inputString = "";

//====================== keyboard ===============
#include <Keypad.h>
#include <EEPROM.h>

struct Clave {
  char name[4];
};

//Keypad rows
const byte ROWS = 4; 

//Keypad columns
const byte COLS = 3;

//Maximum number of attempts allowed
const byte maxAttempts = 3;

//Keypad mapping matrix
char hexaKeys[ROWS][COLS] = {
  {
    '1', '2', '3'
  }
  ,
  {
    '4', '5', '6'
  }
  ,
  {
    '7', '8', '9'
  }
  ,
  {
    '*', '0', '#'
  }
};

//Keypad row pins definition
byte rowPins[ROWS] = {
  9, 8, 7, 6
}; 

//Keypad column pins definition
byte colPins[COLS] = {
  5, 4, 3
};

//Keypad library initialization
Keypad customKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS); 

//Current key variable
String currentKey;

//Number of current attempts
byte attempts;

//If the number of current attempts exceeds the maximum allowed
boolean block; 


void setup() {
  Serial.begin(9600);
  pinMode(R_LED_PIN, OUTPUT);   // declare LED RGB red
  pinMode(G_LED_PIN, OUTPUT);   // declare LED RGB green
  pinMode(B_LED_PIN, OUTPUT);   // declare LED RGB blue
  
  pinMode(CONTACT_PIN,INPUT);
  
  pinMode(ledPin, OUTPUT);      // declare LED as output
  digitalWrite(ledPin, LOW);
  pinMode(inputPin, INPUT);     // declare sensor as input
  
  pinMode(BATTERY_LED,OUTPUT);
  digitalWrite(BATTERY_LED, LOW);  // Ouput pin definition for BATTERY_LED
  pinMode(BATTERY_PIN,INPUT);   //Input pin definition for battery measure
  
  pinMode(wifiPin, OUTPUT);      // declare LED as output
  digitalWrite(wifiPin, LOW);
  
  buttonState = false;
  setColor(0, 0, 255);
  currentKey = "";
  open = false;
  attempts = 0;
  block = false;
  
  
}

void loop() {
  //====================== pir actions =================
  val = digitalRead(inputPin);  // read input value
  if (val == HIGH) {            // check if the input is HIGH
    digitalWrite(ledPin, HIGH);  // turn LED ON
    if (pirState == LOW) {
      // we have just turned on
      // We only want to print on the output change, not state
      pirState = HIGH;
    }
  } else {
    digitalWrite(ledPin, LOW); // turn LED OFF
    if (pirState == HIGH){
      // we have just turned of
      // We only want to print on the output change, not state
      pirState = LOW;
    }
  }
  //===================== battery ==================
  //Value conversion from digital to voltage
  batteryCharge = (analogRead(BATTERY_PIN)*5.4)/1024;
  
  //Measured value comparison with min voltage required
  if(batteryCharge<=MIN_VOLTAGE) {
    if((millis()-currTimeBattery)>=15000) {
      currTimeBattery=millis();
      setColor(255, 0, 0);
      Serial.println("{\"tipo\":\"1\",\"cod\":\"4\",\"ur\":\"2\",\"did\":\"1\"}");

      delay(2000);
      if(open){
        setColor(0, 255, 0);
      }
      else{
        setColor(0, 0, 255);
       }
    } 
    digitalWrite(BATTERY_LED,HIGH);
    
  }
  else {
    digitalWrite(BATTERY_LED,LOW);
  }
  
  //===================== button actions ===============
  
  if(!buttonState && !open) {
    if(digitalRead(CONTACT_PIN)) {
      currTime = millis();
      buttonState = true;
      setColor(0, 255, 0);
      open = true;
      attempts = 0;
    }
  }
  else if(buttonState) {
    if (!digitalRead(CONTACT_PIN)){
      setColor(0, 0, 255);
      open = false;
      buttonState = false;
    }
  }
  //===================== keypad actions ===============
  char customKey;
  
  if(block) {
    setColor(255, 0, 0);
    if((millis()-currTimeKeypad)>=15000) {
        setColor(0, 0, 255);
        block=false;
        attempts=0;
      }
  }
  else {
    
    //Selected key parsed;
    customKey = customKeypad.getKey();

    //Verification of input and appended value
    if (customKey) {  
      currentKey+=String(customKey);
    }
  
    //If the current key contains '*' and door is open
    if(open && currentKey.endsWith("*")) {
      setColor(0, 0, 255);
      open = false;
      currentKey = "";
    }
    //If the current key contains '#' reset attempt
    if(currentKey.endsWith("#")&&currentKey.length()<=4) {
      currentKey = "";
    }             
  
      //If current key matches the key length
    if (currentKey.length()== 4 && !open) {
      
      if(compareKey(currentKey)) {
        // se abre la cerradura
        currTime = millis();
        setColor(0, 255, 0);
        open = true;
        attempts = 0;
      }
      else {
        attempts++;
        currentKey = "";
        setColor(255, 0, 0);
        delay(1000);
        setColor(0, 0, 255);
        Serial.println("{\"tipo\":\"1\",\"cod\":\"1\",\"ur\":\"2\",\"did\":\"1\",\"cant\":\""+String(attempts)+"\"}");
      }
    }
    if(attempts>=maxAttempts) {
      block = true;
      currTimeKeypad = millis();
      setColor(255,0,0);
      Serial.println("{\"tipo\":\"1\",\"cod\":\"2\",\"ur\":\"2\",\"did\":\"1\"}");

    }
  }
  if(open){
    if((millis()-currTime)>=15000) {
      setColor(255, 0, 0);
      Serial.println("{\"tipo\":\"1\",\"cod\":\"3\",\"ur\":\"2\",\"did\":\"1\"}");

    } 
  }
  //=================== receive Data ========================
  receiveData();
  servicios();
  delay(100);
  //=================== Health Check ========================
  if((millis()-currTimeHealth)>=30000) {
      currTimeHealth=millis();
      Serial.println("{\"tipo\":\"2\",\"health\":\"OK\"}");
    } 
}
// ===================== Color ================
//Method that outputs the RGB specified color
void setColor(int redValue, int greenValue, int blueValue) {
  analogWrite(R_LED_PIN, redValue);
  analogWrite(G_LED_PIN, greenValue);
  analogWrite(B_LED_PIN, blueValue);
}
// ===================== Claves ================
void servicios(){
  if(stringComplete){
      stringComplete = false;
      String results[3];
      processCommand(results, inputString);
      inputString="";
      if(results[0]=="POST"){
          addPassword(results[2].toInt(), results[1].toInt());
        }
      else if(results[0]=="PUT"){
          updatePassword(results[2].toInt(), results[1].toInt());
        }
      else if(results[0]=="DELETE"){
          deletePassword(results[1].toInt());
        }
      else if(results[0]=="DELETEALL"){
          deleteAllPasswords();
        }
      else if(results[0]=="connected"){
          digitalWrite(wifiPin, HIGH);
            delay(500);
          digitalWrite(wifiPin, LOW);
          
        }
      else if(results[0]=="subscribed"){
          digitalWrite(wifiPin, HIGH);       
        }     
    }
  }
void receiveData() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '$') {
      stringComplete = true;
      break;
    }
    else{
      inputString += inChar;
      }
  }
  if(inputString != ""){
    Serial.println(inputString);
     if(!stringComplete){
          inputString="";
        }
  }
}

void processCommand(String* result, String command) {
  char buf[command.length()+1];
  String vars = command;
  vars.toCharArray(buf, command.length()+1);
  char *p = buf;
  char *str;
  int i = 0;
  while ((str = strtok_r(p, ";", &p)) != NULL) {
    // delimiter is the semicolon
    result[i] = str;
    i++;
  }
}

// Method that compares a key with stored keys
boolean compareKey(String key) {
  int acc = 3;
  int codif, arg0, arg1; 
  for(int i=0; i<3; i++) {
    codif = EEPROM.read(i);
    while(codif!=0) {
      if(codif%2==1) {
        arg0 = EEPROM.read(acc);
        arg1 = EEPROM.read(acc+1)*256;
        arg1+= arg0;
        if(String(arg1)==key) {
          return true;
        }
      }
      acc+=2;
      codif>>=1;
    }
    acc=(i+1)*16+3;
  }
  return false;
}

//Method that adds a password in the specified index
void addPassword(int val, int index) {
  byte arg0 = val%256;
  byte arg1 = val/256;
  EEPROM.write((index*2)+3,arg0);
  EEPROM.write((index*2)+4,arg1);
  byte i = 1;
  byte location = index/8;
  byte position = index%8;
  i<<=position;
  byte j = EEPROM.read(location);
  j |= i;
  EEPROM.write(location,j);
}

//Method that updates a password in the specified index
void updatePassword(int val, int index) {
  byte arg0 = val%256;
  byte arg1 = val/256;
  EEPROM.write((index*2)+3,arg0);
  EEPROM.write((index*2)+4,arg1);
}

//Method that deletes a password in the specified index
void deletePassword(int index) {
  byte i = 1;
  byte location = index/8;
  byte position = index%8;
  i<<=position;
  byte j = EEPROM.read(location);
  j ^= i;
  EEPROM.write(location,j);
}

//Method that deletes all passwords
void deleteAllPasswords() {
  //Password reference to inactive

  for (int i = 0 ; i < EEPROM.length() ; i++) {
    EEPROM.write(i, 0);
  }
}
