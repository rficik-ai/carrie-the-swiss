# 02 · Carrie uteká (Subway Surfers style)

Carrie runs down a Slovak village road at golden hour, away from bath time. Three lanes.

- Controls: ← → change lane, ↑ / Space jump, ↓ slide (dive when in the air); phone: swipe; desktop click = jump. P pause, M sound.
- Obstacles: fence + hay bale (jump), clothesline with sheets (slide), hay wagon (change lane; from 600 m some roll towards you with a lantern).
- Side bump into an obstacle = stumble (soap bubbles come close); a second stumble within ~5 s = caught.
- Bone +1, golden bone +5; rosette = one-hit shield; sausage = 10 s bone magnet. Points = metres + 5 × bones.
- Titles by distance: 0 Okúpaná hneď pri dverách · 300 Utiekla za roh · 800 Sused ju videl utekať · 1600 Hrdinka dediny · 3000 Kúpanie odložené · 5000 Legenda bez kúpeľa.
- Sprites: Higgsfield GPT Image 2.5 job bed21645-2378-4f62-9a75-4b8b03459ff6 (rear view sheet, refs 642c794e back 3/4, 831b5cd4 side, cf4ba6f4 standing) → `extract_sprites.py` → `assets/*.webp`.
- `python3 build.py` → `carrie-utekaj.html` (single file).
