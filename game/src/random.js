// A tiny deterministic random generator (mulberry32), so every scene draws
// the same decorative stars, clouds and pebbles on both panels and on every
// run, while the differences between the panels stay exactly the ones the
// level lists.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A fresh generator for one scene: same seed, same decorations, every time. */
export function sceneRandom(seed) {
  return mulberry32(seed);
}
