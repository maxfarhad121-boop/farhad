import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LevelUpModalProps {
  level: number;
  onContinue: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onContinue }) => {
  const { t } = useLanguage();

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-800 p-10 rounded-2xl text-center shadow-2xl border border-purple-500 transform scale-100">
        <h2 className="text-4xl font-bold text-yellow-300 mb-2">{t('level_up_title')}</h2>
        <p className="text-2xl mb-6">{t('level_up_description', { level: level })}</p>
        <button
          onClick={onContinue}
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
        >
          {t('continue')}
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
