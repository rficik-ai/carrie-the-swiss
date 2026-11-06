// Modern-format copies of the homepage pictures, made by scripts/optimize-images.py (how the quality is chosen: there).
// f = the same pixel size as the original, t = thumbnail (176 px on the short side). A picture without copies: the file itself.
// Used in <picture style="display:contents"> (the <img> lays out exactly as before); a full-screen view keeps the original.
import PICS from '../data/pics.json';

type Copies = { avif?: string; webp?: string; jpg?: string; w?: number; h?: number };
const M = PICS as Record<string, { f?: Copies; t?: Copies }>;

export type Pic = { src: string; avif?: string; webp?: string };
export function pic(src: string, kind: 'f' | 't'): Pic {
  const c = M[src]?.[kind];
  return { src: c?.jpg ?? src, avif: c?.avif, webp: c?.webp };
}
