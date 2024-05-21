const Effect = class {
  /** @type {Ability} */
  #ability;
  /** @type {Ability} */
  #abilityFactor;

  /** @type {Stat} */
  #stat;
  /** @type {Stat} */
  #statFactor;

  /** @type {Type} */
  #damage;
  /** @type {Type} */
  #damageFactor;

  constructor () {
    this.#ability = {};
    this.#abilityFactor = {};

    this.#stat = {};
    this.#statFactor = {};

    this.#damage = {};
    this.#damageFactor = {};
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

  /** @type {Ability} */
  get statFactor () { return this.#statFactor; }


  /** @type {Type} */
  get damage () { return this.#damage; }

  /** @type {Ability} */
  get damageFactor () { return this.#damageFactor; }


  /**
   * @param {Object} json
   * @returns {Effect}
   */
  fromJSON (json) {
    Object.assign(this.ability, json.ability);
    Object.assign(this.abilityFactor, json.abilityFactor);

    Object.assign(this.stat, json.stat);
    Object.assign(this.statFactor, json.statFactor);

    Object.assign(this.damage, json.damage);
    Object.assign(this.damageFactor, json.damageFactor);

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      ability: this.ability.toJSON(),
      abilityFactor: this.abilityFactor.toJSON(),

      stat: this.stat.toJSON(),
      statFactor: this.statFactor.toJSON(),

      damage: this.damage.toJSON(),
      damageFactor: this.damageFactor.toJSON()
    };
  }
};
export default Effect;
