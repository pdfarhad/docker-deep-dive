import { validateQuestion, isMcqCorrect } from './quiz-core.js';

// Student edition: quizzes grade themselves in the browser for self-checking.
// Attempts are not persisted anywhere (the classroom edition records them).

function enhanceMcq(qEl, prompt, answerIndex) {
  const ui = document.createElement('div'); ui.className = 'quiz-ui';
  qEl.appendChild(ui);
  const choices = [...qEl.querySelectorAll('.choices > li')];
  choices.forEach((li, i) => {
    li.classList.add('quiz-choice');
    li.addEventListener('click', () => {
      if (qEl.dataset.locked) return;
      qEl.dataset.locked = '1';
      const correct = isMcqCorrect(answerIndex, i);
      choices[answerIndex].classList.add('quiz-correct');
      if (!correct) li.classList.add('quiz-incorrect');
    });
  });
}

function enhanceRecall(qEl) {
  const answer = qEl.querySelector('.answer');
  const ui = document.createElement('div'); ui.className = 'quiz-ui';
  qEl.appendChild(ui);
  const show = document.createElement('button');
  show.textContent = 'Show answer';
  ui.appendChild(show);
  show.addEventListener('click', () => {
    answer.classList.add('quiz-shown');     // reveal by toggling CSS, never moving the node
    show.remove();
    for (const [label] of [['✓ Got it'], ['✗ Missed']]) {
      const b = document.createElement('button');
      b.className = 'quiz-rate'; b.textContent = label;
      b.addEventListener('click', () => {
        if (qEl.dataset.locked) return;
        qEl.dataset.locked = '1';
        ui.querySelectorAll('.quiz-rate').forEach((x) => { x.disabled = true; });
      });
      ui.appendChild(b);
    }
  });
}

function enhance(qEl) {
  const type = qEl.dataset.type;
  const promptEl = qEl.querySelector('.prompt');
  const prompt = promptEl ? promptEl.textContent.trim() : '';
  const choiceCount = qEl.querySelectorAll('.choices > li').length;
  const hasAnswer = !!qEl.querySelector('.answer');
  const { ok, answerIndex } = validateQuestion({
    type, rawAnswer: qEl.dataset.answer, choiceCount, hasAnswer });
  if (!ok) { console.warn('quiz: skipping malformed question', qEl.dataset.id); return; }
  if (type === 'mcq') enhanceMcq(qEl, prompt, answerIndex);
  else enhanceRecall(qEl);
}

document.querySelectorAll('.quiz .q').forEach(enhance);
