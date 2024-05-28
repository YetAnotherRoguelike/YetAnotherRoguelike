import { EOL } from "os";
import readline from "readline";
import util from "util";
import vm from "vm";

import { Event, log } from "./events.js";
import server, { settings, events, time, api, auth, audit, connections, socket, app } from "./index.js";


/** @type {ReadStream} */
const inputStream = process.stdin;
/** @type {WriteStream} */
const outputStream = process.stdout;
/** @type {WriteStream} */
const errorStream = process.stderr;

/** @type {string} */
const prompt = "> ";
/** @type {string} */
const success = "+ ";
/** @type {string} */
const failure = "- ";

/** @type {readline.Interface} */
const io = readline.createInterface({
  input: inputStream,
  output: outputStream,

  terminal: true,
  prompt
});


/** @type {number} */
let pos = io.getPrompt().length;

/**
 * @returns {boolean}
 */
const clearLine = () => {
  const cursorPos = io.getCursorPos().cols;
  const defaultLength = io.getPrompt().length;
  if (cursorPos > defaultLength) pos = cursorPos;

  readline.clearLine(outputStream, 0);
  return readline.cursorTo(outputStream, 0);
};

/**
 * @returns {boolean}
 */
const resetLine = () => {
  io.prompt();

  return readline.cursorTo(outputStream, pos);
};


const context = { settings, events, time, api, auth, audit, connections, socket, app, server };
vm.createContext(context, { name: "shell" });

/**
 * @param {string} code
 * @returns {undefined}
 */
const execute = (code) => {
  log(new Event("debug", "shell", `Executing \`${code}\``), (stream) => !(stream.console));

  try {
    const result = vm.runInContext(code, context, {
      displayErrors: false,
      timeout: 5000
    });

    outputStream.write(success + util.format(util.inspect(result, {
      breakLength: Infinity,
      colors: true,
      compact: false,
      depth: 3,
      maxArrayLength: Infinity,
      maxStringLength: Infinity
    })) + EOL);
  }
  catch (error) {
    errorStream.write(failure + util.format(`${error.name}: ${error.message}`) + EOL);
  }
};

io.on("line", (line) => {
  execute(line);
  io.prompt();
});
io.prompt();

outputStream.on("reset", clearLine);
outputStream.on("write", resetLine);


log(new Event("info", "shell", "Attached"));
