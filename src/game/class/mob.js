import "@kxirk/utils/number.js";

import Ability from "./ability.js";
import Entity from "./entity.js";
import Point from "./point.js";
import Stat from "./stat.js";
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

  /** @type {Stat} */
  #statBase;
  /** @type {Stat} */
  #stat;

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

        return value.round();
      }
    });

    this.#statBase = new Stat();
    Object.defineProperties(this.statBase, {
      weightMax: { get: () => ((0.15 * super.weight) + (10 * this.ability.strength)) },

      view: { value: 8 },
      perception: { get: () => this.ability.wisdom },

      healthMax: { get: () => (this.sizeMod * this.ability.constitution) + this.level * Math.max(this.ability.constitution - 5, 1) },
      healthRegen: { value: 25 },

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


        let value = this.statBase[stat] ?? this.statBase[statGroup] ?? this.statBase[statType] ?? 0;

        if (["health", "regen"].includes(stat)) {
          value = target[stat];
        }

        if (["speed", "stealth", "evade"].includes(stat)) {
          value *= (1 / this.sizeMod);
        }
        else if (["healthMax"].includes(stat) || ["attack", "defense"].includes(statType)) {
          value *= this.sizeMod;
        }


        if (["critical"].includes(stat) || ["resist"].includes(statType)) {
          value = value.round(0.01);
        }
        else {
          value = value.round();
        }

        return value;
      },
      set: (target, stat, value) => {
        if (["health", "regen"].includes(stat)) {
          const statMax = `${stat}Max`;
          target[stat] = value.clamp(0, this.stat[statMax]);

          return true;
        }
        return false;
      }
    });
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


  /** @type {Stat} */
  get statBase () { return this.#statBase; }

  /** @type {Stat} */
  get stat () { return this.#stat; }


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

    return json;
  }
};
export default Mob;
