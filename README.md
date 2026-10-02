# 🛡️ The Sovereign Sentinel

> **Zero-Trust Operations Center** — Military-grade webhook security dashboard with real-time monitoring, HMAC-SHA256 verification, and sovereign infrastructure visualization.

![Version](https://img.shields.io/badge/version-2.1.0-emerald)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

---

## ✨ Features

### 📊 Command Center
- Real-time event stream with animated feed
- Security metrics (HMAC verification rate, payload integrity, network throughput)
- Live threat monitoring with categorized alerts
- Event counters and uptime tracking

### 🔐 Webhook Forge
- Interactive HMAC-SHA256 signature generator (Web Crypto API)
- Real-time signature verification with constant-time comparison
- Configurable secret keys and JSON payloads
- Copy-to-clipboard functionality

### 🌐 Network Mesh
- Interactive topology map of sovereign infrastructure
- Real-time latency monitoring per node
- Node types: Core, Vault, Validator, Gateway
- Animated connection pulses and status indicators

### 🖥️ System Core
- Live infrastructure metrics (CPU, Memory, Disk I/O, Network)
- Docker service status monitoring
- Embedded `docker-compose.yml` configuration
- Uptime tracking with zero-incident banner

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Crypto | Web Crypto API (HMAC-SHA256) |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/colorsoflifeexplores-png/Sovereign-Sentinel.git
cd Sovereign-Sentinel

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🐳 Docker Deployment

```yaml
version: '3.8'
services:
  sentinel-core:
    build: .
    container_name: sovereign-sentinel
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - WEBHOOK_SECRET=${WEBHOOK_SECRET}
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
```

---

## 🔒 Security Architecture

- **HMAC-SHA256** signature verification (FIPS 198-1)
- **Constant-time comparison** to prevent timing attacks
- **Replay attack prevention** with timestamp validation (60s window)
- **TLS 1.3** with certificate pinning
- **Zero-trust** network architecture
- **ISO-20022** compliant message handling

---

## 📁 Project Structure

```
sovereign-sentinel/
├── src/
│   ├── App.tsx              # Main application shell
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   └── components/
│       ├── Dashboard.tsx    # Command Center
│       ├── WebhookTester.tsx # Webhook Forge
│       ├── NetworkMap.tsx   # Network Mesh
│       └── SystemPanel.tsx  # System Core
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📜 License

MIT © [Sovereign Sentinel](https://github.com/colorsoflifeexplores-png/Sovereign-Sentinel)

---

<p align="center">
  <strong>SOVEREIGN • ENCRYPTED • AUTONOMOUS</strong><br/>
  <em>ISO-20022 Compliant • End-to-End Encrypted • Zero-Trust</em>
</p>
