import { useState } from 'react';
import { Landing } from './components/Landing';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import type { Question, Answers, QuizState } from './types';
import questionsData from './assets/questions.json';

function App() {
  const [state, setState] = useState<QuizState>({
    status: 'landing',
    answers: {},
    score: 0,
    totalMarks: 0,
    currentBlockIndex: 0
  });

  const QUESTIONS_PER_BLOCK = 20;
  const allQuestions = questionsData as Question[];
  const currentQuestions = allQuestions.slice(
    state.currentBlockIndex * QUESTIONS_PER_BLOCK,
    (state.currentBlockIndex + 1) * QUESTIONS_PER_BLOCK
  );
  
  const isLastBlock = (state.currentBlockIndex + 1) * QUESTIONS_PER_BLOCK >= allQuestions.length;

  const handleStart = () => {
    setState({ ...state, status: 'quiz', answers: {}, currentBlockIndex: 0 });
  };

  const handleSubmit = (answers: Answers) => {
    setState({ ...state, status: 'results', answers: { ...state.answers, ...answers } });
  };

  const handleRestart = () => {
    setState({ ...state, status: 'landing', answers: {}, currentBlockIndex: 0 });
  };

  const handleNextBlock = () => {
    setState({ ...state, status: 'quiz', currentBlockIndex: state.currentBlockIndex + 1 });
  };

  return (
    <div className="app-container">
      {state.status === 'landing' && (
        <Landing 
          questions={allQuestions} 
          onStart={handleStart} 
        />
      )}
      
      {state.status === 'quiz' && (
        <Quiz 
          questions={currentQuestions} 
          onSubmit={handleSubmit} 
        />
      )}
      
      {state.status === 'results' && (
        <Results 
          questions={currentQuestions} 
          answers={state.answers}
          onRestart={handleRestart}
          onNextBlock={handleNextBlock}
          isLastBlock={isLastBlock}
        />
      )}
    </div>
  );
}

export default App;
