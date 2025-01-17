import axios from 'axios';
import Cookies from 'js-cookie';
 
axios.defaults.withCredentials = true;

const authMernApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

authMernApi.interceptors.request.use(async (config) => {

  const token = Cookies.get('token');

  console.log('token', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { authMernApi };