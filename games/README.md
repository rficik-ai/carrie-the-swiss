# Carriina herňa (games)

Games for the future arcade section of carrietheswiss.com. Not part of the site build yet:
nothing here is copied to `dist/`, so pushing does not publish them.

| # | Game | Status |
|---|------|--------|
| 01 | Flappy Carrie (Flappy-style, book stacks, show grades) | live at /herna/flappy-carrie/ (was „Lietajúca Carrie“) |
| 02 | Carrie Surfer (Subway Surfers style, village road, bath escape) | live at /herna/carrie-surfer/ (was „Carrie uteká“) |
| 03 | Carrieman (Pac-Man style, garden maze, robot vacuums) | live at /herna/carrieman/ (was „Carrie a vysávače“) |
| 04 | Carrie – pexeso (memory, real photos of Carrie) | live at /herna/pexeso/ |
| 05 | Super Carrie (8-bit platformer, own world and levels; world 1 = 1-1 to 1-4) | live at /herna/super-carrie/ |
| 06 | Carrie Invaders (space-shooter style: robot vacuums from space, haystack shields, bath-tub drone) | live at /herna/carrie-invaders/ |
| 07 | Carrie Bounce (brick breaker: Carrie with a cushion, hay bales, 8 picture levels) | live at /herna/carrie-bounce/ |
| 08 | Carrie Jump (endless jumper: clouds up to the stars) | live at /herna/carrie-jump/ |

Each game is one self-contained HTML file (`build.py` embeds the art as data URIs).
Later: an arcade page that lists the games and a shared high-score table.

Sound: `shared/sound.js` is pasted into every game. Music = Carrie's own songs from `/assets/music/` (the same track the visitor picked in the website's music player, key `carrie-music`), effects synthesised; on/off shared by all games (`carrie-game-sound`), iOS silent switch handled with `navigator.audioSession.type = 'playback'`. Previews outside the website fall back to a synth tune.
