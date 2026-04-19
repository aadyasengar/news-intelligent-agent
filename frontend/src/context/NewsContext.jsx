import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [currentInsight, setCurrentInsight] = useState({
    topic: 'World News',
    sentiment: 'Neutral',
    sentimentDistribution: { Positive: 33, Neutral: 34, Negative: 33 },
    articlesAnalysed: 0,
    analytics: []
  });

  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTrending = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('http://localhost:8000/api/trending');
      const data = await res.json();
      setTrendingTopics(data.topics || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch trending:", err);
      // Fallback if needed
      if (trendingTopics.length === 0) {
        setTrendingTopics(["AI Regulation", "Big Tech", "Economy", "Climate", "Space"]);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [trendingTopics.length]);

  // Initial fetch
  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  // Auto-refresh every 12 minutes (720,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTrending();
    }, 12 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTrending]);

  const updateInsight = (data) => {
    setCurrentInsight(prev => ({
      ...prev,
      ...data
    }));
  };

  const addHistory = (query, topic) => {
    setHistory(prev => [{ query, topic, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
  };

  return (
    <NewsContext.Provider value={{ 
      currentInsight, 
      updateInsight, 
      history, 
      addHistory, 
      lastUpdated, 
      trendingTopics, 
      fetchTrending,
      isRefreshing
    }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
