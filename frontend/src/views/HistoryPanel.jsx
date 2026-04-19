import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../context/NewsContext';

const HistoryPanel = () => {
  const { history } = useNews();
  const navigate = useNavigate();

  const handleHistoryClick = (query) => {
    navigate('/dashboard', { state: { autoQuery: query } });
  };

  return (
    <div className="view-panel-section is-active">
      <div className="view-title-head">Query History</div>
      <div className="view-sub-text">Previous news intelligence queries from this session</div>
      
      <div className="history-view-list-items">
        {history.length > 0 ? (
          history.map((item, idx) => (
            <div 
              key={idx} 
              className="history-view-item-box"
              onClick={() => handleHistoryClick(item.query)}
            >
              <div className="history-view-index">{history.length - idx}</div>
              <div>
                <div className="history-view-q-text">{item.query}</div>
                <div className="history-view-meta-info">{item.topic || 'General'} · {item.time}</div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--ink-4)', fontSize: '12px', fontFamily: 'var(--ff-mono)' }}>No queries yet. Your conversation history will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
