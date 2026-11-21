// The game state and its rules: one round per scene, seven differences each,
// a 90-second timer, three strikes for wrong clicks, three hints, and a
// score that rewards fast, accurate finding. Nothing here draws: draw.js
// reads this state and paints it.

import { LEVELS, PANEL, ROUND, DIFF_RADIUS } from './config.js';
import { SCENES } from './scenes.js';
import {
  playClick,
  playFound,
  playGameWin,
  playHint,
  playRoundLost,
  playRoundWin,
  playWrong,
} from './audio.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_ROUND_WIN = 'round-win';
export const SCREEN_ROUND_LOST = 'round-lost';
export const SCREEN_GAME_WIN = 'game-win';

export function loadBest() {
  try {
    return Number(window.localStorage.getItem('lantern-lane.best')) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(value) {
  try {
    window.localStorage.setItem('lantern-lane.best', String(value));
  } catch {
    // A browser without storage still plays; the best score just does not persist.
  }
}

/** A fresh state: title screen, round one ready, nothing found yet. */
export function createGame() {
  return {
    screen: SCREEN_TITLE,
    roundIndex: 0,
    found: [],
    strikes: 0,
    hintsLeft: ROUND.hints,
    hint: null,
    score: 0,
    totalScore: 0,
    timeLeft: ROUND.seconds,
    combo: 0,
    message: 'Find 7 differences — click a difference in either picture.',
    messageKind: 'info',
    foundNames: [],
    stars: 0,
    best: loadBest(),
    cursor: { x: 324, y: 244, visible: false },
    wrongFlash: null,
    shot: false,
    animTime: 0,
  };
}

export function currentLevel(state) {
  return LEVELS[state.roundIndex];
}

export function currentScene(state) {
  return SCENES[currentLevel(state).scene];
}

export function roundScore(state) {
  return state.score;
}

export function startRound(state, roundIndex) {
  state.roundIndex = roundIndex;
  state.found = [];
  state.strikes = 0;
  state.hintsLeft = ROUND.hints;
  state.hint = null;
  state.score = 0;
  state.timeLeft = ROUND.seconds;
  state.combo = 0;
  state.foundNames = [];
  state.message = `Round ${roundIndex + 1}: ${currentLevel(state).name} — find 7 differences.`;
  state.messageKind = 'info';
  state.screen = SCREEN_PLAY;
  state.wrongFlash = null;
}

export function startGame(state) {
  state.totalScore = 0;
  startRound(state, 0);
}

function finishRound(state, won) {
  if (won) {
    const timeBonus = Math.round(state.timeLeft) * ROUND.timeBonusPerSecond;
    const perfect = state.strikes === 0 ? ROUND.perfectBonus : 0;
    state.score += timeBonus + perfect;
    state.totalScore += state.score;
    state.stars = state.strikes === 0 && state.timeLeft >= 30 ? 3 : state.timeLeft >= 15 ? 2 : 1;
    if (state.totalScore > state.best) {
      state.best = state.totalScore;
      saveBest(state.best);
    }
    state.message = `Round clear! Time bonus +${timeBonus}${perfect ? `, flawless +${perfect}` : ''}.`;
    state.messageKind = 'good';
    state.screen = SCREEN_ROUND_WIN;
    playRoundWin();
  } else {
    state.message = state.timeLeft <= 0 ? 'Time ran out — the differences slipped away.' : 'Three wrong clicks — the round is lost.';
    state.messageKind = 'bad';
    state.screen = SCREEN_ROUND_LOST;
    playRoundLost();
  }
}

export function nextRound(state) {
  if (state.roundIndex + 1 < LEVELS.length) {
    startRound(state, state.roundIndex + 1);
  } else {
    state.screen = SCREEN_GAME_WIN;
    state.message = 'Every difference in every scene — found!';
    state.messageKind = 'good';
    playGameWin();
  }
}

/** One fixed-step tick: the timer only runs while a round is being played. */
export function tick(state, dt) {
  if (state.screen !== SCREEN_PLAY || state.shot) return;
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    finishRound(state, false);
  }
}

/** Where a click lands: null when it is not on a picture panel. */
export function panelHit(x, y) {
  if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
  if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) {
    return { panel: 0, sx: x - PANEL.leftX, sy: y - PANEL.y };
  }
  if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) {
    return { panel: 1, sx: x - PANEL.rightX, sy: y - PANEL.y };
  }
  return null;
}

function nearestDiff(state, sx, sy) {
  const scene = currentScene(state);
  let best = null;
  let bestDistance = Infinity;
  for (const diff of scene.diffs) {
    if (state.found.includes(diff.id)) continue;
    const dx = diff.x - sx;
    const dy = diff.y - sy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = diff;
    }
  }
  return { diff: best, distance: bestDistance };
}

/** A click (or keyboard Enter) at logical field coordinates. */
export function clickAt(state, x, y) {
  if (state.screen === SCREEN_TITLE) {
    playClick();
    startGame(state);
    return;
  }
  if (state.screen === SCREEN_ROUND_WIN) {
    playClick();
    nextRound(state);
    return;
  }
  if (state.screen === SCREEN_ROUND_LOST) {
    playClick();
    startRound(state, state.roundIndex);
    return;
  }
  if (state.screen === SCREEN_GAME_WIN) {
    playClick();
    state.screen = SCREEN_TITLE;
    return;
  }
  if (state.screen !== SCREEN_PLAY) return;
  const hit = panelHit(x, y);
  if (hit === null) return;
  const { diff, distance } = nearestDiff(state, hit.sx, hit.sy);
  if (diff !== null && distance <= DIFF_RADIUS) {
    state.found.push(diff.id);
    state.foundNames.push(diff.label);
    state.combo += 1;
    const gained = ROUND.pointsPerFind + (state.combo - 1) * 25;
    state.score += gained;
    state.message = `${diff.label} — found! +${gained} points (combo x${state.combo}).`;
    state.messageKind = 'good';
    playFound();
    if (state.found.length === currentScene(state).diffs.length) {
      finishRound(state, true);
    }
    return;
  }
  state.combo = 0;
  state.strikes += 1;
  state.score = Math.max(0, state.score - ROUND.wrongClickPenalty);
  state.wrongFlash = { x, y, until: state.animTime + 0.45 };
  if (state.strikes >= ROUND.strikes) {
    finishRound(state, false);
    return;
  }
  state.message = `Not a difference — strike ${state.strikes} of ${ROUND.strikes}. Look closer!`;
  state.messageKind = 'bad';
  playWrong();
}

/** Spend a hint: ring the nearest unfound difference for a few seconds. */
export function useHint(state) {
  if (state.screen !== SCREEN_PLAY) return;
  if (state.hintsLeft <= 0) {
    state.message = 'No hints left this round — trust your eyes.';
    state.messageKind = 'bad';
    return;
  }
  const scene = currentScene(state);
  const remaining = scene.diffs.filter((diff) => !state.found.includes(diff.id));
  if (remaining.length === 0) return;
  const diff = remaining[0];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - ROUND.hintCost);
  state.hint = { diff, until: state.animTime + 3 };
  state.message = `Hint: something is different near the ${diff.label.toLowerCase()}… (−${ROUND.hintCost} points)`;
  state.messageKind = 'info';
  playHint();
}

/** Keyboard play: arrows move the reticle, Enter clicks it, H hints, M mutes. */
export function keyAction(state, key, toggleMute) {
  const step = key === 'ArrowLeft' || key === 'ArrowRight' ? 24 : 18;
  if (key.startsWith('Arrow')) {
    state.cursor.visible = true;
    if (key === 'ArrowLeft') state.cursor.x = Math.max(24, state.cursor.x - step);
    if (key === 'ArrowRight') state.cursor.x = Math.min(1256, state.cursor.x + step);
    if (key === 'ArrowUp') state.cursor.y = Math.max(64, state.cursor.y - step);
    if (key === 'ArrowDown') state.cursor.y = Math.min(424, state.cursor.y + step);
    return;
  }
  if (key === 'Enter' || key === ' ') {
    clickAt(state, state.cursor.x, state.cursor.y);
    return;
  }
  if (key === 'h' || key === 'H') {
    useHint(state);
    return;
  }
  if (key === 'm' || key === 'M') {
    toggleMute();
    return;
  }
  if (key === 'r' || key === 'R') {
    if (state.screen === SCREEN_PLAY || state.screen === SCREEN_ROUND_LOST) {
      startRound(state, state.roundIndex);
    }
  }
}
