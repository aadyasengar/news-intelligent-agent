import React, { useEffect, useRef } from 'react';
import ChatInterface from '../components/ChatInterface';
import { useLocation } from 'react-router-dom';

const ChatView = () => {
  const location = useLocation();
  const chatRef = useRef(null);

  useEffect(() => {
    if (location.state?.autoQuery) {
      // Small timeout to allow render
      setTimeout(() => {
        // We'll pass it to ChatInterface via a prop or we could just leave it. 
        // Actually, let's add an initialQuery prop to ChatInterface!
      }, 100);
    }
  }, [location.state]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ChatInterface key={location.key} initialQuery={location.state?.autoQuery} />
    </div>
  );
};

export default ChatView;
