  // =====================================================================================
  // Pixel art: everything is drawn here in code (own designs), in a small NES-like palette.
  // =====================================================================================
  const C = {
    k: '#181818', K: '#4a4a4a', w: '#fcfcfc', t: '#e0943c', T: '#a85c1c', r: '#d82800', y: '#f8b800', Y: '#fce0a8',
    g: '#7c7c7c', l: '#bcbcbc', G: '#00a800', h: '#b8f818', n: '#c8742c', N: '#5c2c00', d: '#8c4c10',
    b: '#0058f8', B: '#3cbcfc', c: '#c4e4fc', p: '#f878a8', P: '#a80020', o: '#f87800', s: '#e8b838', S: '#a87818', v: '#503000',
  };
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  // build a sprite canvas from rows of palette letters ('.' = transparent)
  function mk(name, rows, pal) {
    const h = rows.length, w = rows[0].length, c = canvas(w, h), g = c.getContext('2d');
    rows.forEach((row, y) => {
      if (row.length !== w) throw new Error(`sprite ${name}: row ${y} has ${row.length} px, expected ${w}`);
      for (let x = 0; x < w; x++) { const ch = row[x]; if (ch === '.' || ch === ' ') continue; g.fillStyle = (pal && pal[ch]) || C[ch]; g.fillRect(x, y, 1, 1); }
    });
    return c;
  }
  function flipH(src) { const c = canvas(src.width, src.height), g = c.getContext('2d'); g.translate(src.width, 0); g.scale(-1, 1); g.drawImage(src, 0, 0); return c; }
  function flipV(src) { const c = canvas(src.width, src.height), g = c.getContext('2d'); g.translate(0, src.height); g.scale(1, -1); g.drawImage(src, 0, 0); return c; }
  // a tiny painter for procedural sprites: fill shapes into a grid, then add a dark outline like the old consoles
  function painter(w, h) {
    const px = Array.from({ length: h }, () => Array(w).fill(null));
    const P = {
      w, h, px,
      set(x, y, col) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < w && y < h) px[y][x] = col; },
      rect(x, y, ww, hh, col) { for (let j = y; j < y + hh; j++) for (let i = x; i < x + ww; i++) P.set(i, j, col); },
      ellipse(cx, cy, rx, ry, col) { for (let j = Math.floor(cy - ry); j <= Math.ceil(cy + ry); j++) for (let i = Math.floor(cx - rx); i <= Math.ceil(cx + rx); i++) { const dx = (i - cx) / rx, dy = (j - cy) / ry; if (dx * dx + dy * dy <= 1) P.set(i, j, col); } },
      outline(col, diag) {
        const add = [];
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          if (px[y][x]) continue;
          const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].concat(diag ? [[1, 1], [-1, -1], [1, -1], [-1, 1]] : []);
          if (n.some(([dx, dy]) => px[y + dy] && px[y + dy][x + dx] && px[y + dy][x + dx] !== col)) add.push([x, y]);
        }
        for (const [x, y] of add) px[y][x] = col;
      },
      canvas() { const c = canvas(w, h), g = c.getContext('2d'); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[y][x]) { g.fillStyle = px[y][x]; g.fillRect(x, y, 1, 1); } return c; },
    };
    return P;
  }

  // ---------- 5×7 pixel font, capitals and digits, with Slovak accents drawn above the letter
  // 7 rows of 5 px per glyph ("#" = lit)
  const FONT = {
    "A": '.###.|#...#|#...#|#####|#...#|#...#|#...#', "B": '####.|#...#|#...#|####.|#...#|#...#|####.', "C": '.####|#....|#....|#....|#....|#....|.####', "D": '####.|#...#|#...#|#...#|#...#|#...#|####.',
    "E": '#####|#....|#....|####.|#....|#....|#####', "F": '#####|#....|#....|####.|#....|#....|#....', "G": '.####|#....|#....|#..##|#...#|#...#|.####', "H": '#...#|#...#|#...#|#####|#...#|#...#|#...#',
    "I": '#####|..#..|..#..|..#..|..#..|..#..|#####', "J": '..###|...#.|...#.|...#.|#..#.|#..#.|.##..', "K": '#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#', "L": '#....|#....|#....|#....|#....|#....|#####',
    "M": '#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#', "N": '#...#|##..#|#.#.#|#..##|#...#|#...#|#...#', "O": '.###.|#...#|#...#|#...#|#...#|#...#|.###.', "P": '####.|#...#|#...#|####.|#....|#....|#....',
    "Q": '.###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#', "R": '####.|#...#|#...#|####.|#.#..|#..#.|#...#', "S": '.####|#....|#....|.###.|....#|....#|####.', "T": '#####|..#..|..#..|..#..|..#..|..#..|..#..',
    "U": '#...#|#...#|#...#|#...#|#...#|#...#|.###.', "V": '#...#|#...#|#...#|#...#|#...#|.#.#.|..#..', "W": '#...#|#...#|#...#|#.#.#|#.#.#|##.##|#...#', "X": '#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#',
    "Y": '#...#|#...#|.#.#.|..#..|..#..|..#..|..#..', "Z": '#####|....#|...#.|..#..|.#...|#....|#####', "0": '.###.|#...#|#..##|#.#.#|##..#|#...#|.###.', "1": '..#..|.##..|..#..|..#..|..#..|..#..|.###.',
    "2": '.###.|#...#|....#|...#.|..#..|.#...|#####', "3": '####.|....#|....#|.###.|....#|....#|####.', "4": '...#.|..##.|.#.#.|#..#.|#####|...#.|...#.', "5": '#####|#....|####.|....#|....#|#...#|.###.',
    "6": '.###.|#....|#....|####.|#...#|#...#|.###.', "7": '#####|....#|...#.|..#..|.#...|.#...|.#...', "8": '.###.|#...#|#...#|.###.|#...#|#...#|.###.', "9": '.###.|#...#|#...#|.####|....#|....#|.###.',
    ".": '.....|.....|.....|.....|.....|.....|..#..', ",": '.....|.....|.....|.....|.....|..#..|.#...', "!": '..#..|..#..|..#..|..#..|..#..|.....|..#..', "?": '.###.|#...#|....#|..##.|..#..|.....|..#..',
    "-": '.....|.....|.....|.###.|.....|.....|.....', ":": '.....|..#..|.....|.....|.....|..#..|.....', "×": '.....|#...#|.#.#.|..#..|.#.#.|#...#|.....', "/": '....#|...#.|...#.|..#..|.#...|.#...|#....',
    "'": '..#..|..#..|.....|.....|.....|.....|.....', "+": '.....|..#..|..#..|#####|..#..|..#..|.....', "(": '...#.|..#..|.#...|.#...|.#...|..#..|...#.', ")": '.#...|..#..|...#.|...#.|...#.|..#..|.#...',
    "\"": '.#.#.|.#.#.|.....|.....|.....|.....|.....', "=": '.....|.....|#####|.....|#####|.....|.....', "<": '...#.|..#..|.#...|#....|.#...|..#..|...#.', ">": '.#...|..#..|...#.|....#|...#.|..#..|.#...',
    "#": '.#.#.|#####|.#.#.|.#.#.|.#.#.|#####|.#.#.',
  };
  const MARK = { acute: ['...#.', '..#..'], caron: ['.#.#.', '..#..'], circ: ['..#..', '.#.#.'], uml: ['.#.#.', '.....'] };
  const ACC = { Á: ['A', 'acute'], Ä: ['A', 'uml'], Č: ['C', 'caron'], Ď: ['D', 'caron'], É: ['E', 'acute'], Í: ['I', 'acute'], Ĺ: ['L', 'acute'], Ľ: ['L', 'apos'],
    Ň: ['N', 'caron'], Ó: ['O', 'acute'], Ô: ['O', 'circ'], Ŕ: ['R', 'acute'], Š: ['S', 'caron'], Ť: ['T', 'caron'], Ú: ['U', 'acute'], Ů: ['U', 'circ'], Ý: ['Y', 'acute'], Ž: ['Z', 'caron'] };
  const glyphCache = new Map();
  function glyph(ch, col) {
    const key = ch + col; if (glyphCache.has(key)) return glyphCache.get(key);
    const c = canvas(5, 10), g = c.getContext('2d'); g.fillStyle = col;
    let base = ch, mark = null; if (ACC[ch]) [base, mark] = ACC[ch];
    const bits = FONT[base] && FONT[base].replace(/\|/g, '');
    if (bits) for (let i = 0; i < 35; i++) if (bits[i] === '#') g.fillRect(i % 5, 3 + Math.floor(i / 5), 1, 1);
    if (mark === 'apos') { g.fillRect(3, 3, 1, 2); }
    else if (mark) MARK[mark].forEach((row, y) => { for (let x = 0; x < 5; x++) if (row[x] === '#') g.fillRect(x, y, 1, 1); });
    glyphCache.set(key, c); return c;
  }
  // draw text: (x, y) is the top of the capital letters; accents sit in the 3 px above
  function text(g, str, x, y, col = '#fcfcfc', align = 'left', shadow = null) {
    str = String(str).toUpperCase();
    const w = str.length * 6 - 1; if (align === 'center') x -= Math.floor(w / 2); else if (align === 'right') x -= w;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i]; if (ch === ' ') continue;
      if (shadow) for (const [dx, dy] of [[1, 1], [1, 0], [-1, 0], [0, 1], [0, -1]]) g.drawImage(glyph(ch, shadow), x + i * 6 + dx, y - 3 + dy);
      g.drawImage(glyph(ch, col), x + i * 6, y - 3);
    }
  }

  // ---------- Carrie (small puppy 16×16, big dog 24×24), drawn facing right
  const CARRIE_TOP_S = [
    '................',
    '..........kkk...',
    '.w.......kkkkk..',
    '.k.......kktkk..',
    '.k.......KKkwkk.',
    '.kk......KKttwwk',
    '..k.kkkkkKKtwww.',
    '..kkkkkkkrKwww..',
    '..kkkkkkkrrw....',
    '..kkkkkkkkyw....',
    '..tkkkkkkkww....',
  ];
  const LEGS_S = {
    stand: ['..ttt...ttt.....', '..tt....tt......', '..tt....tt......', '..tt....tt......', '..ww....ww......'],
    walk1: ['..ttt...ttt.....', '.tt.......tt....', '.tt.......tt....', 'tt.........tt...', 'ww.........ww...'],
    walk2: ['..ttt...ttt.....', '...tt...tt......', '....tt.tt.......', '....tttt........', '....wwww........'],
    walk3: ['..ttt...ttt.....', '..tt.....tt.....', '..tt......tt....', '...tt.....tt....', '...ww.....ww....'],
    jump: ['..ttt...ttt.....', '.tt.......ttt...', 'tt..........tw..', 'w...............', '................'],
  };
  const CARRIE_TOP_B = [
    '........................',
    '................kkkk....',
    '..w............kkkkkk...',
    '..k...........kkkkkkkk..',
    '..kk..........kkkttkkk..',
    '...k..........KKkkkwkkk.',
    '...k.........KKKkkkwkkk.',
    '...kk........KKKktttwwwk',
    '....k........KKKtttwwwwk',
    '....kkkkkkkkkKKKtwwwww..',
    '...kkkkkkkkkkkKKwwww....',
    '...kkkkkkkkkrrrrwww.....',
    '...kkkkkkkkkkkywwww.....',
    '...kkkkkkkkkkkkwww......',
    '...tkkkkkkkkkkttw.......',
    '...ttkkkkkkkktttw.......',
  ];
  const LEGS_B = {
    stand: ['...ttt.....tttt.........', '...ttt......ttt.........', '...tt.......tt..........', '...tt.......tt..........', '...tt.......tt..........', '...tt.......tt..........', '...ww.......ww..........', '...www......www.........'],
    walk1: ['...ttt.....tttt.........', '..ttt.......tttt........', '..tt..........tt........', '.tt............tt.......', '.tt............tt.......', 'tt..............tt......', 'ww..............ww......', '........................'],
    walk2: ['...ttt.....tttt.........', '....ttt....ttt..........', '.....tt...tt............', '......tt.tt.............', '......tttt..............', '......tttt..............', '......wwww..............', '........................'],
    jump: ['...ttt.....ttttt........', '..ttt.........tttt......', '.tt..............ttw....', 'tt......................', 'w.......................', '........................', '........................', '........................'],
  };
  // palettes: normal, with the tennis-ball power (green collar, golden tan), and the golden-collar flashing set
  const CPAL = {
    normal: {},
    ball: { t: '#f8d878', r: '#58d854', y: '#58d854', K: '#3c3c3c' },
    star1: { k: '#f8b800', K: '#fce0a8', t: '#d82800', r: '#fcfcfc' },
    star2: { k: '#0058f8', K: '#3cbcfc', t: '#fcfcfc', r: '#f8b800' },
    star3: { k: '#a80020', K: '#f878a8', t: '#f8b800', r: '#58d854' },
  };
  const SPR = {};
  function reg(name, cv) { SPR[name] = { r: cv, l: flipH(cv) }; return SPR[name]; }
  function buildCarrie() {
    for (const [pal, P] of Object.entries(CPAL)) {
      for (const [k, legs] of Object.entries(LEGS_S)) reg(`cs_${k}_${pal}`, mk('cs_' + k, CARRIE_TOP_S.concat(legs), P));
      for (const [k, legs] of Object.entries(LEGS_B)) reg(`cb_${k}_${pal}`, mk('cb_' + k, CARRIE_TOP_B.concat(legs), P));
      // big Carrie lying low (duck): top part lowered, legs tucked
      reg(`cb_duck_${pal}`, mk('cb_duck', Array(8).fill('........................').concat(CARRIE_TOP_B.slice(0, 15), ['...ww.......ww..........']), P));
    }
    reg('cs_die', flipV(mk('cs_die', CARRIE_TOP_S.concat(LEGS_S.stand))));
  }

  // ---------- enemies
  const VAC_BODY = [
    '................',
    '................',
    '.......rr.......',
    '.......kk.......',
    '.....kkllkk.....',
    '...kkllllllkk...',
    '..kllllllllllk..',
    '.kllkkllllkkllk.',
    '.klllkkllkklllk.',
    '.kllwwkllkwwllk.',
    '.kllwwkllkwwllk.',
    '.kllllllllllllk.',
    'kggggggggggggggk',
    'kgBgggggggggBggk',
    '.kkkkkkkkkkkkkk.',
  ];
  function buildEnemies() {
    reg('vac1', mk('vac1', VAC_BODY.concat(['..kkk......kkk..'])));
    reg('vac2', mk('vac2', VAC_BODY.map((r, i) => (i === 2 ? '.......BB.......' : i === 13 ? 'kgggBggggggggBgk' : r)).concat(['...kkk....kkk...'])));
    reg('vacflat', mk('vacflat', Array(10).fill('................').concat(['................', '..kkkkkkkkkkkk..', '.kllkkllllkkllk.', '.kllxxllllxxllk.'.replace(/x/g, 'k'), 'kggggggggggggggk', '.kkkkkkkkkkkkkk.'])));
    const HP = { N: '#6c3c10', n: '#c88c4c', Y: '#f8d8a8' };
    const HEDGE = [
      '................', '................', '................',
      '....n..n..n.....', '..n.nn.nn.nn....', '...nNNnNNnNNn...', '.nnNNNNNNNNNNn..', '..nNNnNNNnNNNYY.', '.nNNNNNNNNNNYkYY', '..nNNNnNNNNYYYYY', '.nNNNNNNNNNYYYYk', '..NNNNNNNNNYYYY.', '...NNNNNNNYYYY..', '....YYYYYYYYY...',
    ];
    reg('hog1', mk('hog1', HEDGE.concat(['....kk....kk....', '...kkk...kkk....']), HP));
    reg('hog2', mk('hog2', HEDGE.concat(['.....kk..kk.....', '.....kk..kk.....']), HP));
    const BALL = ['................', '................', '................', '......n..n......', '....n.nnnn.n....', '...nnNNNNNNnn...', '..nNNnNNNnNNNn..', '.nNNNNNNNNNNNNn.', '..NNnNNNNNnNNN..', '.nNNNNNNNNNNNNn.', '..NNNNnNNNNNNN..', '.nNNNNNNNNnNNNn.', '..nNNNNNNNNNNn..', '...nNNYYYYNNn...', '....nnnnnnnn....', '................'];
    reg('hogball', mk('hogball', BALL, HP));
    reg('hogball2', mk('hogball2', BALL.map((r) => r.split('').reverse().join('')), HP));
    reg('hogpeek', mk('hogpeek', BALL.map((r, i) => (i === 12 ? '..nNNYkYYkYNn...' : i === 13 ? '...nNYYYYYYNn...' : r)), HP));
    reg('balloon', mk('balloon', ['.....rrrr.......', '....rrrrrr......', '...rrwrrrrr.....', '...rwrrrrrr.....', '...rrrrrrrr.....', '...rrrrrrrr.....', '....rrrrrr......', '.....rrrr.......', '......PP........', '.......k........', '......k.........', '.......k........', '......k.........', '.......k........', '......k.........', '.......k........']));
    const WP = { n: '#a8641c', N: '#6c3c10' };
    const WEASEL = ['...n........n...', '..nNn......nNn..', '..nnnnnnnnnnnn..', '.nnnnnnnnnnnnnn.', '.nnwknnnnnnkwnn.', '.nnkknnnnnnkknn.', '.nnnnnwwwwnnnnn.', '..nnnwwkkwwnnn..', '..nnwwPPPPwwnn..', '..nnwwwwwwwwnn..', '...nnwwwwwwnn...']
      .concat(Array(13).fill('...nnnwwwwnnn...'));
    reg('weasel1', mk('weasel1', WEASEL, WP));
    reg('weasel2', mk('weasel2', WEASEL.map((r, i) => (i === 8 ? '..nnwwwwwwwwnn..' : i === 7 ? '..nnnwwkkwwnnn..' : r)), WP));
    // soap bubble (jumps out of the hot foam) and the small bubbles of a bubble bar
    const BUB = ['................', '.....BBBBBB.....', '...BBccccccBB...', '..BcwwcccccccB..', '.BcwccccccccccB.', '.BccccccccccccB.', 'BccccccccccccccB', 'BccccccccccccccB', 'BccccccccccccccB', 'BccccccccccccccB', '.BccccccccccccB.', '.BcccccccccwccB.', '..BccccccccccB..', '...BBccccccBB...', '.....BBBBBB.....', '................'];
    reg('bubble', mk('bubble', BUB));
    reg('bubsmall', mk('bubsmall', ['..BBBB..', '.BwcccB.', 'BwcccccB', 'BccccccB', 'BccccccB', 'BccccwcB', '.BccccB.', '..BBBB..']));
    // the friendly puppy waiting at the end of a bath level
    reg('puppy', mk('puppy', ['................', '....YYYYYYY.....', '..nYYYYYYYYYn...', '.nnYYYYYYYYYnn..', '.nnYkYYYYYkYnn..', '.nnYkYYYYYkYnn..', '.nnYYYYkYYYYnn..', '..nYYYkkkYYYn...', '...YYYYpYYYY....', '....YYYYYYY.....', '....rrrrrrr.....', '...YYYYyYYYY....', '..YYYYYYYYYYY...', '..YYYYYYYYYYY...', '..YY.YYYYY.YY...', '..nn.nn.nn.nn...'], { Y: '#f0d8a8', n: '#a86020' }));
    // King Vacuum: big, crowned, facing left
    for (const hurt of [false, true]) {
      const P = painter(32, 32), L = hurt ? '#fcfcfc' : '#bcbcbc', Gc = hurt ? '#fce0a8' : '#7c7c7c';
      P.ellipse(16, 19, 14, 9, L); P.rect(2, 22, 29, 4, Gc); P.ellipse(16, 25, 14, 2.5, Gc);
      P.ellipse(12, 13, 5, 2, '#fcfcfc');
      P.rect(4, 20, 9, 3, '#a80020'); for (let i = 4; i < 13; i += 2) P.set(i, 20, '#fcfcfc');
      P.rect(6, 14, 3, 3, '#fcfcfc'); P.rect(12, 14, 3, 3, '#fcfcfc'); P.set(6, 16, '#181818'); P.set(7, 16, '#181818'); P.set(12, 16, '#181818'); P.set(13, 16, '#181818');
      for (let i = 0; i < 4; i++) { P.set(5 + i, 12 + (i >> 1), '#181818'); P.set(15 - i, 12 + (i >> 1), '#181818'); }
      P.rect(11, 6, 11, 4, '#f8b800'); for (const x of [11, 16, 21]) { P.set(x, 5, '#f8b800'); P.set(x, 4, '#f8b800'); P.set(x, 3, '#fce0a8'); }
      P.set(13, 8, '#d82800'); P.set(16, 8, '#0058f8'); P.set(19, 8, '#d82800');
      P.rect(20, 17, 6, 2, '#3cbcfc');
      P.outline('#181818');
      P.ellipse(8, 29, 2.6, 2.6, '#181818'); P.ellipse(24, 29, 2.6, 2.6, '#181818'); P.set(8, 29, '#7c7c7c'); P.set(24, 29, '#7c7c7c');
      reg(hurt ? 'king_hurt' : 'king', P.canvas());
    }
    // the foam puff King Vacuum blows
    const F = painter(24, 10); F.ellipse(6, 5, 5, 4, '#fcfcfc'); F.ellipse(13, 4, 5, 3.5, '#fcfcfc'); F.ellipse(19, 6, 4, 3, '#c4e4fc'); F.set(5, 3, '#c4e4fc'); F.outline('#3cbcfc');
    reg('puff', F.canvas());
  }

  // ---------- items, blocks, tiles
  function buildItems() {
    reg('sausage', mk('sausage', ['................', '................', '................', '................', '................', '..PPPPPPPPPPPP..', '.PrrrYYYYYrrrrP.', 'wPrrrrrrrrrrrrPw', 'wPrrrrrrrrrrrrPw', '.PrrrrrrrrrrrrP.', '..PPPPPPPPPPPP..', '................', '................', '................', '................', '................']));
    for (const [n, col, seam] of [['tball1', '#b8f818', '#fcfcfc'], ['tball2', '#f8f858', '#fcfcfc'], ['tball3', '#58d854', '#fce0a8']]) {
      const P = painter(16, 16); P.ellipse(7.5, 8, 6.5, 6.5, col);
      for (let x = 2; x <= 13; x++) { const y = 8 + Math.round(2.6 * Math.sin((x - 2) / 11 * Math.PI * 2)); P.set(x, y, seam); }
      P.outline('#3c6c00'); reg(n, P.canvas());
    }
    for (const [n, col, hi] of [['collar1', '#f8b800', '#fce0a8'], ['collar2', '#fce0a8', '#fcfcfc'], ['collar3', '#f87800', '#f8b800']]) {
      const P = painter(16, 16);
      P.ellipse(7.5, 6.5, 6.5, 4.5, col); P.ellipse(7.5, 6.5, 4, 2.2, null);
      for (let j = 4; j <= 9; j++) for (let i = 3; i <= 12; i++) { const dx = (i - 7.5) / 4, dy = (j - 6.5) / 2.2; if (dx * dx + dy * dy <= 1) P.px[j][i] = null; }
      P.set(4, 3, hi); P.set(5, 2, hi); P.set(6, 2, hi);
      P.ellipse(7.5, 12.5, 2.4, 2.4, col); P.set(7, 12, hi);
      P.outline('#a85c1c'); reg(n, P.canvas());
    }
    const BONE = (fill, out) => mk('bone', ['................', '................', '................', '................', '..oo........oo..', '.offo......offo.', '.offfoooooofffo.', '..offffffffffo..', '..offffffffffo..', '.offfoooooofffo.', '.offo......offo.', '..oo........oo..', '................', '................', '................', '................'], { o: out, f: fill });
    reg('life', BONE('#58d854', '#005800'));
    // golden granule (coin): four spin frames
    const widths = [3.5, 2.5, 0.6, 2.5];
    widths.forEach((rx, i) => {
      const P = painter(16, 16); P.ellipse(7.5, 8, rx, 6, '#f8b800');
      if (rx > 1) { P.set(7, 5, '#fce0a8'); P.set(7, 6, '#fce0a8'); P.rect(8, 7, 1, 4, '#a87818'); }
      P.outline('#6c4800'); reg('coin' + i, P.canvas());
    });
    { const P = painter(8, 8); P.ellipse(3.5, 3.5, 3, 3, '#b8f818'); P.set(2, 2, '#fcfcfc'); P.set(3, 4, '#fcfcfc'); P.set(4, 4, '#fcfcfc'); P.outline('#3c6c00'); reg('shot', P.canvas()); }
    // rosette for the show pole
    { const P = painter(16, 16); for (let a = 0; a < 12; a++) { const an = (a / 12) * Math.PI * 2; P.ellipse(8 + Math.cos(an) * 4.5, 6 + Math.sin(an) * 4.5, 2, 2, a % 2 ? '#d82800' : '#f83800'); }
      P.ellipse(8, 6, 3.2, 3.2, '#fcfcfc'); P.ellipse(8, 6, 1.8, 1.8, '#0058f8'); P.set(8, 6, '#f8b800');
      P.rect(5, 11, 2, 5, '#0058f8'); P.rect(9, 11, 2, 5, '#d82800'); P.set(5, 15, null); P.set(10, 15, null);
      P.outline('#181818'); reg('rosette', P.canvas()); }
    reg('debris', mk('debris', ['..ss....', '.sSss...', 'sssSss..', '.ssSsss.', '..sssSs.', '...sss..', '....s...', '........']));
  }

  // tiles are 16×16; a few palettes per theme
  const THEMES = {
    garden: { sky: '#68a8f8', ground: 'grass', brick: { y: '#e8b838', Y: '#f8d878', d: '#a87818', N: '#6c3c10' }, music: 'everyday' },
    cellar: { sky: '#000000', ground: 'stone', brick: { y: '#8c7c4c', Y: '#ac9c6c', d: '#5c4c2c', N: '#3c2c10' }, music: 'sneaky' },
    trees: { sky: '#68a8f8', ground: 'grass', brick: { y: '#e8b838', Y: '#f8d878', d: '#a87818', N: '#6c3c10' }, music: 'everyday' },
    bath: { sky: '#081828', ground: 'tiles', brick: { y: '#c4e4fc', Y: '#fcfcfc', d: '#7cacd8', N: '#3c6c9c' }, music: 'suspense' },
  };
  const TILE = {};
  function buildTiles() {
    const BOX = (fill, bone, dark) => mk('box', ['NNNNNNNNNNNNNNNN', 'NyyyyyyyyyyyyyyN', 'NyNyyyyyyyyyyNyN', 'NyyyyyyyyyyyyyyN', 'NyyyyyyyyyyyyyyN', 'NyywwyyyyyywwyyN', 'NyywwwwwwwwwwyyN', 'NyyywwwwwwwwyyyN', 'NyywwwwwwwwwwyyN', 'NyywwyyyyyywwyyN', 'NyyyyyyyyyyyyyyN', 'NyyyyyyyyyyyyyyN', 'NyyyyyyyyyyyyyyN', 'NyNyyyyyyyyyyNyN', 'NnnnnnnnnnnnnnnN', 'NNNNNNNNNNNNNNNN'], { y: fill, w: bone, N: '#5c2c00', n: dark });
    TILE.box = [BOX('#e09040', '#fcfcfc', '#a85010'), BOX('#e09040', '#fce0a8', '#a85010'), BOX('#e09040', '#f8b800', '#a85010')];
    TILE.used = mk('used', ['NNNNNNNNNNNNNNNN', 'NddddddddddddddN', 'NdNddddddddddNdN', 'NddddddddddddddN', 'NddddddddddddddN', 'NddddddddddddddN', 'NddddddddddddddN', 'NddddddddddddddN', 'NddddddddddddddN', 'NddddddddddddddN', 'NddddddddddddddN', 'NddddddddddddddN', 'NddddddddddddddN', 'NdNddddddddddNdN', 'NddddddddddddddN', 'NNNNNNNNNNNNNNNN'], { d: '#8c4c10', N: '#3c1c00' });
    const HAY = ['YYYYNYYYYYYNYYYY', 'yyyyNyyydyyNyyyy', 'ydyyNyyyyyyNydyy', 'yyyyNydyyyyNyyyy', 'yyddNyyyyddNyyyy', 'yyyyNyyyyyyNyydy', 'dyyyNyydyyyNyyyy', 'yyyyNyyyyyyNdyyy', 'yydyNyyyyyyNyyyy', 'yyyyNdyyydyNyyyy', 'ydyyNyyyyyyNyydy', 'yyyyNyydyyyNyyyy', 'yyydNyyyyyyNyyyy', 'dyyyNyyyydyNydyy', 'yyyyNyyyyyyNyyyy', 'ddddNddddddNdddd'];
    TILE.crate = mk('crate', ['NNNNNNNNNNNNNNNN', 'NnnnnnnnnnnnnnnN', 'NnddnnnnnnnnddnN', 'NndddnnnnnndddnN', 'NnndddnnnndddnnN', 'NnnndddnndddnnnN', 'NnnnndddddnnnnnN', 'NnnnnnddddnnnnnN', 'NnnnnnddddnnnnnN', 'NnnnndddddnnnnnN', 'NnnndddnndddnnnN', 'NnndddnnnndddnnN', 'NndddnnnnnndddnN', 'NnddnnnnnnnnddnN', 'NnnnnnnnnnnnnnnN', 'NNNNNNNNNNNNNNNN'], { n: '#c87c30', d: '#8c4c10', N: '#4c2400' });
    const STUMP_TOP = ['.NNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.', 'NnYYYYYYYYYYYYYYYYYYYYYYYYYYYYnN', 'NnYssssssssssssssssssssssssssYnN', 'NnYsYYYYYYYYYYYYYYYYYYYYYYYYsYnN', 'NnYsYsssssskkkkkkkkkkssssssYsYnN', 'NnYsYskkkkkkkkkkkkkkkkkkkksYsYnN', 'NnYsYYkkkkkkkkkkkkkkkkkkkkYYsYnN', 'NnYssYYYkkkkkkkkkkkkkkkkYYYssYnN', 'NnYYsssYYYYYYYYYYYYYYYYYYsssYYnN', 'NnnYYYsssssssssssssssssssYYYYnnN', 'NnnnnYYYYYYYYYYYYYYYYYYYYYnnnnnN', 'NnNnnnnnnnnnnnnnnnnnnnnnnnnnNnnN', 'NnNnnnnNnnnnnnnnNnnnnnnnNnnnNnnN', 'NnNnnnnNnnnnnnnnNnnnnnnnNnnnNnnN', 'NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN', '..NnnNnnnnnNnnnnnnNnnnnnNnnnNN..'];
    const STUMP_BODY = '..NnnNnnnnnNnnnnnnNnnnnnNnnnNN..';
    const SP = { N: '#3c1c00', n: '#8c5418', Y: '#e8c890', s: '#c89c5c', k: '#1c0c00' };
    const top = STUMP_TOP;
    TILE.stumpTop = mk('stumpTop', top, SP);
    TILE.stumpBody = mk('stumpBody', Array.from({ length: 16 }, (_, i) => (i % 5 === 2 ? '..NnnNnnnnnNnnnNnnNnnnnnNnnnNN..' : STUMP_BODY)), SP);
    // sideways stump mouth (exit): 16 wide × 32 tall, opening to the left
    TILE.stumpSide = mk('stumpSide', Array.from({ length: 32 }, (_, y) => {
      if (y === 0 || y === 31) return 'NNNNNNNNNNNNNNNN';
      if (y < 3 || y > 28) return 'NYYsYnnnnnnnnnnN';
      return 'NYskkYnnnNnnnnnN';
    }), SP);
    TILE.lift = mk('lift', ['NNNNNNNNNNNNNNNN', 'NnnnnnnnnnnnnnnN', 'NnYnnnnYnnnnYnnN', 'NnnnnnnnnnnnnnnN', 'NNNNNNNNNNNNNNNN', '..N..........N..', '................', '................'], { n: '#e09040', Y: '#fce0a8', N: '#5c2c00' });
    for (const [name, th] of Object.entries(THEMES)) {
      const t = (TILE[name] = {});
      t.brick = mk('hay', HAY, th.brick);
      if (th.ground === 'grass') {
        const E = { n: '#a85c20', N: '#6c3410', Y: '#d89050', G: '#00a800', h: '#80d010', d: '#4c7c00' };
        t.top = mk('grassTop', ['.h..h...h.h..h..', 'hhhhGhhhhhhGhhhh', 'GhGGGGhGGhGGGGhG', 'GGGdGGGGGGGGdGGG', 'ddnddddnddddnddd', 'nnnnnnnnnnnNnnnn', 'nnnNnnnnnnnnnnnn', 'nnnnnnnnnYnnnnnn', 'nnnnnnnnnnnnnNnn', 'nNnnnnnnnnnnnnnn', 'nnnnnnYnnnnnnnnn', 'nnnnnnnnnnnNnnnn', 'nnnnnnnnnnnnnnnn', 'nnnYnnnnnnnnnnYn', 'nnnnnnnnNnnnnnnn', 'nnnnnnnnnnnnnnnn'], E);
        t.fill = mk('earth', ['nnnnnnnnnnnnnnnn', 'nnnNnnnnnnnnnnnn', 'nnnnnnnnnYnnnnnn', 'nnnnnnnnnnnnnNnn', 'nNnnnnnnnnnnnnnn', 'nnnnnnYnnnnnnnnn', 'nnnnnnnnnnnNnnnn', 'nnnnnnnnnnnnnnnn', 'nnnYnnnnnnnnnnYn', 'nnnnnnnnNnnnnnnn', 'nnnnnnnnnnnnnnnn', 'nNnnnnnnnnnnNnnn', 'nnnnnnnYnnnnnnnn', 'nnnnnnnnnnnnnnnn', 'nnnnnNnnnnnnnnYn', 'nnnnnnnnnnnnnnnn'], E);
      } else if (th.ground === 'stone') {
        const S = { a: '#7c6c5c', b: '#5c4c3c', c: '#2c2018', d: '#9c8c7c' };
        const rows = ['dddddddcdddddddc', 'daaaaaacdaaaaaac', 'daaaaaacdaaaaaac', 'daaaaabcdaaaaabc', 'daaaaaacdaaaaaac', 'daaaaaacdaaaabac', 'dbbbbbbcdbbbbbbc', 'cccccccccccccccc', 'dddcdddddddcdddd', 'aaacdaaaaaacdaaa', 'aaacdaabaaacdaaa', 'aaacdaaaaaacdaaa', 'abacdaaaaaacdaba', 'aaacdaaaaaacdaaa', 'bbbcdbbbbbbcdbbb', 'cccccccccccccccc'];
        t.top = t.fill = mk('stone', rows, S);
      } else {
        const S = { a: '#e8f0f8', b: '#c4d8ec', c: '#5c8cbc', w: '#fcfcfc' };
        const rows = ['cccccccccccccccc', 'cwaaaaaccwaaaaac', 'caaaaaaccaaaaaac', 'caaaaaaccaaaaaac', 'caaaaaaccaaaaaac', 'caaaaaaccaaaaaac', 'caaaaabccaaaaabc', 'cccccccccccccccc', 'cccccccccccccccc', 'cwaaaaaccwaaaaac', 'caaaaaaccaaaaaac', 'caaaaaaccaaaaaac', 'caaaaaaccaaaaaac', 'caaaaaaccaaaaaac', 'caaaaabccaaaaabc', 'cccccccccccccccc'];
        t.top = t.fill = mk('bathTile', rows, S);
      }
    }
    // treetop platform (one-way) and trunk
    const TP = { G: '#00a800', h: '#80d010', d: '#005800', k: '#103000' };
    TILE.treeL = mk('treeL', ['....kkkkkkkkkkkk', '..kkhhhhGhhhhGhh', '.khhGhhhhhhGhhhh', '.khGGGhhGGGGhGGG', 'khGGGGGGGGGGGGGG', 'khGGdGGGGGdGGGGG', 'kGGGGGGGGGGGGGGd', 'kGGGGGdGGGGGGGGG', '.kGdGGGGGGGdGGGG', '.kkGGGGGGGGGGGGG', '...kkkkkkkkkkkkk', '................', '................', '................', '................', '................'], TP);
    TILE.treeM = mk('treeM', ['kkkkkkkkkkkkkkkk', 'hhhhGhhhhhhGhhhh', 'hhGhhhhhhGhhhhhh', 'GGGGhGGGGGGhGGGG', 'GGGGGGGGGGGGGGGG', 'GGdGGGGGGGdGGGGG', 'GGGGGGGGGGGGGGGd', 'GGGGGdGGGGGGGGGG', 'GdGGGGGGGGGdGGGG', 'GGGGGGGGGGGGGGGG', 'kkkkkkkkkkkkkkkk', '................', '................', '................', '................', '................'], TP);
    TILE.treeR = flipH(TILE.treeL);
    TILE.trunk = mk('trunk', Array.from({ length: 16 }, (_, i) => (i % 6 === 1 ? '.....NnnnNnN....' : '.....NnnnnnN....')), { N: '#4c2400', n: '#8c5418' });
    TILE.bridge = mk('bridge', ['NNNNNNNNNNNNNNNN', 'nnnnnnnNnnnnnnnN', 'nYnnnnnNnYnnnnnN', 'nnnnnnnNnnnnnnnN', 'NNNNNNNNNNNNNNNN', '..k...k...k...k.', '.k.k.k.k.k.k.k.k', 'k...k...k...k...', '................', '................', '................', '................', '................', '................', '................', '................'], { n: '#c87c30', Y: '#fce0a8', N: '#5c2c00', k: '#bcbcbc' });
    TILE.pole = mk('pole', Array(16).fill('.......lw.......'), { l: '#58d854', w: '#b8f818' });
    TILE.poleTop = mk('poleTop', ['................', '................', '................', '................', '......yyyy......', '.....yYYyyy.....', '.....yYyyyy.....', '.....yyyyyy.....', '.....yyyyyS.....', '......ySSS......', '.......lw.......', '.......lw.......', '.......lw.......', '.......lw.......', '.......lw.......', '.......lw.......'], { y: '#f8b800', Y: '#fce0a8', S: '#a87818', l: '#58d854', w: '#b8f818' });
    // hot foam (instead of lava): two animation frames for the surface
    for (const f of [0, 1]) {
      const P = painter(16, 16); P.rect(0, 3, 16, 13, '#3cbcfc'); P.rect(0, 9, 16, 7, '#0058f8');
      for (let i = 0; i < 16; i += 4) { P.ellipse((i + f * 2) % 16 + 1.5, 3, 2, 2, '#fcfcfc'); }
      P.set((5 + f * 6) % 16, 7, '#fcfcfc'); P.set((11 + f * 3) % 16, 11, '#c4e4fc');
      TILE['foam' + f] = P.canvas();
    }
    { const P = painter(16, 16); P.rect(0, 0, 16, 16, '#0058f8'); P.set(4, 5, '#3cbcfc'); P.set(11, 10, '#3cbcfc'); TILE.foamDeep = P.canvas(); }
    // bath plug on its chain (the axe at the end of the bridge)
    { const P = painter(16, 32); for (let y = 0; y < 18; y += 3) { P.rect(7, y, 2, 2, '#bcbcbc'); } P.rect(3, 18, 10, 9, '#181818'); P.rect(2, 26, 12, 3, '#4a4a4a'); P.rect(5, 19, 3, 3, '#7c7c7c'); P.outline('#fcfcfc'); TILE.plug = P.canvas(); }
  }

  // ---------- background scenery (own shapes): Alps, clouds, haystacks, fences, apple bushes
  const DECOR = {};
  function buildDecor() {
    const alp = (w, h) => {
      const P = painter(w, h);
      for (let y = 0; y < h; y++) { const half = Math.round((y + 2) * (w / 2) / h); for (let x = w / 2 - half; x < w / 2 + half; x++) P.set(x, y, y < h * 0.32 + ((x * 7) % 5) - 2 ? '#fcfcfc' : (x + y) % 9 === 0 ? '#7c8cac' : '#9cacc8'); }
      P.outline('#4c5c7c'); return P.canvas();
    };
    DECOR.alpBig = alp(96, 48); DECOR.alpSmall = alp(56, 28);
    const cloud = (n) => {
      const w = 24 + n * 16, P = painter(w, 26);
      for (let i = 0; i < n; i++) P.ellipse(14 + i * 16, 12 - (i % 2) * 3, 10, 8, '#fcfcfc');
      P.ellipse(8, 16, 7, 6, '#fcfcfc'); P.ellipse(w - 9, 16, 7, 6, '#fcfcfc'); P.rect(6, 15, w - 12, 8, '#fcfcfc');
      for (let x = 6; x < w - 6; x++) { P.set(x, 22, '#bcdcfc'); P.set(x, 21, (x % 3) ? '#fcfcfc' : '#bcdcfc'); }
      return P.canvas();
    };
    DECOR.cloud1 = cloud(1); DECOR.cloud2 = cloud(2); DECOR.cloud3 = cloud(3);
    const hay = () => { const P = painter(40, 24); P.ellipse(20, 22, 19, 20, '#e8b838'); for (let i = 0; i < 18; i++) P.set(6 + ((i * 13) % 28), 6 + ((i * 7) % 16), '#a87818'); P.rect(0, 22, 40, 2, null); P.outline('#6c4c10'); return P.canvas(); };
    DECOR.hay = hay();
    const bush = (n) => { const w = 16 + n * 14, P = painter(w, 20); for (let i = 0; i < n; i++) P.ellipse(12 + i * 14, 11, 9, 9, '#00a800'); P.rect(4, 12, w - 8, 8, '#00a800'); for (let i = 0; i < n * 3; i++) P.set(7 + ((i * 11) % (w - 12)), 6 + ((i * 5) % 9), i % 3 ? '#80d010' : '#d82800'); P.outline('#004800'); return P.canvas(); };
    DECOR.bush1 = bush(1); DECOR.bush2 = bush(2); DECOR.bush3 = bush(3);
    { const P = painter(16, 16); P.rect(2, 3, 3, 13, '#c87c30'); P.rect(11, 3, 3, 13, '#c87c30'); P.rect(0, 6, 16, 2, '#e09040'); P.rect(0, 11, 16, 2, '#e09040'); P.set(3, 2, '#c87c30'); P.set(12, 2, '#c87c30'); P.outline('#5c2c00'); DECOR.fence = P.canvas(); }
    { const P = painter(16, 16); P.rect(7, 8, 2, 8, '#00a800'); P.ellipse(8, 6, 3, 3, '#f878a8'); P.set(8, 6, '#f8b800'); P.outline('#181818'); DECOR.flower = P.canvas(); }
    // show tent (the castle at the end of a level): 80 × 80, door at the bottom middle
    {
      const P = painter(80, 80);
      for (let y = 30; y < 80; y++) for (let x = 6; x < 74; x++) P.set(x, y, Math.floor((x - 6) / 8) % 2 ? '#fcfcfc' : '#d82800');
      for (let y = 8; y < 30; y++) { const half = Math.round(4 + (y - 8) * 1.75); for (let x = 40 - half; x < 40 + half; x++) P.set(x, y, Math.floor((x + 80) / 8) % 2 ? '#fcfcfc' : '#d82800'); }
      P.rect(2, 28, 76, 4, '#f8b800'); for (let x = 2; x < 78; x += 6) P.rect(x, 32, 3, 3, '#f8b800');
      P.rect(39, 0, 2, 9, '#5c2c00');
      for (let y = 56; y < 80; y++) for (let x = 32; x < 48; x++) { const dx = x - 39.5, dy = y - 60; if (y >= 60 || dx * dx + dy * dy <= 64) P.set(x, y, '#181818'); }
      P.outline('#5c2c00');
      DECOR.tent = P.canvas();
      const F = painter(14, 8); for (let y = 0; y < 8; y++) for (let x = 0; x < 14 - Math.abs(y - 3.5) * 3; x++) F.set(x, y, '#58d854'); DECOR.pennant = F.canvas();
    }
  }
  function buildGfx() { buildCarrie(); buildEnemies(); buildItems(); buildTiles(); buildDecor(); }
