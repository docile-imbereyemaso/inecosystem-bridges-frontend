import { API_URL } from '../lib/API.js';

export const authAPI = {
  async register(registrationData) {
    try {
      const response = await fetch(`${API_URL}auth/signup/private-sector`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};
