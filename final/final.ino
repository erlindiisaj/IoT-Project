#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

const char* ssid = "TurkTelekom_TP1DDC_2.4GHz";
const char* password = "CjgEH9q4RDu3";

const int ldrPin = 34;          // LDR sensor
const int micPin = 32;          // Microphone analog input
const int servoPin = 21;        // Servo pin

WebServer server(80);
Servo myServo;

bool servoRunning = false;      // Manual mode toggle
bool autoMode = false;          // Auto (LDR) mode toggle

int soundThreshold = 4000;      // Adjust based on your microphone
unsigned long lastMicTrigger = 0;
unsigned long micDebounceDelay = 1000; // Debounce for sound input

void handleRoot() {
  server.send(200, "text/html", R"rawliteral(
    <h1>ESP32 Servo Control</h1>
    <button onclick="fetch('/on')">Servo ON</button>
    <button onclick="fetch('/off')">Servo OFF</button>
    <button onclick="fetch('/auto')">Auto Mode (LDR)</button>
  )rawliteral");
}

void handleOn() {
  autoMode = false;
  servoRunning = true;
  myServo.write(0);
  server.send(200, "text/plain", "Manual: Servo spinning...");
}

void handleOff() {
  autoMode = false;
  servoRunning = false;
  myServo.write(90);
  server.send(200, "text/plain", "Manual: Servo stopped.");
}

void handleAuto() {
  autoMode = true;
  servoRunning = false;
  server.send(200, "text/plain", "Auto mode enabled (LDR).\n");
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.println(WiFi.localIP());

  myServo.attach(servoPin);
  myServo.write(90);

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
    myServo.write(0);
  } else if (lightValue > 3000) {
    myServo.write(180);
  } else {
    myServo.write(90);
  }
}

void handleMic() {
  int micValue = analogRead(micPin);
  Serial.print("Mic: ");
  Serial.println(micValue);

  if (micValue > soundThreshold && (millis() - lastMicTrigger > micDebounceDelay)) {
    lastMicTrigger = millis();
    servoRunning = !servoRunning;
    myServo.write(servoRunning ? 0 : 90);
    Serial.println(servoRunning ? "Mic: Servo ON" : "Mic: Servo OFF");
  }
}

void loop() {
  server.handleClient();

  if (autoMode) {
    handleLDR();
    delay(500);
  } else {
    handleMic();
    if (servoRunning) {
      myServo.write(0);
    }
  }
}
