from services.news_service import fetch_news
from nlp.analyzer import aggregate_insights
from nlp.summarizer import summarize_articles

# DB for tracking session state, including chat history and preferences
initial_agent_state = {}

def get_suggestions(intent, topic, analytics):
    # ... (keeps same)
    suggestions = []
    if intent != "summarize":
        suggestions.append(f"Summarize {topic} news")
    if intent != "sentiment":
        suggestions.append(f"Sentiment analysis for {topic}")
    suggestions.append("Compare source perspectives")
    dist = analytics.get("distribution", {})
    if dist.get("Negative", 0) > dist.get("Positive", 0):
        suggestions.append(f"Why is {topic} coverage negative?")
    elif dist.get("Positive", 0) > 0:
        suggestions.append(f"Show positive updates on {topic}")
    return suggestions[:4]

class IntentClassifier:
    """Simulates a machine learning intent model with confidence scores."""
    def __init__(self):
        self.mappings = {
            "summarize": ["summarize", "summary", "tl;dr", "tldr", "briefly", "short", "synthesis"],
            "sentiment": ["sentiment", "positive", "negative", "opinion", "feeling", "tone"],
            "trends": ["trend", "trending", "keywords", "topics", "buzz"],
            "compare": ["compare", "perspectives", "differences", "contrast", "providers"],
            "detailed_insights": ["explain", "insight", "details", "elaborate", "more"]
        }

    def predict(self, query: str):
        query_lower = query.lower()
        scores = {intent: 0 for intent in self.mappings}
        for intent, keywords in self.mappings.items():
            for k in keywords:
                if k in query_lower:
                    scores[intent] += 1
        
        best_intent = max(scores, key=scores.get)
        confidence = 0.85 if scores[best_intent] > 1 else (0.6 if scores[best_intent] == 1 else 0.4)
        final_intent = best_intent if scores[best_intent] > 0 else "general_search"
        return final_intent, confidence

intent_model = IntentClassifier()

def extract_intent(query: str):
    return intent_model.predict(query)

def extract_topic(query: str, current_topic: str):
    query_lower = query.lower().strip("?!.")
    
    # More comprehensive list of question/filler words
    stop_words = {
        "what", "whats", "what's", "happening", "in", "the", "latest", "news", "about", 
        "on", "tell", "me", "summarize", "sentiment", "trend", "trends", "some", "any", 
        "detailed", "insight", "insights", "public", "opinion", "feeling", "positive", 
        "negative", "give", "a", "of", "is", "are", "can", "you", "please", "now", 
        "current", "recent", "that", "this", "it", "more", "details", "for", "with"
    }
    
    words = query_lower.split()
    topic_words = [w for w in words if w not in stop_words]
    
    new_topic_candidate = " ".join(topic_words).strip()
    
    # Logic: if the remaining words are basically empty or just generic, 
    # and we have a current topic, it's a follow-up.
    if not new_topic_candidate and current_topic:
        return current_topic, True
    
    # If it's a valid new topic
    if new_topic_candidate:
        return new_topic_candidate.title(), False
        
    return "World", False

import random

def run_agent(query: str, session_id: str, user_name: str = None):
    global initial_agent_state
    
    state = initial_agent_state.get(session_id, {"current_topic": "", "last_articles": [], "history": []})
    
    # Step 1: Detect intent and topic
    intent, confidence = extract_intent(query)
    topic, is_followup = extract_topic(query, state["current_topic"])
    
    state["current_topic"] = topic
    state["history"].append({"user": query})
    
    reasoning_steps = []
    reasoning_steps.append(f"Intent classified: '{intent}' (Confidence: {confidence}). Topic: '{topic}'.")
    
    # Step 2: Fetch Data
    if not is_followup or not state["last_articles"]:
        reasoning_steps.append(f"Fetching fresh data for '{topic}'.")
        articles = fetch_news(topic)
        state["last_articles"] = articles
    else:
        reasoning_steps.append(f"Utilizing context. Fetched {len(state['last_articles'])} past articles.")
        articles = state["last_articles"]
        
    # Step 3: Analyze
    analytics = aggregate_insights(articles)
    state["last_analytics"] = analytics
    
    sources_used = list(set([a.get("source", "Unknown") for a in articles]))
    reasoning_steps.append(f"Analyzed {len(articles)} articles from {len(sources_used)} sources.")
    
    # Step 4: Act on Intent & Generate Natural Response
    if not articles:
        response = f"I've scanned the latest news cycles, but I couldn't find any recent significant developments regarding **{topic}**. You might want to try a broader search or check back shortly."
        reasoning_steps.append("Search yielded no articles.")
    else:
        overall = analytics.get("overall_sentiment", "Neutral")
        sources_count = len(sources_used)
        article_count = len(articles)
        
        # Base intro phrasing
        intro = f"I've analyzed {article_count} recent articles from {sources_count} different sources. Overall, the reporting on **{topic}** carries a **{overall.lower()}** tone."
        
        if intent == "summarize":
            reasoning_steps.append("Performing multi-article summarization.")
            summary = summarize_articles(articles, sentence_count=3)
            response = f"{intro}\n\n**Here's a quick synthesis of the latest updates:**\n{summary}\n\nMost reports are focusing on {', '.join(analytics.get('trending_keywords', [])[:2]).lower()}."
        
        elif intent == "sentiment":
            reasoning_steps.append("Deep-diving into sentiment and tone.")
            dist = analytics.get("distribution", {})
            response = f"{intro}\n\n**Sentiment Breakdown:**\nSpecifically, {dist.get('Positive')} articles are optimistic, while {dist.get('Negative')} lean negative. "
            
            if overall == "Negative":
                response += "The prevailing narrative is currently critical or cautious, likely due to recent challenges in the sector."
            elif overall == "Positive":
                response += "The mood across outlets is quite positive, reflecting strong momentum or successful outcomes."
            else:
                response += "The coverage is exceptionally balanced, with outlets providing factual reporting without a dominant emotional lean."
            
        elif intent == "trends":
            reasoning_steps.append("Mapping trending landscape.")
            trending = analytics.get("trending_keywords", [])
            keywords_str = ", ".join(trending)
            response = f"{intro}\n\n**Key Trends & Focus Areas:**\nThe discussion is currently being driven by keywords like **{keywords_str}**. These topics are appearing most frequently across my analyzed source pool, indicating they are the primary 'gravity centers' for this story."

        elif intent == "compare":
            reasoning_steps.append("Analyzing cross-source perspectives.")
            comparison = analytics.get("source_comparison", [])
            response = f"{intro}\n\n**Here's how different sources are framing this topic:**\n"
            for s in comparison[:3]:
                response += f"- **{s['source']}** is reporting with an **{s['tone'].lower()}** tone, focusing primarily on {', '.join(s['key_points'][:2]).lower()}.\n"
            
            response += "\nThis comparison highlights a diversity in perspective, with some outlets prioritizing factual grounding while others lean into predictive or critical analysis."

        else: # general_search or detailed_insights
            reasoning_steps.append("General intelligence overview.")
            summary = summarize_articles(articles, sentence_count=2)
            response = f"{intro}\n\n**Key Insight:**\n{summary}"
            
            if analytics.get("core_narrative"):
                response += f"\n\n**Core Narrative:**\n{analytics['core_narrative']}"

        # Add Contradiction detection at the end of every news-heavy response
        if analytics.get("contradictions") and len(articles) > 2:
            response += "\n\n**Analysis Alert (Contradiction Detection):**\n" + "\n".join([f"⚠️ {c}" for c in analytics["contradictions"]])

    # Personalization Logic & Topic Tracking
    topic_history = state.setdefault("topic_frequency", {})
    topic_history[topic] = topic_history.get(topic, 0) + 1
    
    if user_name:
        if topic_history[topic] > 2:
            personal_note = f" Since you've been following {topic} closely, I've prioritized the most recent deep-dives for you."
            response += "\n\n" + personal_note
        elif random.random() < 0.2:
            greetings = [f"Hi {user_name}, ", f"Hello {user_name}, "]
            response = random.choice(greetings) + response

    state["history"].append({"agent": response})
    
    # Prune history
    state["history"] = state["history"][-10:]
    initial_agent_state[session_id] = state
    
    # Build augmented payload
    explainability = {
        "articles_analyzed": len(articles),
        "sources_used": sources_used,
        "reasoning": reasoning_steps,
        "suggestions": get_suggestions(intent, topic, analytics)
    }
    
    return response, state, articles, analytics, explainability
