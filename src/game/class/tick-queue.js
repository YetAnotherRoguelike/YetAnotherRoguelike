import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/array.js";

import Condition from "./condition.js";
import Stack from "./stack.js";


const TickQueue = class {
  // #region Instance
  /** @type {Condition[]} */ #stack;
  /** @type {Map<Class<Condition>, Condition>} */ #map;


  constructor () {
    this.#stack = [];
    this.#map = new Map();
  }
  // #endregion

  // #region Instance Accessors
  /** @type {Condition[]} */
  get stack () { return this.#stack; }

  /** @type {Map<Class<Condition>, Condition>} */
  get map () { return this.#map; }
  // #endregion

  // #region Instance Methods
  /**
   * @param {Class<Condition>} ConditionClass
   * @returns {Condition[]}
   */
  get (ConditionClass) {
    const match = this.stack.filter((condition) => (condition instanceof ConditionClass));
    const map = this.map.get(ConditionClass); if (map) match.push(map);

    return match;
  }

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
      this.map.set(condition.constructor, condition);
      return condition;
    }
    if (condition.stack === Stack.ignore) {
      return existing;
    }
    if (condition.stack === Stack.replace) {
      this.map.set(condition.constructor, condition);
      return condition;
    }
    if (condition.stack === Stack.extend) {
      existing.duration += condition.duration;
      return existing;
    }

    return undefined;
  }

  /**
   * @param {Class<Condition>} ConditionClass
   * @param {boolean} [stopFirst]
   * @param {boolean} [newestFirst]
   * @returns {Condition[]}
   */
  remove (ConditionClass, stopFirst = false, newestFirst = false) {
    const removed = [];

    // stack
    if (newestFirst) {
      for (let i = (this.stack.length - 1); i >= 0; i--) {
        if (this.stack[i] instanceof ConditionClass) {
          removed.push(this.stack.remove(i));
          if (stopFirst) return removed;
        }
      }
    }
    else {
      for (let i = 0; i < this.stack.length; i++) {
        if (this.stack[i] instanceof ConditionClass) {
          removed.push(this.stack.remove(i)); i--;
          if (stopFirst) return removed;
        }
      }
    }
    // map
    const condition = this.map.get(ConditionClass);
    if (condition) {
      removed.push(condition);

      this.map.delete(ConditionClass);
    }

    return removed;
  }


  /**
   * @returns {Iterator<Condition>}
   */
  * [Symbol.iterator] () {
    yield* this.stack[Symbol.iterator]();
    yield* this.map.values();
  }
  // #endregion


  // #region Serialize
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
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
  // #endregion
};
export default TickQueue;
