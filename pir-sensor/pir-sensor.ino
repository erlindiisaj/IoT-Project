const int pirPin = 22;    // GPIO connected to PIR sensor OUT

void setup() {
  Serial.begin(115200);
  pinMode(pirPin, INPUT);    // PIR sensor as input
  Serial.println("PIR Sensor initializing...");
}

void loop() {
  int pirState = digitalRead(pirPin);

  if (pirState == HIGH) {
    Serial.println("Motion detected!");
  } else {
    Serial.println("No motion.");
  }

  delay(500);  // Delay to avoid flooding serial monitor
}
