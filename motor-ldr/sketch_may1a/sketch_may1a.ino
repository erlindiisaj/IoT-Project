#include <ESP32Servo.h>

Servo myServo;
const int ldrPin = 18;  // Use GPIO 36 (A0)

void setup() {
  Serial.begin(115200);
  myServo.attach(21); // GPIO 2 for servo
}

void loop() {
  int lightValue = analogRead(ldrPin);  // Read LDR value (0–4095 on ESP32)
  Serial.println(lightValue);

  if (lightValue < 1000) {
    // Dark → rotate clockwise
    myServo.write(0);
  } else if (lightValue > 3000) {
    // Bright → rotate counterclockwise
    myServo.write(180);
  } else {
    // Medium light → stop
    myServo.write(90);
  }

  delay(500);
}
