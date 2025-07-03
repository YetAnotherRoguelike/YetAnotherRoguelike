import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";
import Object from "@kxirk/utils/object.js";

import Type from "./type.js";


const Stat = class {
  // #region Static
  /** @type {number} */ static energyMin = 50;

  /** @type {string[]} */ static types = ["Attack", "Resist", "Defense", "Tolerance"];


  /**
   * @param {string} stat
   * @typedef {string} universal
   * @typedef {string} group
   * @typedef {string} stat
   * @returns {[universal, group, stat]}
   */
  static type (stat) {
    let universal;
    let group;

    const [type, suffix] = stat.split(new RegExp(`(${this.types.join("|")})`, "g"));
    if (suffix) {
      universal = suffix.toLowerCase();

      const typeGroup = Type.groups.find((g) => Type[g].includes(type));
      if (typeGroup) {
        group = `${typeGroup}${suffix}`;
      }
    }

    return [universal, group, stat];
  }
  // #endregion


  // #region Instance
  /** @type {number} */ #weightMax; // lbs

  /** @type {number} */ #view;
  /** @type {number} */ #perception;

  /** @type {number} */ #healthMax;

  /** @type {number} */ #regenMax; // turns to regen 1 health

  /** @type {number} */ #energyMax;

  /** @type {number} */ #speed; // ft/turn
  /** @type {number} */ #stealth;
  /** @type {number} */ #evade;

  /** @type {number} */ #critical; // % chance [0.0, 1.0] to deal additional damage
  /** @type {Type<number>} */ #attack;

  /** @type {Type<number>} */ #resist; // % damage reduction: weak (-Infinity, 0.0), neutral [0.0], resist (0.0, 1.0), immune [1.0], absorb (1.0, Infinity)
  /** @type {Type<number>} */ #defense;
  /** @type {Type<number>} */ #tolerance; // vital.buildup threshold


  /**
   * @param {number} [initial]
   */
  constructor (initial = 0) {
    this.weightMax = initial;

    this.view = initial;
    this.perception = initial;

    this.healthMax = initial;

    this.regenMax = initial;

    this.energyMax = initial;

    this.speed = initial;
    this.stealth = initial;
    this.evade = initial;

    this.critical = initial;
    this.#attack = new Type(initial); Object.assignGettersSettersAs(this, this.#attack, (type) => `${type}Attack`);

    this.#resist = new Type(initial); Object.assignGettersSettersAs(this, this.#resist, (type) => `${type}Resist`);
    this.#defense = new Type(initial); Object.assignGettersSettersAs(this, this.#defense, (type) => `${type}Defense`);
    this.#tolerance = new Type(initial); Object.assignGettersSettersAs(this, this.#tolerance, (type) => `${type}Tolerance`);


    Object.assignGettersAsEnumerable(this, Stat);
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get weightMax () { return this.#weightMax; }
  set weightMax (weightMax) {
    this.#weightMax = weightMax.clamp(0);
  }


  /** @type {number} */
  get view () { return this.#view; }
  set view (view) {
    this.#view = view.clamp(0);
  }

  /** @type {number} */
  get perception () { return this.#perception; }
  set perception (perception) {
    this.#perception = perception.clamp(0);
  }


  /** @type {number} */
  get healthMax () { return this.#healthMax; }
  set healthMax (healthMax) {
    this.#healthMax = healthMax.clamp(0);
  }


  /** @type {number} */
  get regenMax () { return this.#regenMax; }
  set regenMax (regenMax) {
    this.#regenMax = regenMax.clamp(0);
  }


  /** @type {number} */
  get energyMax () { return this.#energyMax; }
  set energyMax (energyMax) {
    this.#energyMax = energyMax.clamp(0);
  }


  /** @type {number} */
  get speed () { return this.#speed; }
  set speed (speed) {
    this.#speed = speed.clamp(0);
  }

  /** @type {number} */
  get stealth () { return this.#stealth; }
  set stealth (stealth) {
    this.#stealth = stealth.clamp(0);
  }

  /** @type {number} */
  get evade () { return this.#evade; }
  set evade (evade) {
    this.#evade = evade.clamp(0);
  }


  /** @type {number} */
  get critical () { return this.#critical; }
  set critical (critical) {
    this.#critical = critical.clamp(0.0, 1.0);
  }

  /** @type {Type} */
  get attack () { return this.#attack; }
  /** @type {number} */
  set attack (attack) {
    this.#attack.all = attack.clamp(0);
  }
  /** @type {number} */
  set physicalAttack (attack) {
    this.#attack.physical = attack.clamp(0);
  }
  /** @type {number} */
  set elementalAttack (attack) {
    this.#attack.elemental = attack.clamp(0);
  }
  /** @type {number} */
  set magicalAttack (attack) {
    this.#attack.magical = attack.clamp(0);
  }


  /** @type {Type} */
  get resist () { return this.#resist; }
  /** @type {number} */
  set resist (resist) {
    this.#resist.all = resist;
  }
  /** @type {number} */
  set physicalResist (resist) {
    this.#resist.physical = resist;
  }
  /** @type {number} */
  set elementalResist (resist) {
    this.#resist.elemental = resist;
  }
  /** @type {number} */
  set magicalResist (resist) {
    this.#resist.magical = resist;
  }

  /** @type {Type} */
  get defense () { return this.#defense; }
  /** @type {number} */
  set defense (defense) {
    this.#defense.all = defense.clamp(0);
  }
  /** @type {number} */
  set physicalDefense (defense) {
    this.#defense.physical = defense.clamp(0);
  }
  /** @type {number} */
  set elementalDefense (defense) {
    this.#defense.elemental = defense.clamp(0);
  }
  /** @type {number} */
  set magicalDefense (defense) {
    this.#defense.magical = defense.clamp(0);
  }

  /** @type {Type} */
  get tolerance () { return this.#tolerance; }
  /** @type {number} */
  set tolerance (tolerance) {
    this.#tolerance.all = tolerance.clamp(0);
  }
  /** @type {number} */
  set physicalTolerance (tolerance) {
    this.#tolerance.physical = tolerance.clamp(0);
  }
  /** @type {number} */
  set elementalTolerance (tolerance) {
    this.#tolerance.elemental = tolerance.clamp(0);
  }
  /** @type {number} */
  set magicalTolerance (tolerance) {
    this.#tolerance.magical = tolerance.clamp(0);
  }
  // #endregion


  // #region Serialize
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    this.weightMax = fromJSON(json, this, "weightMax", reviver?.weightMax);

    this.view = fromJSON(json, this, "view", reviver?.view);
    this.perception = fromJSON(json, this, "perception", reviver?.perception);

    this.healthMax = fromJSON(json, this, "healthMax", reviver?.healthMax);

    this.regenMax = fromJSON(json, this, "regenMax", reviver?.regenMax);

    this.energyMax = fromJSON(json, this, "energyMax", reviver?.energyMax);

    this.speed = fromJSON(json, this, "speed", reviver?.speed);
    this.stealth = fromJSON(json, this, "stealth", reviver?.stealth);
    this.evade = fromJSON(json, this, "evade", reviver?.evade);

    this.critical = fromJSON(json, this, "critical", reviver?.critical);
    fromJSON(json, this, "attack", reviver?.attack);

    fromJSON(json, this, "resist", reviver?.resist);
    fromJSON(json, this, "defense", reviver?.defense);
    fromJSON(json, this, "tolerance", reviver?.tolerance);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.weightMax = toJSON(this, "weightMax", replacer?.weightMax);

    json.view = toJSON(this, "view", replacer?.view);
    json.perception = toJSON(this, "perception", replacer?.perception);

    json.healthMax = toJSON(this, "healthMax", replacer?.healthMax);

    json.regenMax = toJSON(this, "regenMax", replacer?.regenMax);

    json.energyMax = toJSON(this, "energyMax", replacer?.energyMax);

    json.speed = toJSON(this, "speed", replacer?.speed);
    json.stealth = toJSON(this, "stealth", replacer?.stealth);
    json.evade = toJSON(this, "evade", replacer?.evade);

    json.critical = toJSON(this, "critical", replacer?.critical);
    json.attack = toJSON(this, "attack", replacer?.attack);

    json.resist = toJSON(this, "resist", replacer?.resist);
    json.defense = toJSON(this, "defense", replacer?.defense);
    json.tolerance = toJSON(this, "tolerance", replacer?.tolerance);

    return json;
  }
  // #endregion
};
export default Stat;
