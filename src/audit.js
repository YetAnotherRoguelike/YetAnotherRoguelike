import { fromJSON, toJSON } from "@kxirk/serialize";
import Date from "@kxirk/utils/date.js";

import { audit as settings } from "./settings.js";
import { Event, log } from "./events.js";
import time from "./time.js";
import { blacklisted as blacklistedAuth, whitelisted } from "./auth.js";


/** @abstract */
export const Violation = class {
  /** @type {string} */
  #ip;
  /** @type {string} */
  #name;

  /** @type {number} */
  #created;
  /** @type {number} */
  #duration;

  /**
   * @param {string} ip
   * @param {string} name
   * @param {number} [duration]
   */
  constructor (ip, name, duration = 0) {
    this.#name = name;
    this.#ip = ip;

    this.#created = time.now;
    this.#duration = duration;
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Violation}
   */
  static fromJSON (json, reviver) {
    return new Violation[json.constructor](json.ip, json.name, json.duration).fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }


  /** @type {string} */
  get ip () { return this.#ip; }

  /** @type {string} */
  get name () { return this.#name; }


  /** @type {number} */
  get created () { return this.#created; }

  /** @type {number} */
  get duration () { return this.#duration; }
  set duration (duration) { this.#duration = duration; }

  /** @type {number} */
  get expires () { return (this.created + this.duration); }

  /** @type {boolean} */
  get active () { return (this.expires > time.now); }

  /** @type {number} */
  get remaining () { return Math.max((this.expires - time.now), 0); }

  /**
   * @param {number} [when]
   * @returns {number} remaining
   */
  pardon (when = time.now) {
    this.#duration = (when - this.created).clamp(0);

    return this.remaining;
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Violation}
   */
  fromJSON (json, reviver) {
    this.#ip = fromJSON(json, this, "ip", reviver?.ip);
    this.#name = fromJSON(json, this, "name", reviver?.name);

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

    json.ip = toJSON(this, "ip", replacer?.ip);
    json.name = toJSON(this, "name", replacer?.name);

    json.created = toJSON(this, "created", replacer?.created);
    json.duration = toJSON(this, "duration", replacer?.duration);

    return json;
  }
};

export const ConnectionViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Connection Violation", settings.majorViolationDuration);
  }
};
Violation.ConnectionViolation = ConnectionViolation;

export const CredentialViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Credential Violation", settings.minorViolationDuration);
  }
};
Violation.CredentialViolation = CredentialViolation;

export const MessageViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Message Violation", settings.minorViolationDuration);
  }
};
Violation.MessageViolation = MessageViolation;

export const PathViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Path Violation", settings.minorViolationDuration);
  }
};
Violation.PathViolation = PathViolation;

export const RateViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Rate Violation", settings.majorViolationDuration);
  }
};
Violation.RateViolation = RateViolation;

export const TokenViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Token Violation", settings.majorViolationDuration);
  }
};
Violation.TokenViolation = TokenViolation;


export const Record = class {
  /** @type {Violation[]} */
  #violations;

  constructor () {
    this.#violations = [];
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Record}
   */
  static fromJSON (json, reviver) {
    return new Record().fromJSON(json, reviver);
  }


  /** @type {Violation[]} */
  get violations () { return this.#violations; }

  /** @type {Violation[]} */
  get active () { return this.violations.filter((violation) => violation.active); }


  /** @type {boolean} */
  get blacklistedPermanent () { return (this.violations.length >= settings.maxTotalViolations); }

  /** @type {boolean} */
  get blacklistedTemporary () { return (this.active.length >= settings.maxActiveViolations); }

  /** @type {boolean} */
  get blacklisted () { return (this.blacklistedPermanent || this.blacklistedTemporary); }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Record}
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
};


/** @type {Map<string, Record>} */
export const records = new Map();

Object.defineProperty(records, "get", {
  /**
   * @param {string} ip
   * @returns {Record}
   */
  value (ip) {
    if (!records.has(ip)) records.set(ip, new Record());

    return Map.prototype.get.call(records, ip);
  },
  enumerable: false
});

Object.defineProperty(records, "fromJSON", {
  /**
   * @param {Object[]} json
   * @param {Function} [reviver]
   * @returns {Map<string, Record>}
   */
  value (json, reviver) {
    return Map.prototype.fromJSON.call(records, json, (reviver ?? { value: Record.fromJSON }), false);
  },
  enumerable: false
});

/**
 * @param {string} ip
 * @returns {boolean}
 */
export const blacklisted = (ip) => {
  if (blacklistedAuth(ip)) return true;

  return records.get(ip)?.blacklisted ?? false;
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


/** @type {Violation[]} */
export const violations = [];

Object.defineProperty(violations, "add", {
  /**
   * @param {Violation} violation
   * @returns {number}
   */
  value (violation) {
    if (settings.pardonWhitelist && whitelisted(violation.ip)) return 0;

    violations.push(violation);
    log(new Event("info", "audit", `${violation.ip} ${violation.name}`, { cause: violation }));

    const record = records.get(violation.ip);
    record.violations.push(violation);
    if (record.blacklistedPermanent) {
      log(new Event("info", "audit", `${violation.ip} blacklisted permanently`, { cause: "Exceeded max allowed violations" }));
    }
    else if (record.blacklistedTemporary) {
      const active = [...record.active].sort((a, b) => a.expires - b.expires);
      const expires = active.at(-settings.maxActiveViolations).expires;

      log(new Event("info", "audit", `${violation.ip} blacklisted for ${Date.standard(expires - time.now)}`, { cause: "Exceeded max allowed active violations" }));
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
   * @returns {Violation[]}
   */
  value (json, reviver) {
    return Array.prototype.fromJSON.call(violations, json, (reviver ?? { value: Violation.fromJSON }), false);
  },
  enumerable: false
});


export default {
  Violation,
  ConnectionViolation,
  CredentialViolation,
  MessageViolation,
  PathViolation,
  RateViolation,
  TokenViolation,
  Record,

  records,
  blacklisted,
  pardon,
  expunge,

  violations
};
