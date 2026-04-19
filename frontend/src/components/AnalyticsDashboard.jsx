import React from 'react';
import { BarChart, Activity, Hash, Layers } from 'lucide-react';

const AnalyticsDashboard = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="glass-panel" style={{ height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <Activity size={48} opacity={0.3} style={{ marginBottom: '20px' }} />
        <h3>Waiting for intelligence...</h3>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '10px' }}>
          Start a conversation to see real-time analytics and insights.
        </p>
      </div>
    );
  }

  const { overall_sentiment, distribution, trending_keywords } = analytics;
  const total = distribution ? Object.values(distribution).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="glass-panel" style={{ height: '100%', padding: '25px', display: 'flex', flexDirection: 'column', gap: '30px', overflowY: 'auto' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
        <BarChart color="var(--accent-primary)" /> Live Insights
      </h2>

      {/* Sentiment Overview Widget */}
      <div>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} /> Sentiment Distribution
        </h3>
        
        <div style={{ display: 'flex', height: '15px', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px' }}>
          {total > 0 && distribution && (
            <>
              <div style={{ width: `${(distribution.Positive / total) * 100}%`, backgroundColor: 'var(--status-positive)' }} title="Positive" />
              <div style={{ width: `${(distribution.Neutral / total) * 100}%`, backgroundColor: 'var(--status-neutral)' }} title="Neutral" />
              <div style={{ width: `${(distribution.Negative / total) * 100}%`, backgroundColor: 'var(--status-negative)' }} title="Negative" />
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--status-positive)' }}>Pos: {distribution.Positive || 0}</span>
          <span style={{ color: 'var(--status-neutral)' }}>Neu: {distribution.Neutral || 0}</span>
          <span style={{ color: 'var(--status-negative)' }}>Neg: {distribution.Negative || 0}</span>
        </div>
      </div>

      {/* Trending Keywords Widget */}
      <div>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Hash size={16} /> Trending Keywords
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {trending_keywords && trending_keywords.map((kw, i) => (
            <span key={i} style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              fontSize: '0.85rem',
              color: 'var(--text-primary)'
            }}>
              {kw}
            </span>
          ))}
          {(!trending_keywords || trending_keywords.length === 0) && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No keywords extracted.</span>
          )}
        </div>
      </div>
      
      {/* Overall Status Widget */}
      <div style={{ 
        marginTop: 'auto', 
        padding: '20px', 
        backgroundColor: 'rgba(0,0,0,0.2)', 
        borderRadius: '15px',
        border: '1px solid var(--glass-border)'
       }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} /> Aggregate Conclusion
        </h3>
        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: overall_sentiment === 'Positive' ? 'var(--status-positive)' : overall_sentiment === 'Negative' ? 'var(--status-negative)' : 'var(--status-neutral)' }}>
          {overall_sentiment} Trend Detected
        </p>
      </div>

    </div>
  );
};

export default AnalyticsDashboard;
