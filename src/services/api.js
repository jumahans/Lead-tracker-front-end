import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints for business leads and call status
export const businessAPI = {
  // JWT Login - POST to /api/token/ with username and password
  login: async (credentials) => {
    try {
      const response = await api.post('/api/token/', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get business details/leads - POST request with location and business query
  getBusinessDetails: async (params) => {
    try {
      console.log('Sending search request with params:', params);
      const response = await api.post('/get-business-details/', {
        location: params.location,
        business: params.businessType
      });
      console.log('Search response:', response.data);
      return response.data.message;
    } catch (error) {
      console.error('Error fetching business details:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  // Update call status for a specific lead - POST request
  updateCallStatus: async (leadId, statusData) => {
    try {
      const response = await api.post(`/update-call-status/${leadId}/`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating call status:', error);
      throw error;
    }
  },

  // Get all leads - GET request
  getAllLeads: async () => {
    try {
      const response = await api.get('/list-leads/');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },
  deleteleads: async (leadId) => {
    try {
      const response = await api.delete(`/delete-lead/${leadId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
    getAllLeads();
  },

  // Create user - POST request to /create-user/
  createUser: async (userData) => {
    try {
      const response = await api.post('/create-user/', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Create freelancer - POST request to /freelancer-details/
  createFreelancer: async (freelancerData) => {
    try {
      const response = await api.post('/freelancer-details/', freelancerData);
      return response.data;
    } catch (error) {
      console.error('Error creating freelancer:', error);
      throw error;
    }
  },

  // getCallStatus : async () =>{
  //   try{
  //     const response = await api.get('/call-status/');
  //     return response.data;
  //   } catch(error){
  //     console.error('error fetching call status:', error);
  //     throw error;
  //   }
  // },

  getProfileData: async() =>{
    try{
        const response = await api.get('/profile-details/')
        return response.data

    }catch (error){
      console.error("error fetching profile data: ", error);
      throw error;
    }
  },

  updateprofile: async(credentials) =>{
    try{
        const response = await api.post('/update-profile-details/', credentials)
        return response.data;
    }catch (error){
      console.error('profile details could not be found', error);
      throw error;
    }
  },
  // Fetch call status (GET)
  getCallStatus: async (leadId) => {
    try {
      const response = await api.get(`/call-status/${leadId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching call status:', error);
      throw error;
    }
  },

  // Update call status (POST)
  updateCallStatus: async (leadId, called) => {
    try {
      const response = await api.post(`/call-status/${leadId}/`, { called });
      return response.data;
    } catch (error) {
      console.error('Error updating call status:', error);
      throw error;
    }
  },


};

export default api;
