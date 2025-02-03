import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { registerUser } from '../services/authService';

const Register = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    username: '',
    birthDate: '',
    acceptTerms: false
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email !== formData.confirmEmail) {
      setError('Emails do not match');
      return;
    }
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        birthDate: formData.birthDate,
      };
      const response = await registerUser(userData);
      console.log('Registration successful:', response);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed');
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
      <header className="px-8 py-6 border-b border-gray-300">
        <Link to="/" className="block w-32">
          <img 
            src={isDarkMode ? "/spotify-white.png" : "/spotify-black.png"}
            alt="Spotify"
            className="w-full"
          />
        </Link>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className={`p-8 rounded-lg ${
          isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'
        }`}>
          <h1 className={`text-3xl font-bold mb-8 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Créer un compte
          </h1>

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
                htmlFor="confirmEmail" 
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                Confirmer l&apos;e-mail
              </label>
              <input
                type="email"
                id="confirmEmail"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  isDarkMode 
                    ? 'bg-zinc-800 border-zinc-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-spotify-green focus:border-transparent`}
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

            <div>
              <label 
                htmlFor="username" 
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                Nom d&apos;utilisateur
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  isDarkMode 
                    ? 'bg-zinc-800 border-zinc-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-spotify-green focus:border-transparent`}
                required
              />
            </div>

            <div>
              <label 
                htmlFor="birthDate" 
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                Date de naissance
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
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
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="h-4 w-4 text-spotify-green focus:ring-spotify-green border-gray-300 rounded"
                required
              />
              <label 
                htmlFor="acceptTerms" 
                className={`ml-2 block text-sm ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                J&apos;accepte les{' '}
                <Link 
                  to="/terms" 
                  className="text-spotify-green hover:underline"
                >
                  conditions d&apos;utilisation
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-spotify-green text-black font-bold py-3 px-4 rounded-full hover:scale-105 transition-transform"
            >
              S&apos;inscrire
            </button>
          </form>

          <div className={`mt-8 pt-6 border-t ${
            isDarkMode ? 'border-zinc-800' : 'border-gray-200'
          } text-center`}>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Vous avez déjà un compte ?{' '}
              <Link 
                to="/login" 
                className="text-spotify-green hover:underline font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register; 