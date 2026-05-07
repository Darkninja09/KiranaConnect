import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') + '/orders';

class OrderService {
  private getAuthHeader() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    }
    return {};
  }

  async createOrder(orderData: any) {
    const response = await axios.post(`${API_URL}/create`, orderData, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async verifyPayment(paymentResponse: any) {
    const response = await axios.post(`${API_URL}/verify`, paymentResponse, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getUserOrders(vendorId: string) {
    const response = await axios.get(`${API_URL}/user/${vendorId}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }
}

export default new OrderService();
