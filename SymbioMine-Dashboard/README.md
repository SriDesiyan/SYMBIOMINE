# ⛏️ SymbioMine Admin Dashboard

### Industrial Safety Competency & Certification Intelligence Platform

[![Frontend](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_7-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Build](https://img.shields.io/badge/Build-Vite_8-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![AI](https://img.shields.io/badge/AI-Gemini_API-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev)

---

## Overview

The **SymbioMine Admin Dashboard** is the web-based administrative companion to the [SYMBIOMINE AR Android application](../README.md). It provides safety managers, training supervisors, and compliance officers with a centralized command center for monitoring workforce competency, managing training programs, and maintaining regulatory compliance.

> **Note**: This dashboard is a separate web application with its own dependencies. It does not modify or depend on the Android/XR application's build system.

---

## Features

| Module | Description |
| :--- | :--- |
| **Command Center** | Real-time operational overview with KPI metrics, workforce status, and safety alerts |
| **Workforce Roster** | Worker profiles, role assignments, and employment records |
| **Competency Intelligence** | Analytics dashboards with trend charts, competency scoring, and gap analysis |
| **Training & Remediation** | Training program management, remediation workflows, and progress tracking |
| **Assessments** | Assessment records, scoring history, and question performance analytics |
| **Certifications** | Digital certificate management with QR code generation and verification |
| **Assessment Integrity** | Monitoring dashboard for biometric verification and anti-proxy detection |
| **AR Scenario Management** | Training scenario configuration and content management |
| **AI Safety Assistant** | Gemini-powered conversational AI for safety queries and policy guidance |
| **MCP Tools** | Model Context Protocol tool registry with controlled operational access |
| **AI Approvals** | Agentic AI action approval queue with safety guardrails |
| **QR Verification** | Certificate QR code scanner and verification portal |
| **Sync Center** | Offline synchronization monitoring and conflict resolution |
| **Reports & Audit Logs** | Compliance reports, audit trails, and data export capabilities |
| **System Settings** | Platform configuration, integrations, and health monitoring |
| **Admin Management** | Administrator accounts, invitation-based registration, and role management |
| **Security Audit** | Security event monitoring and access control audit trails |

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript 7 | Component-based UI with type safety |
| **Build Tool** | Vite 8 | Fast development server and optimized production builds |
| **Styling** | Tailwind CSS 4 | Utility-first responsive design system |
| **Animations** | Motion (Framer Motion) | Smooth transitions and micro-interactions |
| **Icons** | Lucide React | Consistent icon system |
| **Typography** | Zen Dots + JetBrains Mono | Industrial brand identity |
| **QR Codes** | qrcode + jsqr | Certificate generation and scanning |
| **AI Engine** | Google Gemini API (@google/genai) | Agentic safety assistant with MCP tool calling |
| **Server** | Express.js | API proxy for Gemini AI calls |
| **Auth** | Client-side RBAC | Role-based access control with policy enforcement |

---

## Prerequisites

- **Node.js** 18+ (or [Bun](https://bun.sh) runtime)
- **npm** or **bun** package manager

---

## Installation & Setup

### 1. Navigate to the Dashboard Directory

```bash
cd SymbioMine-Dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your Gemini API key:

```env
GEMINI_API_KEY="your-gemini-api-key-here"
APP_URL="http://localhost:5173"
```

> **Warning**: Never commit `.env.local` or any file containing real API keys. The `.gitignore` is already configured to exclude these files.

### 4. Start the Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## Security Architecture

### Role-Based Access Control (RBAC)

The dashboard enforces role-based permissions on every view and action:

| Role | Access Level |
| :--- | :--- |
| **Super Admin** | Full platform access including admin management and security audit |
| **Safety Manager** | Workforce, training, assessments, certifications, and reports |
| **Training Supervisor** | Training modules, assessments, and worker progress |
| **Compliance Officer** | Reports, audit logs, integrity monitoring, and certifications |

### Safety Guardrails

- **Deterministic Safety Boundaries**: All safety-critical PASS/FAIL decisions are controlled by deterministic assessment rules in `safetyPolicy.ts`, external to the AI model
- **Certificate Verification Independence**: QR certificate verification uses cryptographic validation independent of AI recommendations
- **MCP Tool Authorization**: All MCP tools require explicit authorization and parameter validation before execution
- **AI Action Approvals**: Agentic AI administrative actions require human approval through the AI Approvals queue

---

## API Integration with Android App

### Current Status: API Contracts Documented — Not Yet Connected

The Android/XR application and this web dashboard are designed to exchange data through REST APIs. The following data domains are planned for synchronization:

| Data Domain | Direction | Status |
| :--- | :--- | :--- |
| Worker profiles | Android <-> Dashboard | Planned |
| Training progress | Android -> Dashboard | Planned |
| Assessment results | Android -> Dashboard | Planned |
| Certificate records | Android <-> Dashboard | Planned |
| Sync queue metadata | Android -> Dashboard | Planned |

> **Honest Disclosure**: The API connections between the Android app and this dashboard have **not been implemented or tested**. Both applications currently operate independently with their own local data stores. Integration will require implementing shared API endpoints and authentication.

---

## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **dev** | `npm run dev` | Start development server with hot reload |
| **build** | `npm run build` | Build production frontend and server bundle |
| **start** | `npm start` | Run production server |
| **preview** | `npm run preview` | Preview production build locally |
| **lint** | `npm run lint` | TypeScript type checking |

---

## License

Part of the [SYMBIOMINE AR](../README.md) project. Licensed under the [Apache License, Version 2.0](../LICENSE).
