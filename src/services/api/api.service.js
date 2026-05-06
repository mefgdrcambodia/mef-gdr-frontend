// src/services/api/api.service.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://gdr-uat.vercel.app/api/v1/website-fronted';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  async get(url, params = {}) {
    try {
      const response = await this.client.get(url, {
        params: {
          ...params,
          _t: Date.now(),
        },
      });

      // ✅ Always return full body so callers can access data[], pagination{}, category[]
      return {
        success: true,
        data: response.data,        // full body: { success, data[], pagination{}, category[] }
        status: response.status,
        message: response.data?.message || 'Success',
      };
    } catch (error) {
      console.error(`API Error [${url}]:`, error.message);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
      };
    }
  }

  async post(url, body = {}) {
    try {
      const response = await this.client.post(url, body);
      return {
        success: true,
        data: response.data,
        status: response.status,
        message: response.data?.message || 'Success',
      };
    } catch (error) {
      console.error(`API Error [${url}]:`, error.message);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
      };
    }
  }

  async put(url, body = {}) {
    try {
      const response = await this.client.put(url, body);
      return {
        success: true,
        data: response.data,
        status: response.status,
        message: response.data?.message || 'Success',
      };
    } catch (error) {
      console.error(`API Error [${url}]:`, error.message);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
      };
    }
  }

  async delete(url) {
    try {
      const response = await this.client.delete(url);
      return {
        success: true,
        data: response.data,
        status: response.status,
        message: response.data?.message || 'Success',
      };
    } catch (error) {
      console.error(`API Error [${url}]:`, error.message);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
      };
    }
  }
}

const apiService = new ApiService();
export default apiService;