# 🛡 HomeSec

### AI-Powered Home Network Security Dashboard

HomeSec is a full-stack home network security monitoring application that discovers devices connected to a local network, scans exposed network services, evaluates security risks, and uses generative AI to explain security findings and provide remediation recommendations.

The project combines network scanning, deterministic risk assessment, REST APIs, database persistence, and generative AI into a single security monitoring workflow.

---

## 🎯 Problem

Home networks often contain multiple connected devices such as routers, computers, phones, smart TVs, and IoT devices.

Many users have limited visibility into:

- Which devices are connected to their network
- Which network services are exposed
- Which devices may represent a security risk
- Why a particular configuration could be dangerous
- How identified risks could be mitigated

HomeSec was built to provide this information through a simple security dashboard.

---

## 💡 Solution

HomeSec automatically discovers devices on the local network and evaluates their security posture.

The application:

1. Discovers connected devices
2. Scans open network ports and services
3. Stores device and scan information in PostgreSQL
4. Calculates a deterministic security risk score
5. Classifies devices as Low, Medium, or High risk
6. Uses generative AI to explain identified risks
7. Provides practical security recommendations

---

## ✨ Key Features

### 🌐 Network Discovery

- Detects devices connected to the local network
- Collects IP addresses and hostnames
- Tracks when devices were first and last seen
- Maintains a persistent device inventory

### 🔎 Port Scanning

- Scans discovered devices for open TCP ports
- Identifies common network services
- Stores discovered ports in PostgreSQL
- Tracks previously discovered ports

Example:

    53/tcp   domain
    80/tcp   http

### ⚠️ Risk Assessment

HomeSec uses a deterministic, rule-based approach to evaluate device security risks.

Risk assessment is performed using information such as:

- Open network ports
- Detected services
- Device information
- Network exposure
- Previously observed device data

Each device receives:

- A numerical risk score
- A risk level: Low, Medium, or High

The risk engine is intentionally separated from the generative AI layer. This keeps the core security assessment deterministic and predictable, while AI is used to explain the findings rather than make the underlying security decision.

### 🤖 AI Security Analysis

HomeSec integrates Google's Gemini API to transform technical security findings into understandable security insights.

The AI layer provides:

- Security summaries
- Explanation of potential risks
- Practical remediation recommendations
- Context around detected devices and services

The AI does not determine the original risk score. Instead, it receives the results of the deterministic security assessment and provides an additional natural-language interpretation.

This separation helps keep security-critical logic predictable while still making the results easier for non-technical users to understand.

---
## 🧠 AI Analysis Workflow

    Network Discovery
           ↓
    Device Information
           ↓
    Port & Service Scanning
           ↓
    Rule-Based Risk Assessment
           ↓
    Risk Score & Risk Level
           ↓
    Gemini AI
           ↓
    Security Explanation
           ↓
    Remediation Recommendations

---

## 🏗 Architecture

HomeSec follows a modular full-stack architecture consisting of a React frontend, FastAPI backend, PostgreSQL database, network scanning services, and an AI integration layer.

    ┌──────────────────────────────┐
    │          React UI            │
    │      TypeScript + CSS        │
    └──────────────┬───────────────┘
                   │ REST API
                   ↓
    ┌──────────────────────────────┐
    │        FastAPI Backend       │
    │            Python            │
    ├──────────────────────────────┤
    │ Device API                   │
    │ Scan API                     │
    │ AI API                       │
    │ Risk Assessment              │
    │ Service Layer                │
    │ Repository Layer             │
    └───────┬──────────────┬───────┘
            │              │
            ↓              ↓
    ┌──────────────┐   ┌────────────────┐
    │ PostgreSQL   │   │   Gemini API    │
    │              │   │                │
    │ Devices      │   │ AI Analysis    │
    │ Ports        │   │ Recommendations│
    │ Scans        │   └────────────────┘
    │ AI analyses  │
    └──────────────┘

The frontend communicates with the backend through REST APIs. Backend services handle network scanning, risk evaluation, database persistence, and communication with the Gemini API.

---

## 🛠 Technology Stack

### Frontend

- React
- TypeScript
- Vite
- TanStack Query
- CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- REST API

### Database

- PostgreSQL

### AI

- Google Gemini API
- google-genai

### Networking & Security

- Local network discovery
- TCP port scanning
- Network service detection
- Rule-based risk assessment

### Development

- Git
- Python virtual environment
- npm

---
## 🔐 Security Considerations

Security was considered as part of the application architecture rather than only as a feature.

### Separation of Responsibilities

Security scoring is handled by deterministic application logic, while generative AI is used for explanations and recommendations.

This reduces the dependency on AI for security-critical decisions and makes the risk assessment more predictable and reproducible.

### API Key Protection

The Gemini API key is stored server-side using environment variables and is never exposed to the React frontend.

    Frontend
       │
       │ Security analysis request
       ↓
    FastAPI Backend
       │
       │ API key remains server-side
       ↓
    Gemini API

### Persistent AI Analysis

AI-generated analyses are stored in PostgreSQL.

If an analysis already exists for a device, HomeSec can reuse the stored result instead of unnecessarily requesting another AI response.

This reduces unnecessary API requests and allows previously generated security assessments to persist between sessions.

---

## 📊 Dashboard

The dashboard provides an overview of the current network security state, including:

- Total connected devices
- High-risk devices
- Medium-risk devices
- Low-risk devices
- Device information
- Open network services
- Trust status
- AI-generated security analysis

The interface is designed to present technical network information in a compact and understandable format.

---

## 🔄 Application Workflow

A typical HomeSec workflow looks like this:

    1. Scan Network
           ↓
    2. Discover Devices
           ↓
    3. Collect Device Information
           ↓
    4. Detect Open Services
           ↓
    5. Calculate Risk Score
           ↓
    6. Store Results
           ↓
    7. Display Security Dashboard
           ↓
    8. Analyze Selected Device with AI
           ↓
    9. Store & Display Security Recommendations

---

## 👩‍💻 My Role

I designed and implemented HomeSec as a full-stack security monitoring application.

My work covered the application's architecture and implementation across the frontend, backend, database, network scanning, risk assessment, and AI integration layers.

### Key responsibilities

- Designing the application architecture
- Developing the React frontend
- Implementing FastAPI backend services
- Designing the PostgreSQL data model
- Implementing network discovery and port scanning
- Developing the rule-based risk assessment
- Integrating the Gemini API
- Implementing persistent AI analysis
- Designing REST API communication between frontend and backend
- Handling API errors and application states

A key architectural decision was separating deterministic security assessment from generative AI. This allowed the system to maintain predictable security logic while using AI to make technical findings easier to understand.

---
## 📸 Screenshots

### Security Dashboard

_Add screenshot here._

### AI Security Analysis

_Add screenshot here._

---

## 🚧 Project Status

HomeSec is currently a working prototype.

The current version demonstrates the complete core workflow from network discovery to AI-assisted security analysis.

### Potential future improvements

- Scan history visualization
- Security risk trends over time
- Alert management
- More detailed device profiles
- User authentication
- Network segmentation recommendations
- Expanded security rules
- Automated background monitoring
- Docker deployment
- Production deployment

---

## ▶️ Running the Project

### Prerequisites

- Python 3.12+
- Node.js and npm
- PostgreSQL
- Gemini API key

### Backend

Navigate to the backend directory:

    cd backend

Create a Python virtual environment:

    python -m venv .venv

Activate the virtual environment.

#### Linux / macOS

    source .venv/bin/activate

#### Windows

    .venv\Scripts\activate

Install dependencies:

    pip install -r requirements.txt

Configure the Gemini API key:

    export GEMINI_API_KEY="your-api-key"

Start the FastAPI server:

    uvicorn app.main:app --reload

The API will be available at:

    http://localhost:8000

FastAPI documentation:

    http://localhost:8000/docs

### Frontend

Open another terminal and navigate to the project root:

    cd HomeSec

Install dependencies:

    npm install

Start the development server:

    npm run dev

The frontend will be available at:

    http://localhost:5173

---

## 📁 Project Structure

    HomeSec/
    │
    ├── backend/
    │   ├── app/
    │   │   ├── api/
    │   │   ├── database/
    │   │   ├── repositories/
    │   │   ├── services/
    │   │   └── main.py
    │   │
    │   └── requirements.txt
    │
    ├── src/
    │   ├── hooks/
    │   ├── services/
    │   ├── styles/
    │   ├── App.tsx
    │   └── main.tsx
    │
    ├── package.json
    └── README.md

---

## 🎯 Project Goals

HomeSec was created as a practical project combining my interests in:

- Cybersecurity
- Artificial intelligence
- Software architecture
- Full-stack development
- Network security
- Practical automation

The goal was not only to detect technical security information, but to build an application that turns that information into something a home user can understand and act upon.
