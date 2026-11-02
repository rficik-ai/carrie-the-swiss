  // =====================================================================================
  // Engine: fixed 60 Hz steps, physics in pixels per frame (tuned to feel like the 8-bit classics)
  // =====================================================================================
  const TS = 16, VW = 256, VH = 240;
  const G = {
    state: 'title', li: 0, score: 0, coins: 0, lives: 3, time: 400, tick: 0, frame: 0, cam: 0, maps: null, map: null, mapName: 'main', checkpoint: false,
    bumps: [], pops: [], parts: [], shots: [], timer: 0, stage: 0, rosY: 48, flagY: 0, hurry: false, warp: null, bridgeX: 0, growT: 0, growTo: 'big', best: 0, reached: 0,
  };
  const P = { x: 0, y: 0, w: 12, h: 14, vx: 0, vy: 0, face: 1, onGround: false, power: 'small', duck: false, skid: false, gHold: 0.125, gRel: 0.4375, runJump: false,
    coyote: 0, invuln: 0, star: 0, chain: 0, anim: 0, onLift: null, hidden: false, behind: false, deadT: 0, wasGround: false };
  const INPUT = { left: false, right: false, up: false, down: false, jump: false, run: false, jumpBuf: 0, runPressed: false };

  const tileAt = (m, tx, ty) => (tx < 0 || tx >= m.w ? T_GROUND : ty < 0 || ty >= ROWS ? T_AIR : m.t[ty * m.w + tx]);
  const solidAt = (m, tx, ty) => SOLID.has(tileAt(m, tx, ty));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const CHAIN = [100, 200, 400, 500, 800, 1000, 2000, 4000, 5000, 8000];

  function addScore(n, x, y) { G.score += n; if (x != null) G.pops.push({ text: String(n), x, y, t: 0 }); }
  function addLife(x, y) { G.lives = Math.min(99, G.lives + 1); sfx('life'); if (x != null) G.pops.push({ text: '1UP', x, y, t: 0 }); }
  function addCoin() { G.coins++; G.score += 200; sfx('coin'); if (G.coins >= 100) { G.coins -= 100; addLife(); } }
  function chainScore(n, x, y) { if (n >= CHAIN.length) addLife(x, y); else addScore(CHAIN[n], x, y); }

  // ---------- size and power
  function setPower(pw) {
    const bottom = P.y + P.h, cx = P.x + P.w / 2; P.power = pw;
    const big = pw !== 'small'; P.w = big ? 14 : 12; P.h = big ? 22 : 14; P.duck = false;
    P.x = cx - P.w / 2; P.y = bottom - P.h;
  }
  function setDuck(on) {
    if (on === P.duck || P.power === 'small') return;
    const bottom = P.y + P.h;
    if (!on) { // stand up only if there is room
      const x0 = Math.floor(P.x / TS), x1 = Math.floor((P.x + P.w - 0.01) / TS), ty = Math.floor((bottom - 22) / TS);
      for (let tx = x0; tx <= x1; tx++) if (solidAt(G.map, tx, ty)) return;
    }
    P.duck = on; P.h = on ? 14 : 22; P.y = bottom - P.h;
  }

  // ---------- levels and maps
  function prepMap(m) {
    m.ents = m.specs.map(makeEnt).filter(Boolean);
    for (const l of m.lifts) { l.dir = 1; l.dx = 0; l.dy = 0; }
    m.plugGone = false;
  }
  function makeEnt(s) {
    const e = { type: s.type, active: false, vx: 0, vy: 0, t: 0, state: 'walk' };
    switch (s.type) {
      case 'vac': return Object.assign(e, { x: s.x + 1, y: s.y + 2, w: 14, h: 14, vx: -0.5 });
      case 'hog': return Object.assign(e, { x: s.x + 1, y: s.y + 2, w: 14, h: 14, vx: -0.5 });
      case 'hogb': return Object.assign(e, { x: s.x + 1, y: s.y + 2, w: 14, h: 14, vx: -0.5, state: 'fly' });
      case 'coin': return Object.assign(e, { x: s.x + 4, y: s.y + 2, w: 8, h: 12 });
      case 'weasel': return Object.assign(e, { x: s.x, baseY: s.y, y: s.y, w: 12, h: 0, off: 24, phase: 0 });
      case 'bubble': return Object.assign(e, { x: s.x + 1, baseY: s.y, y: 260, w: 14, h: 14, t: -(s.delay || 0) });
      case 'king': return Object.assign(e, { x: s.x, y: s.y + 2, w: 28, h: 30, hp: 5, minX: s.x - 8 * TS, maxX: s.x + 2 * TS, fireT: 90, dirT: 60, face: -1, flash: 0 });
    }
    return null;
  }
  function loadLevel(li) {
    const L = LEVELS[li], built = L.build();
    G.maps = { main: built.main, ...built.rooms }; for (const k in G.maps) prepMap(G.maps[k]);
    G.li = li; G.time = L.time; G.tick = 0; G.hurry = false; G.bumps = []; G.pops = []; G.parts = []; G.shots = []; G.flagY = 0; G.rosY = 48;
    enterMap('main');
    const m = G.map; let sx = m.start.x, sy = m.start.y;
    if (G.checkpoint && m.check) {
      sx = m.check * TS + 2; let best = 13;
      for (let ty = 1; ty < ROWS; ty++) { const t = tileAt(m, m.check, ty); if ((SOLID.has(t) || ONEWAY.has(t)) && tileAt(m, m.check, ty - 1) === T_AIR) best = ty; }
      sy = best * TS - 16;
    }
    P.x = sx; P.y = sy; P.vx = 0; P.vy = 0; P.face = 1; P.hidden = false; P.behind = false; P.invuln = 0; P.star = 0; P.onLift = null; P.duck = false;
    setPower(P.power); P.y = Math.min(P.y, sy + 14 - P.h);
    G.cam = clamp(P.x - 40, 0, m.w * TS - VW);
    setMusicRate(1);
  }
  function enterMap(name) { G.mapName = name; G.map = G.maps[name]; }
  function startLevel(li) { loadLevel(li); G.state = 'intro'; G.timer = 140; music(0); }
  function nextLevel() {
    G.checkpoint = false;
    if (G.li + 1 > G.reached) { G.reached = Math.min(LEVELS.length - 1, G.li + 1); save(); }
    if (G.li + 1 >= LEVELS.length) { finishGame(true); return; }
    startLevel(G.li + 1);
  }

  // ---------- one frame
  function step() {
    G.frame++;
    switch (G.state) {
      case 'play': updatePlay(); break;
      case 'grow': updateGrow(); break;
      case 'dying': updateDying(); break;
      case 'warp': updateWarp(); break;
      case 'pole': updatePole(); break;
      case 'tally': updateTally(); break;
      case 'bridge': updateBridge(); break;
      case 'walkout': updateWalkout(); break;
      case 'thanks': updateThanks(); break;
      case 'intro': if (--G.timer <= 0) { G.state = 'play'; music(0.03); } break;
      case 'title': G.cam = (G.cam + 0.3) % (60 * TS); break;
    }
    for (const p of G.pops) { p.t++; p.y -= 0.6; } G.pops = G.pops.filter((p) => p.t < 50);
    for (const p of G.parts) { p.vy += 0.3; p.x += p.vx; p.y += p.vy; p.t++; } G.parts = G.parts.filter((p) => p.y < 280 && p.t < 120);
    INPUT.jumpBuf = Math.max(0, INPUT.jumpBuf - 1); INPUT.runPressed = false;
  }

  function updatePlay() {
    const m = G.map;
    updateLifts(m);
    playerPhysics(m);
    if (G.state !== 'play') return;
    updateShots(m);
    updateEnts(m);
    if (G.state !== 'play') return;
    updateBars(m);
    for (const b of G.bumps) b.t++; G.bumps = G.bumps.filter((b) => b.t < 10);
    if (++G.tick >= 24) {
      G.tick = 0;
      if (G.time > 0) { G.time--; if (G.time === 100) { G.hurry = true; sfx('hurry'); setMusicRate(1.25); } if (G.time === 0) { killPlayer(); return; } }
    }
    if (P.x - G.cam > 112) G.cam = Math.min(P.x - 112, m.w * TS - VW);
    G.cam = Math.max(0, Math.min(G.cam, m.w * TS - VW));
    if (G.mapName === 'main' && m.check && P.x > m.check * TS) G.checkpoint = true;
    P.invuln = Math.max(0, P.invuln - 1);
    if (P.star > 0) P.star--;
    if (m.pole && P.x + P.w >= m.pole.x * TS + 6) startPole(m);
    else if (m.plug && !m.plugGone && P.x + P.w >= m.plug.x + 3) startBridge(m);
  }

  // ---------- Carrie
  function playerPhysics(m) {
    const inp = INPUT, dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0), running = inp.run;
    if (P.onLift) { P.x += P.onLift.dx; P.y += P.onLift.dy; }
    // duck (big only), like the classics: lying low, sliding on
    setDuck(P.power !== 'small' && inp.down && P.onGround ? true : P.duck && !P.onGround ? true : false);
    if (P.onGround) {
      P.runJump = running && Math.abs(P.vx) > 1.6;
      if (dir && !P.duck) {
        if (P.vx * dir < 0) { P.vx += dir * 0.1016; P.skid = true; P.face = dir; }
        else {
          P.skid = false; P.face = dir;
          const max = running ? 2.5625 : 1.5625, acc = running ? 0.0557 : 0.0371;
          if (Math.abs(P.vx) < max) { P.vx += dir * acc; if (Math.abs(P.vx) > max) P.vx = dir * max; }
          else { P.vx -= Math.sign(P.vx) * 0.0508; if (Math.abs(P.vx) < max) P.vx = dir * max; }
        }
      } else { P.skid = false; if (Math.abs(P.vx) <= 0.0508) P.vx = 0; else P.vx -= Math.sign(P.vx) * 0.0508; }
    } else if (dir) {
      const max = P.runJump ? 2.5625 : 1.5625, acc = P.vx * dir < 0 ? 0.0557 : running ? 0.0557 : 0.0371;
      P.vx += dir * acc; if (Math.abs(P.vx) > max) P.vx = Math.sign(P.vx) * max;
    }
    // jump: higher when running, higher the longer the button is held
    if (inp.jumpBuf > 0 && (P.onGround || P.coyote > 0)) {
      inp.jumpBuf = 0; const sp = Math.abs(P.vx);
      if (sp < 1) { P.vy = -4.2; P.gHold = 0.125; P.gRel = 0.4375; }
      else if (sp < 2.3125) { P.vy = -4.2; P.gHold = 0.1172; P.gRel = 0.375; }
      else { P.vy = -5.1; P.gHold = 0.15625; P.gRel = 0.5625; }
      P.onGround = false; P.coyote = 0; P.onLift = null; P.runJump = sp > 1.6 && running; sfx(P.power === 'small' ? 'jump' : 'jumpBig');
    }
    P.vy += P.vy < 0 && inp.jump ? P.gHold : P.gRel; if (P.vy > 4.5) P.vy = 4.5;
    // throw a tennis ball
    if (inp.runPressed && P.power === 'ball' && G.shots.length < 2 && !P.duck) {
      G.shots.push({ x: P.face > 0 ? P.x + P.w : P.x - 8, y: P.y + 4, vx: P.face * 4, vy: 2, t: 0 }); sfx('shot');
    }
    // move
    P.wasGround = P.onGround;
    moveX(m); moveY(m);
    if (P.onGround) { P.chain = 0; P.coyote = 5; } else if (P.coyote > 0) P.coyote--;
    P.anim += P.onGround ? Math.abs(P.vx) * 0.11 : 0;
    // dangers: pits and hot foam
    if (P.y > VH + 8) { killPlayer(true); return; }
    const fx0 = Math.floor((P.x + 3) / TS), fx1 = Math.floor((P.x + P.w - 3) / TS), fy = Math.floor((P.y + P.h - 2) / TS);
    for (let tx = fx0; tx <= fx1; tx++) if (tileAt(m, tx, fy) === T_FOAM) { killPlayer(true); return; }
    // stumps you can go into
    for (const w of m.warps) {
      if (w.kind === 'down' && inp.down && P.onGround && Math.abs(P.y + P.h - w.y * TS) < 0.5) {
        const cx = P.x + P.w / 2; if (cx >= w.x * TS + 6 && cx <= w.x * TS + 26) { startWarp(w); return; }
      }
      if (w.kind === 'right' && inp.right && P.onGround && P.x + P.w >= w.x * TS - 1 && Math.abs(P.y + P.h - (w.y + 2) * TS) < 0.5) { startWarp(w); return; }
    }
  }
  function moveX(m) {
    P.x += P.vx;
    if (P.x < G.cam) { P.x = G.cam; if (P.vx < 0) P.vx = 0; }
    const y0 = Math.floor(P.y / TS), y1 = Math.floor((P.y + P.h - 0.01) / TS);
    if (P.vx > 0 || (P.vx === 0 && INPUT.right)) {
      const tx = Math.floor((P.x + P.w) / TS);
      for (let ty = y0; ty <= y1; ty++) if (solidAt(m, tx, ty) && P.x + P.w > tx * TS) { P.x = tx * TS - P.w; P.vx = 0; break; }
    }
    if (P.vx < 0 || (P.vx === 0 && INPUT.left)) {
      const tx = Math.floor(P.x / TS);
      for (let ty = y0; ty <= y1; ty++) if (solidAt(m, tx, ty) && P.x < (tx + 1) * TS) { P.x = (tx + 1) * TS; P.vx = 0; break; }
    }
  }
  function moveY(m) {
    const prevBottom = P.y + P.h, prevTop = P.y;
    P.y += P.vy; P.onGround = false;
    const x0 = Math.floor(P.x / TS), x1 = Math.floor((P.x + P.w - 0.01) / TS);
    if (P.vy >= 0) {
      const ty = Math.floor((P.y + P.h) / TS);
      for (let tx = x0; tx <= x1; tx++) {
        const t = tileAt(m, tx, ty);
        if (SOLID.has(t) || (ONEWAY.has(t) && prevBottom <= ty * TS + 0.5)) { P.y = ty * TS - P.h; P.vy = 0; P.onGround = true; break; }
      }
    } else {
      const ty = Math.floor(P.y / TS), hits = [];
      for (let tx = x0; tx <= x1; tx++) { const t = tileAt(m, tx, ty); if (SOLID.has(t) || (t === T_HIDDEN && prevTop >= (ty + 1) * TS - 0.5)) hits.push(tx); }
      if (hits.length) {
        // forgiving corners: slide past a block edge you only clip by a few pixels
        if (hits.length === 1 && tileAt(m, hits[0], ty) !== T_HIDDEN) {
          const tx = hits[0];
          if (tx === x0 && (tx + 1) * TS - P.x <= 4 && !solidAt(m, tx + 1, ty)) { P.x = (tx + 1) * TS; return; }
          if (tx === x1 && P.x + P.w - tx * TS <= 4 && !solidAt(m, tx - 1, ty)) { P.x = tx * TS - P.w; return; }
        }
        P.y = (ty + 1) * TS; P.vy = 1;
        const cx = P.x + P.w / 2; let best = hits[0]; for (const tx of hits) if (Math.abs(tx * TS + 8 - cx) < Math.abs(best * TS + 8 - cx)) best = tx;
        bumpTile(m, best, ty);
      }
    }
    // lifts
    P.onLift = null;
    for (const l of m.lifts) {
      if (P.vy >= 0 && P.x + P.w > l.x + 1 && P.x < l.x + l.w - 1 && prevBottom <= l.y + 1 + Math.max(0, l.dy) && P.y + P.h >= l.y) {
        P.y = l.y - P.h; P.vy = 0; P.onGround = true; P.onLift = l;
      }
    }
  }

  // ---------- blocks
  function bumpTile(m, tx, ty) {
    const i = ty * m.w + tx, t = m.t[i], c = m.content[i];
    if (t === T_BOX || t === T_HIDDEN || (t === T_BRICK && c && c !== 'coins')) {
      m.t[i] = T_USED; delete m.content[i]; release(m, tx, ty, c || 'coin'); G.bumps.push({ tx, ty, t: 0 });
    } else if (t === T_BRICK && c === 'coins') {
      m.coinBricks = m.coinBricks || {}; const st = m.coinBricks[i] || (m.coinBricks[i] = { n: 0, t0: G.frame });
      st.n++; release(m, tx, ty, 'coin'); G.bumps.push({ tx, ty, t: 0 });
      if (st.n >= 10 || G.frame - st.t0 > 260) { m.t[i] = T_USED; delete m.content[i]; }
    } else if (t === T_BRICK) {
      if (P.power !== 'small') {
        m.t[i] = T_AIR; G.score += 50; sfx('break');
        for (const [dx, dy, vx, vy] of [[0, 0, -1.2, -5], [8, 0, 1.2, -5], [0, 8, -1.2, -3.5], [8, 8, 1.2, -3.5]]) G.parts.push({ x: tx * TS + dx, y: ty * TS + dy, vx, vy, t: 0, k: 'debris' });
      } else { G.bumps.push({ tx, ty, t: 0 }); sfx('bump'); }
    } else sfx('bump');
    hitFromBelow(m, tx, ty);
  }
  function release(m, tx, ty, kind) {
    if (kind === 'coin') { addCoin(); m.ents.push({ type: 'coinpop', x: tx * TS + 4, y: ty * TS - 12, w: 8, h: 12, vy: -5, t: 0, active: true }); return; }
    let item = kind === 'power' ? (P.power === 'small' ? 'sausage' : 'tball') : kind === 'star' ? 'collar' : 'life';
    m.ents.push({ type: 'item', kind: item, x: tx * TS, y: ty * TS, w: 16, h: 16, emerge: 16, vx: 0, vy: 0, dir: 1, active: true }); sfx('sprout');
  }
  function hitFromBelow(m, tx, ty) {
    const top = ty * TS, x0 = tx * TS - 2, x1 = tx * TS + 18;
    for (const e of m.ents) {
      if (!e.active || e.gone || e.dead) continue;
      if (Math.abs(e.y + e.h - top) > 3 || e.x + e.w < x0 || e.x > x1) continue;
      if (['vac', 'hog', 'hogb'].includes(e.type)) killEnt(e, e.x + e.w / 2 < tx * TS + 8 ? -1 : 1, 100);
      else if (e.type === 'item' && !e.emerge) { e.vy = -3.5; e.dir = e.x + 8 < tx * TS + 8 ? -1 : 1; }
      else if (e.type === 'coin') { e.gone = true; addCoin(); m.ents.push({ type: 'coinpop', x: e.x, y: e.y, w: 8, h: 12, vy: -5, t: 0, active: true }); }
    }
  }

  // ---------- enemies and items
  function walk(e, m, edgeTurn, grav = 0.25) {
    e.vy = Math.min(e.vy + grav, 4);
    e.x += e.vx; e.hit = false;
    const y0 = Math.floor(e.y / TS), y1 = Math.floor((e.y + e.h - 0.01) / TS);
    if (e.vx > 0) { const tx = Math.floor((e.x + e.w) / TS); for (let ty = y0; ty <= y1; ty++) if (solidAt(m, tx, ty)) { e.x = tx * TS - e.w; e.vx = -e.vx; e.hit = true; break; } }
    else if (e.vx < 0) { const tx = Math.floor(e.x / TS); for (let ty = y0; ty <= y1; ty++) if (solidAt(m, tx, ty)) { e.x = (tx + 1) * TS; e.vx = -e.vx; e.hit = true; break; } }
    const prevB = e.y + e.h; e.y += e.vy; e.onGround = false;
    const x0 = Math.floor(e.x / TS), x1 = Math.floor((e.x + e.w - 0.01) / TS);
    if (e.vy >= 0) {
      const ty = Math.floor((e.y + e.h) / TS);
      for (let tx = x0; tx <= x1; tx++) { const t = tileAt(m, tx, ty); if (SOLID.has(t) || (ONEWAY.has(t) && prevB <= ty * TS + 0.5)) { e.y = ty * TS - e.h; e.vy = 0; e.onGround = true; break; } }
    } else { const ty = Math.floor(e.y / TS); for (let tx = x0; tx <= x1; tx++) if (solidAt(m, tx, ty)) { e.y = (ty + 1) * TS; e.vy = 0; break; } }
    for (const l of m.lifts) if (e.vy >= 0 && e.x + e.w > l.x && e.x < l.x + l.w && prevB <= l.y + 1 + Math.max(0, l.dy) && e.y + e.h >= l.y) { e.y = l.y - e.h; e.vy = 0; e.onGround = true; e.x += l.dx; }
    if (edgeTurn && e.onGround) {
      const ahead = e.vx > 0 ? e.x + e.w + 1 : e.x - 1, t = tileAt(m, Math.floor(ahead / TS), Math.floor((e.y + e.h + 1) / TS));
      if (!SOLID.has(t) && !ONEWAY.has(t)) e.vx = -e.vx;
    }
  }
  function killEnt(e, dir, pts) {
    if (e.type === 'king') { e.hp = 0; }
    e.dead = 'flip'; e.vy = -3.2; e.vx = dir * 0.7; e.t = 0;
    if (pts) addScore(pts, e.x, e.y);
    sfx('kick');
  }
  function deadUpdate(e) {
    if (e.dead === 'squash') { if (++e.t > 30) e.gone = true; return; }
    e.vy += 0.25; e.x += e.vx; e.y += e.vy; if (e.y > VH + 40) e.gone = true;
  }
  const ENT = {
    vac(e, m) { if (e.dead) return deadUpdate(e); walk(e, m, false); },
    hog(e, m) {
      if (e.dead) return deadUpdate(e);
      if (e.state === 'walk') walk(e, m, false);
      else if (e.state === 'ball') { e.vx = 0; walk(e, m, false); if (++e.t > 420) { e.state = 'peek'; e.t = 0; } }
      else if (e.state === 'peek') { e.vx = 0; walk(e, m, false); if (++e.t > 80) { e.state = 'walk'; e.vx = P.x < e.x ? -0.5 : 0.5; } }
      else if (e.state === 'roll') { walk(e, m, false); if (e.hit && Math.abs(e.x - P.x) < 300) sfx('bump'); e.grace = Math.max(0, (e.grace || 0) - 1); }
    },
    hogb(e, m) { if (e.dead) return deadUpdate(e); walk(e, m, false, 0.18); if (e.onGround) e.vy = -3.4; },
    coin() {},
    coinpop(e) { e.vy += 0.45; e.y += e.vy; if (++e.t > 26) { e.gone = true; G.pops.push({ text: '200', x: e.x - 4, y: e.y, t: 0 }); } },
    item(e, m) {
      if (e.emerge > 0) { e.y -= 0.5; e.emerge -= 0.5; return; }
      if (e.kind === 'tball') return;
      if (e.kind === 'collar') { e.vx = e.dir * 1.1; walk(e, m, false, 0.2); if (e.vx !== e.dir * 1.1) e.dir = -e.dir; if (e.onGround) e.vy = -4; return; }
      e.vx = e.dir * 1; walk(e, m, false); if (e.hit) e.dir = -e.dir;
    },
    weasel(e) {
      if (e.dead) return deadUpdate(e);
      const near = Math.abs(P.x + P.w / 2 - (e.x + 8)) < 30;
      e.t++;
      if (e.phase === 0) { if (e.t > 80 && !near) { e.phase = 1; e.t = 0; } }
      else if (e.phase === 1) { e.off -= 0.5; if (e.off <= 0) { e.off = 0; e.phase = 2; e.t = 0; } }
      else if (e.phase === 2) { if (e.t > 80) { e.phase = 3; e.t = 0; } }
      else { e.off += 0.5; if (e.off >= 24) { e.off = 24; e.phase = 0; e.t = 0; } }
      e.y = e.baseY - (24 - e.off); e.h = 24 - e.off;
    },
    bubble(e) {
      if (e.dead) return deadUpdate(e);
      e.t++;
      if (e.y >= 250) { if (e.t > 150) { e.t = 0; e.y = e.baseY; e.vy = -6.3; } return; }
      e.vy += 0.2; e.y += e.vy; if (e.y > e.baseY + 8 && e.vy > 0) { e.y = 260; e.vy = 0; e.t = 0; }
    },
    king(e, m) {
      if (e.dead) return deadUpdate(e);
      if (e.flash > 0) e.flash--;
      e.face = P.x + P.w / 2 < e.x + e.w / 2 ? -1 : 1;
      if (--e.dirT <= 0) { e.dirT = 60 + Math.floor(Math.random() * 90); e.vx = (Math.random() < 0.5 ? -1 : 1) * 0.45; }
      if (e.x < e.minX) e.vx = 0.45; if (e.x > e.maxX) e.vx = -0.45;
      walk(e, m, false, 0.25);
      if (e.onGround && Math.random() < 1 / 200) e.vy = -3.6;
      if (--e.fireT <= 0 && Math.abs(P.x - e.x) < 260) {
        e.fireT = 130 + Math.floor(Math.random() * 70);
        const ty = Math.round((P.y + P.h / 2 - 5) / 8) * 8;
        m.ents.push({ type: 'puff', x: e.face < 0 ? e.x - 20 : e.x + e.w, y: e.y + 10, ty, w: 22, h: 8, vx: e.face * 1.6, active: true }); sfx('puff');
      }
    },
    puff(e) { e.x += e.vx; e.y += clamp(e.ty - e.y, -0.4, 0.4); if (e.x < G.cam - 40 || e.x > G.cam + VW + 40) e.gone = true; },
  };
  function hitbox(e) {
    if (e.type === 'weasel') return e.h > 4 ? { x0: e.x + 2, y0: e.y + 2, x1: e.x + 14, y1: e.baseY } : null;
    if (e.type === 'bubble') return e.y < 250 ? { x0: e.x + 1, y0: e.y + 1, x1: e.x + 13, y1: e.y + 13 } : null;
    if (e.type === 'item' && e.emerge > 0) return null;
    return { x0: e.x, y0: e.y, x1: e.x + e.w, y1: e.y + e.h };
  }
  const isFoe = (e) => ['vac', 'hog', 'hogb', 'weasel', 'bubble', 'king', 'puff'].includes(e.type);
  function updateEnts(m) {
    const right = G.cam + VW + 24;
    for (const e of m.ents) {
      if (e.gone) continue;
      if (!e.active) { if (e.x < right && e.x + e.w > G.cam - 16) e.active = true; else continue; }
      ENT[e.type](e, m);
      if (!e.dead && e.type !== 'weasel' && e.type !== 'bubble' && (e.x + e.w < G.cam - 64 || e.y > VH + 40)) e.gone = true;
    }
    // walkers turn around when they bump into each other; a rolling hedgehog ball knocks everything over
    const act = m.ents.filter((e) => e.active && !e.gone && !e.dead);
    for (let i = 0; i < act.length; i++) for (let j = i + 1; j < act.length; j++) {
      const a = act[i], b = act[j];
      if (a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y) continue;
      const roll = (q) => q.type === 'hog' && q.state === 'roll', walker = (q) => q.type === 'vac' || q.type === 'hogb' || (q.type === 'hog' && q.state !== 'roll');
      if (roll(a) && (walker(b) || roll(b))) { killEnt(b, Math.sign(a.vx) || 1, 0); chainScore(a.chain = (a.chain || 0), b.x, b.y); a.chain++; if (roll(b)) { killEnt(a, Math.sign(b.vx) || 1, 0); } }
      else if (roll(b) && walker(a)) { killEnt(a, Math.sign(b.vx) || 1, 0); chainScore(b.chain = (b.chain || 0), a.x, a.y); b.chain++; }
      else if (walker(a) && walker(b)) { if ((a.x < b.x && a.vx > 0) || (a.x > b.x && a.vx < 0)) a.vx = -a.vx; if ((b.x < a.x && b.vx > 0) || (b.x > a.x && b.vx < 0)) b.vx = -b.vx; }
    }
    // Carrie against everything
    for (const e of m.ents) {
      if (!e.active || e.gone || e.dead || G.state !== 'play') continue;
      const hb = hitbox(e); if (!hb) continue;
      if (P.x + P.w - 1 <= hb.x0 || P.x + 1 >= hb.x1 || P.y + P.h <= hb.y0 || P.y + 2 >= hb.y1) continue;
      touch(e, hb, m);
    }
    if (G.frame % 60 === 0) m.ents = m.ents.filter((e) => !e.gone);
  }
  function touch(e, hb, m) {
    switch (e.type) {
      case 'coin': e.gone = true; addCoin(); return;
      case 'item': return collect(e);
      case 'coinpop': return;
    }
    if (P.star > 0) { if (e.type === 'king' || e.type === 'puff') return; killEnt(e, P.face, 0); chainScore(P.starChain = (P.starChain || 0), e.x, e.y); P.starChain++; return; }
    const stompable = e.type === 'vac' || e.type === 'hog' || e.type === 'hogb';
    const falling = P.vy > 0 && P.y + P.h - P.vy <= hb.y0 + 6;
    if (stompable && falling) {
      P.vy = INPUT.jump ? -5 : -3.6; P.onGround = false;
      if (e.type === 'vac') { e.dead = 'squash'; e.t = 0; sfx('stomp'); chainScore(P.chain, e.x, e.y); P.chain++; return; }
      if (e.type === 'hogb') { e.type = 'hog'; e.state = 'walk'; e.vy = 0; sfx('stomp'); chainScore(P.chain, e.x, e.y); P.chain++; G.parts.push({ x: e.x, y: e.y - 14, vx: 0, vy: -1, t: 100, k: 'pop' }); return; }
      if (e.state === 'walk' || e.state === 'peek' || e.state === 'roll') { e.state = 'ball'; e.vx = 0; e.t = 0; e.chain = 0; sfx('stomp'); chainScore(P.chain, e.x, e.y); P.chain++; return; }
      if (e.state === 'ball') { kick(e); return; }
    }
    if (e.type === 'hog' && (e.state === 'ball' || e.state === 'peek')) { kick(e); return; }
    if (e.type === 'hog' && e.state === 'roll' && e.grace > 0) return;
    hurtPlayer();
  }
  function kick(e) { e.state = 'roll'; e.vx = P.x + P.w / 2 < e.x + e.w / 2 ? 3.2 : -3.2; e.grace = 14; e.chain = 0; addScore(400, e.x, e.y); sfx('kick'); }
  function collect(e) {
    e.gone = true;
    if (e.kind === 'sausage') { addScore(1000, e.x, e.y); if (P.power === 'small') grow('big'); else sfx('power'); }
    else if (e.kind === 'tball') { addScore(1000, e.x, e.y); if (P.power === 'small') grow('big'); else if (P.power === 'big') grow('ball'); else sfx('power'); }
    else if (e.kind === 'collar') { addScore(1000, e.x, e.y); P.star = 620; P.starChain = 0; sfx('power'); }
    else if (e.kind === 'life') addLife(e.x, e.y);
  }
  function grow(to) { G.state = 'grow'; G.growT = 0; G.growTo = to; G.growFrom = P.power; sfx(to === 'small' ? 'shrink' : 'power'); }
  function updateGrow() {
    if (++G.growT >= 48) { setPower(G.growTo); G.state = 'play'; if (G.growTo === 'small') P.invuln = 120; }
  }
  function hurtPlayer() {
    if (P.star > 0 || P.invuln > 0 || G.state !== 'play') return;
    if (P.power !== 'small') grow('small'); else killPlayer();
  }
  function killPlayer(fell) {
    if (G.state === 'dying') return;
    G.state = 'dying'; P.deadT = fell ? 40 : 0; P.vx = 0; P.vy = 0; P.star = 0; music(0); sfx('die');
  }
  function updateDying() {
    P.deadT++;
    if (P.deadT === 30) P.vy = -4.6;
    if (P.deadT > 30) { P.vy += 0.22; P.y += P.vy; }
    if (P.deadT > 170) {
      G.lives--; setPower('small');
      if (G.lives <= 0) finishGame(false); else startLevel(G.li);
    }
  }

  // ---------- tennis balls, lifts, bubble bars
  function updateShots(m) {
    for (const s of G.shots) {
      s.t++; s.vy = Math.min(s.vy + 0.35, 4); s.x += s.vx;
      const tx = Math.floor((s.x + (s.vx > 0 ? 7 : 0)) / TS), ty0 = Math.floor((s.y + 4) / TS);
      if (solidAt(m, tx, ty0)) { s.gone = true; G.parts.push({ x: s.x, y: s.y, vx: 0, vy: -0.5, t: 100, k: 'poof' }); continue; }
      s.y += s.vy;
      const by = Math.floor((s.y + 8) / TS), bx = Math.floor((s.x + 4) / TS), bt = tileAt(m, bx, by);
      if (s.vy > 0 && (SOLID.has(bt) || ONEWAY.has(bt))) { s.y = by * TS - 8; s.vy = -3; }
      if (s.x < G.cam - 16 || s.x > G.cam + VW + 16 || s.y > VH) s.gone = true;
      for (const e of m.ents) {
        if (s.gone || !e.active || e.gone || e.dead || !isFoe(e) || e.type === 'bubble' || e.type === 'puff') continue;
        const hb = hitbox(e); if (!hb || s.x + 8 <= hb.x0 || s.x >= hb.x1 || s.y + 8 <= hb.y0 || s.y >= hb.y1) continue;
        s.gone = true; G.parts.push({ x: s.x, y: s.y, vx: 0, vy: -0.5, t: 100, k: 'poof' });
        if (e.type === 'king') { e.flash = 10; sfx('bosshit'); if (--e.hp <= 0) killEnt(e, 1, 5000); }
        else killEnt(e, Math.sign(s.vx), 200);
      }
    }
    G.shots = G.shots.filter((s) => !s.gone);
  }
  function updateLifts(m) {
    for (const l of m.lifts) {
      const ox = l.x, oy = l.y;
      if (l.kind === 'h') { l.x += l.speed * l.dir; if (l.x > l.b) { l.x = l.b; l.dir = -1; } if (l.x < l.a) { l.x = l.a; l.dir = 1; } }
      else { l.y += l.speed * l.dir; if (l.y > l.b) { l.y = l.b; l.dir = -1; } if (l.y < l.a) { l.y = l.a; l.dir = 1; } }
      l.dx = l.x - ox; l.dy = l.y - oy;
    }
  }
  function updateBars(m) {
    for (const b of m.bars) {
      b.a += b.speed;
      if (P.star > 0 || P.invuln > 0) continue;
      for (let i = 1; i < b.n; i++) {
        const x = b.cx + Math.cos(b.a) * i * 8, y = b.cy + Math.sin(b.a) * i * 8;
        if (x + 3 > P.x + 1 && x - 3 < P.x + P.w - 1 && y + 3 > P.y + 2 && y - 3 < P.y + P.h) { hurtPlayer(); return; }
      }
    }
  }

  // ---------- stumps (warps)
  function startWarp(w) { G.state = 'warp'; G.warp = w; G.stage = 0; G.timer = 0; P.vx = 0; P.vy = 0; P.behind = true; sfx('pipe'); }
  function updateWarp() {
    const w = G.warp; G.timer++;
    if (G.stage === 0) {
      if (w.kind === 'down') P.y += 1; else { P.x += 0.8; P.anim += 0.1; }
      if (G.timer >= (w.kind === 'down' ? 30 : 22)) {
        enterMap(w.room); const m = G.map; G.timer = 0;
        if (w.emerge && m.exitStump) {
          const es = m.exitStump; P.x = es.x * TS + 16 - P.w / 2; P.y = es.y * TS + 2; G.stage = 1; P.behind = true;
          G.cam = clamp(P.x - 112, 0, m.w * TS - VW); sfx('pipe');
        } else { P.x = w.tx * TS + 2; P.y = w.ty * TS; G.cam = clamp(P.x - 40, 0, m.w * TS - VW); P.behind = false; G.state = 'play'; }
      }
    } else {
      P.y -= 1; const es = G.map.exitStump;
      if (P.y + P.h <= es.y * TS) { P.y = es.y * TS - P.h; P.behind = false; G.state = 'play'; P.onGround = true; }
    }
  }

  // ---------- the show pole and the tent
  function startPole(m) {
    G.state = 'pole'; G.stage = 0; G.timer = 0; P.vx = 0; P.vy = 0; P.star = 0; P.duck = false; setPower(P.power);
    const px = m.pole.x * TS; P.x = px + 7 - P.w; P.face = 1;
    const frac = (192 - (P.y + P.h)) / (192 - 48);
    const pts = frac >= 0.92 ? 5000 : frac >= 0.65 ? 2000 : frac >= 0.4 ? 800 : frac >= 0.18 ? 400 : 100;
    addScore(pts, px + 10, P.y); G.rosY = 48; music(0); sfx('pole');
  }
  function updatePole() {
    const m = G.map; G.timer++;
    if (G.stage === 0) {
      let done = true;
      if (P.y + P.h < 192) { P.y = Math.min(P.y + 2, 192 - P.h); done = false; }
      if (G.rosY < 176) { G.rosY = Math.min(176, G.rosY + 2); done = false; }
      if (done) { G.stage = 1; G.timer = 0; P.x = m.pole.x * TS + 9; P.face = -1; }
    } else if (G.stage === 1) { if (G.timer > 24) { G.stage = 2; P.face = 1; sfx('clear'); } }
    else {
      P.vx = 1.1; P.vy = Math.min(P.vy + 0.4, 4); moveX(m); moveY(m); P.anim += 0.12;
      if (P.x + P.w / 2 >= m.tent.x + 40) { P.hidden = true; G.state = 'tally'; G.timer = 0; }
    }
  }
  function updateTally() {
    if (G.time > 0) { const d = Math.min(G.time, 2); G.time -= d; G.score += 50 * d; if (G.frame % 3 === 0) sfx('tick'); }
    else { G.timer++; G.flagY = Math.min(18, G.timer / 2); if (G.timer > 110) nextLevel(); }
  }

  // ---------- the bath plug and the bridge
  function startBridge(m) { G.state = 'bridge'; m.plugGone = true; G.bridgeX = m.bridge ? m.bridge.x1 : -1; G.timer = 0; P.vx = 0; P.vy = 0; music(0); sfx('plug'); }
  function updateBridge() {
    const m = G.map, br = m.bridge; G.timer++;
    if (br && G.bridgeX >= br.x0) { if (G.timer % 4 === 0) { m.t[br.y * m.w + G.bridgeX] = T_AIR; G.bridgeX--; sfx('crumble'); } return; }
    const king = m.ents.find((e) => e.type === 'king' && !e.gone);
    if (king && !king.dead) { king.dead = 'fall'; king.vy = 0; }
    if (king && king.dead) { king.vy += 0.25; king.y += king.vy; king.x += king.vx || 0; if (king.y > VH + 40) king.gone = true; }
    if ((!king || king.gone) && G.timer > 30) { G.state = 'walkout'; sfx('clear'); }
  }
  function updateWalkout() {
    const m = G.map; P.vx = 1.1; P.vy = Math.min(P.vy + 0.4, 4); moveX(m); moveY(m); P.anim += 0.12;
    if (P.x + P.w / 2 - G.cam > 112) G.cam = Math.min(P.x + P.w / 2 - 112, m.w * TS - VW);
    if (m.puppy && P.x + P.w >= m.puppy.x - 18) { P.vx = 0; G.state = 'thanks'; G.timer = 0; }
  }
  function updateThanks() {
    G.timer++;
    if (G.timer > 60 && G.time > 0) { const d = Math.min(G.time, 2); G.time -= d; G.score += 50 * d; if (G.frame % 3 === 0) sfx('tick'); }
    if (G.timer > 330 && G.time === 0) nextLevel();
  }
