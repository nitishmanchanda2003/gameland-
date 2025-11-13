import axios from 'axios';

// Base URL - abhi local rakhenge, baad me backend set hone par change karenge
const API = axios.create({
  baseURL: 'http://localhost:5000', // yahi se backend connect hoga
});

// Example function - test ke liye
export const getTestData = async () => {
  try {
    const response = await API.get('/test');
    return response.data;
  } catch (error) {
    console.error('Error fetching test data:', error);
  }
};
