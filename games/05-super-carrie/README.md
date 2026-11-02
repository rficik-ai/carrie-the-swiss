# 05 · Super Carrie (8-bit platformer)

Retro side-scroller in the spirit of the 8-bit classics, with an own world, own pixel art and own level layouts.
Everything is drawn in code (`src/10-gfx.js`), so the game is one HTML file without images (~112 KB).

- `shell.html` – page, cards, touch controls; `src/*.js` – code in order: gfx, levels, engine, main.
- `python3 build.py` → `super-carrie.html`; `python3 ../publish.py super-carrie` → `/herna/super-carrie/`.
- Internal 256 × 240 screen, fixed 60 Hz steps, scaled with crisp pixels. Physics in px/frame (walk 1.56, run 2.56, jump 4.2 / 5.1 with lighter gravity while the button is held).
- Saves: `carrie-mario-best` (high score), `carrie-mario-reached` (furthest level, offered as "Pokračovať od …").
- Debug hook: `window.__sc` (G, P, newGame, startLevel, setPower …).

## Carrie's world (the alternative for every classic element)

| Classic element | In Super Carrie | Status |
|---|---|---|
| hero | Carrie (small puppy, big dog) | world 1 |
| mushroom | klobása (sausage) – Carrie grows | world 1 |
| fire flower / fireballs | tenisová loptička – big Carrie throws bouncing tennis balls (Shift / B) | world 1 |
| star | zlatý obojok (golden collar) – invincible for a while | world 1 |
| 1-UP mushroom | zelená kosť (green bone) | world 1 |
| coin | zlatá granula (golden kibble), 100 = life | world 1 |
| ? block / brick / hidden block / hard block | krabica s kostičkou / balík sena / skrytá krabica / drevená debna | world 1 |
| pipe / warp pipe / piranha plant | dutý peň (hollow stump), enter with ↓ / lasica (weasel) | world 1 |
| goomba | robotický vysávač | world 1 |
| koopa + shell | ježko – curls into a spiky ball you can kick | world 1 |
| paratroopa | ježko s balónikom | world 1 |
| podoboo / firebar / lava | mydlová bublina / bublinková tyč / horúca pena | world 1 |
| Bowser / axe / bridge | Kráľ Vysávač / zátka od vane (bath plug) / mostík | world 1 |
| toad ("princess in another castle") | šteniatko kamarát: „Ďakujem, Carrie! Ale rozeta BIS je na inom výstavisku!" | world 1 |
| flagpole / castle | rozeta na stĺpe / výstavný stan | world 1 |
| lifts / mushroom platforms | drevené dosky / koruny stromov | world 1 |
| hills, bushes, clouds | Alpy, kríky s jablkami, kopky sena, ploty, obláčiky | world 1 |
| bullet bill | frisbee z vrhačky | planned (world 2) |
| cheep cheep | skákajúce kapry pri mostíku | planned (world 2) |
| lakitu + spiny | vrana na obláčiku hádže pichľavé gaštany | planned (world 2) |
| springboard | pružinka | planned (world 2) |
| beanstalk / coin heaven | vodítko do granulového neba | planned (world 2) |
| hammer bro | mačka hádže klbká | planned (world 3) |
| princess | rozeta BIS (víťazný pohár) | planned (final level) |

## Levels

- 1-1 Záhrada – boxes, stumps, weasel, bonus cellar under the stump at col 60 (exit via stump at col 133), terrace, staircases, pole, tent.
- 1-2 Pivnica – ceiling of hay bales, crate steps, brick tunnel with hidden 1UP, weasel stumps, vertical lifts over a pit, sideways stump to a short garden with the pole.
- 1-3 Koruny stromov – one-way treetops, balloon hedgehogs, horizontal and vertical lifts.
- 1-4 Kúpeľňa – foam pits with soap bubbles, bubble bars, low corridors, King Vacuum on the bridge, bath plug, puppy friend.
- Planned: worlds 2–3 (2-1 Dedina, 2-2 Mostík pri rybníku, 2-3 Hory, 3-1 Noc na dvore, 3-2 Seník, 3-3 Veľká kúpeľňa) = 10 levels.
