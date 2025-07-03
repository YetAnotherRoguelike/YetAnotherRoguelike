import "@kxirk/random/array.js";
import "@kxirk/utils/array.js";
import "@kxirk/utils/number.js";

import { Point } from "@yetanotherroguelike/class";


/**
 * @param {Point} a
 * @param {Point} b
 * @returns {number}
 */
export const pointDistance = (a, b) => Math.sqrt(((a.x - b.x) ** 2) + ((a.y - b.y) ** 2) + ((a.z - b.z) ** 2));

/**
 * @param {Point} point
 * @param {Point} to
 * @param {boolean} [relative]
 * @returns {Point}
 */
export const pointOffset = (point, to, relative = false) => {
  const offset = new Point((to.x - point.x), (to.y - point.y), (to.z - point.z));

  if (relative) {
    const distance = pointDistance(point, to);

    if (distance === 0) return offset;
    return new Point((offset.x / distance), (offset.y / distance), (offset.z / distance));
  }

  return offset;
};

/**
 * @param {Point} point
 * @param {Point} to
 * @returns {Point}
 */
export const pointHeading = (point, to) => {
  const offset = pointOffset(point, to);

  return new Point(offset.x.clamp(-1, 1), offset.y.clamp(-1, 1), offset.z.clamp(-1, 1));
};


/**
 * @param {Point[]} center
 * @param {number} radius
 * @param {boolean} [excludeCenter]
 * @returns {Point[]}
 */
export const pointsAdjacent = (center, radius, excludeCenter = false) => {
  const points = [];

  const r = radius.round();
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (excludeCenter && (x === 0) && (y === 0)) continue;

      const point = new Point((center.x + x), (center.y + y), center.z);
      if (pointDistance(center, point) <= radius) points.push(point);
    }
  }

  return points;
};

/**
 * @param {...Point} points
 * @returns {boolean}
 */
export const pointsEqual = (...points) => {
  const { x, y, z } = points.first;

  for (const point of points) {
    if ((point.x !== x) || (point.y !== y)) return false;
    if (point?.z && (point.z !== z)) return false;
  }

  return true;
};

/**
 * @param {Point} start
 * @param {Point} stop
 * @param {boolean} [excludeStart]
 * @returns {Point[]}
 */
export const pointsLine = (start, stop, excludeStart = false) => {
  const points = [];

  let x = start.x; const dx = Math.abs(stop.x - x); const sx = ((x < stop.x) ? 1 : -1);
  let y = start.y; const dy = Math.abs(stop.y - y); const sy = ((y < stop.y) ? 1 : -1);
  const z = start.z;

  let error = (dx - dy);
  while (true) {
    const point = new Point(x, y, z);

    if (pointsEqual(start, point)) {
      if (!excludeStart) {
        points.push(point);
      }
    }
    else {
      points.push(point);
    }

    if ((x === stop.x) && (y === stop.y)) break;

    const e2 = (2 * error);
    if (e2 > -dy) { error -= dy; x += sx; }
    if (e2 < dx) { error += dx; y += sy; }
  }

  return points;
};
