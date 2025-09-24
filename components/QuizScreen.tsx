

import React, { useState, useEffect, useCallback } from 'react';
import { getQuizQuestion } from '../services/geminiService';
import { QuizQuestion } from '../types';
import Header from './Header';
import ChatBubble from './ChatBubble';
import Options from './Options';
import Lifeline from './Lifeline';
import AdPlaceholder from './AdPlaceholder';
import LevelUpModal from './LevelUpModal';
import { useSound } from '../hooks/useSound';
import { useLanguage } from '../contexts/LanguageContext';

interface QuizScreenProps {
  onEnd: () => void;
}

// Helper to safely read from localStorage
// FIX: Changed from arrow function to function declaration to avoid JSX parsing ambiguity with generics.
function getStoredValue<T>(key: string, defaultValue: T): T {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
}

// Helper to safely write to localStorage
// FIX: Changed from arrow function to function declaration to avoid JSX parsing ambiguity with generics.
function setStoredValue<T>(key: string, value: T) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
    }
}


const QuizScreen: React.FC<QuizScreenProps> = ({ onEnd }) => {
  const [level, setLevel] = useState<number>(() => getStoredValue('quizLevel', 1));
  const [score, setScore] = useState<number>(() => getStoredValue('quizScore', 0));
  const [correctAnswersInLevel, setCorrectAnswersInLevel] = useState<number>(() => getStoredValue('quizCorrectAnswersInLevel', 0));
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [isLifelineUsed, setIsLifelineUsed] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(() => getStoredValue('quizSoundOn', true));
  
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(() => {
    const savedArray = getStoredValue<string[]>('quizAskedQuestions', []);
    return new Set(savedArray);
  });
  const [prefetchedQuestion, setPrefetchedQuestion] = useState<QuizQuestion | null>(null);

  const { t, locale } = useLanguage();
  const playSound = useSound(isSoundOn);

  // Persist state to localStorage
  useEffect(() => { setStoredValue('quizLevel', level); }, [level]);
  useEffect(() => { setStoredValue('quizScore', score); }, [score]);
  useEffect(() => { setStoredValue('quizCorrectAnswersInLevel', correctAnswersInLevel); }, [correctAnswersInLevel]);
  useEffect(() => { setStoredValue('quizSoundOn', isSoundOn); }, [isSoundOn]);
  useEffect(() => { setStoredValue('quizAskedQuestions', Array.from(askedQuestions)); }, [askedQuestions]);

  const fetchUniqueQuestion = useCallback(async () => {
    let retries = 3;
    while (retries > 0) {
      const recentAsked = Array.from(askedQuestions).slice(-20);
      const question = await getQuizQuestion(level, locale, recentAsked);
      if (!askedQuestions.has(question.question)) {
        setAskedQuestions(prev => new Set(prev).add(question.question));
        return question;
      }
      console.warn('Duplicate question received from API, retrying...');
      retries--;
    }
    console.error('Failed to get a unique question after retries. Fetching without constraints.');
    const question = await getQuizQuestion(level, locale, []); // Fallback
    setAskedQuestions(prev => new Set(prev).add(question.question));
    return question;
  }, [level, locale, askedQuestions]);

  useEffect(() => {
    const loadNewQuestionForLevel = async () => {
      setIsLoading(true);
      setPrefetchedQuestion(null);
      
      const question = await fetchUniqueQuestion();
      setCurrentQuestion(question);
      setIsLoading(false);

      fetchUniqueQuestion().then(setPrefetchedQuestion);
    };

    // Only fetch a new question if one isn't already loaded (e.g., on first load)
    if (!currentQuestion) {
        loadNewQuestionForLevel();
    } else {
        setIsLoading(false); // We have a persisted state, no need to load.
    }
  }, [level, locale]);

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
    setIsLifelineUsed(false);

    if (prefetchedQuestion) {
      setCurrentQuestion(prefetchedQuestion);
      setPrefetchedQuestion(null);
      fetchUniqueQuestion().then(setPrefetchedQuestion);
    } else {
      setIsLoading(true);
      fetchUniqueQuestion().then(q => {
        setCurrentQuestion(q);
        setIsLoading(false);
      });
    }
  }, [prefetchedQuestion, fetchUniqueQuestion]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    playSound('click');
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      playSound('correct');
      setScore(prev => prev + 10 * level);
      const newCorrectCount = correctAnswersInLevel + 1;
      setCorrectAnswersInLevel(newCorrectCount);
      if (newCorrectCount >= 10) {
        playSound('levelUp');
        setIsLevelUp(true);
      } else {
        setTimeout(() => nextQuestion(), 1500);
      }
    } else {
      playSound('wrong');
      setLevel(prev => Math.max(1, prev - 1));
      setCorrectAnswersInLevel(0);
      setTimeout(() => nextQuestion(), 2000);
    }
  };

  const handleNextLevel = () => {
    setLevel(prev => prev + 1);
    setCorrectAnswersInLevel(0);
    setIsLevelUp(false);
    nextQuestion(); // Fetch new question for the new level
  };
  
  const handleLifeline = () => {
    if(isLifelineUsed) return;
    playSound('click');
    setIsAdShowing(true);
  };

  const onAdComplete = () => {
    setIsAdShowing(false);
    setShowHint(true);
    setIsLifelineUsed(true);
  };

  return (
    <div className="w-full h-full bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col gap-6 relative overflow-hidden min-h-[500px]">
      <Header
        level={level}
        score={score}
        correctAnswersInLevel={correctAnswersInLevel}
        isSoundOn={isSoundOn}
        toggleSound={() => setIsSoundOn(prev => !prev)}
        onEnd={onEnd}
      />

      {isLevelUp && <LevelUpModal level={level + 1} onContinue={handleNextLevel} />}
      {isAdShowing && <AdPlaceholder onAdComplete={onAdComplete} />}
      
      <div className="flex-grow flex flex-col items-center justify-center">
        {isLoading && <div className="text-xl text-purple-300 animate-pulse">{t('new_question_loading')}</div>}
        
        {!isLoading && currentQuestion && (
          <div className="w-full animate-fade-in">
            <div className="relative">
              <ChatBubble question={currentQuestion.question} />
              <Lifeline onClick={handleLifeline} used={isLifelineUsed} />
            </div>
            <Options
              options={currentQuestion.options}
              onAnswer={handleAnswer}
              selectedAnswer={selectedAnswer}
              correctAnswer={currentQuestion.correctAnswer}
              showHint={showHint}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;