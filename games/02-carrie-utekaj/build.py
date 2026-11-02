import base64, pathlib, sys
here = pathlib.Path(__file__).parent
t = (here / 'game.tpl.html').read_text()
for key, name in [('__RUN0__', 'run0'), ('__RUN1__', 'run1'), ('__JUMP__', 'jump'), ('__SLIDE__', 'slide')]:
    t = t.replace(key, 'data:image/webp;base64,' + base64.b64encode((here / 'assets' / (name + '.webp')).read_bytes()).decode())
(here / 'carrie-utekaj.html').write_text(t)
print('ok', len(t))
