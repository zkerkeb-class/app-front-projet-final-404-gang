import React from 'react';
import RecentlyPlayed from '../components/RecentlyPlayed';
import MostPlayed from '../components/MostPlayed';

const Home = () => {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-spotify-darkgray to-spotify-black">
      {/* En-tête avec dégradé */}
      <div className="bg-gradient-to-b from-spotify-gray/30 to-transparent p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Bonjour
        </h1>
      </div>

      {/* Contenu principal */}
      <div className="px-6 pb-6">
        {/* Section Dernières écoutes */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              Dernières écoutes
            </h2>
            <button className="text-sm font-bold text-spotify-lightgray hover:text-white transition-colors">
              Tout afficher
            </button>
          </div>
          <RecentlyPlayed />
        </section>

        {/* Section Les plus écoutées */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              Les plus écoutées
            </h2>
            <button className="text-sm font-bold text-spotify-lightgray hover:text-white transition-colors">
              Tout afficher
            </button>
          </div>
          <MostPlayed />
        </section>
      </div>
    </div>
  );
};

export default Home; 