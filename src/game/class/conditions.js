import "@kxirk/utils/array.js";

import Condition from "./condition.js";
import Stack from "./stack.js";


export const TickQueue = class {
  /** @type {Condition[]} */
  #stack;
  /** @type {Map.<Condition>} */
  #map;

  constructor () {
    this.#stack = [];
    this.#map = new Map();
  }

  /**
   * @param {Object} json
   * @returns {TickQueue}
   */
  static fromJSON (json) {
    return new TickQueue().fromJSON(json);
  }


  /** @type {Condition[]} */
  get stack () { return this.#stack; }

  /** @type {map.<Condition>} */
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
   * @param {string} name
   * @returns {Condition[]}
   */
  get (name) {
    const match = this.stack.filter((condition) => condition.name === name);
    const map = this.map.get(name); if (map) match.push(map);

    return match;
  }

  /**
   * @param {Condition} condition
   * @returns {boolean}
   */
  remove (condition) {
    if (condition.stack === Stack.stack) {
      const index = this.stack.indexOf(condition);
      if (index >= 0) {
        this.stack.remove(index);

        return true;
      }

      return false;
    }
    return this.map.delete(condition.name);
  }


  /**
   * @returns {Function}
   */
  [Symbol.iterator] () {
    return [...this.stack, ...this.map.values()][Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @returns {TickQueue}
   */
  fromJSON (json) {
    this.stack.write(...json.stack.map((condition) => Condition.fromJSON(condition)));
    for (const condition of json.map) this.map.set(condition.name, Condition.fromJSON(condition));

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      stack: this.stack,
      map: this.set.values()
    };
  }
};

const Conditions = class {
  /** @type {TickQueue} */
  #before;
  /** @type {TickQueue} */
  #after;
  /** @type {TickQueue} */
  #persist;

  constructor () {
    this.#before = new TickQueue();
    this.#after = new TickQueue();
    this.#persist = new TickQueue();
  }

  /**
   * @param {Object} json
   * @returns {Conditions}
   */
  static fromJSON (json) {
    return new Conditions().fromJSON(json);
  }


  /** @type {TickQueue} */
  get before () { return this.#before; }

  /** @type {TickQueue} */
  get after () { return this.#after; }

  /** @type {TickQueue} */
  get persist () { return this.#persist; }


  /**
   * @param {Condition} condition
   * @returns {Condition}
   */
  add (condition) {
    return this[condition.tick].add(condition);
  }

  /**
   * @param {string} name
   * @returns {Condition[]}
   */
  get (name) {
    const before = this.before.get(name);
    const after = this.after.get(name);
    const persist = this.persist.get(name);

    return [...before, ...after, ...persist];
  }

  /**
   * @param {Condition} condition
   * @returns {boolean}
   */
  remove (condition) {
    return this[condition.tick].remove(condition);
  }


  /**
   * @returns {Function}
   */
  [Symbol.iterator] () {
    return [...this.before, ...this.after, ...this.persist][Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @returns {Conditions}
   */
  fromJSON (json) {
    this.before.fromJSON(json.before);
    this.after.fromJSON(json.after);
    this.persist.fromJSON(json.persist);

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      before: this.before.toJSON(),
      after: this.after.toJSON(),
      persist: this.persist.toJSON()
    };
  }
};
export default Conditions;
