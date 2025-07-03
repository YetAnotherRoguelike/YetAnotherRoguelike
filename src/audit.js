import { fromJSON, toJSON, serializable } from "@kxirk/serialize";
import Date from "@kxirk/utils/date.js";
import "@kxirk/utils/number.js";

import { blacklisted as blacklistedAuth, whitelisted } from "./auth.js";
import { Event, Level, log } from "./events.js";
import { audit as settings } from "./settings.js";
import time from "./time.js";


const Record = class {
  // #region Instance
  /** @type {Violation[]} */ #violations;

  constructor () {
    this.#violations = [];
  }
  // #endregion

  // #region Instance Accessors
  /** @type {Violation[]} */
  get violations () { return this.#violations; }
  // #endregion

  // #region Instance Derived Properties
  /** @type {Violation[]} */
  get active () {
    return this.violations.filter((violation) => violation.active);
  }


  /** @type {boolean} */
  get blacklistedPermanent () {
    return (this.violations.length >= settings.maxTotalViolations);
  }

  /** @type {boolean} */
  get blacklistedTemporary () {
    return (this.active.length >= settings.maxActiveViolations);
  }

  /** @type {boolean} */
  get blacklisted () {
    return (this.blacklistedPermanent || this.blacklistedTemporary);
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
    fromJSON(json, this, "violations", reviver?.violations);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.violations = toJSON(this, "violations", replacer?.violations);

    return json;
  }
  // #endregion
};
serializable(Record);

/** @type {Map<string, Record>} */ export const records = new Map();
Object.defineProperty(records, "get", {
  /**
   * @param {string} ip
   * @modifies {this}
   * @returns {Record}
   */
  value (ip) {
    if (!this.has(ip)) this.set(ip, new Record());

    return Map.prototype.get.call(this, ip);
  },
  enumerable: false
});
Object.defineProperty(records, "fromJSON", {
  /**
   * @param {Object[]} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  value (json, reviver) {
    return Map.prototype.fromJSON.call(this, json, (reviver ?? { value: Record.fromJSON }), false);
  },
  enumerable: false
});

/**
 * @param {string} ip
 * @returns {boolean}
 */
export const blacklisted = (ip) => {
  if (blacklistedAuth(ip)) return true;

  return (records.get(ip)?.blacklisted ?? false);
};

/**
 * @param {string} ip
 * @returns {number}
 */
export const pardon = (ip) => {
  let count = 0;

  const record = records.get(ip);
  for (const violation of record.violations) {
    if (violation.active) {
      violation.pardon();
      count++;
    }
  }

  return count;
};

/**
 * @param {string} ip
 * @returns {boolean}
 */
export const expunge = (ip) => records.delete(ip);


/**
 * @enum {string}
 */
export const Violation = class {
  // #region Static
  /**
   * @enum {number}
   */
  static Duration = class {
    static connection = settings.majorViolationDuration;
    static credential = settings.minorViolationDuration;
    static message = settings.minorViolationDuration;
    static path = settings.minorViolationDuration;
    static rate = settings.majorViolationDuration;
    static token = settings.majorViolationDuration;
  };
  // #endregion


  // #region Instance
  /** @type {string} */ #type;
  /** @type {string} */ #ip;

  /** @type {number} */ #created;
  /** @type {number} */ #duration;

  /**
   * @param {string} type
   * @param {string} ip
   * @param {number} [duration]
   */
  constructor (type, ip, duration = (Violation.Duration[type] ?? 0)) {
    this.#type = type;
    this.#ip = ip;

    this.#created = time.now;
    this.#duration = duration;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {string} */
  get type () { return this.#type; }

  /** @type {string} */
  get ip () { return this.#ip; }


  /** @type {number} */
  get created () { return this.#created; }

  /** @type {number} */
  get duration () { return this.#duration; }
  set duration (duration) { this.#duration = duration; }
  // #endregion

  // #region Instance Derived Properties
  /** @type {number} */
  get expires () {
    return (this.created + this.duration);
  }

  /** @type {boolean} */
  get active () {
    return (this.expires > time.now);
  }

  /** @type {number} */
  get remaining () {
    return Math.max((this.expires - time.now), 0);
  }
  // #endregion

  // #region Instance Methods
  /**
   * @param {number} [when]
   * @returns {number} remaining
   */
  pardon (when = time.now) {
    this.#duration = (when - this.created).clamp(0);

    return this.remaining;
  }
  // #endregion


  // #region Serialize
  /** @type {string[]} */ static parameters = ["type", "ip", "duration"];


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    this.#type = fromJSON(json, this, "type", reviver?.type);
    this.#ip = fromJSON(json, this, "ip", reviver?.ip);

    this.#created = fromJSON(json, this, "created", reviver?.created);
    this.duration = fromJSON(json, this, "duration", reviver?.duration);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.type = toJSON(this, "type", replacer?.type);
    json.ip = toJSON(this, "ip", replacer?.ip);

    json.created = toJSON(this, "created", replacer?.created);
    json.duration = toJSON(this, "duration", replacer?.duration);

    return json;
  }
  // #endregion
};
serializable(Violation);
for (const type of Object.keys(Violation.Duration)) Object.defineProperty(Violation, type, { /** @type {string} */ value: type });

/** @type {Violation[]} */ export const violations = [];
Object.defineProperty(violations, "add", {
  /**
   * @param {Violation} violation
   * @returns {number}
   */
  value (violation) {
    if (settings.pardonWhitelist && whitelisted(violation.ip)) return 0;

    violations.push(violation);
    log(new Event(Level.info, "audit", `${violation.ip} ${violation.type}`, { cause: violation }));

    const record = records.get(violation.ip);
    record.violations.push(violation);
    if (record.blacklistedPermanent) {
      log(new Event(Level.info, "audit", `${violation.ip} blacklisted permanently`, { cause: "Exceeded max allowed violations" }));
    }
    else if (record.blacklistedTemporary) {
      const active = record.active.sort((a, b) => (a.expires - b.expires));
      const expires = active.at(-settings.maxActiveViolations).expires;

      log(new Event(Level.info, "audit", `${violation.ip} blacklisted for ${Date.standard(expires - time.now)}`, { cause: "Exceeded max allowed active violations" }));
    }

    return record.violations.length;
  },
  enumerable: false
});
Object.defineProperty(violations, "active", {
  /** @type {Violation[]} */
  get () {
    return violations.filter((violation) => violation.active);
  },
  enumerable: false
});
Object.defineProperty(violations, "fromJSON", {
  /**
   * @param {Object[]} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  value (json, reviver) {
    return Array.prototype.fromJSON.call(this, json, (reviver ?? { value: Violation.fromJSON }), false);
  },
  enumerable: false
});


export default {
  Record,
  records,
  blacklisted,
  pardon,
  expunge,

  Violation,
  violations
};
