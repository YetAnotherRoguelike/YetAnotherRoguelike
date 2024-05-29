import express from "express";
import cookieParser from "cookie-parser";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";

import settings from "./settings.js";
import { Event, log } from "./events.js";
import auth from "./auth.js";
import audit, { CredentialViolation, PathViolation, violations } from "./audit.js";


/** @type {string} */
export const root = fileURLToPath(new URL("client/", import.meta.url));

/** @type {Express} */
const app = express();
export default app;

app.set("x-powered-by", false);
app.set("case sensitive routing", true);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(settings.auth.tokenSecret));


/** @type {Set.<string>} */
export const sharedAssets = new Set([
  "/assets/css/theme.css", "/assets/css/main.css",
  "/assets/font/sharetechmono.ttf", "/assets/font/cursor.cur",
  "/config.js"
]);

/**
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 * @param {Function} next
 * @returns {undefined}
 */
export const any = (request, response, next) => {
  const ip = request.socket.remoteAddress;
  const { method, path } = request;

  const whitelisted = auth.whitelisted(ip);
  if (settings.enforceWhitelist && !whitelisted) {
    response.sendStatus(403);
    return;
  }

  const blacklisted = (auth.blacklisted(ip) || audit.blacklisted(ip));
  if (blacklisted) {
    response.sendStatus(403);
    return;
  }

  log(new Event("debug", "server", `${ip} ${method} ${path}`));

  next();
};
app.use(any);


/** @type {Set.<string>} */
export const loginAssets = new Set([
  ...sharedAssets,
  "/login",
  "/assets/css/login.css",
  "/login.js"
]);

/**
 * @param {string} ip
 * @param {string} password
 * @param {http.ServerResponse} response
 * @param {boolean} [report]
 * @returns {boolean}
 */
export const checkPassword = (ip, password, response, report = false) => {
  if (auth.login(password)) return true;

  if (report && !response.locals.audited) {
    violations.add(new CredentialViolation(ip));
    response.locals.audited = true;
  }

  if (!response.locals.wiped) {
    response.clearCookie("password");
    response.locals.wiped = true;
  }

  return false;
};

/**
 * @param {string} ip
 * @param {http.ServerResponse} response
 * @returns {undefined}
 */
export const setToken = (ip, response) => {
  const token = auth.create(ip);
  response.cookie("token", token, {
    httpOnly: true,
    maxAge: settings.tokenDuration,
    secure: true,
    signed: true,
    sameSite: "Strict"
  });

  log(new Event("debug", "server", `${ip} TOKEN ${token}`));
};

/**
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 * @returns {undefined}
 */
export const login = (request, response) => {
  const ip = request.socket.remoteAddress;

  const password = (request.body.password ?? "");
  if (!checkPassword(ip, password, response, true)) {
    response.redirect("/login#invalid");
    return;
  }

  setToken(ip, response);
  response.redirect("/");
};
app.post("/login", login);


/** @type {string[]} */
export const apiFiles = [...readdirSync(new URL("client/api/", import.meta.url))];

/** @type {Set.<string>} */
export const apiAssets = new Set([...apiFiles.map((file) => `/api/${file}`)]);

/**
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 * @returns {undefined}
 */
export const api = (request, response) => {
  response.setHeader("Content-Type", "application/json");
  response.json(apiFiles);
};
app.get("/api.json", api);


/** @type {Set.<string>} */
export const indexAssets = new Set([
  ...sharedAssets,
  "/",
  "/assets/css/index.css",
  "/server.js", "/hooks.js", "/sprites.js", "/depth.js", "/io.js", "/commands.js", "/binds.js", "/player.js",
  "/api.js", "/api.json", ...apiAssets
]);

/**
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 * @param {Function} next
 * @returns {undefined}
 */
export const get = (request, response, next) => {
  const ip = request.socket.remoteAddress;
  const { path } = request;

  if (!(indexAssets.has(path) || loginAssets.has(path))) {
    violations.add(new PathViolation(ip));

    response.redirect("/");
    return;
  }

  const token = (request.signedCookies.token ? request.signedCookies.token : "");
  const password = (request.cookies.password ?? "");
  if (!auth.validate(token, ip)) {
    if (
      (settings.alwaysPermitWhitelist && auth.whitelisted(ip))
      || !settings.enforceServerPassword
      || (settings.enforceServerPassword && checkPassword(ip, password, response, (password !== "")))
    ) {
      setToken(ip, response);

      response.redirect("/");
      return;
    }
    if (!loginAssets.has(path)) {
      response.redirect("/login");
      return;
    }
  }
  auth.extend(token);

  next();
};
app.use(get);


app.use(express.static(root, { extensions: ["html"] }));
