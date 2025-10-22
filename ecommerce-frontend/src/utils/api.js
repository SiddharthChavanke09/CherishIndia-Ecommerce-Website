import axios from 'axios';

// This is correct. It gets the URL from the environment.
const API_URL = process.env.REACT_APP_API_URL;
axios.post(`${API_URL}/api/auth/register`, userData); // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const orderAPI = {
  create: (order) => api.post('/orders', order),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  getById: (id) => api.get(`/orders/${id}`),
};

export default api;