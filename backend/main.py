from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from agent.decision_engine import run_agent, initial_agent_state
from services.news_service import get_trending_topics
from db.logger import log_interaction

app = FastAPI(title="News Intelligence Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    session_id: str
    user_name: str = None

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/trending")
async def trending_endpoint():
    try:
        topics = get_trending_topics()
        return {"topics": topics}
    except Exception as e:
        return {"topics": ["AI News", "Global Markets", "Tech Trends", "World News"]}

@app.post("/api/chat")
async def chat_endpoint(request: QueryRequest):
    try:
        response, state, news_items, analytics, explainability = run_agent(request.query, request.session_id, request.user_name)
        # Log to db
        log_interaction(request.session_id, request.query, response, analytics)
        return {
            "response": response,
            "topic": state.get("current_topic", "General News"),
            "articles": news_items,
            "analytics": analytics,
            "explainability": explainability
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
