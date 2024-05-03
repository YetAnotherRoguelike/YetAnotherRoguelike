const Level = class {
  /** @type {number} */
  #depthCount;

  /** @type {number} */
  #widthMin;
  /** @type {number} */
  #widthMax;
  /** @type {number} */
  #heightMin;
  /** @type {number} */
  #heightMax;

  constructor () {
    this.depthCount = 0;

    this.widthMin = 0;
    this.widthMax = Infinity;
    this.heightMin = 0;
    this.heightMax = Infinity;
  }

  /**
   * @param {Object} json
   * @returns {Level}
   */
  static fromJSON (json) {
    return new Level().fromJSON(json);
  }


  /** @type {number} */
  get depthCount () { return this.#depthCount; }
  set depthCount (count) {
    this.#depthCount = count.clamp(0);
  }


  /** @type {number} */
  get widthMin () { return this.#widthMin; }
  set widthMin (min) {
    this.#widthMin = min.clamp(0);
  }

  /** @type {number} */
  get widthMax () { return this.#widthMax; }
  set widthMax (max) {
    this.#widthMax = max.clamp(this.widthMin);
  }

  /** @type {number} */
  get heightMin () { return this.#heightMin; }
  set heightMin (min) {
    this.#heightMin = min.clamp(0);
  }

  /** @type {number} */
  get heightMax () { return this.#heightMax; }
  set heightMax (max) {
    this.#heightMax = max.clamp(this.heightMin);
  }


  /**
   * @param {Object} json
   * @returns {Level}
   */
  fromJSON (json) {
    this.depthCount = json.depthCount;

    this.widthMin = json.widthMin;
    this.widthMax = json.widthMax;
    this.heightMin = json.heightMin;
    this.heightMax = json.heightMax;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      depthCount: this.depthCount,

      widthMin: this.widthMin,
      widthMax: this.widthMax,
      heightMin: this.heightMin,
      heightMax: this.heightMax
    };
  }
};
export default Level;
