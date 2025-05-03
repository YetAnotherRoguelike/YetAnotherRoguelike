import { Point, Points, Tile } from "@yetanotherroguelike/class";

import { pointDistance, pointHeading, pointLine } from "./point.js";
import { tileEmpty, tileExists, tileMatch, tilesMatch } from "./tile.js";


/**
 * @typedef {Object} Octant
 * @property {number} xx
 * @property {number} xy
 * @property {number} yx
 * @property {number} yy
 */
/** @type {Octant[]} */
const octants = [
  { index: 0, xx: 0, xy: 1, yx: 1, yy: 0 },
  { index: 1, xx: 1, xy: 0, yx: 0, yy: 1 },
  { index: 2, xx: -1, xy: 0, yx: 0, yy: 1 },
  { index: 3, xx: 0, xy: -1, yx: 1, yy: 0 },
  { index: 4, xx: 0, xy: -1, yx: -1, yy: 0 },
  { index: 5, xx: -1, xy: 0, yx: 0, yy: -1 },
  { index: 6, xx: 1, xy: 0, yx: 0, yy: -1 },
  { index: 7, xx: 0, xy: 1, yx: -1, yy: 0 }
];

/**
 * @param {Point} direction
 * @param {number} arc
 * @param {boolean} [reverse]
 * @returns {Octant[]}
 */
const directionToOctants = (() => {
  /** @type {Points} */
  const directions = new Points([
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    [-1, 1, 0],
    [-1, 0, 0],
    [-1, -1, 0],
    [0, -1, 0],
    [1, -1, 0]
  ], true);

  /** @type {WeakMap<Point, number>} */
  const directionsToOctantsIndex = new Map([...directions].map((direction, i) => [direction, i]));

  return (direction, arc, reverse = false) => {
    const results = [];

    const index = directionsToOctantsIndex.get(directions.get(direction.x, direction.y, 0));
    for (let i = (index - arc); i < (index + arc); i++) {
      results.push(octants.at(Math.floor(i % octants.length)));
    }

    if (reverse) results.reverse();
    return results;
  };
})();

/**
 * Based on shadowcasting.js by Albert Ford: https://gist.github.com/370417/59bb06ced7e740e11ec7dda9d82717f6
 * @param {Point} center
 * @param {Point} heading
 * @param {number} [radius]
 * @param {number} [angle] degrees
 * @param {TileProperties} [properties]
 * @param {boolean} [excludeCenter]
 * @param {boolean} [reverse]
 * @returns {Point[]}
 */
export const fov = (center, heading, radius = Infinity, angle = 210, properties = Tile.transparent, excludeCenter = false, reverse = false) => {
  const direction = pointHeading(center, heading);
  const arc = Math.ceil(angle / 90);
  const oct = (angle % 90);
  const slope = (oct === 0 ? 1 : (oct / 90));
  const bevel = 0.375;

  const visible = new Points();
  if (!excludeCenter) visible.add(...center);

  /**
   * @param {number} y
   * @param {number} start
   * @param {number} end
   * @param {Octant} octant
   */
  const scan = (y, start, end, octant) => {
    if (start >= end) return;

    const xmin = Math.round((y - 0.5) * start);
    const xmax = Math.ceil(((y + 0.5) * end) - 0.5);
    for (let x = xmin; x <= xmax; x++) {
      const pointx = center.x + (octant.xx * x) + (octant.xy * y);
      const pointy = center.y + (octant.yx * x) + (octant.yy * y);
      const point = new Point(pointx, pointy, center.z);

      let skip = false;
      if (pointDistance(center, point) > radius) skip = true;
      if (!tileExists(point)) skip = true;

      if (!skip && tileMatch(point, properties)) {
        if ((x >= (y * start)) && (x <= (y * end))) visible.add(...point);
      }
      else {
        if (!skip && !tileEmpty(point) && (x >= ((y + bevel - 1) * start)) && ((x - bevel) <= (y * end))) visible.add(...point);
        scan(y + 1, start, ((x - bevel) / y), octant);

        start = ((x - bevel + 1) / y);
        if (start >= end) return;
      }
    }

    scan(y + 1, start, end, octant);
  };

  const directionOctants = directionToOctants(direction, arc, reverse);
  const peripheral = [directionOctants.first, directionOctants.last]; if (reverse) peripheral.reverse();
  for (const octant of directionOctants) {
    if (octant === peripheral.first) {
      if (octant.index % 2 === 0) scan(1, (1 - slope), 1, octant);
      else scan(1, 0, slope, octant);
    }
    else if (octant === peripheral.last) {
      if (octant.index % 2 === 1) scan(1, (1 - slope), 1, octant);
      else scan(1, 0, slope, octant);
    }
    else scan(1, 0, 1, octant);
  }

  return visible.values();
};

/**
 * @param {Point} start
 * @param {Point} stop
 * @param {TileProperties} [properties]
 * @param {boolean} [excludeStart]
 * @param {boolean} [excludeFirstException]
 * @returns {Point[]}
 */
export const line = (start, stop, properties = Tile.transparent, excludeStart = false, excludeFirstException = false) => {
  const points = pointLine(start, stop, excludeStart);
  const match = new Set(tilesMatch(points, properties));

  const result = [];
  for (const point of points) {
    if (match.has(point)) {
      result.push(point);
    }
    else if (!excludeFirstException) {
      result.push(point);
      break;
    }
    else break;
  }

  return result;
};
