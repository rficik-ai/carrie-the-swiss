  // =====================================================================================
  // Levels: own layouts, built with small helpers. 16 px tiles, 15 rows, ground top at row 13.
  // =====================================================================================
  const T_AIR = 0, T_GROUND = 1, T_BRICK = 2, T_BOX = 3, T_USED = 4, T_CRATE = 5, T_STL = 6, T_STR = 7, T_SBL = 8, T_SBR = 9, T_HIDDEN = 10,
    T_TREEL = 11, T_TREEM = 12, T_TREER = 13, T_TRUNK = 14, T_BRIDGE = 15, T_FOAM = 16, T_POLE = 17, T_POLETOP = 18, T_SIDET = 19, T_SIDEB = 20, T_BARBASE = 21;
  const SOLID = new Set([T_GROUND, T_BRICK, T_BOX, T_USED, T_CRATE, T_STL, T_STR, T_SBL, T_SBR, T_BRIDGE, T_SIDET, T_SIDEB, T_BARBASE]);
  const ONEWAY = new Set([T_TREEL, T_TREEM, T_TREER]);
  const ROWS = 15;

  function builder(w, theme, opts = {}) {
    const m = { w, theme, t: new Uint8Array(w * ROWS), content: {}, specs: [], decor: [], warps: [], lifts: [], bars: [], start: { x: 40, y: 192 }, pole: null, tent: null, plug: null, bridge: null, check: null, puppy: null, ...opts };
    const B = {
      m,
      set(x, y, t, c) { if (x < 0 || x >= w || y < 0 || y >= ROWS) return; m.t[y * w + x] = t; if (c) m.content[y * w + x] = c; else delete m.content[y * w + x]; },
      ground(x0, x1, top = 13) { for (let x = x0; x <= x1; x++) for (let y = top; y < ROWS; y++) B.set(x, y, T_GROUND); },
      fill(x0, x1, y0, y1, t = T_GROUND) { for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) B.set(x, y, t); },
      clear(x0, x1, y0 = 0, y1 = ROWS - 1) { B.fill(x0, x1, y0, y1, T_AIR); },
      row(x0, x1, y, t, c) { for (let x = x0; x <= x1; x++) B.set(x, y, t, c); },
      box(x, y, c = 'coin') { B.set(x, y, T_BOX, c); },
      brick(x, y, c) { B.set(x, y, T_BRICK, c); },
      bricks(x0, x1, y) { B.row(x0, x1, y, T_BRICK); },
      hidden(x, y, c = 'life') { B.set(x, y, T_HIDDEN, c); },
      crates(x, h, base = 12) { for (let i = 0; i < h; i++) B.set(x, base - i, T_CRATE); },
      stairsUp(x, n, base = 12) { for (let i = 0; i < n; i++) B.crates(x + i, i + 1, base); },
      stairsDown(x, n, base = 12) { for (let i = 0; i < n; i++) B.crates(x + i, n - i, base); },
      stump(x, h, o = {}) {
        const groundTop = o.base ?? 13, top = groundTop - h;
        B.set(x, top, T_STL); B.set(x + 1, top, T_STR);
        for (let y = top + 1; y < groundTop; y++) { B.set(x, y, T_SBL); B.set(x + 1, y, T_SBR); }
        if (o.weasel) m.specs.push({ type: 'weasel', x: x * 16 + 8, y: top * 16 });
        if (o.warp) m.warps.push({ kind: 'down', x, y: top, ...o.warp });
        if (o.exit) m.exitStump = { x, y: top };
      },
      // sideways stump at the end of a cellar: mouth at column x (rows y, y+1), trunk going up behind it
      side(x, y, warp) {
        B.set(x, y, T_SIDET); B.set(x, y + 1, T_SIDEB);
        for (let r = 0; r <= y + 1; r++) { B.set(x + 1, r, T_SBL); B.set(x + 2, r, T_SBR); }
        m.warps.push({ kind: 'right', x, y, ...warp });
      },
      tree(x0, x1, y) {
        B.set(x0, y, T_TREEL); B.set(x1, y, T_TREER); for (let x = x0 + 1; x < x1; x++) B.set(x, y, T_TREEM);
        const c = Math.floor((x0 + x1) / 2); for (let r = y + 1; r < ROWS; r++) { B.set(c, r, T_TRUNK); if (x1 - x0 >= 5) B.set(c + 1, r, T_TRUNK); }
      },
      coins(x0, x1, y) { for (let x = x0; x <= x1; x++) m.specs.push({ type: 'coin', x: x * 16, y: y * 16 }); },
      e(type, x, y = 12, extra = {}) { m.specs.push({ type, x: x * 16, y: y * 16, ...extra }); },
      pole(x) { B.set(x, 12, T_CRATE); for (let y = 3; y <= 11; y++) B.set(x, y, T_POLE); B.set(x, 2, T_POLETOP); m.pole = { x }; },
      tent(x) { m.tent = { x: x * 16, y: 13 * 16 - 80 }; },
      foam(x0, x1) { for (let x = x0; x <= x1; x++) { B.set(x, 13, T_FOAM); B.set(x, 14, T_FOAM); } },
      bridge(x0, x1, y) { B.row(x0, x1, y, T_BRIDGE); m.bridge = { x0, x1, y }; },
      lift(x, y, w, kind, a, b, speed = 0.7) { m.lifts.push({ x: x * 16, y: y * 16, w: w * 16, kind, a: a * 16, b: b * 16, speed }); },
      bar(x, y, n = 6, speed = 0.035) { B.set(x, y, T_BARBASE); m.bars.push({ cx: x * 16 + 8, cy: y * 16 + 8, n, a: 0, speed }); },
      bubble(x, delay = 0) { m.specs.push({ type: 'bubble', x: x * 16, y: 14 * 16, delay }); },
      deco(k, x, y) { m.decor.push({ k, x, y }); },
      check(x) { m.check = x; },
      start(x, y = 12) { m.start = { x: x * 16 + 2, y: y * 16 + 2 }; },
    };
    return B;
  }
  const groundAt = (m, x) => m.t[13 * m.w + x] === T_GROUND;
  // garden scenery repeating every 48 columns, only where there is ground to stand on
  function gardenDecor(B, x0 = 0, x1 = B.m.w - 1, ground = true) {
    const m = B.m, GY = 208;
    for (let x = x0; x <= x1; x += 48) {
      const put = (k, dx, y, needGround) => { const cx = x + dx; if (cx > x1) return; if (needGround && !groundAt(m, cx)) return; B.deco(k, cx * 16, y); };
      if (ground) {
        put('alpBig', 0, GY - 48, true); put('alpSmall', 17, GY - 28, true);
        put('bush3', 11, GY - 20, true); put('bush1', 24, GY - 20, true); put('bush2', 41, GY - 20, true);
        put('hay', 30, GY - 24, true); put('fence', 14, GY - 16, true); put('fence', 15, GY - 16, true); put('fence', 16, GY - 16, true); put('flower', 35, GY - 16, true);
      }
      put('cloud2', 8, 34); put('cloud1', 19, 18); put('cloud3', 27, 44); put('cloud1', 37, 30);
    }
  }

  const LEVELS = [
    // ---------------------------------------------------------------- 1-1 Záhrada
    { id: '1-1', name: 'Záhrada', time: 400, build() {
      const B = builder(200, 'garden'); const m = B.m;
      B.ground(0, 73); B.ground(77, 91); B.ground(80, 88, 11); B.ground(94, 147); B.ground(150, 199);
      gardenDecor(B);
      B.box(12, 9);
      B.brick(16, 9); B.box(17, 9, 'power'); B.brick(18, 9); B.box(19, 9); B.brick(20, 9); B.box(18, 5);
      B.e('vac', 22);
      B.stump(26, 2);
      B.coins(30, 33, 8);
      B.stump(35, 3);
      B.e('vac', 39); B.e('vac', 41);
      B.stump(45, 3, { weasel: true });
      B.e('hog', 49);
      B.bricks(52, 56, 9); B.hidden(54, 5, 'life');
      B.stump(60, 3, { warp: { room: 'bonus', tx: 2, ty: 3 } });
      B.e('vac', 64); B.e('vac', 66);
      B.coins(81, 87, 9); B.e('vac', 85, 10); B.box(84, 7, 'power');
      B.bricks(100, 103, 9); B.box(101, 9); B.brick(103, 9, 'coins');
      B.bricks(105, 111, 6); B.brick(108, 6, 'star'); B.box(110, 6);
      B.check(100);
      B.e('hog', 114); B.e('vac', 117); B.e('vac', 119);
      B.box(122, 9); B.box(125, 9, 'power'); B.box(128, 9); B.box(125, 5);
      B.stump(133, 2, { exit: true });
      B.stairsUp(141, 4); B.crates(145, 4); B.crates(146, 4); B.crates(147, 4);
      B.crates(150, 4); B.crates(151, 3); B.crates(152, 2); B.crates(153, 1);
      B.e('vac', 158); B.e('vac', 160); B.bricks(162, 165, 9); B.box(163, 9); B.e('hog', 166);
      B.stairsUp(172, 8); B.crates(180, 8);
      B.pole(188); B.tent(192);
      // bonus room under the stump: a cellar full of granules, out through a sideways stump
      const R = builder(16, 'cellar'); R.fill(0, 0, 0, 14); R.ground(0, 15); R.row(1, 15, 0, T_GROUND); R.row(1, 15, 1, T_GROUND);
      R.bricks(4, 10, 9); R.box(7, 9, 'coin');
      R.coins(3, 11, 12); R.coins(4, 10, 7); R.coins(5, 9, 5); R.coins(3, 11, 11);
      R.side(13, 11, { room: 'main', tx: 133, ty: 11, emerge: true });
      return { main: m, rooms: { bonus: R.m } };
    } },
    // ---------------------------------------------------------------- 1-2 Pivnica
    { id: '1-2', name: 'Pivnica', time: 400, build() {
      const B = builder(180, 'cellar'); const m = B.m;
      B.ground(0, 79); B.ground(83, 124); B.ground(132, 179);
      B.fill(0, 0, 2, 12, T_CRATE); B.bricks(6, 150, 2);
      B.start(2);
      B.box(10, 9); B.box(11, 9, 'power'); B.box(12, 9); B.box(13, 9); B.box(14, 9);
      B.e('vac', 18); B.e('vac', 20);
      B.crates(24, 2); B.crates(26, 3); B.crates(28, 4); B.crates(30, 4); B.crates(32, 3);
      B.e('hog', 34);
      B.bricks(36, 44, 9); B.coins(37, 43, 8); B.bricks(38, 42, 5); B.brick(40, 5, 'coins'); B.box(44, 9, 'star');
      B.e('vac', 47); B.e('vac', 49); B.e('vac', 51);
      B.bricks(58, 64, 10); B.bricks(58, 64, 6); B.coins(59, 63, 8); B.hidden(61, 4, 'life');
      B.e('hog', 66); B.e('hog', 70);
      B.stump(88, 3, { weasel: true }); B.e('vac', 92); B.stump(95, 2); B.e('vac', 98); B.stump(101, 3, { weasel: true });
      B.check(90);
      B.bricks(106, 112, 9); B.box(109, 9, 'power'); B.box(111, 9); B.e('vac', 108, 8); B.e('vac', 110, 8);
      B.coins(114, 120, 10);
      B.lift(126, 9, 3, 'v', 5, 12, 0.6); B.lift(129, 6, 3, 'v', 5, 12, 0.6);
      B.e('hog', 140); B.bricks(144, 147, 9); B.box(145, 9); B.e('vac', 146, 8);
      B.fill(170, 179, 0, 12, T_CRATE); B.side(158, 11, { room: 'out', tx: 3, ty: 11, emerge: true });
      B.coins(150, 155, 10);
      // outside again: a short walk to the show pole
      const O = builder(34, 'garden'); O.ground(0, 33); gardenDecor(O, 0, 33);
      O.stump(3, 2, { exit: true }); O.stairsUp(11, 4); O.crates(15, 4); O.pole(22); O.tent(26);
      return { main: m, rooms: { out: O.m } };
    } },
    // ---------------------------------------------------------------- 1-3 Koruny stromov
    { id: '1-3', name: 'Koruny stromov', time: 300, build() {
      const B = builder(170, 'trees'); const m = B.m;
      B.ground(0, 15); B.ground(149, 169);
      for (let x = 0; x < 170; x += 40) { B.deco('alpBig', (x + 20) * 16, 208 - 48); B.deco('alpSmall', (x + 5) * 16, 208 - 28); }
      gardenDecor(B, 0, 169, false);
      B.tree(18, 21, 11);
      B.tree(24, 29, 8); B.e('vac', 27, 7);
      B.tree(32, 35, 10);
      B.tree(37, 43, 7); B.coins(38, 42, 6); B.e('hogb', 41, 5);
      B.tree(46, 49, 12);
      B.lift(51, 9, 3, 'h', 51, 56, 0.6);
      B.tree(60, 66, 7); B.e('hog', 64, 6); B.box(63, 3, 'power');
      B.tree(69, 73, 9);
      B.tree(76, 82, 6); B.coins(77, 81, 5); B.e('hogb', 79, 4); B.e('hogb', 81, 3);
      B.lift(85, 9, 3, 'v', 6, 12, 0.6);
      B.tree(90, 96, 9); B.e('vac', 93, 8); B.e('vac', 95, 8);
      B.check(90);
      B.tree(99, 101, 10);
      B.tree(104, 110, 7); B.box(106, 3); B.box(108, 3, 'star');
      B.lift(113, 8, 3, 'h', 113, 118, 0.7);
      B.tree(122, 125, 10); B.e('hogb', 124, 8);
      B.tree(128, 134, 7); B.coins(129, 133, 6);
      B.tree(137, 140, 9);
      B.tree(143, 146, 11);
      B.stairsUp(151, 4); B.pole(160); B.tent(164);
      return { main: m, rooms: {} };
    } },
    // ---------------------------------------------------------------- 1-4 Kúpeľňa
    { id: '1-4', name: 'Kúpeľňa', time: 300, build() {
      const B = builder(150, 'bath'); const m = B.m;
      B.fill(0, 149, 0, 3);
      B.fill(0, 12, 9, 14); B.start(3, 7);
      B.foam(13, 15);
      B.fill(16, 30, 11, 14); B.bar(22, 7, 5, 0.03);
      B.foam(31, 33); B.bubble(32, 0);
      B.fill(34, 44, 13, 14); B.fill(38, 44, 4, 8); B.bar(41, 9, 4, -0.03);
      B.foam(45, 49); B.bubble(46, 40); B.bubble(48, 100); B.set(47, 10, T_GROUND);
      B.fill(50, 70, 12, 14); B.box(54, 8, 'power'); B.box(56, 8); B.bar(62, 8, 6, 0.035);
      B.check(60);
      B.foam(71, 73); B.bubble(72, 20);
      B.fill(74, 90, 13, 14); B.fill(80, 88, 4, 9); B.bar(78, 9, 5, 0.03);
      B.foam(91, 93); B.bubble(92, 60);
      B.fill(94, 104, 11, 14); B.box(97, 7); B.box(99, 7); B.box(101, 7, 'coin');
      B.fill(105, 108, 10, 14);
      B.bridge(109, 124, 10); B.foam(109, 124); B.bubble(112, 30); B.bubble(119, 90);
      B.fill(125, 149, 10, 14);
      m.plug = { x: 125 * 16, y: 8 * 16 };
      B.e('king', 120, 8);
      m.puppy = { x: 140 * 16, y: 9 * 16 };
      return { main: m, rooms: {} };
    } },
  ];
  const WORLD_COUNT = 1;
