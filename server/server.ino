#include <WiFiS3.h>
#include <Servo.h>
#include <DHT.h>
#include "wifi_creds.h"

#define DHTTYPE DHT22

WiFiServer server(80);
int status = WL_IDLE_STATUS;

const int duration = 15000;

const int ROOMS = 3;  // 3 rooms × 5 devices = 15 pins

int mode[ROOMS] = {-1, -1, -1};

int ledPins[ROOMS] = {-1, -1, -1};
int ledValues[ROOMS] = {0, 0, 0};

int motorPins[ROOMS] = {-1, -1, -1};
Servo servoMotors[ROOMS];
int motorValues[ROOMS] = {0, 0, 0};

int dhtPins[ROOMS] = {-1, -1, -1};
DHT* dht_arr[ROOMS] = {nullptr, nullptr, nullptr};
int dhtValues[ROOMS] = {-100, -100, -100};

int ldrPins[ROOMS] = {-1, -1, -1};
int ldrValues[ROOMS] = {0, 0, 0};

int motionPins[ROOMS] = {-1, -1, -1};
bool motionValues[ROOMS] = {false, false, false};

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  while (status != WL_CONNECTED) {
    Serial.print("Connecting to ");
    Serial.println(WIFI_SSID);
    status = WiFi.begin(WIFI_SSID, WIFI_PASS);
    delay(3000);
  }

  Serial.println("Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.begin();
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    Serial.println("Client connected");
    String request = readRequest(client);

    if (request.startsWith("GET")) {
      handleGetRequest(client, request);
    } else if (request.startsWith("PUT")) {
      handlePutRequest(client, request);
    } else if (request.startsWith("POST")) {
      handlePostRequest(client, request);
    } else if (request.startsWith("DELETE")) {
      handleDeleteRequest(client, request);
    } else {
      sendResponse(client, 405, "error", "Method not allowed.");
    }

    delay(1);
    client.stop();
    Serial.println("Client disconnected");
  }

  checkSensors();
}

// ====== Helper Functions ======

String readRequest(WiFiClient& client) {
  String req = "";
  while (client.connected()) {
    if (client.available()) {
      char c = client.read();
      req += c;
      if (c == '\n' && req.endsWith("\r\n\r\n")) break;
    }
  }
  return req;
}

void handlePostRequest(WiFiClient& client, const String& request) {
  int id = extractParam(request, "id");
  int pin = extractParam(request, "pin");

  if (id < 0 || id >= ROOMS) {
    sendResponse(client, 400, "error", "Invalid room id.");
    return;
  }

  if (request.indexOf("/led") >= 0) {
    handleAssignLed(client, id, pin);
  } else if (request.indexOf("/motor") >= 0) {
    handleAssignMotor(client, id, pin);
  } else if (request.indexOf("/dht") >= 0) {
    handleAssignDht(client, id, pin);
  } else if (request.indexOf("/ldr") >= 0) {
    handleAssignLDR(client, id, pin);
  } else if (request.indexOf("/pir") >= 0) {
    handleAssignMotion(client, id, pin);
  } else {
    sendResponse(client, 404," error", "Invalid POST endpoint.");
  }
}

void handlePutRequest(WiFiClient& client, const String& request) {
  int id = extractParam(request, "id");
  int val = extractParam(request, "val");

  if (id < 0 || id >= ROOMS) {
    sendResponse(client, 400, "error", "Invalid room id.");
    return;
  }

  if (val < 0 || val > 100) {
    sendResponse(client, 400, "error", "Invalid value.");
    return;
  }

  if (request.indexOf("/led") >= 0) {
    switchLed(id, val);
  } else if (request.indexOf("/motor") >= 0) {
    rotateMotor(id, val);
  } else if (request.indexOf("/mode") >= 0){
    if(val != 0 && val != 1){
      sendResponse(client, 400, "error", "Invalid value.");
      return;
  }

    mode[id] = val;
  } else {
    sendResponse(client, 404, "error", "Invalid POST endpoint.");
    return;
  }

  sendResponse(client, 200, "message", "Value updated.");
}

void handleGetRequest(WiFiClient& client, const String& request) {
  int id = extractParam(request, "id");

  if (id < 0 || id >= ROOMS) {
    sendResponse(client, 400, "error", "Invalid room id.");
    return;
  }

  int value = -1;

  if (request.indexOf("/led") >= 0) {
    value = ledValues[id];
  } else if (request.indexOf("/motor") >= 0) {
    value = motorValues[id];
  } else if (request.indexOf("/ldr") >= 0) {
    value = ldrValues[id];
  } else if (request.indexOf("/dht") >= 0) {
    value = dhtValues[id];
  } else if (request.indexOf("/mode") >= 0) {
    value = mode[id];
  } 
  
  if (value == -1) {
    sendResponse(client, 404, "error", "Not initialized.");
    return;
  }
      
  sendResponse(client, 200, "value", String(value));
}

void handleDeleteRequest(WiFiClient& client, const String& request) {
  int id = extractParam(request, "id");

  if (id < 0 || id >= ROOMS) {
    sendResponse(client, 400, "error", "Invalid room id.");
    return;
  }

  if (request.indexOf("/led") >= 0) {
    ledPins[id] = -1;
    ledValues[id] = 0;
  } else if (request.indexOf("/motor") >= 0) {
    motorPins[id] = -1;
    motorValues[id] = 0;
    if (servoMotors[id].attached()) {
      servoMotors[id].detach();  // Detach servo to release control
    }
  } else if (request.indexOf("/ldr") >= 0) {
    ldrPins[id] = -1;
    ldrValues[id] = 0;
  } else if (request.indexOf("/dth") >= 0) {
    dhtPins[id] = -1;
    dhtValues[id] = -100;
    if (dht_arr[id] != nullptr) {
        delete dht_arr[id];      // Free the memory
        dht_arr[id] = nullptr;   // Prevent dangling pointer
    }
  } else if (request.indexOf("/pir") >= 0) {
    motionPins[id] = -1;
    motionValues[id] = false;
  } else {
    sendResponse(client, 400, "error", "Endpoint not found.");
    return;
  }
      
  sendResponse(client, 200, "success", "true");
}

int extractParam(const String& req, const String& key) {
  int idx = req.indexOf(key + "=");
  if (idx >= 0) {
    int endIdx = req.indexOf('&', idx);
    if (endIdx == -1) endIdx = req.indexOf(' ', idx);
    if (endIdx == -1) endIdx = req.length();
    String value = req.substring(idx + key.length() + 1, endIdx);
    return value.toInt();
  }
  return -1;
}

void sendResponse(WiFiClient& client, int code, const String& key, const String& value) {
  client.print("HTTP/1.1 ");
  client.print(code);
  client.println(code == 200 ? " OK" : " Error");
  client.println("Content-Type: application/json");
  client.println("Connection: close");
  client.println();

  // Create a JSON-like response string
  String json = "{ \"" + key + "\": \"" + value + "\" }";
  client.println(json);
}

void sendResponse(WiFiClient& client, int code, const String& jsonPayload) {
  client.print("HTTP/1.1 ");
  client.print(code);
  client.println(code == 200 ? " OK" : " Error");
  client.println("Content-Type: application/json");
  client.println("Connection: close");
  client.println();

  client.println(jsonPayload); // Must be valid JSON
}

// ====== API Endpoint Handlers ======

void notifyBackend(const String& type, int id, const String& action, int prevValue, int value) {
  WiFiClient client;
  const char* host = "192.168.1.104";  // Replace with your backend host

  if (client.connect(host, 80)) {
    // Build the JSON payload
    String payload = "{";
    payload += "\"room_id\": " + String(id) + ",";
    payload += "\"type\": " + type + ",";
    payload += "\"action\": \"" + action + "\",";
    payload += "\"mode\": \"auto\",";
    payload += "\"prev_value\": " + String(prevValue) + ",";
    payload += "\"value\": " + String(value);
    payload += "}";

    // Send HTTP POST request
    client.println("POST /event HTTP/1.1");
    client.println("Host: " + String(host));
    client.println("Content-Type: application/json");
    client.println("Content-Length: " + String(payload.length()));
    client.println();
    client.print(payload);

    delay(10);  // Allow time for server to process

    while (client.available()) {
      client.read();  // Optionally handle response
    }

    client.stop();
    
  } else {
    Serial.println("Connection to backend failed.");
  }
}

void handleAssignLed(WiFiClient& client, int id, int pin) {
  if (pin != 3 && pin != 5 && pin != 6) {
    sendResponse(client, 400, "error", "Invalid pin. LED allowed only on pins 3, 5, 6.");
    return;
  }

  pinMode(pin, OUTPUT);
  ledPins[id] = pin;

  sendResponse(client, 200, "success", "true");
}

void handleAssignMotor(WiFiClient& client, int id, int pin) {
  if (pin != 9 && pin != 10 && pin != 11) {
    sendResponse(client, 400, "error", "Invalid pin. Motor allowed only on pins 9, 10, 11.");
    return;
  }

  pinMode(pin, OUTPUT);
  motorPins[id] = pin;
  servoMotors[id].attach(pin);
  motorValues[id] = 0;

  sendResponse(client, 200, "success", "true");
}

void handleAssignDht(WiFiClient& client, int id, int pin) {
  if (pin != 7 && pin != 8 && pin != 16) {
    sendResponse(client, 400, "error", "Invalid pin. DHT allowed only on pins 7, 8, 16.");
    return;
  }

  if (dht_arr[id]) {
    delete dht_arr[id];  // cleanup old instance
    dht_arr[id] = nullptr;
  }

  dht_arr[id] = new DHT(pin, DHTTYPE);
  dht_arr[id]->begin();
  dhtPins[id] = pin;

  sendResponse(client, 200, "success", "true");
}

void handleAssignLDR(WiFiClient& client, int id, int pin) {
  if (pin != 14 && pin != 15 && pin != 17) {
    sendResponse(client, 400, "error", "Invalid pin. LDR allowed only on pins 14, 15, 17.");
    return;
  }

  pinMode(pin, INPUT);
  ldrPins[id] = pin;

  sendResponse(client, 200, "success", "true");
}

void handleAssignMotion(WiFiClient& client, int id, int pin) {
  if (pin != 2 && pin != 4 && pin != 12) {
    sendResponse(client, 400, "error", "Invalid pin. PIR allowed only on pins 2, 4, 12.");
    return;
  }

  pinMode(pin, INPUT);
  motionPins[id] = pin;

  sendResponse(client, 200, "success", "true");
}

//  ====== Sensor Handlers ======

void checkSensors() {
  for (int i = 0; i < ROOMS; i++) {
    if (ldrPins[i] != -1) {
      checkLDR(i);
    }

    if (dht_arr[i] != nullptr) {
      checkTempHumidity(i);
    }

    if (motionPins[i] != -1) {
      checkMotion(i);
    }
  }
}

void checkLDR(int id) {
  if (mode[id] != 1 || ldrPins[id] == -1) return;

  int ldrVal = analogRead(ldrPins[id]);

  if (abs(ldrVal - ldrValues[id]) > 500) {
    notifyBackend("ldr", id, "read", ldrValues[id], ldrVal);
  }

  ldrValues[id] = ldrVal;

  if (ldrVal < 1000 && motorValues[id] != 0) {
    rotateMotor(id, 0);
    notifyBackend("motor", id, "off", motorValues[id], 0);
  } else if (ldrVal > 3000 && motorValues[id] != 100) {
    rotateMotor(id, 100);
    notifyBackend("motor", id, "on", motorValues[id], 100);
  }
}

void checkTempHumidity(int id) {
  if (mode[id] != 1 || dhtPins[id] == -1 || dht_arr[id] == nullptr) return;

  float temp = dht_arr[id]->readTemperature();
  if (isnan(temp)) return;

  int intTemp = (int)temp;
  if (abs(intTemp - dhtValues[id]) >= 3) {
    notifyBackend("dth", id, "read", dhtValues[id], intTemp);
  }

  dhtValues[id] = intTemp;

  if (temp > 30 && motorValues[id] != 100) {
    rotateMotor(id, 100);
    notifyBackend("motor", id, "on", motorValues[id], 100);
    if(ledValues[id] == 0){
      switchLed(id, 70);
      notifyBackend("led", id, "toggle", 0, 100);
    }
  }
}

void checkMotion(int id) {
  if (mode[id] != 1 || motionPins[id] == -1) return;

  int motion = digitalRead(motionPins[id]);

  if (motion == HIGH && !motionValues[id]) {
    motionValues[id] = true;
    notifyBackend("pir", id, "on", 0, 1);
    switchLed(id, 100);
    delay(duration);
    switchLed(id, 0);
  } else if (motion == LOW && motionValues[id]) {
    notifyBackend("pir", id, "off", 1, 0);
    motionValues[id] = false;
  }
}

void rotateMotor(int id, int value) {
  if (motorPins[id] == -1 || value < 0 || value > 100)
    return;

  if (value == motorValues[id])
    return;

  // Determine direction and rotation time
  bool clockwise = value > motorValues[id];
  int diff = abs(value - motorValues[id]);
  unsigned long rotateTime = duration * diff / 100;

  // Rotate servo
  servoMotors[id].write(clockwise ? 180 : 0);
  delay(rotateTime);

  // Stop servo
  servoMotors[id].write(90);

  // Update state
  motorValues[id] = value;
}

void switchLed(int id, int value) {
  if (ledPins[id] == -1)
    return;

  if (value < 0 || value > 100)
    return;

  int pwm = map(value, 0, 100, 0, 255);
  analogWrite(ledPins[id], pwm);
  ledValues[id] = value;
}
