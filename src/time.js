import { PriorityQueue } from "@kxirk/adt";
import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import { time as settings } from "./settings.js";
import { Event, log } from "./events.js";


/** @type {ms} */
export const start = performance.timeOrigin;

/** @type {ms} */
export const rate = settings.tickRate;
/** @type {tick} */
let tick = 0;

/**
 * @param {number} ms
 * @returns {number} tick
 */
export const convertTime = (ms) => (ms / rate).round().clamp(1);

/**
 * @param {number} tick
 * @returns {number} ms
 */
export const convertTick = (tick) => (rate * tick);


/** @enum {number} */
export const Priority = class {
  static next = 0;
  static time = 2;
  static server = 8;
  static game = 32;
  static api = 128;
};

/**
 * @callback Run
 * @param {number} tick
 * @param {number} last
 * @param {number} next
 * @param {number} count
 */
/** @abstract */
export const Task = class {
  /** @type {string} */
  #name;
  /** @type {Run} */
  #callback;
  /** @type {Priority} */
  #priority;

  /** @type {number} */
  #interval;

  /** @type {number} */
  #last;
  /** @type {number} */
  #next;

  /** @type {number} */
  #count;

  /** @type {Task[]} */
  #depends;

  /**
   * @param {string} name
   * @param {Run} callback
   * @param {Priority} priority
   * @param {number} interval
   * @param {number} [start]
   * @param {number} [count]
   */
  constructor (name, callback, priority, interval, start = tick, count = 0) {
    this.#name = name;
    this.#callback = callback;
    this.#priority = priority.clamp(0);

    this.#interval = interval.clamp(1);

    this.#last = null;
    this.#next = null;
    this.start(start.clamp(0));

    this.#count = count.clamp(0);

    this.#depends = [];
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Task}
   */
  static fromJSON (json, reviver) {
    return new Task[json.constructor](json.name, json.callback, json.priority, json.interval, json.last, json.count).fromJSON(json, reviver);
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
  get name () { return this.#name; }

  /** @type {Run} */
  get callback () { return this.#callback; }

  /** @type {Priority} */
  get priority () { return this.#priority; }


  /** @type {number} */
  get interval () { return this.#interval; }


  /** @type {number} */
  get last () { return this.#last; }

  /** @type {number} */
  get next () { return this.#next; }

  /**
   * @param {tick} start
   * @returns {tick} next
   */
  start (start) {
    this.#next = (start + this.interval);

    return this.next;
  }


  /** @type {number} */
  get count () { return this.#count; }

  /**
   * @returns {undefined}
   */
  clear () {
    this.#count = 0;
  }


  /** @type {Task[]} */
  get depends () { return this.#depends; }


  /**
   * @param {tick} tick
   * @returns {tick} next
   */
  run (tick) {
    for (const task of this.depends) if (task.last !== tick) task.run(tick);

    this.#count--;
    this.#next += (this.count > 0 ? this.interval : Infinity);

    this.#callback(tick, this.last, this.next, this.count);
    this.#last = tick;

    return this.next;
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Task}
   */
  fromJSON (json, reviver) {
    this.#name = fromJSON(json, this, "name", reviver?.name);
    this.#callback = fromJSON(json, this, "callback", reviver?.callback);
    this.#priority = fromJSON(json, this, "priority", reviver?.priority);

    this.#interval = fromJSON(json, this, "interval", reviver?.interval);

    this.#last = fromJSON(json, this, "last", reviver?.last);
    this.#next = fromJSON(json, this, "next", reviver?.next);
    this.#count = fromJSON(json, this, "count", reviver?.count);

    fromJSON(json, this, "depends", reviver?.depends);

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
    json.callback = toJSON(this, "callback", replacer?.callback);
    json.priority = toJSON(this, "priority", replacer?.priority);

    json.interval = toJSON(this, "interval", replacer?.interval);

    json.last = toJSON(this, "last", replacer?.last);
    json.next = toJSON(this, "next", replacer?.next);

    json.count = toJSON(this, "count", replacer?.count);

    json.depends = toJSON(this, "depends", replacer?.depends);

    return json;
  }
};

export const TimeoutTask = class extends Task {
  constructor (name, callback, priority, delay, start) {
    super(name, callback, priority, delay, start, 1);
  }
};
Task.TimeoutTask = TimeoutTask;

export const IntervalTask = class extends Task {
  constructor (name, callback, priority, interval, start) {
    super(name, callback, priority, interval, start, Infinity);
  }
};
Task.IntervalTask = IntervalTask;


/** @type {PriorityQueue<Task>} */
export const tasks = new PriorityQueue((a, b) => {
  if (a.next === b.next) {
    if (a.priority === b.priority) return (a.interval < b.interval);
    return (a.priority < b.priority);
  }
  return (a.next < b.next);
});

Object.defineProperty(tasks, "add", {
  /**
   * @param {Task} task
   * @returns {number}
   */
  value (task) {
    return PriorityQueue.prototype.add.call(tasks, task);
  },
  enumerable: false
});

Object.defineProperty(tasks, "fromJSON", {
  /**
   * @param {Object[]} json
   * @param {Function} [reviver]
   * @returns {PriorityQueue<Task>}
   */
  value (json, reviver) {
    tasks.clear();

    tasks.add(...fromJSON(json, [], undefined, (reviver ?? { value: Task.fromJSON })));

    return tasks;
  },
  enumerable: false
});

Object.defineProperty(tasks, "toJSON", {
  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object[]}
   */
  value (key, replacer) {
    const json = toJSON([...tasks], undefined, replacer);

    return json;
  },
  enumerable: false
});

/** @type {ms} */
let last = 0;

/**
 * @param {ms} now
 * @returns {TimeoutTask}
 */
export const run = (now) => {
  last = now;

  const real = performance.timeOrigin + performance.now();
  const drift = real - now;
  const tickDrift = drift / rate;
  if (Math.abs(tickDrift) >= settings.tickDriftThreshold) {
    log(new Event("warn", "time", `Ran ${tickDrift.round()} ticks behind expected`));

    now = real;
  }

  while (tasks.next?.next === tick) {
    const task = tasks.remove();

    if (task.count > 0) {
      if (task instanceof TimeoutTask) log(new Event("debug", "task", `Running task ${task.name}`));
      task.run(tick);

      tasks.add(task);
    }
  }
  tick++;

  return setTimeout(run, (rate - drift), (now + rate));
};


export default {
  start,
  get elapsed () { return performance.now(); },
  get now () { return start + this.elapsed; },
  rate,
  get tick () { return tick; },
  convertTime,
  convertTick,

  Priority,
  Task,
  TimeoutTask,
  IntervalTask,

  tasks,
  get last () { return last; },
  get drift () { return this.now - last; },
  run
};
