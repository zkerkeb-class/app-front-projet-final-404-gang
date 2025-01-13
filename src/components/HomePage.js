import React from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/ThemeContext';
import { Bars3Icon , ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const sections = [
    {
      title: "Écoutés récemment",
      items: [
        { title: "Daily Mix 1", image: "https://via.placeholder.com/150?text=Mix+1", type: "Playlist" },
        { title: "Découvertes de la semaine", image: "https://via.placeholder.com/150?text=Découvertes", type: "Playlist" },
        { title: "Top Hits France", image: "https://via.placeholder.com/150?text=Top+Hits", type: "Playlist" },
        { title: "Chill Vibes", image: "https://via.placeholder.com/150?text=Chill", type: "Playlist" },
        { title: "Rock Classics", image: "https://via.placeholder.com/150?text=Rock", type: "Playlist" },
      ]
    },
    {
      title: "Fait pour vous",
      items: [
        { title: "Mix Pop", image: "https://via.placeholder.com/150?text=Pop", type: "Mix personnalisé" },
        { title: "Mix Rap FR", image: "https://via.placeholder.com/150?text=Rap", type: "Mix personnalisé" },
        { title: "Mix Détente", image: "https://via.placeholder.com/150?text=Détente", type: "Mix personnalisé" },
        { title: "Mix Workout", image: "https://via.placeholder.com/150?text=Workout", type: "Mix personnalisé" },
      ]
    },
    {
      title: "Artistes populaires",
      items: [
        { title: "Artiste 1", image: "https://via.placeholder.com/150?text=Artiste+1", type: "Artiste" },
        { title: "Artiste 2", image: "https://via.placeholder.com/150?text=Artiste+2", type: "Artiste" },
        { title: "Artiste 3", image: "https://via.placeholder.com/150?text=Artiste+3", type: "Artiste" },
        { title: "Artiste 4", image: "https://via.placeholder.com/150?text=Artiste+4", type: "Artiste" },
      ]
    }
  ];

  return (
    <div className={`lg:pl-64 min-h-screen ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-gray-900'}`}>
      <header className={`sticky top-0 p-4 flex items-center justify-between z-10 ${
        isDarkMode 
          ? 'bg-zinc-900 bg-opacity-95' 
          : 'bg-white bg-opacity-95 border-b border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <button 
            className={`lg:hidden rounded-full p-2 ${
              isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'
            } hover:bg-spotify-green hover:text-white transition-colors`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Bars3Icon className="h-6 w-6 text-white" />
          </button>
          <div className="flex gap-2">
            <button 
              className={`rounded-full p-2 ${
                isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'
              } hover:bg-spotify-green hover:text-white transition-colors`}
              aria-label="Précédent"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button 
              className={`rounded-full p-2 ${
                isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'
              } hover:bg-spotify-green hover:text-white transition-colors`}
              aria-label="Suivant"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDarkMode 
                ? 'hover:bg-zinc-800' 
                : 'hover:bg-gray-100'
            } transition-colors`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button 
            onClick={() => navigate('/register')}
            className={`text-sm font-semibold hover:text-spotify-green transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            S&apos;inscrire
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="bg-spotify-green text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Se connecter
          </button>
        </div>
      </header>

      <main className="px-4 sm:px-8 py-6">
        {sections.map((section, index) => (
          <section key={index} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">{section.title}</h2>
              <button className={`text-sm font-semibold ${
                isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-600 hover:text-spotify-green'
              } transition-colors`}>
                Tout afficher
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`rounded-lg p-3 sm:p-4 transition-colors group ${
                    isDarkMode 
                      ? 'bg-zinc-800 hover:bg-zinc-700' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="relative mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <button className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl hover:scale-105">
                      <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                    </button>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">{item.title}</h3>
                  <p className={`text-xs sm:text-sm ${
                    isDarkMode ? 'text-zinc-400' : 'text-gray-600'
                  }`}>{item.type}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default HomePage; 