import React, { useState, useRef, useEffect, useContext } from 'react';
import { sendChatQuery } from '../api/client';
import { 
  Send, Bot, User, ChevronDown, ChevronUp, 
  Search, Mic, Clock, Info, Activity, Globe, ExternalLink
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNews } from '../context/NewsContext';
import { TOPICS } from '../utils/constants';

const AIResponseCard = ({ msg, onSuggestionClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = msg.analytics || {};
  const explainability = msg.explainability || {};
  const articles = msg.articles || [];

  const distribution = data.distribution || { Positive: 0, Neutral: 0, Negative: 0 };
  const total = (distribution.Positive || 0) + (distribution.Neutral || 0) + (distribution.Negative || 0) || 1;
  
  const bars = [
    { label: 'Positive', pct: Math.round((distribution.Positive || 0) / total * 100), color: 'var(--sage)' },
    { label: 'Neutral', pct: Math.round((distribution.Neutral || 0) / total * 100), color: 'var(--gold)' },
    { label: 'Negative', pct: Math.round((distribution.Negative || 0) / total * 100), color: 'var(--rust)' },
  ];

  return (
    <div className="ai-response-card">
      <div className="ai-response-body">
        <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
      </div>

      {data.source_comparison && data.source_comparison.length > 0 && (
        <div className="source-comparison-box">
          <div className="summary-label-box">
            <Activity size={11} />
            Provider Perspectives
          </div>
          <div className="source-tone-grid">
            {data.source_comparison.slice(0, 3).map((s, idx) => (
              <div key={idx} className="source-tone-item">
                <div className="source-tone-header">
                  <span className="source-tone-name">{s.source}</span>
                  <span className={`source-tone-pill ${s.tone.toLowerCase().includes('negative') || s.tone.toLowerCase().includes('critical') ? 'is-neg' : s.tone.toLowerCase().includes('positive') || s.tone.toLowerCase().includes('optimistic') ? 'is-pos' : 'is-neu'}`}>
                    {s.tone}
                  </span>
                </div>
                <div className="source-keywords-row">
                  {s.key_points.map((kp, kidx) => (
                    <span key={kidx} className="source-kw-tag">{kp}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div className="news-summary-box">
          <div className="summary-label-box">
            <Globe size={11} />
            Verified Sources · {explainability.articles_analyzed || articles.length} articles analysed
          </div>
          <div className="articles-container">
            {articles.slice(0, 3).map((h, i) => (
              <article key={i} className="news-article-item">
                <div className="article-header">
                  <span className="article-source-tag">{h.source}</span>
                  <span className="article-date-tag">
                    {h.published ? new Date(h.published).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'}
                  </span>
                </div>
                <h4 className="article-title-text">{h.title}</h4>
                {h.snippet && <p className="article-snippet-text">{h.snippet}</p>}
                <a 
                  href={h.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="read-full-link"
                >
                  Read Full Article <ExternalLink size={12} />
                </a>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="expand-toggle-section" onClick={() => setIsOpen(!isOpen)}>
        <span className="expand-label-pill">
          <Activity size={11} />
          Sentiment & Reasoning
        </span>
        <ChevronDown className={`chevron-icon ${isOpen ? 'is-open' : ''}`} size={13} />
      </div>

      <div className={`expand-panel-body ${isOpen ? 'is-open' : ''}`}>
        {/* ... existing sentiment and keywords ... */}
        <div style={{ marginBottom: '11px' }}>
          <div style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '7px', fontFamily: 'var(--ff-mono)' }}>
            Sentiment Breakdown
          </div>
          {bars.map(b => (
            <div key={b.label} className="sent-bar-row-item">
              <span className="sent-label-text">{b.label}</span>
              <div className="sent-bar-bg-box">
                <div className="sent-bar-fill-box" style={{ width: `${b.pct}%`, background: b.color }}></div>
              </div>
              <span className="sent-pct-text">{b.pct}%</span>
            </div>
          ))}
        </div>

        {data.trending_keywords && (
          <div>
            <div style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '6px', fontFamily: 'var(--ff-mono)' }}>
              Keywords
            </div>
            <div className="kw-grid-row">
              {data.trending_keywords.map(k => (
                <div key={k} className="kw-chip-pill">{k}</div>
              ))}
            </div>
          </div>
        )}

        {explainability.reasoning && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '6px', fontFamily: 'var(--ff-mono)' }}>
              AI Reasoning
            </div>
            <ul style={{ paddingLeft: '14px', fontSize: '11px', color: 'var(--ink-3)', margin: 0 }}>
              {explainability.reasoning.map((step, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {explainability.suggestions && explainability.suggestions.length > 0 && (
        <div className="suggestions-foot-row">
          {explainability.suggestions.map((s, idx) => (
            <button key={idx} className="suggestion-action-chip" onClick={() => onSuggestionClick(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Logic components
const detectTopic = (text) => {
  const lower = text.toLowerCase();
  for (const [key, data] of Object.entries(TOPICS)) {
    if (data.keywords.some(kw => lower.includes(kw))) return data.label;
  }
  return 'General News';
};

const ChatInterface = ({ initialQuery }) => {
  const { user } = useContext(AuthContext);
  const { updateInsight, addHistory } = useNews();

  const sessionId = useMemo(() => {
    let sid = sessionStorage.getItem('pulseai_session_id');
    if (!sid) {
      sid = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem('pulseai_session_id', sid);
    }
    return sid;
  }, []);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (initialQuery) {
        handleSend(initialQuery);
      }
    }
  }, [initialQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryOverride) => {
    const q = queryOverride || input;
    if (!q.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', text: q, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMessage]);
    if (!queryOverride) setInput('');
    setIsLoading(true);

    const topicLabel = detectTopic(q);

    try {
      const response = await sendChatQuery(q, sessionId, user?.name);
      
      const agentMessage = {
        id: Date.now() + 1,
        role: 'agent',
        text: response.response,
        articles: response.articles,
        analytics: response.analytics,
        explainability: response.explainability,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Update global insights
      const finalTopic = response.topic || topicLabel;
      updateInsight({
        topic: finalTopic,
        sentiment: response.analytics?.overall_sentiment || 'Neutral',
        articlesAnalysed: response.explainability?.articles_analyzed || response.articles?.length || 0
      });
      addHistory(q, finalTopic);
      
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'agent', isError: true, text: "Unable to fetch news right now. Please try again in a moment.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="chat-area">
        {messages.length === 0 && (
          <div className="welcome-screen">
            <div className="welcome-icon">
              <Bot size={26} color="var(--parchment)" strokeWidth={1.5} />
            </div>
            <div className="welcome-title">Real-Time News Intelligence</div>
            <div className="welcome-sub">Ask me anything about the latest news. I'll analyse, summarise, and surface deep insights instantly.</div>
            <div className="welcome-prompts">
              <div className="prompt-pill" onClick={() => handleSend('What are the top AI news stories today?')}>Top AI news today</div>
              <div className="prompt-pill" onClick={() => handleSend('Summarize global market news this week?')}>Global markets this week</div>
              <div className="prompt-pill" onClick={() => handleSend('Latest geopolitical developments?')}>Geopolitical developments</div>
              <div className="prompt-pill" onClick={() => handleSend('What is trending in science and tech?')}>Science & tech trends</div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`msg-row ${msg.role === 'user' ? 'user-row' : ''}`}>
            <div className={`msg-avatar ${msg.role === 'agent' ? 'ai' : 'user-av'}`}>
              {msg.role === 'agent' ? 'AI' : (user?.name?.charAt(0) || 'U')}
            </div>
            <div className="msg-col">
              {msg.role === 'user' ? (
                <div className="bubble user-bubble">{msg.text}</div>
              ) : (
                msg.isError ? (
                  <div className="bubble error-bubble">{msg.text}</div>
                ) : (
                  <AIResponseCard msg={msg} onSuggestionClick={handleSend} />
                )
              )}
              <span className="msg-time">{msg.time}</span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="typing-indicator-row">
            <div className="msg-avatar ai">AI</div>
            <div className="typing-bubble-card">
              <div className="typing-dots-container">
                <div className="td-dot"></div>
                <div className="td-dot"></div>
                <div className="td-dot"></div>
              </div>
              <span className="typing-label-text">Analysing latest news…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-block-section">
        <div className="input-field-row">
          <Search size={15} color="var(--ink-4)" />
          <input 
            className="main-news-input" 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about the latest news…" 
            autoComplete="off"
          />
          <div className="input-actions-box">
            <button className="input-icon-action-btn" title="Voice input">
              <Mic size={14} />
            </button>
            <button className="send-action-btn" onClick={() => handleSend()}>
              <Send size={14} color="var(--parchment)" />
            </button>
          </div>
        </div>
        <div className="input-hint-text">Press Enter to send · Powered by PulseAI News Intelligence</div>
      </div>
    </div>
  );
};

export default ChatInterface;

