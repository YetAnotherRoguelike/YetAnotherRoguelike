import { fromJSON, toJSON, serializable } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Ability from "./ability.js";
import Accessory from "./accessory.js";
import Action from "./action.js";
import Armor from "./armor.js";
import Attack from "./attack.js";
import Conditions from "./conditions.js";
import Entity from "./entity.js";
import Equip from "./equip.js";
import Gear from "./gear.js";
import Inventory from "./inventory.js";
import Item from "./item.js";
import Point from "./point.js";
import Proficiency from "./proficiency.js";
import Size from "./size.js";
import Slot from "./slot.js";
import Stat from "./stat.js";
import Tick from "./tick.js";
import Type from "./type.js";
import Vital from "./vital.js";


/**
 * @param {Mob} mob
 * @returns {ProxyHandler<Ability<number>>}
 */
const abilityHandler = (mob) => ({
  /**
   * @param {Ability<number>} target
   * @param {keyof Ability} ability
   * @returns {number}
   */
  get (target, ability) {
    let value = mob.abilityBase[ability] ?? 0;


    // factor
    for (const condition of mob.conditions) {
      value *= condition?.effect.abilityFactor?.[ability] ?? 1.0;
    }

    // flat
    for (const condition of mob.conditions) {
      value += condition?.effect.ability?.[ability] ?? 0;
    }


    // round
    return value.round();
  }
});

/**
 * @param {Mob} mob
 * @returns {ProxyHandler<Proficiency>}
 */
const proficiencyHandler = (mob) => ({
  /**
   * @param {Proficiency} target
   * @param {keyof Proficiency} proficiency
   * @returns {number}
   */
  get (target, proficiency) {
    const value = (mob.proficiencyBase[proficiency] ?? 0);
    const bonus = (Math.floor(mob.level / 4) + 2);

    return (bonus * value).round();
  }
});

/**
 * @param {Mob} mob
 * @returns {ProxyHandler<Stat>}
 */
const statHandler = (mob) => ({
  /**
   * @param {Stat} target
   * @param {keyof Stat} stat
   * @returns {number}
   */
  get (target, stat) {
    const [statUniversal, statGroup] = Stat.type(stat);

    let value = (mob.statBase[stat] ?? mob.statBase[statGroup] ?? mob.statBase[statUniversal] ?? 0);


    // factor
    for (const condition of mob.conditions) {
      value *= (condition?.effect.statFactor?.[stat] ?? 1.0);
    }

    // flat
    for (const item of [...mob.armor, ...mob.hand, ...mob.side, ...mob.accessories]) {
      if (!(item instanceof Gear)) continue;


      const base = (item.statBase?.[stat] ?? 0);

      const quality = (item.qualityModifier * (item.statQuality?.[stat] ?? 0));

      let scale = 0;
      for (const [ability, score] of Object.entries(mob.ability)) {
        scale += (score.clamp(item.scaleMin[ability], item.scaleMax[ability]) * (item.statScale?.[stat] ?? 0));
      }

      value += (base + quality + scale);
    }
    for (const condition of mob.conditions) {
      value += (condition?.effect.stat?.[stat] ?? 0);
    }


    // round
    if (["critical"].includes(stat) || ["resist"].includes(statUniversal)) {
      value = value.round(0.01);
    }
    else {
      value = value.round();
    }

    return value;
  }
});

/**
 * @param {Mob} mob
 * @returns {ProxyHandler<Vital>}
 */
const vitalHandler = (mob) => ({
  /**
   * @param {Vital} target
   * @param {keyof Vital} vital
   * @returns {number}
   */
  get (target, vital) {
    const value = target[vital];

    return value;
  },
  /**
   * @param {Stat} target
   * @param {keyof Vital} vital
   * @param {number} value
   * @returns {boolean}
   */
  set (target, vital, value) {
    const [vitalUniversal] = Vital.type(vital);
    const vitalMax = `${vital}Max`;
    const vitalOverflow = `${vital}Overflow`;


    if (["health", "regen"].includes(vital)) {
      target[vital] = value.clamp(0, mob.stat[vitalMax]).round();

      return true;
    }
    if (["energy"].includes(vital)) {
      target[vital] = value.clamp(0, mob.stat[vitalMax]).round();
      target[vitalOverflow] += (value - mob.stat[vitalMax]).clamp(0).round();

      return true;
    }
    if (["energyOverflow"].includes(vital) || ["buildup"].includes(vitalUniversal)) {
      target[vital] = value.clamp(0).round();

      return true;
    }

    return false;
  }
});

/**
 * @abstract
 * @extends Entity
 */
const Mob = class extends Entity {
  // #region Static
  /**
   * @param {number} level
   * @returns {number} experience
   */
  static experienceNext = (level) => ((5 * level) + 5);

  /**
   * @param {number} level
   * @returns {number} experience
   */
  static experienceCumulative = (level) => (((level / 2) * this.experienceNext(level)) - 5);
  // #endregion


  // #region Instance
  /** @type {number} */ #reach; // ft

  /** @type {Point} */ #at;
  /** @type {Point} */ #looking;
  /** @type {Point} */ #facing;

  /** @type {number} */ #experience;
  /** @type {number} */ #level;

  /** @type {Ability<number>} */ #abilityBase;
  /** @type {Ability<number>} */ #ability;

  /** @type {Proficiency} */ #proficiencyBase;
  /** @type {Proficiency} */ #proficiency;

  /** @type {Stat} */ #statBase;
  /** @type {Stat} */ #stat;

  /** @type {Vital} */ #vital;

  /** @type {Equip<Slot[]>} */ #slots;
  /** @type {Slot<Armor>} */ #armor;
  /** @type {Slot<Item>} */ #hand;
  /** @type {Slot<Item>} */ #side;
  /** @type {Inventory<Accessory>} */ #accessories;
  /** @type {Inventory<Item>} */ #inventory;

  /** @type {Type<Class<Condition>>} */ #condition;
  /** @type {Conditions} */ #conditions;

  /** @type {Attack[]} */ #attacks;

  /** @type {Action[]} */ #turn;
  /** @type {Function} */ #act;


  constructor () {
    super();
    this.display.push("mob");

    this.#reach = 0;

    this.#at = new Point();
    this.#looking = new Point();
    this.#facing = new Point();

    this.#experience = 0;
    this.#level = 1;

    this.#abilityBase = new Ability(1);
    this.#ability = new Proxy(new Ability(0), abilityHandler(this));

    this.#proficiencyBase = new Proficiency(0.0);
    this.#proficiency = new Proxy(new Proficiency(0.0), proficiencyHandler(this));

    this.#statBase = Object.defineProperties({}, {
      weightMax: { get: () => (this.sizeFactor * 10 * this.ability.strength) },

      view: { get: () => (this.heightFactor * 60) },
      perception: { get: () => this.ability.wisdom },

      healthMax: { get: () => ((this.sizeModifierFactor * this.ability.constitution) + (this.level * (this.ability.constitution / 2))) },

      regenMax: { get: () => (15 - (this.ability.constitution / 2)) },

      energyMax: { get: () => (10 * this.stat.speed).clamp(Stat.energyMin) },

      speed: { get: () => (this.ability.dexterity / 2) },
      stealth: { get: () => (this.ability.dexterity - (4 * this.sizeModifier)) },
      evade: { get: () => ((this.ability.dexterity / 2) - (2 * this.sizeModifier)) },

      critical: { get: () => (this.ability.luck / 200) },
      physicalAttack: { get: () => (this.sizeModifierFactor * ((this.ability.strength / 2) - 4)).clamp(1) },

      physicalDefense: { get: () => (this.ability.constitution / 4) },
      tolerance: { get: () => (this.stat.healthMax / 2) }
    });
    this.#stat = new Proxy(new Stat(0), statHandler(this));

    this.#vital = new Proxy(new Vital(0), vitalHandler(this));

    this.#slots = new Equip();
    this.slots.armor = [Slot.armor];
    this.slots.light = [Slot.hand, Slot.side];
    this.slots.medium = [Slot.hand];
    this.slots.versatile = [Slot.both, Slot.hand];
    this.slots.heavy = [Slot.both];
    this.slots.accessory = [Slot.accessories];

    this.#armor = new Slot(Armor);
    this.#hand = new Slot(Item);
    this.#side = new Slot(Item);
    this.#accessories = new Inventory(Accessory, 2);
    this.#inventory = new Inventory(Item);

    this.#condition = new Type(null);
    this.#conditions = new Conditions();

    this.#attacks = [];

    this.#turn = [];
    this.#act = null;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get length () { return super.length; }
  set length (length) {
    super.length = length;

    this.#sizeUpdate();
  }

  /** @type {number} */
  get width () { return super.width; }
  set width (width) {
    super.width = width;

    this.#sizeUpdate();
  }

  /** @type {number} */
  get height () { return super.height; }
  set height (height) {
    super.height = height;

    this.#sizeUpdate();
  }

  /** @type {number} */
  get volumeFactor () { return super.volumeFactor; }
  set volumeFactor (factor) {
    super.volumeFactor = factor;

    this.#sizeUpdate();
  }


  /** @type {number} */
  get reach () { return this.#reach; }
  set reach (reach) {
    this.#reach = reach.clamp(0);

    this.#sizeUpdate();
  }


  /** @type {Point} */
  get at () { return this.#at; }

  /** @type {Point} */
  get looking () { return this.#looking; }

  /** @type {Point} */
  get facing () { return this.#facing; }


  /** @type {number} */
  get experience () { return this.#experience; }
  set experience (experience) {
    const current = this.experience;
    if (experience <= current) return;

    const next = Mob.experienceCumulative(this.level + 1);
    if (experience >= next) {
      this.#level++;
      this.experience = experience;
    }
    else {
      this.#experience = experience;
    }
  }

  /** @type {number} */
  get level () { return this.#level; }
  set level (level) {
    const min = Mob.experienceCumulative(level).clamp(1);
    this.experience = this.experience.clamp(min);
  }


  /** @type {Ability<number>} */
  get abilityBase () { return this.#abilityBase; }

  /** @type {Ability<number>} */
  get ability () { return this.#ability; }


  /** @type {Proficiency} */
  get proficiencyBase () { return this.#proficiencyBase; }

  /** @type {Proficiency} */
  get proficiency () { return this.#proficiency; }


  /** @type {Stat} */
  get statBase () { return this.#statBase; }

  /** @type {Stat} */
  get stat () { return this.#stat; }


  /** @type {Vital} */
  get vital () { return this.#vital; }


  /** @type {Equip<Slot[]>} */
  get slots () { return this.#slots; }

  /** @type {Slot<Armor>} */
  get armor () { return this.#armor; }

  /** @type {Slot<Item>} */
  get hand () { return this.#hand; }

  /** @type {Slot<Item>} */
  get side () { return this.#side; }

  /** @type {Inventory<Accessory>} */
  get accessories () { return this.#accessories; }

  /** @type {Inventory<Item>} */
  get inventory () { return this.#inventory; }


  /** @type {Type<Class<Condition>>} */
  get condition () { return this.#condition; }

  /** @type {Conditions} */
  get conditions () { return this.#conditions; }


  /** @type {Attack[]} */
  get attacks () { return this.#attacks; }


  /** @type {Action[]} */
  get turn () { return this.#turn; }

  /** @type {Function} */
  get act () { return this.#act; }
  set act (act) { this.#act = act; }
  // #endregion

  // #region Instance Derived Properties
  /** @type {number} */
  get weight () {
    let weight = super.weight;

    weight += this.armor.weight;
    weight += this.hand.weight;
    weight += this.side.weight;
    weight += this.accessories.weight;
    weight += this.inventory.weight;

    return weight;
  }

  /** @type {number} */
  get weightFactor () {
    return ((this.weight - super.weight) / this.stat.weightMax);
  }
  // #endregion

  // #region Instance Methods
  /**
   * @returns {undefined}
   */
  #sizeUpdate () {
    this.hand.dimensionMax = (1.5 * this.height);
    this.hand.volumeMax = (this.sizeFactor / 4);
    this.side.dimensionMax = (1.5 * this.height);
    this.side.volumeMax = (this.sizeFactor / 4);

    this.inventory.sizeMax = (20 * this.sizeFactor);
    this.inventory.volumeMax = this.sizeFactor;
    this.inventory.itemDimensionMax = (1.5 * this.reach);
    this.inventory.itemVolumeMax = this.sizeFactor;
  }


  /**
   * @param {Item} item
   * @returns {Equip}
   */
  #equip (item) {
    const mobSize = this.size;
    const mobSizeIndex = Size.indexes[mobSize];

    const itemSize = item.equipSize;
    const itemSizeIndex = Size.indexes[itemSize];

    const sizeOffset = (itemSizeIndex - mobSizeIndex);

    const equip = item.equip;
    if (equip === Equip.armor) {
      if (itemSize !== mobSize) return undefined;
    }
    else if (Equip.hands.includes(equip)) {
      const handIndex = (Equip.hands.indexes[equip] + sizeOffset);
      if (handIndex < 0) return undefined;
      if (handIndex >= Equip.hands.length) return undefined;

      return Equip.hands[handIndex];
    }

    return equip;
  }
  /**
   * @param {number} index
   * @returns {boolean}
   */
  equip (index) {
    let success = false;

    const item = this.inventory.at(index);
    if (item === undefined) return success;

    const equip = this.#equip(item);
    if (equip === undefined) return success;


    const slots = this.slots[equip];
    for (const slot of slots) {
      if (slot === Slot.both) {
        if (!this.side.empty) continue;

        success = this.hand.add(item, equip, slot);
        if (success) {
          this.side.open = false;
          break;
        }
      }

      else if ((slot === Slot.hand) && !this[slot].empty && this.side.empty) {
        if (slots.includes(Slot.side)) continue;
        if (!this.slots[this[slot].equip].includes(Slot.side)) continue;

        this.swap();

        success = this[slot].add(item, equip, slot);
        if (success) break;
      }

      else if ((slot === Slot.side) && (this.hand.equip === Equip.versatile) && this[slot].empty) {
        this[slot].open = true;

        success = this[slot].add(item, equip, slot);
        if (success) {
          this.hand.slot = Slot.hand;
          break;
        }
        else {
          this[slot].open = false;
        }
      }

      else {
        success = this[slot].add(item, equip, slot);
        if (success) break;
      }
    }


    if (success) this.inventory.remove(index);
    return success;
  }

  /**
   * @returns {boolean}
   */
  swap () {
    const hand = { ...this.hand, swappable: true };
    if (!hand.empty) hand.swappable = this.slots[hand.equip].includes(Slot.side);

    const side = { ...this.side, swappable: true };
    if (!side.empty) hand.swappable = this.slots[side.equip].includes(Slot.hand);

    if (!hand.swappable || !side.swappable) return false;


    if (!hand.empty) {
      if (hand.slot === Slot.both) this.side.open = true;
      this.side.set(hand.item, hand.equip, Slot.side);
      if (side.clear) this.hand.clear();
    }
    if (!side.empty) {
      if (side.equip === Equip.versatile && hand.empty) {
        side.slot = Slot.both;
        this.side.open = false;
      }
      this.hand.set(side.item, side.equip, Slot.hand);
      if (hand.empty) this.side.clear();
    }

    return true;
  }

  /**
   * @param {keyof Slot} slot
   * @param {number} index
   * @returns {boolean | boolean[]}
   */
  unequip (slot, index) {
    let success = false;

    if (slot === Slot.both) {
      const both = (this.hand.slot === Slot.both);
      const hand = this.unequip(Slot.hand);
      const side = (both || this.unequip(Slot.hand) || this.unequip(Slot.side));

      if (hand && side) return true;
      return [hand, side];
    }

    const mobSlot = this[slot];

    let item;
    if (mobSlot instanceof Slot) item = mobSlot.item;
    if (mobSlot instanceof Inventory) item = mobSlot.at(index);
    if ((item === undefined) || (item === null)) return success;


    success = this.inventory.add(item);
    if (!success) return success;

    let swap = false;
    if (mobSlot.slot === Slot.both) {
      this.side.open = true;
    }
    else if ((slot === Slot.side) && !this.hand.empty && this.slots[this.hand.equip].includes(Slot.both)) {
      this.side.open = false;
      swap = true;
    }
    else if ((slot === Slot.hand) && !this.side.empty) {
      swap = true;
    }

    mobSlot.remove(index);
    if (swap) this.swap();
    return success;
  }

  /**
   * @param {Item} item
   * @returns {boolean}
   */
  add (item) {
    return this.inventory.add(item);
  }

  /**
   * @param {number} index
   * @returns {Item}
   */
  remove (index) {
    return this.inventory.remove(index);
  }


  /**
   * @param {string} queue
   * @param {string} [name]
   * @returns {Condition[]} expired
   */
  tick (queue, name) {
    const expired = [];

    let conditions = this.conditions[queue];
    if (queue === Tick.persist) conditions = conditions.get(name);


    for (const condition of conditions) {
      this.effect(condition.effect);
      condition.duration--;

      if (condition.duration === 0) {
        expired.push(this.conditions[queue].remove(condition));
      }
    }

    return expired;
  }


  /**
   * @param {Type<number>} damage
   * @param {boolean} [factor]
   * @param {boolean} [max]
   * @returns {Type<number>}
   */
  damage (damage, factor = false, max = false) {
    const healthFactor = (max ? this.stat.healthMax : this.stat.health);

    const dealt = new Type(0);
    for (const [type, value] of Object.entries(damage)) {
      const base = (factor ? (healthFactor * value) : value.valueOf());
      const resist = (this.stat[`${type}Resist`] * base);
      const defense = this.stat[`${type}Defense`];

      let total = (base - resist).round();
      if (total > 0) total -= defense.clamp(0, total);

      dealt[type] = total;
    }

    const dealtTotal = Object.values(dealt).reduce((total, type) => (total + type), 0);
    this.vital.health -= dealtTotal;
    if (dealtTotal > 0) this.vital.regen = this.stat.regenMax;

    return dealt;
  }

  /**
   * @param {Type<number>} buildup
   * @param {boolean} [factor]
   * @param {boolean} [max]
   * @returns {Type<number>}
   */
  buildup (buildup, factor = false, max = false) {
    const dealt = new Type(0);
    for (const [type, value] of Object.entries(buildup)) {
      const tolerence = this.stat[`${type}Tolerence`];
      const buildupFactor = (max ? tolerence : this.vital[`${type}Buildup`]);

      const base = (factor ? (buildupFactor * value) : value.valueOf());
      const resist = (this.stat[`${type}Resist`] * base);
      const total = (base - resist).round();

      this.vital[`${type}Buildup`] += total;
      if (this.vital[`${type}Buildup`] > tolerence) {
        const BuildupCondition = this.condition[type];
        if (BuildupCondition) {
          const condition = new BuildupCondition();

          this.conditions.add(condition);
        }

        this.vital[`${type}Buildup`] = 0;
      }

      dealt[type] = total;
    }

    return dealt;
  }

  /**
   * @param {Effect} effect
   * @returns {Affect}
   */
  effect (effect) {
    const affect = {};

    const damage = this.damage(effect.damage);
    const damageFactor = this.damage(effect.damageFactor, true);
    const damageFactorMax = this.damage(effect.damageFactorMax, true, true);
    const damageTotal = Object.keys({ ...damage, ...damageFactor, ...damageFactorMax }).reduce((total, type) => {
      total[type] = (damage[type] + damageFactor[type] + damageFactorMax[type]);
      return total;
    }, {});
    affect.damage = damageTotal;

    const buildup = this.buildup({ ...damageTotal, ...effect.buildup });
    const buildupFactor = this.buildup(effect.buildupFactor, true);
    const buildupFactorMax = this.buildup(effect.buildupFactorMax, true, true);
    const buildupTotal = Object.keys({ ...buildup, ...buildupFactor, ...buildupFactorMax }).reduce((total, type) => {
      total[type] = (buildup[type] + buildupFactor[type] + buildupFactorMax[type]);
      return total;
    }, {});
    affect.buildup = buildupTotal;

    return affect;
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

    this.reach = fromJSON(json, this, "reach", reviver?.reach);

    fromJSON(json, this, "at", reviver?.at);
    fromJSON(json, this, "looking", reviver?.looking);
    fromJSON(json, this, "facing", reviver?.facing);

    this.#level = fromJSON(json, this, "level", reviver?.level);
    this.experience = fromJSON(json, this, "experience", reviver?.experience);

    fromJSON(json, this, "abilityBase", reviver?.abilityBase);

    fromJSON(json, this, "proficiencyBase", reviver?.proficiencyBase);

    fromJSON(json, this, "statBase", reviver?.statBase);

    fromJSON(json, this, "vital", reviver?.vital);

    fromJSON(json, this, "slots", reviver?.slots);
    fromJSON(json, this, "armor", reviver?.armor);
    fromJSON(json, this, "hand", reviver?.hand);
    fromJSON(json, this, "side", reviver?.side);
    fromJSON(json, this, "accessories", reviver?.accessories);
    fromJSON(json, this, "inventory", reviver?.inventory);

    fromJSON(json, this, "condition", reviver?.condition);
    fromJSON(json, this, "conditions", reviver?.conditions);

    fromJSON(json, this, "attacks", (reviver?.attacks ?? { value: Attack.fromJSON }));

    fromJSON(json, this, "turn", (reviver?.turn ?? { value: Action.fromJSON }));

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);
    json.constructor = toJSON(this, "constructor", replacer?.constructor);

    json.reach = toJSON(this, "reach", replacer?.reach);

    json.at = toJSON(this, "at", replacer?.at);
    json.looking = toJSON(this, "looking", replacer?.looking);
    json.facing = toJSON(this, "facing", replacer?.facing);

    json.experience = toJSON(this, "experience", replacer?.experience);
    json.level = toJSON(this, "level", replacer?.level);

    json.abilityBase = toJSON(this, "abilityBase", replacer?.abilityBase);

    json.proficiencyBase = toJSON(this, "proficiencyBase", replacer?.proficiencyBase);

    json.statBase = toJSON(this, "statBase", replacer?.statBase);

    json.vital = toJSON(this, "vital", replacer?.vital);

    json.slots = toJSON(this, "slots", replacer?.slots);
    json.armor = toJSON(this, "armor", replacer?.armor);
    json.hand = toJSON(this, "hand", replacer?.hand);
    json.side = toJSON(this, "side", replacer?.side);
    json.accessories = toJSON(this, "accessories", replacer?.accessories);
    json.inventory = toJSON(this, "inventory", replacer?.inventory);

    json.condition = toJSON(this, "condition", replacer?.condition);
    json.conditions = toJSON(this, "conditions", replacer?.conditions);

    json.attacks = toJSON(this, "attacks", replacer?.attacks);

    json.turn = toJSON(this, "turn", replacer?.turn);

    return json;
  }
  // #endregion
};
export default serializable(Mob, true);
