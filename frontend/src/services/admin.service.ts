import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class AdminService {
  private getAuthHeader() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    }
    return {};
  }

  async getStats() {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getAllOrders() {
    const response = await axios.get(`${API_URL}/orders/all`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const response = await axios.put(`${API_URL}/orders/${orderId}/status`, { status }, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async updateProduct(productId: string, productData: any) {
    const response = await axios.put(`${API_URL}/products/${productId}`, productData, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async deleteProduct(productId: string) {
    const response = await axios.delete(`${API_URL}/products/${productId}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async searchImages(query: string) {
    const response = await axios.get(`${API_URL}/admin/images/search?query=${query}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }
}

export default new AdminService();
