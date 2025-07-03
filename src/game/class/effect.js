import { fromJSON, toJSON, serializable } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import EffectRange from "./effect-range.js";


/**
 * @returns {ProxyHandler<Object<string, EffectRange>>}
 */
const handler = () => ({
  /**
   * @param {Object<string, EffectRange>} target
   * @param {string} property
   * @returns {EffectRange}
   */
  get (target, property) {
    return target[property];
  },
  /**
   * @typedef {Object} EffectRangeLike
   * @property {number | undefined} min
   * @property {number | undefined} max
   * @property {number | undefined} avg
   */
  /**
   * @typedef {number | undefined} min
   * @typedef {number | undefined} max
   * @typedef {number | undefined} avg
   * @typedef {[min, max, avg]} EffectRangeOrdered
   */
  /**
   * @param {Object<string, EffectRange>} target
   * @param {string} property
   * @param {EffectRange | EffectRangeLike | EffectRangeOrdered | Number | number} value
   * @returns {boolean}
   */
  set (target, property, value) {
    target[property] ??= new EffectRange();

    if (value instanceof EffectRange) {
      target[property] = value;

      return true;
    }
    if (value instanceof Array) {
      target[property].set(...value);

      return true;
    }
    if (value instanceof Number) {
      target[property].min = undefined;
      target[property].max = undefined;
      target[property].avg = value.valueOf();

      return true;
    }
    if (value instanceof Object) {
      target[property].set(value.min, value.max, value.avg);

      return true;
    }
    if (Number.isFinite(value)) {
      target[property].min = undefined;
      target[property].max = undefined;
      target[property].avg = value;

      return true;
    }

    return false;
  }
});

/**
 * @returns {ProxyHandler<Object<string, EffectRange>>}
 */
const critical = () => ({
  /**
   * @param {Effect} target
   * @param {string} property
   * @returns {Object<string, EffectRange>}
   */
  get (target, property) {
    if (["critical"].includes(property)) {
      return null;
    }

    if (["damage", "buildup"].includes(property)) {
      const base = target[property];
      const crit = new Proxy({}, handler(this));
      for (const [type, value] of Object.entries(base)) {
        if (value.range) {
          crit[type] = new EffectRange((value.min + value.avg), (value.max + value.avg), (2 * value.avg));
        }
        else {
          crit[type] = 2 * value.avg;
        }
      }

      return crit;
    }

    return target[property];
  }
});

/**
 * @abstract
 */
const Effect = class {
  // #region Instance
  /** @type {Effect} */ #critical;

  /** @type {Ability} */ #ability;
  /** @type {Ability} */ #abilityFactor;

  /** @type {Stat} */ #stat;
  /** @type {Stat} */ #statFactor;
  /** @type {Stat} */ #statFactorMax;

  /** @type {Type} */ #damage;
  /** @type {Type} */ #damageFactor;
  /** @type {Type} */ #damageFactorMax;

  /** @type {Type} */ #buildup;
  /** @type {Type} */ #buildupFactor;
  /** @type {Type} */ #buildupFactorMax;


  constructor () {
    this.#critical = new Proxy(this, critical(this));

    this.#ability = new Proxy({}, handler(this));
    this.#abilityFactor = new Proxy({}, handler(this));

    this.#stat = new Proxy({}, handler(this));
    this.#statFactor = new Proxy({}, handler(this));
    this.#statFactorMax = new Proxy({}, handler(this));

    this.#damage = new Proxy({}, handler(this));
    this.#damageFactor = new Proxy({}, handler(this));
    this.#damageFactorMax = new Proxy({}, handler(this));

    this.#buildup = new Proxy({}, handler(this));
    this.#buildupFactor = new Proxy({}, handler(this));
    this.#buildupFactorMax = new Proxy({}, handler(this));
  }
  // #endregion

  // #region Instance Accessors
  /** @type {Effect} */
  get critical () { return this.#critical; }
  set critical (effect) { this.#critical = effect; }


  /** @type {Ability} */
  get ability () { return this.#ability; }

  /** @type {Ability} */
  get abilityFactor () { return this.#abilityFactor; }


  /** @type {Stat} */
  get stat () { return this.#stat; }

  /** @type {Stat} */
  get statFactor () { return this.#statFactor; }

  /** @type {Stat} */
  get statFactorMax () { return this.#statFactorMax; }


  /** @type {Type} */
  get damage () { return this.#damage; }

  /** @type {Type} */
  get damageFactor () { return this.#damageFactor; }

  /** @type {Type} */
  get damageFactorMax () { return this.#damageFactorMax; }


  /** @type {Type} */
  get buildup () { return this.#buildup; }

  /** @type {Type} */
  get buildupFactor () { return this.#buildupFactor; }

  /** @type {Type} */
  get buildupFactorMax () { return this.#buildupFactorMax; }
  // #endregion


  // #region Serialize
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    fromJSON(json, this, "critical", reviver?.critical);

    fromJSON(json, this, "ability", reviver?.ability);
    fromJSON(json, this, "abilityFactor", reviver?.abilityFactor);

    fromJSON(json, this, "stat", reviver?.stat);
    fromJSON(json, this, "statFactor", reviver?.statFactor);
    fromJSON(json, this, "statFactorMax", reviver?.statFactorMax);

    fromJSON(json, this, "damage", reviver?.damage);
    fromJSON(json, this, "damageFactor", reviver?.damageFactor);
    fromJSON(json, this, "damageFactorMax", reviver?.damageFactorMax);

    fromJSON(json, this, "buildup", reviver?.buildup);
    fromJSON(json, this, "buildupFactor", reviver?.buildupFactor);
    fromJSON(json, this, "buildupFactorMax", reviver?.buildupFactorMax);

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

    json.critical = toJSON(this, "critical", replacer?.critical);

    json.ability = toJSON(this, "ability", replacer?.ability);
    json.abilityFactor = toJSON(this, "abilityFactor", replacer?.abilityFactor);

    json.stat = toJSON(this, "stat", replacer?.stat);
    json.statFactor = toJSON(this, "statFactor", replacer?.statFactor);
    json.statFactorMax = toJSON(this, "statFactorMax", replacer?.statFactorMax);

    json.damage = toJSON(this, "damage", replacer?.damage);
    json.damageFactor = toJSON(this, "damageFactor", replacer?.damageFactor);
    json.damageFactorMax = toJSON(this, "damageFactorMax", replacer?.damageFactorMax);

    json.buildup = toJSON(this, "buildup", replacer?.buildup);
    json.buildupFactor = toJSON(this, "buildupFactor", replacer?.buildupFactor);
    json.buildupFactorMax = toJSON(this, "buildupFactorMax", replacer?.buildupFactorMax);

    return json;
  }
  // #endregion
};
export default serializable(Effect, true);
