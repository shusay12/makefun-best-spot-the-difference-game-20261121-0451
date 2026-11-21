# makefun-best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/shusay12/makefun-best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/shusay12/makefun-best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

<sub>Entered on [make.fun](https://make.fun/?ref=susay21&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>

---

# Lantern Lane — Spot the Difference

An original spot-the-difference game that runs entirely in a desktop browser from static files — no libraries, no assets, no network. Two lantern-lit pictures hang side by side; seven tiny differences hide between them, and you hunt them down before the lanterns burn out.

## How it plays

- **Three rounds, three scenes** — Dusk Market, Lantern Festival, and Starlight Garden. Each scene is hand-drawn on canvas (procedural vector art, seeded so both panels match exactly) and hides 7 differences: a missing cat, a lantern that changed colour, a moon gone full, a sign that turned square.
- **Click a difference in either picture** — a gold ring marks it on both panels and the counter ticks up: "Found 3/7 · 4 left".
- **90 seconds a round, three strikes** — a wrong click costs 25 points and a strike; three strikes end the round. Combos pay extra: each find in a row without a miss is worth 25 more.
- **Hints** — three per round (H key), each rings the nearest unfound difference for a few seconds and costs 50 points.
- **Stars and bonuses** — clear a round for a time bonus, plus 150 for a flawless round. Stars (1–3) depend on strikes and time left. Clear all three rounds to light every lantern.
- **Keyboard play** — arrow keys move a reticle, Enter clicks it, H hints, M mutes, R retries the round. Sound is synthesised with WebAudio: chimes, thuds and win runs, no audio files.
- **Best score** is kept in localStorage between visits.

## Running it

Serve `game/` with any static server (`node serve.ts`, then open http://localhost:8080) or open `game/index.html` directly in desktop Chrome. `main.ts` is the make.fun hand-in entry point: it copies `game/` and `screenshots/` to the output and writes the dossier via the kit's vendor module.

## Structure

- `game/index.html` — the page: one canvas, one status line.
- `game/src/main.js` — boot, the animation loop, input routing, `?shot=` screenshot scenes.
- `game/src/game.js` — the rules: rounds, timer, strikes, hints, scoring, keyboard play.
- `game/src/scenes.js` — the three scenes and their 21 differences, drawn twice per frame.
- `game/src/draw.js` — everything the player sees: header, panels, markers, overlays.
- `game/src/config.js` — every tuning number, layout constant and colour.
- `game/src/random.js` — the seeded generator that keeps both panels identical.
- `game/src/audio.js` — synthesised WebAudio effects, no audio files.
- `game/src/shots.js` — the deterministic screenshot scenes (`?shot=start|play|hint|win`, `&round=1|2|3`).
- `main.ts` — the hand-in program; `vendor/makefun-game.ts` is the kit's copy, unchanged.
- `screenshots/` — four real renders of the game's own code: mid-hunt (cover), title, hint, and round-clear.

## Screenshots

| File | Shows |
|---|---|
| `1-play.jpg` (cover) | Mid-hunt: 3 differences found and ringed, 4 still hidden, counter "Found 3/7 · 4 left", 47s on the timer |
| `2-start.jpg` | The title screen over the Dusk Market scene |
| `3-hint.jpg` | A hint ringing the still-hidden middle lantern, 2 found, 1 strike |
| `4-win.jpg` | Round clear: all 7 found, 3 stars, score and next-round button |

## License

MIT — see [LICENSE](LICENSE).
