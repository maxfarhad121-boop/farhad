
import React from 'react';

interface OptionsProps {
  options: string[];
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  correctAnswer: string;
  showHint: boolean;
}

const Options: React.FC<OptionsProps> = ({
  options,
  onAnswer,
  selectedAnswer,
  correctAnswer,
  showHint,
}) => {
  const getButtonClass = (option: string) => {
    const baseClass = "w-full text-left p-4 rounded-lg text-lg font-semibold transition-all duration-300 transform focus:outline-none disabled:cursor-not-allowed";

    if (selectedAnswer) {
      if (option === correctAnswer) {
        return `${baseClass} bg-green-500 text-white animate-pulse scale-105 shadow-lg`;
      }
      if (option === selectedAnswer && option !== correctAnswer) {
        return `${baseClass} bg-red-500 text-white animate-shake`;
      }
      return `${baseClass} bg-gray-700 text-gray-400 disabled:opacity-50`;
    }

    if (showHint && option === correctAnswer) {
      return `${baseClass} bg-slate-700 hover:bg-slate-600 ring-4 ring-green-400 animate-pulse`;
    }

    return `${baseClass} bg-slate-700 hover:bg-slate-600 hover:scale-102`;
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswer(option)}
          disabled={!!selectedAnswer}
          className={getButtonClass(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

// Add keyframes for animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
`;
document.head.appendChild(style);


export default Options;
