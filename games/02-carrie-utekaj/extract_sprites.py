"""Cut a white-background sprite sheet into separate transparent sprites."""
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
src, prefix = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(int)
white = (a.min(axis=2) > 228) & ((a.max(axis=2) - a.min(axis=2)) < 22)
lab, n = ndimage.label(white)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(border))
fg = ~bg
fg = ndimage.binary_opening(fg, iterations=2)
# soft alpha: distance-based feather of 1.5 px
alpha = Image.fromarray((fg * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.1))
al = np.asarray(alpha).astype(float) / 255
al = np.clip((al - 0.25) / 0.6, 0, 1)
# remove white halo: un-premultiply against white
rgb = a.astype(float)
w = np.clip(al, 0.05, 1)[..., None]
rgb = np.clip((rgb - 255 * (1 - w)) / w, 0, 255)
out = np.dstack([rgb, al * 255]).astype('uint8')
# split into blobs
lab2, n2 = ndimage.label(fg)
sizes = ndimage.sum(fg, lab2, range(1, n2 + 1))
keep = [i + 1 for i, s in enumerate(sizes) if s > 4000]
objs = ndimage.find_objects(lab2)
boxes = sorted([objs[k - 1] for k in keep], key=lambda s: s[1].start)
for i, (ys, xs) in enumerate(boxes):
    pad = 6
    y0, y1, x0, x1 = max(0, ys.start - pad), min(a.shape[0], ys.stop + pad), max(0, xs.start - pad), min(a.shape[1], xs.stop + pad)
    Image.fromarray(out[y0:y1, x0:x1]).save(f'{prefix}{i}.png')
    print(i, x1 - x0, y1 - y0, 'feet y', y1)
