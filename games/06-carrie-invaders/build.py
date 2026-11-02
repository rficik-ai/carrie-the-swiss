"""Build Carrie Invaders into one HTML file. Pixel art helpers, Carrie's sprites and the font come from Super Carrie."""
import pathlib, sys
here = pathlib.Path(__file__).parent
shared = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else here.parent / 'shared' / 'sound.js'
gfx = here.parent / '05-super-carrie' / 'src' / '10-gfx.js'
src = '\n'.join([gfx.read_text()] + [p.read_text() for p in sorted((here / 'src').glob('*.js'))])
t = (here / 'shell.html').read_text().replace('/*__SOUND__*/', shared.read_text()).replace('/*__SRC__*/', src)
(here / 'carrie-invaders.html').write_text(t)
print('ok', len(t))
