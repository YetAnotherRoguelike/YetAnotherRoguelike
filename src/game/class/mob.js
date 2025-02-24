import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Ability from "./ability.js";
import Accessory from "./accessory.js";
import Action from "./action.js";
import Armor from "./armor.js";
import Condition from "./condition.js";
import Conditions from "./conditions.js";
import Entity from "./entity.js";
import Inventory from "./inventory.js";
import Item from "./item.js";
import Point from "./point.js";
import Proficiency from "./proficiency.js";
import Slot from "./slot.js";
import Stat from "./stat.js";
import Tick from "./tick.js";
import Type from "./type.js";
import Vital from "./vital.js";


/**
 * @param {number} level
 * @returns {number} experience
 */
export const experienceNext = (level) => (5 * level) + 5;

/**
 * @param {number} level
 * @returns {number} experience
 */
export const experienceCumulative = (level) => ((level / 2) * experienceNext(level)) - 5;


/**
 * @param {Mob} mob
 * @returns {ProxyHandler<Ability<number>>}
 */
export const abilityHandler = (mob) => ({
  /**
   * @param {Ability<number>} target
   * @param {string} ability
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
 * @returns {ProxyHandler<Proficiency<number>>}
 */
export const proficiencyHandler = (mob) => ({
  /**
   * @param {Proficiency<number>} target
   * @param {string} proficiency
   * @returns {number}
   */
  get (target, proficiency) {
    const value = mob.proficiencyBase[proficiency] ?? 0;
    const bonus = Math.floor(mob.level / 4) + 2;

    return (bonus * value).round();
  }
});

/**
 * @param {Mob} mob
 * @returns {ProxyHandler<Stat>}
 */
export const statHandler = (mob) => ({
  /**
   * @param {Stat} target
   * @param {string} stat
   * @returns {number}
   */
  get (target, stat) {
    const [statUniversal, statGroup] = Stat.type(stat);

    let value = mob.statBase[stat] ?? mob.statBase[statGroup] ?? mob.statBase[statUniversal] ?? 0;


    // factor
    for (const condition of mob.conditions) {
      value *= condition?.effect.statFactor?.[stat] ?? 1.0;
    }

    // flat
    for (const slot of [...mob.armor, ...mob.hand, ...mob.side, ...mob.accessories]) {
      for (const item of slot) {
        const ability = (mob.ability?.[item.scaleAbility] ?? 0) - item.scaleMin;
        const scaleFactor = ability.clamp(0, item.scaleMax);

        const base = item.statBase?.[stat] ?? 0;
        const quality = item.qualityModifier * (item.statQuality?.[stat] ?? 0);
        const scale = scaleFactor * (item.statScale?.[stat] ?? 0);

        value += (base + quality + scale);
      }
    }
    for (const condition of mob.conditions) {
      value += condition?.effect.stat?.[stat] ?? 0;
    }


    // round
    if (["critical"].includes(stat) || statUniversal === "resist") {
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
export const vitalHandler = (mob) => ({
  /**
   * @param {Vital} target
   * @param {string} proficiency
   * @returns {number}
   */
  get (target, vital) {
    const value = target[vital];

    return value;
  },
  /**
   * @param {Stat} target
   * @param {string} stat
   * @param {number} value
   * @returns {boolean}
   */
  set (target, vital, value) {
    const [vitalUniversal] = Vital.type(vital);
    const vitalMax = `${vital}Max`;
    const vitalOverflow = `${vital}Overflow`;


    if (["health", "regen"].includes(vital)) {
      target[vital] = value.clamp(0, mob.stat[vitalMax]);

      return true;
    }
    if (["energy"].includes(vital)) {
      target[vital] = value.clamp(0, mob.stat[vitalMax]);
      target[vitalOverflow] += (value - mob.stat[vitalMax]).clamp(0);

      return true;
    }
    if (["energyOverflow"].includes(vital) || ["buildup"].includes(vitalUniversal)) {
      target[vital] = value.clamp(0);

      return true;
    }

    return false;
  }
});

/** @abstract */
const Mob = class extends Entity {
  /** @type {number} */
  #reach; // ft

  /** @type {Point} */
  #at;
  /** @type {Point} */
  #looking;
  /** @type {Point} */
  #facing;

  /** @type {number} */
  #experience;
  /** @type {number} */
  #level;

  /** @type {Ability<number>} */
  #abilityBase;
  /** @type {Ability<Number>} */
  #ability;

  /** @type {Proficiency<number>} */
  #proficiencyBase;
  /** @type {Proficiency<number>} */
  #proficiency;

  /** @type {Stat} */
  #statBase;
  /** @type {Stat} */
  #stat;

  /** @type {Vital} */
  #vital;

  /** @type {Slot<Armor>} */
  #armor;
  /** @type {Slot<Item>} */
  #hand;
  /** @type {Slot<Item>} */
  #side;
  /** @type {Inventory<Accessory>} */
  #accessories;
  /** @type {Inventory<Item>} */
  #inventory;

  /** @type {Conditions} */
  #conditions;

  /** @type {Action[]} */
  #turn;
  /** @type {Function} */
  #act;

  constructor () {
    super();
    this.display.push("mob");

    this.reach = 0;

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
      weightMax: { get: () => this.sizeFactor * 10 * this.ability.strength },

      view: { get: () => this.heightFactor * 60 },
      perception: { get: () => this.ability.wisdom },

      healthMax: { get: () => (this.sizeModifierFactor * this.ability.constitution) + (this.level * (this.ability.constitution / 2)) },

      regenMax: { get: () => 15 - (this.ability.constitution / 2) },

      energyMax: { get: () => (10 * this.stat.speed).clamp(50) },

      speed: { get: () => this.ability.dexterity / 2 },
      stealth: { get: () => this.ability.dexterity - (4 * this.sizeModifier) },
      evade: { get: () => (this.ability.dexterity / 2) - (2 * this.sizeModifier) },

      critical: { get: () => this.ability.luck / 200 },
      physicalAttack: { get: () => (this.sizeModifierFactor * ((this.ability.strength / 2) - 4)).clamp(1) },

      physicalDefense: { get: () => this.ability.constitution / 4 },
      tolerance: { get: () => this.stat.healthMax / 2 }
    });
    this.#stat = new Proxy(new Stat(0), statHandler(this));

    this.#vital = new Proxy(new Vital(0), vitalHandler(this));

    this.#armor = new Slot(Armor);
    this.#hand = new Slot(Item);
    this.#side = new Slot(Item);
    this.#accessories = new Inventory(Accessory, 2);
    this.#inventory = new Inventory(Item, 5);

    this.#conditions = new Conditions();

    this.#turn = [];
    this.act = null;
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Mob}
   */
  static fromJSON (json, reviver) {
    return new Mob[json.constructor]().fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }


  /** @type {number} */
  get weight () {
    let weight = super.weight;

    weight += this.armor.weight;
    weight += this.hand.weight;
    weight += this.side.weight;
    for (const accessory of this.accessories) weight += accessory.weight;
    for (const item of this.inventory) weight += item.weight;

    return weight;
  }

  /** @type {number} */
  get weightFactor () {
    return (this.weight - super.weight) / this.stat.weightMax;
  }


  /** @type {number} */
  get reach () { return this.#reach; }
  set reach (reach) { this.#reach = reach; }


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

    const next = experienceCumulative(this.level + 1);
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
    const min = experienceCumulative(level);
    this.experience = this.experience.clamp(min);
  }


  /** @type {Memories} */
  get memories () { return this.#memories; }


  /** @type {Ability<number>} */
  get abilityBase () { return this.#abilityBase; }

  /** @type {Ability<number>} */
  get ability () { return this.#ability; }


  /** @type {Proficiency<number>} */
  get proficiencyBase () { return this.#proficiencyBase; }

  /** @type {Proficiency<number>} */
  get proficiency () { return this.#proficiency; }


  /** @type {Stat} */
  get statBase () { return this.#statBase; }

  /** @type {Stat} */
  get stat () { return this.#stat; }


  /** @type {Vital} */
  get vital () { return this.#vital; }


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

  /**
   * @argument {Item} item
   * @returns {boolean}
   */
  add (item) {
    return (this.hand.add(item) || this.side.add(item) || this.inventory.add(item));
  }
  /**
   * @argument {number} index
   * @returns {Item}
   */
  remove (index) {
    return this.inventory.remove(index);
  }

  /**
   * @argument {number} index
   * @returns {boolean}
   */
  equip (index) {
    const item = this.inventory.remove(index);
    if (item === undefined) return false;

    let success = false;
    if (item.equip.includes("armor") && this.armor.add(item)) {
      success = true;
    }
    else if (item.equip.includes("side") && this.side.add(item)) {
      success = true;
    }
    else if ((item.equip.includes("hand") || item.equip.includes("side")) && this.hand.add(item)) {
      success = true;
    }
    else if (item.equip.includes("both") && this.side.count === 0 && this.hand.add(item)) {
      this.side.open = false;
      success = true;
    }
    else if (item.equip.includes("accessories") && this.accessories.add(item)) {
      success = true;
    }
    else {
      this.add(item);
    }

    return success;
  }
  /**
   * @argument {string} slot
   * @argument {number} index
   * @returns {boolean}
   */
  unequip (slot, index) {
    const item = this[slot].remove(index);
    if (item === undefined) return false;

    if (item.equip.includes("both")) this.side.open = true;


    if (this.add(item)) return true;

    this[slot].add(item);
    if (item.equip.includes("both")) this.side.open = false;
    return false;
  }


  /** @type {Conditions} */
  get conditions () { return this.#conditions; }

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


  /** @type {Action[]} */
  get turn () { return this.#turn; }

  /** @type {Function} */
  get act () { return this.#act; }
  set act (act) { this.#act = act; }


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
      const base = (factor ? (healthFactor * value) : value);
      const resist = this.stat[`${type}Resist`] * base;
      const defense = this.stat[`${type}Defense`];

      let total = base - resist;
      if (total > 0) total -= defense.clamp(0, total);

      dealt[type] = total;
    }

    const dealtTotal = Object.values(dealt).reduce((total, type) => total + type, 0);
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

      const base = (factor ? (buildupFactor * value) : value);
      const resist = this.stat[`${type}Resist`] * base;
      const total = base - resist;

      this.vital[`${type}Buildup`] += total;
      if (this.vital[`${type}Buildup`] > tolerence) {
        const BuildupCondition = Condition.buildup.get(type);
        const condition = new BuildupCondition();

        this.conditions.add(condition);
        this.vital[`${type}Buildup`] = 0;
      }

      dealt[type] = total;
    }

    return dealt;
  }

  /**
   * @param {Effect} effect
   * @returns {Object} result
   */
  effect (effect) {
    const statTotal = {
      health: 0,
      regen: 0,
      energy: 0
    };
    for (const stat of Object.keys(statTotal)) {
      const base = (effect.stat[stat] ?? 0);
      const factor = this.stat[stat] * (effect.statFactor[stat] ?? 0);
      const factorMax = this.stat[`${stat}Max`] * (effect.statFactorMax[stat] ?? 0);
      const total = base + factor + factorMax;

      statTotal[stat] = total;
      this.stat[stat] += total;
    }

    const damage = this.damage(effect.damage);
    const damageFactor = this.damage(effect.damageFactor, true);
    const damageFactorMax = this.damage(effect.damageFactorMax, true, true);
    const damageTotal = Object.keys({ ...damage, ...damageFactor, ...damageFactorMax }).reduce((total, type) => {
      total[type] = damage[type] + damageFactor[type] + damageFactorMax[type];
      return total;
    }, {});

    const buildup = this.buildup(effect.buildup);
    const buildupFactor = this.buildup(effect.buildupFactor, true);
    const buildupFactorMax = this.buildup(effect.buildupFactorMax, true, true);
    const buildupTotal = Object.keys({...buildup, ...buildupFactor, ...buildupFactorMax}).reduce((total, type) => {
      total[type] = buildup[type] + buildupFactor[type] + buildupFactorMax[type];
      return total;
    }, {});

    return {
      stat: statTotal,
      damage: damageTotal,
      buildup: buildupTotal
    };
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Mob}
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

    fromJSON(json, this, "armor", reviver?.armor);
    fromJSON(json, this, "hand", reviver?.hand);
    fromJSON(json, this, "side", reviver?.side);
    fromJSON(json, this, "accessories", reviver?.accessories);
    fromJSON(json, this, "inventory", reviver?.inventory);

    fromJSON(json, this, "conditions", reviver?.conditions);

    fromJSON(json, this, "turn", reviver?.turn);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

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

    json.armor = toJSON(this, "armor", replacer?.armor);
    json.hand = toJSON(this, "hand", replacer?.hand);
    json.side = toJSON(this, "side", replacer?.side);
    json.accessories = toJSON(this, "accessories", replacer?.accessories);
    json.inventory = toJSON(this, "inventory", replacer?.inventory);

    json.conditions = toJSON(this, "conditions", replacer?.conditions);

    json.turn = toJSON(this, "turn", replacer?.turn);

    return json;
  }
};
export default Mob;
