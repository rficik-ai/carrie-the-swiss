#!/usr/bin/env python3
"""Modern-format copies of the homepage pictures (AVIF + WebP; the original JPEG stays as the fallback).

Two kinds of copies, never smaller on screen than the original:
  f  same pixel size as the original: the wall frames (the camera zooms in on them), the photo backs, the shelf
  t  thumbnail for the little squares under the wall stories (54 css px, 44 on phones): 176 px on the short side,
     sharp up to a 3.2x screen at 54 px and 4x at 44 px; the full-screen view still opens the original file

For every copy the lowest quality is chosen whose SSIM (RGB, Wang et al. settings) reaches TARGET: a full-size copy
against the original, for the whole picture AND every 128 px part of it (text on a mostly blank paper); a thumbnail
against the original scaled down cleanly, at its own size and at the size it is shown. An AVIF/WebP copy that doesn't
save at least 10 % against its fallback is left out: photos that already carry JPEG grain need near-lossless AVIF to
stay at SSIM 0.99, so most of the big ones keep only their JPEG.
Writes public/assets/opt/<folder>/... and src/data/pics.json (read by src/lib/pic.ts).

    python3 scripts/optimize-images.py [--report report.json]

Needs Pillow >= 11.3 (built-in AVIF), numpy and scikit-image.
"""
import io, json, os, re, sys
from concurrent.futures import ProcessPoolExecutor
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, 'public')
MANIFEST = os.path.join(ROOT, 'src', 'data', 'pics.json')
TARGET = 0.991          # searched for; every file written is >= 0.99 (checked again after the final encode)
FLOOR = 0.99
KEEP = 0.9              # an AVIF/WebP copy is kept only if it saves at least 10 % against its fallback
THUMB = 176             # short side of a thumbnail (px)
SHOWN = 132             # thumbnails are also compared at the size they are shown (44 css px on a 3x phone)


def sources():
    """(public path, kind) pairs, read from the data files the components use."""
    jobs = set()
    wall = open(os.path.join(ROOT, 'src', 'data', 'wall.ts'), encoding='utf-8').read()
    base = dict(re.findall(r"\b([AIH]) = '([^']+)'", wall))
    for k, name in re.findall(r"cover: ([AIH]) \+ '([^']+)'", wall):
        jobs.add((base[k] + name, 'f'))
    for k, name in re.findall(r"src: ([AIH]) \+ '([^']+)'", wall):
        jobs.add((base[k] + name, 't'))
    photos = open(os.path.join(ROOT, 'src', 'data', 'photos.ts'), encoding='utf-8').read()
    for p in re.findall(r'"back": "([^"]+)"', photos):
        jobs.add((p, 'f'))
    # (tried as well and left out: the shelf JPEGs, CSS backgrounds, and the slider photos of the reduced-motion page:
    # at SSIM 0.99 their AVIF saves nothing / under 10 % on the film grain)
    return sorted(jobs)


def ssim(a, b, tile=None):
    """SSIM of the whole picture and (with tile) of its worst tile (tile x tile px, half overlapping), whichever is
    lower: a page that is mostly blank must not hide softened text in its corner"""
    m, s = structural_similarity(np.asarray(a), np.asarray(b), channel_axis=2, data_range=255, gaussian_weights=True,
                                 sigma=1.5, use_sample_covariance=False, full=True)
    if not tile:
        return float(m)
    s = s.mean(axis=2)[5:-5, 5:-5]                     # the 11 px window's border, as in the mean
    c = np.pad(s.cumsum(0).cumsum(1), ((1, 0), (1, 0)))
    h, w = s.shape
    t = min(tile, h, w)
    step = max(1, t // 2)
    ys, xs = np.unique(np.r_[np.arange(0, h - t + 1, step), h - t]), np.unique(np.r_[np.arange(0, w - t + 1, step), w - t])
    y, x = np.meshgrid(ys, xs, indexing='ij')
    tiles = (c[y + t, x + t] - c[y, x + t] - c[y + t, x] + c[y, x]) / (t * t)
    return float(min(m, tiles.min()))


def encode(im, fmt, q, opt):
    b = io.BytesIO()
    if fmt == 'avif':
        im.save(b, 'AVIF', quality=q, speed=opt.get('speed', 6), subsampling=opt['ss'])
    elif fmt == 'webp':
        im.save(b, 'WEBP', quality=q, method=6)
    else:
        im.save(b, 'JPEG', quality=q, optimize=True, progressive=True, subsampling=opt['ss'])
    return b.getvalue()


def decode(data):
    return Image.open(io.BytesIO(data)).convert('RGB')


def short_side(im, s):
    w, h = im.size
    k = s / min(w, h)
    return im.resize((max(1, round(w * k)), max(1, round(h * k))), Image.Resampling.LANCZOS)


def score(ref, data, thumb=False):
    """SSIM of the copy against its reference. A full-size copy: the whole picture and every 128 px tile. A thumbnail
    (a 44-54 px square, where it is the whole picture that is seen) against the original scaled down cleanly (Lanczos),
    at its own size and again at the size it is shown: what is measured is what the encoding loses, not the
    (unavoidable) difference between two ways of scaling down"""
    out = decode(data)
    if not thumb:
        return ssim(ref, out, 128)
    shown = (round(ref.size[0] * SHOWN / min(ref.size)), round(ref.size[1] * SHOWN / min(ref.size)))
    lz = Image.Resampling.LANCZOS
    return min(ssim(ref, out), ssim(ref.resize(shown, lz), out.resize(shown, lz)))


def search(ref, fmt, lo, hi, opt, thumb=False):
    """lowest quality reaching TARGET (binary search), re-encoded at the final speed and checked again"""
    best = None
    while lo <= hi:
        q = (lo + hi) // 2
        data = encode(ref, fmt, q, opt)
        s = score(ref, data, thumb)
        if s >= TARGET:
            best, hi = (q, data, s), q - 1
        else:
            lo = q + 1
    if best and fmt == 'avif':
        q, data, s = best
        fine = encode(ref, fmt, q, {**opt, 'speed': 4})
        s4 = score(ref, fine, thumb)
        if s4 >= TARGET and len(fine) < len(data):
            best = (q, fine, s4)
    return best


def job(args):
    path, kind = args
    src = os.path.join(PUBLIC, path.lstrip('/'))
    orig = Image.open(src).convert('RGB')
    folder, name = path.split('/')[-2], os.path.splitext(os.path.basename(path))[0]
    stem = f'/assets/opt/{folder}/{name}' + (f'-t{THUMB}' if kind == 't' else '')
    thumb = kind == 't'
    ref = short_side(orig, THUMB) if thumb else orig
    out = {'src': path, 'kind': kind, 'w': ref.size[0], 'h': ref.size[1], 'orig_bytes': os.path.getsize(src), 'files': {}}

    def attempt(fmt, lo, hi, ss):
        r = search(ref, fmt, lo, hi, {'ss': ss}, thumb)
        return None if r is None else (*r, ss)

    tries = {
        'avif': [attempt('avif', 20, 98, ss) for ss in ('4:2:0', '4:4:4')],
        'webp': [attempt('webp', 40, 100, '4:2:0')],          # lossy WebP is always 4:2:0
    }
    if kind == 't':
        tries['jpg'] = [attempt('jpg', 40, 98, ss) for ss in ('4:2:0', '4:4:4')]
    best = {}
    for fmt, cands in tries.items():
        cands = [c for c in cands if c and c[2] >= FLOOR]
        if cands:
            best[fmt] = min(cands, key=lambda c: len(c[1]))
    # the fallback the <img> keeps: the original, or for a thumbnail its JPEG copy
    fallback = len(best['jpg'][1]) if 'jpg' in best else os.path.getsize(src)
    for fmt, (q, data, s, ss) in best.items():
        if fmt != 'jpg' and len(data) > KEEP * fallback:
            continue           # not worth a second file: the fallback serves
        url = f'{stem}.{fmt}'
        dst = os.path.join(PUBLIC, url.lstrip('/'))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with open(dst, 'wb') as f:
            f.write(data)
        out['files'][fmt] = {'url': url, 'q': q, 'ss': ss, 'ssim': round(s, 4), 'bytes': len(data)}
    return out


def main():
    report_path = sys.argv[sys.argv.index('--report') + 1] if '--report' in sys.argv else None
    jobs = sources()
    with ProcessPoolExecutor() as ex:
        results = list(ex.map(job, jobs))
    manifest = {}
    for r in results:
        files = r['files']
        entry = {k: files[k]['url'] for k in ('avif', 'webp', 'jpg') if k in files}
        if r['kind'] == 't':
            entry.update(w=r['w'], h=r['h'])
        if entry:
            manifest.setdefault(r['src'], {})[r['kind']] = entry
        line = '  '.join(f"{k} q{v['q']} {v['ss']} ssim {v['ssim']:.4f} {v['bytes'] / 1024:.0f} KB" for k, v in files.items())
        print(f"{r['kind']} {r['src']:42} {r['orig_bytes'] / 1024:6.0f} KB -> {line}")
    with open(MANIFEST, 'w', encoding='utf-8') as f:
        json.dump(dict(sorted(manifest.items())), f, indent=1)
        f.write('\n')
    if report_path:
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=1)


if __name__ == '__main__':
    main()
