import React from 'react';
import SoundOnIcon from './icons/SoundOnIcon';
import SoundOffIcon from './icons/SoundOffIcon';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  level: number;
  score: number;
  correctAnswersInLevel: number;
  isSoundOn: boolean;
  toggleSound: () => void;
  onEnd: () => void;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-gray-700 rounded-full h-2.5">
    <div
      className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const Header: React.FC<HeaderProps> = ({
  level,
  score,
  correctAnswersInLevel,
  isSoundOn,
  toggleSound,
  onEnd,
}) => {
  const { t } = useLanguage();
  const progress = (correctAnswersInLevel / 10) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-2 text-gray-300">
        <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-bold text-base sm:text-lg text-white bg-purple-600 px-3 py-1 rounded-lg shadow-md">{t('level')}: {level}</span>
            <span className="font-bold text-base sm:text-lg text-white bg-pink-600 px-3 py-1 rounded-lg shadow-md">{t('score')}: {score}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
             <LanguageSelector isMinimal={true} />
             <button onClick={toggleSound} className="text-gray-400 hover:text-white transition-colors p-1" aria-label={isSoundOn ? t('sound_off') : t('sound_on')}>
                {isSoundOn ? <SoundOnIcon /> : <SoundOffIcon />}
            </button>
            <button onClick={onEnd} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                {t('end_game')}
            </button>
        </div>
      </div>
      <ProgressBar progress={progress} />
      <div className="text-right text-xs text-gray-400 mt-1">
        {t('level_up_progress', { count: 10 - correctAnswersInLevel })}
      </div>
    </div>
  );
};

export default Header;
