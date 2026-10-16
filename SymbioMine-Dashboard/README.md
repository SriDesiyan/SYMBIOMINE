<div align="center">
  <img width="1200" height="475" alt="Google AI Studio Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# ⛏️ SymbioMine Admin Dashboard

### Industrial Safety Competency & Certification Intelligence Platform

[![Google AI Studio](https://img.shields.io/badge/Google%20AI%20Studio-App%20Live-4285F4?style=flat&logo=google&logoColor=white)](https://ai.studio/apps/9dfcc5db-374f-4d07-b8e2-ccc79f8d8c80)
[![Frontend](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_7-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Build](https://img.shields.io/badge/Build-Vite_8-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![AI](https://img.shields.io/badge/AI-Gemini_3.8_Flash-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev)
[![Standard](https://img.shields.io/badge/Compliance-DGMS_Standard-0284C7?style=flat)](#)

---

> 🚀 **Live Google AI Studio App**: [https://ai.studio/apps/9dfcc5db-374f-4d07-b8e2-ccc79f8d8c80](https://ai.studio/apps/9dfcc5db-374f-4d07-b8e2-ccc79f8d8c80)  
> The SymbioMine Admin Dashboard is engineered as an enterprise-grade AI Studio application connecting Google Gemini with real-time industrial safety operations.

---

## Overview

The **SymbioMine Admin Dashboard** is the web-based operational intelligence command center for the [SYMBIOMINE AR ecosystem](../README.md). It provides safety managers, training supervisors, and compliance officers with high-assurance oversight of workforce competency, automated remediation dispatching, and regulatory compliance.

> **Note**: This dashboard is a completely independent web application with its own dependencies and build pipeline. It does not modify, relocate, or depend on the Android/XR application's Gradle build system.

---

## Features

| Module | View File | Operational Capability |
| :--- | :--- | :--- |
| **Command Center** | `CommandCenterView.tsx` | Real-time operational overview with KPI metrics, workforce status, and safety alerts |
| **Workforce Roster** | `WorkersView.tsx` | Worker profiles, designation filters, medical status, and safety history |
| **Competency Intelligence** | `CompetencyIntelligenceView.tsx` | Analytics dashboards with trend charts, competency scoring, and gap analysis |
| **Training & Remediation** | `TrainingRemediationView.tsx` | Training program management, remediation workflows, and progress tracking |
| **Assessments** | `AssessmentsView.tsx` | Assessment records, scoring history, and question performance analytics |
| **Certifications** | `CertificationsView.tsx` | Digital certificate management with QR code generation and verification |
| **Assessment Integrity** | `IntegrityView.tsx` | Monitoring dashboard for biometric verification and anti-proxy detection |
| **AR Scenario Management** | `ScenarioManagementView.tsx` | Training scenario configuration, hazard thresholds, and passing criteria |
| **AI Safety Assistant** | `AiSafetyAssistantView.tsx` | Gemini-powered conversational AI for safety queries and policy guidance |
| **MCP Tools Registry** | `McpToolsView.tsx` | Model Context Protocol tool registry with controlled operational access |
| **AI Approvals** | `AiApprovalsView.tsx` | Agentic AI action approval queue with mandatory human oversight |
| **QR Verification** | `QrVerificationView.tsx` | Certificate QR code scanner and cryptographic verification portal |
| **Sync Center** | `SyncCenterView.tsx` | Offline synchronization monitoring and conflict resolution |
| **Reports & Audit Logs** | `ReportsView.tsx` | Compliance reports, audit trails, and data export capabilities |
| **System Settings** | `SystemSettingsView.tsx` | Platform configuration, sensor integrations, and health monitoring |
| **Admin Management** | `AdminManagementView.tsx` | Administrator accounts, invitation-based registration, and role management |
| **Security Audit** | `SecurityAuditView.tsx` | Security event monitoring and access control audit trails |
| **Login & RBAC Gate** | `LoginView.tsx` | Secure administrator authentication with role-based routing |

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript 7 | Component-based UI with strict type safety |
| **Build Tool** | Vite 8 | Fast development server and optimized production builds |
| **Styling** | Tailwind CSS 4 | Utility-first responsive industrial design system |
| **Animations** | Motion (Framer Motion) | Smooth transitions and micro-interactions |
| **Icons & Typography** | Lucide React / Zen Dots + JetBrains Mono | Industrial typography and standard icon system |
| **QR Codes** | `qrcode` + `jsqr` | High-density cryptographic certificate generation and camera scanning |
| **AI Engine** | Google Gemini 3.8 Flash (`@google/genai`) | Agentic safety assistant with MCP tool calling |
| **Tool Calling** | Model Context Protocol (MCP) | Schema-validated operational tools for roster, scores, and certs |
| **Server** | Express.js | API proxy for Gemini AI calls and production static file server |
| **Safety Governance** | Deterministic Policy Engine | External non-LLM safety guardrails (`safetyPolicy.ts`) |

---

## Google AI Studio & Cloud Deployment Guide

### 1. View & Run in Google AI Studio

You can access and interact with the application directly inside the Google AI Studio environment:

🔗 **AI Studio Application URL**: [https://ai.studio/apps/9dfcc5db-374f-4d07-b8e2-ccc79f8d8c80](https://ai.studio/apps/9dfcc5db-374f-4d07-b8e2-ccc79f8d8c80)

#### AI Studio Managed Runtime
When running within AI Studio:
* **`GEMINI_API_KEY`**: Automatically injected into the server runtime via user secrets configured in the Secrets panel of the AI Studio UI.
* **`APP_URL`**: Automatically injected with the Cloud Run service URL hosting the applet for self-referential links and OAuth callbacks.
* **Permissions**: Configured in `metadata.json` (`camera` permission for QR scanner and `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`).

---

### 2. Local Installation & Setup

#### Prerequisites
* **Node.js** 18+ or [Bun](https://bun.sh) (v1.3+)
* Modern browser with webcam support (for QR verification)

#### Step 1: Clone & Navigate
```bash
git clone https://github.com/SriDesiyan/SYMBIOMINE.git
cd SYMBIOMINE/SymbioMine-Dashboard
```

#### Step 2: Install Dependencies
```bash
# Using Bun (Fastest):
bun install

# Or using npm:
npm install
```

#### Step 3: Configure Local Secrets
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Gemini API key from [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY="AIzaSy..."
APP_URL="http://localhost:3000"
```

> **Security Reminder**: `.env.local` is listed in `.gitignore` and is never committed to version control.

#### Step 4: Run Development Server
```bash
# Using Bun:
bun run dev

# Or using npm:
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Step 5: Build & Run Production Bundle
```bash
# Typecheck TypeScript
bun run lint

# Build production bundle (Vite + esbuild server.ts)
bun run build

# Start production server on port 3000
bun run start
```

---

### 3. Deploying to Google Cloud Run

To deploy the dashboard to Google Cloud Run independently:

#### Build Container Image
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/symbiomine-dashboard
```

#### Deploy to Cloud Run
```bash
gcloud run deploy symbiomine-dashboard \
  --image gcr.io/YOUR_PROJECT_ID/symbiomine-dashboard \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your-gemini-api-key"
```

---

## Security Architecture

### Role-Based Access Control (RBAC)
| Role | Access Level |
| :--- | :--- |
| **Super Admin** | Full platform access including administrator invites and security audit |
| **Safety Manager** | Workforce, training, assessments, certifications, and compliance reports |
| **Training Supervisor** | Training modules, assessments, and worker remediation progress |
| **Compliance Officer** | Audit logs, integrity monitoring, certificates, and statutory reports |

### Safety Guardrails
* **Deterministic Safety Boundaries**: All safety-critical PASS/FAIL decisions are controlled by deterministic assessment rules in `safetyPolicy.ts`, external to the AI model.
* **Certificate Verification Independence**: QR certificate verification uses cryptographic validation independent of AI recommendations.
* **MCP Tool Authorization**: All MCP tools require explicit authorization and parameter validation before execution.
* **AI Action Approvals**: Agentic AI administrative actions require human approval through the AI Approvals queue.

---

## API Integration with Android App

### Current Status: 🔶 API Contracts Documented — Not Yet Connected
The Android/XR application and this web dashboard are designed to exchange data through REST APIs. Canonical endpoint specifications, encryption schemes, and synchronization schemas are documented in **[`../docs/architecture.md`](../docs/architecture.md)**.

> **Honest Disclosure**: The API connections between the Android app and this dashboard have **not been implemented or tested**. Both applications currently operate independently with their own local data stores.

---

## License

Part of the [SYMBIOMINE AR](../README.md) project. Licensed under the [Apache License, Version 2.0](../LICENSE).
