import axios from 'axios';
const API_BASE_URL = 'http://10.22.138.54:8080/api';
const API_BASE_URL_SUPABASE = 'https://kjsganrpfhivqpruovrg.supabase.co/rest/v1/';
const API_KEY = 'your_api_key_here'; 


export const fetchChat = async (prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, { prompt });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
}

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPABASE}users`, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

const supabaseHeaders = {
  'Content-Type': 'application/json',
  'apikey': API_KEY
  };
