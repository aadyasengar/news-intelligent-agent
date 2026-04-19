import React from 'react';
import { ExternalLink, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const NewsCard = ({ article }) => {
  const analysis = article.analysis || {};
  const sentiment = analysis.sentiment || "Neutral";
  
  let StatusIcon = Minus;
  let statusColor = "var(--status-neutral)";
  
  if (sentiment === "Positive") {
    StatusIcon = TrendingUp;
    statusColor = "var(--status-positive)";
  } else if (sentiment === "Negative") {
    StatusIcon = TrendingDown;
    statusColor = "var(--status-negative)";
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--glass-border)',
      borderRadius: '12px',
      padding: '15px',
      width: '350px',
      maxWidth: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top accent border indicating sentiment */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: statusColor }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', alignSelf: 'center', lineHeight: '1.4' }}>{article.title}</h4>
      </div>
      
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {article.snippet}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ 
            fontSize: '0.7rem', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            backgroundColor: `${statusColor}22`, 
            color: statusColor,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <StatusIcon size={12} /> {sentiment}
          </span>
          {article.analysis?.credibility && (
            <span style={{ 
              fontSize: '0.7rem', 
              padding: '4px 8px', 
              borderRadius: '12px', 
              backgroundColor: article.analysis.credibility.score >= 80 ? 'rgba(34, 197, 94, 0.2)' : article.analysis.credibility.score >= 60 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 44, 44, 0.2)', 
              color: article.analysis.credibility.score >= 80 ? '#4ade80' : article.analysis.credibility.score >= 60 ? '#facc15' : '#f87171',
              border: `1px solid ${article.analysis.credibility.score >= 80 ? '#4ade8044' : article.analysis.credibility.score >= 60 ? '#facc1544' : '#f8717144'}`
            }}>
              {article.analysis.credibility.label} ({article.analysis.credibility.score})
            </span>
          )}
          <span style={{ 
            fontSize: '0.7rem', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            color: 'var(--text-secondary)'
          }}>
            {article.source}
          </span>
        </div>
        
        <a href={article.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
          Read <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
