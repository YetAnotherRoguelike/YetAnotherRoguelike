import { Point } from "@yetanotherroguelike/class";


/**
 * @param {Tile[][]} tiles
 * @param {Point} point
 * @returns {Tile}
 */
export const tileAt = (tiles, point) => tiles[point.y][point.x];

/**
 * @param {Point} a
 * @param {Point} b
 * @returns {number} ft
 */
export const tileDistance = (a, b) => 5 * Math.sqrt(Math.abs(a.x - b.x) ** 2 + Math.abs(a.y - b.y) ** 2);

/**
 * @param {Tile} tile
 * @param {Object.<string, boolean>} [properties]
 * @returns {boolean}
 */
export const tileMatch = (tile, properties = {}) => {
  for (const property of Object.keys(properties)) {
    if ( tile[property] !== properties[property] ) {
      return false;
    }
  }

  return true;
};


/**
 * @param {Tile[][]} tiles
 * @param {Object.<string, boolean>} [properties]
 * @param {Function} [map]
 * @returns {boolean[][]}
 */
export const tilesMatch = (tiles, properties = {}, map = (match) => match) => {
  const matrix = [];

  for (let y = 0; y < tiles.length; y++) {
    matrix[y] = [];

    for (let x = 0; x < tiles[y].length; x++) {
      const point = new Point(x, y);
      const tile = tileAt(tiles, point);

      const match = tileMatch(tile, properties);
      matrix[y][x] = map(match);
    }
  }

  return matrix;
};
