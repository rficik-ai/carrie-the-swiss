  // =====================================================================================
  // Carrie Jump: endless jumping from cloud to cloud, from the garden up to the stars.
  // World y grows downwards; the camera only moves up. 10 px = 1 m.
  // =====================================================================================
  const VW = 192, VH = 320, START_Y = 296, JUMP = -7.2, SPRING = -12, GRAV = 0.25;
  const RANKS = [[0, 'Na dvore', 'Carrie sa ešte len rozcvičuje.'], [300, 'Nad strechou', 'Z výšky vidí celú záhradu.'], [1000, 'V oblakoch', 'Obláčiky sú mäkké ako jej pelech.'],
    [2500, 'Pri lietadlách', 'Piloti jej mávajú z okienka.'], [4000, 'Medzi hviezdami', 'Hviezdy sú bližšie než granule v miske.'], [6000, 'Na Mesiaci', 'Prvý pes na Mesiaci. Švajčiarsky, samozrejme.']];
  const meters = (y) => Math.max(0, Math.floor((START_Y - y) / 10));

  // ---------- art: clouds (4 kinds), spring, propeller for the flying vacuum
  const ART = {};
  function buildArt() {
    const cloud = (body, shade, out) => { const P = painter(32, 11); P.ellipse(9, 6, 7, 4.5, body); P.ellipse(17, 4.5, 8, 4.5, body); P.ellipse(25, 6, 6, 4.5, body); P.rect(4, 6, 24, 4, body); for (let x = 5; x < 28; x++) P.set(x, 9, shade); P.outline(out); return P.canvas(); };
    ART.normal = cloud('#fcfcfc', '#bcdcfc', '#5c8cbc'); ART.move = cloud('#9cd8fc', '#5cacec', '#2c5c9c'); ART.break = cloud('#9c9cac', '#6c6c7c', '#3c3c4c'); ART.bubble = cloud('#fcc4e4', '#f878c8', '#a8307c');
    for (const s of [0, 1]) { const P = painter(10, 9); const top = s ? 0 : 3; for (let y = top; y < 8; y += 2) P.rect(2, y, 6, 1, '#bcbcbc'); P.rect(1, top, 8, 2, '#d82800'); P.rect(1, 8, 8, 1, '#4a4a4a'); P.outline('#181818'); ART['spring' + s] = P.canvas(); }
    for (const f of [0, 1]) { const P = painter(16, 4); if (f) { P.rect(1, 1, 6, 1, '#bcbcbc'); P.rect(9, 1, 6, 1, '#bcbcbc'); } else { P.rect(3, 1, 3, 1, '#bcbcbc'); P.rect(10, 1, 3, 1, '#bcbcbc'); } P.rect(7, 1, 2, 3, '#4a4a4a'); ART['prop' + f] = P.canvas(); }
    const F = painter(18, 22); F.rect(8, 0, 2, 22, '#5c2c00'); for (let y = 1; y < 8; y++) for (let x = 10; x < 18 - (y % 2); x++) F.set(x, y, '#d82800'); ART.flag = F.canvas();
  }

  // ---------- state
  const G = { state: 'title', frame: 0, best: 0, height: 0, coins: 0, rescue: 0, timer: 0 };
  const P = { x: 84, y: START_Y - 24, vx: 0, vy: 0, face: 1, fly: 0, safe: 0, target: null, spin: 0 };
  let camY = 0, genY = START_Y, plats = [], foes = [], coins = [], shots = [], bits = [], lastFoe = 0, milestones = [];
  const INPUT = { left: false, right: false, fire: false, firePressed: false };

  function reset() {
    camY = 0; genY = START_Y - 30; plats = []; foes = []; coins = []; shots = []; bits = []; lastFoe = START_Y; milestones = [];
    Object.assign(P, { x: 84, y: START_Y - 24, vx: 0, vy: JUMP, face: 1, fly: 0, safe: 0, target: null, spin: 0 });
    G.height = 0; G.coins = 0; G.rescue = 0;
    // a friendly start: a few wide steps
    for (let i = 0; i < 4; i++) plats.push({ x: 20 + ((i * 53) % 130), y: START_Y - 40 - i * 40, w: 32, type: 'normal' });
    genY = START_Y - 40 - 3 * 40; generate();
  }
  function generate() {
    while (genY > camY - 80) {
      const h = meters(genY), gap = 30 + Math.min(48, h * 0.012) + Math.random() * 14;
      genY -= gap;
      const r = Math.random();
      let type = 'normal';
      if (h > 300 && r < Math.min(0.4, 0.1 + h / 8000)) type = 'move';
      else if (h > 900 && r < Math.min(0.55, 0.45 + h / 20000)) type = 'bubble';
      const p = { x: 4 + Math.random() * (VW - 40), y: genY, w: 32, type, vx: type === 'move' ? (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.min(1.2, h / 3000)) : 0 };
      if (type === 'normal') { const q = Math.random(); if (h > 60 && q < 0.07) p.item = 'spring'; else if (h > 200 && q < 0.085) p.item = 'balloon'; }
      plats.push(p);
      if (Math.random() < 0.35) { const n = 1 + Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) coins.push({ x: p.x + 8 + i * 10 - (n - 1) * 5, y: p.y - 18 - (i === 1 ? 4 : 0) }); }
      if (h > 400 && Math.random() < 0.28) plats.push({ x: 4 + Math.random() * (VW - 40), y: genY + gap / 2, w: 32, type: 'break' });
      if (h > 700 && lastFoe - genY > Math.max(380, 900 - h * 0.08) && Math.random() < 0.5) {
        lastFoe = genY; const fy = genY + gap / 2 - 8, kind = Math.random() < 0.6 ? 'vac' : 'hog';
        foes.push({ kind, x: 20 + Math.random() * (VW - 56), y: fy, bx: 0, by: fy, t: Math.random() * 100, w: 16, h: 16 });
      }
      const mile = Math.floor(meters(genY) / 1000) * 1000; if (mile > 0 && !milestones.includes(mile)) milestones.push(mile);
    }
    for (const f of foes) if (!f.bx) f.bx = f.x;
    const bottom = camY + VH + 60;
    plats = plats.filter((p) => p.y < bottom); foes = foes.filter((f) => f.y < bottom && !f.gone); coins = coins.filter((c) => c.y < bottom && !c.got);
  }
  function newGame() {
    if (soundWanted() && !audio.isOn) toggleSound();
    unlockSession(); reset(); G.state = 'play';
    showCard(null); $('pauseBtn').hidden = false; document.body.classList.add('playing'); audio.music(0.03); cv.focus({ preventScroll: true });
  }

  // ---------- one frame
  function step() {
    G.frame++;
    for (const b of bits) { b.vy += 0.3; b.x += b.vx; b.y += b.vy; b.t++; } bits = bits.filter((b) => b.t < 60);
    if (G.state === 'title') { P.y += P.vy; P.vy += GRAV; if (P.y >= START_Y - 24) { P.y = START_Y - 24; P.vy = JUMP; } return; }
    if (G.state === 'over') return;
    // horizontal: keys, buttons or a finger
    let dir = (INPUT.right ? 1 : 0) - (INPUT.left ? 1 : 0);
    if (!dir && P.target != null) { const d = P.target - (P.x + 12); if (Math.abs(d) > 4) dir = Math.sign(d); }
    if (G.state === 'falling') dir = 0;
    if (dir) { P.vx = Math.max(-3, Math.min(3, P.vx + dir * 0.45)); P.face = dir; } else P.vx *= 0.82;
    P.x += P.vx; if (P.x + 12 < 0) P.x += VW; if (P.x + 12 > VW) P.x -= VW;
    // vertical
    const prevBottom = P.y + 24;
    if (P.fly > 0) { P.fly--; P.vy = -5.5; } else P.vy = Math.min(8, P.vy + GRAV);
    P.y += P.vy;
    if (P.safe > 0) P.safe--;
    if (G.state === 'falling') { P.spin += 0.3; if (P.y > camY + VH + 30) endFall(); return; }
    // landing on clouds (only when coming down)
    if (P.vy > 0 && P.fly <= 0) {
      if (START_Y < camY + VH && prevBottom <= START_Y && P.y + 24 >= START_Y) { P.y = START_Y - 24; P.vy = JUMP; sfx('boing'); }
      for (const p of plats) {
        if (p.broken || p.popped) continue;
        if (P.x + 6 < p.x + p.w && P.x + 18 > p.x && prevBottom <= p.y + 2 && P.y + 24 >= p.y) {
          if (p.type === 'break') { p.broken = true; bits.push({ x: p.x, y: p.y, vx: -0.6, vy: 0, t: 0, half: 0, p }, { x: p.x + 16, y: p.y, vx: 0.6, vy: 0, t: 0, half: 1, p }); sfx('crack'); continue; }
          P.y = p.y - 24;
          if (p.item === 'spring') { P.vy = SPRING; p.sprung = 12; sfx('spring'); } else { P.vy = JUMP; sfx('boing'); }
          if (p.type === 'bubble') { p.popped = true; for (let i = 0; i < 8; i++) bits.push({ x: p.x + 16, y: p.y + 4, vx: Math.cos(i) * 1.5, vy: Math.sin(i) * 1.5 - 1, t: 20, dot: '#f878c8' }); sfx('pop'); }
          break;
        }
      }
    }
    for (const p of plats) { if (p.type === 'move' && !p.broken) { p.x += p.vx; if (p.x < 2 || p.x + p.w > VW - 2) p.vx = -p.vx; } if (p.sprung) p.sprung--; }
    // items: balloons, granules
    for (const p of plats) if (p.item === 'balloon' && !p.taken && overlap(P.x + 4, P.y + 4, 16, 20, p.x + 8, p.y - 18, 16, 18)) { p.taken = true; P.fly = 150; sfx('balloon'); }
    for (const c of coins) if (!c.got && overlap(P.x + 4, P.y + 4, 16, 20, c.x, c.y, 8, 12)) {
      c.got = true; G.coins++; sfx('coin');
      if (G.coins % 20 === 0 && G.rescue < 3) { G.rescue++; sfx('life'); bits.push({ x: P.x, y: P.y - 10, vx: 0, vy: -1, t: 0, label: '+ BALÓNIK' }); }
    }
    // flying vacuums and balloon hedgehogs
    for (const f of foes) {
      if (f.dead) { f.vy = (f.vy || 0) + 0.3; f.y += f.vy; continue; }
      f.t++;
      if (f.kind === 'vac') f.x = f.bx + Math.sin(f.t * 0.03) * 36; else f.y = f.by + Math.sin(f.t * 0.06) * 6;
      if (!overlap(P.x + 4, P.y + 4, 16, 20, f.x + 1, f.y + 1, 14, 14)) continue;
      if (P.fly > 0 || P.safe > 0) { kill(f); continue; }
      if (P.vy > 0 && prevBottom <= f.y + 8) { kill(f); P.vy = JUMP; continue; }
      G.state = 'falling'; P.vy = -2; sfx('hurt'); try { navigator.vibrate && navigator.vibrate(90); } catch {}
    }
    // tennis balls
    if (INPUT.firePressed && shots.length < 3) { shots.push({ x: P.x + 8, y: P.y }); sfx('shot'); }
    INPUT.firePressed = false;
    for (const s of shots) { s.y -= 6; if (s.y < camY - 10) s.gone = true; for (const f of foes) if (!f.dead && overlap(s.x, s.y, 8, 8, f.x, f.y, 16, 16)) { kill(f); s.gone = true; } }
    shots = shots.filter((s) => !s.gone);
    // camera, score, falling out
    if (P.y < camY + 110) camY = P.y - 110;
    G.height = Math.max(G.height, meters(P.y + 24));
    generate();
    if (P.y > camY + VH + 10) endFall();
  }
  function kill(f) { f.dead = true; f.vy = -2; sfx('stomp'); }
  function endFall() {
    if (G.rescue > 0) { G.rescue--; G.state = 'play'; P.y = camY + VH - 40; P.vy = -5.5; P.fly = 110; P.safe = 160; P.spin = 0; sfx('balloon'); return; }
    G.state = 'over'; audio.music(0.015); sfx('over'); $('pauseBtn').hidden = true; document.body.classList.remove('playing');
    const isNew = G.height > G.best; if (isNew) { G.best = G.height; try { localStorage.setItem('carrie-jump-best', String(G.best)); } catch {} }
    $('bestHud').textContent = G.best + ' m';
    let r = RANKS[0]; for (const q of RANKS) if (G.height >= q[0]) r = q;
    setTimeout(() => { $('rank').textContent = r[1]; $('rankNote').textContent = r[2]; $('finalScore').textContent = G.height; $('finalCoins').textContent = G.coins; $('newBest').hidden = !isNew; showCard('over'); $('again').focus({ preventScroll: true }); }, 900);
  }
  const overlap = (ax, ay, aw, ah, bx, by, bw, bh) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

  // ---------- drawing
  const scr = canvas(VW, VH), sg = scr.getContext('2d');
  const SKY = [[0, '#3c7ce0', '#9cd0fc'], [800, '#2c64d0', '#8cc4fc'], [1600, '#e86c50', '#fcc070'], [2500, '#5c3c8c', '#d8708c'], [3500, '#141c4c', '#3c3c8c'], [5000, '#05071a', '#141c4c']];
  const mix = (a, b, t) => { const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  function skyAt(h) {
    let i = 0; while (i < SKY.length - 1 && h >= SKY[i + 1][0]) i++;
    if (i === SKY.length - 1) return [SKY[i][1], SKY[i][2]];
    const t = (h - SKY[i][0]) / (SKY[i + 1][0] - SKY[i][0]); return [mix(SKY[i][1], SKY[i + 1][1], t), mix(SKY[i][2], SKY[i + 1][2], t)];
  }
  const STARS = Array.from({ length: 80 }, (_, i) => ({ x: (i * 73) % VW, y: (i * 131) % VH, p: i % 5 }));
  const sy = (y) => Math.round(y - camY);
  function render() {
    const h = meters(camY + VH / 2), [top, bot] = skyAt(h);
    const gr = sg.createLinearGradient(0, 0, 0, VH); gr.addColorStop(0, top); gr.addColorStop(1, bot); sg.fillStyle = gr; sg.fillRect(0, 0, VW, VH);
    if (h > 2200) { sg.globalAlpha = Math.min(1, (h - 2200) / 1500); for (const s of STARS) { if ((G.frame >> 4) % 5 === s.p) continue; sg.fillStyle = s.p % 2 ? '#fcfcfc' : '#9cacfc'; sg.fillRect(s.x, (s.y - camY * 0.05) % VH < 0 ? (s.y - camY * 0.05) % VH + VH : (s.y - camY * 0.05) % VH, 1, 1); } sg.globalAlpha = 1; }
    // far clouds drifting slowly (parallax)
    if (h < 3000) { sg.globalAlpha = 0.5; for (let i = 0; i < 6; i++) { const yy = ((i * 97 - camY * 0.4) % 400 + 400) % 400 - 40; sg.drawImage(i % 2 ? DECOR.cloud2 : DECOR.cloud1, (i * 61 + G.frame * 0.05 * (i % 3 + 1)) % (VW + 60) - 50, yy); } sg.globalAlpha = 1; }
    // the moon far up
    const moonY = sy(START_Y - 42000); if (moonY > -40 && moonY < VH + 40) { sg.fillStyle = '#fce0a8'; sg.beginPath(); sg.arc(140, moonY, 26, 0, 7); sg.fill(); sg.fillStyle = '#e8c890'; sg.beginPath(); sg.arc(130, moonY - 6, 5, 0, 7); sg.arc(150, moonY + 8, 4, 0, 7); sg.fill(); }
    // the garden at the start
    const gy = sy(START_Y);
    if (gy < VH + 60) {
      sg.drawImage(DECOR.alpBig, 60, gy - 48); sg.drawImage(DECOR.hay, 4, gy - 24); sg.drawImage(DECOR.bush2, 140, gy - 20); sg.drawImage(DECOR.fence, 112, gy - 16); sg.drawImage(DECOR.fence, 128, gy - 16);
      sg.fillStyle = '#00a800'; sg.fillRect(0, gy, VW, 4); sg.fillStyle = '#a85c20'; sg.fillRect(0, gy + 4, VW, VH);
    }
    // milestones and the best height
    for (const mi of milestones) { const y = sy(START_Y - mi * 10); if (y > -30 && y < VH + 10) { sg.drawImage(ART.flag, 2, y - 22); text(sg, mi + ' M', 22, y - 18, '#fcfcfc', 'left', '#000'); } }
    if (G.best > 0) { const y = sy(START_Y - G.best * 10); if (y > 0 && y < VH) { sg.fillStyle = '#f8b800'; for (let x = 0; x < VW; x += 6) sg.fillRect(x, y, 3, 1); text(sg, 'REKORD', VW - 4, y - 8, '#f8b800', 'right', '#000'); } }
    for (const p of plats) {
      if (p.broken || p.popped) continue;
      const y = sy(p.y); if (y < -20 || y > VH + 10) continue;
      sg.drawImage(ART[p.type], Math.round(p.x), y - 1);
      if (p.item === 'spring') sg.drawImage(ART[p.sprung ? 'spring0' : 'spring1'], Math.round(p.x + 11), y - 8);
      if (p.item === 'balloon' && !p.taken) sg.drawImage(SPR.balloon.r, Math.round(p.x + 9), y - 18 + Math.round(Math.sin(G.frame / 12) * 2));
    }
    for (const b of bits) {
      if (b.p) { const half = canvas(16, 11); half.getContext('2d').drawImage(ART.break, b.half ? -16 : 0, 0); sg.drawImage(half, Math.round(b.x), sy(b.y)); }
      else if (b.dot) { sg.fillStyle = b.dot; sg.fillRect(Math.round(b.x), sy(b.y), 2, 2); }
      else if (b.label) text(sg, b.label, Math.round(b.x), sy(b.y - b.t * 0.6), '#f8b800', 'left', '#000');
    }
    for (const c of coins) if (!c.got) { const y = sy(c.y); if (y > -16 && y < VH) sg.drawImage(SPR['coin' + ((G.frame >> 3) % 4)].r, Math.round(c.x) - 4, y - 2); }
    for (const f of foes) {
      const y = sy(f.y); if (y < -24 || y > VH + 16) continue;
      if (f.kind === 'vac') { sg.drawImage(ART['prop' + ((G.frame >> 2) & 1)], Math.round(f.x), y - 3); sg.drawImage(f.dead ? flipped(SPR.vac1.r) : SPR[(G.frame >> 3) & 1 ? 'vac1' : 'vac2'].r, Math.round(f.x), y); }
      else { if (!f.dead) sg.drawImage(SPR.balloon.r, Math.round(f.x) + 1, y - 15); sg.drawImage(f.dead ? flipped(SPR.hog1.r) : SPR[(G.frame >> 4) & 1 ? 'hog1' : 'hog2'].l, Math.round(f.x), y); }
    }
    for (const s of shots) sg.drawImage(SPR.shot.r, Math.round(s.x), sy(s.y));
    if (G.state !== 'over' || P.y < camY + VH + 20) drawCarrie();
    // HUD
    text(sg, 'VÝŠKA', 6, 5, '#fcfcfc', 'left', '#000'); text(sg, G.height + ' M', 6, 14, '#fcfcfc', 'left', '#000');
    text(sg, 'REKORD', VW - 6, 5, '#fcfcfc', 'right', '#000'); text(sg, Math.max(G.best, G.height) + ' M', VW - 6, 14, '#f8b800', 'right', '#000');
    if (G.state !== 'title') {
      sg.drawImage(SPR.coin1.r, 64, 7); text(sg, '×' + G.coins, 76, 12, '#fcfcfc', 'left', '#000');
      for (let i = 0; i < G.rescue; i++) sg.drawImage(SPR.balloon.r, 104 + i * 10, 2, 10, 10);
    }
    if (G.state === 'over') text(sg, 'CARRIE SPADLA', VW / 2, 150, '#f83800', 'center', '#000');
  }
  const flipCache = new Map(); const flipped = (c) => { if (!flipCache.has(c)) flipCache.set(c, flipV(c)); return flipCache.get(c); };
  function drawCarrie() {
    const x = Math.round(P.x), y = sy(P.y);
    if (P.fly > 0) for (let i = 0; i < 3; i++) sg.drawImage(SPR.balloon.r, x + 1 + i * 7 - 3, y - 20 - (i === 1 ? 4 : 0) + Math.round(Math.sin(G.frame / 10 + i)));
    const pose = P.vy < -1 ? 'jump' : P.vy > 2 ? 'walk1' : 'stand';
    let spr = SPR['cb_' + pose + '_normal'][P.face > 0 ? 'r' : 'l'];
    if (G.state === 'falling') spr = flipped(SPR.cb_stand_normal.r);
    if (P.safe > 0 && (G.frame >> 2) & 1) return;
    sg.drawImage(spr, x, y); if (x < 0) sg.drawImage(spr, x + VW, y); if (x + 24 > VW) sg.drawImage(spr, x - VW, y);
  }

  // =====================================================================================
  // Sound, screen, input, menus
  // =====================================================================================
  const audio = makeAudio('everyday', (A) => ({
    boing: () => A.tone(300, 620, 0.09, 'square', 0.03), spring: () => A.tone(200, 1400, 0.3, 'square', 0.04), crack: () => { A.noise(0.15, 0.06, 500); A.tone(220, 110, 0.12, 'triangle', 0.08); },
    pop: () => { A.tone(1200, 400, 0.08, 'sine', 0.06); A.noise(0.05, 0.04, 2000); }, balloon: () => A.seq([523, 659, 784, 1047, 1319], 0.06), coin: () => { A.tone(1175, 1175, 0.05, 'square', 0.03); A.tone(1760, 1760, 0.15, 'square', 0.025, 0.05); },
    life: () => A.seq([659, 784, 1319, 1047, 1175, 1568], 0.07), stomp: () => { A.tone(520, 140, 0.09, 'square', 0.05); A.noise(0.05, 0.05); }, shot: () => A.tone(800, 1400, 0.06, 'square', 0.03),
    hurt: () => A.seq([880, 698, 523, 349], 0.08), over: () => A.tone(700, 90, 0.9, 'triangle', 0.1),
  }));
  const sfx = (n) => audio.fx(n);
  const $ = (id) => document.getElementById(id);
  const cv = $('game'), ctx = cv.getContext('2d');
  const touchUI = matchMedia('(pointer: coarse)').matches;
  let cvRect = null;
  const layout = () => { fitCanvas(cv, VW, VH, touchUI, 150); cvRect = null; };
  addEventListener('resize', layout);
  const KB = {}, TOUCH = {};
  const KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'fire', ArrowUp: 'fire', KeyW: 'fire', KeyX: 'fire' };
  let prevFire = false;
  function combineInput() {
    const gp = readGamepad() || {};
    INPUT.left = !!(KB.left || TOUCH.left || gp.left); INPUT.right = !!(KB.right || TOUCH.right || gp.right);
    const f = !!(KB.fire || TOUCH.fire || gp.a); if (f && !prevFire) INPUT.firePressed = true; prevFire = f;
    if ((G.state === 'title' && !$('start').hidden) && (gp.start || gp.a)) newGame();
  }
  addEventListener('keydown', (e) => {
    const k = KEYS[e.code]; if (k) e.preventDefault();
    if (e.code === 'Escape' || e.code === 'KeyP') { togglePause(); return; }
    if (e.code === 'KeyM') { toggleSound(); return; }
    if ((e.code === 'Enter' || e.code === 'Space') && G.state === 'title' && !$('start').hidden && !e.repeat) { e.preventDefault(); newGame(); return; }
    if (k) { KB[k] = true; if (paused && !e.repeat) togglePause(); }
  });
  addEventListener('keyup', (e) => { const k = KEYS[e.code]; if (k) KB[k] = false; });
  addEventListener('blur', () => { for (const o of [KB, TOUCH]) for (const k in o) o[k] = false; P.target = null; });
  for (const b of document.querySelectorAll('[data-k]')) {
    const k = b.dataset.k;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch {} TOUCH[k] = true; b.classList.add('on'); if (paused) togglePause(); });
    for (const ev of ['pointerup', 'pointercancel']) b.addEventListener(ev, () => { TOUCH[k] = false; b.classList.remove('on'); });
  }
  // a finger on the game steers Carrie towards it
  const toGameX = (e) => { cvRect = cvRect || cv.getBoundingClientRect(); return ((e.clientX - cvRect.left) / cvRect.width) * VW; };
  cv.addEventListener('pointerdown', (e) => { if (G.state === 'title') return; e.preventDefault(); if (paused) { togglePause(); return; } try { cv.setPointerCapture(e.pointerId); } catch {} P.target = toGameX(e); });
  cv.addEventListener('pointermove', (e) => { if (P.target != null) P.target = toGameX(e); });
  for (const ev of ['pointerup', 'pointercancel']) cv.addEventListener(ev, () => { P.target = null; });

  let paused = false;
  try { G.best = Number(localStorage.getItem('carrie-jump-best')) || 0; } catch {}
  function showCard(id) { for (const c of ['start', 'pause', 'over']) $(c).hidden = c !== id; }
  function togglePause() { if (!['play', 'falling'].includes(G.state) && !paused) return; paused = !paused; $('pause').hidden = !paused; audio.music(paused ? 0 : 0.03); }
  function toggleSound() { const on = audio.toggle(); $('icoOn').hidden = !on; $('icoOff').hidden = on; $('mute').setAttribute('aria-label', on ? 'Vypnúť zvuk a hudbu' : 'Zapnúť zvuk a hudbu'); if (on && G.state !== 'title' && !paused) audio.music(0.03); }
  $('mute').addEventListener('click', toggleSound);
  $('play').addEventListener('click', newGame); $('again').addEventListener('click', newGame);
  $('resume').addEventListener('click', togglePause); $('pauseBtn').addEventListener('click', togglePause);
  $('quit').addEventListener('click', () => { paused = false; G.state = 'title'; reset(); showCard('start'); $('pauseBtn').hidden = true; document.body.classList.remove('playing'); audio.music(0); });
  $('toTitle').addEventListener('click', () => { G.state = 'title'; reset(); showCard('start'); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (!paused && ['play', 'falling'].includes(G.state)) togglePause(); audio.suspend(); } else audio.wake(); loop.reset(); });
  try { const r = document.referrer && new URL(document.referrer); if (r && r.origin === location.origin && r.pathname !== location.pathname) $('home').href = r.pathname; } catch {}
  function drawLogo() { const lg = $('logo'); lg.width = 66; lg.height = 12; const g = lg.getContext('2d'); text(g, 'CARRIE', 1, 4, '#f8b800', 'left', '#000'); text(g, 'JUMP', 43, 4, '#3cbcfc', 'left', '#000'); }
  function fillLegend() {
    const cl = (c) => { const k = canvas(32, 16); k.getContext('2d').drawImage(c, 0, 3); return k; };
    const sp = canvas(32, 16); sp.getContext('2d').drawImage(ART.normal, 0, 5); sp.getContext('2d').drawImage(ART.spring1, 11, 0);
    const rows = [[cl(ART.move), 'Modrý obláčik', 'pláva do strán'], [cl(ART.bubble), 'Bublina', 'udrží len jeden skok'], [cl(ART.break), 'Dažďový mrak', 'prepadne sa'],
      [sp, 'Pružinka', 'obrovský skok'], [SPR.balloon.r, 'Balóniky', 'Carrie letí sama'], [SPR.coin0.r, '20 granúl', 'záchranný balónik'], [SPR.vac1.r, 'Lietajúci vysávač', 'skoč naň alebo hoď loptičku']];
    const ul = $('legend'); ul.innerHTML = '';
    for (const [c, n, p] of rows) { const li = document.createElement('li'); const img = document.createElement('img'); img.src = c.toDataURL(); img.alt = ''; const b = document.createElement('b'); b.textContent = n; const s = document.createElement('span'); s.textContent = p; li.append(img, b, s); ul.append(li); }
  }
  if (touchUI) $('keys').innerHTML = '<b>Prst na obraze</b> alebo <b>◀ ▶</b> hýbu Carrie · Carrie skáče sama · <b>HOD</b> hodí loptičku';
  buildGfx(); buildArt(); drawLogo(); fillLegend(); reset(); layout(); $('bestHud').textContent = G.best + ' m'; showCard('start');
  const loop = runLoop(() => { combineInput(); step(); }, render, () => paused, () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(scr, 0, 0, cv.width, cv.height); });
  window.__cj = { G, P, plats: () => plats, foes: () => foes, coins: () => coins, newGame, cam: () => camY };
