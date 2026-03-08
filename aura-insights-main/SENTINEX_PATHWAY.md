# SENTINEX — COMPLETE PROJECT EXPLANATION

## 1️⃣ WHAT SENTINEX IS (FOUNDATION)
SENTINEX is a privacy-first, ethical AI platform designed to:
- **Detect** stress, emotional instability, and burnout risk early.
- **Support** individuals based on voluntary mood inputs.
- **Predict** emotional trends for institutions to intervene before crises occur.
- **Protect** personal emotional data using zero-knowledge principles.

> [!IMPORTANT]
> **SENTINEX does not monitor people; it analyzes emotional patterns.** This distinction is the core of our mission.

---

## 2️⃣ WHO USES SENTINEX (ROLES & BOUNDARIES)

### 👤 1. Individual User
**Purpose**: Self-awareness & support.
- **Can**: Log moods, see personal analytics, view predictions, and control consent.
- **Cannot**: See anyone else’s data or organization-level raw data.

### 🏢 2. Organization Admin (College / Company)
**Purpose**: Wellness planning, not monitoring.
- **Can**: See anonymous, aggregated trends and department-level risks.
- **Cannot**: See names, individual logs, or identifying text reflections.

### 🛡️ 3. Super Admin (System Owner)
**Purpose**: Platform health & performance.
- **Can**: See system metrics, user counts, and monitor AI processing accuracy.
- **Cannot**: Access emotional text or identify individuals in the system.

### 🌍 4. Public / Government (Optional)
**Purpose**: Policy-level insights.
- **Can**: See high-level city or state aggregated trends for resource allocation.

---

## 3️⃣ THE USER JOURNEY (START → END)

### 🔹 STEP 1: Landing & Trust
The journey begins with transparency. We explain what SENTINEX does and how it protects privacy to build user trust from the first click.

### 🔹 STEP 2: Authentication
Secure registration via Email/OTP or Google. Security is the foundation of our professionalism.

### 🔹 STEP 3: Individual Mood Logging (The Core)
Users select an emotion (Happy, Stressed, etc.), provide a mood score (1–10), and an optional text reflection.
- **Security Check**: Raw emotional text is **AES-256 encrypted** immediately and never visible to humans.

---

## 4️⃣ THE INTELLIGENCE CORE (AI PROCESSING)

### 🧠 A. Sentiment Analysis
Analyzes decrypted text in memory to produce a score (-1 to +1). The raw text is discarded immediately after processing.

### 📈 B. Time-Series Stress Model
Analyzes mood scores and sentiment trends over time to determine a Stress Risk level (Low/Med/High).

### 🔥 C. Burnout Prediction Model
Uses emotional volatility and consistency breakdown to predict the probability of burnout.

### ⚠️ D. Risk Engine
Flags sudden drops or volatility spikes, generating alerts for the relevant dashboards while maintaining anonymity.

---

## 5️⃣ THE DASHBOARDS

### Individual Dashboard
- **Stability & Volatility Scores**: Measures fluctuation and consistency.
- **Predictions**: 7-Day Emotional Forecast and Burnout Probability.
- **Support**: AI-driven actionable recommendations and granular Consent Settings.

### Organization Dashboard (Anonymous)
- **Emotional Climate Index**: Overall campus/org health score.
- **Heatmaps**: Group-level stress and burnout trends by department.
- **Alerts**: "High Volatility Spike in Dept A" (identifies group, not person).

### Super Admin Dashboard (Enterprise-Ready)
- **Active Risk Count**: Displays global high-risk signal totals.
- **Accuracy Monitor**: Tracks model confidence and processing latency.

---

## 6️⃣ PRIVACY & ETHICS (NON-NEGOTIABLE)
- **AES-256 Encryption**: Data is protected at rest and in transit.
- **PII Isolation**: Individual emotional data is never exposed to third parties.
- **Consent-First Help**: Counselors only gain access if the user explicitly opts in for support during high-risk events.

---

## 🏁 OVERALL SUMMARY
**"SENTINEX is a privacy-first AI platform that predicts emotional risk early—without ever exposing personal emotional data."**
