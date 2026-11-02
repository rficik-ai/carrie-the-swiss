"""Build into one HTML file: shared sound + pixel-game kit, Super Carrie's pixel art and font, then this game's code."""
import pathlib, sys
here = pathlib.Path(__file__).parent
shared = here.parent / 'shared'
parts = [shared / 'retro-kit.js', here.parent / '05-super-carrie' / 'src' / '10-gfx.js'] + sorted((here / 'src').glob('*.js'))
src = '\n'.join(p.read_text() for p in parts)
t = (here / 'shell.html').read_text().replace('/*__SOUND__*/', (shared / 'sound.js').read_text()).replace('/*__SRC__*/', src)
out = here / (here.name.split('-', 1)[1] + '.html')
out.write_text(t)
print('ok', out.name, len(t))
