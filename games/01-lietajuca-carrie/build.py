"""Build the single-file game: puts the three Carrie pieces into game.tpl.html as data URIs."""
import base64, pathlib
here = pathlib.Path(__file__).parent
t = (here / 'game.tpl.html').read_text()
for key, name in [('__BODY__', 'body.webp'), ('__EARL__', 'earL.webp'), ('__EARR__', 'earR.webp')]:
    t = t.replace(key, 'data:image/webp;base64,' + base64.b64encode((here / 'assets' / name).read_bytes()).decode())
(here / 'lietajuca-carrie.html').write_text(t)
print('ok', len(t))
