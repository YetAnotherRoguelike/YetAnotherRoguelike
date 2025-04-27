import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";
import Object from "@kxirk/utils/object.js";


/**
 * @param {number} score
 * @returns {number}
 */
export const costScore = (score) => (Math.floor((score - 4) / 10) + 1).clamp(1);

/**
 * @param {number} score
 * @returns {number}
 */
export const cost = (score) => {
  const base = score - 8;
  const next = costScore(score + 1);

  return (base * next) + (5 * (-(next ** 2) + (2 * next) - 1));
};

const Ability = class {
  /** @type {string} */
  static strength = "strength";
  /** @type {string} */
  static dexterity = "dexterity";
  /** @type {string} */
  static constitution = "constitution";
  /** @type {string[]} */
  static physical = [this.strength, this.dexterity, this.constitution];

  /** @type {string} */
  static intelligence = "intelligence";
  /** @type {string} */
  static wisdom = "wisdom";
  /** @type {string} */
  static charisma = "charisma";
  /** @type {string[]} */
  static mental = [this.intelligence, this.wisdom, this.charisma];

  /** @type {string} */
  static luck = "luck";

  /** @type {*} */
  #strength;
  /** @type {*} */
  #dexterity;
  /** @type {*} */
  #constitution;

  /** @type {*} */
  #intelligence;
  /** @type {*} */
  #wisdom;
  /** @type {*} */
  #charisma;

  /** @type {*} */
  #luck;

  /**
   * @param {*} [initial]
   */
  constructor (initial = null) {
    this.all = initial;

    Object.assignGettersAsEnumerable(this, Ability);
  }


  /** @type {*} */
  get strength () { return this.#strength; }
  set strength (strength) {
    this.#strength = strength;
  }

  /** @type {*} */
  get dexterity () { return this.#dexterity; }
  set dexterity (dexterity) {
    this.#dexterity = dexterity;
  }

  /** @type {*} */
  get constitution () { return this.#constitution; }
  set constitution (constitution) {
    this.#constitution = constitution;
  }

  /** @type {*} */
  set physical (value) {
    for (const ability of Ability.physical) {
      this[ability] = value;
    }
  }


  /** @type {*} */
  get intelligence () { return this.#intelligence; }
  set intelligence (intelligence) {
    this.#intelligence = intelligence;
  }

  /** @type {*} */
  get wisdom () { return this.#wisdom; }
  set wisdom (wisdom) {
    this.#wisdom = wisdom;
  }

  /** @type {*} */
  get charisma () { return this.#charisma; }
  set charisma (charisma) {
    this.#charisma = charisma;
  }

  /** @type {*} */
  set mental (value) {
    for (const ability of Ability.mental) {
      this[ability] = value;
    }
  }


  /** @type {*} */
  get luck () { return this.#luck; }
  set luck (luck) {
    this.#luck = luck;
  }


  /** @type {*} */
  set all (value) {
    this.physical = value;
    this.mental = value;
    this.luck = value;
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Ability}
   */
  fromJSON (json, reviver) {
    this.strength = fromJSON(json, this, "strength", reviver?.strength);
    this.dexterity = fromJSON(json, this, "dexterity", reviver?.dexterity);
    this.constitution = fromJSON(json, this, "constitution", reviver?.constitution);

    this.intelligence = fromJSON(json, this, "intelligence", reviver?.intelligence);
    this.wisdom = fromJSON(json, this, "wisdom", reviver?.wisdom);
    this.charisma = fromJSON(json, this, "charisma", reviver?.charisma);

    this.luck = fromJSON(json, this, "luck", reviver?.luck);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.strength = toJSON(this, "strength", replacer?.strength);
    json.dexterity = toJSON(this, "dexterity", replacer?.dexterity);
    json.constitution = toJSON(this, "constitution", replacer?.constitution);

    json.intelligence = toJSON(this, "intelligence", replacer?.intelligence);
    json.wisdom = toJSON(this, "wisdom", replacer?.wisdom);
    json.charisma = toJSON(this, "charisma", replacer?.charisma);

    json.luck = toJSON(this, "luck", replacer?.luck);

    return json;
  }
};
export default Ability;
