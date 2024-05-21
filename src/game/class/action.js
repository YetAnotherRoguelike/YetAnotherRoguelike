import { FrequencyMap } from "@kxirk/adt";
import "@kxirk/utils/number.js";

import Accuracy from "./accuracy.js";


const Action = class {
  /** @type {FrequencyMap.<Effect|Condition>} */
  #userBefore;
  /** @type {FrequencyMap.<Effect|Condition>} */
  #target;
  /** @type {FrequencyMap.<Effect|Condition>} */
  #user;
  /** @type {FrequencyMap.<Effect|Condition>} */
  #userAfter;

  /** @type {number} */
  #speed; // ft
  /** @type {number} */
  #range; // ft: self 0, melee (0, 5√2), ranged 5√2+
  /** @type {number} */
  #radius; // tiles: entity 0, tile (0, 1), aoe 1+
  /** @type {AccuracyFunction} */
  #accuracy;

  constructor () {
    this.#userBefore = new FrequencyMap();
    this.#target = new FrequencyMap();
    this.#user = new FrequencyMap();
    this.#userAfter = new FrequencyMap();

    this.speed = 0;
    this.range = 0;
    this.radius = 0;
    this.accuracy = Accuracy.standard;
  }

  /**
   * @param {Object} json
   * @returns {Action}
   */
  static fromJSON (json) {
    return new Action().fromJSON(json);
  }


  /** @type {FrequencyMap.<Effect|Condition>} */
  get userBefore () { return this.#userBefore; }

  /** @type {FrequencyMap.<Effect|Condition>} */
  get target () { return this.#target; }

  /** @type {FrequencyMap.<Effect|Condition>} */
  get user () { return this.#user; }

  /** @type {FrequencyMap.<Effect|Condition>} */
  get userAfter () { return this.#userAfter; }


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

  /** @type {AccuracyFunction} */
  get accuracy () { return this.#accuracy; }
  set accuracy (accuracy) { this.#accuracy = accuracy; }


  /**
   * @param {Object} json
   * @returns {Action}
   */
  fromJSON (json) {
    for (const [key, value] of Object.entries(json.userBefore)) this.userBefore.set(key, value);
    for (const [key, value] of Object.entries(json.target)) this.target.set(key, value);
    for (const [key, value] of Object.entries(json.user)) this.user.set(key, value);
    for (const [key, value] of Object.entries(json.userAfter)) this.userAfter.set(key, value);

    this.speed = json.speed;
    this.range = json.range;
    this.radius = json.radius;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      userBefore: Object.fromEntries(this.userBefore),
      target: Object.fromEntries(this.target),
      user: Object.fromEntries(this.user),
      userAfter: Object.fromEntries(this.userAfter),

      speed: this.speed,
      range: this.range,
      radius: this.radius
    };
  }
};
export default Action;
