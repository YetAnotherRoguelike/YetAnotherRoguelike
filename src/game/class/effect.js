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
   * @returns {Effect}
   */
  static fromJSON (json) {
    return new Effect().fromJSON(json);
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
   * @returns {Effect}
   */
  fromJSON (json) {
    Object.assign(this.ability, json.ability);
    Object.assign(this.abilityFactor, json.abilityFactor);

    Object.assign(this.stat, json.stat);
    Object.assign(this.statFactor, json.statFactor);
    Object.assign(this.statFactorMax, json.statFactorMax);

    Object.assign(this.damage, json.damage);
    Object.assign(this.damageFactor, json.damageFactor);
    Object.assign(this.damageFactorMax, json.damageFactorMax);

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      ability: this.ability,
      abilityFactor: this.abilityFactor,

      stat: this.stat,
      statFactor: this.statFactor,
      statFactorMax: this.statFactorMax,

      damage: this.damage,
      damageFactor: this.damageFactor,
      damageFactorMax: this.damageFactorMax
    };
  }
};
export default Effect;
