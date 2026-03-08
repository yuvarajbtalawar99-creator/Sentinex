# Implementation Plan: Daily Mood Check-In & AI Enhancements

## Goal
Enhance the Daily Mood Check-In component and backend API to collect an optional text description (note), encrypt it, and analyze it using an AI ML service to generate emotional insights (stress level, burnout risk, sentiment, recommendations, and extracted emotions). Update the dashboard to display these insights.

## Proposed Changes

### Frontend
- **[MODIFY] `src/components/MoodLogger.tsx`**: Update textarea placeholder to `"How was your day today? What happened that made you feel this way? (Optional, AES-256 encrypted)"`. Update the submission payload to send `{ mood, intensity, note, timestamp }`.
- **[MODIFY] `src/lib/api.ts`**: Update `mood.log` function to point to `POST /api/mood-log` and accept the new structure.
- **[MODIFY] `src/pages/Dashboard.tsx` (or core dashboard component)**: Add UI elements to display the latest `aiInsights` (Stress trend, Burnout risk, Recommendation) and integrate the newly extracted text emotions into the Heatmap view.

### Backend (Node.js/Express)
- **[MODIFY] `server/models/MoodLog.ts`**: Update the Mongoose schema. Change/Add fields:
  - `mood` (String)
  - `intensity` (Number)
  - `note` (String, encrypted AES-256)
  - `aiInsights` (Object containing `emotional_state`, `stress_level`, `burnout_risk`, `sentiment`, `recommendation`, `extracted_emotions`)
  - `timestamp` (Date)
- **[MODIFY] `server/routes/mood.ts`**:
  - Add `POST /api/mood-log` endpoint.
  - Implement AES-256 encryption using Node's `crypto` module to encrypt the `note` before saving.
  - Call the ML pipeline (`NLPEngine.analyzeText`) with `mood`, `intensity`, and `note`.
  - Save the log and returned `aiInsights` to MongoDB.
- **[MODIFY] `server/services/NLPEngine.ts`**: Update function signature to pass the payload to the ML service's new endpoint.

### ML Service (Python/FastAPI)
- **[MODIFY] `ml-service/main.py`**:
  - Add zero-shot classification or a specific emotion classification pipeline to detect: `anger`, `anxiety`, `sadness`, `optimism`, `motivation`.
  - Add an endpoint `POST /api/v1/analyze-mood`.
  - Generate the structured AI insights:
    - `emotional_state` (string synthesis)
    - `stress_level` (0-100 score based on intensity, negative emotions, and mood)
    - `burnout_risk` (low/medium/high based on stress level and intensity)
    - `sentiment` (positive/neutral/negative)
    - `recommendation` (tailored string)
    - `extracted_emotions` (list/dict of emotion scores)

## Verification Plan

### Automated/Unit Tests
- Restart backend and ML service (`npm run dev` and `uvicorn main:app --reload`).
- Verify compilation passes with `tsc` if applicable.

### Manual Verification
1. Open the application in the browser and navigate to the Daily Mood Check-In card.
2. Select a mood (e.g., "Stressed"), intensity (e.g., 7), and enter a note: *"Work deadlines were overwhelming today but I managed to finish everything."*
3. Click "Log Mood".
4. Check the Network tab to ensure `POST /api/mood-log` returns a 201 Created and includes the AI insights in the response.
5. In the backend console or via MongoDB Compass, verify the stored document has the `note` field saved as unreadable gibberish (AES-256 encrypted hex/base64).
6. Navigate to the Dashboard. Verify that the AI Insight section is updating and displays the expected text ("High stress with resilience...", "Burnout risk: medium", "Take recovery breaks").
7. Look at the emotional heatmap or charts to see if anger/anxiety/optimism metrics reflect the text.
