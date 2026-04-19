import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const sendChatQuery = async (query, sessionId) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      query,
      session_id: sessionId
    });
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};
