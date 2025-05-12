#include <ESP32Servo.h>

const int ldrPin = 34;           // LDR sensor pin
const int motorPin = 21;         // Servo motor pin
const int pirSensor = 22;        // PIR sensor pin
const int ledPin = 23;           // LED pin

Servo myServo;

bool previousMotion = false;

void setup() {
  Serial.begin(115200);

  pinMode(pirSensor, INPUT);
  pinMode(ledPin, OUTPUT);

  myServo.attach(motorPin);
  myServo.write(90); // Neutral position

  Serial.println("System initialized.\n");
}

void handleSensors() {
  // --- PIR (motion detection) ---
  bool motionDetected = digitalRead(pirSensor) == HIGH;

  digitalWrite(ledPin, motionDetected ? HIGH : LOW); // Always update LED

    if (motionDetected) {
      Serial.println("[PIR] Motion detected. LED ON");
    } else {
      Serial.println("[PIR] No motion. LED OFF");
    }

  // --- LDR (light sensor) ---
  int lightValue = analogRead(ldrPin);
  Serial.print("[LDR] Value: ");
  Serial.println(lightValue);

  if (lightValue > 3000) {
    Serial.println("[Servo] Turning motor clockwise (180°)");
    myServo.write(180);
  } else if (lightValue < 1000) {
    Serial.println("[Servo] Turning motor counterclockwise (0°)");
    myServo.write(0);
  } else {
    Serial.println("[Servo] Stopping motor (90°)");
    myServo.write(90);
  }

  Serial.println("-----------------------------");
}

void loop() {
  handleSensors();
  delay(500);
}
