# 02 · Carrie Surfer (Subway Surfers style, formerly Carrie uteká)

Carrie runs down a Slovak village road at golden hour, away from bath time. Three lanes.

- Controls: ← → change lane, ↑ / Space jump, ↓ slide (dive when in the air); phone: swipe; desktop click = jump. P pause, M sound.
- Obstacles: fence + hay bale (jump), clothesline with sheets (slide), hay wagon (change lane, or run up a plank ramp onto its roof; from 600 m some roll towards you with a lantern).
- Moving: geese crossing the road (from ~280 m, jump), rolling barrels (from ~500 m), rolling wagons. Tunnel through a hill every 650–950 m (from ~420 m), 70–110 m long, lamps inside.
- Speed 10 → 26 m/s over ~2.5 km, toasts at 14/18/22 m/s; music tempo follows speed.
- Side bump into an obstacle = stumble (soap bubbles come close); a second stumble within ~5 s = caught.
- Bone +1, golden bone +5. Boosters every 150–240 m: rosette = one-hit shield, sausage = 10 s magnet, balloons = 7 s flight with a bone trail, springs = 10 s high jump (reach wagon roofs), golden collar = 12 s double bones. Points = metres + 5 × bones.
- Published at /herna/carrie-utekaj/ (`python3 ../publish.py carrie-utekaj` after `build.py`). Arcade index: public/herna/index.html.
- Titles by distance: 0 Okúpaná hneď pri dverách · 300 Utiekla za roh · 800 Sused ju videl utekať · 1600 Hrdinka dediny · 3000 Kúpanie odložené · 5000 Legenda bez kúpeľa.
- Sprites: Higgsfield GPT Image 2.5 job bed21645-2378-4f62-9a75-4b8b03459ff6 (rear view sheet, refs 642c794e back 3/4, 831b5cd4 side, cf4ba6f4 standing) → `extract_sprites.py` → `assets/*.webp`.
- `python3 build.py` → `carrie-utekaj.html` (single file).

- v3 (2026-11-02, Rob's notes): tunnel drawn as one smooth piece (no flickering colour bands) with ribs and lamps that stream past; tunnel portal set into a green hill; long objects passing the camera are drawn by their nearest point (fence no longer shows through the hay); ramp drawn after its wagon (no longer vanishes while climbing); geese are painted sprites (GPT Image 2.5 jobs c9d6e633 / c2f94b97 on chroma green → `assets/goose*.webp`).
- v4 (2026-11-02, Rob: "make the road, houses, fence and things on the road better via Higgsfield"): painted assets from GPT Image 2.5, keyed from magenta / made seamless by `prepare_assets.py` → `assets/tex/`.
  Sprites: hay bale ed7b97e7, fence 799a3dd1, barrel 5ea22e68, apple tree c74df7af, linden 11c6da5f, bush c22ca814, sunflowers 4f8a8e55, haystack 5c030640, clothesline (single sheet) e6b82013.
  Textures: dirt road 3f994a2f, meadow 5f7bd97c, roof tiles 9cc31185, house walls 750cc69e / 360cb28c, gable 3146ec19, hay aada69b1, wood planks 32887997.
  Road and meadow are drawn band by band with pattern transforms (perspective); walls, roofs, wagon sides/tops and ramps use thin affine strips; fronts (gables, wagon ends, sheet) are exact.
