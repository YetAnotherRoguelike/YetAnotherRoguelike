import { fromJSON, toJSON } from "@kxirk/serialize";

import TickQueue from "./tick-queue.js";


const Conditions = class {
  // #region Instance
  /** @type {TickQueue} */ #before;
  /** @type {TickQueue} */ #after;
  /** @type {TickQueue} */ #persist;


  constructor () {
    this.#before = new TickQueue();
    this.#after = new TickQueue();
    this.#persist = new TickQueue();
  }
  // #endregion

  // #region Instance Accessors
  /** @type {TickQueue} */
  get before () { return this.#before; }

  /** @type {TickQueue} */
  get after () { return this.#after; }

  /** @type {TickQueue} */
  get persist () { return this.#persist; }
  // #endregion

  // #region Instance Methods
  /**
   * @param {Class<Condition>} ConditionClass
   * @returns {Condition[]}
   */
  get (ConditionClass) {
    const before = this.before.get(ConditionClass);
    const after = this.after.get(ConditionClass);
    const persist = this.persist.get(ConditionClass);

    return [...before, ...after, ...persist];
  }

  /**
   * @param {Class<Condition>} ConditionClass
   * @returns {boolean}
   */
  has (ConditionClass) {
    return this.get(ConditionClass).length > 0;
  }

  /**
   * @param {Condition} condition
   * @returns {Condition}
   */
  add (condition) {
    return this[condition.tick].add(condition);
  }

  /**
   * @param {Class<Condition>} ConditionClass
   * @param {boolean} [stopFirst]
   * @param {boolean} [newestFirst]
   * @returns {Condition[]}
   */
  remove (ConditionClass, stopFirst, newestFirst) {
    const before = this.before.remove(ConditionClass, stopFirst, newestFirst);
    const after = this.after.remove(ConditionClass, stopFirst, newestFirst);
    const persist = this.persist.remove(ConditionClass, stopFirst, newestFirst);

    return [...before, ...after, ...persist];
  }


  /**
   * @returns {Iterator<Condition>}
   */
  * [Symbol.iterator] () {
    yield* this.before[Symbol.iterator]();
    yield* this.after[Symbol.iterator]();
    yield* this.persist[Symbol.iterator]();
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
    fromJSON(json, this, "before", reviver?.before);
    fromJSON(json, this, "after", reviver?.after);
    fromJSON(json, this, "persist", reviver?.persist);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.before = toJSON(this, "before", replacer?.before);
    json.after = toJSON(this, "after", replacer?.after);
    json.persist = toJSON(this, "persist", replacer?.persist);

    return json;
  }
  // #endregion
};
export default Conditions;
