const LAST_PLAYED_KEY = 'lastPlayed';
const PLAY_COUNTS_KEY = 'playCounts';

export const playHistoryService = {
  // Ajouter une chanson à l'historique
  addToHistory(song) {
    const history = this.getLastPlayed();
    const newHistory = [
      { ...song, playedAt: new Date().toISOString() },
      ...history
    ].slice(0, 20); // Garde uniquement les 20 dernières

    localStorage.setItem(LAST_PLAYED_KEY, JSON.stringify(newHistory));
    this.incrementPlayCount(song.id);
  },

  // Récupérer l'historique
  getLastPlayed() {
    const history = localStorage.getItem(LAST_PLAYED_KEY);
    return history ? JSON.parse(history) : [];
  },

  // Incrémenter le compteur d'écoutes
  incrementPlayCount(songId) {
    const counts = this.getPlayCounts();
    counts[songId] = (counts[songId] || 0) + 1;
    localStorage.setItem(PLAY_COUNTS_KEY, JSON.stringify(counts));
  },

  // Récupérer les compteurs d'écoutes
  getPlayCounts() {
    const counts = localStorage.getItem(PLAY_COUNTS_KEY);
    return counts ? JSON.parse(counts) : {};
  },

  // Obtenir les chansons les plus écoutées
  getMostPlayed() {
    const counts = this.getPlayCounts();
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20);
  }
}; 