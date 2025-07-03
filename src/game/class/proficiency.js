import { fromJSON, toJSON } from "@kxirk/serialize";
import Object from "@kxirk/utils/object.js";


const Proficiency = class {
  // #region Instance
  /** @member {number} */ #armorLight;
  /** @member {number} */ #armorMedium;
  /** @member {number} */ #armorHeavy;

  /** @member {number} */ #weaponLight;
  /** @member {number} */ #weaponMedium;
  /** @member {number} */ #weaponHeavy;
  /** @member {number} */ #weaponRanged;

  /** @member {number} */ #shieldLight;
  /** @member {number} */ #shieldMedium;
  /** @member {number} */ #shieldHeavy;

  /** @member {number} */ #accessory;


  /**
   * @param {number} [initial]
   */
  constructor (initial = 1.0) {
    this.all = initial;


    Object.assignGettersAsEnumerable(this, Proficiency);
  }
  // #endregion

  // #region Instance Accessors
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
  // #endregion


  // #region Serialize
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    this.armorLight = fromJSON(json, this, "armorLight", reviver?.armorLight);
    this.armorMedium = fromJSON(json, this, "armorMedium", reviver?.armorMedium);
    this.armorHeavy = fromJSON(json, this, "armorHeavy", reviver?.armorHeavy);

    this.weaponLight = fromJSON(json, this, "weaponLight", reviver?.weaponLight);
    this.weaponMedium = fromJSON(json, this, "weaponMedium", reviver?.weaponMedium);
    this.weaponHeavy = fromJSON(json, this, "weaponHeavy", reviver?.weaponHeavy);
    this.weaponRanged = fromJSON(json, this, "weaponRanged", reviver?.weaponRanged);

    this.shieldLight = fromJSON(json, this, "shieldLight", reviver?.shieldLight);
    this.shieldMedium = fromJSON(json, this, "shieldMedium", reviver?.shieldMedium);
    this.shieldHeavy = fromJSON(json, this, "shieldHeavy", reviver?.shieldHeavy);

    this.accessory = fromJSON(json, this, "accessory", reviver?.accessory);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.armorLight = toJSON(this, "armorLight", replacer?.armorLight);
    json.armorMedium = toJSON(this, "armorMedium", replacer?.armorMedium);
    json.armorHeavy = toJSON(this, "armorHeavy", replacer?.armorHeavy);

    json.weaponLight = toJSON(this, "weaponLight", replacer?.weaponLight);
    json.weaponMedium = toJSON(this, "weaponMedium", replacer?.weaponMedium);
    json.weaponHeavy = toJSON(this, "weaponHeavy", replacer?.weaponHeavy);
    json.weaponRanged = toJSON(this, "weaponRanged", replacer?.weaponRanged);

    json.shieldLight = toJSON(this, "shieldLight", replacer?.shieldLight);
    json.shieldMedium = toJSON(this, "shieldMedium", replacer?.shieldMedium);
    json.shieldHeavy = toJSON(this, "shieldHeavy", replacer?.shieldHeavy);

    json.accessory = toJSON(this, "accessory", replacer?.accessory);

    return json;
  }
  // #endregion
};
export default Proficiency;
