# 06 · Carrie Invaders (space-shooter style)

Robot vacuums from space march down on the night garden; Carrie throws tennis balls and hides behind haystacks.
Own pixel art; Carrie's sprites, the pixel helpers and the 5×7 font come from Super Carrie (`../05-super-carrie/src/10-gfx.js`, included by `build.py`).

- `shell.html` + `src/50-invaders.js`; `python3 build.py` → `carrie-invaders.html`; `python3 ../publish.py carrie-invaders` → `/herna/carrie-invaders/`.
- Internal 224 × 256 screen (upright like the arcade cabinets), fixed 60 Hz.
- Formation 5 × 11: drone (30), robot vacuum (20, two rows), canister vacuum with hose (10, two rows). Classic ripple march: one invader moves per frame, so they speed up as they thin out; the last one moves 3 px.
- Up to 2–3 enemy shots (dust zigzag, soap bubble, shampoo drop), aimed at Carrie's column ~45 % of the time. One tennis ball at a time; holding fire throws again automatically.
- 4 haystack shields (pixel masks, chewed by shots and by invaders). Bath-tub drone every ~25 s for 50–300 points. Extra life at 1 500.
- Waves start 8 px lower each time (up to 5 steps). Vacuums reaching the grass = game over.
- Touch: ◀ ▶ and HOD, or put a finger on the game (Carrie runs there and keeps throwing).
- Best score: `carrie-invaders-best`. Debug hook `window.__ci`.
