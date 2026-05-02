export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number | string;
  type: 'MCQ' | 'MSQ' | 'NAT';
  marks: number;
  text: string;
  options: Option[];
  answer: string;
  explanation: string;
}

export type Answers = Record<string | number, string | string[]>;

export interface QuizState {
  status: 'landing' | 'quiz' | 'results';
  answers: Answers;
  score: number;
  totalMarks: number;
}
