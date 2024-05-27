import "@kxirk/utils/number.js";


const Proficiency = class {
  /** @member {number} */
  #armorLight;
  /** @member {number} */
  #armorMedium;
  /** @member {number} */
  #armorHeavy;

  /** @member {number} */
  #weaponLight;
  /** @member {number} */
  #weaponMedium;
  /** @member {number} */
  #weaponHeavy;
  /** @member {number} */
  #weaponRanged;

  /** @member {number} */
  #shieldLight;
  /** @member {number} */
  #shieldMedium;
  /** @member {number} */
  #shieldHeavy;

  /** @member {number} */
  #accessory;

  /**
   * @param {number} [initial]
   */
  constructor (initial = 1.0) {
    this.all = initial;

    Object.assignGettersAsEnumerable(this, Proficiency);
  }

  /**
   * @param {Object} json
   * @returns {Proficiency}
   */
  static fromJSON (json) {
    return new Proficiency().fromJSON(json);
  }


  /** @type {number} */
  get armorLight () { return this.#armorLight; }
  set armorLight (armorLight) {
    this.#armorLight = armorLight.clamp(0.0);
  }

  /** @type {number} */
  get armorMedium () { return this.#armorMedium; }
  set armorMedium (armorMedium) {
    this.#armorMedium = armorMedium.clamp(0.0);
  }

  /** @type {number} */
  get armorHeavy () { return this.#armorHeavy; }
  set armorHeavy (armorHeavy) {
    this.#armorHeavy = armorHeavy.clamp(0.0);
  }

  /** @type {number} */
  set armor (armor) {
    this.armorLight = armor;
    this.armorMedium = armor;
    this.armorHeavy = armor;
  }


  /** @type {number} */
  get weaponLight () { return this.#weaponLight; }
  set weaponLight (weaponLight) {
    this.#weaponLight = weaponLight.clamp(0.0);
  }

  /** @type {number} */
  get weaponMedium () { return this.#weaponMedium; }
  set weaponMedium (weaponMedium) {
    this.#weaponMedium = weaponMedium.clamp(0.0);
  }

  /** @type {number} */
  get weaponHeavy () { return this.#weaponHeavy; }
  set weaponHeavy (weaponHeavy) {
    this.#weaponHeavy = weaponHeavy.clamp(0.0);
  }

  /** @type {number} */
  get weaponRanged () { return this.#weaponRanged; }
  set weaponRanged (weaponRanged) {
    this.#weaponRanged = weaponRanged.clamp(0.0);
  }

  /** @type {number} */
  set weapon (weapon) {
    this.weaponLight = weapon;
    this.weaponMedium = weapon;
    this.weaponHeavy = weapon;
    this.weaponRanged = weapon;
  }


  /** @type {number} */
  get shieldLight () { return this.#shieldLight; }
  set shieldLight (shieldLight) {
    this.#shieldLight = shieldLight.clamp(0.0);
  }

  /** @type {number} */
  get shieldMedium () { return this.#shieldMedium; }
  set shieldMedium (shieldMedium) {
    this.#shieldMedium = shieldMedium.clamp(0.0);
  }

  /** @type {number} */
  get shieldHeavy () { return this.#shieldHeavy; }
  set shieldHeavy (shieldHeavy) {
    this.#shieldHeavy = shieldHeavy.clamp(0.0);
  }

  /** @type {number} */
  set shield (shield) {
    this.shieldLight = shield;
    this.shieldMedium = shield;
    this.shieldHeavy = shield;
  }


  /** @type {number} */
  get accessory () { return this.#accessory; }
  set accessory (accessory) {
    this.#accessory = accessory.clamp(0.0);
  }


  /** @type {*} */
  set all (value) {
    this.armor = value;
    this.weapon = value;
    this.shield = value;
    this.accessory = value;
  }


  /**
   * @param {Object} json
   * @returns {Proficiency}
   */
  fromJSON (json) {
    this.armorLight = json.armorLight;
    this.armorMedium = json.armorMedium;
    this.armorHeavy = json.armorHeavy;

    this.weaponLight = json.weaponLight;
    this.weaponMedium = json.weaponMedium;
    this.weaponHeavy = json.weaponHeavy;
    this.weaponRanged = json.weaponRanged;

    this.shieldLight = json.shieldLight;
    this.shieldMedium = json.shieldMedium;
    this.shieldHeavy = json.shieldHeavy;

    this.accessory = json.accessory;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      armorLight: this.armorLight,
      armorMedium: this.armorMedium,
      armorHeavy: this.armorHeavy,

      weaponLight: this.weaponLight,
      weaponMedium: this.weaponMedium,
      weaponHeavy: this.weaponHeavy,
      weaponRanged: this.weaponRanged,

      shieldLight: this.shieldLight,
      shieldMedium: this.shieldMedium,
      shieldHeavy: this.shieldHeavy,

      accessory: this.accessory
    };
  }
};
export default Proficiency;
