import "@kxirk/utils/number.js";

import Entity from "./entity.js";


const Condition = class extends Entity {
  /** @type {Effect} */
  #effect;
  /** @type {keyof Type} */
  #type;
  /** @type {boolean} */
  #resistible;

  /** @type {keyof Stack} */
  #stack;
  /** @type {number} */
  #duration;
  /** @type {keyof Tick} */
  #tick;

  constructor () {
    super();
    this.display.push("condition");

    this.effect = null;
    this.type = null;
    this.resistible = false;

    this.stack = null;
    this.duration = 0;
    this.tick = null;
  }

  /**
   * @param {Object} json
   * @returns {Condition}
   */
  static fromJSON (json) {
    return new Condition().fromJSON(json);
  }


  /** @type {Effect} */
  get effect () { return this.#effect; }
  set effect (effect) { this.#effect = effect; }

  /** @type {keyof Type} */
  get type () { return this.#type; }
  set type (type) { this.#type = type; }

  /** @type {boolean} */
  get resistible () { return this.#resistible; }
  set resistible (resistible) { this.#resistible = resistible; }


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
   * @returns {Condition}
   */
  fromJSON (json) {
    super.fromJSON(json);

    this.effect.fromJSON(json.effect);
    this.type = json.type;
    this.resistible = json.resistible;

    this.stack = json.stack;
    this.duration = json.duration;
    this.tick = json.tick;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    const json = super.toJSON();

    json.effect = this.effect.toJSON();
    json.type = this.type;
    json.resistible = this.resistible;

    json.stack = this.stack;
    json.duration = this.duration;
    json.tick = this.tick;

    return json;
  }
};
export default Condition;
