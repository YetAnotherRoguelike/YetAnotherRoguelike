import crypto from "crypto";
import net, { isIPv4 } from "net";

import { auth as settings } from "./settings.js";
import { Event, log } from "./events.js";
import time, { convertTime, Priority, IntervalTask, tasks } from "./time.js";


export const BlockList = class extends net.BlockList {
  /**
   * @param {string} address
   * @returns {"ipv4" | "ipv6"}
   */
  static #type (address) {
    return (isIPv4(address) ? "ipv4" : "ipv6");
  }

  /**
   * @param {string} address
   * @returns {undefined}
   */
  addAddress (address) {
    super.addAddress(address, BlockList.#type(address));
  }

  /**
   * @param {string} start
   * @param {string} end
   * @returns {undefined}
   */
  addRange (start, end) {
    super.addRange(start, end, BlockList.#type(start));
  }

  /**
   * @param {string} network
   * @param {number} prefix
   * @returns {undefined}
   */
  addSubnet (network, prefix) {
    super.addRange(network, prefix, BlockList.#type(network));
  }

  /**
   * @param {string} address
   * @returns {boolean}
   */
  check (address) {
    return super.check(address, BlockList.#type(address));
  }
};

/** @type {BlockList} */
export const blacklist = new BlockList();
/** @type {BlockList} */
export const whitelist = new BlockList();

for (const [name, list] of Object.entries({ blacklist, whitelist })) {
  const rules = settings[name];
  for (const rule of rules) {
    const subnet = rule.includes("/");
    const range = rule.includes("-");

    if (subnet) {
      const [network, prefix] = rule.split("/");

      list.addSubnet(network, Number(prefix));
    }
    else if (range) {
      const [start, end] = rule.split("-");

      list.addRange(start, end);
    }
    else {
      const address = rule;

      list.addAddress(address);
    }
  }
}

/**
 * @param {string} ip
 * @returns {boolean}
 */
export const blacklisted = (ip) => blacklist.check(ip);

/**
 * @param {string} ip
 * @returns {boolean}
 */
export const whitelisted = (ip) => whitelist.check(ip);


if (settings.serverPassword === null) {
  let password = crypto.randomBytes(settings.serverPasswordBytes).toString(settings.serverPasswordEncoding);
  if (settings.serverPasswordSimple) {
    password = password.replaceAll("-", "a").replaceAll("_", "b").toUpperCase();
  }

  settings.serverPassword = password;

  log(new Event("info", "auth", `Server password is ${settings.serverPassword}`), (stream) => stream.console);
}

/**
 * @param {string} password
 * @returns {boolean}
 */
export const login = (password) => {
  if (!settings.enforceServerPassword) return true;

  const passwordHash = crypto.createHash("sha256").update(password).digest();
  const serverPasswordHash = crypto.createHash("sha256").update(settings.serverPassword).digest();
  return crypto.timingSafeEqual(passwordHash, serverPasswordHash);
};


if (settings.tokenSecret === null) {
  settings.tokenSecret = crypto.randomBytes(settings.tokenSecretBytes).toString(settings.tokenSecretEncoding);
}

export const Token = class {
  /** @type {string} */
  #ip;

  /** @type {number} */
  #created;
  /** @type {number} */
  #expires;

  /**
   * @param {string} ip
   * @param {number} expires
   */
  constructor (ip, expires) {
    this.#ip = ip;

    this.#created = time.now;
    this.#expires = expires;
  }


  /** @type {string} */
  get ip () { return this.#ip; }


  /** @type {number} */
  get created () { return this.#created; }

  /** @type {number} */
  get expires () { return this.#expires; }
  set expires (ms) { this.#expires = Math.max(ms, (time.now + settings.tokenTimeout)); }

  /** @type {boolean} */
  get valid () { return (this.expires > time.now); }

  /** @type {number} */
  get remaining () { return Math.max((this.expires - time.now), 0); }
};

/** @type {Map.<string, Token>} */
const tokens = new Map();

/**
 * @param {string} ip
 * @param {number} [duration]
 * @returns {string} id
 */
export const create = (ip, duration = settings.tokenTimeout) => {
  let id;
  do {
    const random = crypto.randomBytes(settings.tokenBytes).toString(settings.tokenEncoding);
    const hash = crypto.createHash("sha256").update(random).digest(settings.tokenEncoding);
    id = hash;
  } while (tokens.has(id));

  const token = new Token(ip, (time.now + duration));
  tokens.set(id, token);

  return id;
};

/**
 * @param {string} id
 * @param {string} ip
 * @returns {boolean}
 */
export const validate = (id, ip) => {
  const token = (tokens.get(id) ?? { valid: false });

  return (token.valid && (token.ip === ip));
};

/**
 * @param {string} id
 * @param {number} [ms]
 * @returns {number}
 */
export const extend = (id, ms = settings.tokenTimeout) => {
  (tokens.get(id) ?? { expires: 0 }).expires += ms;

  return tokens.get(id)?.expires;
};

/**
 * @param {string} id
 * @returns {boolean}
 */
export const revoke = (id) => tokens.delete(id);

/** @type {IntervalTask} */
const tokensCleanTask = new IntervalTask(
  "Tokens Clean",
  () => {
    for (const [id, token] of tokens.entries()) if (!token.valid) revoke(id);
  },
  Priority.server,
  convertTime(settings.tokensCleanInterval)
);
tasks.add(tokensCleanTask);


export default {
  blacklist,
  whitelist,
  blacklisted,
  whitelisted,

  login,

  Token,
  tokens,
  create,
  validate,
  extend,
  revoke
};
