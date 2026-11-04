// Geometry of the shelf scene, measured on the last frame of the scroll film (1920x1080).
export const SHELF = {
  edges: [286, 395, 498, 601, 710, 818, 928, 1037, 1146, 1259, 1373, 1484, 1588], // book boundaries (x)
  top: 188, bottom: 786,            // book top / bottom (y)
  numTop: 8, numH: 50, numSize: 31, // engraved number, relative to the book top
  captionTop: 84,                   // "Season one · Pull out a book" on the board above
  region: { x: 255, y: 62, w: 1365, h: 810 }, // what must fit below the menu
};
