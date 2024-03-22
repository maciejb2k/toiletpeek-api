#include <Arduino.h>

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>

#include <ArduinoJson.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>

const char* wifiSSID = "SSID";
const char* wifiPassword = "password";

const char* serverAddress = "IP";
const char* serverPath = "/socket.io/?EIO=4";
const uint16_t serverPort = 80;

const char* authorizationHeader = "Authorization: Basic xxx";

unsigned long messageTimestamp = 0;

WiFiMulti WiFiMulti;
SocketIOclient socketIO;
WebSocketsClient webSocket;

void setup(){
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  delay(1000);

  randomSeed(analogRead(0));

  WiFiMulti.addAP(wifiSSID, wifiPassword);

  Serial.println("\n[SETUP] Connecting to the WiFi network");
  while(WiFiMulti.run() != WL_CONNECTED){
      Serial.print(".");
      delay(100);
  }

  String ip = WiFi.localIP().toString();
  Serial.printf("\n[SETUP] WiFi Connected %s\n", ip.c_str());

  socketIO.begin(serverAddress, serverPort, serverPath);
  socketIO.setExtraHeaders(authorizationHeader);
  socketIO.onEvent(socketIOEvent);
}

void loop(){
  socketIO.loop();

  uint64_t now = millis();

  if(now - messageTimestamp > 5000) {
    messageTimestamp = now;

    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    array.add("sensors_data");

    JsonObject payload = array.createNestedObject();

    int randomNumber = random(2);
    bool randomBoolean = (randomNumber == 1);
    payload["isDoorOpen"] = randomBoolean;

    String output;
    serializeJson(doc, output);

    socketIO.sendEVENT(output);

    Serial.println(output);
  }
}

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            Serial.printf("[IOc] Disconnected!\n");
            break;
        case sIOtype_CONNECT:
            Serial.printf("[IOc] Connected to url: %s\n", payload);
            socketIO.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_ACK:
            Serial.printf("[IOc] get ack: %u\n", length);
            break;
        case sIOtype_ERROR:
            Serial.printf("[IOc] get error: %u\n", length);
            break;
        case sIOtype_BINARY_EVENT:
            Serial.printf("[IOc] get binary: %u\n", length);
            break;
        case sIOtype_BINARY_ACK:
            Serial.printf("[IOc] get binary ack: %u\n", length);
            break;
    }
}
