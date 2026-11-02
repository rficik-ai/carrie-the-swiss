M = [
"###################",
"#o.......#.......o#",
"#.##.###.#.###.##.#",
"#.................#",
"#.##.#.#####.#.##.#",
"#....#...#...#....#",
"####.###.#.###.####",
"   #.#.......#.#   ",
"####.#.##-##.#.####",
"......#GGGGG#......",
"####.#.#####.#.####",
"   #.#.......#.#   ",
"####.#.#####.#.####",
"#........#........#",
"#.##.###.#.###.##.#",
"#o.#.....P.....#.o#",
"##.#.#.#####.#.#.##",
"#....#...#...#....#",
"#.######.#.######.#",
"#.................#",
"###################",
]
for i, r in enumerate(M): assert len(r) == 19, (i, len(r), r)
H, W = len(M), 19
from collections import deque
start = [(r, c) for r in range(H) for c in range(W) if M[r][c] == 'P'][0]
seen = {start}; q = deque([start])
while q:
    r, c = q.popleft()
    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
        nr, nc = r + dr, (c + dc) % W
        if 0 <= nr < H and M[nr][nc] not in '#-G' and (nr, nc) not in seen and not (M[nr][nc] == ' ' and (nc < 4 or nc > 14) and nr in (7, 11)):
            seen.add((nr, nc)); q.append((nr, nc))
dots = [(r, c) for r in range(H) for c in range(W) if M[r][c] in '.o']
print('dots', len(dots), 'unreachable', [d for d in dots if d not in seen])
# symmetry
for r in M: assert r == r[::-1], r
print('ok symmetric')
