import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/array.js";

import Condition from "./condition.js";
import Stack from "./stack.js";


const TickQueue = class {
  /** @type {Condition[]} */
  #stack;
  /** @type {Map<string, Condition>} */
  #map;

  constructor () {
    this.#stack = [];
    this.#map = new Map();
  }


  /** @type {Condition[]} */
  get stack () { return this.#stack; }

  /** @type {Map<string, Condition>} */
  get map () { return this.#map; }


  /**
   * @param {Condition} condition
   * @returns {Condition}
   */
  add (condition) {
    if (condition.stack === Stack.stack) {
      this.stack.push(condition);
      return condition;
    }

    const existing = this.map.get(condition.name);
    if (existing === undefined) {
      this.map.set(condition.name, condition);
      return condition;
    }
    if (condition.stack === Stack.ignore) {
      return existing;
    }
    if (condition.stack === Stack.replace) {
      // end existing

      this.map.set(condition.name, condition);
      return condition;
    }
    if (condition.stack === Stack.extend) {
      existing.duration += condition.duration;
      return existing;
    }

    return null;
  }

  /**
   * @param {Class<Condition>} Class
   * @returns {Condition[]}
   */
  get (Class) {
    const match = this.stack.filter((condition) => condition instanceof Class);
    const map = this.map.get(Class.name); if (map) match.push(map);

    return match;
  }

  /**
   * @param {Class<Condition>} Class
   * @param {boolean} stopFirst
   * @param {boolean} newestFirst
   * @returns {Condition[]}
   */
  remove (Class, stopFirst, newestFirst) {
    const removed = [];

    if (newestFirst || !stopFirst) {
      for (let i = this.stack.length - 1; i >= 0; i--) {
        if (this.stack[i] instanceof Class) {
          removed.push(this.stack.remove(i));
          if (stopFirst) return removed;
        }
      }
    }
    else {
      for (let i = 0; i < this.stack.length; i++) {
        if (this.stack[i] instanceof Class) {
          removed.push(this.stack.remove(i)); i--;
          if (stopFirst) return removed;
        }
      }
    }
    const map = this.map.get(Class.name); if (map) removed.push(map); this.map.delete(Class.name);

    return removed;
  }


  /**
   * @returns {Iterator<Condition>}
   */
  [Symbol.iterator] () {
    return [...this.stack, ...this.map.values()][Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {TickQueue}
   */
  fromJSON (json, reviver) {
    fromJSON(json, this, "stack", (reviver?.stack ?? { value: Condition.fromJSON }));
    fromJSON(json, this, "map", (reviver?.map ?? { value: Condition.fromJSON }));

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.stack = toJSON(this, "stack", replacer?.stack);
    json.map = toJSON(this, "map", replacer?.map);

    return json;
  }
};
export default TickQueue;
