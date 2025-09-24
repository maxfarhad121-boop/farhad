import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { t } = useLanguage();

  return (
    <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-purple-500/30">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
        {t('title')}
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        {t('description')}
      </p>
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onStart}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg"
        >
          {t('start_quiz')}
        </button>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default WelcomeScreen;
