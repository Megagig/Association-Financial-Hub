// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// General request function with authentication
async function authenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Prepare the request with credentials for cookies
  const requestOptions: RequestInit = {
    ...options,
    credentials: 'include', // This ensures cookies are sent with requests
    headers,
  };

  // Make the request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

  // Check if response is ok
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

// User and admin management API functions
export const userApi = {
  // Get all admins
  getUsers: () => authenticatedRequest('/api/users'),

  // Update user role
  updateUserRole: (userId: string, role: string) =>
    authenticatedRequest('/api/users/:id/role', {
      method: 'PUT',
      body: JSON.stringify({ userId, role }),
    }),

  // Here, i will add more user-related API functions as needed
};

// Export all API services
export default {
  user: userApi,
  // other API categories
};
