import { FrequencyMap } from "@kxirk/adt";
import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Accuracy from "./accuracy.js";
import Effect from "./effect.js";


/** @abstract */
const Action = class {
  /** @type {FrequencyMap<Effect|Condition>} */
  #userBefore;
  /** @type {FrequencyMap<Effect|Condition>} */
  #target;
  /** @type {FrequencyMap<Effect|Condition>} */
  #user;
  /** @type {FrequencyMap<Effect|Condition>} */
  #userAfter;

  /** @type {number} */
  #energy;

  /** @type {number} */
  #speed; // ft
  /** @type {number} */
  #range; // ft: self 0, melee (0, 5√2), ranged 5√2+
  /** @type {number} */
  #radius; // tiles: entity 0, tile (0, 1), aoe 1+
  /** @type {Accuracy} */
  #accuracy;

  constructor () {
    this.#userBefore = new FrequencyMap();
    this.#target = new FrequencyMap();
    this.#user = new FrequencyMap();
    this.#userAfter = new FrequencyMap();

    this.energy = 0;

    this.speed = 0;
    this.range = 0;
    this.radius = 0;
    this.accuracy = Accuracy.standard;
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Action}
   */
  static fromJSON (json, reviver) {
    return new Action[json.constructor]().fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }


  /** @type {FrequencyMap<Effect|Condition>} */
  get userBefore () { return this.#userBefore; }

  /** @type {FrequencyMap<Effect|Condition>} */
  get target () { return this.#target; }

  /** @type {FrequencyMap<Effect|Condition>} */
  get user () { return this.#user; }

  /** @type {FrequencyMap<Effect|Condition>} */
  get userAfter () { return this.#userAfter; }


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

  /** @type {number} */
  get range () { return this.#range; }
  set range (range) {
    this.#range = range.clamp(0);
  }

  /** @type {number} */
  get radius () { return this.#radius; }
  set radius (radius) {
    this.#radius = radius.clamp(0);
  }

  /** @type {Accuracy} */
  get accuracy () { return this.#accuracy; }
  set accuracy (accuracy) { this.#accuracy = accuracy; }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Action}
   */
  fromJSON (json, reviver) {
    this.userBefore = fromJSON(json, this, "userBefore", (reviver?.userBefore ?? Effect.fromJSON));
    this.target = fromJSON(json, this, "target", (reviver?.target ?? Effect.fromJSON));
    this.user = fromJSON(json, this, "user", (reviver?.user ?? Effect.fromJSON));
    this.userAfter = fromJSON(json, this, "userAfter", (reviver?.userAfter ?? Effect.fromJSON));

    this.energy = fromJSON(json, this, "energy", reviver?.energy);

    this.speed = fromJSON(json, this, "speed", reviver?.speed);
    this.range = fromJSON(json, this, "range", reviver?.range);
    this.radius = fromJSON(json, this, "radius", reviver?.radius);

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
    json.range = toJSON(this, "range", replacer?.range);
    json.radius = toJSON(this, "radius", replacer?.radius);

    return json;
  }
};
export default Action;
