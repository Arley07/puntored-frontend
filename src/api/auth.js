import axios from 'axios';
import API_BASE from '../config/api';

export async function loginRequest(username, password) {
  const res = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
  return res.data;
}
