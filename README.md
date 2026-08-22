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

### Network Discovery

- Detects devices connected to the local network
- Collects IP addresses and hostnames
- Tracks when devices were first and last seen
- Maintains a persistent device inventory

### Port Scanning

- Scans discovered devices for open TCP ports
- Identifies common network services
- Stores discovered ports in PostgreSQL
- Tracks previously discovered ports

Example:

text
53/tcp   domain
80/tcp   http