import React from 'react';
import BulbIcon from './icons/BulbIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface LifelineProps {
  onClick: () => void;
  used: boolean;
}

const Lifeline: React.FC<LifelineProps> = ({ onClick, used }) => {
  const { t } = useLanguage();
  return (
    <button
      onClick={onClick}
      disabled={used}
      className={`absolute top-[-20px] right-4 p-3 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${
        used ? 'bg-gray-600' : 'bg-yellow-400'
      }`}
      aria-label={t('use_hint_aria')}
    >
      <BulbIcon used={used} />
    </button>
  );
};

export default Lifeline;
