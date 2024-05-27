import Date from "@kxirk/utils/date.js";

import { audit as settings } from "./settings.js";
import { Event, log } from "./events.js";
import time from "./time.js";
import { blacklisted as blacklistedAuth, whitelisted } from "./auth.js";


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
   * @returns {Violation}
   */
  static fromJSON (json) {
    return new Violation().fromJSON(json);
  }


  /** @type {string} */
  get name () { return this.#name; }

  /** @type {string} */
  get ip () { return this.#ip; }


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
   * @returns {Violation}
   */
  fromJSON (json) {
    this.#name = json.name;
    this.#ip = json.ip;

    this.#created = json.created;
    this.duration = json.duration;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      name: this.name,
      ip: this.ip,

      created: this.created,
      duration: this.duration
    };
  }
};
export const ConnectionViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Connection Violation", settings.majorViolationDuration);
  }
};
export const CredentialViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Credential Violation", settings.minorViolationDuration);
  }
};
export const MessageViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Message Violation", settings.minorViolationDuration);
  }
};
export const PathViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Path Violation", settings.minorViolationDuration);
  }
};
export const RateViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Rate Violation", settings.majorViolationDuration);
  }
};
export const TokenViolation = class extends Violation {
  constructor (ip) {
    super(ip, "Token Violation", settings.majorViolationDuration);
  }
};


export const Profile = class {
  /** @type {Violation[]} */
  #violations;

  constructor () {
    this.#violations = [];
  }

  /**
   * @param {Object} json
   * @returns {Profile}
   */
  static fromJSON (json) {
    return new Profile().fromJSON(json);
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
   * @returns {Profile}
   */
  fromJSON (json) {
    for (const violation of json.violations) this.violations.push( Violation.fromJSON(violation) );

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      violations: this.violations.map((violation) => violation.toJSON())
    };
  }
};


/** @type {Map.<string, Profile>} */
export const profiles = new Map();
Object.defineProperty(profiles, "get", {
  /**
   * @param {string} ip
   * @returns {Profile}
   */
  value (ip) {
    if ( !profiles.has(ip) ) profiles.set(ip, new Profile());

    return Map.prototype.get.call(profiles, ip);
  },
  enumerable: false
});

/**
 * @param {string} ip
 * @returns {boolean}
 */
export const blacklisted = (ip) => {
  if (blacklistedAuth(ip)) return true;

  return profiles.get(ip)?.blacklisted ?? false;
};

/**
 * @param {string} ip
 * @returns {number}
 */
export const pardon = (ip) => {
  let count = 0;

  const profile = profiles.get(ip);
  for (const violation of profile.violations) {
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
export const expunge = (ip) => profiles.delete(ip);


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

    const profile = profiles.get(violation.ip);
    profile.violations.push(violation);
    if (profile.blacklistedPermanent) {
      log(new Event("info", "audit", `${violation.ip} blacklisted permanently`, { cause: "Exceeded max allowed violations" }));
    }
    else if (profile.blacklistedTemporary) {
      const active = [...profile.active].sort((a, b) => a.expires - b.expires);
      const expires = active.at(-settings.maxActiveViolations).expires;

      log(new Event("info", "audit", `${violation.ip} blacklisted for ${Date.standard(expires - time.now)}`, { cause: "Exceeded max allowed active violations" }));
    }

    return profile.violations.length;
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


export default {
  Violation,
  Profile,

  profiles,
  blacklisted,
  pardon,
  expunge,

  violations
};
