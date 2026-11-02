# 01 · Lietajúca Carrie

Flappy-style game. Tap / click / Space flaps Carrie's ears; fly through gaps in stacks of books.

- `game.tpl.html` – source; `python3 build.py` → `lietajuca-carrie.html` (single file, ~97 KB).
- `assets/carrie.png` – flying sprite (Higgsfield GPT Image job 29ace462-f28a-45ab-9eb8-380e160b237f, white bg removed).
- `cut_ears.py` – cuts the sprite into body + two ears (pivots L 192,80 / R 284,50) → `assets/*.webp`.
- Scoring: stack +1, bone +1, golden bone +5, rosette = one-hit shield. Moving stacks from stack 8.
- Grades: 0 Trieda dorastu · 5 VN1 · 12 V1 · 20 V1 CAJC · 30 BOB · 45 BIS.
- Sky cycle: sunset → night → dawn → day (9200 units ≈ 35 stacks).
- Best score: localStorage `carrie-flappy-best` (per browser). Shared leaderboard comes with the arcade.
