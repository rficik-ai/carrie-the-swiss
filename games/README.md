# Carriina herňa (games)

Games for the future arcade section of carrietheswiss.com. Not part of the site build yet:
nothing here is copied to `dist/`, so pushing does not publish them.

| # | Game | Status |
|---|------|--------|
| 01 | Lietajúca Carrie (Flappy-style, book stacks, show grades) | approved by Rob 2026-11-02, live at /herna/lietajuca-carrie/ |
| 02 | Carrie uteká (Subway Surfers style, village road, bath escape) | live 2026-11-02 at /herna/carrie-utekaj/ |
| 03 | Carrie a vysávače (Pac-Man style, garden maze, robot vacuums) | live 2026-11-02 at /herna/carrie-a-vysavace/ |
| 04 | Carriino pexeso (memory, real photos of Carrie) | live 2026-11-02 at /herna/pexeso/ |

Each game is one self-contained HTML file (`build.py` embeds the art as data URIs).
Later: an arcade page that lists the games and a shared high-score table.

Sound: `shared/sound.js` is pasted into every game. Music = Carrie's own songs from `/assets/music/` (the same track the visitor picked in the website's music player, key `carrie-music`), effects synthesised; on/off shared by all games (`carrie-game-sound`), iOS silent switch handled with `navigator.audioSession.type = 'playback'`. Previews outside the website fall back to a synth tune.
