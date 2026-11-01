// "A walk through Carrie's house": the film continues after the photo wall.
// Each stop is a still (later: the last frame of its video) with an interactive layer on top.
// Coordinates are in the 1920x1080 frame.
export type Rect = { x: number; y: number; w: number; h: number };
export type HouseStop = {
  id: 'wall' | 'desk' | 'garden' | 'fire' | 'door';
  img: string;
  video?: string; videoMobile?: string;   // the move INTO this stop (added once generated)
  region: Rect;                            // desktop: keep this inside the screen, below the menu
  phone: { cx: number; cy: number; h: number; ui: number }; // phone: centre on (cx, cy), fit h px of frame height, leave ui px free at the bottom
};

export const HOUSE_START = 0.97;         // share of the old 1000vh film where the house begins
export const STOPS: HouseStop[] = [
  { id: 'wall', img: '/assets/house/wall-v1.jpg', region: { x: 270, y: 40, w: 1450, h: 960 }, phone: { cx: 990, cy: 560, h: 980, ui: 0 } },
  { id: 'desk', img: '/assets/house/desk-v1.jpg', region: { x: 320, y: 160, w: 1300, h: 800 }, phone: { cx: 905, cy: 540, h: 1080, ui: 0 } },
  { id: 'garden', img: '/assets/house/garden-v1.jpg', region: { x: 0, y: 0, w: 1920, h: 1080 }, phone: { cx: 1230, cy: 560, h: 1080, ui: 0 } },
  { id: 'fire', img: '/assets/house/fire-v1.jpg', region: { x: 0, y: 0, w: 1920, h: 1080 }, phone: { cx: 560, cy: 560, h: 1080, ui: 0 } },
  { id: 'door', img: '/assets/house/door-v1.jpg', region: { x: 0, y: 0, w: 1920, h: 1080 }, phone: { cx: 1180, cy: 560, h: 1080, ui: 0 } },
];

// scroll lengths in vh (of the visible height) after the old film
const MOVE = 160, MOVE_VIDEO = 220;
const HOLD: Record<HouseStop['id'], number> = { wall: 200, desk: 150, garden: 170, fire: 160, door: 140 };
export type Step = { kind: 'move' | 'hold'; stop: HouseStop['id']; from: number; len: number };

function build() {
  const t: Step[] = []; let at = 0;
  for (const s of STOPS) {
    const m = s.video ? MOVE_VIDEO : MOVE;
    t.push({ kind: 'move', stop: s.id, from: at, len: m }); at += m;
    t.push({ kind: 'hold', stop: s.id, from: at, len: HOLD[s.id] }); at += HOLD[s.id];
  }
  return { t, total: at };
}
const { t: timeline, total } = build();

// where the menu links land (vh after the start of the house), a little into each hold
const anchorAt = (id: HouseStop['id']) => timeline.find((x) => x.kind === 'hold' && x.stop === id)!.from + 15;
export const HOUSE = {
  stops: STOPS,
  timeline: { steps: timeline, total, start: HOUSE_START },
  anchors: [
    { id: 'carrie', at: anchorAt('wall') },
    { id: 'papers-game', at: anchorAt('desk') },
    { id: 'quiz', at: anchorAt('garden') },
    { id: 'ask', at: anchorAt('fire') },
    { id: 'follow', at: anchorAt('door') },
  ],
};
