import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdPlaceholderProps {
  onAdComplete: () => void;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ onAdComplete }) => {
  const [countdown, setCountdown] = useState(5);
  const { t } = useLanguage();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onAdComplete();
    }
  }, [countdown, onAdComplete]);

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg text-center shadow-2xl">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">{t('ad_title')}</h3>
        <p className="text-lg mb-2">{t('ad_description')}</p>
        <p className="text-4xl font-bold animate-pulse">{countdown}</p>
      </div>
    </div>
  );
};

export default AdPlaceholder;
