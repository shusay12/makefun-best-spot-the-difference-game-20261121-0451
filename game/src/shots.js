// The screenshot scenes behind ?shot=start|play|hint|win. Each one sets the
// real game state directly — no animation, no timer running — so the frame is
// what a short game really looks like and the same seed always gives the
// same frame. The screenshots are renders of the game's own code, taken in
// a browser, never edited or composited.
//
//   start — the title screen over round one's market scene.
//   play  — mid-round: three differences found (gold markers on both panels),
//           four still hidden, the counter reading "Found 3/7 · 4 left".
//   hint  — the same hunt a moment later, with a hint ring pulsing over the
//           still-hidden lantern difference.
//   win   — round one cleared, three stars, the score and the next-round
//           button, every difference marked on both panels.

import { currentScene, SCREEN_PLAY, SCREEN_ROUND_WIN, SCREEN_TITLE, startRound } from './game.js';

function foundState(state, ids, timeLeft, score, strikes, hintsLeft) {
  const scene = currentScene(state);
  state.found = [...ids];
  state.foundNames = scene.diffs.filter((diff) => ids.includes(diff.id)).map((diff) => diff.label);
  state.timeLeft = timeLeft;
  state.score = score;
  state.strikes = strikes;
  state.hintsLeft = hintsLeft;
  state.combo = ids.length;
  const total = scene.diffs.length;
  state.message = `Found ${ids.length} of ${total} — ${total - ids.length} differences still hiding.`;
  state.messageKind = 'info';
  state.screen = SCREEN_PLAY;
}

export function stageShot(name, state, roundIndex = 0) {
  // Screenshots freeze the clock: the timer, the pulses and the hint ring
  // all hold still, so the captured frame is the same every time.
  state.shot = true;
  state.animTime = 0.6;
  startRound(state, roundIndex);
  const scene = currentScene(state);
  const total = scene.diffs.length;
  if (name === 'play') {
    foundState(state, scene.diffs.slice(0, 3).map((diff) => diff.id), 47, 350, 0, 3);
    return;
  }
  if (name === 'hint') {
    foundState(state, scene.diffs.slice(0, 2).map((diff) => diff.id), 52, 225, 1, 2);
    const hinted = scene.diffs[2];
    state.hint = { diff: hinted, until: 3 };
    state.message = `Hint: something is different near the ${hinted.label.toLowerCase()}… (−50 points)`;
    return;
  }
  if (name === 'win') {
    foundState(state, scene.diffs.map((diff) => diff.id), 31, 685, 0, 3);
    state.score = 685;
    state.totalScore = 685;
    state.stars = 3;
    state.message = 'Round clear! Time bonus +155, flawless +150.';
    state.messageKind = 'good';
    state.screen = SCREEN_ROUND_WIN;
    return;
  }
  // Any other name is the title screen.
  state.screen = SCREEN_TITLE;
  state.message = `Find ${total} differences — click a difference in either picture.`;
}
