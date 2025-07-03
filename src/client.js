const Client = class {
  // #region Instance
  /** @type {string} */ #id;
  /** @type {WebSocket} */ #socket;

  /** @type {Player} */ #player;

  /**
   * @param {string} id
   * @param {WebSocket} socket
   */
  constructor (id, socket) {
    this.#id = id;
    this.#socket = socket;

    this.#player = null;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {string} */
  get id () { return this.#id; }

  /** @type {WebSocket} */
  get socket () { return this.#socket; }


  /** @type {Player} */
  get player () { return this.#player; }
  set player (player) { this.#player = player; }
  // #endregion

  // #region Instance Derived Properties
  /** @type {Function} */
  get send () { return this.#socket.send; }
  // #endregion
};
export default Client;
