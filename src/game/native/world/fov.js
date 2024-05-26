import { Point } from "@yetanotherroguelike/class";

import Empty from "../tile/empty.js";
import { pointLine } from "./point.js";
import { tileAt, tileMatch, tilesMatch } from "./tile.js";


/**
 * @param {Tile[][]} tiles
 * @param {Point[]} center
 * @param {number} [radius]
 * @returns {Point[]}
 */
export const fov = (tiles, center, radius = Infinity) => {
  /** @type {Map.<number, Set.<number>>} */
  const visible = new Map();
  Object.defineProperty(visible, "get", {
    /**
     * @param {number} x
     * @returns {Set.<number>}
     */
    value (x) {
      if ( !this.has(x) ) this.set(x, new Set());

      return Map.prototype.get.call(this, x);
    },
    enumerable: false
  });

  /**
   * @param {number} y
   * @param {number} startSlope
   * @param {number} endSlope
   * @param {Object} transform
   * @param {number} radius
   */
  // https://gist.github.com/370417/59bb06ced7e740e11ec7dda9d82717f6
  const scan = (y, startSlope, endSlope, transform, radius) => {
    if (radius === 0) return;
    if (startSlope >= endSlope) return;

    const xmin = Math.round((y - 0.5) * startSlope);
    const xmax = Math.ceil(((y + 0.5) * endSlope) - 0.5);

    for (let x = xmin; x <= xmax; x++) {
      const pointx = center.x + (x * transform.xx) + (y * transform.xy);
      const pointy = center.y + (x * transform.yx) + (y * transform.yy);
      const point = new Point(pointx, pointy);

      const tile = tileAt(tiles, point);
      const bevel = 0.375;

      if ( tileMatch(tile, { transparent: true }) ) {
        if ( (x >= (y * startSlope)) && ((x <= (y * endSlope))) ) visible.get(pointx).add(pointy);
      }
      else {
        if ( !(tile instanceof Empty) && (x >= ((y - (1 - bevel)) * startSlope)) && ((x - bevel) <= (y * endSlope)) ) visible.get(pointx).add(pointy);
        scan(y + 1, startSlope, ((x - bevel) / y), transform, radius - 1);

        startSlope = ((x + (1 - bevel)) / y);
        if (startSlope >= endSlope) return;
      }
    }

    scan(y + 1, startSlope, endSlope, transform, radius - 1);
  };

  const transforms = [
    { xx: 1, xy: 0, yx: 0, yy: 1 },
    { xx: 1, xy: 0, yx: 0, yy: -1 },
    { xx: -1, xy: 0, yx: 0, yy: 1 },
    { xx: -1, xy: 0, yx: 0, yy: -1 },
    { xx: 0, xy: 1, yx: 1, yy: 0 },
    { xx: 0, xy: 1, yx: -1, yy: 0 },
    { xx: 0, xy: -1, yx: 1, yy: 0 },
    { xx: 0, xy: -1, yx: -1, yy: 0 }
  ];

  visible.get(center.x).add(center.y);
  for (const transform of transforms) {
    scan(1, 0, 1, transform, radius);
  }


  return [...visible.entries()].flatMap(([x, set]) => [...set].map((y) => new Point(x, y)));
};

/**
 * @param {Tile[][]} tiles
 * @param {Point} start
 * @param {Point} stop
 * @param {Object.<string, boolean>} [properties]
 * @param {boolean} [includeFirstException]
 * @returns {Point[]}
 */
export const line = (tiles, start, stop, properties = {}, includeFirstException = false) => {
  const matrix = tilesMatch(tiles, properties);
  const points = pointLine(start, stop);

  const result = [];
  for (const point of points) {
    if ( matrix[point.y][point.x] ) {
      result.push(point);
    }
    else if (includeFirstException) {
      result.push(point);
      break;
    }
    else break;
  }

  return result;
};
