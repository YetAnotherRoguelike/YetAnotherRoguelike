import "@kxirk/utils/number.js";

import Ability from "./ability.js";
import Accessory from "./accessory.js";
import Armor from "./armor.js";
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

  /** @type {Ability.<number>} */
  #abilityBase;
  /** @type {Ability.<number>} */
  #ability;

  /** @type {Proficiency.<number>} */
  #proficiencyBase;
  /** @type {Proficiency.<number>} */
  #proficiency;

  /** @type {Stat} */
  #statBase;
  /** @type {Stat} */
  #stat;

  /** @type {Slot.<Armor>} */
  #armor;
  /** @type {Slot.<Item>} */
  #hand;
  /** @type {Slot.<Item>} */
  #side;
  /** @type {Inventory.<Accessory>} */
  #accessories;
  /** @type {Inventory.<Item>} */
  #inventory;

  /** @type {Conditions} */
  #conditions;

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
    this.#ability = new Proxy(new Ability(), {
      get: (target, ability) => {
        let value = this.abilityBase[ability] ?? 0;


        // factor
        for (const condition of this.conditions) {
          value *= condition?.effect.abilityFactor?.[ability] ?? 1.0;
        }


        // flat
        for (const condition of this.conditions) {
          value += condition?.effect.ability?.[ability] ?? 0;
        }


        // round
        return value.round();
      }
    });

    this.#proficiencyBase = new Proficiency(0.0);
    this.#proficiency = new Proxy(new Proficiency(), {
      get: (target, proficiency) => {
        const value = this.proficiencyBase[proficiency] ?? 0;

        return value.round();
      }
    });

    this.#statBase = new Stat();
    Object.defineProperties(this.statBase, {
      weightMax: { get: () => ((0.15 * super.weight) + (10 * this.ability.strength)) },

      view: { value: 8 },
      perception: { get: () => this.ability.wisdom },

      healthMax: { get: () => (this.sizeMod * this.ability.constitution) + this.level * Math.max(this.ability.constitution - 5, 1) },

      regenMax: { value: 10 },

      energyMax: { get: () => 10 * this.stat.speed },

      speed: { get: () => (this.ability.dexterity / 2) + 1 },
      stealth: { get: () => this.ability.dexterity },

      critical: { get: () => this.ability.luck / 200 },
      strikingAttack: { get: () => this.ability.strength },

      evade: { get: () => (this.ability.dexterity / 2) + this.level },
      physicalDefense: { get: () => this.ability.constitution / 2 }
    });
    this.#stat = new Proxy(new Stat(), {
      get: (target, stat) => {
        let statType;
        let statGroup;

        const [type, suffix] = stat.split(new RegExp(`(${Stat.types.join("|")})`, "g"));
        if (suffix) {
          statType = suffix.toLowerCase();

          const group = ["physical", "elemental", "magical"].find((g) => Type[g].includes(type));
          if (group) {
            statGroup = `${group}${suffix}`;
          }
        }


        const equipped = [...this.armor, ...this.hand, ...this.side, ...this.accessories];

        let value = this.statBase[stat] ?? this.statBase[statGroup] ?? this.statBase[statType] ?? 0;
        if (["health", "regen", "energy"].includes(stat)) {
          value = target[stat];
        }


        // size
        if (["speed", "stealth", "evade"].includes(stat)) {
          value *= (1 / this.sizeMod);
        }
        else if (["healthMax"].includes(stat) || ["attack", "defense"].includes(statType)) {
          value *= this.sizeMod;
        }


        // factor
        for (const condition of this.conditions) {
          value *= condition?.effect.statFactor?.[stat] ?? 1.0;
        }


        // flat
        for (const item of equipped) {
          const ability = (this.ability?.[item.scaleAbility] ?? 0) - item.scaleMin;
          const scaleFactor = 1 + (0.02 * ability.clamp(0, item.scaleMax));

          const base = item.statBase?.[stat] ?? 0;
          const quality = item.qualityFactor * (item.statQuality?.[stat] ?? 0);
          const scale = scaleFactor * (item.statScale?.[stat] ?? 0);

          value += (base + quality + scale);
        }
        for (const condition of this.conditions) {
          value += condition?.effect.stat?.[stat] ?? 0;
        }


        // weight
        if (["speed", "evade"].includes(stat)) {
          value *= this.weightMod;
        }


        // round
        if (["critical"].includes(stat) || ["resist"].includes(statType)) {
          value = value.round(0.01);
        }
        else {
          value = value.round();
        }

        return value;
      },
      set: (target, stat, value) => {
        if (["health", "regen", "energy"].includes(stat)) {
          const statMax = `${stat}Max`;
          target[stat] = value.clamp(0, this.stat[statMax]);

          return true;
        }
        return false;
      }
    });

    this.#armor = new Slot(Armor);
    this.#hand = new Slot(Item);
    this.#side = new Slot(Item);
    this.#accessories = new Inventory(Accessory, 2);
    this.#inventory = new Inventory(Item, 5);

    this.#conditions = new Conditions();

    this.act = null;
  }

  /**
   * @param {Object} json
   * @returns {Mob}
   */
  static fromJSON (json) {
    return new Mob().fromJSON(json);
  }


  /** @type {number} */
  get sizeMod () {
    return (this.dimensionMax / 6);
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
  get weightMod () {
    const use = (this.weight - super.weight);
    const useFactor = (use / this.stat.weightMax);

    return 1 - (useFactor / 2);
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
    this.#experience += experience;

    let next = Infinity;
    do {
      next = 5 * (this.level + 1);
      if (this.experience >= next) {
        this.#level++;
        this.#experience -= next;
      }
    } while (this.experience >= next);
  }

  /** @type {number} */
  get level () { return this.#level; }
  set level (level) { this.#level = level; }


  /** @type {Ability.<number>} */
  get abilityBase () { return this.#abilityBase; }

  /** @type {Ability.<number>} */
  get ability () { return this.#ability; }


  /** @type {Proficiency.<number>} */
  get proficiencyBase () { return this.#proficiencyBase; }

  /** @type {Proficiency.<number>} */
  get proficiency () { return this.#proficiency; }


  /** @type {Stat} */
  get statBase () { return this.#statBase; }

  /** @type {Stat} */
  get stat () { return this.#stat; }


  /** @type {Slot.<Armor>} */
  get armor () { return this.#armor; }

  /** @type {Slot.<Item>} */
  get hand () { return this.#hand; }

  /** @type {Slot.<Item>} */
  get side () { return this.#side; }

  /** @type {Inventory.<Accessory>} */
  get accessories () { return this.#accessories; }

  /** @type {Inventory.<Item>} */
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


    if ( this.add(item) ) return true;

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
        expired.push( this.conditions[queue].remove(condition) );
      }
    }

    return expired;
  }


  /** @type {Function} */
  get act () { return this.#act; }
  set act (act) { this.#act = act; }


  /**
   * @param {Type} damage
   * @param {boolean} [factor]
   * @returns {Type}
   */
  damage (damage, factor = false) {
    const dealt = new Type(0);

    for (const [type, value] of Object.entries(damage)) {
      const base = (factor ? (this.stat.healthMax * value) : value);
      const resist = this.stat[`${type}Resist`] * base;
      const defense = this.stat[`${type}Defense`];

      let total = base - resist;
      if (total > 0) total -= defense.clamp(0, total);

      dealt[type] = total;
    }

    const dealtTotal = Object.values(dealt).reduce((total, type) => total + type, 0);
    this.stat.health -= dealtTotal;
    if (dealtTotal > 0) this.stat.regen = this.stat.regenMax;


    return dealt;
  }

  /**
   * @param {Effect} effect
   * @returns {Object} result
   */
  effect (effect) {
    const damage = this.damage(effect.damage);
    const damageFactor = this.damage(effect.damageFactor, true);
    const damageTotal = Object.keys({ ...damage, ...damageFactor }).reduce((total, type) => {
      total[type] = damage[type] + damageFactor[type];
      return total;
    }, {});

    return { damage: damageTotal };
  }


  /**
   * @param {Object} json
   * @returns {Mob}
   */
  fromJSON (json) {
    super.fromJSON(json);

    this.reach = json.reach;

    this.at.fromJSON(json.at);
    this.looking.fromJSON(json.looking);
    this.facing.fromJSON(json.facing);

    this.experience = json.experience;
    this.level = json.level;

    this.abilityBase.fromJSON(json.abilityBase);

    this.proficiencyBase.fromJSON(json.proficiencyBase);

    this.armor.fromJSON(json.armor);
    this.hand.fromJSON(json.hand);
    this.side.fromJSON(json.side);
    this.accessories.fromJSON(json.accessories);
    this.inventory.fromJSON(json.inventory);

    this.conditions.fromJSON(json.conditions);

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    const json = super.toJSON();

    json.reach = this.reach;

    json.at = this.at.toJSON();
    json.looking = this.looking.toJSON();
    json.facing = this.facing.toJSON();

    json.experience = this.experience;
    json.level = this.level;

    json.abilityBase = this.abilityBase.toJSON();

    json.proficiencyBase = this.proficiencyBase.toJSON();

    json.armor = this.armor.toJSON();
    json.hand = this.hand.toJSON();
    json.side = this.side.toJSON();
    json.accessories = this.accessories.toJSON();
    json.inventory = this.inventory.toJSON();

    json.conditions = this.conditions.toJSON();

    return json;
  }
};
export default Mob;
