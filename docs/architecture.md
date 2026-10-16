# 🏗️ SYMBIOMINE System Architecture & Integration

## 1. Executive Summary

**SYMBIOMINE** is a comprehensive, mission-critical occupational safety and industrial competency ecosystem engineered specifically for subterranean mining operations, heavy industrial processing facilities, and high-hazard environments.

The ecosystem unites two complementary operational platforms:
1. **SYMBIOMINE AR Mobile Application**: An offline-first spatial computing application running natively on Android with Unity AR Foundation and Jetpack Compose.
2. **SymbioMine AR Admin Dashboard**: A high-assurance web-based command center powered by React 19, TypeScript, Express, and Agentic AI (Google Gemini 3.8 Flash with Model Context Protocol / MCP tool execution).

`
+----------------------------------------------------------------------------------------------------+
|                                    SYMBIOMINE ENTERPRISE ECOSYSTEM                                  |
+--------------------------------------------------+-------------------------------------------------+
|          Underground Operations (Offline-First)  |           Surface Operations & Compliance       |
|                                                  |                                                 |
|    +----------------------------------------+   |    +----------------------------------------+   |
|    |     SYMBIOMINE AR Android / XR App     |   |    |      SymbioMine Admin Dashboard        |   |
|    |                                        |   |    |                                        |   |
|    |  * On-device biometric verification    |   |    |  * Real-time command center & roster   |   |
|    |  * 3D spatial hazard drills (Unity AR) |   |    |  * Competency & remediation analytics  |   |
|    |  * Visual MCQ assessment engine        |   |    |  * Tamper-evident cert verification   |   |
|    |  * Room SQLite persistent state        |   |    |  * Agentic AI safety assistant & MCP   |   |
|    |  * Self-contained digital certificates |   |    |  * Sync center & audit log management  |   |
|    +-------------------+--------------------+   |    +-------------------+--------------------+   |
|                        |                        |                        |                        |
|                        | (Local Sync Cache)     |                        | (REST / WebSocket API) |
+------------------------v------------------------+------------------------v------------------------+
                         |                                                 |
                         +---------------------> [ DATA SYNC GATEWAY ] <---+
                                                 (Planned Integration)
`

---

## 2. Platform 1: SYMBIOMINE AR (Android / XR Mobile)

### 2.1 Architecture & Runtime
* **Runtime Platform**: Android 14+ (minSdk 24, 	argetSdk 36, compileSdk 36).
* **Core Language & UI**: Kotlin 2.2.10, Jetpack Compose, Material 3, Coroutines & Flow.
* **Spatial Computing Engine**: Unity AR Foundation / Google ARCore embedded runtimes.
* **Local Persistence**: Android Room 2.7.0 (SQLite) storing trainee roster, visual question bank, module completions, and score records.
* **On-Device Vision**: CameraX pipeline with localized facial landmark matching to ensure anti-proxy attendance during training and testing.
* **Multilingual Localization**: Zero-cloud text and audio narration supporting English, Hindi, and Santali (*Ol Chiki* script) via custom local TTS and Noto font packs.

### 2.2 Zero-Bandwidth Offline Trajectory
`
[ Trainee Identity ] ---> [ On-Device Face Scan / PIN ]
                                   │
                                   v
[ Curriculum Selection ] ---> [ Fire / Gas / Electrical Drills ]
                                   │
                                   v
[ Unity AR Spatial Engine ] -> [ Proximity Alarm / Physical Task Validation ]
                                   │
                                   v
[ Visual Scenario Exam ] ---> [ 10 MCQs with 3D Diagrams (>=80% Pass) ]
                                   │
                                   v
[ DGMS Compliant Cert ] ----> [ Local Cryptographic QR Code Generation ]
                                   │
                                   v
[ Local Sync Buffer ] ------> [ Staged for surface synchronization ]
`

---

## 3. Platform 2: SymbioMine AR Admin Dashboard (Web)

### 3.1 Technology Matrix
* **Frontend**: React 19, TypeScript 7, Vite 8, Tailwind CSS 4, Motion (Framer Motion), Lucide React.
* **Backend & AI Engine**: Express.js server, Google GenAI SDK (@google/genai targeting Gemini 3.8 Flash), Model Context Protocol (MCP) tool orchestration.
* **Security & Governance**: Strict Role-Based Access Control (RBAC), deterministic safety guardrail policy evaluation (safetyPolicy.ts), public-key certificate verification (cryptoService.ts).
* **Storage & Indexing**: IndexedDB / SQLite schema with deterministic audit trails and synchronization queues.

### 3.2 Feature Subsystems
1. **Command Center**: Real-time KPI monitors (Active Workforce, Site Safety Score, Open Remediation Tickets, Certificate Expiry Forecasts).
2. **Workforce Roster**: Deep profile records, shift scheduling, medical clearances, and biometrics status.
3. **Competency Intelligence**: Gap analyses, hazard response distribution curves, and cohort ranking charts.
4. **Training & Remediation**: Automated dispatching of remedial modules when assessment benchmarks (<80%) are triggered.
5. **Assessment & Integrity**: Question-level telemetry, anomaly detection, time-to-decision metrics, and proxy attempt logging.
6. **Digital Certificates & QR Verification**: DGMS-formatted credential issuance, public-key cryptographic signature generation, and live camera QR scanner validation.
7. **Agentic AI Safety Assistant & MCP Tools**: Natural language safety officer assistant bound by external, deterministic safety rules. MCP tool execution supports automated drill scheduling, regulatory citation retrieval, and workforce alerts.
8. **Security Audit & Sync Monitoring**: Tamper-evident ledger tracking administrative actions and offline field device synchronization queues.

---

## 4. Logical Repository Structure

To maintain strict build isolation and eliminate dependency collisions, the repository is partitioned into self-contained operational roots:

`
SYMBIOMINE/
├── .env.example                     # Android secrets template
├── .gitignore                       # Repository-wide ignore definitions
├── build.gradle.kts                 # Root Gradle configuration for Android
├── settings.gradle.kts              # Root Gradle settings (includes ':app')
├── gradle.properties                # JVM heap and compiler optimization parameters
├── gradlew / gradlew.bat            # Gradle build wrapper binaries
├── README.md                        # Master repository documentation (dual-stack)
│
├── app/                             # [MODULE 1: Android / XR Native Application]
│   ├── build.gradle.kts             # Android application build configuration
│   ├── proguard-rules.pro           # Code shrinking and obfuscation rules
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml  # Android permissions and components
│       │   ├── assets/              # Offline fonts and bundled Unity AR APKs
│       │   ├── java/com/example/    # Kotlin source (Jetpack Compose UI, Room, AR Launcher)
│       │   └── res/                 # Vector drawables, strings, XML providers
│       ├── test/                    # Android unit test suites
│       └── androidTest/             # Android instrumentation test suites
│
├── SymbioMine-Dashboard/            # [MODULE 2: Admin Dashboard Web Application]
│   ├── .env.example                 # Dashboard environment variables template
│   ├── .gitignore                   # Node/build exclusion rules
│   ├── index.html                   # Entry point with industrial styling fonts
│   ├── metadata.json                # Project and runtime capability manifest
│   ├── package.json                 # Node dependencies and build scripts
│   ├── tsconfig.json                # TypeScript compiler configuration
│   ├── README.md                    # Dashboard installation and operational guide
│   ├── public/                      # Static branding and vector SVG assets
│   ├── server/                      # Server-side runtime
│   │   └── agentEngine.ts           # Gemini 3.8 Flash agent with MCP tool integration
│   └── src/                         # Client-side React source code
│       ├── App.tsx                  # Main router, RBAC navigation guards, modals
│       ├── main.tsx                 # React DOM mount point
│       ├── index.css                # Tailwind CSS styling and theme tokens
│       ├── components/              # Reusable UI component modules
│       ├── context/                 # Global AppContext and state management
│       ├── hooks/                   # Custom React hooks (debounce, timers)
│       ├── services/                # MCP registry, RBAC rules, safety policies, auth
│       ├── types/                   # TypeScript interfaces and domain models
│       └── views/                   # 18 domain-specific views (Command Center, Workers, etc.)
│
└── docs/                            # [CROSS-PLATFORM DOCUMENTATION & MEDIA]
    ├── architecture.md              # System architecture, schemas, and integration contracts
    └── screenshots/                 # Application and Unity AR simulation visuals
        ├── app/                     # Mobile application user interface captures
        └── ar/                      # Unity AR drill simulation HUD captures
`

---

## 5. Subsystem Separation & Safety Boundaries

### 5.1 Deterministic Safety Guardrail Principle
Safety-critical industrial outcomes (such as PASS/FAIL competency qualifications, lockout/tagout protocols, and certificate issuances) are **strictly deterministic**. 

`
                                    +-----------------------------------+
                                    |    Operator / Inspector Query     |
                                    +-----------------+-----------------+
                                                      |
                                                      v
                                    +-----------------------------------+
                                    | Deterministic Policy Interceptor  |
                                    |        (safetyPolicy.ts)          |
                                    +--------+-----------------+--------+
                                             |                 |
                       Safety-Critical Match |                 | General Inquiry
                                             v                 v
                 +--------------------------------+   +--------------------------------+
                 | Hardcoded Deterministic Policy |   |     Gemini 3.8 Flash Engine    |
                 | - Enforce DGMS pass criteria   |   | - Contextual assistance        |
                 | - Block illegal override args  |   | - MCP tool execution proposal  |
                 | - Audit failure reasons        |   | - Natural language synthesis   |
                 +--------------------------------+   +----------------+---------------+
                                                                       |
                                                                       v
                                                      +--------------------------------+
                                                      | Human Approval Gate (RBAC)     |
                                                      +--------------------------------+
`

* **No LLM Decisions on Compliance**: A generative AI model is never permitted to independently evaluate or alter a worker's PASS/FAIL standing.
* **Cryptographic QR Integrity**: Verification of field certificates uses asymmetric signature validation (cryptoService.ts), entirely independent of AI models or online networks.
* **Controlled Tool Calling**: Every MCP tool exposed through mcpRegistry.ts performs schema validation, parameter boundary checking, and RBAC authentication before mutation.

---

## 6. Android-to-Dashboard Integration Contracts (Documented APIs)

> **Important Integration Disclosure**:
> The Android/XR application and the Admin Dashboard currently operate with isolated local data layers (Android Room SQLite and Dashboard IndexedDB/Demo Stores).
> The endpoints specified below represent the canonical REST and synchronization contracts scheduled for end-to-end integration.

### 6.1 Data Synchronization Protocol

`
+--------------------------+                         +--------------------------+
|  SYMBIOMINE AR (Android) |                         |  SymbioMine Dashboard    |
|   Offline Room SQLite    |                         |      Backend / Cloud     |
+------------+-------------+                         +-------------+------------+
             |                                                     |
             | 1. Field Session Completed                          |
             |    (Score, LOTO timestamp, telemetry)               |
             |                                                     |
             | 2. Connection Established (Wi-Fi / Docking Station) |
             |---------------------------------------------------->|
             |    POST /api/v1/sync/upload-batch                   |
             |    Payload: Encrypted Sync Package                  |
             |                                                     |
             | 3. Validate Signatures & Ingest Records             |
             |<----------------------------------------------------|
             |    200 OK { syncedRecords: 14, status: "COMMITTED" }|
             |                                                     |
             | 4. Pull Updated Worker Curriculum                   |
             |---------------------------------------------------->|
             |    GET /api/v1/sync/delta-curriculum                |
             |                                                     |
             | 5. Return Delta Manifest & Scenario Updates         |
             |<----------------------------------------------------|
             |    200 OK { updatedModules: [...] }                 |
`

### 6.2 Canonical API Specifications

#### POST /api/v1/sync/upload-batch
Synchronizes locally collected trainee assessment events from mobile units.
* **Headers**: X-Device-UUID, X-Device-Signature, Content-Type: application/json
* **Request Body**:
`json
{
  "deviceId": "DEVICE-TAB-MINE-084",
  "batchTimestamp": "2026-10-16T15:00:00Z",
  "records": [
    {
      "syncId": "SYNC-UUID-94819",
      "workerId": "W-84920",
      "moduleId": "M02",
      "scenarioCode": "GASLEACKAGE",
      "completionTimestamp": "2026-10-16T14:42:10Z",
      "scorePercentage": 90,
      "passed": true,
      "biometricMatchConfidence": 0.98,
      "tamperEvidentHash": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "lotoStepsCompleted": ["PRESSURE_ISOLATION", "HASP_ENGAGED", "PADLOCK_SECURED"]
    }
  ]
}
`
* **Response**:
`json
{
  "status": "SUCCESS",
  "acknowledgedSyncIds": ["SYNC-UUID-94819"],
  "serverTimestamp": "2026-10-16T15:00:02Z"
}
`

#### GET /api/v1/certificates/verify/{certificateId}
Validates field-presented digital certificates against revocation lists and cryptographic roots.
* **Response Body**:
`json
{
  "certificateId": "CERT-2026-M02-84920",
  "workerId": "W-84920",
  "workerName": "Arjun Soren",
  "moduleName": "M02 - Gas Leak & LOTO",
  "score": 90,
  "issueDate": "2026-10-16",
  "expiryDate": "2027-10-16",
  "regulatoryStandard": "DGMS-SFTY-COMP-2026",
  "valid": true,
  "revoked": false
}
`

---

## 7. Build, Dependency, and Environment Isolation

1. **Gradle and NPM Boundary**:
   * The root directory retains uild.gradle.kts and settings.gradle.kts targeting exclusively the Android :app module.
   * SymbioMine-Dashboard/ maintains its own package.json, 
ode_modules/, and Vite configuration.
2. **Environment Variable Hygiene**:
   * Android uses root .env / .env.example configured via Secrets Gradle Plugin.
   * Dashboard uses SymbioMine-Dashboard/.env.example and local .env.local for Gemini API keys.
   * No keys or credentials are ever committed to version control.
