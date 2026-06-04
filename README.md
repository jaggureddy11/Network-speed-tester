# ⚡ NST for TAB

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js 15](https://img.shields.io/badge/Next.js%2015-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot%203-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL%2016-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

NST for TAB is a production-grade, highly customizable network speed testing SaaS boilerplate. It seamlessly integrates the open-source **LibreSpeed core engine** with a modern B2B React dashboard, a telemetry analytics server, and containerized orchestration.

Designed with a clean, professional corporate layout, NST for TAB offers enterprise clients a secure, CORS-free, self-hosted alternative to public commercial speed testers.

---

## ✨ Features

*   **Real-time Speedometer Gauge**: Circular SVG speedometer displaying real-time metrics during testing phases.
*   **LibreSpeed Integration**: Native client-side JavaScript worker running in the browser. Supports testing against both the local backend loopback node and external public nodes.
*   **Advanced Telemetry Scoring**: Backend scoring algorithm (`NetworkQualityEngine`) that calculates connection scores (0–100) and grades network quality (Excellent, Good, Fair, Poor) using weighted metrics.
*   **Persistent Test History**: Automatically stores tests with client details, detected ISP name, IP address, user agent, and browser type.
*   **Historical speed logs**: Clean interactive table displaying archives of all completed runs.
*   **Historical Trends & Charts**: Daily, weekly, and monthly average speed and ping chart visuals using responsive Recharts panels.
*   **AI-Driven connection Insights**: Automated heuristic assessments recommending connection suitabilities for 4K video streaming, lag-free online gaming, and stable video conferencing.
*   **Production-Ready Architecture**: Built with separate client, API, database, and load-balancer proxy layers.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts, Framer Motion, Lucide icons |
| **Backend** | Spring Boot 3.x, Java 21+, JPA/Hibernate |
| **Database** | PostgreSQL 16 (H2 Database in-memory profile for offline local development) |
| **Proxy/Load Balancer** | Nginx |
| **Containerization** | Docker, Docker Compose |

---

## 📂 Project Structure

```
├── backend/               # Spring Boot REST API
│   ├── src/               # Java Source code (Model-Repository-Service-Controller)
│   ├── pom.xml            # Maven Configuration
│   └── Dockerfile         # Multi-stage Maven JRE build
├── frontend/              # Next.js 15 client application
│   ├── public/            # LibreSpeed worker dependencies
│   ├── src/               # React components, custom hooks, and pages
│   ├── package.json       # Node package manager configurations
│   └── Dockerfile         # Production standalone Next.js build
├── database/              # Schema declarations
│   └── schema.sql         # PostgreSQL initial table definitions
├── nginx/                 # Proxy configurations
│   └── nginx.conf         # Handles CORS-free routing
└── docker-compose.yml     # Orchestrates DB, Backend, Frontend, and Nginx
```

---

## 🚀 Getting Started

### Method A: Quick Start via Docker Compose (Recommended)

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/jaggureddy11/Network-speed-tester.git
    cd Network-speed-tester
    ```

2.  **Start the Containers**:
    ```bash
    docker compose up --build -d
    ```

3.  **Access the Platform**:
    *   Open `http://localhost` in your browser.
    *   Nginx will automatically route your dashboard traffic to the Next.js container, and telemetry API queries (`/api/*`) to the Spring Boot server.

---

### Method B: Local Sandbox Development (No Docker Required)

#### 1. Backend Setup (Spring Boot)
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Launch the Spring Boot server using the **local** in-memory H2 database profile:
    ```bash
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
    ```
3.  The server starts on port `8080`.
    *   **H2 Database Console**: Access `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:speedtest`, Username: `sa`, Password: *blank*).

#### 2. Frontend Setup (Next.js)
1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Run the Next.js dev server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:3000` (or `3001` if port 3000 is occupied).
    *   *Note: Next.js is configured with dynamic proxy rewrites. Any client call to `/api/*` is automatically rewritten to `http://localhost:8080/*` behind the scenes to avoid CORS problems.*

---

## 📡 REST API Endpoints

### Initialise Test
*   **Endpoint**: `POST /api/network/test/start`
*   **Description**: Registers a new speed test transaction with a unique transaction UUID.
*   **Response**:
    ```json
    {
      "testId": "d72d61a8-c2a4-4bf8-b992-d6b7c53d10c2",
      "status": "Initialized",
      "timestamp": 1780510615000
    }
    ```

### Save Test Metrics
*   **Endpoint**: `POST /api/network/test/save`
*   **Description**: Computes network grade score (0-100) and saves the completed parameters.
*   **Request Body**:
    ```json
    {
      "userId": "guest-user-123",
      "downloadSpeed": 354.2,
      "uploadSpeed": 182.5,
      "ping": 12.0,
      "jitter": 1.4,
      "ipAddress": "192.168.1.5",
      "ispName": "Airtel Fiber",
      "deviceInfo": "Chrome on macOS",
      "connectionInfo": "wifi"
    }
    ```
*   **Response**: Returns the saved JPA Entity including `networkQuality` (Grade) and stored `score`.

### Fetch Client History
*   **Endpoint**: `GET /api/network/history?userId={id}`
*   **Description**: Retrieves a chronological log of all completed speed runs for a user.

### Fetch Trend Analytics
*   **Endpoint**: `GET /api/network/analytics?userId={id}`
*   **Description**: Compiles overall averages, peak metrics, and trends aggregated on daily, weekly, and monthly intervals.

---

## ⚙️ Heuristic Network Quality grading

Calculations are computed server-side inside `NetworkQualityEngine` using weighted parameters:
*   **Download (35% weight)**: Log-scaled target benchmark of 100 Mbps.
*   **Upload (25% weight)**: Log-scaled target benchmark of 50 Mbps.
*   **Ping (25% weight)**: Linear penalty above 15ms up to 150ms.
*   **Jitter (15% weight)**: Linear penalty above 2ms up to 30ms.
*   **Grades**: `Excellent` (score >= 90), `Good` (score >= 70), `Fair` (score >= 50), `Poor` (score < 50).

---

## 📄 License
This project is open-source and licensed under the MIT License.
