import base64, pathlib, sys
here = pathlib.Path(__file__).parent
shared = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else here.parent / 'shared' / 'sound.js'
A = here / 'assets' if (here / 'assets').exists() else here
t = (here / 'game.tpl.html').read_text().replace('/*__SOUND__*/', shared.read_text())
for i in range(10): t = t.replace(f'__PH{i}__', 'data:image/webp;base64,' + base64.b64encode((A / f'ph{i}.webp').read_bytes()).decode())
t = t.replace('__FLYER__', 'data:image/webp;base64,' + base64.b64encode((A / 'flyer.webp').read_bytes()).decode())
(here / 'carriino-pexeso.html').write_text(t)
print('ok', len(t))
