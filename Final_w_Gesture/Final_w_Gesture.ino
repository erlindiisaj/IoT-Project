#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <SparkFun_APDS9960.h>

const char* ssid = "TurkTelekom_TP1DDC_2.4GHz";
const char* password = "CjgEH9q4RDu3";

const int ldrPin = 34;          // LDR sensor
const int lightRelayPin = 25;   // Light relay (or LED)
const int servoPin = 21;        // Servo for curtains

WebServer server(80);
Servo myServo;
SparkFun_APDS9960 apds;

bool servoRunning = false;
bool autoMode = false;

void handleRoot() {
  server.send(200, "text/html", R"rawliteral(
    <h1>ESP32 Gesture-Based Control</h1>
    <button onclick="fetch('/on')">Open Curtains</button>
    <button onclick="fetch('/off')">Close Curtains</button>
    <button onclick="fetch('/auto')">Auto Mode (LDR)</button>
  )rawliteral");
}

void handleOn() {
  autoMode = false;
  servoRunning = true;
  myServo.write(0); // Open
  server.send(200, "text/plain", "Curtains opened.");
}

void handleOff() {
  autoMode = false;
  servoRunning = false;
  myServo.write(180); // Close
  server.send(200, "text/plain", "Curtains closed.");
}

void handleAuto() {
  autoMode = true;
  server.send(200, "text/plain", "Auto mode enabled (LDR).");
}

void setup() {
  Serial.begin(115200);

  // WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi connected! IP: ");
  Serial.println(WiFi.localIP());

  // Hardware setup
  pinMode(lightRelayPin, OUTPUT);
  digitalWrite(lightRelayPin, LOW); // Light OFF
  myServo.attach(servoPin);
  myServo.write(90); // Neutral

  // APDS9960 init
  Wire.begin();
  if (apds.init()) {
    Serial.println("APDS-9960 initialized.");
    apds.enableGestureSensor(true);
  } else {
    Serial.println("APDS-9960 init failed!");
    while (1);
  }

  // Server routes
  server.on("/", handleRoot);
  server.on("/on", handleOn);
  server.on("/off", handleOff);
  server.on("/auto", handleAuto);
  server.begin();
}

void handleLDR() {
  int lightValue = analogRead(ldrPin);
  Serial.print("LDR: ");
  Serial.println(lightValue);

  if (lightValue < 1000) {
    myServo.write(180); // Close curtains
  } else if (lightValue > 3000) {
    myServo.write(0);   // Open curtains
  } else {
    myServo.write(90);  // Neutral
  }
}

void handleGesture() {
  if (apds.isGestureAvailable()) {
    int gesture = apds.readGesture();
    switch (gesture) {
      case DIR_UP:
        digitalWrite(lightRelayPin, HIGH);
        Serial.println("Gesture: UP -> Light ON");
        break;
      case DIR_DOWN:
        digitalWrite(lightRelayPin, LOW);
        Serial.println("Gesture: DOWN -> Light OFF");
        break;
      case DIR_LEFT:
        myServo.write(0); // Open
        Serial.println("Gesture: LEFT -> Open Curtains");
        break;
      case DIR_RIGHT:
        myServo.write(180); // Close
        Serial.println("Gesture: RIGHT -> Close Curtains");
        break;
      default:
        Serial.println("Gesture: Unknown");
        break;
    }
  }
}

void loop() {
  server.handleClient();
  handleGesture();

  if (autoMode) {
    handleLDR();
    delay(500);
  }
}
