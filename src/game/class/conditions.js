import TickQueue from "./tick-queue.js";


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
   * @param {Class<Condition>} Class
   * @returns {Condition[]}
   */
  get (Class) {
    const before = this.before.get(Class);
    const after = this.after.get(Class);
    const persist = this.persist.get(Class);

    return [...before, ...after, ...persist];
  }

  /**
   * @param {Class<Condition>} Class
   * @returns {boolean}
   */
  has (Class) {
    return this.get(Class).length > 0;
  }

  /**
   * @param {Class<Condition>} Class
   * @param {boolean} [stopFirst]
   * @param {boolean} [newestFirst]
   * @returns {Condition[]}
   */
  remove (Class, stopFirst = false, newestFirst = false) {
    const before = this.before.remove(Class, stopFirst, newestFirst);
    const after = this.after.remove(Class, stopFirst, newestFirst);
    const persist = this.persist.remove(Class, stopFirst, newestFirst);

    return [...before, ...after, ...persist];
  }


  /**
   * @returns {Iterator<Condition>}
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
