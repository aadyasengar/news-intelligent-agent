from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from rake_nltk import Rake
import nltk
import urllib.parse
import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

sentiment_analyzer = SentimentIntensityAnalyzer()
rake = Rake()

HIGH_CREDIBILITY_SOURCES = ['reuters', 'bbc', 'nytimes', 'wsj', 'ap', 'bloomberg', 'ft', 'washingtonpost', 'npr']
MODERATE_CREDIBILITY_SOURCES = ['cnn', 'foxnews', 'theguardian', 'nbc', 'abc', 'cbs', 'usatoday', 'forbes']

def assess_credibility(source_url: str, title: str) -> dict:
    domain = ""
    try:
        domain = urllib.parse.urlparse(source_url).netloc.lower()
        if domain.startswith('www.'):
            domain = domain[4:]
    except:
        pass
    
    score = 50 
    label = "Neutral Source"
    
    for s in HIGH_CREDIBILITY_SOURCES:
        if s in domain:
            score = 90
            label = "High Credibility"
            break
            
    if score == 50:
        for s in MODERATE_CREDIBILITY_SOURCES:
            if s in domain:
                score = 75
                label = "Moderate Credibility"
                break
                
    clickbait_words = ['shocking', 'unbelievable', 'mind-blowing', 'viral']
    title_lower = title.lower()
    if any(cw in title_lower for cw in clickbait_words):
        score -= 20
        if score < 40:
            label = "Low Credibility / Potential Clickbait"
            
    return {
        "score": score,
        "label": label,
        "domain": domain or "Unknown"
    }

def analyze_article(article: dict):
    text = f"{article.get('title', '')}. {article.get('snippet', '')}"
    
    # Sentiment Analysis
    scores = sentiment_analyzer.polarity_scores(text)
    compound = scores['compound']
    if compound >= 0.05:
        sentiment = "Positive"
    elif compound <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
        
    # Keyword Extraction
    rake.extract_keywords_from_text(text)
    keywords = rake.get_ranked_phrases()[:4]
    
    # Credibility
    credibility = assess_credibility(article.get('link', ''), article.get('title', ''))
    
    return {
        "sentiment": sentiment,
        "sentiment_score": compound,
        "sentiment_raw": scores,
        "keywords": keywords,
        "credibility": credibility
    }

def detect_trends(articles: list, top_n: int = 6) -> list:
    """
    Extracts high-level macro trends appearing across multiple articles.
    """
    from collections import Counter
    all_keywords = []
    
    for article in articles:
        analysis = article.get("analysis", {})
        kw = analysis.get("keywords", [])
        if not kw:
            text = f"{article.get('title', '')}. {article.get('snippet', '')}"
            rake.extract_keywords_from_text(text)
            kw = rake.get_ranked_phrases()[:4]
        
        # Take single word components longer than 3 chars for cross-article overlap mapping
        for phrase in kw:
            words = [w for w in phrase.split() if w.isalpha() and len(w) > 3]
            all_keywords.extend(words)
            
    counts = Counter(all_keywords)
    return [word.title() for word, cnt in counts.most_common(top_n)]

def compare_sources(articles: list):
    """
    Groups articles by source and determines the tone and key focus area for each.
    """
    source_data = {}
    for article in articles:
        source = article.get("source", "Unknown")
        if source not in source_data:
            source_data[source] = {"articles": [], "sentiment_sum": 0, "count": 0}
        
        analysis = article.get("analysis", {})
        source_data[source]["articles"].append(article)
        source_data[source]["sentiment_sum"] += analysis.get("sentiment_score", 0)
        source_data[source]["count"] += 1

    comparison = []
    for source, data in source_data.items():
        avg_score = data["sentiment_sum"] / data["count"]
        if avg_score >= 0.2:
            tone = "Optimistic"
        elif avg_score > 0.05:
            tone = "Slightly Positive"
        elif avg_score <= -0.2:
            tone = "Critical"
        elif avg_score < -0.05:
            tone = "Slightly Negative"
        else:
            tone = "Neutral / Factual"
        
        # Extract unique key points for this source
        key_points = []
        for a in data["articles"]:
            key_points.extend(a["analysis"].get("keywords", []))
        
        # Take unique top keywords
        unique_points = list(dict.fromkeys([p.title() for p in key_points if len(p) > 3]))[:3]
        
        comparison.append({
            "source": source,
            "tone": tone,
            "count": data["count"],
            "key_points": unique_points
        })
    
    return sorted(comparison, key=lambda x: x['count'], reverse=True)

def classify_domain(text: str) -> str:
    """Classifies the article into a domain based on keyword weighting."""
    domains = {
        "Technology": ["ai", "tech", "chip", "software", "google", "apple", "silicon", "robot", "digital"],
        "Business": ["market", "stock", "revenue", "profit", "merger", "ceo", "company", "trade", "finance"],
        "Politics": ["election", "policy", "government", "senate", "law", "vote", "geopolitics", "minister"],
        "Science": ["mars", "nasa", "space", "discovery", "biology", "physics", "climate", "nature"],
        "Health": ["medical", "doctor", "health", "vaccine", "drug", "fda", "hospital", "patient"]
    }
    
    scores = {d: 0 for d in domains}
    text_lower = text.lower()
    for d, keywords in domains.items():
        for k in keywords:
            if k in text_lower:
                scores[d] += 1
                
    best_domain = max(scores, key=scores.get)
    return best_domain if scores[best_domain] > 0 else "General"

def extract_core_narrative(articles: list, trends: list) -> str:
    """Identifies the underlying story across multiple articles."""
    if not articles: return ""
    
    # Simple logic: take the most relevant article snippet that contains trending keywords
    best_snippet = articles[0].get("snippet", "")
    max_overlap = 0
    
    for a in articles:
        overlap = len(set(trends) & set(a.get("analysis", {}).get("keywords", [])))
        if overlap > max_overlap:
            max_overlap = overlap
            best_snippet = a.get("snippet", "")
            
    return best_snippet[:250] + ("..." if len(best_snippet) > 250 else "")

def detect_contradictions(articles: list) -> list:
    """Detects and highlights conflicting viewpoints across articles."""
    contradictions = []
    # Check for articles with similar keywords but opposing sentiments
    for i in range(len(articles)):
        for j in range(i + 1, len(articles)):
            a1, a2 = articles[i], articles[j]
            kw1 = set(a1.get("analysis", {}).get("keywords", []))
            kw2 = set(a2.get("analysis", {}).get("keywords", []))
            
            common = kw1 & kw2
            if len(common) >= 1: # They talk about the same thing
                s1 = a1.get("analysis", {}).get("sentiment")
                s2 = a2.get("analysis", {}).get("sentiment")
                
                if (s1 == "Positive" and s2 == "Negative") or (s1 == "Negative" and s2 == "Positive"):
                    contradictions.append(f"Conflict detected between {a1.get('source')} and {a2.get('source')} regarding '{list(common)[0]}'.")
                    
    return list(set(contradictions))[:2]

def aggregate_insights(articles: list):
    if not articles:
        return {}
        
    sentiments = {"Positive": 0, "Negative": 0, "Neutral": 0}
    
    for article in articles:
        # Precompute analysis
        analysis = analyze_article(article)
        article["analysis"] = analysis
        sentiments[analysis["sentiment"]] += 1
        
    overall_sentiment = max(sentiments, key=sentiments.get) if articles else "Neutral"
    trending_keywords = detect_trends(articles)
    source_comparison = compare_sources(articles)
    core_narrative = extract_core_narrative(articles, trending_keywords)
    contradictions = detect_contradictions(articles)
    
    # Enrichment: classify domains for each article
    for a in articles:
        a["analysis"]["domain"] = classify_domain(f"{a['title']} {a['snippet']}")
    
    return {
        "distribution": sentiments,
        "overall_sentiment": overall_sentiment,
        "trending_keywords": trending_keywords,
        "source_comparison": source_comparison,
        "core_narrative": core_narrative,
        "contradictions": contradictions
    }
