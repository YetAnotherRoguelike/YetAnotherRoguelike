import { EventEmitter } from "events";


/** @type {WeakMap.<Player, EventEmitter>} */
const players = new WeakMap();
export default players;

Object.defineProperty(players, "add", {
  /**
   * @param {Player} player
   * @returns {EventEmitter}
   */
  value (player) {
    if ( !players.has(player) ) players.set(player, new EventEmitter());

    return players.get(player);
  },
  enumerable: false
});
