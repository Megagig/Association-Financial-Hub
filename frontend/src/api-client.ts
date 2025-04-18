import { RegisterFormData } from './pages/public/Register';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//Create the register API call: This function will send a POST request to the server to create a new user.
export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};
