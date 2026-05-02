import type { Question } from '../types';

interface LandingProps {
  onStart: () => void;
  questions: Question[];
}

export const Landing: React.FC<LandingProps> = ({ onStart, questions }) => {
  const totalMarks = questions.reduce((acc, q) => acc + q.marks, 0);

  return (
    <div className="landing-page">
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h1 className="landing-title">GATE DA Probability & Statistics</h1>
        <p className="landing-subtitle">
          Master Practice Set for the Data Science & AI Exam. Carefully curated tricky questions to test your conceptual clarity.
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{questions.length}</div>
            <div className="stat-label">Questions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalMarks}</div>
            <div className="stat-label">Total Marks</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">Mock</div>
            <div className="stat-label">Format</div>
          </div>
        </div>

        <button className="btn btn-accent" onClick={onStart} style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}>
          Start Quiz
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};
