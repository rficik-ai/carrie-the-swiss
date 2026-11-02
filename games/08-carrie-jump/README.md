# 08 · Carrie Jump (endless jumper)

Carrie jumps from cloud to cloud, from the garden up past sunset and the night to the stars and the Moon.
Own pixel art; Carrie, items, enemies and the font come from Super Carrie, sound/fit/loop from `../shared/retro-kit.js`.

- `shell.html` + `src/70-jump.js`; `python3 build.py` → `carrie-jump.html`; `python3 ../publish.py carrie-jump` → `/herna/carrie-jump/`.
- 192 × 320 upright screen, 10 px = 1 m. Jump −7.2 px/frame (≈ 10 m), spring −12, gravity 0.25; screen wraps left/right.
- Clouds: white, blue (moving, from 30 m), pink bubble (one bounce, from 90 m), grey rain cloud (breaks, decoy, from 40 m). Gaps grow with height (max ≈ 9 m, always reachable).
- Items: pružinka (big jump), balóniky (fly up ~2.5 s), zlaté granule; every 20 granules = rescue balloon (max 3) that saves Carrie once when she falls.
- Enemies from 70 m: flying robot vacuum (side to side) and balloon hedgehog (bobbing) — jump on them or throw a tennis ball (space / HOD).
- Sky changes with height: day → sunset (1 600 m) → dusk → night (3 500 m) → space (5 000 m); flags every 1 000 m, dashed line at your best height, the Moon at 4 200 m.
- Ranks: 0 Na dvore · 300 Nad strechou · 1000 V oblakoch · 2500 Pri lietadlách · 4000 Medzi hviezdami · 6000 Na Mesiaci. Best: `carrie-jump-best` (metres). Debug `window.__cj`.
