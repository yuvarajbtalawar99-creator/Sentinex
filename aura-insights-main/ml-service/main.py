from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
import math
import statistics
import json
import pandas as pd
from prophet import Prophet
from transformers import pipeline
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI(title="SENTINEX ML Microservice")

# Initialize the sentiment analysis pipeline globally so it's loaded once into memory
# Using DistilBERT base uncased finetuned SST-2 by default for sentiment-analysis
try:
    print("Loading HuggingFace sentiment-analysis pipeline...")
    sentiment_pipeline = pipeline("sentiment-analysis")
    print("Pipeline loaded successfully.")
except Exception as e:
    print(f"Failed to load pipeline: {e}")
    sentiment_pipeline = None

try:
    print("Loading HuggingFace zero-shot classification pipeline for emotions...")
    # Use a smaller model to avoid huge downloads if possible, default is bart-large-mnli
    emotion_pipeline = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")
    print("Emotion Pipeline loaded successfully.")
except Exception as e:
    print(f"Failed to load emotion pipeline: {e}")
    emotion_pipeline = None

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

class MoodLog(BaseModel):
    intensity: Optional[float] = 5.0 # Made optional with default for older records
    mood: Optional[str] = "neutral"
    sentimentScore: Optional[float] = 0.0
    createdAt: Optional[str] = None

class RiskScoreRequest(BaseModel):
    userId: str
    logs: List[MoodLog]

class RiskScoreResponse(BaseModel):
    stressIndex: float
    volatility: float
    burnoutProbability: float
    riskStatus: str

class AnalyzeSentimentRequest(BaseModel):
    text: str

class AnalyzeSentimentResponse(BaseModel):
    polarity: float
    emotionType: str
    confidence: float

class AnalyzeMoodRequest(BaseModel):
    mood: str
    intensity: int
    note: Optional[str] = ""

class AnalyzeMoodResponse(BaseModel):
    emotional_state: str
    stress_level: float
    burnout_risk: str
    sentiment: str
    recommendation: str
    extracted_emotions: dict

class MoodHistoryEntry(BaseModel):
    ds: str # Date string in ISO format
    y: float # Mood score

class PredictionRequest(BaseModel):
    userId: str
    history: List[MoodHistoryEntry]

class ForecastEntry(BaseModel):
    day: str
    predicted: float
    confidence: float

def calculate_trend(scores: List[float]) -> float:
    """Calculate the trend of scores over time (simple linear slope approximation)."""
    n = len(scores)
    if n < 2:
        return 0.0
    
    # x = 0, 1, ..., n-1 (time indices)
    # y = scores
    sum_x = sum(range(n))
    sum_y = sum(scores)
    sum_x_sq = sum(x**2 for x in range(n))
    sum_xy = sum(x * y for x, y in enumerate(scores))
    
    # Calculate simple linear regression slope
    denominator = n * sum_x_sq - sum_x**2
    if denominator == 0:
        return 0.0
    
    slope = (n * sum_xy - sum_x * sum_y) / denominator
    return float(slope)

@app.post("/api/v1/risk-score", response_model=RiskScoreResponse)
def calculate_risk_score(request: RiskScoreRequest):
    logs = request.logs
    
    if not logs:
        # Default completely safe values if no logs
        return RiskScoreResponse(
            stressIndex=0.0,
            volatility=0.0,
            burnoutProbability=0.0,
            riskStatus="LOW"
        )
        
    # Python sorting by standard ISO date string works chronologically
    logs.sort(key=lambda x: x.createdAt or "")
    
    # Filter for logs that have a valid intensity (not None) 
    scores = [log.intensity for log in logs if log.intensity is not None]
    
    # 1. Average Mood
    avg_score = sum(scores) / len(scores)
    
    # 2. Volatility (Standard deviation)
    # Using pstdev for population standard deviation to match numpy.std
    std_dev = statistics.pstdev(scores) if len(scores) > 1 else 0.0
    volatility = std_dev / 4.0
    volatility = min(1.0, max(0.0, float(volatility)))
    
    # 3. Trend (Declining trend = higher risk)
    slope = calculate_trend(scores)
    
    # 4. Stress Index (0-1)
    base_stress = max(0.0, 1.0 - (avg_score / 10.0))
    stress_modifier = volatility * 0.2
    
    if slope < -0.1:
        stress_modifier += 0.2
        
    stress_index = base_stress + stress_modifier
    stress_index = min(1.0, max(0.0, float(stress_index)))
    
    # 5. Burnout Probability (0-100)
    recent_logs = scores[-5:] # Last 5 logs
    recent_avg = sum(recent_logs) / len(recent_logs) if len(recent_logs) > 0 else avg_score
    
    burnout_factor = max(0.0, 1.0 - (recent_avg / 10.0))
    burnout_probability = (burnout_factor * 0.7 + stress_index * 0.3) * 100.0
    burnout_probability = min(100.0, max(0.0, float(burnout_probability)))
    
    # 6. Risk Status Classification
    risk_status = "LOW"
    if stress_index >= 0.65:
        risk_status = "HIGH"
    elif stress_index >= 0.4:
        risk_status = "MEDIUM"
        
    return RiskScoreResponse(
        stressIndex=round(stress_index, 2),
        volatility=round(volatility, 2),
        burnoutProbability=round(burnout_probability, 1),
        riskStatus=risk_status
    )
    
@app.post("/api/v1/analyze-sentiment", response_model=AnalyzeSentimentResponse)
def analyze_sentiment(request: AnalyzeSentimentRequest):
    if not request.text or not sentiment_pipeline:
        # Fallback if no text or pipeline failed to load
        return AnalyzeSentimentResponse(polarity=0.0, emotionType="NEUTRAL", confidence=0.0)
        
    try:
        # The default sentiment-analysis pipeline returns a list of dicts:
        # [{'label': 'POSITIVE', 'score': 0.9998}]
        result = sentiment_pipeline(request.text)[0]
        label = result.get('label', '')
        score = result.get('score', 0.0)
        
        # Calculate polarity from -1 to 1 based on label
        polarity = 0.0
        if label == 'POSITIVE':
            polarity = score
            emotionType = "HAPPY" if score > 0.8 else "CALM"
        elif label == 'NEGATIVE':
            polarity = -score
            emotionType = "SAD" if score > 0.8 else "ANXIOUS"
        else:
            # Handle NEUTRAL or other labels if model supports them
            polarity = 0.0
            emotionType = "NEUTRAL"
            
        return AnalyzeSentimentResponse(
            polarity=polarity,
            emotionType=emotionType,
            confidence=score
        )
    except Exception as e:
        print(f"Error analyzing sentiment: {e}")
        raise HTTPException(status_code=500, detail="Error analyzing sentiment text")

@app.post("/api/v1/analyze-mood", response_model=AnalyzeMoodResponse)
def analyze_mood(request: AnalyzeMoodRequest):
    mood = request.mood
    intensity = request.intensity
    text = request.note

    # Defaults
    stress_level = intensity * 10.0
    burnout_risk = "high" if intensity >= 8 else "medium" if intensity >= 5 else "low"
    sentiment = "neutral"
    recommendation = "Maintain regular check-ins to monitor your mental health."
    extracted_emotions = {"anger": 0, "anxiety": 0, "sadness": 0, "optimism": 0, "motivation": 0}
    emotions_list = ["anger", "anxiety", "sadness", "optimism", "motivation"]

    if text and text.strip():
        # Sentiment
        if sentiment_pipeline:
            try:
                res = sentiment_pipeline(text)[0]
                label = res.get('label', '')
                if label == 'POSITIVE': sentiment = 'positive'
                elif label == 'NEGATIVE': sentiment = 'negative'
            except:
                pass

        # Zero-shot Emotions
        if emotion_pipeline:
            try:
                emotion_res = emotion_pipeline(text, candidate_labels=emotions_list)
                for label, score in zip(emotion_res['labels'], emotion_res['scores']):
                    extracted_emotions[label] = round(score * 100)
            except:
                pass

        # Recalculate based on text negativity/positivity
        if sentiment == 'negative':
            stress_level = min(100.0, stress_level + 15)
        elif sentiment == 'positive':
            stress_level = max(0.0, stress_level - 15)
            burnout_risk = "low" if intensity < 7 else "medium"
            
        # Refine recommendation
        if extracted_emotions["anxiety"] > 50 or extracted_emotions["anger"] > 50:
            recommendation = "High stress indicators detected. Consider taking a short break or trying a breathing exercise."
        elif extracted_emotions["motivation"] > 50 or extracted_emotions["optimism"] > 50:
            recommendation = "You are showing strong resilience. Great job maintaining focus!"

    emotional_state = f"Feeling {mood} with {'high' if intensity > 6 else 'moderate'} intensity."
    if sentiment == "negative" and intensity > 6:
        emotional_state = f"High stress / {mood} with potential overwhelm."
    elif sentiment == "positive" and intensity > 6:
        emotional_state = f"High intensity {mood} but displaying strong resilience."

    return AnalyzeMoodResponse(
        emotional_state=emotional_state,
        stress_level=stress_level,
        burnout_risk=burnout_risk,
        sentiment=sentiment,
        recommendation=recommendation,
        extracted_emotions=extracted_emotions
    )

@app.post("/api/v1/predict", response_model=List[ForecastEntry])
def predict_mood(request: PredictionRequest):
    if len(request.history) < 2:
        # Not enough data to forecast, return flat line or empty
        return []
        
    try:
        # 1. Convert history to DataFrame
        df = pd.DataFrame([{"ds": entry.ds, "y": entry.y} for entry in request.history])
        df['ds'] = pd.to_datetime(df['ds']).dt.tz_localize(None) # Remove timezone for Prophet
        
        # 2. Fit Prophet model
        # Disabling seasonality/holidays for simple short forecasting if data is sparse
        m = Prophet(interval_width=0.8, daily_seasonality=False, weekly_seasonality=True, yearly_seasonality=False)
        m.fit(df)
        
        # 3. Create future dates (next 7 days)
        future = m.make_future_dataframe(periods=7)
        forecast = m.predict(future)
        
        # 4. Extract last 7 days (the forecast)
        last_7 = forecast.tail(7)
        
        result = []
        for _, row in last_7.iterrows():
            result.append(ForecastEntry(
                day=row['ds'].strftime('%a'),
                predicted=max(1.0, min(10.0, float(row['yhat']))),
                confidence=float((1 - (row['yhat_upper'] - row['yhat_lower']) / 10) * 100)
            ))
            
        return result
    except Exception as e:
        print(f"Error in prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "sentinex-ml"}
