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
    totalMarks: 0
  });

  const handleStart = () => {
    setState({ ...state, status: 'quiz', answers: {} });
  };

  const handleSubmit = (answers: Answers) => {
    setState({ ...state, status: 'results', answers });
  };

  const handleRestart = () => {
    setState({ ...state, status: 'landing', answers: {} });
  };

  return (
    <div className="app-container">
      {state.status === 'landing' && (
        <Landing 
          questions={questionsData as Question[]} 
          onStart={handleStart} 
        />
      )}
      
      {state.status === 'quiz' && (
        <Quiz 
          questions={questionsData as Question[]} 
          onSubmit={handleSubmit} 
        />
      )}
      
      {state.status === 'results' && (
        <Results 
          questions={questionsData as Question[]} 
          answers={state.answers}
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}

export default App;
