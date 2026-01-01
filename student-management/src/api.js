import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

if (!BASE_URL) {
  throw new Error('Environment variable REACT_APP_API_URL is not set. Create a .env file with REACT_APP_API_URL=http://localhost:5000');
}

const api = axios.create({ baseURL: BASE_URL });

export default api;
