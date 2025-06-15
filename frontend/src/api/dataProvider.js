import axios from 'axios';
const API_BASE_URL = 'http://10.22.138.54:8080/api';

export const fetchChat = async (prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, { prompt });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
}