"""Wrap a built single-file game into a full page under public/herna/<slug>/index.html."""
import pathlib, sys
GAMES = {
    'lietajuca-carrie': ('01-lietajuca-carrie/lietajuca-carrie.html', 'Lietajúca Carrie – hra s Carrie z Carrie the Swiss. Prelietajte cez stohy kníh a zbierajte výstavné posudky.'),
    'carrie-utekaj': ('02-carrie-utekaj/carrie-utekaj.html', 'Carrie uteká – utečte s Carrie pred kúpaním cez dedinu a tunel, vybehnite na vozy so senom a zbierajte kostičky.'),
    'carrie-a-vysavace': ('03-carrie-vysavace/carrie-vysavace.html', 'Carrie a vysávače – zjedzte všetky granule v záhradnom bludisku skôr, než ich vysajú robotické vysávače.'),
    'pexeso': ('04-carriino-pexeso/carriino-pexeso.html', 'Carriino pexeso – nájdite dvojice skutočných fotiek Carrie.'),
}
root = pathlib.Path(__file__).resolve().parent
for slug in (sys.argv[1:] or GAMES):
    src, desc = GAMES[slug]
    body = (root / src).read_text()
    end = body.index('</style>') + len('</style>')
    head = ('<!doctype html>\n<html lang="sk">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'<meta name="description" content="{desc}">\n<meta name="theme-color" content="#170f08">\n'
            '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n')
    out = root.parent / 'public' / 'herna' / slug / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(head + body[:end] + '\n</head>\n<body>\n' + body[end:] + '\n</body>\n</html>\n')
    print(out, out.stat().st_size)
