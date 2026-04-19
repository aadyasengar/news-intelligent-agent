import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TRENDING_DATA, TOPICS } from '../utils/constants';

const TrendingPanel = () => {
  const navigate = useNavigate();

  const handleTrendClick = (key) => {
    const label = TOPICS[key]?.label || 'General News';
    navigate('/dashboard', { state: { autoQuery: `Latest ${label} news?` } });
  };

  return (
    <div className="view-panel-section is-active">
      <div className="view-title-head">Trending Now</div>
      <div className="view-sub-text">Topics generating the most coverage across verified sources</div>
      
      <div className="trending-items-grid">
        {TRENDING_DATA.map((t, idx) => (
          <div 
            key={idx} 
            className="trending-item-card" 
            style={{ '--card-accent': t.accent }}
            onClick={() => handleTrendClick(t.key)}
          >
            <div className="trending-card-icon-box" style={{ color: t.accent }}>{t.emoji}</div>
            <div className="trending-card-name-text">{TOPICS[t.key]?.label}</div>
            <div className="trending-card-count-text">{t.count}</div>
            <div className="trending-card-volume-pill">↑ {t.volume}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPanel;
