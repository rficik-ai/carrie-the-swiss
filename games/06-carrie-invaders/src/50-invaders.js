  // =====================================================================================
  // Carrie Invaders: robot vacuums from space march down on the garden; Carrie throws tennis balls.
  // Own pixel art (Carrie and the font come from Super Carrie), classic rules of the arcade genre.
  // =====================================================================================
  const VW = 224, VH = 256;
  const GROUND = 235, CARRIE_Y = 219, SHIELD_Y = 184, LAND_Y = 216;
  const POINTS = [30, 20, 10];

  // ---------- invaders: drone (top row), robot vacuum (two rows), hose vacuum (two rows); two marching frames each
  const INV = {};
  function buildInvaders() {
    const pal = (l, g) => ({ l, g, k: '#181818', w: '#fcfcfc', r: '#f83800', y: '#f8b800' });
    const D = pal('#f878f8', '#a8509c'), V = pal('#bcbcbc', '#6c6c6c'), H = pal('#58d854', '#1c8c34');
    INV[0] = [
      mk('dr1', ['kk......kk', '..k....k..', '...llll...', '..llllll..', '.llwllwll.', '.llkllkll.', '..g.gg.g..', '.g......g.'], D),
      mk('dr2', ['..kk..kk..', '..k....k..', '...llll...', '..llllll..', '.llwllwll.', '.llkllkll.', '..g.gg.g..', '..g....g..'], D),
    ];
    INV[1] = [
      mk('va1', ['.....rr.....', '...llllll...', '.llllllllll.', 'llkkllllkkll', 'llllwllwllll', 'gggggggggggg', '.g.g....g.g.', 'g..........g'], V),
      mk('va2', ['.....yy.....', '...llllll...', '.llllllllll.', 'llkkllllkkll', 'llllwllwllll', 'gggggggggggg', '..g.g..g.g..', '.g........g.'], V),
    ];
    // canister vacuum with a waving hose
    const Hk = { ...H, k: '#1c5c2c' };
    INV[2] = [
      mk('ho1', ['..kk........', '.k..k.......', '.k...llllll.', '..k.llllllll', '...kllwllwll', '....llkllkll', '....gggggggg', '.....g....g.'], Hk),
      mk('ho2', ['.kk.........', 'k..k........', 'k....llllll.', '.k..llllllll', '..kkllwllwll', '....llkllkll', '....gggggggg', '....g....g..'], Hk),
    ];
    INV.boom = mk('boom', ['...y....y...', 'y...y..y...y', '.y..yyyy..y.', '...yowwoy...', 'yy.yowwoy.yy', '...yyyyyy...', '.y..y..y..y.', 'y..y....y..y'], { y: '#f8b800', o: '#f87800', w: '#fcfcfc' });
    // the bath-tub drone that flies across the top now and then
    const U = painter(26, 15);
    U.rect(2, 0, 7, 1, '#bcbcbc'); U.rect(17, 0, 7, 1, '#bcbcbc'); U.rect(5, 1, 1, 2, '#4a4a4a'); U.rect(20, 1, 1, 2, '#4a4a4a');
    U.rect(4, 3, 18, 3, '#f878f8'); U.set(8, 4, '#fcfcfc'); U.set(17, 4, '#fcfcfc'); U.rect(12, 6, 1, 2, '#4a4a4a');
    U.ellipse(13, 11, 10, 3.2, '#fcfcfc'); U.rect(3, 8, 21, 3, '#fcfcfc'); U.rect(4, 9, 19, 1, '#3cbcfc'); U.set(5, 14, '#f8b800'); U.set(21, 14, '#f8b800');
    U.ellipse(8, 7, 1.4, 1.4, '#c4e4fc'); U.ellipse(17, 6.5, 1.8, 1.8, '#c4e4fc');
    U.outline('#181818');
    INV.ufo = U.canvas();
  }

  // ---------- haystack shields (pixel masks that get chewed away)
  const SHW = 24, SHH = 16;
  function makeShield(x) {
    const mask = new Uint8Array(SHW * SHH), col = new Array(SHW * SHH);
    for (let y = 0; y < SHH; y++) for (let x2 = 0; x2 < SHW; x2++) {
      const dx = (x2 - 11.5) / 12, dy = (y - 15) / 15, dome = dx * dx + dy * dy <= 1;
      const arch = y >= 11 && Math.abs(x2 - 11.5) < 4 - (15 - y) * 0.4;
      if (dome && !arch) { mask[y * SHW + x2] = 1; const n = (x2 * 7 + y * 13) % 11; col[y * SHW + x2] = n === 0 ? '#a87818' : n === 5 ? '#f8d878' : '#e8b838'; }
    }
    const s = { x, y: SHIELD_Y, mask, col, cv: canvas(SHW, SHH), dirty: true };
    return s;
  }
  function drawShield(s) {
    if (s.dirty) {
      const g = s.cv.getContext('2d'); g.clearRect(0, 0, SHW, SHH);
      for (let i = 0; i < s.mask.length; i++) if (s.mask[i]) { g.fillStyle = s.col[i]; g.fillRect(i % SHW, Math.floor(i / SHW), 1, 1); }
      s.dirty = false;
    }
    sg.drawImage(s.cv, s.x, s.y);
  }
  // does a rectangle touch hay? returns the first hit pixel in shield coordinates
  function shieldHit(s, x, y, w, h) {
    const x0 = Math.max(0, Math.floor(x - s.x)), x1 = Math.min(SHW - 1, Math.floor(x + w - 1 - s.x)), y0 = Math.max(0, Math.floor(y - s.y)), y1 = Math.min(SHH - 1, Math.floor(y + h - 1 - s.y));
    for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) if (s.mask[yy * SHW + xx]) return [xx, yy];
    return null;
  }
  function chew(s, cx, cy, r = 3) {
    for (let yy = cy - r; yy <= cy + r; yy++) for (let xx = cx - r; xx <= cx + r; xx++) {
      if (xx < 0 || yy < 0 || xx >= SHW || yy >= SHH) continue;
      const d = Math.hypot(xx - cx, yy - cy); if (d <= r && (d < 1.5 || Math.random() < 0.7)) s.mask[yy * SHW + xx] = 0;
    }
    s.dirty = true;
  }

  // ---------- state
  const G = { state: 'title', score: 0, best: 0, lives: 3, wave: 1, frame: 0, timer: 0, extra: false, fireT: 60, ufoT: 0, march: 0 };
  const P = { x: 104, w: 14, face: 1, anim: 0, vx: 0, target: null };
  let ball = null, inv = [], invIdx = 0, invDir = 1, goDown = false, landed = false, shots = [], ufo = null, booms = [], pops = [], shields = [];
  const stars = Array.from({ length: 70 }, (_, i) => ({ x: (i * 97) % VW, y: 24 + ((i * 53) % 150), p: i % 7 }));
  const INPUT = { left: false, right: false, fire: false };

  function spawnWave() {
    inv = [];
    const top = 52 + Math.min(5, G.wave - 1) * 8;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 11; c++) {
      const type = r === 0 ? 0 : r < 3 ? 1 : 2, w = type === 0 ? 10 : 12;
      inv.push({ type, r, c, x: 24 + c * 16 + (12 - w) / 2, y: top + r * 16, w, h: 8, f: 0, alive: true });
    }
    inv.sort((a, b) => b.r - a.r || a.c - b.c);   // bottom row first, like the arcade: the march ripples upwards
    invIdx = 0; invDir = 1; goDown = false; landed = false; shots = []; ball = null; ufo = null; G.ufoT = 0; G.fireT = 90;
    shields = [0, 1, 2, 3].map((i) => makeShield(26 + i * 50));
  }
  function newGame() {
    if (soundWanted() && !audio.isOn) toggleSound();
    unlockSession();
    G.score = 0; G.lives = 3; G.wave = 1; G.extra = false; P.x = 104; P.target = null; booms = []; pops = [];
    spawnWave(); G.state = 'ready'; G.timer = 120;
    showCard(null); $('pauseBtn').hidden = false; document.body.classList.add('playing'); music(0.03); cv.focus({ preventScroll: true });
  }
  const alive = () => inv.filter((v) => v.alive);
  function addScore(n) {
    G.score += n;
    if (!G.extra && G.score >= 1500) { G.extra = true; G.lives++; sfx('life'); pops.push({ x: 20, y: 236, text: '+1 ŽIVOT', t: 0 }); }
  }

  // ---------- one frame
  function step() {
    G.frame++;
    for (const b of booms) b.t++; booms = booms.filter((b) => b.t < (b.kind === 'carrie' ? 90 : 16));
    for (const p of pops) p.t++; pops = pops.filter((p) => p.t < 60);
    if (G.state === 'ready') { movePlayer(); if (--G.timer <= 0) G.state = 'play'; return; }
    if (G.state === 'hit') { if (--G.timer <= 0) { if (G.lives > 0) { G.state = 'play'; P.x = 104; } else gameOver(); } return; }
    if (G.state === 'clear') { movePlayer(); if (--G.timer <= 0) { G.wave++; spawnWave(); G.state = 'ready'; G.timer = 100; } return; }
    if (G.state !== 'play') return;
    movePlayer();
    // tennis ball (one at a time; holding fire throws again as soon as it lands)
    if (INPUT.fire && !ball) { ball = { x: P.x + P.w / 2 - 2, y: CARRIE_Y - 4 }; sfx('shot'); }
    if (ball) {
      ball.y -= 4;
      if (ball.y < 26) { booms.push({ x: ball.x - 4, y: 24, t: 0, kind: 'small' }); ball = null; }
    }
    marchStep();
    if (landed) { landedOver(); return; }
    invadersFire();
    moveShots();
    moveUfo();
    collide();
    if (!alive().length && G.state === 'play') { G.state = 'clear'; G.timer = 110; sfx('clear'); }
  }
  function movePlayer() {
    let dir = (INPUT.right ? 1 : 0) - (INPUT.left ? 1 : 0);
    if (P.target != null && !dir) { const d = P.target - (P.x + P.w / 2); if (Math.abs(d) > 2) dir = Math.sign(d); }
    P.vx = dir * 1.5; P.x = Math.max(8, Math.min(VW - 8 - P.w, P.x + P.vx));
    if (dir) { P.face = dir; P.anim += 0.18; }
  }
  // the classic march: one invader moves per frame, so the fewer are left, the faster they go
  function marchStep() {
    const n = inv.length; let guard = 0;
    while (guard++ <= n && !inv[invIdx].alive) advance();
    const v = inv[invIdx]; if (!v || !v.alive) return;
    const count = alive().length;
    if (goDown) v.y += 8; else v.x += (count === 1 ? 3 : 2) * invDir;
    v.f ^= 1;
    if (v.y + v.h >= LAND_Y) landed = true;
    for (const s of shields) { const hit = shieldHit(s, v.x, v.y, v.w, v.h); if (hit) { for (let yy = 0; yy < SHH; yy++) for (let xx = 0; xx < SHW; xx++) { const X = s.x + xx, Y = s.y + yy; if (X >= v.x && X < v.x + v.w && Y >= v.y && Y < v.y + v.h) s.mask[yy * SHW + xx] = 0; } s.dirty = true; } }
    advance();
  }
  function advance() {
    invIdx++;
    if (invIdx >= inv.length) {
      invIdx = 0;
      if (goDown) goDown = false;
      else { const a = alive(); if (a.some((v) => (invDir > 0 && v.x + v.w >= VW - 6) || (invDir < 0 && v.x <= 6))) { goDown = true; invDir = -invDir; } }
      sfx(['m1', 'm2', 'm1', 'm3'][G.march++ % 4]);
    }
  }
  function invadersFire() {
    if (--G.fireT > 0 || shots.length >= (G.wave < 3 ? 2 : 3)) return;
    G.fireT = Math.max(18, 64 - G.wave * 6) + Math.floor(Math.random() * 40);
    const low = {}; for (const v of alive()) if (!low[v.c] || v.y > low[v.c].y) low[v.c] = v;
    const list = Object.values(low); if (!list.length) return;
    const cx = P.x + P.w / 2;
    const shooter = Math.random() < 0.45 ? list.reduce((a, b) => (Math.abs(b.x + b.w / 2 - cx) < Math.abs(a.x + a.w / 2 - cx) ? b : a)) : list[Math.floor(Math.random() * list.length)];
    const type = Math.floor(Math.random() * 3);
    shots.push({ x: shooter.x + shooter.w / 2 - 1, y: shooter.y + 8, type, vy: [1.3, 1.0, 1.9][type] + Math.min(0.6, G.wave * 0.06), t: 0 });
  }
  function moveShots() {
    for (const s of shots) { s.t++; s.y += s.vy; if (s.type === 1) s.x += Math.sin(s.t / 5) * 0.4; if (s.y > GROUND - 4) { s.gone = true; booms.push({ x: s.x - 5, y: GROUND - 7, t: 0, kind: 'small' }); } }
    shots = shots.filter((s) => !s.gone);
  }
  function moveUfo() {
    G.ufoT++;
    if (!ufo && G.ufoT > 1500 && alive().length >= 8) { const d = Math.random() < 0.5 ? 1 : -1; ufo = { x: d > 0 ? -26 : VW, y: 30, vx: d * 0.8 }; G.ufoT = 0; }
    if (ufo) { ufo.x += ufo.vx; if (G.frame % 10 === 0) sfx('ufo'); if (ufo.x < -30 || ufo.x > VW + 4) ufo = null; }
  }
  const overlap = (ax, ay, aw, ah, bx, by, bw, bh) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  function collide() {
    const shotBox = (s) => (s.type === 1 ? [s.x - 1, s.y, 5, 5] : [s.x, s.y, 3, 7]);
    if (ball) {
      for (const v of inv) if (v.alive && overlap(ball.x, ball.y, 4, 6, v.x, v.y, v.w, v.h)) {
        v.alive = false; addScore(POINTS[v.type]); booms.push({ x: v.x + v.w / 2 - 6, y: v.y, t: 0, kind: 'inv' }); sfx('hit'); ball = null; break;
      }
    }
    if (ball && ufo && overlap(ball.x, ball.y, 4, 6, ufo.x, ufo.y, 26, 15)) {
      const pts = [50, 100, 100, 150, 150, 300][Math.floor(Math.random() * 6)]; addScore(pts);
      pops.push({ x: ufo.x + 2, y: ufo.y + 4, text: String(pts), t: 0 }); booms.push({ x: ufo.x + 7, y: ufo.y + 3, t: 0, kind: 'inv' }); sfx('ufohit'); ufo = null; ball = null;
    }
    if (ball) for (const s of shots) if (overlap(ball.x, ball.y, 4, 6, ...shotBox(s))) { s.gone = true; booms.push({ x: ball.x - 4, y: ball.y - 2, t: 0, kind: 'small' }); ball = null; break; }
    if (ball) for (const sh of shields) { const hit = shieldHit(sh, ball.x, ball.y, 4, 6); if (hit) { chew(sh, hit[0], hit[1], 3); ball = null; break; } }
    for (const s of shots) {
      if (s.gone) continue;
      const [x, y, w, h] = shotBox(s);
      for (const sh of shields) { const hit = shieldHit(sh, x, y, w, h); if (hit) { chew(sh, hit[0], hit[1] + 1, 3); s.gone = true; break; } }
      if (!s.gone && G.state === 'play' && overlap(x, y, w, h, P.x + 1, CARRIE_Y + 3, P.w - 2, 12)) { s.gone = true; playerHit(); }
    }
    shots = shots.filter((s) => !s.gone);
  }
  function playerHit() {
    G.lives--; G.state = 'hit'; G.timer = 110; shots = []; ball = null;
    booms.push({ x: P.x - 1, y: CARRIE_Y, t: 0, kind: 'carrie' }); sfx('die'); try { navigator.vibrate && navigator.vibrate(90); } catch {}
  }
  function landedOver() { G.lives = 0; booms.push({ x: P.x - 1, y: CARRIE_Y, t: 0, kind: 'carrie' }); sfx('die'); G.state = 'hit'; G.timer = 110; G.landed = true; }

  // ---------- drawing
  function render() {
    sg.fillStyle = '#05071a'; sg.fillRect(0, 0, VW, VH);
    for (const s of stars) { if ((G.frame >> 4) % 7 === s.p) continue; sg.fillStyle = s.p % 3 ? '#5c6cb8' : '#c4e4fc'; sg.fillRect(s.x, s.y, 1, 1); }
    sg.fillStyle = '#fce0a8'; sg.beginPath(); sg.arc(198, 46, 9, 0, 7); sg.fill(); sg.fillStyle = '#05071a'; sg.beginPath(); sg.arc(203, 43, 8, 0, 7); sg.fill();
    // ground
    sg.fillStyle = '#00a800'; sg.fillRect(0, GROUND, VW, 3); sg.fillStyle = '#80d010'; for (let x = 0; x < VW; x += 3) sg.fillRect(x, GROUND - 1, 1, 1);
    sg.fillStyle = '#3c2008'; sg.fillRect(0, GROUND + 3, VW, VH - GROUND - 3);
    for (const s of shields) drawShield(s);
    if (G.state !== 'title') {
      for (const v of inv) if (v.alive) sg.drawImage(INV[v.type][v.f], Math.round(v.x), Math.round(v.y));
      if (ufo) sg.drawImage(INV.ufo, Math.round(ufo.x), ufo.y);
      for (const s of shots) drawShot(s);
      if (ball) sg.drawImage(SPR.shot.r, Math.round(ball.x) - 2, Math.round(ball.y) - 1);
      const hitNow = G.state === 'hit';
      if (!hitNow) {
        const moving = Math.abs(P.vx) > 0;
        const pose = moving ? ['walk1', 'walk2', 'walk3', 'walk2'][Math.floor(P.anim) % 4] : ball && ball.y > CARRIE_Y - 30 ? 'jump' : 'stand';
        sg.drawImage(P.face > 0 ? SPR['cs_' + pose + '_normal'].r : SPR['cs_' + pose + '_normal'].l, Math.round(P.x - 1), CARRIE_Y);
      }
    } else {
      // title backdrop: a few invaders bobbing
      for (let i = 0; i < 3; i++) sg.drawImage(INV[i][(G.frame >> 5) & 1], 80 + i * 24, 120 + Math.round(Math.sin(G.frame / 30 + i) * 3));
    }
    for (const b of booms) {
      if (b.kind === 'carrie') { if (b.t < 90) { sg.drawImage(SPR.cs_die.r, Math.round(b.x), CARRIE_Y + Math.min(4, b.t / 4)); for (let i = 0; i < 3; i++) { const a = G.frame / 8 + i * 2.1; sg.fillStyle = '#f8b800'; sg.fillRect(Math.round(b.x + 7 + Math.cos(a) * 8), Math.round(CARRIE_Y + Math.sin(a) * 3), 2, 2); } } }
      else if (b.kind === 'inv') sg.drawImage(INV.boom, Math.round(b.x), Math.round(b.y));
      else { sg.fillStyle = '#fcfcfc'; for (let i = 0; i < 6; i++) { const a = i * 1.05; sg.fillRect(Math.round(b.x + 5 + Math.cos(a) * b.t * 0.4), Math.round(b.y + 4 + Math.sin(a) * b.t * 0.4), 1, 1); } }
    }
    for (const p of pops) text(sg, p.text, Math.round(p.x), Math.round(p.y - p.t * 0.2), '#f8b800', 'left', '#000');
    // HUD
    text(sg, 'SKÓRE', 10, 6, '#fcfcfc'); text(sg, String(G.score).padStart(5, '0'), 10, 15, '#fcfcfc');
    text(sg, 'REKORD', 112, 6, '#fcfcfc', 'center'); text(sg, String(Math.max(G.best, G.score)).padStart(5, '0'), 112, 15, '#f8b800', 'center');
    text(sg, 'VLNA', 214, 6, '#fcfcfc', 'right'); text(sg, String(G.wave), 214, 15, '#fcfcfc', 'right');
    const reserve = Math.max(0, G.lives - (G.state === 'hit' ? 0 : 1));
    if (G.state !== 'title') { for (let i = 0; i < Math.min(reserve, 6); i++) sg.drawImage(SPR.cs_stand_normal.r, 8 + i * 18, GROUND + 3, 16, 16); text(sg, '×' + G.lives, 216, GROUND + 9, '#fcfcfc', 'right'); }
    if (G.state === 'ready') { text(sg, 'VLNA ' + G.wave, 112, 140, '#fcfcfc', 'center', '#000'); if ((G.frame >> 4) & 1) text(sg, 'PRIPRAVENÁ!', 112, 154, '#f8b800', 'center', '#000'); }
    if (G.state === 'clear') text(sg, 'ZÁHRADA JE ČISTÁ!', 112, 140, '#f8b800', 'center', '#000');
    if (G.state === 'over') text(sg, G.landed ? 'VYSÁVAČE PRISTÁLI' : 'KONIEC HRY', 112, 140, '#f83800', 'center', '#000');
  }
  function drawShot(s) {
    const x = Math.round(s.x), y = Math.round(s.y);
    if (s.type === 0) { sg.fillStyle = '#bcbcbc'; for (let i = 0; i < 7; i++) sg.fillRect(x + ((i + (s.t >> 2)) % 3 === 1 ? 1 : (i + (s.t >> 2)) % 3 === 2 ? 2 : 0), y + i, 1, 1); }
    else if (s.type === 1) { sg.fillStyle = '#3cbcfc'; sg.fillRect(x, y, 3, 1); sg.fillRect(x - 1, y + 1, 1, 3); sg.fillRect(x + 3, y + 1, 1, 3); sg.fillRect(x, y + 4, 3, 1); sg.fillStyle = '#fcfcfc'; sg.fillRect(x, y + 1, 1, 1); }
    else { sg.fillStyle = '#f878a8'; sg.fillRect(x + 1, y, 1, 2); sg.fillRect(x, y + 2, 3, 4); sg.fillStyle = '#fcfcfc'; sg.fillRect(x, y + 3, 1, 1); }
  }

  // =====================================================================================
  // Sound, screen, input, menus
  // =====================================================================================
  const TRACK = makeTrack('suspense');
  const audio = (() => {
    let ac = null, on = false, master, noiseBuf, curLevel = 0;
    function ensure() {
      if (ac) return true; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ac = new AC(); master = ac.createGain(); master.gain.value = 0.8; master.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return true;
    }
    function tone(f0, f1, dur, type = 'square', vol = 0.05, when = 0) {
      if (!on) return; const t = ac.currentTime + when, o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
    }
    function noise(dur, vol = 0.08, hp = 600) {
      if (!on) return; const t = ac.currentTime, s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
      s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + dur + 0.02);
    }
    const seq = (notes, len, type = 'square', vol = 0.045) => notes.forEach((f, i) => f && tone(f, f, len * 0.9, type, vol, i * len));
    const FX = {
      shot: () => tone(700, 1300, 0.07, 'square', 0.03), hit: () => { noise(0.12, 0.08, 900); tone(420, 120, 0.12, 'square', 0.04); },
      m1: () => tone(131, 123, 0.07, 'triangle', 0.14), m2: () => tone(147, 139, 0.07, 'triangle', 0.14), m3: () => tone(110, 104, 0.09, 'triangle', 0.16),
      ufo: () => tone(880, 1180, 0.14, 'sine', 0.025), ufohit: () => seq([1319, 1047, 1568, 1319, 2093], 0.05),
      die: () => { noise(0.5, 0.1, 300); seq([523, 466, 415, 349, 262], 0.1, 'square', 0.04); }, life: () => seq([659, 784, 1319, 1047, 1175, 1568], 0.08),
      clear: () => seq([523, 659, 784, 1047, 0, 784, 1047], 0.1), over: () => seq([523, 0, 392, 0, 330, 262, 196], 0.17, 'triangle', 0.08),
    };
    return {
      get isOn() { return on; },
      toggle() { unlockSession(); if (!ensure()) return false; on = !on; saveSound(on); if (on) { ac.resume(); TRACK.play(curLevel); } else TRACK.stop(); return on; },
      music(level) { curLevel = level; if (on) { if (level > 0) TRACK.play(level); else TRACK.stop(); } },
      fx(n) { if (on && FX[n]) FX[n](); },
      suspend() { TRACK.stop(); if (ac && ac.state === 'running') ac.suspend(); },
      wake() { if (ac && on) { ac.resume(); if (curLevel > 0) TRACK.play(curLevel); } },
    };
  })();
  const sfx = (n) => audio.fx(n), music = (l) => audio.music(l);

  const scr = canvas(VW, VH), sg = scr.getContext('2d');
  const $ = (id) => document.getElementById(id);
  const cv = $('game'), ctx = cv.getContext('2d');
  const touchUI = matchMedia('(pointer: coarse)').matches;
  let cvRect = null;
  function layout() {
    const W = innerWidth, H = innerHeight, portrait = H > W * 1.05;
    const sTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sat')) || 0, ctrlH = touchUI ? 180 : 16;
    let availW = W, availH = H;
    if (portrait) availH = H - 62 - sTop - ctrlH; else { availW = W - (touchUI ? 300 : 0); availH = H - 8; }
    let s = Math.min(availW / VW, availH / VH); if (s >= 2 && Math.floor(s) / s > 0.84) s = Math.floor(s); s = Math.max(1, s);
    const cw = Math.round(VW * s), ch = Math.round(VH * s);
    const top = portrait ? Math.round(62 + sTop + Math.max(0, (H - 62 - sTop - ctrlH - ch) / 2)) : Math.round((H - ch) / 2);
    Object.assign(cv.style, { width: cw + 'px', height: ch + 'px', left: Math.round((W - cw) / 2) + 'px', top: top + 'px' });
    const dpr = Math.min(3, window.devicePixelRatio || 1); cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    document.body.classList.toggle('portrait', portrait); document.body.classList.toggle('touch', touchUI);
    cvRect = null;
  }
  addEventListener('resize', layout);

  const KB = {}, TOUCH = {}, PAD = {};
  const KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'fire', ArrowUp: 'fire', KeyW: 'fire', KeyX: 'fire', KeyK: 'fire', ShiftLeft: 'fire', ShiftRight: 'fire' };
  function combineInput() { for (const k of ['left', 'right', 'fire']) INPUT[k] = !!(KB[k] || TOUCH[k] || PAD[k]); }
  addEventListener('keydown', (e) => {
    const k = KEYS[e.code]; if (k) e.preventDefault();
    if (e.code === 'Escape' || e.code === 'KeyP') { togglePause(); return; }
    if (e.code === 'KeyM') { toggleSound(); return; }
    if ((e.code === 'Enter' || e.code === 'Space') && (G.state === 'title' && !$('start').hidden) && !e.repeat) { e.preventDefault(); newGame(); return; }
    if (k) { KB[k] = true; if (paused && !e.repeat) togglePause(); }
  });
  addEventListener('keyup', (e) => { const k = KEYS[e.code]; if (k) KB[k] = false; });
  addEventListener('blur', () => { for (const o of [KB, TOUCH]) for (const k in o) o[k] = false; P.target = null; });
  // touch: buttons, or put a finger on the game and Carrie runs there and keeps throwing
  for (const b of document.querySelectorAll('[data-k]')) {
    const k = b.dataset.k;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch {} TOUCH[k] = true; b.classList.add('on'); if (paused) togglePause(); });
    for (const ev of ['pointerup', 'pointercancel']) b.addEventListener(ev, () => { TOUCH[k] = false; b.classList.remove('on'); });
  }
  const toGameX = (e) => { cvRect = cvRect || cv.getBoundingClientRect(); return ((e.clientX - cvRect.left) / cvRect.width) * VW; };
  cv.addEventListener('pointerdown', (e) => { if (G.state === 'title') return; e.preventDefault(); if (paused) { togglePause(); return; } try { cv.setPointerCapture(e.pointerId); } catch {} P.target = toGameX(e); TOUCH.fire = true; });
  cv.addEventListener('pointermove', (e) => { if (P.target != null) P.target = toGameX(e); });
  for (const ev of ['pointerup', 'pointercancel']) cv.addEventListener(ev, () => { P.target = null; TOUCH.fire = false; });
  function readPad() {
    const gp = navigator.getGamepads ? [...navigator.getGamepads()].find(Boolean) : null;
    PAD.left = PAD.right = PAD.fire = false; if (!gp) return;
    const b = (i) => gp.buttons[i] && gp.buttons[i].pressed, ax = gp.axes[0] || 0;
    PAD.left = b(14) || ax < -0.4; PAD.right = b(15) || ax > 0.4; PAD.fire = b(0) || b(1) || b(2) || b(3);
    if (G.state === 'title' && (b(9) || b(0)) && !$('start').hidden) newGame();
  }

  const RANKS = [[0, 'Vysávače vyhrali', 'Nabudúce ich Carrie zastaví skôr.'], [800, 'Strážkyňa záhrady', 'Prvé vysávače odleteli s prázdnym vreckom.'],
    [2000, 'Lovkyňa dronov', 'Z oblohy padajú vysávače aj vane.'], [4000, 'Kozmická šampiónka', 'Vysávače si o Carrie rozprávajú po celej galaxii.'], [7000, 'Kráľovná vesmíru', 'Žiadny vysávač sa už neodváži pristáť.']];
  let paused = false;
  try { G.best = Number(localStorage.getItem('carrie-invaders-best')) || 0; } catch {}
  function showCard(id) { for (const c of ['start', 'pause', 'over']) $(c).hidden = c !== id; }
  function gameOver() {
    G.state = 'over'; music(0.015); sfx('over'); $('pauseBtn').hidden = true; document.body.classList.remove('playing');
    const isNew = G.score > G.best; if (isNew) { G.best = G.score; try { localStorage.setItem('carrie-invaders-best', String(G.best)); } catch {} }
    $('bestHud').textContent = G.best;
    let r = RANKS[0]; for (const q of RANKS) if (G.score >= q[0]) r = q;
    setTimeout(() => {
      $('rank').textContent = r[1]; $('rankNote').textContent = r[2]; $('finalScore').textContent = G.score; $('finalWave').textContent = G.wave; $('newBest').hidden = !isNew;
      showCard('over'); $('again').focus({ preventScroll: true });
    }, 1300);
  }
  function togglePause() {
    if (!['play', 'ready', 'clear', 'hit'].includes(G.state) && !paused) return;
    paused = !paused; $('pause').hidden = !paused; music(paused ? 0 : 0.03);
  }
  function toggleSound() { const on = audio.toggle(); $('icoOn').hidden = !on; $('icoOff').hidden = on; $('mute').setAttribute('aria-label', on ? 'Vypnúť zvuk a hudbu' : 'Zapnúť zvuk a hudbu'); if (on && G.state !== 'title' && !paused) music(0.03); }
  $('mute').addEventListener('click', toggleSound);
  $('play').addEventListener('click', newGame); $('again').addEventListener('click', newGame);
  $('resume').addEventListener('click', togglePause); $('pauseBtn').addEventListener('click', togglePause);
  $('quit').addEventListener('click', () => { paused = false; G.state = 'title'; showCard('start'); $('pauseBtn').hidden = true; document.body.classList.remove('playing'); music(0); });
  $('toTitle').addEventListener('click', () => { G.state = 'title'; showCard('start'); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (!paused && ['play', 'ready', 'clear', 'hit'].includes(G.state)) togglePause(); audio.suspend(); } else audio.wake(); last = 0; });
  try { const r = document.referrer && new URL(document.referrer); if (r && r.origin === location.origin && r.pathname !== location.pathname) $('home').href = r.pathname; } catch {}
  function drawLogo() { const lg = $('logo'); lg.width = 96; lg.height = 12; const g = lg.getContext('2d'); text(g, 'CARRIE', 1, 4, '#f8b800', 'left', '#000'); text(g, 'INVADERS', 43, 4, '#f878f8', 'left', '#000'); }
  function fillLegend() {
    const rows = [[INV.ufo, 'Dron s vaňou', '? bodov'], [INV[0][0], 'Dron', '30 bodov'], [INV[1][0], 'Vysávač', '20 bodov'], [INV[2][0], 'Vysávač s hadicou', '10 bodov']];
    const ul = $('legend'); ul.innerHTML = '';
    for (const [c, n, p] of rows) { const li = document.createElement('li'); const img = document.createElement('img'); img.src = c.toDataURL(); img.alt = ''; const b = document.createElement('b'); b.textContent = n; const s = document.createElement('span'); s.textContent = p; li.append(img, b, s); ul.append(li); }
  }

  let last = 0, acc = 0;
  function frame(now) {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    if (!paused) { acc += dt; while (acc >= 1 / 60) { readPad(); combineInput(); step(); acc -= 1 / 60; } }
    render();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(scr, 0, 0, cv.width, cv.height);
    requestAnimationFrame(frame);
  }
  if (touchUI) $('keys').innerHTML = '<b>Prst na obraze</b>: Carrie beží za ním a hádže · alebo <b>◀ ▶</b> a <b>HOD</b>';
  buildGfx(); buildInvaders(); drawLogo(); fillLegend(); spawnWave(); layout(); $('bestHud').textContent = G.best; showCard('start');
  requestAnimationFrame(frame);
  window.__ci = { G, P, INPUT, KB, inv: () => inv, shots: () => shots, shields: () => shields, newGame, step, setUfo: () => { G.ufoT = 99999; } };
