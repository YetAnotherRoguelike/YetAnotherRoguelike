import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Ability from "./ability.js";
import Action from "./action.js"; /* eslint-disable-line import/no-cycle */ // serialize
import Item from "./item.js";


/**
 * @abstract
 * @extends Item
 */
const Gear = class extends Item {
  // #region Static
  /** @type {number} */ static qualityMin = -1;
  /** @type {number} */ static qualityMax = 3;
  // #endregion


  // #region Instance
  /** @type {number} */ #quality;

  /** @type {Ability<number>} */ #scaleMin;
  /** @type {Ability<number>} */ #scaleMax;

  /** @type {Stat} */ #statBase;
  /** @type {Stat} */ #statQuality;
  /** @type {Ability<Stat>} */ #statScale;

  /** @type {number} */ #durabilityBase;
  /** @type {number} */ #durabilityQuality;
  /** @type {number} */ #durability;

  /** @type {Action} */ #equipAction;
  /** @type {Action} */ #unequipAction;


  constructor () {
    super();
    this.equip = null;

    this.#quality = 0;

    this.#scaleMin = new Ability(0);
    this.#scaleMax = new Ability(0);

    this.#statBase = {};
    this.#statQuality = {};
    this.#statScale = new Ability(Object, true);

    this.#durabilityBase = 0;
    this.#durabilityQuality = 0;
    this.#durability = 0;

    this.#equipAction = null;
    this.#unequipAction = null;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get quality () { return this.#quality; }
  set quality (quality) {
    this.#quality = quality.clamp(Gear.qualityMin, Gear.qualityMax);
  }


  /** @type {Ability<number>} */
  get scaleMin () { return this.#scaleMin; }

  /** @type {Ability<number>} */
  get scaleMax () { return this.#scaleMax; }


  /** @type {Stat} */
  get statBase () { return this.#statBase; }

  /** @type {Stat} */
  get statQuality () { return this.#statQuality; }

  /** @type {Ability<Stat>} */
  get statScale () { return this.#statScale; }


  /** @type {number} */
  get durabilityBase () { return this.#durabilityBase; }
  set durabilityBase (durability) {
    this.#durabilityBase = durability.clamp(0);
  }

  /** @type {number} */
  get durabilityQuality () { return this.#durabilityQuality; }
  set durabilityQuality (durability) {
    this.#durabilityQuality = durability.clamp(0);
  }

  /** @type {number} */
  get durability () { return this.#durability; }
  set durability (durability) {
    this.#durability = durability.clamp(0);
  }


  /** @type {Action} */
  get equipAction () { return this.#equipAction; }
  set equipAction (action) { this.#equipAction = action; }

  /** @type {Action} */
  get unequipAction () { return this.#unequipAction; }
  set unequipAction (action) { this.#unequipAction = action; }
  // #endregion

  // #region Instance Derived Properties
  /** @type {number} */
  get qualityFacor () {
    return (this.quality / (Gear.qualityMax - Gear.qualityMin));
  }

  /** @type {number} */
  get qualityModifier () {
    return (1 + this.qualityFacor);
  }


  /** @type {number} */
  get durabilityMax () {
    return (this.durabilityBase + (this.qualityModifier * this.durabilityQuality)).clamp(1);
  }

  /** @type {number} */
  get durabilityFactor () {
    return (this.durability / this.durabilityMax);
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
    super.fromJSON(json, reviver);

    this.quality = fromJSON(json, this, "quality", reviver?.quality);

    fromJSON(json, this, "scaleMin", reviver?.scaleMin);
    fromJSON(json, this, "scaleMax", reviver?.scaleMax);

    fromJSON(json, this, "statBase", reviver?.statBase);
    fromJSON(json, this, "statQuality", reviver?.statQuality);
    fromJSON(json, this, "statScale", reviver?.statScale);

    this.durabilityBase = fromJSON(json, this, "durabilityBase", reviver?.durabilityBase);
    this.durabilityQuality = fromJSON(json, this, "durabilityQuality", reviver?.durabilityQuality);
    this.durability = fromJSON(json, this, "durability", reviver?.durability);

    this.equipAction = fromJSON(json, this, "equipAction", (reviver?.equipAction ?? Action.fromJSON));
    this.unequipAction = fromJSON(json, this, "unequipAction", (reviver?.unequipAction ?? Action.fromJSON));

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.quality = toJSON(this, "quality", replacer?.quality);

    json.scaleMin = toJSON(this, "scaleMin", replacer?.scaleMin);
    json.scaleMax = toJSON(this, "scaleMax", replacer?.scaleMax);

    json.statBase = toJSON(this, "statBase", replacer?.statBase);
    json.statQuality = toJSON(this, "statQuality", replacer?.statQuality);
    json.statScale = toJSON(this, "statScale", replacer?.statScale);

    json.durabilityBase = toJSON(this, "durabilityBase", replacer?.durabilityBase);
    json.durabilityQuality = toJSON(this, "durabilityQuality", replacer?.durabilityQuality);
    json.durability = toJSON(this, "durability", replacer?.durability);

    json.equipAction = toJSON(this, "equipAction", replacer?.equipAction);
    json.unequipAction = toJSON(this, "unequipAction", replacer?.unequipAction);

    return json;
  }
  // #endregion
};
export default Gear;
