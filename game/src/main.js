// Boot and the animation loop: fit the fixed 1280x480 field to the window,
// run the timer on a fixed step, and route mouse, touch and keyboard input
// to the game. A `?shot=` query stages one of the screenshot scenes instead
// of starting a live game.

import { FIELD } from './config.js';
import { createGame, keyAction, clickAt, tick } from './game.js';
import { draw } from './draw.js';
import { isMuted, setMuted } from './audio.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
const state = createGame();

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot !== null) {
  const round = Math.min(3, Math.max(1, Number(params.get('round') || 1)));
  stageShot(shot, state, round - 1);
} else {
  state.message = 'Find 7 differences — click a difference in either picture.';
}

function resize() {
  const scale = Math.min(window.innerWidth / FIELD.width, window.innerHeight / FIELD.height);
  canvas.width = Math.round(FIELD.width * scale);
  canvas.height = Math.round(FIELD.height * scale);
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
}

function toField(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * FIELD.width,
    y: ((event.clientY - rect.top) / rect.height) * FIELD.height,
  };
}

canvas.addEventListener('pointerdown', (event) => {
  const point = toField(event);
  clickAt(state, point.x, point.y);
  status.textContent = state.message;
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'm' || event.key === 'M') {
    setMuted(!isMuted());
    state.message = isMuted() ? 'Sound off.' : 'Sound on.';
    status.textContent = state.message;
    return;
  }
  keyAction(state, event.key, () => setMuted(!isMuted()));
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) {
    event.preventDefault();
  }
  status.textContent = state.message;
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (!state.shot) state.animTime += dt;
  tick(state, dt);
  ctx.setTransform(canvas.width / FIELD.width, 0, 0, canvas.height / FIELD.height, 0, 0);
  draw(ctx, state);
  requestAnimationFrame(frame);
}

resize();
window.addEventListener('resize', resize);
requestAnimationFrame(frame);
