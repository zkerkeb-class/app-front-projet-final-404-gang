const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const formatUserData = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to register user');
    const data = await response.json();
    return formatUserData(data.user);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to login user');
    const data = await response.json();
    return formatUserData(data);
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};