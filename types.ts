
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export type GameState = 'welcome' | 'playing';
