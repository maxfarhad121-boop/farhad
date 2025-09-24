import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { languages, Locale } from '../translations';
import GlobeIcon from './icons/GlobeIcon';

// Inject animation styles once
const animationStyleId = 'language-selector-animation-style';
if (!document.getElementById(animationStyleId)) {
  const style = document.createElement('style');
  style.id = animationStyleId;
  style.innerHTML = `
    @keyframes slide-in-out {
      0%, 100% {
        opacity: 0;
        max-width: 0px;
        margin-left: 0;
      }
      20%, 80% {
        opacity: 1;
        max-width: 100px; /* Generous max-width for all languages */
        margin-left: 0.5rem; /* Corresponds to ml-2 */
      }
    }

    .animate-language-text {
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      animation: slide-in-out 5s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

interface LanguageSelectorProps {
  className?: string;
  isMinimal?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className, isMinimal = false }) => {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const buttonPadding = isMinimal ? 'p-1' : 'p-3';
  const menuPosition = isMinimal 
    ? 'origin-top-right right-0 top-full mt-2' 
    : 'origin-bottom bottom-full mb-2 left-1/2 -translate-x-1/2';

  // Add transition classes for the menu
  const menuTransitionClasses = isOpen 
    ? 'opacity-100 scale-100' 
    : 'opacity-0 scale-95 pointer-events-none';

  return (
    <div className={`relative inline-block ${className}`} ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center rounded-full ${buttonPadding} text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-400`}
        aria-label="Change language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <GlobeIcon />
        <span className="animate-language-text">
          {t('language')}
        </span>
      </button>

      <div 
        className={`absolute ${menuPosition} w-48 bg-slate-800 border border-purple-500/30 rounded-lg shadow-2xl z-20 transition-all duration-200 ease-out transform ${menuTransitionClasses}`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="language-menu-button"
      >
        <ul className="py-1" role="none">
          {Object.entries(languages).map(([code, name]) => (
            <li key={code} role="none">
              <button
                onClick={() => handleLanguageChange(code as Locale)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                  locale === code 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-purple-500/30'
                }`}
                role="menuitem"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;