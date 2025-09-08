const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Generic API call function with better error handling
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`http://localhost:3000/api/auth/signup/private-sector`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Check if response is OK (status in the range 200-299)
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      
      // Try to get error message from response body
      try {
        const errorData = await response.text();
        if (errorData) {
          try {
            const parsedError = JSON.parse(errorData);
            errorMessage = parsedError.message || errorMessage;
          } catch {
            errorMessage = errorData || errorMessage;
          }
        }
      } catch (e) {
        console.error('Error reading error response:', e);
      }
      
      throw new Error(errorMessage);
    }

    // Try to parse JSON response
    try {
      return await response.json();
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth-specific API calls
export const authAPI = {
  register: (userData: any) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};