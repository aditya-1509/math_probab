import { useState } from 'react';
import type { Question, Answers } from '../types';

interface ResultsProps {
  questions: Question[];
  answers: Answers;
  onRestart: () => void;
}

export const Results: React.FC<ResultsProps> = ({ questions, answers, onRestart }) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'unanswered'>('all');

  const checkAnswer = (q: Question, userAnswer: string | string[] | undefined) => {
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
      // Basic exact match for NAT, could be improved with numerical tolerance
      return correctAns.includes(uA) || uA === correctAns ? 'correct' : 'incorrect';
    }

    return 'incorrect';
  };

  let score = 0;
  let totalMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const reviewItems = questions.map(q => {
    const status = checkAnswer(q, answers[q.id]);
    totalMarks += q.marks;
    
    if (status === 'correct') {
      score += q.marks;
      correctCount++;
    } else if (status === 'incorrect') {
      incorrectCount++;
    } else {
      unansweredCount++;
    }

    return { question: q, status, userAnswer: answers[q.id] };
  });

  const percentage = Math.round((score / totalMarks) * 100) || 0;
  const scoreDeg = (percentage / 100) * 360;

  const totalAttempted = correctCount + incorrectCount;
  const accuracyRate = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
  const completionRate = Math.round((totalAttempted / questions.length) * 100);

  const filteredItems = reviewItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="results-page">
      <div className="glass-panel results-header">
        <h2 className="landing-title" style={{ fontSize: '2.5rem' }}>Quiz Analysis & Results</h2>
        
        <div className="score-circle" style={{ '--score-deg': `${scoreDeg}deg` } as React.CSSProperties}>
          <div className="score-text">{percentage}%</div>
        </div>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          You scored <strong style={{ color: 'var(--text-main)' }}>{score}</strong> out of {totalMarks} marks
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)' }}>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Completion</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{totalAttempted} / {questions.length} Attempted</div>
            <div className="progress-bar-container" style={{ marginBottom: 0, height: '4px', background: 'rgba(255,255,255,0.05)' }}>
              <div className="progress-bar-fill" style={{ width: `${completionRate}%`, background: 'var(--primary)' }}></div>
            </div>
          </div>
          <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)' }}>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Accuracy</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{accuracyRate}% Accuracy Rate</div>
            <div className="progress-bar-container" style={{ marginBottom: 0, height: '4px', background: 'rgba(255,255,255,0.05)' }}>
              <div className="progress-bar-fill" style={{ width: `${accuracyRate}%`, background: 'var(--success)' }}></div>
            </div>
          </div>
        </div>

        <div className="stats-grid" style={{ margin: '0 auto' }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{correctCount}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--error)' }}>{incorrectCount}</div>
            <div className="stat-label">Incorrect</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{unansweredCount}</div>
            <div className="stat-label">Unanswered</div>
          </div>
        </div>

        <button className="btn btn-accent" onClick={onRestart} style={{ marginTop: '2rem' }}>
          Take Quiz Again
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem' }}>Detailed Review</h3>
          <div className="section-filter">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`filter-btn ${filter === 'incorrect' ? 'active' : ''}`} onClick={() => setFilter('incorrect')}>Incorrect</button>
            <button className={`filter-btn ${filter === 'unanswered' ? 'active' : ''}`} onClick={() => setFilter('unanswered')}>Unanswered</button>
          </div>
        </div>

        <div className="review-list">
          {filteredItems.map(({ question, status, userAnswer }) => (
            <div key={question.id} className={`review-card ${status}`}>
              <div className="review-q-header">
                <div className="review-q-id">Question {question.id} ({question.type})</div>
                <div className={`review-status status-${status}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({question.marks} Marks)
                </div>
              </div>
              
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{question.text}</div>

              <div className="review-answers">
                <div className="review-answer-row">
                  <span className="review-answer-label">Your Answer:</span>
                  <span style={{ fontWeight: 600 }}>
                    {Array.isArray(userAnswer) ? userAnswer.join(', ') : (userAnswer || 'Not answered')}
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
                <div className="review-explanation">
                  <strong style={{ color: 'var(--text-main)' }}>Explanation:</strong>
                  <br />
                  {question.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
