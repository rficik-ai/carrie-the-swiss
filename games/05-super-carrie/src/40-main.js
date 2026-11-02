  // =====================================================================================
  // Sound: chiptune effects (own little tunes) + Carrie's songs from the website
  // =====================================================================================
  const TRACK = makeTrack('everyday');
  const audio = (() => {
    let ac = null, on = false, master, noiseBuf = null, curLevel = 0;
    function ensure() {
      if (ac) return true; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ac = new AC(); master = ac.createGain(); master.gain.value = 0.8; master.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.4, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return true;
    }
    function tone(f0, f1, dur, type = 'square', vol = 0.05, when = 0) {
      if (!on) return; const t = ac.currentTime + when, o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
    }
    function noise(dur, vol = 0.08, when = 0, hp = 800) {
      if (!on) return; const t = ac.currentTime + when, s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
      s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + dur + 0.02);
    }
    const seq = (notes, len, type = 'square', vol = 0.045) => notes.forEach((f, i) => f && tone(f, f, len * 0.9, type, vol, i * len));
    const FX = {
      jump: () => tone(300, 640, 0.14, 'square', 0.04), jumpBig: () => tone(220, 470, 0.16, 'square', 0.045),
      stomp: () => { tone(520, 140, 0.09, 'square', 0.05); noise(0.05, 0.05); }, coin: () => { tone(1175, 1175, 0.06, 'square', 0.04); tone(1760, 1760, 0.22, 'square', 0.035, 0.06); },
      bump: () => tone(170, 110, 0.08, 'triangle', 0.1), break: () => { noise(0.2, 0.12, 0, 300); tone(140, 60, 0.15, 'triangle', 0.08); },
      sprout: () => tone(200, 900, 0.35, 'square', 0.035), power: () => seq([523, 659, 784, 1047, 784, 1047, 1319], 0.05),
      shrink: () => seq([1047, 784, 659, 523, 392, 330], 0.06), shot: () => tone(900, 1400, 0.06, 'square', 0.035), kick: () => tone(1100, 500, 0.06, 'square', 0.045),
      life: () => seq([659, 784, 1319, 1047, 1175, 1568], 0.08), pipe: () => seq([330, 0, 262, 0, 196], 0.06, 'square', 0.05),
      die: () => seq([988, 932, 880, 0, 659, 587, 523, 0, 392, 330, 262], 0.11, 'square', 0.045), pole: () => tone(1400, 260, 0.9, 'square', 0.035),
      clear: () => seq([523, 659, 784, 1047, 0, 880, 1047, 1319, 0, 1568], 0.11, 'square', 0.045), tick: () => tone(1900, 1900, 0.025, 'square', 0.02),
      hurry: () => seq([988, 1175, 988, 1175, 988, 1175], 0.09, 'square', 0.04), crumble: () => noise(0.08, 0.06, 0, 500),
      bosshit: () => tone(240, 120, 0.12, 'square', 0.06), puff: () => noise(0.25, 0.05, 0, 1500), plug: () => seq([392, 523, 659], 0.06),
      over: () => seq([523, 0, 392, 0, 330, 0, 262, 196], 0.18, 'triangle', 0.08),
    };
    return {
      get isOn() { return on; },
      toggle() { unlockSession(); if (!ensure()) return false; on = !on; saveSound(on); if (on) { ac.resume(); TRACK.play(curLevel); } else TRACK.stop(); return on; },
      music(level) { curLevel = level; if (on) { if (level > 0) TRACK.play(level); else TRACK.stop(); } },
      rate(r) { try { const el = TRACK._el && TRACK._el(); if (el) el.playbackRate = r; } catch {} },
      fx(name) { if (on && FX[name]) FX[name](); },
      suspend() { TRACK.stop(); if (ac && ac.state === 'running') ac.suspend(); },
      wake() { if (ac && on) { ac.resume(); if (curLevel > 0) TRACK.play(curLevel); } },
    };
  })();
  const sfx = (n) => audio.fx(n);
  const music = (l) => audio.music(l);
  const setMusicRate = (r) => audio.rate(r);

  // =====================================================================================
  // Drawing
  // =====================================================================================
  const scr = canvas(VW, VH), sg = scr.getContext('2d');
  const vflip = new Map(); const vf = (c) => { if (!vflip.has(c)) vflip.set(c, flipV(c)); return vflip.get(c); };
  function spr(name, x, y, left, vflipped) { const s = SPR[name]; if (!s) return; let c = left ? s.l : s.r; if (vflipped) c = vf(c); sg.drawImage(c, Math.round(x - G.cam), Math.round(y)); }
  function drawTiles(m, behind) {
    const th = TILE[m.theme], x0 = Math.floor(G.cam / TS) - 1, x1 = x0 + 18;
    for (let tx = x0; tx <= x1; tx++) for (let ty = 0; ty < ROWS; ty++) {
      if (tx < 0 || tx >= m.w) continue;
      const t = m.t[ty * m.w + tx]; if (!t || t === T_HIDDEN) continue;
      let img = null, dy = 0;
      const b = G.bumps.find((q) => q.tx === tx && q.ty === ty); if (b) dy = -[0, 3, 5, 6, 6, 5, 4, 3, 2, 1][b.t] || 0;
      switch (t) {
        case T_GROUND: img = tileAt(m, tx, ty - 1) === T_GROUND || ty === 0 ? th.fill : th.top; break;
        case T_BRICK: img = th.brick; break;
        case T_BOX: img = TILE.box[[0, 0, 1, 2, 1][(G.frame >> 3) % 5]]; break;
        case T_USED: case T_BARBASE: img = TILE.used; break;
        case T_CRATE: img = TILE.crate; break;
        case T_STL: img = TILE.stumpTop; break;
        case T_SBL: img = TILE.stumpBody; break;
        case T_SIDET: img = TILE.stumpSide; break;
        case T_TREEL: img = TILE.treeL; break; case T_TREEM: img = TILE.treeM; break; case T_TREER: img = TILE.treeR; break;
        case T_TRUNK: img = TILE.trunk; break;
        case T_BRIDGE: img = TILE.bridge; break;
        case T_FOAM: img = tileAt(m, tx, ty - 1) === T_FOAM ? TILE.foamDeep : TILE['foam' + ((G.frame >> 4) & 1)]; break;
        case T_POLE: img = TILE.pole; break; case T_POLETOP: img = TILE.poleTop; break;
      }
      if (img) sg.drawImage(img, tx * TS - Math.round(G.cam), ty * TS + dy);
    }
  }
  function drawDecor(m) {
    for (const d of m.decor) { const c = DECOR[d.k]; if (!c) continue; const x = Math.round(d.x - G.cam); if (x > VW || x + c.width < 0) continue; sg.drawImage(c, x, d.y); }
    if (m.tent) {
      const x = Math.round(m.tent.x - G.cam);
      if (x < VW && x + 80 > 0) { sg.drawImage(DECOR.pennant, x + 41, m.tent.y + 1 - G.flagY); sg.drawImage(DECOR.tent, x, m.tent.y); }
    }
  }
  function carrieSprite() {
    const big = P.power !== 'small';
    let pal = P.power === 'ball' ? 'ball' : 'normal';
    if (P.star > 0) pal = ['star1', 'star2', 'star3', P.power === 'ball' ? 'ball' : 'normal'][(G.frame >> (P.star < 120 ? 3 : 1)) % 4];
    let pose = 'stand';
    if (G.state === 'pole' && G.stage === 0) pose = 'jump';
    else if (!P.onGround && G.state === 'play') pose = 'jump';
    else if (P.duck) pose = 'duck';
    else if (P.skid) pose = big ? 'walk2' : 'walk2';
    else if (Math.abs(P.vx) > 0.05 || G.state === 'walkout' || (G.state === 'pole' && G.stage === 2) || (G.state === 'warp' && G.warp && G.warp.kind === 'right')) {
      const f = Math.floor(P.anim) % (big ? 3 : 4); pose = big ? ['walk1', 'walk2', 'stand'][f] : ['walk1', 'walk2', 'walk3', 'walk2'][f];
    }
    if (!big && pose === 'duck') pose = 'stand';
    return (big ? 'cb_' : 'cs_') + pose + '_' + pal;
  }
  function drawCarrie() {
    if (P.hidden) return;
    if (G.state === 'dying') { spr('cs_die', P.x + P.w / 2 - 8, P.y + P.h - 16); return; }
    if (P.invuln > 0 && (G.frame >> 1) % 2 && G.state === 'play') return;
    let name = carrieSprite(), big = P.power !== 'small';
    if (G.state === 'grow') { const showTo = (G.growT >> 2) % 2 === 1; const pw = showTo ? G.growTo : G.growFrom; big = pw !== 'small'; name = (big ? 'cb_stand_' : 'cs_stand_') + (pw === 'ball' ? 'ball' : 'normal'); }
    const w = big ? 24 : 16;
    spr(name, P.x + P.w / 2 - w / 2, P.y + P.h - w, P.face < 0);
  }
  function drawEnt(e) {
    const f8 = (G.frame >> 3) & 1;
    switch (e.type) {
      case 'vac':
        if (e.dead === 'squash') spr('vacflat', e.x - 1, e.y - 2); else spr(f8 ? 'vac2' : 'vac1', e.x - 1, e.y - 2, false, e.dead === 'flip'); break;
      case 'hog': case 'hogb': {
        const left = e.vx < 0 || (e.vx === 0 && P.x < e.x);
        let n = e.state === 'ball' ? 'hogball' : e.state === 'peek' ? ((G.frame >> 2) & 1 ? 'hogpeek' : 'hogball') : e.state === 'roll' ? ((G.frame >> 2) & 1 ? 'hogball2' : 'hogball') : f8 ? 'hog2' : 'hog1';
        if (e.dead) n = 'hogball';
        if (e.type === 'hogb' && !e.dead) spr('balloon', e.x - 1 + (left ? 2 : -2), e.y - 16, false);
        spr(n, e.x - 1, e.y - 2, left, e.dead === 'flip'); break;
      }
      case 'coin': spr('coin' + ((G.frame >> 3) % 4), e.x - 4, e.y - 2); break;
      case 'coinpop': spr('coin' + ((G.frame >> 1) % 4), e.x - 4, e.y - 2); break;
      case 'item': {
        const n = e.kind === 'tball' ? 'tball' + (1 + ((G.frame >> 2) % 3)) : e.kind === 'collar' ? 'collar' + (1 + ((G.frame >> 2) % 3)) : e.kind;
        if (e.emerge > 0) { const vis = 16 - e.emerge; sg.save(); sg.beginPath(); sg.rect(Math.round(e.x - G.cam), Math.round(e.y), 16, Math.ceil(vis)); sg.clip(); spr(n, e.x, e.y); sg.restore(); }
        else spr(n, e.x, e.y); break;
      }
      case 'weasel': spr(f8 ? 'weasel1' : 'weasel2', e.x, e.baseY - (24 - e.off), false, e.dead === 'flip'); break;
      case 'bubble': if (e.y < 250) spr('bubble', e.x - 1, e.y - 1, false, e.vy > 0); break;
      case 'king': spr(e.flash > 0 && (G.frame >> 1) & 1 ? 'king_hurt' : 'king', e.x - 2, e.y - 2, e.face > 0, e.dead === 'flip'); break;
      case 'puff': spr('puff', e.x, e.y - 1, e.vx > 0); break;
    }
  }
  function render() {
    const m = G.map;
    sg.setTransform(1, 0, 0, 1, 0, 0);
    if (G.state === 'intro' || G.state === 'over' || G.state === 'win') { drawIntro(); return; }
    sg.fillStyle = THEMES[m.theme].sky; sg.fillRect(0, 0, VW, VH);
    drawDecor(m);
    // things that hide behind blocks and stumps
    for (const e of m.ents) if (e.active && !e.gone && ((e.type === 'item' && e.emerge > 0) || e.type === 'weasel')) drawEnt(e);
    if (P.behind) drawCarrie();
    drawTiles(m);
    if (m.pole) { const px = m.pole.x * TS - 9 - Math.round(G.cam); sg.drawImage(SPR.rosette.r, px, G.rosY); }
    if (m.plug && !m.plugGone) sg.drawImage(TILE.plug, Math.round(m.plug.x - G.cam), m.plug.y);
    if (m.puppy) spr('puppy', m.puppy.x, m.puppy.y);
    for (const l of m.lifts) for (let i = 0; i < l.w; i += 16) sg.drawImage(TILE.lift, Math.round(l.x + i - G.cam), Math.round(l.y));
    for (const b of m.bars) for (let i = 1; i < b.n; i++) sg.drawImage(SPR.bubsmall.r, Math.round(b.cx + Math.cos(b.a) * i * 8 - 4 - G.cam), Math.round(b.cy + Math.sin(b.a) * i * 8 - 4));
    for (const e of m.ents) if (e.active && !e.gone && !(e.type === 'item' && e.emerge > 0) && e.type !== 'weasel') drawEnt(e);
    for (const s of G.shots) sg.drawImage(SPR.shot.r, Math.round(s.x - G.cam), Math.round(s.y));
    if (!P.behind) drawCarrie();
    for (const p of G.parts) {
      if (p.k === 'debris') sg.drawImage(SPR.debris.r, Math.round(p.x - G.cam), Math.round(p.y));
      else if (p.k === 'poof' || p.k === 'pop') { sg.fillStyle = p.k === 'pop' ? '#d82800' : '#fcfcfc'; const r = 2 + (p.t - 100) / 3; for (let a = 0; a < 6; a++) sg.fillRect(Math.round(p.x + 4 + Math.cos(a) * r * 2 - G.cam), Math.round(p.y + 4 + Math.sin(a) * r * 2), 2, 2); if (p.t > 110) p.y = 999; }
    }
    for (const p of G.pops) text(sg, p.text, Math.round(p.x - G.cam), Math.round(p.y), '#fcfcfc', 'left', '#181818');
    if (G.state === 'thanks') {
      text(sg, 'ĎAKUJEM, CARRIE!', 128, 72, '#fcfcfc', 'center', '#181818');
      if (G.timer > 70) { text(sg, 'ALE ROZETA BIS JE', 128, 96, '#fcfcfc', 'center', '#181818'); text(sg, 'NA INOM VÝSTAVISKU!', 128, 108, '#fcfcfc', 'center', '#181818'); }
    }
    if (G.state !== 'title') drawHud();
  }
  function drawHud() {
    const sh = '#181818';
    text(sg, 'CARRIE', 16, 10, '#fcfcfc', 'left', sh); text(sg, String(G.score).padStart(6, '0'), 16, 20, '#fcfcfc', 'left', sh);
    sg.drawImage(SPR['coin' + ((G.frame >> 4) % 2 ? 0 : 1)].r, 82, 16); text(sg, '×' + String(G.coins).padStart(2, '0'), 94, 20, '#fcfcfc', 'left', sh);
    text(sg, 'SVET', 144, 10, '#fcfcfc', 'left', sh); text(sg, LEVELS[G.li].id, 150, 20, '#fcfcfc', 'left', sh);
    text(sg, 'ČAS', 206, 10, '#fcfcfc', 'left', sh); if (G.state !== 'title') text(sg, String(G.time).padStart(3, '0'), 209, 20, G.hurry && (G.frame >> 4) & 1 ? '#f8b800' : '#fcfcfc', 'left', sh);
  }
  function drawIntro() {
    sg.fillStyle = '#000'; sg.fillRect(0, 0, VW, VH);
    drawHud();
    if (G.state === 'intro') {
      text(sg, 'SVET ' + LEVELS[G.li].id, 128, 84, '#fcfcfc', 'center');
      text(sg, LEVELS[G.li].name, 128, 98, '#f8b800', 'center');
      sg.drawImage(SPR.cs_stand_normal.r, 104, 116); text(sg, '× ' + G.lives, 126, 122, '#fcfcfc', 'left');
    } else if (G.state === 'over') text(sg, 'KONIEC HRY', 128, 110, '#fcfcfc', 'center');
    else { text(sg, 'SVET 1 HOTOVÝ!', 128, 100, '#f8b800', 'center'); }
  }

  // =====================================================================================
  // Screen layout, input, menus
  // =====================================================================================
  const $ = (id) => document.getElementById(id);
  const cv = $('game'), ctx = cv.getContext('2d');
  const touchUI = matchMedia('(pointer: coarse)').matches;
  function layout() {
    const W = innerWidth, H = innerHeight, portrait = H > W * 1.05;
    const sTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sat')) || 0;
    let availW = W, availH = H, top;
    const ctrlH = touchUI ? 236 : 16;
    if (portrait) { availH = H - 64 - sTop - ctrlH; }
    else { availW = W - (touchUI ? 300 : 0); availH = H - (touchUI ? 8 : 0); }
    let s = Math.min(availW / VW, availH / VH); if (s >= 2 && Math.floor(s) / s > 0.84) s = Math.floor(s); s = Math.max(1, s);
    const cw = Math.round(VW * s), ch = Math.round(VH * s);
    top = portrait ? Math.round(64 + sTop + Math.max(0, (H - 64 - sTop - ctrlH - ch) / 2)) : Math.round((H - ch) / 2);
    Object.assign(cv.style, { width: cw + 'px', height: ch + 'px', left: Math.round((W - cw) / 2) + 'px', top: top + 'px' });
    const dpr = Math.min(3, window.devicePixelRatio || 1); cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    ctx.imageSmoothingEnabled = false;
    document.body.classList.toggle('portrait', portrait); document.body.classList.toggle('touch', touchUI);
    $('tc').style.setProperty('--below', portrait ? top + ch + 'px' : '0px');
  }
  addEventListener('resize', layout);

  const KB = {}, TOUCH = {}, PAD = {};
  const KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowDown: 'down', KeyS: 'down', ArrowUp: 'jump', KeyW: 'jump', Space: 'jump', KeyK: 'jump', KeyX: 'jump',
    ShiftLeft: 'run', ShiftRight: 'run', KeyZ: 'run', KeyJ: 'run', KeyC: 'run' };
  let prevJump = false, prevRun = false;
  function combineInput() {
    for (const k of ['left', 'right', 'down', 'jump', 'run']) INPUT[k] = !!(KB[k] || TOUCH[k] || PAD[k]);
    if (INPUT.jump && !prevJump) INPUT.jumpBuf = 6;
    if (INPUT.run && !prevRun) INPUT.runPressed = true;
    prevJump = INPUT.jump; prevRun = INPUT.run;
  }
  addEventListener('keydown', (e) => {
    const k = KEYS[e.code];
    if (k || e.code === 'Space') e.preventDefault();
    if (e.code === 'Escape' || e.code === 'KeyP') { if (G.state !== 'title') togglePause(); return; }
    if (e.code === 'KeyM') { toggleSound(); return; }
    if ((e.code === 'Enter' || e.code === 'Space') && G.state === 'title' && !$('start').hidden && !e.repeat) { e.preventDefault(); newGame(0); return; }
    if (k) { KB[k] = true; if (paused && !e.repeat) togglePause(); }
  });
  addEventListener('keyup', (e) => { const k = KEYS[e.code]; if (k) KB[k] = false; });
  addEventListener('blur', () => { for (const k in KB) KB[k] = false; for (const k in TOUCH) TOUCH[k] = false; });
  // touch: a rocker for left / right / down (slide your thumb across) and two round buttons
  const rocker = $('rocker'), ptr = new Map();
  function rockerZones() { TOUCH.left = TOUCH.right = TOUCH.down = false; for (const z of ptr.values()) if (z) TOUCH[z] = true; for (const b of rocker.children) b.classList.toggle('on', !!TOUCH[b.dataset.k]); }
  function zoneAt(e) { const r = rocker.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; if (y > 0.62 && x > 0.28 && x < 0.72) return 'down'; return x < 0.5 ? 'left' : 'right'; }
  rocker.addEventListener('pointerdown', (e) => { e.preventDefault(); try { rocker.setPointerCapture(e.pointerId); } catch {} ptr.set(e.pointerId, zoneAt(e)); rockerZones(); if (paused) togglePause(); });
  rocker.addEventListener('pointermove', (e) => { if (!ptr.has(e.pointerId)) return; ptr.set(e.pointerId, zoneAt(e)); rockerZones(); });
  for (const ev of ['pointerup', 'pointercancel']) rocker.addEventListener(ev, (e) => { ptr.delete(e.pointerId); rockerZones(); });
  for (const b of document.querySelectorAll('.act')) {
    const k = b.dataset.k;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch {} TOUCH[k] = true; b.classList.add('on'); if (paused) togglePause(); try { navigator.vibrate && navigator.vibrate(6); } catch {} });
    for (const ev of ['pointerup', 'pointercancel']) b.addEventListener(ev, () => { TOUCH[k] = false; b.classList.remove('on'); });
  }
  function readPad() {
    const gp = navigator.getGamepads ? [...navigator.getGamepads()].find(Boolean) : null;
    for (const k of ['left', 'right', 'down', 'jump', 'run']) PAD[k] = false;
    if (!gp) return;
    const b = (i) => gp.buttons[i] && gp.buttons[i].pressed, ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
    PAD.left = b(14) || ax < -0.4; PAD.right = b(15) || ax > 0.4; PAD.down = b(13) || ay > 0.5; PAD.jump = b(0) || b(1); PAD.run = b(2) || b(3);
    if (G.state === 'title' && (b(9) || b(0)) && !$('start').hidden) newGame(0);
  }

  // ---------- menus
  let paused = false;
  function save() { try { localStorage.setItem('carrie-mario-best', String(G.best)); localStorage.setItem('carrie-mario-reached', String(G.reached)); } catch {} }
  try { G.best = Number(localStorage.getItem('carrie-mario-best')) || 0; G.reached = Math.min(LEVELS.length - 1, Number(localStorage.getItem('carrie-mario-reached')) || 0); } catch {}
  function showCard(id) { for (const c of ['start', 'who', 'pause', 'over']) $(c).hidden = c !== id; }
  function refreshStart() {
    $('cont').hidden = G.reached <= 0; $('contLvl').textContent = LEVELS[G.reached].id + ' ' + LEVELS[G.reached].name;
    $('bestHud').textContent = G.best;
  }
  function newGame(li) {
    if (soundWanted() && !audio.isOn) toggleSound();
    unlockSession();
    G.score = 0; G.coins = 0; G.lives = 3; G.checkpoint = false; P.power = 'small';
    showCard(null); $('pauseBtn').hidden = false; document.body.classList.add('playing');
    startLevel(li); cv.focus({ preventScroll: true });
  }
  function finishGame(won) {
    const isNew = G.score > G.best; if (isNew) G.best = G.score; save(); G.state = won ? 'win' : 'over'; music(0.015); sfx(won ? 'clear' : 'over');
    $('pauseBtn').hidden = true; document.body.classList.remove('playing');
    setTimeout(() => {
      $('overTitle').textContent = won ? 'Svet 1 je hotový!' : 'Koniec hry';
      $('overNote').textContent = won ? 'Rozeta BIS čaká v ďalšom svete. Ten sa ešte stavia, Carrie už trénuje.' : 'Vysávače tentoraz vyhrali. Skús to znova, Carrie to zvládne.';
      $('finalScore').textContent = G.score; $('finalLvl').textContent = LEVELS[G.li].id; $('newBest').hidden = !isNew; $('bestHud').textContent = G.best;
      $('retry').textContent = won ? 'Hrať od začiatku' : 'Skúsiť znova od ' + LEVELS[G.li].id; $('retry').dataset.li = won ? 0 : G.li;
      showCard('over'); $('retry').focus({ preventScroll: true });
    }, 1400);
  }
  function togglePause() {
    if (['title', 'over', 'win'].includes(G.state)) return;
    paused = !paused; $('pause').hidden = !paused; music(paused ? 0 : G.state === 'play' ? 0.03 : 0);
  }
  function toggleSound() { const on = audio.toggle(); $('icoOn').hidden = !on; $('icoOff').hidden = on; $('mute').setAttribute('aria-label', on ? 'Vypnúť zvuk a hudbu' : 'Zapnúť zvuk a hudbu'); if (on && G.state === 'play' && !paused) music(0.03); }
  $('mute').addEventListener('click', toggleSound);
  $('play').addEventListener('click', () => newGame(0));
  $('cont').addEventListener('click', () => newGame(G.reached));
  $('whoBtn').addEventListener('click', () => showCard('who'));
  $('whoBack').addEventListener('click', () => { showCard('start'); refreshStart(); });
  $('resume').addEventListener('click', togglePause);
  $('quit').addEventListener('click', () => { paused = false; G.state = 'title'; G.cam = 0; loadTitle(); showCard('start'); refreshStart(); $('pauseBtn').hidden = true; document.body.classList.remove('playing'); music(0); });
  $('pauseBtn').addEventListener('click', togglePause);
  $('retry').addEventListener('click', () => newGame(Number($('retry').dataset.li) || 0));
  $('toTitle').addEventListener('click', () => { G.state = 'title'; loadTitle(); showCard('start'); refreshStart(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (G.state !== 'title' && !paused && !['over', 'win'].includes(G.state)) togglePause(); audio.suspend(); } else audio.wake(); last = 0; });
  try { const r = document.referrer && new URL(document.referrer); if (r && r.origin === location.origin && r.pathname !== location.pathname) $('home').href = r.pathname; } catch {}
  // who is who: the cast drawn from the game's own sprites
  function fillWho() {
    const list = [
      ['cs_stand_normal', 'Carrie', 'Beží, skáče a zbiera granule.'], ['vac1', 'Robotický vysávač', 'Skoč naň a zastaví sa.'],
      ['hog1', 'Ježko', 'Po skoku sa zvinie do klbka. Klbko sa dá kopnúť.'], ['balloon', 'Ježko s balónikom', 'Poskakuje. Skokom mu praskne balónik.'],
      ['weasel1', 'Lasica v pni', 'Vykúka z dutých pňov. Neskáč na ňu.'], ['bubble', 'Mydlová bublina', 'Vyskakuje z horúcej peny v kúpeľni.'],
      ['king', 'Kráľ Vysávač', 'Pán kúpeľne. Vytiahni zátku za ním.'], ['puppy', 'Šteniatko kamarát', 'Čaká na konci kúpeľne.'],
      ['coin0', 'Zlatá granula', '100 granúl je život navyše.'], ['sausage', 'Klobása', 'Carrie vyrastie a vydrží jeden zásah.'],
      ['tball1', 'Tenisová loptička', 'Veľká Carrie potom hádže loptičky (Shift alebo B).'], ['collar1', 'Zlatý obojok', 'Na chvíľu je Carrie neporaziteľná.'],
      ['life', 'Zelená kosť', 'Život navyše.'], ['rosette', 'Rozeta na stĺpe', 'Čím vyššie skočíš, tým viac bodov.'],
    ];
    const tiles = [[TILE.box[0], 'Krabica s kostičkou', 'Skryté granule a dobroty. Udri do nej zospodu.'], [TILE.garden.brick, 'Balík sena', 'Veľká Carrie ho rozbije.'],
      [TILE.stumpTop, 'Dutý peň', 'Do niektorých sa dá vliezť šípkou dole.'], [TILE.crate, 'Drevená debna', 'Schody k cieľu.'], [DECOR.tent, 'Výstavný stan', 'Cieľ levelu.']];
    const ul = $('cast'); ul.innerHTML = '';
    const add = (cvs, name, note) => { const li = document.createElement('li'); const img = document.createElement('img'); img.src = cvs.toDataURL(); img.alt = ''; const d = document.createElement('div'); const b = document.createElement('b'); b.textContent = name; const s = document.createElement('span'); s.textContent = note; d.append(b, s); li.append(img, d); ul.append(li); };
    const hb = canvas(16, 30), hg = hb.getContext('2d'); hg.drawImage(SPR.balloon.r, 1, 0); hg.drawImage(SPR.hog1.l, 0, 14);
    for (const [k, n, t] of list) add(k === 'balloon' ? hb : SPR[k].r, n, t);
    for (const [c, n, t] of tiles) add(c, n, t);
  }

  // ---------- title backdrop: the first garden, scrolling slowly
  function loadTitle() { const L = LEVELS[0].build(); G.maps = { main: L.main }; prepMap(L.main); enterMap('main'); G.li = 0; P.hidden = true; G.bumps = []; G.pops = []; G.parts = []; G.shots = []; }

  // ---------- main loop (fixed 60 steps per second, also on 120 Hz phones)
  let last = 0, acc = 0;
  function frame(now) {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    if (!paused) {
      acc += dt;
      while (acc >= 1 / 60) { readPad(); combineInput(); step(); acc -= 1 / 60; }
    }
    render();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(scr, 0, 0, cv.width, cv.height);
    requestAnimationFrame(frame);
  }
  function drawLogo() { const lg = $('logo'); lg.width = 72; lg.height = 12; const g = lg.getContext('2d'); text(g, 'SUPER', 0, 4, '#d82800', 'left', '#000'); text(g, 'CARRIE', 36, 4, '#f8b800', 'left', '#000'); }
  if (touchUI) $('keys').innerHTML = '<b>◀ ▶</b> beh · <b>A</b> skok · <b>B</b> rýchly beh a hod loptičky · <b>▼</b> do pňa';
  buildGfx(); drawLogo(); fillWho(); loadTitle(); layout(); refreshStart(); showCard('start');
  requestAnimationFrame(frame);
  window.__sc = { G, P, INPUT, KB, LEVELS, newGame, startLevel, setPower, step, tileAt };
