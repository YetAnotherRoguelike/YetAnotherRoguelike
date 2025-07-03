import { fromJSON, toJSON, serializable } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Effect from "./effect.js";


/**
 * @abstract
 */
const Condition = class {
  // #region Instance
  /** @type {string} */ #name;
  /** @type {string} */ #description;

  /** @type {string[]} */ #display;
  /** @type {Color} */ #color;

  /** @type {Effect} */ #effect;
  /** @type {keyof Type} */ #type;

  /** @type {Stack} */ #stack;
  /** @type {number} */ #duration;
  /** @type {Tick} */ #tick;


  constructor () {
    this.#name = null;
    this.#description = null;

    this.#display = ["condition"];
    this.#color = null;

    this.#effect = null;
    this.#type = null;

    this.#stack = null;
    this.#duration = 0;
    this.#tick = null;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {string} */
  get name () { return this.#name; }
  set name (name) { this.#name = name; }

  /** @type {string} */
  get description () { return this.#description; }
  set description (description) { this.#description = description; }


  /** @type {string[]} */
  get display () { return this.#display; }

  /** @type {Color} */
  get color () { return this.#color; }
  set color (color) { this.#color = color; }


  /** @type {Effect} */
  get effect () { return this.#effect; }
  set effect (effect) { this.#effect = effect; }

  /** @type {keyof Type} */
  get type () { return this.#type; }
  set type (type) { this.#type = type; }


  /** @type {Stack} */
  get stack () { return this.#stack; }
  set stack (stack) { this.#stack = stack; }

  /** @type {number} */
  get duration () { return this.#duration; }
  set duration (duration) {
    this.#duration = duration.clamp(0);
  }

  /** @type {Tick} */
  get tick () { return this.#tick; }
  set tick (tick) { this.#tick = tick; }
  // #endregion


  // #region Serialize
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    this.name = fromJSON(json, this, "name", reviver?.name);
    this.description = fromJSON(json, this, "description", reviver?.description);

    fromJSON(json, this, "display", reviver?.display);
    this.color = fromJSON(json, this, "color", reviver?.color);

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
    const json = {};
    json.constructor = toJSON(this, "constructor", replacer?.constructor);

    json.name = toJSON(this, "name", replacer?.name);
    json.description = toJSON(this, "description", replacer?.description);

    json.display = toJSON(this, "display", replacer?.display);
    json.color = toJSON(this, "color", replacer?.color);

    json.effect = toJSON(this, "effect", replacer?.effect);
    json.type = toJSON(this, "type", replacer?.type);

    json.stack = toJSON(this, "stack", replacer?.stack);
    json.duration = toJSON(this, "duration", replacer?.duration);
    json.tick = toJSON(this, "tick", replacer?.tick);

    return json;
  }
  // #endregion
};
export default serializable(Condition, true);
