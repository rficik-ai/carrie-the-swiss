// CSS matrix3d that maps the rectangle (0,0)-(w,h) onto a quad (TL, TR, BR, BL), i.e. a perspective warp.
export type Pt = [number, number];

function solve(A: number[][], b: number[]) {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}

/** homography coefficients h0..h7 (h8 = 1) mapping src points to dst points */
export function homography(src: Pt[], dst: Pt[]) {
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  return solve(A, b);
}

export function rectToQuad(w: number, h: number, q: Pt[]) {
  const H = homography([[0, 0], [w, 0], [w, h], [0, h]], q);
  const [a, b, c, d, e, f, g, i] = H;
  // column-major 4x4: x' = (a x + b y + c) / (g x + i y + 1)
  const m = [a, d, 0, g, b, e, 0, i, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.map((v) => +v.toFixed(8)).join(',')})`;
}
