"""Build Super Carrie into one self-contained HTML file (all pixel art is drawn in code, no image files)."""
import pathlib, sys
here = pathlib.Path(__file__).parent
shared = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else here.parent / 'shared' / 'sound.js'
src = '\n'.join(p.read_text() for p in sorted((here / 'src').glob('*.js')))
t = (here / 'shell.html').read_text().replace('/*__SOUND__*/', shared.read_text()).replace('/*__SRC__*/', src)
(here / 'super-carrie.html').write_text(t)
print('ok', len(t))
