import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";
import Object from "@kxirk/utils/object.js";


/**
 * @enum {string}
 * @template T
 */
const Ability = class {
  // #region Enum
  static strength = "strength";
  static dexterity = "dexterity";
  static constitution = "constitution";

  static intelligence = "intelligence";
  static wisdom = "wisdom";
  static charisma = "charisma";

  static luck = "luck";


  /** @type {string[]} */ static physical = [this.strength, this.dexterity, this.constitution];
  /** @type {string[]} */ static mental = [this.intelligence, this.wisdom, this.charisma];
  // #endregion


  // #region Static
  /**
   * @param {number} score
   * @returns {number}
   */
  static costScore (score) {
    return (Math.floor((score - 4) / 10) + 1).clamp(1);
  }

  /**
   * @param {number} score
   * @returns {number}
   */
  static cost (score) {
    const base = (score - 8);
    const next = this.costScore(score + 1);

    return ((base * next) + (5 * (-(next ** 2) + (2 * next) - 1)));
  }
  // #endregion


  // #region Instance
  /** @type {Class} */ #Constructor;

  /** @type {T} */ #strength;
  /** @type {T} */ #dexterity;
  /** @type {T} */ #constitution;

  /** @type {T} */ #intelligence;
  /** @type {T} */ #wisdom;
  /** @type {T} */ #charisma;

  /** @type {T} */ #luck;


  /**
   * @param {T | Class} [initial]
   * @param {boolean} [constructor]
   */
  constructor (initial = null, constructor = false) {
    Object.assignGettersAsEnumerable(this, Ability);


    if (constructor) {
      this.#Constructor = initial;

      for (const ability of Object.keys(this)) this[ability] = new this.#Constructor();
    }
    else {
      this.all = initial;
    }
  }
  // #endregion

  // #region Instance Accessors
  /** @type {T} */
  get strength () { return this.#strength; }
  set strength (strength) { this.#strength = strength; }

  /** @type {T} */
  get dexterity () { return this.#dexterity; }
  set dexterity (dexterity) { this.#dexterity = dexterity; }

  /** @type {T} */
  get constitution () { return this.#constitution; }
  set constitution (constitution) { this.#constitution = constitution; }

  /** @type {T} */
  set physical (value) {
    for (const ability of Ability.physical) this[ability] = value;
  }


  /** @type {T} */
  get intelligence () { return this.#intelligence; }
  set intelligence (intelligence) { this.#intelligence = intelligence; }

  /** @type {T} */
  get wisdom () { return this.#wisdom; }
  set wisdom (wisdom) { this.#wisdom = wisdom; }

  /** @type {T} */
  get charisma () { return this.#charisma; }
  set charisma (charisma) { this.#charisma = charisma; }

  /** @type {T} */
  set mental (value) {
    for (const ability of Ability.mental) this[ability] = value;
  }


  /** @type {T} */
  get luck () { return this.#luck; }
  set luck (luck) { this.#luck = luck; }


  /** @type {T} */
  set all (value) {
    this.physical = value;
    this.mental = value;
    this.luck = value;
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
    this.#Constructor = fromJSON(json, this, "Constructor", reviver?.constructor);

    this.strength = fromJSON(json, this, "strength", (reviver?.strength ?? this.#Constructor?.fromJSON));
    this.dexterity = fromJSON(json, this, "dexterity", (reviver?.dexterity ?? this.#Constructor?.fromJSON));
    this.constitution = fromJSON(json, this, "constitution", (reviver?.constitution ?? this.#Constructor?.fromJSON));

    this.intelligence = fromJSON(json, this, "intelligence", (reviver?.intelligence ?? this.#Constructor?.fromJSON));
    this.wisdom = fromJSON(json, this, "wisdom", (reviver?.wisdom ?? this.#Constructor?.fromJSON));
    this.charisma = fromJSON(json, this, "charisma", (reviver?.charisma ?? this.#Constructor?.fromJSON));

    this.luck = fromJSON(json, this, "luck", (reviver?.luck) ?? this.#Constructor?.fromJSON);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.Constructor = toJSON(this, "Constructor", replacer?.Constructor);

    json.strength = toJSON(this, "strength", replacer?.strength);
    json.dexterity = toJSON(this, "dexterity", replacer?.dexterity);
    json.constitution = toJSON(this, "constitution", replacer?.constitution);

    json.intelligence = toJSON(this, "intelligence", replacer?.intelligence);
    json.wisdom = toJSON(this, "wisdom", replacer?.wisdom);
    json.charisma = toJSON(this, "charisma", replacer?.charisma);

    json.luck = toJSON(this, "luck", replacer?.luck);

    return json;
  }
  // #endregion
};
export default Ability;
