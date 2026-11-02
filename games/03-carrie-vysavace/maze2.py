M = [
"############################",
"#o...........##...........o#",
"#.####.#####.##.#####.####.#",
"#.####.#####.##.#####.####.#",
"#..........................#",
"#.####.##.########.##.####.#",
"#......##....##....##......#",
"######.#####.##.#####.######",
"XXXXX#.##          ##.#XXXXX",
"XXXXX#.## ###--### ##.#XXXXX",
"######.## #GGGGGG# ##.######",
"      .   #GGGGGG#   .      ",
"######.## #GGGGGG# ##.######",
"XXXXX#.## ######## ##.#XXXXX",
"XXXXX#.##          ##.#XXXXX",
"######.##.########.##.######",
"#............##............#",
"#.####.#####.##.#####.####.#",
"#o..##................##..o#",
"###.##.##.########.##.##.###",
"#......##....##....##......#",
"#.##########.##.##########.#",
"#..........................#",
"############################",
]
for i, r in enumerate(M): assert len(r) == 28, (i, len(r), r)
for r in M: assert r == r[::-1], r
H, W = len(M), 28
walk = lambda r, c: 0 <= r < H and M[r][c % W] not in '#X-G'
# dead ends
dead = []
for r in range(H):
    for c in range(W):
        if not walk(r, c): continue
        n = sum(walk(r + dr, (c + dc) % W) for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)))
        if n < 2: dead.append((r, c))
print('dead ends', dead)
from collections import deque
s = (18, 13); seen = {s}; q = deque([s])
while q:
    r, c = q.popleft()
    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
        nr, nc = r + dr, (c + dc) % W
        if walk(nr, nc) and (nr, nc) not in seen: seen.add((nr, nc)); q.append((nr, nc))
dots = [(r, c) for r in range(H) for c in range(W) if M[r][c] in '.o']
print('dots', len(dots), 'unreach', [d for d in dots if d not in seen], 'walk total', sum(walk(r,c) for r in range(H) for c in range(W)), 'reached', len(seen))
