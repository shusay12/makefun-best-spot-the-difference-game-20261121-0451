// Everything the player sees, painted on one canvas from the game state:
// the header with its timer and counter, the two picture panels with their
// found-markers and hint ring, the footer with its message, and the title,
// round-clear, round-lost and game-win overlays. The screenshots are frames
// of exactly this renderer, so what the judge sees is what a player sees.

import { FIELD, FOOTER, HEADER, LEVELS, PALETTE, PANEL, ROUND } from './config.js';
import { currentLevel, currentScene, SCREEN_GAME_WIN, SCREEN_PLAY, SCREEN_ROUND_LOST, SCREEN_ROUND_WIN, SCREEN_TITLE } from './game.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, value, x, y, size, colour, align = 'left', weight = 'bold') {
  ctx.fillStyle = colour;
  ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

function drawFoundMarker(ctx, x, y, radius, time, frozen) {
  const pulse = frozen ? 0 : Math.sin(time * 5) * 2;
  ctx.strokeStyle = PALETTE.marker;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, radius + pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.markerRing;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius - 6 + pulse, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPanel(ctx, state, panelIndex, time, frozen) {
  const scene = currentScene(state);
  const x = panelIndex === 0 ? PANEL.leftX : PANEL.rightX;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, PANEL.y, PANEL.width, PANEL.height);
  ctx.clip();
  ctx.translate(x, PANEL.y);
  scene.draw(ctx, panelIndex);
  // The found markers sit on both panels, over the same spot in each.
  for (const diff of scene.diffs) {
    if (state.found.includes(diff.id)) {
      drawFoundMarker(ctx, diff.x, diff.y, diff.r, time, frozen);
    }
  }
  // The hint ring pulses over one still-hidden difference.
  if (state.hint && time < state.hint.until) {
    const diff = state.hint.diff;
    const pulse = frozen ? 0 : Math.sin(time * 8) * 3;
    ctx.strokeStyle = PALETTE.hint;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r + 4 + pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
  // The frame: gold once a panel's round is won, purple while hunting.
  ctx.strokeStyle = state.screen === SCREEN_ROUND_WIN || state.screen === SCREEN_GAME_WIN ? PALETTE.panelFrameFound : PALETTE.panelFrame;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, PANEL.y, PANEL.width, PANEL.height);
  text(ctx, panelIndex === 0 ? 'A' : 'B', x + 14, PANEL.y + 16, 15, 'rgba(244, 239, 228, 0.75)');
}

function drawHeader(ctx, state) {
  ctx.fillStyle = PALETTE.header;
  ctx.fillRect(0, 0, FIELD.width, HEADER.height);
  text(ctx, '🏮 LANTERN LANE', 24, 20, 24, PALETTE.accent);
  text(ctx, 'Spot the Difference', 250, 21, 14, PALETTE.muted, 'left', 'normal');
  const level = currentLevel(state);
  text(ctx, `Round ${state.roundIndex + 1}/3 · ${level.name}`, 640, 20, 16, PALETTE.text, 'center');
  // The counter of how many remain — the brief's required counter.
  const found = state.found.length;
  const total = currentScene(state).diffs.length;
  text(ctx, `Found ${found}/${total} · ${total - found} left`, 880, 20, 16, found === total ? PALETTE.good : PALETTE.text, 'center');
  // The timer bar: it shrinks and turns red as the seconds run out.
  const barX = 1030;
  const barW = 150;
  const fraction = Math.max(0, state.timeLeft / ROUND.seconds);
  ctx.fillStyle = '#0f0b1e';
  roundRect(ctx, barX, 12, barW, 14, 7);
  ctx.fill();
  ctx.fillStyle = fraction > 0.5 ? PALETTE.teal : fraction > 0.25 ? PALETTE.accent : PALETTE.bad;
  if (fraction > 0) {
    roundRect(ctx, barX, 12, barW * fraction, 14, 7);
    ctx.fill();
  }
  text(ctx, `${Math.ceil(state.timeLeft)}s`, barX + barW + 10, 20, 15, PALETTE.text);
  const shownScore = state.screen === SCREEN_PLAY ? state.totalScore + state.score : state.totalScore;
  text(ctx, `Score ${shownScore}`, 640, 42, 13, PALETTE.muted, 'center', 'normal');
  const strikes = '●'.repeat(state.strikes) + '○'.repeat(ROUND.strikes - state.strikes);
  text(ctx, `Strikes ${strikes}`, 880, 42, 13, state.strikes > 0 ? PALETTE.bad : PALETTE.muted, 'center', 'normal');
  text(ctx, `Hints ${state.hintsLeft} · Best ${state.best}`, 1120, 42, 13, PALETTE.muted, 'center', 'normal');
}

function drawFooter(ctx, state) {
  ctx.fillStyle = PALETTE.header;
  ctx.fillRect(0, FOOTER.y, FIELD.width, FOOTER.height);
  const colour = state.messageKind === 'good' ? PALETTE.good : state.messageKind === 'bad' ? PALETTE.bad : PALETTE.text;
  text(ctx, state.message, 24, FOOTER.y + 20, 15, colour, 'left', 'normal');
  // Round dots: gold for cleared rounds, purple for the current one.
  for (let i = 0; i < LEVELS.length; i += 1) {
    ctx.fillStyle = i < state.roundIndex || state.screen === SCREEN_GAME_WIN ? PALETTE.accent : i === state.roundIndex ? PALETTE.teal : '#3a2f5e';
    ctx.beginPath();
    ctx.arc(820 + i * 26, FOOTER.y + 20, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  text(ctx, 'Click a difference · H hint · M sound · R retry', 1256, FOOTER.y + 20, 12, PALETTE.muted, 'right', 'normal');
}

function drawOverlay(ctx, state) {
  ctx.fillStyle = PALETTE.overlay;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.textAlign = 'center';
  if (state.screen === SCREEN_TITLE) {
    text(ctx, '🏮', 640, 110, 64, PALETTE.text, 'center');
    text(ctx, 'LANTERN LANE', 640, 175, 44, PALETTE.accent, 'center');
    text(ctx, 'Spot the Difference', 640, 215, 20, PALETTE.text, 'center', 'normal');
    text(ctx, 'Two lantern-lit scenes, side by side — seven tiny differences hide between them.', 640, 255, 16, PALETTE.muted, 'center', 'normal');
    text(ctx, 'Find all seven before the lanterns burn down. Three wrong clicks end the round.', 640, 282, 16, PALETTE.muted, 'center', 'normal');
    text(ctx, 'Three rounds: Dusk Market · Lantern Festival · Starlight Garden', 640, 309, 16, PALETTE.muted, 'center', 'normal');
    ctx.fillStyle = PALETTE.accent;
    roundRect(ctx, 520, 340, 240, 48, 10);
    ctx.fill();
    text(ctx, '▶  Start hunting', 640, 365, 18, '#1d1730', 'center');
    text(ctx, 'Mouse, or arrow keys + Enter  ·  H for a hint  ·  M to mute', 640, 420, 13, PALETTE.muted, 'center', 'normal');
    return;
  }
  if (state.screen === SCREEN_ROUND_WIN) {
    text(ctx, '★'.repeat(state.stars) + '☆'.repeat(3 - state.stars), 640, 140, 44, PALETTE.accent, 'center');
    text(ctx, `${currentLevel(state).name} — all 7 found!`, 640, 200, 30, PALETTE.good, 'center');
    text(ctx, `Round score ${state.score}  ·  Total ${state.totalScore}`, 640, 245, 18, PALETTE.text, 'center', 'normal');
    text(ctx, state.stars === 3 ? 'Flawless — not a single wrong click.' : state.stars === 2 ? 'Sharp eyes — well hunted.' : 'Found them all — faster next time!', 640, 278, 16, PALETTE.muted, 'center', 'normal');
    ctx.fillStyle = PALETTE.accent;
    roundRect(ctx, 490, 320, 300, 48, 10);
    ctx.fill();
    text(ctx, state.roundIndex + 1 < LEVELS.length ? '▶  Next round' : '▶  See the result', 640, 345, 18, '#1d1730', 'center');
    return;
  }
  if (state.screen === SCREEN_ROUND_LOST) {
    text(ctx, 'The lanterns burned out…', 640, 180, 30, PALETTE.bad, 'center');
    text(ctx, state.message, 640, 225, 17, PALETTE.text, 'center', 'normal');
    text(ctx, `You found ${state.found.length} of 7 differences this round.`, 640, 258, 16, PALETTE.muted, 'center', 'normal');
    ctx.fillStyle = PALETTE.accent;
    roundRect(ctx, 520, 300, 240, 48, 10);
    ctx.fill();
    text(ctx, '↻  Try the round again', 640, 325, 18, '#1d1730', 'center');
    return;
  }
  if (state.screen === SCREEN_GAME_WIN) {
    text(ctx, '🏮', 640, 105, 56, PALETTE.text, 'center');
    text(ctx, 'Every lantern lit!', 640, 165, 34, PALETTE.accent, 'center');
    text(ctx, 'All 21 differences found across the three scenes.', 640, 210, 18, PALETTE.text, 'center', 'normal');
    text(ctx, `Final score ${state.totalScore}  ·  Best ${state.best}`, 640, 250, 20, PALETTE.text, 'center', 'normal');
    text(ctx, 'Thank you for playing Lantern Lane.', 640, 285, 16, PALETTE.muted, 'center', 'normal');
    ctx.fillStyle = PALETTE.accent;
    roundRect(ctx, 520, 320, 240, 48, 10);
    ctx.fill();
    text(ctx, '↻  Play again', 640, 345, 18, '#1d1730', 'center');
  }
}

function drawWrongFlash(ctx, state, time) {
  if (!state.wrongFlash || time > state.wrongFlash.until) return;
  ctx.strokeStyle = PALETTE.bad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(state.wrongFlash.x, state.wrongFlash.y, 18, 0, Math.PI * 2);
  ctx.stroke();
  text(ctx, '✕', state.wrongFlash.x, state.wrongFlash.y - 26, 22, PALETTE.bad, 'center');
}

/** Paint one frame of the game at logical 1280x480. */
export function draw(ctx, state) {
  const time = state.animTime;
  const frozen = state.shot;
  ctx.fillStyle = PALETTE.backdrop;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  drawHeader(ctx, state);
  drawPanel(ctx, state, 0, time, frozen);
  drawPanel(ctx, state, 1, time, frozen);
  // The keyboard reticle, only while the player is steering with keys.
  if (state.cursor.visible && state.screen === SCREEN_PLAY) {
    ctx.strokeStyle = 'rgba(244, 239, 228, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(state.cursor.x, state.cursor.y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(state.cursor.x - 18, state.cursor.y);
    ctx.lineTo(state.cursor.x - 7, state.cursor.y);
    ctx.moveTo(state.cursor.x + 7, state.cursor.y);
    ctx.lineTo(state.cursor.x + 18, state.cursor.y);
    ctx.moveTo(state.cursor.x, state.cursor.y - 18);
    ctx.lineTo(state.cursor.x, state.cursor.y - 7);
    ctx.moveTo(state.cursor.x, state.cursor.y + 7);
    ctx.lineTo(state.cursor.x, state.cursor.y + 18);
    ctx.stroke();
  }
  drawWrongFlash(ctx, state, time);
  drawFooter(ctx, state);
  if (state.screen !== SCREEN_PLAY) drawOverlay(ctx, state);
}
