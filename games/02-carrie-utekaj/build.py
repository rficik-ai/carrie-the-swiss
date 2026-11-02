"""Build the single-file game: embeds Carrie, geese, painted sprites and textures as data URIs."""
import base64, pathlib, re
here = pathlib.Path(__file__).parent
A = here / 'assets'
t = (here / 'game.tpl.html').read_text()
for key, name in [('__RUN0__', 'run0'), ('__RUN1__', 'run1'), ('__JUMP__', 'jump'), ('__SLIDE__', 'slide'), ('__GOOSE0__', 'goose0'), ('__GOOSE1__', 'goose1'), ('__GOOSE2__', 'goose2')]:
    t = t.replace(key, 'data:image/webp;base64,' + base64.b64encode((A / (name + '.webp')).read_bytes()).decode())
for name in set(re.findall(r'__T_(\w+?)__', t)):
    t = t.replace(f'__T_{name}__', 'data:image/webp;base64,' + base64.b64encode((A / 'tex' / (name + '.webp')).read_bytes()).decode())
(here / 'carrie-utekaj.html').write_text(t)
print('ok', len(t))
