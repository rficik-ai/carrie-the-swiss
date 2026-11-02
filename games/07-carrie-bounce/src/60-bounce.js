  // =====================================================================================
  // Carrie Bounce: Carrie carries a cushion on her back and bounces a tennis ball into walls of hay bales.
  // =====================================================================================
  const VW = 224, VH = 256, TOP = 26, LEFT = 8, RIGHT = 216, PAD_Y = 222, GROUND = 242, BW = 16, BH = 12, BRICK_Y = 34, BALL = 6;
  const PTS = { h: 10, g: 20, t: 30, p: 40, r: 50, k: 20, o: 30, w: 10, c: 100, b: 50, s: 0 };
  const LEVELS = [
    { name: 'Prvé seno', rows: ['.............', 'ppppppppppppp', 'rrrrrrrrrrrrr', 'ttttttttttttt', 'ggggggggggggg', 'hhhhhbhbhhhhh', 'hhhhhhhhhhhhh'] },
    { name: 'Kostička', rows: ['.............', '.hh.......hh.', 'hhhh.....hhhh', 'hhhhhhhhhhhhh', 'hhhhbhhhbhhhh', 'hhhhhhhhhhhhh', 'hhhh.....hhhh', '.hh.......hh.'] },
    { name: 'Carrie', rows: ['.kk.......kk.', 'kkkkkkkkkkkkk', 'kkkokkkkkokkk', 'kkwkkkkkkkwkk', 'kkkkkkkkkkkkk', 'koooowkwooook', '.ooooowwwooo.', '...oowwwoo...', '....wwwww....', '.....rbr.....'] },
    { name: 'Srdce', rows: ['.............', '..ppp...ppp..', '.ppppp.ppppp.', '.ppppppppppp.', '.pppprbrpppp.', '..ppppppppp..', '...ppppppp...', '....ppppp....', '.....ppp.....', '......p......'] },
    { name: 'Alpy', rows: ['...w.....w...', '..www...www..', '.wwwww.wwwww.', '.kkwkk.kkwkk.', 'kkkkkkkkkkkkk', 'kkkbkkkkkbkkk', 'ggggggggggggg', 'gggsggggsgggg', 'hhhhhhhhhhhhh'] },
    { name: 'Rozeta BIS', rows: ['....rrrrr....', '..rrrrrrrrr..', '.rrrwwwwwrrr.', '.rrwwtttwwrr.', '.rrwwtbtwwrr.', '.rrwwtttwwrr.', '.rrrwwwwwrrr.', '..rrrrrrrrr..', '...tt...rr...', '...tt...rr...'] },
    { name: 'Psia búda', rows: ['......r......', '.....rrr.....', '....rrrrr....', '...rrrrrrr...', '..rrrrbrrrr..', '..ccccccccc..', '..cccc.cccc..', '..ccc...ccc..', '..ccc...ccc..', 'sssss...sssss'] },
    { name: 'Kúpeľňa', rows: ['ttttttttttttt', 't.b.......b.t', 't.wwwwwwwww.t', 't.wwwwwwwww.t', 't..wwwwwww..t', 't...s...s...t', 'ttttttttttttt', 'sss.......sss'] },
  ];
  const RANKS = [[0, 'Prvé seno', 'Loptička ešte trochu ušla. Nabudúce ju Carrie chytí.'], [1500, 'Loptičková Carrie', 'Pár balíkov sena už leží na zemi.'],
    [4000, 'Postrach balíkov', 'Seno lieta po celej záhrade.'], [8000, 'Majsterka odrazov', 'Každá loptička sa vráti presne tam, kam má.'], [15000, 'Kráľovná loptičiek', 'Žiadna stena z balíkov sa Carrie neubráni.']];

  // ---------- art: bricks, cushion
  const BR = {};
  function buildBricks() {
    const mkB = (fill, light, dark, deco) => { const P = painter(16, 12); P.rect(0, 0, 16, 12, fill); P.rect(0, 0, 16, 1, light); P.rect(0, 0, 1, 12, light); P.rect(0, 11, 16, 1, dark); P.rect(15, 0, 1, 12, dark); if (deco) deco(P); return P.canvas(); };
    const dots = (P, pts, col) => pts.forEach(([x, y]) => P.set(x, y, col));
    BR.h = mkB('#e8b838', '#f8d878', '#a87818', (P) => { P.rect(4, 1, 1, 10, '#6c3c10'); P.rect(11, 1, 1, 10, '#6c3c10'); dots(P, [[2, 3], [7, 2], [13, 7], [8, 8], [2, 9], [13, 3], [7, 5], [2, 6], [9, 10]], '#a87818'); });
    BR.g = mkB('#00a800', '#80d010', '#005800', (P) => { dots(P, [[3, 2], [7, 6], [11, 3], [13, 8], [5, 8], [9, 2], [2, 5], [12, 10]], '#80d010'); P.set(6, 4, '#d82800'); P.set(10, 8, '#d82800'); });
    BR.t = mkB('#c4e4fc', '#fcfcfc', '#5c8cbc', (P) => { P.rect(8, 1, 1, 10, '#7cacd8'); P.rect(1, 6, 14, 1, '#7cacd8'); P.set(2, 2, '#fcfcfc'); P.set(10, 8, '#fcfcfc'); });
    BR.p = mkB('#f878a8', '#fcc4d8', '#a8305c', (P) => { for (const [x, y] of [[3, 3], [10, 7]]) { P.set(x, y, '#fcfcfc'); P.set(x + 2, y, '#fcfcfc'); P.set(x + 1, y + 1, '#f8b800'); P.set(x, y + 2, '#fcfcfc'); P.set(x + 2, y + 2, '#fcfcfc'); } });
    BR.r = mkB('#c83c18', '#f87850', '#7c1c08', (P) => { P.rect(1, 5, 14, 1, '#7c1c08'); P.rect(5, 1, 1, 4, '#7c1c08'); P.rect(11, 6, 1, 5, '#7c1c08'); });
    BR.k = mkB('#2c2c2c', '#5c5c5c', '#0c0c0c', (P) => { P.set(3, 2, '#7c7c7c'); P.set(4, 2, '#7c7c7c'); P.set(3, 3, '#5c5c5c'); });
    BR.o = mkB('#e0943c', '#f8c070', '#a85c1c', (P) => P.set(3, 2, '#fce0a8'));
    BR.w = mkB('#fcfcfc', '#ffffff', '#bcbcbc', (P) => P.set(3, 2, '#e8f0f8'));
    const brace = (P) => { for (let i = 1; i < 11; i++) { const x = Math.round(1 + i * 1.3); P.set(x, i, '#8c4c10'); P.set(x + 1, i, '#8c4c10'); } };
    BR.c = mkB('#c87c30', '#e09040', '#5c2c00', brace);
    BR.c2 = mkB('#c87c30', '#e09040', '#5c2c00', (P) => { brace(P); dots(P, [[4, 1], [5, 2], [5, 3], [6, 4], [6, 5], [11, 5], [10, 6], [10, 7], [11, 8]], '#181818'); });
    BR.s = mkB('#7c7c7c', '#d8d8d8', '#3c3c3c', (P) => { P.rect(2, 2, 3, 1, '#bcbcbc'); P.set(12, 8, '#4a4a4a'); P.set(2, 8, '#4a4a4a'); P.set(13, 3, '#bcbcbc'); });
    BR.b = mkB('#e09040', '#fce0a8', '#5c2c00', (P) => { P.rect(5, 5, 6, 2, '#fcfcfc'); dots(P, [[4, 4], [4, 7], [11, 4], [11, 7], [3, 5], [3, 6], [12, 5], [12, 6]], '#fcfcfc'); });
    for (const w of [32, 48]) {
      const P = painter(w, 7); for (let x = 1; x < w - 1; x++) for (let y = 0; y < 7; y++) P.set(x, y, Math.floor(x / 4) % 2 ? '#fcfcfc' : '#d82800');
      P.rect(1, 0, w - 2, 1, '#f8b800'); P.set(0, 1, null); P.outline('#181818'); BR['cushion' + w] = P.canvas();
    }
    const P = painter(8, 8); P.ellipse(3.5, 3.5, 3, 3, '#f8b800'); P.set(2, 2, '#fcfcfc'); P.outline('#a85c1c'); BR.goldball = P.canvas();
  }

  // ---------- state
  const G = { state: 'title', score: 0, best: 0, lives: 3, level: 0, loop: 0, frame: 0, timer: 0, nextLife: 0 };
  const PD = { x: 96, w: 32, target: null, wide: 0, through: 0, face: 1, anim: 0, vx: 0 };
  let bricks = [], balls = [], drops = [], parts = [];
  const INPUT = { left: false, right: false, fire: false, firePressed: false };
  const LIFE_AT = [3000, 8000, 15000, 25000];
  const baseSpeed = () => 2.3 + Math.min(10, G.level + G.loop * LEVELS.length) * 0.1;

  function loadLevel() {
    bricks = [];
    const L = LEVELS[G.level];
    L.rows.forEach((row, r) => { for (let c = 0; c < 13; c++) { const t = row[c]; if (t && t !== '.') bricks.push({ x: LEFT + c * BW, y: BRICK_Y + r * BH, t, hp: t === 'c' ? 2 : t === 's' ? 1e9 : 1 }); } });
    drops = []; parts = []; resetBall();
  }
  function resetBall() { PD.wide = 0; PD.through = 0; PD.w = 32; PD.x = Math.max(LEFT, Math.min(RIGHT - PD.w, PD.x)); balls = [{ x: 0, y: 0, vx: 0, vy: 0, sp: baseSpeed(), stuck: true, off: 6, t: 0 }]; }
  function newGame() {
    if (soundWanted() && !audio.isOn) toggleSound();
    unlockSession();
    G.score = 0; G.lives = 3; G.level = 0; G.loop = 0; G.nextLife = 0; PD.x = 96; loadLevel();
    G.state = 'ready'; G.timer = 100;
    showCard(null); $('pauseBtn').hidden = false; document.body.classList.add('playing'); audio.music(0.03); cv.focus({ preventScroll: true });
  }
  function addScore(n) { G.score += n; if (G.nextLife < LIFE_AT.length && G.score >= LIFE_AT[G.nextLife]) { G.nextLife++; G.lives++; sfx('life'); } }

  // ---------- one frame
  function step() {
    G.frame++;
    for (const p of parts) { p.vy += 0.2; p.x += p.vx; p.y += p.vy; p.t++; } parts = parts.filter((p) => p.t < 40);
    if (G.state === 'title') return;
    movePaddle();
    if (G.state === 'ready') { for (const b of balls) moveBall(b); if (--G.timer <= 0) G.state = 'play'; INPUT.firePressed = false; return; }
    if (G.state === 'lost') { if (--G.timer <= 0) { if (G.lives > 0) { resetBall(); G.state = 'play'; } else gameOver(); } return; }
    if (G.state === 'clear') { if (--G.timer <= 0) { G.level++; if (G.level >= LEVELS.length) { G.level = 0; G.loop++; } loadLevel(); G.state = 'ready'; G.timer = 90; } return; }
    if (G.state !== 'play') return;
    if (PD.wide > 0 && --PD.wide === 0) setWidth(32);
    if (PD.through > 0) PD.through--;
    for (const b of balls) {
      if (b.stuck && (INPUT.firePressed || ++b.t > 240)) launch(b);
      moveBall(b);
    }
    INPUT.firePressed = false;
    balls = balls.filter((b) => !b.lost);
    if (!balls.length) { G.lives--; G.state = 'lost'; G.timer = 70; drops = []; sfx('lose'); try { navigator.vibrate && navigator.vibrate(80); } catch {} return; }
    for (const d of drops) { d.y += 1; if (d.y + 14 >= PAD_Y && d.y <= PAD_Y + 8 && d.x + 14 >= PD.x && d.x + 2 <= PD.x + PD.w) { d.gone = true; power(d.kind); } else if (d.y > VH) d.gone = true; }
    drops = drops.filter((d) => !d.gone);
    if (!bricks.some((b) => b.t !== 's')) { G.state = 'clear'; G.timer = 130; addScore(500); sfx('clear'); }
  }
  function setWidth(w) { const cx = PD.x + PD.w / 2; PD.w = w; PD.x = Math.max(LEFT, Math.min(RIGHT - PD.w, cx - w / 2)); }
  function movePaddle() {
    const ox = PD.x; let dir = (INPUT.right ? 1 : 0) - (INPUT.left ? 1 : 0);
    if (dir) PD.x += dir * 3.2;
    else if (PD.target != null) { const d = PD.target - (PD.x + PD.w / 2); PD.x += Math.max(-9, Math.min(9, d)); }
    PD.x = Math.max(LEFT, Math.min(RIGHT - PD.w, PD.x));
    PD.vx = PD.x - ox; if (Math.abs(PD.vx) > 0.3) { PD.face = Math.sign(PD.vx); PD.anim += Math.min(0.4, Math.abs(PD.vx) * 0.08); }
  }
  function launch(b) {
    b.stuck = false; const a = (b.off >= 0 ? 1 : -1) * (0.25 + Math.random() * 0.25);
    b.vx = b.sp * Math.sin(a); b.vy = -b.sp * Math.cos(a); sfx('launch');
  }
  const overlap = (ax, ay, aw, ah, bx, by, bw, bh) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  function brickAt(b) { for (const br of bricks) if (overlap(b.x, b.y, BALL, BALL, br.x, br.y, BW, BH)) return br; return null; }
  function moveBall(b) {
    if (b.stuck) { b.x = PD.x + PD.w / 2 - BALL / 2 + b.off; b.y = PAD_Y - BALL; return; }
    const n = Math.max(1, Math.ceil(b.sp / 2));
    for (let i = 0; i < n && !b.lost; i++) {
      b.x += b.vx / n;
      if (b.x < LEFT) { b.x = LEFT; b.vx = Math.abs(b.vx); sfx('wall'); }
      if (b.x + BALL > RIGHT) { b.x = RIGHT - BALL; b.vx = -Math.abs(b.vx); sfx('wall'); }
      let br = brickAt(b); if (br) { if (!PD.through || br.t === 's') { b.x -= b.vx / n; b.vx = -b.vx; } hitBrick(br, b); }
      b.y += b.vy / n;
      if (b.y < TOP) { b.y = TOP; b.vy = Math.abs(b.vy); sfx('wall'); }
      br = brickAt(b); if (br) { if (!PD.through || br.t === 's') { b.y -= b.vy / n; b.vy = -b.vy; } hitBrick(br, b); }
      // the cushion on Carrie's back: where the ball lands decides the angle
      if (b.vy > 0 && b.y + BALL >= PAD_Y && b.y + BALL - b.vy / n <= PAD_Y + 3 && b.x + BALL >= PD.x - 1 && b.x <= PD.x + PD.w + 1) {
        const rel = Math.max(-1, Math.min(1, (b.x + BALL / 2 - (PD.x + PD.w / 2)) / (PD.w / 2)));
        const a = rel * 1.05; b.vx = b.sp * Math.sin(a); b.vy = -b.sp * Math.cos(a); b.y = PAD_Y - BALL; sfx('pad');
      }
      if (b.y > VH) b.lost = true;
    }
    // never let it get stuck going sideways
    if (!b.stuck && Math.abs(b.vy) < b.sp * 0.3) { b.vy = Math.sign(b.vy || -1) * b.sp * 0.3; b.vx = Math.sign(b.vx || 1) * Math.sqrt(Math.max(0, b.sp * b.sp - b.vy * b.vy)); }
  }
  function hitBrick(br, b) {
    if (br.t === 's') { sfx('stone'); return; }
    br.hp--;
    if (br.hp > 0) { sfx('crate'); return; }
    bricks.splice(bricks.indexOf(br), 1); addScore(PTS[br.t]);
    const cols = { h: '#e8b838', g: '#00a800', t: '#c4e4fc', p: '#f878a8', r: '#c83c18', k: '#2c2c2c', o: '#e0943c', w: '#fcfcfc', c: '#c87c30', b: '#e09040' };
    for (let i = 0; i < 6; i++) parts.push({ x: br.x + 2 + Math.random() * 12, y: br.y + 2 + Math.random() * 8, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 2, t: 0, c: cols[br.t] });
    sfx('break', br.y);
    if (br.t === 'b' || Math.random() < 0.06) { const kinds = ['wide', 'multi', 'through', 'wide', 'multi', G.lives < 3 ? 'life' : 'through']; drops.push({ x: br.x, y: br.y, kind: kinds[Math.floor(Math.random() * kinds.length)] }); }
    b.sp = Math.min(4, b.sp + 0.012);
    const k = Math.hypot(b.vx, b.vy) || 1; b.vx = (b.vx / k) * b.sp; b.vy = (b.vy / k) * b.sp;
  }
  function power(kind) {
    sfx('power'); addScore(100);
    if (kind === 'wide') { setWidth(48); PD.wide = 1200; }
    else if (kind === 'through') PD.through = 480;
    else if (kind === 'life') { G.lives++; sfx('life'); }
    else if (kind === 'multi') {
      const add = [];
      for (const b of balls) { if (b.stuck) launch(b); const a = Math.atan2(b.vx, -b.vy); for (const d of [-0.45, 0.45]) add.push({ x: b.x, y: b.y, sp: b.sp, vx: b.sp * Math.sin(a + d), vy: -b.sp * Math.cos(a + d), stuck: false, t: 0, off: 0 }); }
      balls.push(...add.slice(0, Math.max(0, 6 - balls.length)));
    }
  }

  // ---------- drawing
  const scr = canvas(VW, VH), sg = scr.getContext('2d');
  const DROP_SPR = { wide: 'sausage', multi: 'tball1', through: 'collar1', life: 'life' };
  function render() {
    const gr = sg.createLinearGradient(0, 0, 0, VH); gr.addColorStop(0, '#1c3c7c'); gr.addColorStop(1, '#5c94dc'); sg.fillStyle = gr; sg.fillRect(0, 0, VW, VH);
    sg.globalAlpha = 0.35; sg.drawImage(DECOR.alpBig, 20, GROUND - 48); sg.drawImage(DECOR.alpSmall, 140, GROUND - 28); sg.globalAlpha = 1;
    // fence frame
    sg.fillStyle = '#5c2c00'; sg.fillRect(0, TOP - 4, VW, 4); sg.fillRect(0, TOP - 4, LEFT, GROUND); sg.fillRect(RIGHT, TOP - 4, VW - RIGHT, GROUND);
    sg.fillStyle = '#c87c30'; sg.fillRect(1, TOP - 3, VW - 2, 2); sg.fillRect(1, TOP - 3, LEFT - 2, GROUND); sg.fillRect(RIGHT + 1, TOP - 3, VW - RIGHT - 2, GROUND);
    sg.fillStyle = '#5c2c00'; for (let y = TOP + 12; y < GROUND; y += 24) { sg.fillRect(0, y, LEFT, 1); sg.fillRect(RIGHT, y, VW - RIGHT, 1); }
    // ground
    sg.fillStyle = '#00a800'; sg.fillRect(0, GROUND, VW, 3); sg.fillStyle = '#80d010'; for (let x = 0; x < VW; x += 3) sg.fillRect(x, GROUND - 1, 1, 1);
    sg.fillStyle = '#3c2008'; sg.fillRect(0, GROUND + 3, VW, VH - GROUND - 3);
    for (const br of bricks) sg.drawImage(br.t === 'c' && br.hp < 2 ? BR.c2 : BR[br.t], br.x, br.y);
    for (const p of parts) { sg.fillStyle = p.c; sg.fillRect(Math.round(p.x), Math.round(p.y), 2, 2); }
    for (const d of drops) sg.drawImage(SPR[DROP_SPR[d.kind]].r, Math.round(d.x), Math.round(d.y));
    if (G.state !== 'title') {
      // Carrie runs under the cushion
      const pose = Math.abs(PD.vx) > 0.3 ? ['walk1', 'walk2', 'walk3', 'walk2'][Math.floor(PD.anim) % 4] : 'stand';
      const cs = SPR['cs_' + pose + '_normal']; sg.drawImage(PD.face > 0 ? cs.r : cs.l, Math.round(PD.x + PD.w / 2 - 8), PAD_Y + 4);
      sg.drawImage(BR['cushion' + PD.w], Math.round(PD.x), PAD_Y);
      for (const b of balls) sg.drawImage(PD.through > 0 && (PD.through > 90 || (G.frame >> 3) & 1) ? BR.goldball : SPR.shot.r, Math.round(b.x) - 1, Math.round(b.y) - 1);
    }
    // HUD
    text(sg, 'SKÓRE', 10, 5, '#fcfcfc'); text(sg, String(G.score).padStart(5, '0'), 10, 14, '#fcfcfc');
    text(sg, 'REKORD', 112, 5, '#fcfcfc', 'center'); text(sg, String(Math.max(G.best, G.score)).padStart(5, '0'), 112, 14, '#f8b800', 'center');
    text(sg, 'LEVEL', 214, 5, '#fcfcfc', 'right'); text(sg, String(G.level + 1 + G.loop * LEVELS.length), 214, 14, '#fcfcfc', 'right');
    if (G.state !== 'title') { for (let i = 0; i < Math.min(6, G.lives - (G.state === 'lost' ? 0 : 1)); i++) sg.drawImage(SPR.cs_stand_normal.r, 8 + i * 18, GROUND + 1); text(sg, '×' + G.lives, 216, GROUND + 6, '#fcfcfc', 'right'); }
    const mid = 176;
    if (G.state === 'ready') { text(sg, 'LEVEL ' + (G.level + 1 + G.loop * LEVELS.length), 112, mid, '#fcfcfc', 'center', '#000'); text(sg, LEVELS[G.level].name, 112, mid + 12, '#f8b800', 'center', '#000'); }
    else if (G.state === 'play' && balls.length === 1 && balls[0].stuck && (G.frame >> 4) & 1) text(sg, touchUI ? 'ŤUKNI A HOĎ LOPTIČKU' : 'MEDZERNÍK = HOD', 112, mid, '#fcfcfc', 'center', '#000');
    else if (G.state === 'clear') text(sg, 'VÝBORNE!', 112, mid, '#f8b800', 'center', '#000');
    else if (G.state === 'over') text(sg, 'KONIEC HRY', 112, mid, '#f83800', 'center', '#000');
  }

  // =====================================================================================
  // Sound, screen, input, menus
  // =====================================================================================
  const audio = makeAudio('triumph', (A) => ({
    pad: () => A.tone(330, 520, 0.08, 'square', 0.04), wall: () => A.tone(900, 900, 0.02, 'square', 0.02), launch: () => A.tone(400, 800, 0.1, 'square', 0.035),
    break: (y) => { const f = 1200 - (y - BRICK_Y) * 6; A.tone(f, f * 0.7, 0.06, 'square', 0.04); A.noise(0.05, 0.04, 1500); }, crate: () => A.tone(200, 160, 0.07, 'triangle', 0.12),
    stone: () => A.tone(1500, 1400, 0.05, 'triangle', 0.06), power: () => A.seq([523, 659, 784, 1047], 0.05), life: () => A.seq([659, 784, 1319, 1047, 1175, 1568], 0.08),
    lose: () => A.seq([659, 523, 392, 262], 0.1, 'square', 0.04), clear: () => A.seq([523, 659, 784, 1047, 0, 784, 1047, 1319], 0.1), over: () => A.seq([523, 0, 392, 0, 330, 262, 196], 0.17, 'triangle', 0.08),
  }));
  const sfx = (n, a) => audio.fx(n, a);
  const $ = (id) => document.getElementById(id);
  const cv = $('game'), ctx = cv.getContext('2d');
  const touchUI = matchMedia('(pointer: coarse)').matches;
  let cvRect = null;
  const layout = () => { fitCanvas(cv, VW, VH, touchUI, 150); cvRect = null; };
  addEventListener('resize', layout);
  const KB = {}, TOUCH = {};
  const KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'fire', ArrowUp: 'fire', KeyW: 'fire', KeyX: 'fire', Enter: 'fire' };
  let prevFire = false;
  function combineInput() {
    const gp = readGamepad() || {};
    INPUT.left = !!(KB.left || TOUCH.left || gp.left); INPUT.right = !!(KB.right || TOUCH.right || gp.right);
    const f = !!(KB.fire || TOUCH.fire || gp.a); if (f && !prevFire) INPUT.firePressed = true; prevFire = f;
    if (G.state === 'title' && !$('start').hidden && (gp.start || gp.a)) newGame();
  }
  addEventListener('keydown', (e) => {
    const k = KEYS[e.code]; if (k) e.preventDefault();
    if (e.code === 'Escape' || e.code === 'KeyP') { togglePause(); return; }
    if (e.code === 'KeyM') { toggleSound(); return; }
    if ((e.code === 'Enter' || e.code === 'Space') && G.state === 'title' && !$('start').hidden && !e.repeat) { e.preventDefault(); newGame(); return; }
    if (k) { KB[k] = true; if (paused && !e.repeat) togglePause(); }
  });
  addEventListener('keyup', (e) => { const k = KEYS[e.code]; if (k) KB[k] = false; });
  addEventListener('blur', () => { for (const o of [KB, TOUCH]) for (const k in o) o[k] = false; PD.target = null; });
  for (const b of document.querySelectorAll('[data-k]')) {
    const k = b.dataset.k;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch {} TOUCH[k] = true; b.classList.add('on'); if (paused) togglePause(); });
    for (const ev of ['pointerup', 'pointercancel']) b.addEventListener(ev, () => { TOUCH[k] = false; b.classList.remove('on'); });
  }
  // finger or mouse on the game: Carrie follows it; a tap throws the ball
  const toGameX = (e) => { cvRect = cvRect || cv.getBoundingClientRect(); return ((e.clientX - cvRect.left) / cvRect.width) * VW; };
  let dragging = false;
  cv.addEventListener('pointerdown', (e) => { if (G.state === 'title') return; e.preventDefault(); if (paused) { togglePause(); return; } try { cv.setPointerCapture(e.pointerId); } catch {} dragging = true; PD.target = toGameX(e); INPUT.firePressed = true; });
  cv.addEventListener('pointermove', (e) => { if (dragging || e.pointerType === 'mouse') { if (G.state !== 'title') PD.target = toGameX(e); } });
  for (const ev of ['pointerup', 'pointercancel']) cv.addEventListener(ev, (e) => { dragging = false; if (e.pointerType !== 'mouse') PD.target = null; });
  cv.addEventListener('pointerleave', () => { if (!dragging) PD.target = null; });

  let paused = false;
  try { G.best = Number(localStorage.getItem('carrie-bounce-best')) || 0; } catch {}
  function showCard(id) { for (const c of ['start', 'pause', 'over']) $(c).hidden = c !== id; }
  function gameOver() {
    G.state = 'over'; audio.music(0.015); sfx('over'); $('pauseBtn').hidden = true; document.body.classList.remove('playing');
    const isNew = G.score > G.best; if (isNew) { G.best = G.score; try { localStorage.setItem('carrie-bounce-best', String(G.best)); } catch {} }
    $('bestHud').textContent = G.best;
    let r = RANKS[0]; for (const q of RANKS) if (G.score >= q[0]) r = q;
    setTimeout(() => { $('rank').textContent = r[1]; $('rankNote').textContent = r[2]; $('finalScore').textContent = G.score; $('finalLvl').textContent = G.level + 1 + G.loop * LEVELS.length; $('newBest').hidden = !isNew; showCard('over'); $('again').focus({ preventScroll: true }); }, 1200);
  }
  function togglePause() { if (!['play', 'ready', 'lost', 'clear'].includes(G.state) && !paused) return; paused = !paused; $('pause').hidden = !paused; audio.music(paused ? 0 : 0.03); }
  function toggleSound() { const on = audio.toggle(); $('icoOn').hidden = !on; $('icoOff').hidden = on; $('mute').setAttribute('aria-label', on ? 'Vypnúť zvuk a hudbu' : 'Zapnúť zvuk a hudbu'); if (on && G.state !== 'title' && !paused) audio.music(0.03); }
  $('mute').addEventListener('click', toggleSound);
  $('play').addEventListener('click', newGame); $('again').addEventListener('click', newGame);
  $('resume').addEventListener('click', togglePause); $('pauseBtn').addEventListener('click', togglePause);
  $('quit').addEventListener('click', () => { paused = false; G.state = 'title'; showCard('start'); $('pauseBtn').hidden = true; document.body.classList.remove('playing'); audio.music(0); });
  $('toTitle').addEventListener('click', () => { G.state = 'title'; showCard('start'); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (!paused && ['play', 'ready', 'lost', 'clear'].includes(G.state)) togglePause(); audio.suspend(); } else audio.wake(); loop.reset(); });
  try { const r = document.referrer && new URL(document.referrer); if (r && r.origin === location.origin && r.pathname !== location.pathname) $('home').href = r.pathname; } catch {}
  function drawLogo() { const lg = $('logo'); lg.width = 78; lg.height = 12; const g = lg.getContext('2d'); text(g, 'CARRIE', 1, 4, '#f8b800', 'left', '#000'); text(g, 'BOUNCE', 43, 4, '#d82800', 'left', '#000'); }
  function fillLegend() {
    const rows = [[SPR.sausage.r, 'Klobása', 'širší vankúš'], [SPR.tball1.r, 'Tenisové loptičky', 'tri loptičky naraz'], [SPR.collar1.r, 'Zlatý obojok', 'loptička preletí senom'], [SPR.life.r, 'Zelená kosť', 'život navyše']];
    const ul = $('legend'); ul.innerHTML = '';
    for (const [c, n, p] of rows) { const li = document.createElement('li'); const img = document.createElement('img'); img.src = c.toDataURL(); img.alt = ''; const b = document.createElement('b'); b.textContent = n; const s = document.createElement('span'); s.textContent = p; li.append(img, b, s); ul.append(li); }
  }
  if (touchUI) $('keys').innerHTML = '<b>Prst na obraze</b>: Carrie beží za ním, ťuk hodí loptičku · alebo <b>◀ ▶</b> a <b>HOD</b>';
  buildGfx(); buildBricks(); drawLogo(); fillLegend(); loadLevel(); layout(); $('bestHud').textContent = G.best; showCard('start');
  const loop = runLoop(() => { combineInput(); step(); }, render, () => paused, () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(scr, 0, 0, cv.width, cv.height); });
  window.__cb = { G, PD, balls: () => balls, bricks: () => bricks, drops: () => drops, newGame, power, LEVELS, loadLevel };
