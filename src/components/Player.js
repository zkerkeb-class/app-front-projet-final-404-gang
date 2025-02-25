import { playHistoryService } from '../services/playHistoryService';

const Player = ({ currentTrack }) => {
  const handlePlay = () => {
    // ... logique de lecture existante
    
    // Ajouter à l'historique quand une chanson commence
    if (currentTrack) {
      playHistoryService.addToHistory(currentTrack);
    }
  };

  // ... reste du code
}; 