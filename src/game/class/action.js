import { fromJSON, toJSON, serializable } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Accuracy from "./accuracy.js"; /* eslint-disable-line import/no-cycle */ // serialize
import Effect from "./effect.js";
import Shape from "./shape.js";


/**
 * @abstract
 */
const Action = class {
  // #region Instance
  /** @type {Effect} */ #userBefore;
  /** @type {Effect} */ #target;
  /** @type {Effect} */ #user;
  /** @type {Effect} */ #userAfter;

  /** @type {number} */ #energy;

  /** @type {number} */ #speed; // ft
  /** @type {Shape} */ #shape;
  /** @type {Accuracy} */ #accuracy;


  constructor () {
    this.#userBefore = null;
    this.#target = null;
    this.#user = null;
    this.#userAfter = null;

    this.#energy = 0;

    this.#speed = 0;
    this.#shape = null;
    this.#accuracy = null;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {Effect} */
  get userBefore () { return this.#userBefore; }
  set userBefore (userBefore) { this.#userBefore = userBefore; }

  /** @type {Effect} */
  get target () { return this.#target; }
  set target (target) { this.#target = target; }

  /** @type {Effect} */
  get user () { return this.#user; }
  set user (user) { this.#user = user; }

  /** @type {Effect} */
  get userAfter () { return this.#userAfter; }
  set userAfter (userAfter) { this.#userAfter = userAfter; }


  /** @type {number} */
  get energy () { return this.#energy; }
  set energy (energy) {
    this.#energy = energy.clamp(0);
  }


  /** @type {number} */
  get speed () { return this.#speed; }
  set speed (speed) {
    this.#speed = speed.clamp(0);
  }

  /** @type {Shape} */
  get shape () { return this.#shape; }
  set shape (shape) { this.#shape = shape; }

  /** @type {Accuracy} */
  get accuracy () { return this.#accuracy; }
  set accuracy (accuracy) { this.#accuracy = accuracy; }
  // #endregion


  // #region Serialize
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    if (json.userBefore) this.userBefore = fromJSON(json, this, "userBefore", (reviver?.userBefore ?? Effect.fromJSON));
    if (json.target) this.target = fromJSON(json, this, "target", (reviver?.target ?? Effect.fromJSON));
    if (json.user) this.user = fromJSON(json, this, "user", (reviver?.user ?? Effect.fromJSON));
    if (json.userAfter) this.userAfter = fromJSON(json, this, "userAfter", (reviver?.userAfter ?? Effect.fromJSON));

    this.energy = fromJSON(json, this, "energy", reviver?.energy);

    this.speed = fromJSON(json, this, "speed", reviver?.speed);
    this.shape = fromJSON(json, this, "shape", (reviver?.shape ?? Shape.fromJSON));
    this.accuracy = fromJSON(json, this, "accuracy", (reviver?.accuracy ?? Accuracy.fromJSON));

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

    json.userBefore = toJSON(this, "userBefore", replacer?.userBefore);
    json.target = toJSON(this, "target", replacer?.target);
    json.user = toJSON(this, "user", replacer?.user);
    json.userAfter = toJSON(this, "userAfter", replacer?.userAfter);

    json.energy = toJSON(this, "energy", replacer?.energy);

    json.speed = toJSON(this, "speed", replacer?.speed);
    json.shape = toJSON(this, "shape", replacer?.shape);
    json.accuracy = toJSON(this, "accuracy", (replacer?.accuracy ?? Accuracy.toJSON));

    return json;
  }
  // #endregion
};
export default serializable(Action, true);
