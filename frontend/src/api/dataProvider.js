import axios from 'axios';
const API_BASE_URL = 'http://10.22.138.54:8080/api';
const SERVER_URL = 'http://10.22.138.54:8080/'
const API_BASE_URL_SUPABASE = 'https://kjsganrpfhivqpruovrg.supabase.co/rest/v1/';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqc2dhbnJwZmhpdnFwcnVvdnJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDE1MzUsImV4cCI6MjA2NTMxNzUzNX0.FQK_hfvs72VdHhvuAOtto3oBG4QyR3IsuwFYWGVkoGU';


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

export const fetchStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
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
export const fetchStores = async () => {
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
export const fetchLeastVisitedStores = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/least_visited_stores`, {
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching least visited stores:', error);
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
export const fetchFeedbackSummary = async (storeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPABASE}summarized_feedback/${storeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback summary:', error);
    throw error;
  }
}

export const postFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_BASE_URL_SUPABASE}feedback`, feedbackData, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error posting feedback:', error);
    throw error;
  }
}

export const uploadFeedbackImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageFile.uri,
    type: 'image/jpeg',
    name: imageFile.filename || 'image.jpg'
  });

  try {
    const response = await axios.post(`${SERVER_URL}upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading feedback image:', error);
    throw error;
  }
};

//citas
export const fetchCitas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/citas`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
}

export const postCitas = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_BASE_URL_SUPABASE}citas`, feedbackData, {
      headers: supabaseHeaders
    });
    return response.data;
  } catch (error) {
    console.error('Error posting feedback:', error);
    throw error;
  }
}

const supabaseHeaders = {
  'Content-Type': 'application/json',
  'apikey': API_KEY
};
