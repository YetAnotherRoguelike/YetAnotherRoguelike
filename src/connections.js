import { connections as settings } from "./settings.js";


/** @type {Map.<string, number>} */
const connections = new Map();
Object.defineProperty(connections, "increment", {
  /**
   * @param {string} ip
   * @returns {number}
   */
  value (ip) {
    connections.set(ip, connections.get(ip) + 1);

    return connections.get(ip);
  },
  enumerable: false
});
Object.defineProperty(connections, "decrement", {
  /**
   * @param {string} ip
   * @returns {number}
   */
  value (ip) {
    connections.set(ip, connections.get(ip) - 1);

    return connections.get(ip);
  },
  enumerable: false
});

/**
 * @param {string} ip
 * @returns {number}
 */
export const count = (ip) => (connections.get(ip) ?? 0);

/**
 * @param {string} ip
 * @returns {boolean}
 */
export const valid = (ip) => {
  const total = [...connections.values()].reduce((acc, countIP) => (acc + countIP), 0);
  if (total >= settings.max) return false;

  if (count(ip) >= settings.maxIP) return false;

  return true;
};

/**
 * @param {string} ip
 * @returns {boolean}
 */
export const create = (ip) => {
  if (valid(ip)) {
    if ( !connections.has(ip) ) connections.set(ip, 0);
    connections.increment(ip);

    return true;
  }

  return false;
};

/**
 * @param {string} ip
 * @returns {undefined}
 */
export const close = (ip) => {
  connections.decrement(ip);

  if (count(ip) === 0) connections.delete(ip);
};


export default {
  connections,
  count,
  valid,
  create,
  close
};
