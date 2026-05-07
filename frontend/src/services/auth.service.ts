import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') + '/auth/';

class AuthService {
  async login(email: string, password: string) {
    const response = await axios.post(API_URL + 'signin', { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  async register(signupData: any) {
    return axios.post(API_URL + 'signup', signupData);
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
}

export default new AuthService();
