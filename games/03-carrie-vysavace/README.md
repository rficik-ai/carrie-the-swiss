# 03 · Carrie a vysávače (Pac-Man style)

Garden maze, 28 × 24 tiles in the proportions of the arcade classic (own layout, `maze2.py` checks symmetry, no dead ends, all granules reachable).

- Carrie = head token (GPT Image 2.5 job 5a13799a: mouth open / closed). Robot vacuums: job eef6923d, ring tinted red / pink / cyan / orange (`prep.py`). Hedge texture: job a53018c9.
- Arcade rules: speeds as % of 10.5 tiles/s (level 1 Carrie 80 %, vacuums 75 %, tunnel 40 %, frightened 50 %, Carrie 90 % while they are frightened, slight slowdown on each granule), scatter/chase timers 7/20/7/20/5/20/5/∞, frightened time by level (6 s → 0), white flashing before it ends, chain 200/400/800/1600 with a short freeze, red speeds up near the end of a level, house release by dot counters + 4 s timeout, fruit after 70 and 170 granules, extra life at 10 000.
- Turning: buffered and with cornering (a turn can start up to ~0.45 tile before the centre of a crossing), like the arcade.
- Hedges drawn slimmer than their tiles with a glowing rim so paths read wide; maze flashes white on a cleared level.
- Controls: arrows / WASD, swipe, and a direction pad under the maze on phones held upright.
- Score: granule 10, bone 50. Best: localStorage `carrie-pac-best`.
