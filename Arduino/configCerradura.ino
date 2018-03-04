// ===================== General ================
//Button pin
const int CONTACT_PIN = 11;

//choose the pin for the LED
const int ledPin = 22;

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
long currTime;

//Current time when the button is tapped
long currTimeKeypad;

//====================== PIR ==================
//PIR sensor pin 
const int inputPin = 2;

//variable for reading the PIR pin status
int val = 0;

// state of PIR. we start, assuming no motion detected
int pirState = LOW;


//====================== keyboard ===============
#include <Keypad.h>

//Specified password
const String KEY[3] = {"1234","1111","4321"};

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
  pinMode(inputPin, INPUT);     // declare sensor as input
  digitalWrite(ledPin, LOW);
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
      Serial.println("22");
      // We only want to print on the output change, not state
      pirState = HIGH;
    }
  } else {
    digitalWrite(ledPin, LOW); // turn LED OFF
    if (pirState == HIGH){
      // we have just turned of
      Serial.println("23");
      // We only want to print on the output change, not state
      pirState = LOW;
    }
  }
  //===================== button actions ===============
  
  if(!buttonState && !open) {
    if(digitalRead(CONTACT_PIN)) {
      currTime = millis();
      buttonState = true;
      setColor(0, 255, 0);
      open = true;
      attempts = 0;
      Serial.println("16");
    }
  }
  else if(buttonState) {
    if (!digitalRead(CONTACT_PIN)){
      setColor(0, 0, 255);
      open = false;
      buttonState = false;
      Serial.println("17");
    }
  }
  //===================== keypad actions ===============
  char customKey;
  
  if(block) {
    setColor(255, 0, 0);
    if((millis()-currTimeKeypad)>=30000) {
        setColor(0, 0, 255);
        block=false;
        attempts=0;
        Serial.println("1");
      }
  }
  else {
    
    //Selected key parsed;
    customKey = customKeypad.getKey();

    //Verification of input and appended value
    if (customKey) {  
      currentKey+=String(customKey);
      Serial.println(currentKey);
    }
  
    //If the current key contains '*' and door is open
    if(open && currentKey.endsWith("*")) {
      setColor(0, 0, 255);
      open = false;
      Serial.println("17");
      currentKey = "";
    }
    //If the current key contains '#' reset attempt
    if(currentKey.endsWith("#")&&currentKey.length()<=KEY[0].length()) {
      currentKey = "";
      Serial.println("20");
    }             
  
      //If current key matches the key length
      if (currentKey.length()== KEY[0].length() && !open) {
       boolean correct=false;
       for(int i=0; i < 3 && !correct; i++){ 
        if(currentKey == KEY[i]) {
          // se abre la cerradura
          currTime = millis();
          setColor(0, 255, 0);
          open = true;
          Serial.println("16");
          attempts = 0;
          correct=true;
        }
      }
      if(!correct) {
        attempts++;
        currentKey = "";
        setColor(255, 0, 0);
        delay(1000);
        setColor(0, 0, 255);
        Serial.println("44. Intentos: "+String(attempts));
      }
    }else if(currentKey.length()> KEY[0].length()){
      Serial.println("Puerta abierta");
    }
    if(attempts>=maxAttempts) {
      block = true;
      currTimeKeypad = millis();
      setColor(255,0,0);
      Serial.println("29");
    }
  }
  if(open){
    if((millis()-currTime)>=30000) {
      setColor(255, 0, 0);
      Serial.println("50");
    } 
  }

  delay(100);
}

//Method that outputs the RGB specified color
void setColor(int redValue, int greenValue, int blueValue) {
  analogWrite(R_LED_PIN, redValue);
  analogWrite(G_LED_PIN, greenValue);
  analogWrite(B_LED_PIN, blueValue);
}

