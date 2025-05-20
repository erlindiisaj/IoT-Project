---

# 🌐 IoT Smart Curtain and Automation System

This is an IoT-based automation system developed as part of the **BLM 4026 – Introduction to Internet of Things** course at Çanakkale Onsekiz Mart University, Spring 2025. The system integrates a smart curtain mechanism with real-time web and hardware interfaces using a combination of frontend (Vite + Vue), backend (Django + Daphne + Redis), and microcontroller-based sensor communication.

---

## 🔧 Required Hardware

To run the full system including the IoT features, you will need the following components:

| Component                              | Description / Role                                                  |
| -------------------------------------- | ------------------------------------------------------------------- |
| 🧠 **UNO R4 WIFI/ESP32**               | Main microcontroller used for Wi-Fi connectivity and sensor control |
| 📡 **Wi-Fi Router**                    | Local network to connect frontend, backend, and hardware            |
| 🌞 **Light Sensor (e.g., LDR)**        | Detects ambient light level for automation triggers                 |
| 📈 **DHT11 / DHT22**                   | (Optional) Temperature & humidity sensor                            |
| 🕵️ **PIR Motion Sensor**               | Detects presence or movement near the curtain area                  |
| ⚙️ **Servo or Stepper Motor**          | Drives the curtain movement based on automation logic               |
| 🔌 **Power Supply**                    | 5V/3.3V power source appropriate for your board and sensors         |
| 🔄 **Relay Module (optional)**         | For controlling higher power curtain motors safely                  |
| 🧵 **Jumper Wires, Breadboard or PCB** | For prototyping connections                                         |
| 💾 **TYPE C USB Cable**                | For programming and powering the microcontroller                    |

> ⚠️ Be sure to update your Arduino sketch with correct pin mappings and IP settings.

---

## 📁 Project Structure

```
project-root/
│
├── frontend/             # Web interface (Vite, Vue)
│   └── src/
│       └── config-global.ts   # Frontend backend/WebSocket config
│   └── vite.config.ts
│
├── backend/
│   ├── iot/              # Django project folder
│   │   └── settings.py   # Update ALLOWED_HOSTS and CORS settings here
│   └── env/              # Python virtual environment
│
├── server/               # Microcontroller code and configuration
│   ├── server.ino        # Arduino code
│   └── wifi_creds.h       # Wi-Fi credentials for device
```

---

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-iot-project.git
cd your-iot-project
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

* In `vite.config.ts`, **change the host IP** to the one you want the frontend to run on.
* In `src/config-global.ts`, **update** the `API_URL` and `WS_URL` to point to your backend.

Then start the dev server:

```bash
npm run dev
```

---

### 3. Backend Setup

```bash
cd backend
.\env\Scripts\activate       # Activate the virtual environment (Windows)
```

> 🔧 If dependencies are missing, run:

```bash
pip install pipenv
pipenv install
```

#### Configure Django:

* In `iot/settings.py`, update:

  * `ALLOWED_HOSTS` → Add both **frontend IP** and **Arduino IP**
  * `CORS_ALLOWED_ORIGINS` → Include your **frontend IP**

---

### 4. Run Backend with Daphne

```bash
cd iot
daphne -b your.backend.ip -p your_backend_port iot.asgi:application
```

> 🧠 **Tip:** Make sure the IP and port match the ones you used in the frontend config!

---

## 🔌 Redis Setup

You need **Redis** for WebSocket communication.

### Recommended Method: WSL + Ubuntu

Follow this tutorial to install Redis using WSL on Windows:

📺 [Install Redis on Windows using WSL](https://www.youtube.com/watch?v=DvrJrmBcK54)

---

## 📡 Microcontroller (Arduino)

* In the `server/wifi_creds/` directory, create or edit the credentials file with your **Wi-Fi name and password**.
* In `server/server.ino`, go to the `notifyBackend` function and **set the correct backend IP**.
* Upload the code into Arduino.

---

## 👥 Contributors

* **Binhan Özer** – UI Design, Documentation
* **Leonit Shabani** – Arduino Server, Backend Integration
* **İdris Yıldırım** – Sensor Procurement, R\&D
* **Erlindi Isaj** – Hardware Setup, Web UI
* **Mehmet Akif Artun** – Documentation, Research & Innovation

---

## 📜 License

This project is for educational purposes and part of ÇOMÜ's IoT curriculum. You are free to reuse or extend it with proper attribution.

---
