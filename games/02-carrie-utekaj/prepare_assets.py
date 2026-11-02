"""Prepare painted sprites (magenta key) and seamless textures for Carrie uteká."""
import numpy as np, sys, os
from PIL import Image
from scipy import ndimage
R = 'raw/'; O = 'tex/'; os.makedirs(O, exist_ok=True)
def key(name, out, height=None, width=None):
    a = np.asarray(Image.open(R + name + '.png').convert('RGB')).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g
    alpha = np.clip(1 - (m - 50) / 90, 0, 1)
    spill = np.clip(m, 0, None) * (1 - alpha) * 0 + np.clip(np.minimum(r, b) - np.maximum(g, 0), 0, None) * (alpha < 1)
    r2 = np.clip(r - spill * 0.7, 0, 255); b2 = np.clip(b - spill * 0.7, 0, 255)
    fg = alpha > 0.5
    lab, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab, range(1, n + 1))
    big = max(range(n), key=lambda i: sizes[i]) + 1
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > sizes[big - 1] * 0.02])
    alpha = alpha * ndimage.binary_dilation(keep, iterations=2)
    ys, xs = np.where(alpha > 0.05); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    img = Image.fromarray(np.dstack([r2, g, b2, alpha * 255]).astype('uint8')[y0:y1, x0:x1])
    if height: img = img.resize((round(img.width * height / img.height), height), Image.LANCZOS)
    if width: img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(O + out + '.webp', 'WEBP', quality=86, alpha_quality=90, method=6); print(out, img.size)
def seam(name, out, size, axes=(0, 1), crop=None):
    im = Image.open(R + name + '.png').convert('RGB')
    if crop: im = im.crop(crop)
    t = np.asarray(im).astype(float)
    for ax in axes:
        n = t.shape[ax]; h = int(n * 0.14)
        t = np.moveaxis(t, ax, 0)
        tile = t[h:].copy()
        for i in range(h):
            w = i / h
            tile[n - h - h + i] = tile[n - h - h + i] * (1 - w) + t[i] * w
        t = np.moveaxis(tile, 0, ax)
    img = Image.fromarray(t.astype('uint8')).resize(size, Image.LANCZOS)
    img.save(O + out + '.webp', 'WEBP', quality=84, method=6); print(out, img.size)
key('hay', 'hay', width=300)
key('fence', 'fence', width=360)
key('barrel', 'barrel', width=300)
key('apple', 'apple', height=460)
key('linden', 'linden', height=460)
key('bush', 'bush', width=300)
key('sunfl', 'sunfl', height=380)
key('stack', 'stack', height=360)
if os.path.exists(R + 'laundry1.png'): key('laundry1', 'laundry', height=420)
seam('road', 'road', (240, 432), axes=(0,))
seam('grass', 'grass', (320, 320))
seam('roof', 'roof', (256, 256))
seam('haytex', 'haytex', (256, 256))
seam('wood', 'wood', (256, 256))
for w in ['wallA', 'wallB']:
    im = Image.open(R + w + '.png').convert('RGB'); im.resize((768, round(768 * im.height / im.width)), Image.LANCZOS).save(O + w + '.webp', 'WEBP', quality=84, method=6); print(w)
im = Image.open(R + 'gable.png').convert('RGB'); im.resize((480, 480), Image.LANCZOS).save(O + 'gable.webp', 'WEBP', quality=84, method=6)
