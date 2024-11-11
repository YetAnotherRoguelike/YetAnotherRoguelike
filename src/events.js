import { fromJSON, toJSON } from "@kxirk/serialize";

import { events as settings } from "./settings.js";


/** @enum {number} */
export const Level = class {
  static error = 0;
  static warn = 1;
  static info = 2;
  static debug = 3;
};

/** @abstract */
export const Event = class extends Error {
  /** @type {keyof Level} */
  #level;
  /** @type {string} */
  #module;
  /** @type {number} */
  #time;

  /**
   * @typedef {Object} Options
   * @property {*} cause
   */
  /**
   * @param {keyof Level} level
   * @param {string} module
   * @param {string} message
   * @param {Options} options
   */
  constructor (level, module, message, options) {
    super(message, options);
    this.name = "Event";

    this.#level = level;
    this.#module = module;
    this.#time = (performance.timeOrigin + performance.now());

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Event}
   */
  static fromJSON (json, reviver) {
    return new Event[json.constructor](json.level, json.module, json.message, { cause: json.cause }).fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }


  /** @type {keyof Level} */
  get level () { return this.#level; }

  /** @type {string} */
  get module () { return this.#module; }

  /** @type {number} */
  get time () { return this.#time; }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Event}
   */
  fromJSON (json, reviver) {
    this.name = fromJSON(json, this, "name", reviver?.name);
    this.code = fromJSON(json, this, "code", reviver?.code);
    this.message = fromJSON(json, this, "message", reviver?.message);
    this.stack = fromJSON(json, this, "stack", reviver?.stack);
    this.cause = fromJSON(json, this, "cause", reviver?.cause);

    this.#level = fromJSON(json, this, "level", reviver?.level);
    this.#module = fromJSON(json, this, "module", reviver?.module);
    this.#time = fromJSON(json, this, "time", reviver?.time);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.name = toJSON(this, "name", replacer?.name);
    json.code = toJSON(this, "code", replacer?.code);
    json.message = toJSON(this, "message", replacer?.message);
    json.stack = toJSON(this, "stack", replacer?.stack);
    json.cause = toJSON(this, "cause", replacer?.cause);

    json.level = toJSON(this, "level", replacer?.level);
    json.module = toJSON(this, "module", replacer?.module);
    json.time = toJSON(this, "time", replacer?.time);

    return json;
  }
};

export const ErrorEvent = class extends Event {
  constructor (module, message, options) {
    super(Level.error, module, message, options);
  }
};
Event.ErrorEvent = ErrorEvent;

export const WarnEvent = class extends Event {
  constructor (module, message, options) {
    super(Level.warn, module, message, options);
  }
};
Event.WarnEvent = WarnEvent;

export const InfoEvent = class extends Event {
  constructor (module, message, options) {
    super(Level.info, module, message, options);
  }
};
Event.InfoEvent = InfoEvent;

export const DebugEvent = class extends Event {
  constructor (module, message, options) {
    super(Level.debug, module, message, options);
  }
};
Event.DebugEvent = DebugEvent;


/** @type {Event[]} */
export const events = [];

Object.defineProperty(events, "fromJSON", {
  /**
   * @param {Object[]} json
   * @param {Function} [reviver]
   * @returns {Event[]}
   */
  value (json, reviver) {
    return Array.prototype.fromJSON.call(events, json, (reviver ?? { value: Event.fromJSON }), false);
  },
  enumerable: false
});

/**
 * @param {Event} event
 * @param {(stream) => boolean} [filter]
 * @returns {undefined}
 */
export const log = (event, filter = () => true) => {
  events.push(event);

  const filtered = settings.streams.filter((stream) => (Level[event.level] <= Level[stream.level])).filter(filter);
  for (const stream of filtered) {
    let data = event;
    if (stream.format === "serialized") {
      data = event.toJSON();
    }
    else if (stream.format === "string") {
      const message = (stream.trace) ? event.stack : `${event.module}: ${event.message}`;
      data = `${new Date(event.time).toISOString()} [${event.level}] ${message}\n`;
    }

    stream.stream.emit("reset");
    stream.stream.write(data);
    stream.stream.emit("write");
  }
};


export default {
  Level,
  Event,
  ErrorEvent,
  WarnEvent,
  InfoEvent,
  DebugEvent,

  events,
  log
};
