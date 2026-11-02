import numpy as np, colorsys
from PIL import Image
from scipy import ndimage
def keyed(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g
    alpha = np.clip(1 - (m - 50) / 90, 0, 1)
    spill = np.clip(np.minimum(r, b) - g, 0, None) * (alpha < 1)
    return np.dstack([np.clip(r - spill * .7, 0, 255), g, np.clip(b - spill * .7, 0, 255), alpha * 255])
def blobs(arr, minsize=5000):
    fg = arr[..., 3] > 128
    lab, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab, range(1, n + 1))
    objs = ndimage.find_objects(lab)
    out = [objs[i] for i in range(n) if sizes[i] > minsize]
    return sorted(out, key=lambda s: s[1].start)
h = keyed('raw/heads.png')
bs = blobs(h)
print('heads', len(bs))
for name, (ys, xs) in zip(['head_open', 'head_closed'], bs):
    crop = Image.fromarray(h[max(0, ys.start - 4):ys.stop + 4, max(0, xs.start - 4):xs.stop + 4].astype('uint8'))
    crop = crop.resize((160, round(160 * crop.height / crop.width)), Image.LANCZOS); crop.save(name + '.webp', 'WEBP', quality=88, alpha_quality=90); print(name, crop.size)
v = keyed('raw/vacuum.png'); (ys, xs) = blobs(v)[0]
vc = v[ys.start:ys.stop, xs.start:xs.stop]
base = Image.fromarray(vc.astype('uint8')).resize((160, round(160 * vc.shape[0] / vc.shape[1])), Image.LANCZOS)
arr = np.asarray(base).astype(float)
H, W = arr.shape[:2]; yy, xx = np.mgrid[0:H, 0:W]; rr = np.hypot((xx - W / 2) / (W / 2), (yy - H / 2) / (H / 2))
rgb = arr[..., :3] / 255
hsv = np.array([colorsys.rgb_to_hsv(*p) for p in rgb.reshape(-1, 3)]).reshape(H, W, 3)
ring = (rr > 0.78) & (hsv[..., 1] > 0.35) & (hsv[..., 0] > 0.40) & (hsv[..., 0] < 0.72)
for name, hue in [('vac_red', 0.0), ('vac_pink', 0.9), ('vac_cyan', 0.5), ('vac_orange', 0.08)]:
    out = arr.copy()
    hh = hsv.copy(); hh[..., 0] = np.where(ring, hue, hh[..., 0]); hh[..., 1] = np.where(ring, np.minimum(1, hh[..., 1] * 1.2), hh[..., 1])
    rgb2 = np.array([colorsys.hsv_to_rgb(*p) for p in hh.reshape(-1, 3)]).reshape(H, W, 3) * 255
    out[..., :3] = np.where(ring[..., None], rgb2, arr[..., :3])
    Image.fromarray(out.astype('uint8')).save(name + '.webp', 'WEBP', quality=88, alpha_quality=90)
print('vac', base.size)
# hedge: seamless
t = np.asarray(Image.open('raw/hedge.png').convert('RGB')).astype(float)
for ax in (0, 1):
    n = t.shape[ax]; k = int(n * 0.14); t = np.moveaxis(t, ax, 0); tile = t[k:].copy()
    for i in range(k): w = i / k; tile[n - 2 * k + i] = tile[n - 2 * k + i] * (1 - w) + t[i] * w
    t = np.moveaxis(tile, 0, ax)
Image.fromarray(t.astype('uint8')).resize((200, 200), Image.LANCZOS).save('hedge.webp', 'WEBP', quality=84)
