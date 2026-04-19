import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Bot, MessageSquare, TrendingUp, BarChart2, Clock, 
  LogOut, Menu, MapPin, Activity, Zap, Edit3, Sun, Moon, Globe, RefreshCw
} from 'lucide-react';

import { useNews } from '../context/NewsContext';
import { TOPICS } from '../utils/constants';

const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} mins ago`;
  return 'some time ago';
};

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { 
    currentInsight, 
    history: queryHistory, 
    lastUpdated, 
    trendingTopics, 
    fetchTrending, 
    isRefreshing 
  } = useNews();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(lastUpdated));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeAgo(getTimeAgo(lastUpdated));
    }, 30000); 
    return () => clearInterval(timer);
  }, [lastUpdated]);

  useEffect(() => {
    setTimeAgo(getTimeAgo(lastUpdated));
  }, [lastUpdated]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('trending')) return 'Trending Topics';
    if (path.includes('analytics')) return 'Analytics Dashboard';
    if (path.includes('history')) return 'Query History';
    return 'News Intelligence';
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleQuickAsk = (query) => {
    navigate('/dashboard', { state: { query } });
  };

  const frequentTopics = useMemo(() => {
    const counts = queryHistory.reduce((acc, curr) => {
      acc[curr.topic] = (acc[curr.topic] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);
  }, [queryHistory]);

  const sentClasses = { Positive: 'is-positive', Neutral: 'is-neutral', Negative: 'is-negative' };

  return (
    <div className="app-shell">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay show" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="logo">
            <div className="logo-mark">
              <Zap style={{ stroke: '#f5f0e8' }} size={16} />
            </div>
            <span className="logo-text">Pulse<em>AI</em></span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          <NavLink to="/dashboard" end className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            <MessageSquare size={15} />
            News Chat
            <span className="nav-badge">Live</span>
          </NavLink>
          <NavLink to="/dashboard/trending" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            <TrendingUp size={15} />
            Trending
          </NavLink>
          <NavLink to="/dashboard/analytics" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            <BarChart2 size={15} />
            Analytics
          </NavLink>
          <NavLink to="/dashboard/history" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            <Clock size={15} />
            History
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-avatar">{user?.name?.[0] || 'A'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name">{user?.name || 'Alex Rivera'}</div>
              <div className="user-role">Analyst</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign out">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="topbar">
          <button className="hamburger-btn" onClick={toggleSidebar}>
            <Menu size={18} />
          </button>
          <span className="topbar-title">{getTitle()}</span>
          
          <div className="topbar-right">
            <div className="trending-chips-bar">
              {trendingTopics.map((topic, i) => (
                <div key={i} className={`trend-chip-pill ${i === 0 ? 'hot' : ''}`} onClick={() => handleQuickAsk(`Tell me about ${topic}`)}>
                  <div className="trend-chip-dot"></div>{topic}
                </div>
              ))}
            </div>

            <div className="refresh-block">
              <span className="last-updated-text">
                Updated {timeAgo}
              </span>
              <button 
                className={`refresh-action-btn ${isRefreshing ? 'is-spinning' : ''}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  fetchTrending();
                }}
                disabled={isRefreshing}
                title="Refresh news topics"
              >
                <RefreshCw size={13} />
              </button>
            </div>

            <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <div className="live-status-pill">
              <div className="live-status-dot"></div>Live
            </div>
          </div>
        </header>

        <div className="content-area-row">
          <main className="chat-col">
            <Outlet />
          </main>

          <aside className="right-sidebar-panel">
            <div className="rp-section">
              <div className="panel-section-title">Live Insights</div>
              
              <div className="insight-data-card" style={{ marginBottom: '8px' }}>
                <div className="insight-row-flex">
                  <span className="insight-label-small">Detected Topic</span>
                  <div className="insight-icon-box sage-style">
                    <MapPin size={14} />
                  </div>
                </div>
                <div className="insight-value-large" style={{ fontSize: '13.5px', margin: '4px 0' }}>
                  {currentInsight.topic}
                </div>
                <div className="insight-sub-info">Real-time detection</div>
              </div>

              <div className="insight-data-card" style={{ marginBottom: '8px' }}>
                <div className="insight-row-flex">
                  <span className="insight-label-small">Sentiment</span>
                  <div className="insight-icon-box gold-style">
                    <Edit3 size={14} />
                  </div>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <span className={`sentiment-status-badge ${sentClasses[currentInsight.sentiment] || 'is-neutral'}`}>
                    <span className="sent-circle-dot"></span>{currentInsight.sentiment}
                  </span>
                </div>
              </div>

              <div className="insight-data-card">
                <div className="insight-row-flex">
                  <span className="insight-label-small">Articles Analysed</span>
                  <div className="insight-icon-box ink-style">
                    <Activity size={14} />
                  </div>
                </div>
                <div className="insight-value-large">{currentInsight.articlesAnalysed}</div>
                <div className="insight-sub-info">Across verified sources</div>
              </div>
            </div>

            {frequentTopics.length > 0 && (
              <div className="rp-section" style={{ marginTop: '20px' }}>
                <div className="panel-section-title">Personalized for You</div>
                <div className="insight-data-card">
                  <div className="insight-label-small" style={{ marginBottom: '8px' }}>Based on your interests</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {frequentTopics.map(t => (
                      <div key={t} className="personal-topic-chip" onClick={() => handleQuickAsk(`Show me latest ${t} updates`)}>
                        <Globe size={11} style={{ opacity: 0.6 }} />
                        <span>{t}</span>
                        <Zap size={10} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="rp-section" style={{ marginTop: '20px' }}>
              <div className="panel-section-title">History</div>
              <div className="history-list-vertical">
                {queryHistory.length > 0 ? queryHistory.slice(0, 4).map((h, i) => (
                  <div key={i} className="history-item-card" onClick={() => handleQuickAsk(h.query)}>
                    <div className="history-q-text">{h.query}</div>
                    <div className="history-meta-text">{h.time}</div>
                  </div>
                )) : (
                  <div style={{ fontSize: '11px', color: 'var(--ink-4)', textAlign: 'center', padding: '8px', fontFamily: 'var(--ff-mono)' }}>No history yet</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
