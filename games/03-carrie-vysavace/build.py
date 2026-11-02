import base64, pathlib, sys
here = pathlib.Path(__file__).parent
shared = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else here.parent / 'shared' / 'sound.js'
t = (here / 'game.tpl.html').read_text().replace('/*__SOUND__*/', shared.read_text())
m = {'__SIDE0__': 'side_closed', '__SIDE1__': 'side_half', '__SIDE2__': 'side_open', '__VACR__': 'vac_red', '__VACP__': 'vac_pink', '__VACC__': 'vac_cyan', '__VACO__': 'vac_orange', '__HEDGE__': 'hedge'}
A = here / 'assets' if (here / 'assets').exists() else here
for k, n in m.items(): t = t.replace(k, 'data:image/webp;base64,' + base64.b64encode((A / (n + '.webp')).read_bytes()).decode())
(here / 'carrie-vysavace.html').write_text(t)
print('ok', len(t))
