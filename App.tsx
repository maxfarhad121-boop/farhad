
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      // Resume only if the user was actively playing, otherwise show welcome screen.
      return localStorage.getItem('gameState') === 'playing' ? 'playing' : 'welcome';
    } catch (e) {
      console.error("Could not access localStorage:", e);
      return 'welcome';
    }
  });

  useEffect(() => {
    try {
      if (gameState === 'playing') {
        localStorage.setItem('gameState', 'playing');
      } else {
        // Clean up when not in a game session
        localStorage.removeItem('gameState');
      }
    } catch (e) {
      console.error("Could not access localStorage:", e);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
  };
  
  const backToHome = () => {
    // Clear all persisted quiz data for a fresh start
    try {
        const keysToRemove = [
            'quizLevel',
            'quizScore',
            'quizCorrectAnswersInLevel',
            'quizAskedQuestions',
            'quizSoundOn',
            'gameState'
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
        console.error("Could not clear localStorage:", e);
    }
    setGameState('welcome');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {gameState === 'welcome' && <WelcomeScreen onStart={startGame} />}
        {gameState === 'playing' && <QuizScreen onEnd={backToHome} />}
      </div>
    </div>
  );
};

export default App;
