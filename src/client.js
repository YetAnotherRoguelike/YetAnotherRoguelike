const Client = class {
  /** @type {string} */
  #id;
  /** @type {WebSocket} */
  #socket;

  /** @type {Player} */
  #player;

  /**
   * @param {string} id
   * @param {WebSocket} socket
   */
  constructor (id, socket) {
    this.#id = id;
    this.#socket = socket;

    this.player = null;
  }


  /** @type {string} */
  get id () { return this.#id; }

  /** @type {WebSocket} */
  get socket () { return this.#socket; }
  /** @type {Function} */
  get send () { return this.#socket.send; }


  /** @type {Player} */
  get player () { return this.#player; }
  set player (player) { this.#player = player; }
};
export default Client;
