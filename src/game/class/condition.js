import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Entity from "./entity.js";
import Effect from "./effect.js";


/** @abstract */
const Condition = class extends Entity {
  /** @type {Effect} */
  #effect;
  /** @type {keyof Type} */
  #type;

  /** @type {Stack} */
  #stack;
  /** @type {number} */
  #duration;
  /** @type {Tick} */
  #tick;

  constructor () {
    super();
    this.display.push("condition");

    this.#effect = null;
    this.#type = null;

    this.#stack = null;
    this.#duration = 0;
    this.#tick = null;
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Condition}
   */
  static fromJSON (json, reviver) {
    return new Condition[json.constructor]().fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }


  /** @type {Effect} */
  get effect () { return this.#effect; }
  set effect (effect) { this.#effect = effect; }

  /** @type {keyof Type} */
  get type () { return this.#type; }
  set type (type) { this.#type = type; }


  /** @type {keyof Stack} */
  get stack () { return this.#stack; }
  set stack (stack) { this.#stack = stack; }

  /** @type {number} */
  get duration () { return this.#duration; }
  set duration (duration) { this.#duration = duration.clamp(0); }

  /** @type {keyof Tick} */
  get tick () { return this.#tick; }
  set tick (tick) { this.#tick = tick; }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Condition}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, reviver);

    this.effect = fromJSON(json, this, "effect", (reviver?.effect ?? Effect.fromJSON));
    this.type = fromJSON(json, this, "type", reviver?.type);

    this.stack = fromJSON(json, this, "stack", reviver?.stack);
    this.duration = fromJSON(json, this, "duration", reviver?.duration);
    this.tick = fromJSON(json, this, "tick", reviver?.tick);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.effect = toJSON(this, "effect", replacer?.effect);
    json.type = toJSON(this, "type", replacer?.type);

    json.stack = toJSON(this, "stack", replacer?.stack);
    json.duration = toJSON(this, "duration", replacer?.duration);
    json.tick = toJSON(this, "tick", replacer?.tick);

    return json;
  }
};
export default Condition;
