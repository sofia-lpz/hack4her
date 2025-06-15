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

//users
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
export const fetchUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPABASE}users?id=eq.${userId}`, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}
export const fetchUsersByRole = async (role) => {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPABASE}users?role=eq.${role}`, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }
}

//stores
export const fecthStores = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPABASE}stores`, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
}
export const fetchStoreById = async (storeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPABASE}stores?id=eq.${storeId}`, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching store by ID:', error);
    throw error;
  }
}

//feedback
export const fetchFeedback = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPABASE}feedback`, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
}
export const fetchFeedbackByStoreId = async (storeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPABASE}feedback?store_id=eq.${storeId}`, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback by store ID:', error);
    throw error;
  }
}
export const fetchFeedbackByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPABASE}feedback?user_id=eq.${userId}`, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback by user ID:', error);
    throw error;
  }
}
export const fetchFeedbackById = async (feedbackId) => {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPABASE}feedback?id=eq.${feedbackId}`, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback by ID:', error);
    throw error;
  }
}

//citas
export const fetchCitas = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/citas`, { prompt });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
}

const supabaseHeaders = {
  'Content-Type': 'application/json',
  'apikey': API_KEY
};
