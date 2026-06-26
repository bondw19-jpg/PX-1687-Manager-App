/**
 * interviewContent.js
 * Single source of truth for the PX-1687 candidate interview guide.
 * Mirrors the official Panda Express interview form so every interview
 * uses the same steps, questions, competencies, and scoring rule.
 */

// ── 6-step interview process ──────────────────────────────────────────────────
export const INTERVIEW_STEPS = [
  {
    title: 'Prepare for the Interview',
    points: ["Review and print candidate's resume"],
  },
  {
    title: 'Welcome the Candidate with a Smile',
    points: [
      'Self-Introduction & Share Panda Journey & Fact',
      'Icebreaker: "Tell me about yourself." or "What brings you to Panda?"',
    ],
  },
  {
    title: 'Conduct the Interview',
    points: [
      "Discuss the candidate's work history and ask follow-up questions",
      'Document your fact-based observations',
    ],
  },
  {
    title: 'Conclude the Interview',
    points: [
      'Share your Panda story and allow candidates to ask questions',
      'Inform candidates of next steps: "If selected for next steps you will hear from us in 5 business days"',
    ],
  },
  {
    title: 'Thank the Candidate',
    points: [],
  },
  {
    title: 'Document Your Overall Decision',
    points: ['After the interview, record the rating & notes assessment'],
  },
];

// ── Impermissible-questions warning ───────────────────────────────────────────
export const IMPERMISSIBLE_WARNING =
  'Do not ask impermissible questions relating to criminal history, sexual orientation, ethnic background, race, religion, disability, etc.';

// ── 7 competencies, each with 2 recommended questions ─────────────────────────
export const COMPETENCIES = [
  {
    key: 'customer_focus',
    label: 'Customer Focus',
    questions: [
      'Tell me about a time when you made a guest feel special and important.',
      'Tell me about a time you went above and beyond for a guest.',
    ],
  },
  {
    key: 'decision_quality',
    label: 'Decision Quality',
    questions: [
      'Tell me about a time you had to resolve a problem quickly. What did you do?',
      'Describe a moment when you felt unsure what to do. How did you decide on your next steps?',
    ],
  },
  {
    key: 'ensures_accountability',
    label: 'Ensures Accountability',
    questions: [
      'Tell me about a time you made a mistake. What did you learn?',
      'Describe a time when you were responsible for completing a task. How did you ensure that it was done correctly?',
    ],
  },
  {
    key: 'values_differences',
    label: 'Values Differences',
    questions: [
      'Describe a time when you had to collaborate with someone who had a different approach from you. What was the outcome?',
      'Tell me about a time when you had a disagreement with someone. What did you do?',
    ],
  },
  {
    key: 'integrity_trust',
    label: 'Integrity and Trust',
    questions: [
      'Tell me about a time you followed through on a commitment. What did you learn from it?',
      'Tell me about a time you had to be honest, even when it was difficult.',
    ],
  },
  {
    key: 'action_oriented',
    label: 'Action Oriented',
    questions: [
      'Tell me about a time when you were in a challenging situation. How did you work through it?',
      'Can you describe a time when you helped improve a process? What was the result?',
    ],
  },
  {
    key: 'communicates_effectively',
    label: 'Communicates Effectively',
    questions: [
      'Tell me about a time when there was a misunderstanding. How did you handle it?',
      'Tell me about a time when you received constructive feedback. How did you respond and improve?',
    ],
  },
];

// ── "Also consider" soft factors ──────────────────────────────────────────────
export const ALSO_CONSIDER = [
  'communication skills',
  'listening skills',
  'leadership presentation',
  'body language',
];

// ── 1–5 rating scale ──────────────────────────────────────────────────────────
export const RATING_SCALE = [
  { value: 1, label: 'Limited' },
  { value: 2, label: 'Fair' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Very Good' },
  { value: 5, label: 'Exceptional' },
];

export function ratingLabel(value) {
  return RATING_SCALE.find(r => r.value === value)?.label || '—';
}

// ── Weekly availability days ──────────────────────────────────────────────────
export const AVAILABILITY_DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

// ── Candidate pipeline statuses ───────────────────────────────────────────────
export const CANDIDATE_STATUSES = [
  { key: 'new', label: 'New', color: 'gray' },
  { key: 'interviewing', label: 'Interviewing', color: 'blue' },
  { key: 'move_forward', label: 'Move Forward', color: 'yellow' },
  { key: 'hired', label: 'Hired', color: 'green' },
  { key: 'not_recommended', label: 'Not Recommended', color: 'red' },
];

export function candidateStatusMeta(key) {
  return CANDIDATE_STATUSES.find(s => s.key === key) || CANDIDATE_STATUSES[0];
}

// ── Scoring helpers ───────────────────────────────────────────────────────────
// Each of the 7 competencies gets one 1–5 rating. The decision rule from the
// form: average ≥ 3 → "Move Forward"; < 3 → "Does Not Recommend".
export function scoreInterview(ratings = {}) {
  const values = COMPETENCIES
    .map(c => Number(ratings[c.key]))
    .filter(v => Number.isFinite(v) && v > 0);
  const count = values.length;
  const total = values.reduce((s, v) => s + v, 0);
  const average = count > 0 ? total / count : 0;
  const recommend = count > 0 && average >= 3;
  return {
    count,
    total,
    average,
    averageText: average ? average.toFixed(1) : '0.0',
    recommend,
    recommendation: count === 0 ? 'Not Scored' : recommend ? 'Move Forward' : 'Does Not Recommend',
  };
}
