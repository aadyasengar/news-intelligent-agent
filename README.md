# PulseAI: Real-Time News Intelligence Agent

PulseAI is an advanced analytical engine that processes live news to identify patterns, trends, and contradictions. It goes beyond simple data retrieval by applying a sophisticated NLP and Machine Learning pipeline to provide transparent, human-like insights.

## 🚀 Key Features

- **Intellectual Intent Classification**: Recognizes user intent (summarization, sentiment, trends, source comparison) with confidence scoring.
- **Deep Sentiment Analysis**: Analyzes reporting tone and bias across multiple news articles.
- **Provider Perspective Comparison**: Groups news by source to highlight how different outlets frame the same story.
- **Advanced Reasoning Layer**:
    - **Core Narrative Extraction**: Synthesizes the underlying story from diverse reports.
    - **Contradiction Detection**: Flags conflicting viewpoints between different news sources.
    - **Domain Classification**: Automatically categorizes news into Business, Tech, Politics, and more.
- **Dynamic News Refresh**: Keeps data fresh with manual and 12-minute automatic background updates.
- **Personalized Experience**: Tracks frequently explored topics to surface relevant insights.

## 💻 Tech Stack

- **Frontend**: React (Vite), Lucide Icons, Vanilla CSS (Premium Glassmorphism Design).
- **Backend**: FastAPI (Python), NLTK, VaderSentiment, RAKE.
- **Pipeline**: Custom Intent Model, Contradiction Detection Engine, Zero-Shot Domain Classifier.

## 🛠️ Setup

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---
*Built with passion for the Real-Time News Intelligence Agent project.*