import { fromJSON, toJSON } from "@kxirk/serialize";
import { Object } from "@kxirk/utils";


const Ability = class {
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
    this.strength = value;
    this.dexterity = value;
    this.constitution = value;
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
    this.intelligence = value;
    this.wisdom = value;
    this.charisma = value;
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
