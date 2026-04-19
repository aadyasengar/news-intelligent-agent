import React from 'react';
import { useNews } from '../context/NewsContext';

const AnalyticsView = () => {
  const { currentInsight, history } = useNews();
  
  // Basic stats logic
  const totalQueries = history.length;
  const uniqueTopics = new Set(history.map(h => h.topic)).size;
  const avgPerTopic = uniqueTopics > 0 ? (totalQueries / uniqueTopics).toFixed(1) : 0;

  const stats = [
    { num: totalQueries, label: 'Total Queries' },
    { num: uniqueTopics, label: 'Topics Explored' },
    { num: avgPerTopic, label: 'Avg per Topic' }
  ];

  // Calculate topic counts
  const topicCounts = history.reduce((acc, curr) => {
    acc[curr.topic] = (acc[curr.topic] || 0) + 1;
    return acc;
  }, {});

  const sortedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({
      label,
      count: `${count} quer${count === 1 ? 'y' : 'ies'}`,
      pct: Math.min(100, Math.round((count / totalQueries) * 100)) || 0,
      color: label.includes('AI') ? 'var(--sage)' : 'var(--gold)'
    }));

  const sentimentDist = currentInsight.sentimentDistribution || { Positive: 33, Neutral: 34, Negative: 33 };
  const sentiments = [
    { label: 'Positive', pct: sentimentDist.Positive, color: 'var(--sage)' },
    { label: 'Neutral', pct: sentimentDist.Neutral, color: 'var(--gold)' },
    { label: 'Negative', pct: sentimentDist.Negative, color: 'var(--rust)' }
  ];

  return (
    <div className="view-panel-section is-active">
      <div className="view-title-head">Session Analytics</div>
      <div className="view-sub-text">Query patterns and intelligence insights from this session</div>
      
      <div className="stat-values-grid">
        {stats.map((s, idx) => (
          <div key={idx} className="stat-data-card">
            <div className="stat-num-big">{s.num}</div>
            <div className="stat-label-info">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="ana-stat-section-title">Most Searched Topics</div>
      <div style={{ marginBottom: '24px' }}>
        {sortedTopics.length > 0 ? sortedTopics.map((t, idx) => (
          <div key={idx} className="big-bar-row-item">
            <div className="big-bar-header-info">
              <span className="big-bar-topic-name">{t.label}</span>
              <span className="big-bar-pct-val">{t.count}</span>
            </div>
            <div className="big-bar-bg-line">
              <div className="big-bar-fill-line" style={{ width: `${t.pct}%`, background: t.color }}></div>
            </div>
          </div>
        )) : (
          <p style={{ color: 'var(--ink-4)', fontSize: '12px', fontFamily: 'var(--ff-mono)' }}>No queries yet. Ask something to see your analytics.</p>
        )}
      </div>

      <div className="ana-stat-section-title">Sentiment Distribution</div>
      <div className="view-sub-text" style={{ fontSize: '11px', marginBottom: '15px' }}>Tone of the latest analysed source</div>
      <div>
        {sentiments.map((s, idx) => (
          <div key={idx} className="big-bar-row-item">
            <div className="big-bar-header-info">
              <span className="big-bar-topic-name">{s.label}</span>
              <span className="big-bar-pct-val">{s.pct}%</span>
            </div>
            <div className="big-bar-bg-line">
              <div className="big-bar-fill-line" style={{ width: `${s.pct}%`, background: s.color }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsView;
