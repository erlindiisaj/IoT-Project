#include <WiFiS3.h>  // For Uno R4 WiFi
#include "wifi_creds.h"


WiFiServer server(80);
int status = WL_IDLE_STATUS;

// Function to send data to backend
void notifyBackend(const String& type, int id, const String& action, int prevValue, int value) {
  WiFiClient client;
  const char* host = "192.168.1.102";  // Replace with your backend host

  if (client.connect(host, 80)) {
    // Build the JSON payload
    String payload = "{";
    payload += "\"room_id\": " + String(id) + ",";
    payload += "\"type\": \"" + type + "\",";
    payload += "\"action\": \"" + action + "\",";
    payload += "\"mode\": \"auto\",";
    payload += "\"previous_value\": " + String(prevValue) + ",";
    payload += "\"current_value\": " + String(value);
    payload += "}";


    Serial.print(payload);

    // Send HTTP POST request
    client.println("POST /event HTTP/1.1");
    client.println("Host: " + String(host));
    client.println("Content-Type: application/json");
    client.println("Content-Length: " + String(payload.length()));
    client.println();
    client.print(payload);

    delay(10);  // Wait for response

    while (client.available()) {
      char c = client.read();
      Serial.print(c);  // Print response
    }

    client.stop();
    
  } else {
    Serial.println("Connection to backend failed.");
  }
}

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

  notifyBackend("ldr", 1, "read", 70, 90);
}

void loop() {
  // Do nothing
}
