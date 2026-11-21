// The three scenes, each drawn twice: once for the left panel, once for the
// right. Both panels share one seeded generator, so the decorations match
// exactly and only the listed differences change. Every difference is drawn
// big enough to spot at a glance in a screenshot: a shape, a colour, a thing
// present on one side and gone on the other.
//
// Scene space is 600x360. A difference is { id, label, x, y, r }: the point
// a click must land near, and the label the found-list shows.

import { sceneRandom } from './random.js';

function sky(ctx, top, bottom) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 360);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 360);
}

function circle(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, colour) {
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w, h);
}

function ellipse(ctx, x, y, rx, ry, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function star(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const angle = (i * Math.PI) / 4;
    const radius = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function bird(ctx, x, y, colour, scale) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 10 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 8 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 8 * scale, x + 10 * scale, y);
  ctx.stroke();
}

function lantern(ctx, x, y, r, colour, glow) {
  if (glow) {
    const gradient = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 2.1);
    gradient.addColorStop(0, 'rgba(255, 214, 120, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 214, 120, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(x - 2, y - r - 8, 4, 8);
  ellipse(ctx, x, y, r * 0.78, r, colour);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(x - r * 0.45, y - r * 0.7, r * 0.22, r * 1.4);
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(x - r * 0.4, y + r - 2, r * 0.8, 4);
}

function cat(ctx, x, y, colour) {
  ctx.fillStyle = colour;
  ellipse(ctx, x, y, 16, 9, colour);
  circle(ctx, x + 13, y - 7, 8, colour);
  ctx.beginPath();
  ctx.moveTo(x + 8, y - 13);
  ctx.lineTo(x + 10, y - 21);
  ctx.lineTo(x + 14, y - 13);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 15, y - 14);
  ctx.lineTo(x + 18, y - 21);
  ctx.lineTo(x + 21, y - 13);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 2);
  ctx.quadraticCurveTo(x - 26, y - 12, x - 20, y - 20);
  ctx.quadraticCurveTo(x - 16, y - 12, x - 10, y - 4);
  ctx.closePath();
  ctx.fill();
}

// ---------------------------------------------------------------------------
// Scene 1 — Dusk Market: a lantern-lit shopping lane at sunset.
// ---------------------------------------------------------------------------

const MARKET_DIFFS = [
  { id: 'moon', label: 'The moon', x: 520, y: 48, r: 24 },
  { id: 'cat', label: 'The roof cat', x: 120, y: 118, r: 22 },
  { id: 'lantern', label: 'The middle lantern', x: 300, y: 92, r: 20 },
  { id: 'awning', label: 'The awning stripes', x: 300, y: 180, r: 26 },
  { id: 'bird', label: 'The extra bird', x: 420, y: 60, r: 18 },
  { id: 'fruit', label: 'The stall fruit', x: 300, y: 300, r: 24 },
  { id: 'sign', label: 'The shop sign', x: 470, y: 150, r: 22 },
];

function drawMarket(ctx, variant) {
  const rng = sceneRandom(101);
  sky(ctx, '#2b1e4f', '#e8825a');
  for (let i = 0; i < 26; i += 1) {
    star(ctx, rng() * 600, rng() * 120, 1.5 + rng() * 2, 'rgba(255, 244, 200, 0.85)');
  }
  // The moon: a crescent on the left, a full moon on the right.
  circle(ctx, 520, 48, 24, '#ffe9a8');
  if (variant === 0) circle(ctx, 530, 42, 20, '#2b1e4f');
  // Distant rooftops.
  ctx.fillStyle = '#241a42';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.lineTo(0, 210);
  ctx.lineTo(70, 170);
  ctx.lineTo(140, 210);
  ctx.lineTo(210, 210);
  ctx.lineTo(280, 165);
  ctx.lineTo(350, 210);
  ctx.lineTo(430, 210);
  ctx.lineTo(500, 175);
  ctx.lineTo(600, 215);
  ctx.lineTo(600, 300);
  ctx.closePath();
  ctx.fill();
  // Three shop houses.
  rect(ctx, 20, 150, 180, 150, '#6b4a8f');
  rect(ctx, 210, 130, 180, 170, '#8f5a3c');
  rect(ctx, 400, 145, 180, 155, '#4a6b8f');
  rect(ctx, 20, 150, 180, 10, '#54387a');
  rect(ctx, 210, 130, 180, 10, '#7a4630');
  rect(ctx, 400, 145, 180, 10, '#3a5578');
  // Windows: two lit, one dark.
  rect(ctx, 45, 190, 34, 44, '#ffd94d');
  rect(ctx, 140, 190, 34, 44, '#ffd94d');
  rect(ctx, 235, 175, 34, 44, '#ffd94d');
  rect(ctx, 330, 175, 34, 44, '#2a2140');
  rect(ctx, 425, 185, 34, 44, '#ffd94d');
  rect(ctx, 520, 185, 34, 44, '#ffd94d');
  // The roof cat: present on the left, gone on the right.
  if (variant === 0) cat(ctx, 120, 146, '#1c1430');
  // The awning over the middle shop: five stripes on the left, four on the right.
  const stripes = variant === 0 ? 5 : 4;
  for (let i = 0; i < stripes; i += 1) {
    rect(ctx, 215 + i * (170 / stripes), 235, 170 / stripes, 26, i % 2 === 0 ? '#f2c94c' : '#e5534b');
  }
  // Lantern string across the lane.
  ctx.strokeStyle = '#1c1430';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 70);
  ctx.quadraticCurveTo(300, 105, 600, 70);
  ctx.stroke();
  lantern(ctx, 80, 92, 14, '#e5534b', true);
  lantern(ctx, 180, 98, 14, '#f2c94c', true);
  // The middle lantern: red on the left, teal on the right.
  lantern(ctx, 300, 92, 16, variant === 0 ? '#e5534b' : '#3ec6b8', true);
  lantern(ctx, 420, 98, 14, '#f2c94c', true);
  lantern(ctx, 520, 92, 14, '#e5534b', true);
  // Birds: one extra bird on the right.
  bird(ctx, 90, 60, '#1c1430', 1);
  bird(ctx, 180, 45, '#1c1430', 0.8);
  if (variant === 1) bird(ctx, 420, 60, '#1c1430', 1);
  // The shop sign: round on the left, square on the right.
  ctx.strokeStyle = '#1c1430';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(470, 128);
  ctx.lineTo(470, 138);
  ctx.stroke();
  if (variant === 0) {
    circle(ctx, 470, 158, 20, '#f2c94c');
    ctx.fillStyle = '#8f2f26';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('茶', 470, 159);
  } else {
    rect(ctx, 450, 138, 40, 40, '#3ec6b8');
    ctx.fillStyle = '#123a3a';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('茶', 470, 159);
  }
  // Cobblestone street.
  rect(ctx, 0, 300, 600, 60, '#3a2f4e');
  for (let i = 0; i < 40; i += 1) {
    ellipse(ctx, rng() * 600, 306 + rng() * 48, 8 + rng() * 6, 4, '#4a3f66');
  }
  // The market stall and its fruit: apples on the left, oranges on the right.
  rect(ctx, 230, 280, 140, 10, '#7a5a30');
  rect(ctx, 238, 290, 8, 40, '#5a4020');
  rect(ctx, 354, 290, 8, 40, '#5a4020');
  const fruitColour = variant === 0 ? '#e5534b' : '#ff8c42';
  for (let i = 0; i < 5; i += 1) {
    circle(ctx, 252 + i * 22, 272, 10, fruitColour);
    circle(ctx, 263 + i * 22, 258, 9, fruitColour);
  }
  // Potted plant by the left house.
  rect(ctx, 52, 306, 22, 18, '#c96f4a');
  circle(ctx, 63, 296, 14, '#4a9e5e');
  circle(ctx, 55, 288, 9, '#5cb878');
  circle(ctx, 72, 288, 9, '#5cb878');
}

// ---------------------------------------------------------------------------
// Scene 2 — Lantern Festival: paper lanterns, a bridge and a pond at night.
// ---------------------------------------------------------------------------

const FESTIVAL_DIFFS = [
  { id: 'firework', label: 'The firework', x: 450, y: 70, r: 26 },
  { id: 'koi', label: 'The third koi', x: 330, y: 330, r: 20 },
  { id: 'lantern', label: 'The middle lantern', x: 280, y: 95, r: 22 },
  { id: 'flag', label: 'The bunting flag', x: 520, y: 60, r: 16 },
  { id: 'plank', label: 'The bridge plank', x: 300, y: 285, r: 20 },
  { id: 'star', label: 'The bright star', x: 120, y: 40, r: 14 },
  { id: 'stall-sign', label: 'The stall sign', x: 520, y: 180, r: 20 },
];

function firework(ctx, x, y, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i += 1) {
    const angle = (i * Math.PI) / 6;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * 8, y + Math.sin(angle) * 8);
    ctx.lineTo(x + Math.cos(angle) * 26, y + Math.sin(angle) * 26);
    ctx.stroke();
  }
  circle(ctx, x, y, 4, '#fff2b0');
}

function koi(ctx, x, y, colour, facing) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - facing * 14, y);
  ctx.lineTo(x - facing * 26, y - 8);
  ctx.lineTo(x - facing * 26, y + 8);
  ctx.closePath();
  ctx.fill();
  circle(ctx, x + facing * 9, y - 2, 1.8, '#1c1430');
}

function drawFestival(ctx, variant) {
  const rng = sceneRandom(202);
  sky(ctx, '#0e1030', '#3a2a6e');
  for (let i = 0; i < 34; i += 1) {
    star(ctx, rng() * 600, rng() * 150, 1.5 + rng() * 2, 'rgba(255, 244, 200, 0.9)');
  }
  // One extra bright star on the right.
  if (variant === 1) star(ctx, 120, 40, 6, '#fff2b0');
  // The firework: bursting on the left, gone on the right.
  if (variant === 0) firework(ctx, 450, 70, '#ff9d5c');
  // The gate on the left.
  rect(ctx, 42, 120, 12, 140, '#b03a2e');
  rect(ctx, 128, 120, 12, 140, '#b03a2e');
  rect(ctx, 30, 108, 122, 14, '#8f2f26');
  rect(ctx, 40, 132, 102, 8, '#8f2f26');
  // The paper lanterns: the middle one is missing on the right.
  lantern(ctx, 60, 92, 15, '#e5534b', true);
  lantern(ctx, 170, 98, 15, '#f2c94c', true);
  if (variant === 0) lantern(ctx, 280, 95, 17, '#e5534b', true);
  lantern(ctx, 390, 98, 15, '#f2c94c', true);
  lantern(ctx, 500, 92, 15, '#e5534b', true);
  // Bunting flags strung across the top right: one flag changes colour.
  ctx.strokeStyle = '#1c1430';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(420, 30);
  ctx.quadraticCurveTo(500, 55, 580, 30);
  ctx.stroke();
  const flagColours = ['#e5534b', '#f2c94c', '#3ec6b8', '#e5534b'];
  for (let i = 0; i < 4; i += 1) {
    let colour = flagColours[i];
    if (i === 3 && variant === 1) colour = '#3ec6b8';
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(448 + i * 32, 40);
    ctx.lineTo(472 + i * 32, 40);
    ctx.lineTo(460 + i * 32, 62);
    ctx.closePath();
    ctx.fill();
  }
  // The pond.
  rect(ctx, 0, 300, 600, 60, '#1d3a5e');
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.fillRect(0, 312, 600, 3);
  ctx.fillRect(0, 334, 600, 3);
  // Koi in the pond: two on the left, three on the right.
  koi(ctx, 210, 325, '#ff8c42', 1);
  koi(ctx, 420, 340, '#f2f2f2', -1);
  if (variant === 1) koi(ctx, 330, 330, '#ff8c42', 1);
  // The arched bridge over the pond.
  ctx.fillStyle = '#8f5a3c';
  ctx.beginPath();
  ctx.moveTo(180, 300);
  ctx.quadraticCurveTo(300, 238, 420, 300);
  ctx.lineTo(420, 314);
  ctx.quadraticCurveTo(300, 256, 180, 314);
  ctx.closePath();
  ctx.fill();
  // Bridge planks: the middle plank is red on the left, gold on the right.
  for (let i = 0; i < 7; i += 1) {
    const x = 200 + i * 30;
    const y = 292 - Math.sin((i / 6) * Math.PI) * 26;
    rect(ctx, x, y, 24, 8, i === 3 && variant === 1 ? '#f2c94c' : '#e5534b');
  }
  // The food stall on the right, with its sign: round on the left, square on the right.
  rect(ctx, 480, 200, 100, 100, '#6b4a8f');
  rect(ctx, 472, 192, 116, 12, '#54387a');
  if (variant === 0) {
    circle(ctx, 520, 168, 18, '#f2c94c');
  } else {
    rect(ctx, 502, 150, 36, 36, '#3ec6b8');
  }
  ctx.fillStyle = '#123a3a';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('食', 520, 169);
  rect(ctx, 500, 250, 40, 30, '#ffd94d');
  // Festival crowd silhouettes along the bottom.
  ctx.fillStyle = '#1c1430';
  for (let i = 0; i < 5; i += 1) {
    const x = 60 + i * 42;
    circle(ctx, x, 296, 8, '#1c1430');
    rect(ctx, x - 9, 300, 18, 22, '#1c1430');
  }
}

// ---------------------------------------------------------------------------
// Scene 3 — Starlight Garden: a quiet garden with a fountain at dawn.
// ---------------------------------------------------------------------------

const GARDEN_DIFFS = [
  { id: 'butterfly', label: 'The butterfly', x: 400, y: 120, r: 18 },
  { id: 'apples', label: 'The tree apples', x: 110, y: 140, r: 24 },
  { id: 'fountain', label: 'The fountain jet', x: 330, y: 220, r: 22 },
  { id: 'flower', label: 'The red tulip', x: 200, y: 330, r: 18 },
  { id: 'firefly', label: 'The extra firefly', x: 480, y: 90, r: 14 },
  { id: 'cushion', label: 'The bench cushion', x: 170, y: 300, r: 20 },
  { id: 'flame', label: 'The lantern flame', x: 500, y: 260, r: 18 },
];

function butterfly(ctx, x, y) {
  ctx.fillStyle = '#ff9d5c';
  ctx.beginPath();
  ctx.ellipse(x - 7, y - 4, 8, 6, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 7, y - 4, 8, 6, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x - 6, y + 5, 6, 5, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 6, y + 5, 6, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1c1430';
  ctx.fillRect(x - 1.5, y - 8, 3, 16);
}

function drawGarden(ctx, variant) {
  const rng = sceneRandom(303);
  sky(ctx, '#1e2a52', '#f2b880');
  circle(ctx, 520, 52, 22, '#ffe9a8');
  for (let i = 0; i < 22; i += 1) {
    star(ctx, rng() * 600, rng() * 110, 1.5 + rng() * 2, 'rgba(255, 244, 200, 0.85)');
  }
  // Fireflies: one extra on the right.
  for (let i = 0; i < 6; i += 1) {
    const x = 60 + rng() * 480;
    const y = 60 + rng() * 140;
    circle(ctx, x, y, 3, 'rgba(255, 240, 140, 0.95)');
  }
  if (variant === 1) circle(ctx, 480, 90, 4, 'rgba(255, 240, 140, 0.95)');
  // The butterfly: fluttering on the left, gone on the right.
  if (variant === 0) butterfly(ctx, 400, 120);
  // Grass and flower beds.
  rect(ctx, 0, 250, 600, 110, '#2e6b3a');
  rect(ctx, 0, 250, 600, 8, '#3a8548');
  for (let i = 0; i < 30; i += 1) {
    const x = rng() * 600;
    const y = 300 + rng() * 50;
    circle(ctx, x, y, 3.5, ['#ff7a9e', '#ffd94d', '#c9a0ff', '#ffffff'][i % 4]);
  }
  // One tulip changes colour: red on the left, purple on the right.
  ctx.strokeStyle = '#1e4d28';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(200, 336);
  ctx.lineTo(200, 312);
  ctx.stroke();
  ctx.fillStyle = variant === 0 ? '#e5534b' : '#a06bff';
  ctx.beginPath();
  ctx.ellipse(200, 306, 7, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  // The apple tree on the left.
  ctx.fillStyle = '#5a4020';
  ctx.fillRect(96, 180, 16, 80);
  circle(ctx, 104, 150, 58, '#3a8548');
  circle(ctx, 70, 170, 34, '#3a8548');
  circle(ctx, 140, 170, 34, '#3a8548');
  // Apples: five on the left, three on the right.
  const appleSpots = [
    [80, 150],
    [110, 130],
    [140, 155],
    [92, 178],
    [128, 182],
  ];
  const appleCount = variant === 0 ? 5 : 3;
  for (let i = 0; i < appleCount; i += 1) {
    circle(ctx, appleSpots[i][0], appleSpots[i][1], 6, '#e5534b');
  }
  // The bench with its cushion: teal on the left, orange on the right.
  rect(ctx, 150, 296, 90, 8, '#7a5a30');
  rect(ctx, 156, 304, 8, 26, '#7a5a30');
  rect(ctx, 226, 304, 8, 26, '#7a5a30');
  rect(ctx, 154, 288, 82, 10, variant === 0 ? '#3ec6b8' : '#ff8c42');
  // The fountain in the middle.
  ellipse(ctx, 330, 300, 70, 22, '#7a8a9e');
  ellipse(ctx, 330, 296, 56, 16, '#4a7a9e');
  rect(ctx, 322, 250, 16, 50, '#8a9aae');
  ellipse(ctx, 330, 248, 26, 8, '#9aabbe');
  // The water jet: spraying on the left, still on the right.
  if (variant === 0) {
    ctx.strokeStyle = '#bfe8ff';
    ctx.lineWidth = 3;
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(330, 246);
      ctx.quadraticCurveTo(330 + i * 14, 226, 330 + i * 24, 244);
      ctx.stroke();
    }
    circle(ctx, 330, 240, 4, '#dff4ff');
  }
  // The pond on the right.
  ellipse(ctx, 470, 330, 90, 24, '#2a5a7e');
  ellipse(ctx, 470, 328, 74, 18, '#3a7aae');
  // The stone lantern: its flame burns on the left, is out on the right.
  rect(ctx, 492, 280, 16, 40, '#8a8a92');
  rect(ctx, 484, 272, 32, 10, '#7a7a82');
  rect(ctx, 488, 258, 24, 14, '#9a9aa2');
  rect(ctx, 482, 250, 36, 8, '#6a6a72');
  if (variant === 0) {
    circle(ctx, 500, 252, 6, '#ffd94d');
    const glow = ctx.createRadialGradient(500, 252, 2, 500, 252, 22);
    glow.addColorStop(0, 'rgba(255, 217, 77, 0.55)');
    glow.addColorStop(1, 'rgba(255, 217, 77, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(500, 252, 22, 0, Math.PI * 2);
    ctx.fill();
  }
}

export const SCENES = {
  market: { name: 'Dusk Market', diffs: MARKET_DIFFS, draw: drawMarket },
  festival: { name: 'Lantern Festival', diffs: FESTIVAL_DIFFS, draw: drawFestival },
  garden: { name: 'Starlight Garden', diffs: GARDEN_DIFFS, draw: drawGarden },
};
