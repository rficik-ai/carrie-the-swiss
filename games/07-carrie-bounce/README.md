# 07 · Carrie Bounce (brick-breaker style)

Carrie carries a cushion on her back and bounces a tennis ball into walls of hay bales, crates and boxes.
Own pixel art; Carrie's sprites, items and the font come from Super Carrie (`../05-super-carrie/src/10-gfx.js`), sound/fit/loop from `../shared/retro-kit.js`.

- `shell.html` + `src/60-bounce.js`; `python3 build.py` → `carrie-bounce.html`; `python3 ../publish.py carrie-bounce` → `/herna/carrie-bounce/`.
- 224 × 256 screen, 13 × 16 px columns, bricks 16 × 12 so the picture levels read well.
- Bricks: hay 10, hedge 20, bath tile 30, pink flowers 40, barn red 50, black 20 / tan 30 / white 10 (Carrie's colours), crate 100 (two hits), stone (unbreakable), box 50 (always drops a treat).
- Treats: klobása = wider cushion (20 s), tenisové loptičky = three balls, zlatý obojok = ball flies through hay (8 s), zelená kosť = life. Other bricks drop a treat 6 % of the time.
- Angle depends on where the ball lands on the cushion; speed 2.3 px/frame + 0.1 per level, +0.012 per brick, max 4.
- 8 picture levels (Prvé seno, Kostička, Carrie, Srdce, Alpy, Rozeta BIS, Psia búda, Kúpeľňa), then they repeat faster. Lives at 3 000 / 8 000 / 15 000 / 25 000.
- Controls: mouse or finger on the game moves Carrie, click / tap / space throws; arrows; gamepad.
- Best: `carrie-bounce-best`. Debug `window.__cb`.
