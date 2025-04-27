import { Point, Points } from "@yetanotherroguelike/class";
import { depths } from "@yetanotherroguelike/data";

import Empty from "../tile/empty.js";
import { pointDistance } from "./point.js";


/**
 * @param {Point} point
 * @returns {Tile}
 */
export const tileAt = (point) => depths[point.z][point.y][point.x];

/**
 * @param {Point} a
 * @param {Point} b
 * @returns {number} ft
 */
export const tileDistance = (a, b) => 5 * pointDistance(a, b);

/**
 * @param {Point} point
 * @returns {boolean}
 */
export const tileExists = (point) => {
  if (point.z >= depths.length || point.z < 0) return false;

  const depth = depths[point.z];
  if (point.y >= depth.length || point.y < 0) return false;

  const row = depth[point.y];
  if (point.x >= row.length || point.x < 0) return false;

  return true;
};

/**
 * @param {Point} point
 * @returns {boolean}
 */
export const tileEmpty = (point) => tileAt(point) instanceof Empty;

/**
 * @param {Point} point
 * @param {TileProperties} [properties]
 * @returns {boolean}
 */
export const tileMatch = (point, properties = {}) => {
  for (const property of Object.keys(properties)) {
    if (tileAt(point)[property] !== properties[property]) {
      return false;
    }
  }

  return true;
};


/**
 * @param {Point[]} points
 * @returns {Tile[]}
 */
export const tilesAt = (points) => points.map((point) => tileAt(point));

/**
 * @param {Point[]} points
 * @returns {Point[]}
 */
export const tilesExist = (points) => points.filter((point) => tileExists(point));

/**
 * @typedef {number} x
 * @typedef {number} y
 * @typedef {number} z
 * @typedef {[?x, ?y, ?z]} Padding
 */
/**
 * @param {Point} start
 * @param {Point} [stop]
 * @param {Padding} [padding]
 * @returns {boolean}
 */
export const tilesEmpty = (start, stop = start, padding = [0, 0, 0]) => {
  const offset = new Point(...padding);

  const startOffset = new Point((start.x + offset.x), (start.y + offset.y), (start.z + offset.z));
  if (!tileExists(startOffset)) return false;

  const stopOffset = new Point((stop.x + offset.x), (stop.y + offset.y), (stop.z + offset.z));
  if (!tileExists(stopOffset)) return false;

  for (let z = (start.z - offset.z); z <= (stop.z + offset.z); z++) {
    for (let y = (start.y - offset.y); y <= (stop.y + offset.y); y++) {
      for (let x = (start.x - offset.x); x <= (stop.x + offset.x); x++) {
        const point = new Point(x, y, z);

        if (!tileExists(point)) return false;

        if (!tileEmpty(point)) return false;
      }
    }
  }

  return true;
};

/**
 * @param {Point[]} points
 * @param {TileProperties} [properties]
 * @returns {Point[]}
 */
export const tilesMatch = (points, properties = {}) => points.filter((point) => tileMatch(point, properties));

/**
 * @param {number[]} depthsSearch
 * @param {TileProperties} properties
 * @returns {Point[]}
 */
export const tilesMatchSearch = (depthsSearch, properties = {}) => {
  const points = [];

  for (const z of depthsSearch) {
    for (let y = 0; y < depths[z].length; y++) {
      for (let x = 0; x < depths[z][y].length; x++) {
        const point = new Point(x, y, z);
        if (tileMatch(point, properties)) points.push(point);
      }
    }
  }

  return points;
};

/**
 * @param {Point} point
 * @param {Points} visited
 * @param {Points} match
 * @param {TileProperties} [properties]
 * @param {Points} [contained]
 */
const floodFill = (point, visited, match, properties = {}, contained = new Points()) => {
  if (!tileExists(point)) return;

  if (contained.size > 0 && !contained.has(...point)) return;

  if (visited.has(...point)) return;
  visited.add(...point);

  if (!tileMatch(point, properties)) return;
  match.add(...point);

  floodFill(new Point((point.x - 1), point.y, point.z), visited, match, properties, contained);
  floodFill(new Point((point.x + 1), point.y, point.z), visited, match, properties, contained);
  floodFill(new Point(point.x, (point.y - 1), point.z), visited, match, properties, contained);
  floodFill(new Point(point.x, (point.y + 1), point.z), visited, match, properties, contained);
};

/**
 * @param {Point} start
 * @param {TileProperties} [properties]
 * @param {Point[]} [contained]
 * @returns {Point[]}
 */
export const tilesFill = (start, properties = {}, contained = []) => {
  const visited = new Points();
  const match = new Points();

  floodFill(start, visited, match, properties, new Points(contained));

  return [...match];
};
