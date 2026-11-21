// Every tuning number, layout constant and colour in one place.
// The playfield is a fixed 1280x480 logical area; the renderer scales it to
// the window, so no rule below depends on the screen size.

export const FIELD = { width: 1280, height: 480 };

/** The two picture panels: same size, side by side, with a gap between them. */
export const PANEL = { width: 600, height: 360, y: 64, leftX: 24, rightX: 656 };

/** Header band (title, timer, counter) and footer band (messages, buttons). */
export const HEADER = { height: 56 };
export const FOOTER = { y: 432, height: 40 };

export const ROUND = {
  seconds: 90,
  strikes: 3,
  hints: 3,
  pointsPerFind: 100,
  wrongClickPenalty: 25,
  hintCost: 50,
  timeBonusPerSecond: 5,
  perfectBonus: 150,
};

export const DIFF_RADIUS = 26;

export const LEVELS = [
  { name: 'Dusk Market', scene: 'market', seed: 101, par: 75 },
  { name: 'Lantern Festival', scene: 'festival', seed: 202, par: 70 },
  { name: 'Starlight Garden', scene: 'garden', seed: 303, par: 65 },
];

export const PALETTE = {
  backdrop: '#14101f',
  header: '#1d1730',
  panelFrame: '#3a2f5e',
  panelFrameFound: '#f2c94c',
  text: '#f4efe4',
  muted: '#a89ec4',
  accent: '#f2c94c',
  accent2: '#ff7a59',
  teal: '#3ec6b8',
  good: '#7ed07e',
  bad: '#e5534b',
  hint: '#ffd94d',
  button: '#2c2450',
  buttonHover: '#3a2f66',
  overlay: 'rgba(12, 8, 24, 0.82)',
  marker: '#ffd94d',
  markerRing: '#ff7a59',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best total score is kept between visits (this browser only). */
export const BEST_KEY = 'lantern-lane.best';
