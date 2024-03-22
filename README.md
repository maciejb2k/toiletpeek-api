# ToiletPeek API

Broadcast **real-time updates of the toilet occupancy** from the `ESP32` devices to the `NestJS` application with `socket.io` server and broadcast the updates to the employees in the organization.

The idea of this project is to provide a real-time API for the status of the toilets occupancy in the company building. This project is just a very general concept and prototype, requiring a lot more work and refinement.

<p>
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS">
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Redis">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/postgresql_15-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">
  <img src="https://img.shields.io/badge/-Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white" alt="Docker">
</p>


![Screenshot from DevTools and Console](https://github.com/maciejb2k/toiletpeek-backend/assets/6316812/a7e536af-2f70-4b96-91e9-a00a042ffcf8)

I wanted to see how to create a web application using NestJS, so I spent almost 2 weeks on this project with 0 knowledge about NestJS. For now, I don't want to develop further this project, I will leave it as it is. The code is probably **absolute garbage**, but whatever.

I managed to implement these basic functionalities:
- [x] **Real-time data streaming** from multiple ESP32 to the server using WebSockets.
- [x] **Broadcasting new toilets statuses** to the employees in real-time.
- [x] User can register **multiple buildings** (organizations), which have many restrooms on different floors and each restroom can contain multiple toilets.
- [x] Each toilet has a unique ID and a token that is used to **authenticate the ESP32 device**.
- [x] **Only authenticated employees** can access and see the **real-time updates** of the toilets in the organization.

## Usage

1. Register a new user by sending a following request to the server:
```
POST http://localhost:8535/auth/sign-up

{
    "email": "user@example.com",
    "password": "password",
    "firstName": "John",
    "lastName": "Doe"
}
```

2. Log in to the application:
```
POST http://localhost:8535/auth/sign-in

{
    "email": "user@example.com",
    "password": "password",
}
```

3. Create a new *organization* (building):
```
POST http://localhost:8535/organizations

{
    "name": "Office Rzeszow",
    "address": "Warszawska 1, 35-000 Rzeszów",
    "password": "password"
}
```

4. Create a new *restroom* in the organization:
```
POST http://localhost:8535/restrooms?organizationId=<organizationId>

{
    "name": "General Restroom",
    "floor": 1,
    "type": "general"
}
```

5. Create a new *toilet* in the restroom:
```
POST http://localhost:8535/toilets?organizationId=<organizationId>&restroomId=<restroomId>

{
    "name": "Toilet#123",
    "type": "men",
    "token": "password"
}
```

6. Download the `main.ino` sketch, fill in the:
- `wifiSSID` and `wifiPassword` with your WiFi credentials.
- `serverAddress` with the address or domain of the server where the API is running (without the `http://` part).
- `serverPort` with the port of the server where the API is running.
- `authorizationHeader` must be in the format `Authorization: Basic xxx` where `xxx` is the base64 encoded string of `toiletId:token` of the toilet you created.

7. Upload the example sketch to the ESP32 device and check the recieved events in the web application. You have to wire up the reed switch, light sensor or any other sensor that will detect the toilet occupancy and implement the logic in the sketch on your own.

8. Now in order to recieve real time updates of the toilets in the organization as an employee, you need to authenticate in the organization:
```
POST http://localhost:8535/employee-access/sign-in

{
    "organizationId": "<organizationId>",
    "password": "password"
}
```

9. With obtained JWT token, you can download all current toilets statuses from `http://localhost:8535/employee-access/` endpoint.

10. Now with the `socket.io` client, you can listen to the real-time updates of the toilets in the organization, but you have to provide JWT token in the `Authorization` header, which you received after logging in as an employee. You will join to the socket room with people from the same organization.
```javascript
const socket = io("http://localhost:8535/employee-access", {
  extraHeaders: {
    Authorization:
      "Bearer xxx",
  },
});

socket.on("toilet_occupancy", (message) => {
  console.log("Toilet occupany update:", message);
});
```
