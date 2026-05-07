import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') + '/products';

class ProductService {
  async getAllProducts(category?: string, search?: string) {
    let url = API_URL;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('name', search);
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await axios.get(url);
    return response.data;
  }

  async getProductById(id: string) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  // Admin methods (require auth token)
  private getAuthHeader() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    }
    return {};
  }

  async createProduct(product: any) {
    return axios.post(API_URL, product, { headers: this.getAuthHeader() });
  }
}

export default new ProductService();
