// quiz-core.js — DOM-free grading + record helpers for the quiz widget.
// Kept pure so it is unit-testable under `node --test` (no jsdom needed),
// the same split as anchor.js ↔ highlighter.js.

// A data-answer attribute → a valid 0-based choice index, or null when
// missing, non-numeric, or out of range for the choice count.
export function parseAnswerIndex(raw, choiceCount) {
  if (raw === null || raw === undefined || String(raw).trim() === '') return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n >= choiceCount) return null;
  return n;
}

// Is a question well-formed enough to enhance? Malformed questions are skipped,
// never thrown on, so one bad question can't break the rest of the quiz.
export function validateQuestion(spec) {
  if (spec.type === 'mcq') {
    const idx = parseAnswerIndex(spec.rawAnswer, spec.choiceCount);
    return { ok: idx !== null, answerIndex: idx };
  }
  if (spec.type === 'recall') {
    return { ok: spec.hasAnswer === true, answerIndex: null };
  }
  return { ok: false, answerIndex: null };
}

export function isMcqCorrect(answerIndex, chosenIndex) {
  return chosenIndex === answerIndex;
}

// The POST body for one attempt. chosen defaults to null (recall self-rating
// carries no chosen text); correct is coerced to a strict boolean.
export function buildAttempt({ lesson, question, type, prompt, chosen = null, correct }) {
  return { lesson, question, type, prompt, chosen, correct: !!correct };
}
