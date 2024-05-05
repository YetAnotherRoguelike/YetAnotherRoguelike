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

  /**
   * @param {Object} json
   * @returns {Ability}
   */
  static fromJSON (json) {
    return new Ability().fromJSON(json);
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
   * @returns {Ability}
   */
  fromJSON (json) {
    this.strength = json.strength;
    this.dexterity = json.dexterity;
    this.constitution = json.constitution;
    this.intelligence = json.intelligence;
    this.wisdom = json.wisdom;
    this.charisma = json.charisma;
    this.luck = json.luck;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      strength: this.strength,
      dexterity: this.dexterity,
      constitution: this.constitution,
      intelligence: this.intelligence,
      wisdom: this.wisdom,
      charisma: this.charisma,
      luck: this.luck
    };
  }
};
export default Ability;
