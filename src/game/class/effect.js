import { fromJSON, toJSON } from "@kxirk/serialize";


/** @abstract */
const Effect = class {
  /** @type {Ability} */
  #ability;
  /** @type {Ability} */
  #abilityFactor;

  /** @type {Stat} */
  #stat;
  /** @type {Stat} */
  #statFactor;
  /** @type {Stat} */
  #statFactorMax;

  /** @type {Type} */
  #damage;
  /** @type {Type} */
  #damageFactor;
  /** @type {Type} */
  #damageFactorMax;

  constructor () {
    this.#ability = {};
    this.#abilityFactor = {};

    this.#stat = {};
    this.#statFactor = {};
    this.#statFactorMax = {};

    this.#damage = {};
    this.#damageFactor = {};
    this.#damageFactorMax = {};
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Effect}
   */
  static fromJSON (json, reviver) {
    return new Effect[json.constructor]().fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }


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


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Effect}
   */
  fromJSON (json, reviver) {
    fromJSON(json, this, "ability", reviver?.ability);
    fromJSON(json, this, "abilityFactor", reviver?.abilityFactor);

    fromJSON(json, this, "stat", reviver?.stat);
    fromJSON(json, this, "statFactor", reviver?.statFactor);
    fromJSON(json, this, "statFactorMax", reviver?.statFactorMax);

    fromJSON(json, this, "damage", reviver?.damage);
    fromJSON(json, this, "damageFactor", reviver?.damageFactor);
    fromJSON(json, this, "damageFactorMax", reviver?.damageFactorMax);

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

    json.ability = toJSON(this, "ability", replacer?.ability);
    json.abilityFactor = toJSON(this, "abilityFactor", replacer?.abilityFactor);

    json.stat = toJSON(this, "stat", replacer?.stat);
    json.statFactor = toJSON(this, "statFactor", replacer?.statFactor);
    json.statFactorMax = toJSON(this, "statFactorMax", replacer?.statFactorMax);

    json.damage = toJSON(this, "damage", replacer?.damage);
    json.damageFactor = toJSON(this, "damageFactor", replacer?.damageFactor);
    json.damageFactorMax = toJSON(this, "damageFactorMax", replacer?.damageFactorMax);

    return json;
  }
};
export default Effect;
