import cookie from "cookie";
import cookieParser from "cookie-parser";
import { TokenBucket } from "@kxirk/adt";
import WebSocket, { WebSocketServer } from "ws";

import settings from "./settings.js";
import { Event, log } from "./events.js";
import time, { convertTime, Priority, IntervalTask, tasks } from "./time.js";
import api from "./api.js";
import auth from "./auth.js";
import audit, { ConnectionViolation, MessageViolation, RateViolation, TokenViolation, violations } from "./audit.js";
import connections from "./connections.js";
import Client from "./client.js";


/**
 * @param {Set.<string>} protocols
 * @param {http.IncomingMessage} request
 * @returns {string} protocol
 */
export const selectProtocol = (protocols, request) => {
  const { socket } = request;

  for (const protocol of protocols) {
    if ( api.protocols.includes(protocol) ) return protocol;
  }

  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  socket.destroy();

  return false;
};

/** @type {WebSocketServer} */
export const server = new WebSocketServer({
  noServer: true,
  handleProtocols: selectProtocol,
  maxPayload: settings.socket.maxPayload
});
export default server;


/**
 * @param {http.IncomingMessage} request
 * @param {net.Socket} socket
 * @param {string} ip
 * @param {string} token
 * @returns {boolean}
 */
export const authenticate = (request, socket, ip, token) => {
  log(new Event("debug", "server", `${ip} AUTH ${token}`));

  const whitelisted = auth.whitelisted(ip);
  if (settings.auth.enforceWhitelist && !whitelisted) {
    socket.end("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();

    return false;
  }

  const blacklisted = (auth.blacklisted(ip) || audit.blacklisted(ip));
  if (blacklisted) {
    socket.end("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();

    return false;
  }

  const whitelistBypass = (settings.auth.alwaysPermitWhitelist && auth.whitelisted(ip));
  const tokenValidate = (settings.socket.validateTokens && auth.validate(token, ip));
  if (!whitelistBypass && !tokenValidate) {
    violations.add(new TokenViolation(ip));

    socket.end("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();

    return false;
  }

  if (!connections.create(ip)) {
    violations.add(new ConnectionViolation(ip));

    socket.end("HTTP/1.1 429 Too Many Requests\r\n\r\n");
    socket.destroy();

    return false;
  }

  return true;
};

/**
 * @param {http.IncomingMessage} request
 * @param {net.Socket} socket
 * @param {Buffer} head
 * @returns {undefined}
 */
export const upgrade = async (request, socket, head) => {
  const ip = request.socket.remoteAddress;
  const cookies = cookie.parse(request.headers.cookie ?? "");
  const cookiesSigned = cookieParser.signedCookies(cookies, settings.auth.tokenSecret);
  const token = cookiesSigned.token;

  log(new Event("debug", "server", `${ip} UPGRADE ${token}`));

  if ( authenticate(request, socket, ip, token) ) {
    server.handleUpgrade(request, socket, head, (ws, req) => {
      server.emit("connection", ws, req, ip, token);
    });
  }
};


/**
 * @param {WebSocket} ws
 * @param {http.IncomingMessage} request
 * @param {string} ip
 * @param {string} token
 * @param {string} event
 * @returns {boolean}
 */
export const verifyMessage = (ws, request, ip, token, event) => {
  if ( audit.blacklisted(ip) ) {
    ws.close(1008, "Forbidden");
    return false;
  }

  if (settings.socket.validateTokens && !auth.validate(token, ip)) {
    violations.add(new TokenViolation(ip));

    ws.close(1008, "Unauthorized");
    return false;
  }

  if ( !ws.rate.next(time.now) ) {
    violations.add(new RateViolation(ip));

    ws.close(1008, "Too Many Messages");
    return false;
  }

  if (api.listenerCount(event) === 0) {
    violations.add(new MessageViolation(ip));

    ws.close(1008, "Invalid API Request");
    return false;
  }

  return true;
};

/**
 * @param {WebSocket} ws
 * @param {http.IncomingMessage} request
 * @param {string} ip
 * @param {string} token
 * @returns {undefined}
 */
export const connect = (ws, request, ip, token) => {
  const client = new Client(token, ws);

  log(new Event("debug", "socket", `${token} CONNECT`));


  /** @type {boolean} */
  ws.connected = false;

  /** @type {number} */
  ws.last = 0;

  /** @type {TokenBucket} */
  ws.rate = new TokenBucket(settings.socket.rateMax, settings.socket.rateWindow, time.now);

  /**
   * @param {string} event
   * @param {...*} data
   * @returns {undefined}
   */
  ws.send = (event, ...data) => {
    log(new Event("debug", "socket", `${token} SEND ${event}`));

    WebSocket.prototype.send.call(ws, JSON.stringify({ event, data }));
  };


  ws.on("open", () => {
    ws.connected = true;
    ws.last = time.now;
  });

  ws.on("pong", (/* data */) => {
    ws.last = time.now;
  });

  ws.on("message", (message) => {
    try {
      const { event, data } = JSON.parse(message.toString());

      log(new Event("debug", "socket", `${token} MESSAGE ${event}`));

      if ( verifyMessage(ws, request, ip, token, event) ) {
        api.emit(event, client, ...data);
      }
    }
    catch (error) {
      ws.emit("error", error);
    }

    auth.extend(token);
  });

  ws.on("error", (error) => {
    log(new Event("debug", "socket", `${token} ERROR ${error.name}: ${error.message}`, { cause: error }));

    violations.add(new MessageViolation(ip));

    if (error.code === "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH") {
      ws.close(1009, "Message Too Big");
      return;
    }

    ws.close(1008, "Policy Violation");
  });

  ws.on("close", (/* code, reason */) => {
    log(new Event("debug", "socket", `${token} CLOSE`));

    ws.connected = false;
    connections.close(ip);
    auth.revoke(token);
  });
};
server.on("connection", connect);

export const heartbeatTask = new IntervalTask(
  "Socket Heartbeat",
  () => {
    const now = time.now;

    for (const ws of server.clients) {
      if (!ws.connected) continue;

      const elapsed = (now - ws.last);
      if (elapsed >= settings.socket.pingTimeout) {
        ws.terminate();
      }
      else {
        ws.last = now;
        ws.ping();
      }
    }
  },
  Priority.server,
  convertTime(settings.socket.pingInterval)
);
tasks.add(heartbeatTask);
