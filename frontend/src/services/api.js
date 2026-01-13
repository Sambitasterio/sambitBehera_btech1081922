import axios from 'axios';
import { supabase } from '../config/supabaseClient';

// Create axios instance with base URL
// Use environment variable or default to production URL
const baseURL = import.meta.env.VITE_API_URL || 'https://sambitbehera-btech1081922.onrender.com/api';

// Log the API URL being used (helpful for debugging)
console.log('🔗 API Base URL:', baseURL);
console.log('🌍 Environment:', import.meta.env.MODE);

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for production
});

// Export baseURL for use in error messages
export const getApiBaseURL = () => baseURL;

// Request interceptor to attach Supabase Access Token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        // Attach the access token to the Authorization header
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('Error getting session:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log detailed error for debugging
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', {
        message: 'No response from server. Is the backend running?',
        url: error.config?.url,
        baseURL: baseURL,
        fullURL: baseURL + (error.config?.url || '')
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    // Handle 401 errors (unauthorized) - could redirect to login
    if (error.response?.status === 401) {
      // Optionally clear session and redirect
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
