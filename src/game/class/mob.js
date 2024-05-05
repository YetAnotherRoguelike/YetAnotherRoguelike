import Ability from "./ability.js";
import Entity from "./entity.js";
import Point from "./point.js";
import Stat from "./stat.js";
import Type from "./type.js";
import Vital from "./vital.js";


const Mob = class extends Entity {
  /** @type {number} */
  #reach; // ft

  /** @type {Point} */
  #at;
  /** @type {Point} */
  #looking;
  /** @type {Point} */
  #facing;

  /** @type {Ability.<number>} */
  #ability;

  /** @type {Stat} */
  #statBase;
  /** @type {Stat} */
  #stat;

  /** @type {Vital} */
  #vital;

  constructor () {
    super();
    this.display.push("mob");

    this.reach = 0;

    this.#at = new Point();
    this.#looking = new Point();
    this.#facing = new Point();

    this.#ability = new Ability(1);

    this.#statBase = new Stat();
    Object.defineProperties(this.statBase, {
      weightMax: { get: () => ((0.15 * super.weight) + (10 * this.ability.strength)) },

      view: { value: 8 },
      perception: { get: () => this.ability.wisdom },

      healthMax: { get: () => Math.max(this.ability.constitution, ((10 * this.ability.constitution) - 80)) },
      healthRegen: { value: 25 },

      speed: { get: () => ((this.ability.dexterity / 2) + 1) },
      stealth: { get: () => this.ability.dexterity },

      accuracy: { get: () => this.ability.dexterity },
      critical: { get: () => (this.ability.luck / 200) },

      evade: { get: () => (this.ability.dexterity / 2) },
      physicalDefense: { get: () => (this.ability.constitution / 2) }
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
      }
    });

    this.#vital = new Vital();
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


  /** @type {Ability.<number>} */
  get ability () { return this.#ability; }


  /** @type {Stat} */
  get statBase () { return this.#statBase; }

  /** @type {Stat} */
  get stat () { return this.#stat; }


  /** @type {Vital} */
  get vital () { return this.#vital; }


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

    this.ability.fromJSON(json.ability);

    this.vital.fromJSON(json.vital);

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    const json = super.toJSON();

    json.reach = this.reach;

    json.at = this.at.toJSON();
    json.looking = this.looking.toJSON();
    json.facing = this.facing.toJSON();

    json.ability = this.ability.toJSON();

    json.vital = this.vital.toJSON();

    return json;
  }
};
export default Mob;
