import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";
import { Object } from "@kxirk/utils";

import Type from "./type.js";


const Stat = class {
  /** @type {string[]} */
  static types = ["Attack", "Resist", "Defense"];

  /** @type {number} */
  #weightMax; // lbs

  /** @type {number} */
  #view; // tiles
  /** @type {number} */
  #perception;

  /** @type {number} */
  #healthMax;
  /** @type {number} */
  #health;

  /** @type {number} */
  #regenMax; // turns to regen 1 health
  /** @type {number} */
  #regen; // reset on taking damage

  /** @type {number} */
  #energyMax;
  /** @type {number} */
  #energy;
  /** @type {number} */
  #energyOverflow;

  /** @type {number} */
  #speed; // ft/turn
  /** @type {number} */
  #stealth;

  /** @type {number} */
  #critical; // % chance to deal additional damage: [0.0, 1.0]
  /** @type {Type<number>} */
  #attack;

  /** @type {number} */
  #evade;
  /** @type {Type<number>} */
  #resist; // % damage reduction before defense: weak (-Infinity, 0.0), neutral [0.0], resist (0.0, 1.0), immune [1.0], absorb (1.0, Infinity)
  /** @type {Type<number>} */
  #defense;

  /**
   * @param {number} [initial]
   */
  constructor (initial = 0) {
    this.weightMax = initial;

    this.view = initial;
    this.perception = initial;

    this.healthMax = initial;
    this.health = initial;

    this.regenMax = initial;
    this.regen = initial;

    this.energyMax = initial;
    this.energy = initial;
    this.energyOverflow = initial;

    this.speed = initial;
    this.stealth = initial;

    this.critical = initial;
    this.#attack = new Type(initial); Object.assignGettersSettersAs(this, this.#attack, (type) => `${type}Attack`);

    this.evade = initial;
    this.#resist = new Type(initial); Object.assignGettersSettersAs(this, this.#resist, (type) => `${type}Resist`);
    this.#defense = new Type(initial); Object.assignGettersSettersAs(this, this.#defense, (type) => `${type}Defense`);


    Object.assignGettersAsEnumerable(this, Stat);
  }


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
  get health () { return this.#health; }
  set health (health) {
    this.#health = health.clamp(0);
  }


  /** @type {number} */
  get regenMax () { return this.#regenMax; }
  set regenMax (regenMax) {
    this.#regenMax = regenMax.clamp(0);
  }

  /** @type {number} */
  get regen () { return this.#regen; }
  set regen (regen) {
    this.#regen = regen.clamp(0);
  }


  /** @type {number} */
  get energyMax () { return this.#energyMax; }
  set energyMax (energyMax) {
    this.#energyMax = energyMax.clamp(0);
  }

  /** @type {number} */
  get energy () { return this.#energy; }
  set energy (energy) {
    this.#energy = energy.clamp(0);
  }

  /** @type {number} */
  get energyOverflow () { return this.#energyOverflow; }
  set energyOverflow (energy) {
    this.#energyOverflow = energy.clamp(0);
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
  get critical () { return this.#critical; }
  set critical (critical) {
    this.#critical = critical.clamp(0.0, 1.0);
  }

  /** @type {number} */
  set physicalAttack (physicalAttack) {
    this.#attack.physical = physicalAttack.clamp(0);
  }
  /** @type {number} */
  set elementalAttack (elementalAttack) {
    this.#attack.elemental = elementalAttack.clamp(0);
  }
  /** @type {number} */
  set magicalAttack (magicalAttack) {
    this.#attack.magical = magicalAttack.clamp(0);
  }
  /** @type {number} */
  set attack (attack) {
    this.#attack.all = attack.clamp(0);
  }


  /** @type {number} */
  get evade () { return this.#evade; }
  set evade (evade) {
    this.#evade = evade.clamp(0);
  }

  /** @type {number} */
  set physicalResist (physicalResist) {
    this.#resist.physical = physicalResist;
  }
  /** @type {number} */
  set elementalResist (elementalResist) {
    this.#resist.elemental = elementalResist;
  }
  /** @type {number} */
  set magicalResist (magicalResist) {
    this.#resist.magical = magicalResist;
  }
  /** @type {number} */
  set resist (resist) {
    this.#resist.all = resist;
  }

  /** @type {number} */
  set physicalDefense (physicalDefense) {
    this.#defense.physical = physicalDefense.clamp(0);
  }
  /** @type {number} */
  set elementalDefense (elementalDefense) {
    this.#defense.elemental = elementalDefense.clamp(0);
  }
  /** @type {number} */
  set magicalDefense (magicalDefense) {
    this.#defense.magical = magicalDefense.clamp(0);
  }
  /** @type {number} */
  set defense (defense) {
    this.#defense.all = defense.clamp(0);
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Stat}
   */
  fromJSON (json, reviver) {
    this.weightMax = fromJSON(json, this, "weightMax", reviver?.weightMax);

    this.view = fromJSON(json, this, "view", reviver?.view);
    this.perception = fromJSON(json, this, "perception", reviver?.perception);

    this.healthMax = fromJSON(json, this, "healthMax", reviver?.healthMax);
    this.healh = fromJSON(json, this, "healh", reviver?.healh);

    this.regenMax = fromJSON(json, this, "regenMax", reviver?.regenMax);
    this.regen = fromJSON(json, this, "regen", reviver?.regen);

    this.energyMax = fromJSON(json, this, "energyMax", reviver?.energyMax);
    this.energy = fromJSON(json, this, "energy", reviver?.energy);
    this.energyOverflow = fromJSON(json, this, "energyOverflow", reviver?.energyOverflow);

    this.speed = fromJSON(json, this, "speed", reviver?.speed);
    this.stealth = fromJSON(json, this, "stealth", reviver?.stealth);

    this.critical = fromJSON(json, this, "critical", reviver?.critical);
    fromJSON(json, this, "attack", reviver?.attack);

    this.evade = fromJSON(json, this, "evade", reviver?.evade);
    fromJSON(json, this, "resist", reviver?.resist);
    fromJSON(json, this, "defense", reviver?.defense);

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
    json.healh = toJSON(this, "healh", replacer?.healh);

    json.regenMax = toJSON(this, "regenMax", replacer?.regenMax);
    json.regen = toJSON(this, "regen", replacer?.regen);

    json.energyMax = toJSON(this, "energyMax", replacer?.energyMax);
    json.energy = toJSON(this, "energy", replacer?.energy);
    json.energyOverflow = toJSON(this, "energyOverflow", replacer?.energyOverflow);

    json.speed = toJSON(this, "speed", replacer?.speed);
    json.stealth = toJSON(this, "stealth", replacer?.stealth);

    json.critical = toJSON(this, "critical", replacer?.critical);
    json.attack = toJSON(this, "attack", replacer?.attack);

    json.evade = toJSON(this, "evade", replacer?.evade);
    json.resist = toJSON(this, "resist", replacer?.resist);
    json.defense = toJSON(this, "defense", replacer?.defense);

    return json;
  }
};
export default Stat;
