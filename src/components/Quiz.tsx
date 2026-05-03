import { useState } from 'react';
import type { Question, Answers } from '../types';

interface QuizProps {
  questions: Question[];
  onSubmit: (answers: Answers) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Set<number | string>>(new Set());
  
  const question = questions[currentIndex];
  const currentAnswer = answers[question.id] || (question.type === 'MSQ' ? [] : '');

  const checkAnswerStatus = (q: Question, userAnswer: string | string[] | undefined) => {
    if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) return 'unanswered';
    
    const correctAns = q.answer.trim().toLowerCase();
    
    if (q.type === 'MCQ') {
      const uA = (userAnswer as string).toLowerCase();
      return correctAns.startsWith(uA) || correctAns === uA ? 'correct' : 'incorrect';
    } 
    
    if (q.type === 'MSQ') {
      const uA = (userAnswer as string[]).map(a => a.toLowerCase()).sort().join(', ');
      const cA = correctAns.split(',').map(a => a.trim()).sort().join(', ');
      return uA === cA ? 'correct' : 'incorrect';
    }

    if (q.type === 'NAT') {
      const uA = (userAnswer as string).trim().toLowerCase();
      return correctAns.includes(uA) || uA === correctAns ? 'correct' : 'incorrect';
    }

    return 'incorrect';
  };

  const handleCheckAnswer = () => {
    const newChecked = new Set(checkedQuestions);
    newChecked.add(question.id);
    setCheckedQuestions(newChecked);
  };

  const handleOptionClick = (optionId: string) => {
    if (question.type === 'MCQ') {
      setAnswers({ ...answers, [question.id]: optionId });
    } else if (question.type === 'MSQ') {
      const current = (currentAnswer as string[]) || [];
      const newAnswers = current.includes(optionId) 
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      setAnswers({ ...answers, [question.id]: newAnswers });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [question.id]: e.target.value });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit your quiz?')) {
      onSubmit(answers);
    }
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="glass-panel" style={{ width: '100%', animation: 'fadeIn 0.3s ease' }}>
      <div className="quiz-header">
        <div className="quiz-progress-text">Question {currentIndex + 1} of {questions.length}</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="quiz-marks" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
            {question.type}
          </div>
          <div className="quiz-marks">{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}</div>
          <button className="btn btn-outline" style={{ padding: '0.25rem 1rem', fontSize: '0.9rem', borderColor: 'var(--error)', color: 'var(--error)' }} onClick={handleSubmit}>
            Submit Early
          </button>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className="question-text">
        <strong>Q{question.id}: </strong>
        {question.text}
      </div>

      {(question.type === 'MCQ' || question.type === 'MSQ') && (
        <div className="options-grid">
          {question.options.map((option) => {
            const isSelected = question.type === 'MSQ' 
              ? (currentAnswer as string[]).includes(option.id)
              : currentAnswer === option.id;

            return (
              <button 
                key={option.id}
                className={`option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option.id)}
              >
                <span className="option-id">{option.id}</span>
                <span className="option-text">{option.text}</span>
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'NAT' && (
        <div className="nat-input-container">
          <input 
            type="text" 
            className="nat-input" 
            placeholder="Type your numerical answer here..."
            value={currentAnswer as string}
            onChange={handleInputChange}
          />
        </div>
      )}

      {checkedQuestions.has(question.id) && (
        <div className={`review-card ${checkAnswerStatus(question, currentAnswer)}`} style={{ marginTop: '2rem', marginBottom: '1rem', padding: '1.5rem', borderRadius: '12px' }}>
          <div className="review-q-header" style={{ marginBottom: '1rem' }}>
            <div className="review-q-id">Result</div>
            <div className={`review-status status-${checkAnswerStatus(question, currentAnswer)}`}>
              {checkAnswerStatus(question, currentAnswer).charAt(0).toUpperCase() + checkAnswerStatus(question, currentAnswer).slice(1)}
            </div>
          </div>
          <div className="review-answers">
            <div className="review-answer-row">
              <span className="review-answer-label">Your Answer:</span>
              <span style={{ fontWeight: 600 }}>
                {Array.isArray(currentAnswer) ? currentAnswer.join(', ') : (currentAnswer || 'Not answered')}
              </span>
            </div>
            <div className="review-answer-row">
              <span className="review-answer-label">Correct Answer:</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                {question.answer || 'Not provided in key'}
              </span>
            </div>
          </div>
          {question.explanation && (
            <div className="review-explanation" style={{ marginTop: '1rem' }}>
              <strong style={{ color: 'var(--text-main)' }}>Explanation:</strong>
              <br />
              {question.explanation}
            </div>
          )}
        </div>
      )}

      <div className="quiz-footer">
        <button 
          className="btn btn-outline" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        <button 
          className="btn btn-outline"
          onClick={handleCheckAnswer}
          disabled={checkedQuestions.has(question.id) || !currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
          style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
        >
          Check Answer
        </button>
        
        {currentIndex === questions.length - 1 ? (
          <button className="btn btn-accent" onClick={handleSubmit}>
            Submit Quiz
          </button>
        ) : (
          <button className="btn btn-accent" onClick={handleNext}>
            Next Question
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
