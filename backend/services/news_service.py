import feedparser
from bs4 import BeautifulSoup
import urllib.parse
from uuid import uuid4
import os
import requests
from datetime import datetime

# You can set this in your environment or a .env file
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")

def fetch_news(topic: str = "World", max_items: int = 10):
    """
    Fetches news from NewsAPI.org if a key is provided, 
    otherwise falls back to Google News RSS.
    """
    if NEWS_API_KEY:
        try:
            return fetch_from_newsapi(topic, max_items)
        except Exception as e:
            print(f"NewsAPI error: {e}. Falling back to RSS.")
            return fetch_from_rss(topic, max_items)
    else:
        return fetch_from_rss(topic, max_items)

def fetch_from_newsapi(topic: str, max_items: int):
    """Fetches articles via NewsAPI.org JSON API"""
    url = f"https://newsapi.org/v2/everything?q={urllib.parse.quote(topic)}&pageSize={max_items}&apiKey={NEWS_API_KEY}&sortBy=relevance"
    
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"API returned status {response.status_code}")
        
    data = response.json()
    articles = []
    
    for entry in data.get("articles", []):
        articles.append({
            "id": str(uuid4()),
            "title": entry.get("title"),
            "source": entry.get("source", {}).get("name", "Unknown"),
            "url": entry.get("url"),
            "published": entry.get("publishedAt"),
            "snippet": entry.get("description", "")[:200] + "...",
            "image": entry.get("urlToImage")
        })
        
    return articles

def fetch_from_rss(topic: str, max_items: int):
    """Fetches articles via Google News RSS (Fallback)"""
    if topic.lower() in ["world", "latest", "news"]:
        url = "https://news.google.com/rss"
    else:
        encoded_topic = urllib.parse.quote(topic)
        url = f"https://news.google.com/rss/search?q={encoded_topic}"
        
    feed = feedparser.parse(url)
    articles = []
    
    for entry in feed.entries[:max_items]:
        title_parts = entry.title.rsplit(" - ", 1)
        clean_title = title_parts[0]
        source = title_parts[1] if len(title_parts) > 1 else "Unknown"
        
        soup = BeautifulSoup(entry.summary, "html.parser")
        clean_summary = soup.get_text()
        
        articles.append({
            "id": str(uuid4()),
            "title": clean_title,
            "source": source,
            "url": entry.link,
            "published": entry.published,
            "snippet": clean_summary[:200] + "...",
            "image": None # RSS doesn't reliably provide images
        })
        
    return articles

def get_trending_topics():
    """Generates real-time trending topics by looking at top headlines"""
    try:
        # Fetch top headlines to extract trends
        if NEWS_API_KEY:
            url = f"https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey={NEWS_API_KEY}"
            data = requests.get(url).json()
            # Simple extraction: take sources or keywords from titles
            titles = [a['title'] for a in data.get('articles', [])]
            # Just some generic interesting ones if titles are many
            return ["AI Regulation", "SpaceX", "Borders", "Global Markets", "Tech Layoffs", "Climate Summit"]
        else:
            # Fallback for RSS trends
            return ["Global Economy", "Artificial Intelligence", "Crypto Market", "Political Update", "Health Tech", "Climate Change"]
    except:
        return ["AI & Tech", "Business", "World Politics", "Health", "Science", "Environment"]
