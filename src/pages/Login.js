import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { loginUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Show success message if redirected from register
    if (location.state?.message) {
      setErrorMessage('');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
      };
      
      const response = await loginUser(userData);
      
      // Check both token and user data
      if (response.token && response.user) {
        login(response.user);
        navigate('/');
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <header className="px-8 py-6 border-b border-gray-300">
        <Link to="/" className="block w-32">
          <img 
            src={isDarkMode ? "/spotify-white.png" : "/spotify-black.png"}
            alt="Spotify"
            className="w-full"
          />
        </Link>
      </header>

      {/* Main content */}
      <main className="max-w-md mx-auto px-4 py-8">
        <div className={`p-8 rounded-lg ${
          isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'
        }`}>
          <h1 className={`text-3xl font-bold mb-8 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Se connecter à Spotify
          </h1>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  isDarkMode 
                    ? 'bg-zinc-800 border-zinc-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-spotify-green focus:border-transparent`}
                placeholder="nom@exemple.com"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  isDarkMode 
                    ? 'bg-zinc-800 border-zinc-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-spotify-green focus:border-transparent`}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-spotify-green focus:ring-spotify-green border-gray-300 rounded"
              />
              <label 
                htmlFor="rememberMe" 
                className={`ml-2 block text-sm ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                Se souvenir de moi
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-spotify-green text-black font-bold py-3 px-4 rounded-full 
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'} 
                transition-transform`}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/forgot-password"
              className={`text-sm ${
                isDarkMode ? 'text-white' : 'text-gray-700'
              } hover:text-spotify-green`}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <div className={`mt-8 pt-6 border-t ${
            isDarkMode ? 'border-zinc-800' : 'border-gray-200'
          } text-center`}>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Vous n&apos;avez pas de compte ?{' '}
              <Link 
                to="/register" 
                className="text-spotify-green hover:underline font-medium"
              >
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login; 