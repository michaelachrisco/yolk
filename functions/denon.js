// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register(
  "https://deno.land/std@0.52.0/log/levels",
  [],
  function (exports_1, context_1) {
    "use strict";
    var LogLevels, LogLevelNames, byLevel;
    var __moduleName = context_1 && context_1.id;
    /** Returns the numeric log level associated with the passed,
     * stringy log level name.
     */
    function getLevelByName(name) {
      switch (name) {
        case "NOTSET":
          return LogLevels.NOTSET;
        case "DEBUG":
          return LogLevels.DEBUG;
        case "INFO":
          return LogLevels.INFO;
        case "WARNING":
          return LogLevels.WARNING;
        case "ERROR":
          return LogLevels.ERROR;
        case "CRITICAL":
          return LogLevels.CRITICAL;
        default:
          throw new Error(`no log level found for "${name}"`);
      }
    }
    exports_1("getLevelByName", getLevelByName);
    /** Returns the stringy log level name provided the numeric log level */
    function getLevelName(level) {
      const levelName = byLevel[level];
      if (levelName) {
        return levelName;
      }
      throw new Error(`no level name found for level: ${level}`);
    }
    exports_1("getLevelName", getLevelName);
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        /** Get log level numeric values through enum constants
             */
        (function (LogLevels) {
          LogLevels[LogLevels["NOTSET"] = 0] = "NOTSET";
          LogLevels[LogLevels["DEBUG"] = 10] = "DEBUG";
          LogLevels[LogLevels["INFO"] = 20] = "INFO";
          LogLevels[LogLevels["WARNING"] = 30] = "WARNING";
          LogLevels[LogLevels["ERROR"] = 40] = "ERROR";
          LogLevels[LogLevels["CRITICAL"] = 50] = "CRITICAL";
        })(LogLevels || (LogLevels = {}));
        exports_1("LogLevels", LogLevels);
        /** Permitted log level names */
        exports_1(
          "LogLevelNames",
          LogLevelNames = Object.keys(LogLevels).filter((key) =>
            isNaN(Number(key))
          ),
        );
        byLevel = {
          [String(LogLevels.NOTSET)]: "NOTSET",
          [String(LogLevels.DEBUG)]: "DEBUG",
          [String(LogLevels.INFO)]: "INFO",
          [String(LogLevels.WARNING)]: "WARNING",
          [String(LogLevels.ERROR)]: "ERROR",
          [String(LogLevels.CRITICAL)]: "CRITICAL",
        };
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fmt/colors",
  [],
  function (exports_2, context_2) {
    "use strict";
    var noColor, enabled, ANSI_PATTERN;
    var __moduleName = context_2 && context_2.id;
    function setColorEnabled(value) {
      if (noColor) {
        return;
      }
      enabled = value;
    }
    exports_2("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
      return enabled;
    }
    exports_2("getColorEnabled", getColorEnabled);
    function code(open, close) {
      return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
      };
    }
    function run(str, code) {
      return enabled
        ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
        : str;
    }
    function reset(str) {
      return run(str, code([0], 0));
    }
    exports_2("reset", reset);
    function bold(str) {
      return run(str, code([1], 22));
    }
    exports_2("bold", bold);
    function dim(str) {
      return run(str, code([2], 22));
    }
    exports_2("dim", dim);
    function italic(str) {
      return run(str, code([3], 23));
    }
    exports_2("italic", italic);
    function underline(str) {
      return run(str, code([4], 24));
    }
    exports_2("underline", underline);
    function inverse(str) {
      return run(str, code([7], 27));
    }
    exports_2("inverse", inverse);
    function hidden(str) {
      return run(str, code([8], 28));
    }
    exports_2("hidden", hidden);
    function strikethrough(str) {
      return run(str, code([9], 29));
    }
    exports_2("strikethrough", strikethrough);
    function black(str) {
      return run(str, code([30], 39));
    }
    exports_2("black", black);
    function red(str) {
      return run(str, code([31], 39));
    }
    exports_2("red", red);
    function green(str) {
      return run(str, code([32], 39));
    }
    exports_2("green", green);
    function yellow(str) {
      return run(str, code([33], 39));
    }
    exports_2("yellow", yellow);
    function blue(str) {
      return run(str, code([34], 39));
    }
    exports_2("blue", blue);
    function magenta(str) {
      return run(str, code([35], 39));
    }
    exports_2("magenta", magenta);
    function cyan(str) {
      return run(str, code([36], 39));
    }
    exports_2("cyan", cyan);
    function white(str) {
      return run(str, code([37], 39));
    }
    exports_2("white", white);
    function gray(str) {
      return run(str, code([90], 39));
    }
    exports_2("gray", gray);
    function bgBlack(str) {
      return run(str, code([40], 49));
    }
    exports_2("bgBlack", bgBlack);
    function bgRed(str) {
      return run(str, code([41], 49));
    }
    exports_2("bgRed", bgRed);
    function bgGreen(str) {
      return run(str, code([42], 49));
    }
    exports_2("bgGreen", bgGreen);
    function bgYellow(str) {
      return run(str, code([43], 49));
    }
    exports_2("bgYellow", bgYellow);
    function bgBlue(str) {
      return run(str, code([44], 49));
    }
    exports_2("bgBlue", bgBlue);
    function bgMagenta(str) {
      return run(str, code([45], 49));
    }
    exports_2("bgMagenta", bgMagenta);
    function bgCyan(str) {
      return run(str, code([46], 49));
    }
    exports_2("bgCyan", bgCyan);
    function bgWhite(str) {
      return run(str, code([47], 49));
    }
    exports_2("bgWhite", bgWhite);
    /* Special Color Sequences */
    function clampAndTruncate(n, max = 255, min = 0) {
      return Math.trunc(Math.max(Math.min(n, max), min));
    }
    /** Set text color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function rgb8(str, color) {
      return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports_2("rgb8", rgb8);
    /** Set background color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function bgRgb8(str, color) {
      return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports_2("bgRgb8", bgRgb8);
    /** Set text color using 24bit rgb.
     * `color` can be a number in range `0x000000` to `0xffffff` or
     * an `Rgb`.
     *
     * To produce the color magenta:
     *
     *      rgba24("foo", 0xff00ff);
     *      rgba24("foo", {r: 255, g: 0, b: 255});
     */
    function rgb24(str, color) {
      if (typeof color === "number") {
        return run(
          str,
          code(
            [38, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff],
            39,
          ),
        );
      }
      return run(
        str,
        code([
          38,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 39),
      );
    }
    exports_2("rgb24", rgb24);
    /** Set background color using 24bit rgb.
     * `color` can be a number in range `0x000000` to `0xffffff` or
     * an `Rgb`.
     *
     * To produce the color magenta:
     *
     *      bgRgba24("foo", 0xff00ff);
     *      bgRgba24("foo", {r: 255, g: 0, b: 255});
     */
    function bgRgb24(str, color) {
      if (typeof color === "number") {
        return run(
          str,
          code(
            [48, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff],
            49,
          ),
        );
      }
      return run(
        str,
        code([
          48,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 49),
      );
    }
    exports_2("bgRgb24", bgRgb24);
    function stripColor(string) {
      return string.replace(ANSI_PATTERN, "");
    }
    exports_2("stripColor", stripColor);
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        /**
             * A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
             * on npm.
             *
             * ```
             * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
             * console.log(bgBlue(red(bold("Hello world!"))));
             * ```
             *
             * This module supports `NO_COLOR` environmental variable disabling any coloring
             * if `NO_COLOR` is set.
             */
        noColor = Deno.noColor;
        enabled = !noColor;
        // https://github.com/chalk/ansi-regex/blob/2b56fb0c7a07108e5b54241e8faec160d393aedb/index.js
        ANSI_PATTERN = new RegExp(
          [
            "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
            "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
          ].join("|"),
          "g",
        );
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/exists",
  [],
  function (exports_3, context_3) {
    "use strict";
    var lstat, lstatSync;
    var __moduleName = context_3 && context_3.id;
    /**
     * Test whether or not the given path exists by checking with the file system
     */
    async function exists(filePath) {
      try {
        await lstat(filePath);
        return true;
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          return false;
        }
        throw err;
      }
    }
    exports_3("exists", exists);
    /**
     * Test whether or not the given path exists by checking with the file system
     */
    function existsSync(filePath) {
      try {
        lstatSync(filePath);
        return true;
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          return false;
        }
        throw err;
      }
    }
    exports_3("existsSync", existsSync);
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        lstat = Deno.lstat, lstatSync = Deno.lstatSync;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/log/handlers",
  [
    "https://deno.land/std@0.52.0/log/levels",
    "https://deno.land/std@0.52.0/fmt/colors",
    "https://deno.land/std@0.52.0/fs/exists",
  ],
  function (exports_4, context_4) {
    "use strict";
    var open,
      openSync,
      close,
      renameSync,
      statSync,
      levels_ts_1,
      colors_ts_1,
      exists_ts_1,
      DEFAULT_FORMATTER,
      BaseHandler,
      ConsoleHandler,
      WriterHandler,
      FileHandler,
      RotatingFileHandler;
    var __moduleName = context_4 && context_4.id;
    return {
      setters: [
        function (levels_ts_1_1) {
          levels_ts_1 = levels_ts_1_1;
        },
        function (colors_ts_1_1) {
          colors_ts_1 = colors_ts_1_1;
        },
        function (exists_ts_1_1) {
          exists_ts_1 = exists_ts_1_1;
        },
      ],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        open = Deno.open,
          openSync = Deno.openSync,
          close = Deno.close,
          renameSync = Deno.renameSync,
          statSync = Deno.statSync;
        DEFAULT_FORMATTER = "{levelName} {msg}";
        BaseHandler = class BaseHandler {
          constructor(levelName, options = {}) {
            this.level = levels_ts_1.getLevelByName(levelName);
            this.levelName = levelName;
            this.formatter = options.formatter || DEFAULT_FORMATTER;
          }
          handle(logRecord) {
            if (this.level > logRecord.level) {
              return;
            }
            const msg = this.format(logRecord);
            return this.log(msg);
          }
          format(logRecord) {
            if (this.formatter instanceof Function) {
              return this.formatter(logRecord);
            }
            return this.formatter.replace(/{(\S+)}/g, (match, p1) => {
              const value = logRecord[p1];
              // do not interpolate missing values
              if (!value) {
                return match;
              }
              return String(value);
            });
          }
          log(_msg) {}
          async setup() {}
          async destroy() {}
        };
        exports_4("BaseHandler", BaseHandler);
        ConsoleHandler = class ConsoleHandler extends BaseHandler {
          format(logRecord) {
            let msg = super.format(logRecord);
            switch (logRecord.level) {
              case levels_ts_1.LogLevels.INFO:
                msg = colors_ts_1.blue(msg);
                break;
              case levels_ts_1.LogLevels.WARNING:
                msg = colors_ts_1.yellow(msg);
                break;
              case levels_ts_1.LogLevels.ERROR:
                msg = colors_ts_1.red(msg);
                break;
              case levels_ts_1.LogLevels.CRITICAL:
                msg = colors_ts_1.bold(colors_ts_1.red(msg));
                break;
              default:
                break;
            }
            return msg;
          }
          log(msg) {
            console.log(msg);
          }
        };
        exports_4("ConsoleHandler", ConsoleHandler);
        WriterHandler = class WriterHandler extends BaseHandler {
          constructor() {
            super(...arguments);
            this.#encoder = new TextEncoder();
          }
          #encoder;
        };
        exports_4("WriterHandler", WriterHandler);
        FileHandler = class FileHandler extends WriterHandler {
          constructor(levelName, options) {
            super(levelName, options);
            this.#encoder = new TextEncoder();
            this._filename = options.filename;
            // default to append mode, write only
            this._mode = options.mode ? options.mode : "a";
            this._openOptions = {
              createNew: this._mode === "x",
              create: this._mode !== "x",
              append: this._mode === "a",
              truncate: this._mode !== "a",
              write: true,
            };
          }
          #encoder;
          async setup() {
            this._file = await open(this._filename, this._openOptions);
            this._writer = this._file;
          }
          log(msg) {
            Deno.writeSync(this._file.rid, this.#encoder.encode(msg + "\n"));
          }
          destroy() {
            this._file.close();
            return Promise.resolve();
          }
        };
        exports_4("FileHandler", FileHandler);
        RotatingFileHandler = class RotatingFileHandler extends FileHandler {
          constructor(levelName, options) {
            super(levelName, options);
            this.#maxBytes = options.maxBytes;
            this.#maxBackupCount = options.maxBackupCount;
          }
          #maxBytes;
          #maxBackupCount;
          async setup() {
            if (this.#maxBytes < 1) {
              throw new Error("maxBytes cannot be less than 1");
            }
            if (this.#maxBackupCount < 1) {
              throw new Error("maxBackupCount cannot be less than 1");
            }
            await super.setup();
            if (this._mode === "w") {
              // Remove old backups too as it doesn't make sense to start with a clean
              // log file, but old backups
              for (let i = 1; i <= this.#maxBackupCount; i++) {
                if (await exists_ts_1.exists(this._filename + "." + i)) {
                  await Deno.remove(this._filename + "." + i);
                }
              }
            } else if (this._mode === "x") {
              // Throw if any backups also exist
              for (let i = 1; i <= this.#maxBackupCount; i++) {
                if (await exists_ts_1.exists(this._filename + "." + i)) {
                  Deno.close(this._file.rid);
                  throw new Deno.errors.AlreadyExists(
                    "Backup log file " + this._filename + "." + i +
                      " already exists",
                  );
                }
              }
            }
          }
          handle(logRecord) {
            if (this.level > logRecord.level) {
              return;
            }
            const msg = this.format(logRecord);
            const currentFileSize = statSync(this._filename).size;
            if (currentFileSize + msg.length > this.#maxBytes) {
              this.rotateLogFiles();
            }
            return this.log(msg);
          }
          rotateLogFiles() {
            close(this._file.rid);
            for (let i = this.#maxBackupCount - 1; i >= 0; i--) {
              const source = this._filename + (i === 0 ? "" : "." + i);
              const dest = this._filename + "." + (i + 1);
              if (exists_ts_1.existsSync(source)) {
                renameSync(source, dest);
              }
            }
            this._file = openSync(this._filename, this._openOptions);
            this._writer = this._file;
          }
        };
        exports_4("RotatingFileHandler", RotatingFileHandler);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/log/logger",
  ["https://deno.land/std@0.52.0/log/levels"],
  function (exports_5, context_5) {
    "use strict";
    var levels_ts_2, LogRecord, Logger;
    var __moduleName = context_5 && context_5.id;
    return {
      setters: [
        function (levels_ts_2_1) {
          levels_ts_2 = levels_ts_2_1;
        },
      ],
      execute: function () {
        LogRecord = class LogRecord {
          constructor(msg, args, level) {
            this.msg = msg;
            this.#args = [...args];
            this.level = level;
            this.#datetime = new Date();
            this.levelName = levels_ts_2.getLevelName(level);
          }
          #args;
          #datetime;
          get args() {
            return [...this.#args];
          }
          get datetime() {
            return new Date(this.#datetime.getTime());
          }
        };
        exports_5("LogRecord", LogRecord);
        Logger = class Logger {
          constructor(levelName, handlers) {
            this.level = levels_ts_2.getLevelByName(levelName);
            this.levelName = levelName;
            this.handlers = handlers || [];
          }
          _log(level, msg, ...args) {
            if (this.level > level) {
              return;
            }
            const record = new LogRecord(msg, args, level);
            this.handlers.forEach((handler) => {
              handler.handle(record);
            });
          }
          debug(msg, ...args) {
            this._log(levels_ts_2.LogLevels.DEBUG, msg, ...args);
          }
          info(msg, ...args) {
            this._log(levels_ts_2.LogLevels.INFO, msg, ...args);
          }
          warning(msg, ...args) {
            this._log(levels_ts_2.LogLevels.WARNING, msg, ...args);
          }
          error(msg, ...args) {
            this._log(levels_ts_2.LogLevels.ERROR, msg, ...args);
          }
          critical(msg, ...args) {
            this._log(levels_ts_2.LogLevels.CRITICAL, msg, ...args);
          }
        };
        exports_5("Logger", Logger);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/testing/diff",
  [],
  function (exports_6, context_6) {
    "use strict";
    var DiffType, REMOVED, COMMON, ADDED;
    var __moduleName = context_6 && context_6.id;
    function createCommon(A, B, reverse) {
      const common = [];
      if (A.length === 0 || B.length === 0) {
        return [];
      }
      for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
        if (
          A[reverse ? A.length - i - 1 : i] ===
            B[reverse ? B.length - i - 1 : i]
        ) {
          common.push(A[reverse ? A.length - i - 1 : i]);
        } else {
          return common;
        }
      }
      return common;
    }
    function diff(A, B) {
      const prefixCommon = createCommon(A, B);
      const suffixCommon = createCommon(
        A.slice(prefixCommon.length),
        B.slice(prefixCommon.length),
        true,
      ).reverse();
      A = suffixCommon.length
        ? A.slice(prefixCommon.length, -suffixCommon.length)
        : A.slice(prefixCommon.length);
      B = suffixCommon.length
        ? B.slice(prefixCommon.length, -suffixCommon.length)
        : B.slice(prefixCommon.length);
      const swapped = B.length > A.length;
      [A, B] = swapped ? [B, A] : [A, B];
      const M = A.length;
      const N = B.length;
      if (!M && !N && !suffixCommon.length && !prefixCommon.length) {
        return [];
      }
      if (!N) {
        return [
          ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
          ...A.map((a) => ({
            type: swapped ? DiffType.added : DiffType.removed,
            value: a,
          })),
          ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ];
      }
      const offset = N;
      const delta = M - N;
      const size = M + N + 1;
      const fp = new Array(size).fill({ y: -1 });
      /**
         * INFO:
         * This buffer is used to save memory and improve performance.
         * The first half is used to save route and last half is used to save diff
         * type.
         * This is because, when I kept new uint8array area to save type,performance
         * worsened.
         */
      const routes = new Uint32Array((M * N + size + 1) * 2);
      const diffTypesPtrOffset = routes.length / 2;
      let ptr = 0;
      let p = -1;
      function backTrace(A, B, current, swapped) {
        const M = A.length;
        const N = B.length;
        const result = [];
        let a = M - 1;
        let b = N - 1;
        let j = routes[current.id];
        let type = routes[current.id + diffTypesPtrOffset];
        while (true) {
          if (!j && !type) {
            break;
          }
          const prev = j;
          if (type === REMOVED) {
            result.unshift({
              type: swapped ? DiffType.removed : DiffType.added,
              value: B[b],
            });
            b -= 1;
          } else if (type === ADDED) {
            result.unshift({
              type: swapped ? DiffType.added : DiffType.removed,
              value: A[a],
            });
            a -= 1;
          } else {
            result.unshift({ type: DiffType.common, value: A[a] });
            a -= 1;
            b -= 1;
          }
          j = routes[prev];
          type = routes[prev + diffTypesPtrOffset];
        }
        return result;
      }
      function createFP(slide, down, k, M) {
        if (slide && slide.y === -1 && down && down.y === -1) {
          return { y: 0, id: 0 };
        }
        if (
          (down && down.y === -1) ||
          k === M ||
          (slide && slide.y) > (down && down.y) + 1
        ) {
          const prev = slide.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = ADDED;
          return { y: slide.y, id: ptr };
        } else {
          const prev = down.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = REMOVED;
          return { y: down.y + 1, id: ptr };
        }
      }
      function snake(k, slide, down, _offset, A, B) {
        const M = A.length;
        const N = B.length;
        if (k < -N || M < k) {
          return { y: -1, id: -1 };
        }
        const fp = createFP(slide, down, k, M);
        while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
          const prev = fp.id;
          ptr++;
          fp.id = ptr;
          fp.y += 1;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = COMMON;
        }
        return fp;
      }
      while (fp[delta + offset].y < N) {
        p = p + 1;
        for (let k = -p; k < delta; ++k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        for (let k = delta + p; k > delta; --k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        fp[delta + offset] = snake(
          delta,
          fp[delta - 1 + offset],
          fp[delta + 1 + offset],
          offset,
          A,
          B,
        );
      }
      return [
        ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ...backTrace(A, B, fp[delta + offset], swapped),
        ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
      ];
    }
    exports_6("default", diff);
    return {
      setters: [],
      execute: function () {
        (function (DiffType) {
          DiffType["removed"] = "removed";
          DiffType["common"] = "common";
          DiffType["added"] = "added";
        })(DiffType || (DiffType = {}));
        exports_6("DiffType", DiffType);
        REMOVED = 1;
        COMMON = 2;
        ADDED = 3;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/testing/asserts",
  [
    "https://deno.land/std@0.52.0/fmt/colors",
    "https://deno.land/std@0.52.0/testing/diff",
  ],
  function (exports_7, context_7) {
    "use strict";
    var colors_ts_2, diff_ts_1, CAN_NOT_DISPLAY, AssertionError;
    var __moduleName = context_7 && context_7.id;
    function format(v) {
      let string = Deno.inspect(v);
      if (typeof v == "string") {
        string = `"${string.replace(/(?=["\\])/g, "\\")}"`;
      }
      return string;
    }
    function createColor(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return (s) => colors_ts_2.green(colors_ts_2.bold(s));
        case diff_ts_1.DiffType.removed:
          return (s) => colors_ts_2.red(colors_ts_2.bold(s));
        default:
          return colors_ts_2.white;
      }
    }
    function createSign(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return "+   ";
        case diff_ts_1.DiffType.removed:
          return "-   ";
        default:
          return "    ";
      }
    }
    function buildMessage(diffResult) {
      const messages = [];
      messages.push("");
      messages.push("");
      messages.push(
        `    ${colors_ts_2.gray(colors_ts_2.bold("[Diff]"))} ${
          colors_ts_2.red(colors_ts_2.bold("Actual"))
        } / ${colors_ts_2.green(colors_ts_2.bold("Expected"))}`,
      );
      messages.push("");
      messages.push("");
      diffResult.forEach((result) => {
        const c = createColor(result.type);
        messages.push(c(`${createSign(result.type)}${result.value}`));
      });
      messages.push("");
      return messages;
    }
    function isKeyedCollection(x) {
      return [Symbol.iterator, "size"].every((k) => k in x);
    }
    function equal(c, d) {
      const seen = new Map();
      return (function compare(a, b) {
        // Have to render RegExp & Date for string comparison
        // unless it's mistreated as object
        if (
          a &&
          b &&
          ((a instanceof RegExp && b instanceof RegExp) ||
            (a instanceof Date && b instanceof Date))
        ) {
          return String(a) === String(b);
        }
        if (Object.is(a, b)) {
          return true;
        }
        if (a && typeof a === "object" && b && typeof b === "object") {
          if (seen.get(a) === b) {
            return true;
          }
          if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
            return false;
          }
          if (isKeyedCollection(a) && isKeyedCollection(b)) {
            if (a.size !== b.size) {
              return false;
            }
            let unmatchedEntries = a.size;
            for (const [aKey, aValue] of a.entries()) {
              for (const [bKey, bValue] of b.entries()) {
                /* Given that Map keys can be references, we need
                             * to ensure that they are also deeply equal */
                if (
                  (aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                  (compare(aKey, bKey) && compare(aValue, bValue))
                ) {
                  unmatchedEntries--;
                }
              }
            }
            return unmatchedEntries === 0;
          }
          const merged = { ...a, ...b };
          for (const key in merged) {
            if (!compare(a && a[key], b && b[key])) {
              return false;
            }
          }
          seen.set(a, b);
          return true;
        }
        return false;
      })(c, d);
    }
    exports_7("equal", equal);
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
      if (!expr) {
        throw new AssertionError(msg);
      }
    }
    exports_7("assert", assert);
    /**
     * Make an assertion that `actual` and `expected` are equal, deeply. If not
     * deeply equal, then throw.
     */
    function assertEquals(actual, expected, msg) {
      if (equal(actual, expected)) {
        return;
      }
      let message = "";
      const actualString = format(actual);
      const expectedString = format(expected);
      try {
        const diffResult = diff_ts_1.default(
          actualString.split("\n"),
          expectedString.split("\n"),
        );
        const diffMsg = buildMessage(diffResult).join("\n");
        message = `Values are not equal:\n${diffMsg}`;
      } catch (e) {
        message = `\n${colors_ts_2.red(CAN_NOT_DISPLAY)} + \n\n`;
      }
      if (msg) {
        message = msg;
      }
      throw new AssertionError(message);
    }
    exports_7("assertEquals", assertEquals);
    /**
     * Make an assertion that `actual` and `expected` are not equal, deeply.
     * If not then throw.
     */
    function assertNotEquals(actual, expected, msg) {
      if (!equal(actual, expected)) {
        return;
      }
      let actualString;
      let expectedString;
      try {
        actualString = String(actual);
      } catch (e) {
        actualString = "[Cannot display]";
      }
      try {
        expectedString = String(expected);
      } catch (e) {
        expectedString = "[Cannot display]";
      }
      if (!msg) {
        msg = `actual: ${actualString} expected: ${expectedString}`;
      }
      throw new AssertionError(msg);
    }
    exports_7("assertNotEquals", assertNotEquals);
    /**
     * Make an assertion that `actual` and `expected` are strictly equal.  If
     * not then throw.
     */
    function assertStrictEq(actual, expected, msg) {
      if (actual === expected) {
        return;
      }
      let message;
      if (msg) {
        message = msg;
      } else {
        const actualString = format(actual);
        const expectedString = format(expected);
        if (actualString === expectedString) {
          const withOffset = actualString
            .split("\n")
            .map((l) => `     ${l}`)
            .join("\n");
          message =
            `Values have the same structure but are not reference-equal:\n\n${
              colors_ts_2.red(withOffset)
            }\n`;
        } else {
          try {
            const diffResult = diff_ts_1.default(
              actualString.split("\n"),
              expectedString.split("\n"),
            );
            const diffMsg = buildMessage(diffResult).join("\n");
            message = `Values are not strictly equal:\n${diffMsg}`;
          } catch (e) {
            message = `\n${colors_ts_2.red(CAN_NOT_DISPLAY)} + \n\n`;
          }
        }
      }
      throw new AssertionError(message);
    }
    exports_7("assertStrictEq", assertStrictEq);
    /**
     * Make an assertion that actual contains expected. If not
     * then thrown.
     */
    function assertStrContains(actual, expected, msg) {
      if (!actual.includes(expected)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to contains: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_7("assertStrContains", assertStrContains);
    /**
     * Make an assertion that `actual` contains the `expected` values
     * If not then thrown.
     */
    function assertArrayContains(actual, expected, msg) {
      const missing = [];
      for (let i = 0; i < expected.length; i++) {
        let found = false;
        for (let j = 0; j < actual.length; j++) {
          if (equal(expected[i], actual[j])) {
            found = true;
            break;
          }
        }
        if (!found) {
          missing.push(expected[i]);
        }
      }
      if (missing.length === 0) {
        return;
      }
      if (!msg) {
        msg = `actual: "${actual}" expected to contains: "${expected}"`;
        msg += "\n";
        msg += `missing: ${missing}`;
      }
      throw new AssertionError(msg);
    }
    exports_7("assertArrayContains", assertArrayContains);
    /**
     * Make an assertion that `actual` match RegExp `expected`. If not
     * then thrown
     */
    function assertMatch(actual, expected, msg) {
      if (!expected.test(actual)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to match: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_7("assertMatch", assertMatch);
    /**
     * Forcefully throws a failed assertion
     */
    function fail(msg) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports_7("fail", fail);
    /** Executes a function, expecting it to throw.  If it does not, then it
     * throws.  An error class and a string that should be included in the
     * error message can also be asserted.
     */
    function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but was "${e.constructor.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (msgIncludes && !e.message.includes(msgIncludes)) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_7("assertThrows", assertThrows);
    async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        await fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but got "${e.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (msgIncludes && !e.message.includes(msgIncludes)) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_7("assertThrowsAsync", assertThrowsAsync);
    /** Use this to stub out methods that will throw when invoked. */
    function unimplemented(msg) {
      throw new AssertionError(msg || "unimplemented");
    }
    exports_7("unimplemented", unimplemented);
    /** Use this to assert unreachable code. */
    function unreachable() {
      throw new AssertionError("unreachable");
    }
    exports_7("unreachable", unreachable);
    return {
      setters: [
        function (colors_ts_2_1) {
          colors_ts_2 = colors_ts_2_1;
        },
        function (diff_ts_1_1) {
          diff_ts_1 = diff_ts_1_1;
        },
      ],
      execute: function () {
        CAN_NOT_DISPLAY = "[Cannot display]";
        AssertionError = class AssertionError extends Error {
          constructor(message) {
            super(message);
            this.name = "AssertionError";
          }
        };
        exports_7("AssertionError", AssertionError);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/log/mod",
  [
    "https://deno.land/std@0.52.0/log/logger",
    "https://deno.land/std@0.52.0/log/handlers",
    "https://deno.land/std@0.52.0/testing/asserts",
    "https://deno.land/std@0.52.0/log/levels",
  ],
  function (exports_8, context_8) {
    "use strict";
    var logger_ts_1,
      handlers_ts_1,
      asserts_ts_1,
      LoggerConfig,
      DEFAULT_LEVEL,
      DEFAULT_CONFIG,
      state,
      handlers,
      debug,
      info,
      warning,
      error,
      critical;
    var __moduleName = context_8 && context_8.id;
    function getLogger(name) {
      if (!name) {
        const d = state.loggers.get("default");
        asserts_ts_1.assert(
          d != null,
          `"default" logger must be set for getting logger without name`,
        );
        return d;
      }
      const result = state.loggers.get(name);
      if (!result) {
        const logger = new logger_ts_1.Logger("NOTSET", []);
        state.loggers.set(name, logger);
        return logger;
      }
      return result;
    }
    exports_8("getLogger", getLogger);
    async function setup(config) {
      state.config = {
        handlers: { ...DEFAULT_CONFIG.handlers, ...config.handlers },
        loggers: { ...DEFAULT_CONFIG.loggers, ...config.loggers },
      };
      // tear down existing handlers
      state.handlers.forEach((handler) => {
        handler.destroy();
      });
      state.handlers.clear();
      // setup handlers
      const handlers = state.config.handlers || {};
      for (const handlerName in handlers) {
        const handler = handlers[handlerName];
        await handler.setup();
        state.handlers.set(handlerName, handler);
      }
      // remove existing loggers
      state.loggers.clear();
      // setup loggers
      const loggers = state.config.loggers || {};
      for (const loggerName in loggers) {
        const loggerConfig = loggers[loggerName];
        const handlerNames = loggerConfig.handlers || [];
        const handlers = [];
        handlerNames.forEach((handlerName) => {
          const handler = state.handlers.get(handlerName);
          if (handler) {
            handlers.push(handler);
          }
        });
        const levelName = loggerConfig.level || DEFAULT_LEVEL;
        const logger = new logger_ts_1.Logger(levelName, handlers);
        state.loggers.set(loggerName, logger);
      }
    }
    exports_8("setup", setup);
    return {
      setters: [
        function (logger_ts_1_1) {
          logger_ts_1 = logger_ts_1_1;
        },
        function (handlers_ts_1_1) {
          handlers_ts_1 = handlers_ts_1_1;
        },
        function (asserts_ts_1_1) {
          asserts_ts_1 = asserts_ts_1_1;
        },
        function (levels_ts_3_1) {
          exports_8({
            "LogLevels": levels_ts_3_1["LogLevels"],
          });
        },
      ],
      execute: async function () {
        LoggerConfig = class LoggerConfig {
        };
        exports_8("LoggerConfig", LoggerConfig);
        DEFAULT_LEVEL = "INFO";
        DEFAULT_CONFIG = {
          handlers: {
            default: new handlers_ts_1.ConsoleHandler(DEFAULT_LEVEL),
          },
          loggers: {
            default: {
              level: DEFAULT_LEVEL,
              handlers: ["default"],
            },
          },
        };
        state = {
          handlers: new Map(),
          loggers: new Map(),
          config: DEFAULT_CONFIG,
        };
        exports_8(
          "handlers",
          handlers = {
            BaseHandler: handlers_ts_1.BaseHandler,
            ConsoleHandler: handlers_ts_1.ConsoleHandler,
            WriterHandler: handlers_ts_1.WriterHandler,
            FileHandler: handlers_ts_1.FileHandler,
            RotatingFileHandler: handlers_ts_1.RotatingFileHandler,
          },
        );
        exports_8(
          "debug",
          debug = (msg, ...args) => getLogger("default").debug(msg, ...args),
        );
        exports_8(
          "info",
          info = (msg, ...args) => getLogger("default").info(msg, ...args),
        );
        exports_8(
          "warning",
          warning = (msg, ...args) =>
            getLogger("default").warning(msg, ...args),
        );
        exports_8(
          "error",
          error = (msg, ...args) => getLogger("default").error(msg, ...args),
        );
        exports_8(
          "critical",
          critical = (msg, ...args) =>
            getLogger("default").critical(msg, ...args),
        );
        await setup(DEFAULT_CONFIG);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fmt/sprintf",
  [],
  function (exports_9, context_9) {
    "use strict";
    var State,
      WorP,
      Flags,
      min,
      UNICODE_REPLACEMENT_CHARACTER,
      DEFAULT_PRECISION,
      FLOAT_REGEXP,
      F,
      Printf;
    var __moduleName = context_9 && context_9.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function sprintf(format, ...args) {
      const printf = new Printf(format, ...args);
      return printf.doPrintf();
    }
    exports_9("sprintf", sprintf);
    return {
      setters: [],
      execute: function () {
        (function (State) {
          State[State["PASSTHROUGH"] = 0] = "PASSTHROUGH";
          State[State["PERCENT"] = 1] = "PERCENT";
          State[State["POSITIONAL"] = 2] = "POSITIONAL";
          State[State["PRECISION"] = 3] = "PRECISION";
          State[State["WIDTH"] = 4] = "WIDTH";
        })(State || (State = {}));
        (function (WorP) {
          WorP[WorP["WIDTH"] = 0] = "WIDTH";
          WorP[WorP["PRECISION"] = 1] = "PRECISION";
        })(WorP || (WorP = {}));
        Flags = class Flags {
          constructor() {
            this.width = -1;
            this.precision = -1;
          }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        min = Math.min;
        UNICODE_REPLACEMENT_CHARACTER = "\ufffd";
        DEFAULT_PRECISION = 6;
        FLOAT_REGEXP = /(-?)(\d)\.?(\d*)e([+-])(\d+)/;
        (function (F) {
          F[F["sign"] = 1] = "sign";
          F[F["mantissa"] = 2] = "mantissa";
          F[F["fractional"] = 3] = "fractional";
          F[F["esign"] = 4] = "esign";
          F[F["exponent"] = 5] = "exponent";
        })(F || (F = {}));
        Printf = class Printf {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          constructor(format, ...args) {
            this.state = State.PASSTHROUGH;
            this.verb = "";
            this.buf = "";
            this.argNum = 0;
            this.flags = new Flags();
            this.format = format;
            this.args = args;
            this.haveSeen = new Array(args.length);
            this.i = 0;
          }
          doPrintf() {
            for (; this.i < this.format.length; ++this.i) {
              const c = this.format[this.i];
              switch (this.state) {
                case State.PASSTHROUGH:
                  if (c === "%") {
                    this.state = State.PERCENT;
                  } else {
                    this.buf += c;
                  }
                  break;
                case State.PERCENT:
                  if (c === "%") {
                    this.buf += c;
                    this.state = State.PASSTHROUGH;
                  } else {
                    this.handleFormat();
                  }
                  break;
                default:
                  throw Error(
                    "Should be unreachable, certainly a bug in the lib.",
                  );
              }
            }
            // check for unhandled args
            let extras = false;
            let err = "%!(EXTRA";
            for (let i = 0; i !== this.haveSeen.length; ++i) {
              if (!this.haveSeen[i]) {
                extras = true;
                err += ` '${Deno.inspect(this.args[i])}'`;
              }
            }
            err += ")";
            if (extras) {
              this.buf += err;
            }
            return this.buf;
          }
          // %[<positional>]<flag>...<verb>
          handleFormat() {
            this.flags = new Flags();
            const flags = this.flags;
            for (; this.i < this.format.length; ++this.i) {
              const c = this.format[this.i];
              switch (this.state) {
                case State.PERCENT:
                  switch (c) {
                    case "[":
                      this.handlePositional();
                      this.state = State.POSITIONAL;
                      break;
                    case "+":
                      flags.plus = true;
                      break;
                    case "<":
                      flags.lessthan = true;
                      break;
                    case "-":
                      flags.dash = true;
                      flags.zero = false; // only left pad zeros, dash takes precedence
                      break;
                    case "#":
                      flags.sharp = true;
                      break;
                    case " ":
                      flags.space = true;
                      break;
                    case "0":
                      // only left pad zeros, dash takes precedence
                      flags.zero = !flags.dash;
                      break;
                    default:
                      if (("1" <= c && c <= "9") || c === "." || c === "*") {
                        if (c === ".") {
                          this.flags.precision = 0;
                          this.state = State.PRECISION;
                          this.i++;
                        } else {
                          this.state = State.WIDTH;
                        }
                        this.handleWidthAndPrecision(flags);
                      } else {
                        this.handleVerb();
                        return; // always end in verb
                      }
                  } // switch c
                  break;
                case State.POSITIONAL: // either a verb or * only verb for now, TODO
                  if (c === "*") {
                    const worp = this.flags.precision === -1 ? WorP.WIDTH
                    : WorP.PRECISION;
                    this.handleWidthOrPrecisionRef(worp);
                    this.state = State.PERCENT;
                    break;
                  } else {
                    this.handleVerb();
                    return; // always end in verb
                  }
                default:
                  throw new Error(
                    `Should not be here ${this.state}, library bug!`,
                  );
              } // switch state
            }
          }
          handleWidthOrPrecisionRef(wOrP) {
            if (this.argNum >= this.args.length) {
              // handle Positional should have already taken care of it...
              return;
            }
            const arg = this.args[this.argNum];
            this.haveSeen[this.argNum] = true;
            if (typeof arg === "number") {
              switch (wOrP) {
                case WorP.WIDTH:
                  this.flags.width = arg;
                  break;
                default:
                  this.flags.precision = arg;
              }
            } else {
              const tmp = wOrP === WorP.WIDTH ? "WIDTH" : "PREC";
              this.tmpError = `%!(BAD ${tmp} '${this.args[this.argNum]}')`;
            }
            this.argNum++;
          }
          handleWidthAndPrecision(flags) {
            const fmt = this.format;
            for (; this.i !== this.format.length; ++this.i) {
              const c = fmt[this.i];
              switch (this.state) {
                case State.WIDTH:
                  switch (c) {
                    case ".":
                      // initialize precision, %9.f -> precision=0
                      this.flags.precision = 0;
                      this.state = State.PRECISION;
                      break;
                    case "*":
                      this.handleWidthOrPrecisionRef(WorP.WIDTH);
                      // force . or flag at this point
                      break;
                    default:
                      const val = parseInt(c);
                      // most likely parseInt does something stupid that makes
                      // it unusable for this scenario ...
                      // if we encounter a non (number|*|.) we're done with prec & wid
                      if (isNaN(val)) {
                        this.i--;
                        this.state = State.PERCENT;
                        return;
                      }
                      flags.width = flags.width == -1 ? 0 : flags.width;
                      flags.width *= 10;
                      flags.width += val;
                  } // switch c
                  break;
                case State.PRECISION:
                  if (c === "*") {
                    this.handleWidthOrPrecisionRef(WorP.PRECISION);
                    break;
                  }
                  const val = parseInt(c);
                  if (isNaN(val)) {
                    // one too far, rewind
                    this.i--;
                    this.state = State.PERCENT;
                    return;
                  }
                  flags.precision *= 10;
                  flags.precision += val;
                  break;
                default:
                  throw new Error("can't be here. bug.");
              } // switch state
            }
          }
          handlePositional() {
            if (this.format[this.i] !== "[") {
              // sanity only
              throw new Error("Can't happen? Bug.");
            }
            let positional = 0;
            const format = this.format;
            this.i++;
            let err = false;
            for (; this.i !== this.format.length; ++this.i) {
              if (format[this.i] === "]") {
                break;
              }
              positional *= 10;
              const val = parseInt(format[this.i]);
              if (isNaN(val)) {
                //throw new Error(
                //  `invalid character in positional: ${format}[${format[this.i]}]`
                //);
                this.tmpError = "%!(BAD INDEX)";
                err = true;
              }
              positional += val;
            }
            if (positional - 1 >= this.args.length) {
              this.tmpError = "%!(BAD INDEX)";
              err = true;
            }
            this.argNum = err ? this.argNum : positional - 1;
            return;
          }
          handleLessThan() {
            const arg = this.args[this.argNum];
            if ((arg || {}).constructor.name !== "Array") {
              throw new Error(
                `arg ${arg} is not an array. Todo better error handling`,
              );
            }
            let str = "[ ";
            for (let i = 0; i !== arg.length; ++i) {
              if (i !== 0) {
                str += ", ";
              }
              str += this._handleVerb(arg[i]);
            }
            return str + " ]";
          }
          handleVerb() {
            const verb = this.format[this.i];
            this.verb = verb;
            if (this.tmpError) {
              this.buf += this.tmpError;
              this.tmpError = undefined;
              if (this.argNum < this.haveSeen.length) {
                this.haveSeen[this.argNum] = true; // keep track of used args
              }
            } else if (this.args.length <= this.argNum) {
              this.buf += `%!(MISSING '${verb}')`;
            } else {
              const arg = this.args[this.argNum]; // check out of range
              this.haveSeen[this.argNum] = true; // keep track of used args
              if (this.flags.lessthan) {
                this.buf += this.handleLessThan();
              } else {
                this.buf += this._handleVerb(arg);
              }
            }
            this.argNum++; // if there is a further positional, it will reset.
            this.state = State.PASSTHROUGH;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          _handleVerb(arg) {
            switch (this.verb) {
              case "t":
                return this.pad(arg.toString());
                break;
              case "b":
                return this.fmtNumber(arg, 2);
                break;
              case "c":
                return this.fmtNumberCodePoint(arg);
                break;
              case "d":
                return this.fmtNumber(arg, 10);
                break;
              case "o":
                return this.fmtNumber(arg, 8);
                break;
              case "x":
                return this.fmtHex(arg);
                break;
              case "X":
                return this.fmtHex(arg, true);
                break;
              case "e":
                return this.fmtFloatE(arg);
                break;
              case "E":
                return this.fmtFloatE(arg, true);
                break;
              case "f":
              case "F":
                return this.fmtFloatF(arg);
                break;
              case "g":
                return this.fmtFloatG(arg);
                break;
              case "G":
                return this.fmtFloatG(arg, true);
                break;
              case "s":
                return this.fmtString(arg);
                break;
              case "T":
                return this.fmtString(typeof arg);
                break;
              case "v":
                return this.fmtV(arg);
                break;
              case "j":
                return this.fmtJ(arg);
                break;
              default:
                return `%!(BAD VERB '${this.verb}')`;
            }
          }
          pad(s) {
            const padding = this.flags.zero ? "0" : " ";
            if (this.flags.dash) {
              return s.padEnd(this.flags.width, padding);
            }
            return s.padStart(this.flags.width, padding);
          }
          padNum(nStr, neg) {
            let sign;
            if (neg) {
              sign = "-";
            } else if (this.flags.plus || this.flags.space) {
              sign = this.flags.plus ? "+" : " ";
            } else {
              sign = "";
            }
            const zero = this.flags.zero;
            if (!zero) {
              // sign comes in front of padding when padding w/ zero,
              // in from of value if padding with spaces.
              nStr = sign + nStr;
            }
            const pad = zero ? "0" : " ";
            const len = zero
              ? this.flags.width - sign.length
              : this.flags.width;
            if (this.flags.dash) {
              nStr = nStr.padEnd(len, pad);
            } else {
              nStr = nStr.padStart(len, pad);
            }
            if (zero) {
              // see above
              nStr = sign + nStr;
            }
            return nStr;
          }
          fmtNumber(n, radix, upcase = false) {
            let num = Math.abs(n).toString(radix);
            const prec = this.flags.precision;
            if (prec !== -1) {
              this.flags.zero = false;
              num = n === 0 && prec === 0 ? "" : num;
              while (num.length < prec) {
                num = "0" + num;
              }
            }
            let prefix = "";
            if (this.flags.sharp) {
              switch (radix) {
                case 2:
                  prefix += "0b";
                  break;
                case 8:
                  // don't annotate octal 0 with 0...
                  prefix += num.startsWith("0") ? "" : "0";
                  break;
                case 16:
                  prefix += "0x";
                  break;
                default:
                  throw new Error("cannot handle base: " + radix);
              }
            }
            // don't add prefix in front of value truncated by precision=0, val=0
            num = num.length === 0 ? num : prefix + num;
            if (upcase) {
              num = num.toUpperCase();
            }
            return this.padNum(num, n < 0);
          }
          fmtNumberCodePoint(n) {
            let s = "";
            try {
              s = String.fromCodePoint(n);
            } catch (RangeError) {
              s = UNICODE_REPLACEMENT_CHARACTER;
            }
            return this.pad(s);
          }
          fmtFloatSpecial(n) {
            // formatting of NaN and Inf are pants-on-head
            // stupid and more or less arbitrary.
            if (isNaN(n)) {
              this.flags.zero = false;
              return this.padNum("NaN", false);
            }
            if (n === Number.POSITIVE_INFINITY) {
              this.flags.zero = false;
              this.flags.plus = true;
              return this.padNum("Inf", false);
            }
            if (n === Number.NEGATIVE_INFINITY) {
              this.flags.zero = false;
              return this.padNum("Inf", true);
            }
            return "";
          }
          roundFractionToPrecision(fractional, precision) {
            if (fractional.length > precision) {
              fractional = "1" + fractional; // prepend a 1 in case of leading 0
              let tmp = parseInt(fractional.substr(0, precision + 2)) / 10;
              tmp = Math.round(tmp);
              fractional = Math.floor(tmp).toString();
              fractional = fractional.substr(1); // remove extra 1
            } else {
              while (fractional.length < precision) {
                fractional += "0";
              }
            }
            return fractional;
          }
          fmtFloatE(n, upcase = false) {
            const special = this.fmtFloatSpecial(n);
            if (special !== "") {
              return special;
            }
            const m = n.toExponential().match(FLOAT_REGEXP);
            if (!m) {
              throw Error("can't happen, bug");
            }
            let fractional = m[F.fractional];
            const precision = this.flags.precision !== -1
              ? this.flags.precision
              : DEFAULT_PRECISION;
            fractional = this.roundFractionToPrecision(fractional, precision);
            let e = m[F.exponent];
            // scientific notation output with exponent padded to minlen 2
            e = e.length == 1 ? "0" + e : e;
            const val = `${m[F.mantissa]}.${fractional}${upcase ? "E" : "e"}${
              m[F.esign]
            }${e}`;
            return this.padNum(val, n < 0);
          }
          fmtFloatF(n) {
            const special = this.fmtFloatSpecial(n);
            if (special !== "") {
              return special;
            }
            // stupid helper that turns a number into a (potentially)
            // VERY long string.
            function expandNumber(n) {
              if (Number.isSafeInteger(n)) {
                return n.toString() + ".";
              }
              const t = n.toExponential().split("e");
              let m = t[0].replace(".", "");
              const e = parseInt(t[1]);
              if (e < 0) {
                let nStr = "0.";
                for (let i = 0; i !== Math.abs(e) - 1; ++i) {
                  nStr += "0";
                }
                return (nStr += m);
              } else {
                const splIdx = e + 1;
                while (m.length < splIdx) {
                  m += "0";
                }
                return m.substr(0, splIdx) + "." + m.substr(splIdx);
              }
            }
            // avoiding sign makes padding easier
            const val = expandNumber(Math.abs(n));
            const arr = val.split(".");
            const dig = arr[0];
            let fractional = arr[1];
            const precision = this.flags.precision !== -1
              ? this.flags.precision
              : DEFAULT_PRECISION;
            fractional = this.roundFractionToPrecision(fractional, precision);
            return this.padNum(`${dig}.${fractional}`, n < 0);
          }
          fmtFloatG(n, upcase = false) {
            const special = this.fmtFloatSpecial(n);
            if (special !== "") {
              return special;
            }
            // The double argument representing a floating-point number shall be
            // converted in the style f or e (or in the style F or E in
            // the case of a G conversion specifier), depending on the
            // value converted and the precision. Let P equal the
            // precision if non-zero, 6 if the precision is omitted, or 1
            // if the precision is zero. Then, if a conversion with style E would
            // have an exponent of X:
            //     - If P > X>=-4, the conversion shall be with style f (or F )
            //     and precision P -( X+1).
            //     - Otherwise, the conversion shall be with style e (or E )
            //     and precision P -1.
            // Finally, unless the '#' flag is used, any trailing zeros shall be
            // removed from the fractional portion of the result and the
            // decimal-point character shall be removed if there is no
            // fractional portion remaining.
            // A double argument representing an infinity or NaN shall be
            // converted in the style of an f or F conversion specifier.
            // https://pubs.opengroup.org/onlinepubs/9699919799/functions/fprintf.html
            let P = this.flags.precision !== -1
              ? this.flags.precision
              : DEFAULT_PRECISION;
            P = P === 0 ? 1 : P;
            const m = n.toExponential().match(FLOAT_REGEXP);
            if (!m) {
              throw Error("can't happen");
            }
            const X = parseInt(m[F.exponent]) * (m[F.esign] === "-" ? -1 : 1);
            let nStr = "";
            if (P > X && X >= -4) {
              this.flags.precision = P - (X + 1);
              nStr = this.fmtFloatF(n);
              if (!this.flags.sharp) {
                nStr = nStr.replace(/\.?0*$/, "");
              }
            } else {
              this.flags.precision = P - 1;
              nStr = this.fmtFloatE(n);
              if (!this.flags.sharp) {
                nStr = nStr.replace(/\.?0*e/, upcase ? "E" : "e");
              }
            }
            return nStr;
          }
          fmtString(s) {
            if (this.flags.precision !== -1) {
              s = s.substr(0, this.flags.precision);
            }
            return this.pad(s);
          }
          fmtHex(val, upper = false) {
            // allow others types ?
            switch (typeof val) {
              case "number":
                return this.fmtNumber(val, 16, upper);
                break;
              case "string":
                const sharp = this.flags.sharp && val.length !== 0;
                let hex = sharp ? "0x" : "";
                const prec = this.flags.precision;
                const end = prec !== -1 ? min(prec, val.length) : val.length;
                for (let i = 0; i !== end; ++i) {
                  if (i !== 0 && this.flags.space) {
                    hex += sharp ? " 0x" : " ";
                  }
                  // TODO: for now only taking into account the
                  // lower half of the codePoint, ie. as if a string
                  // is a list of 8bit values instead of UCS2 runes
                  const c = (val.charCodeAt(i) & 0xff).toString(16);
                  hex += c.length === 1 ? `0${c}` : c;
                }
                if (upper) {
                  hex = hex.toUpperCase();
                }
                return this.pad(hex);
                break;
              default:
                throw new Error(
                  "currently only number and string are implemented for hex",
                );
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fmtV(val) {
            if (this.flags.sharp) {
              const options = this.flags.precision !== -1
                ? { depth: this.flags.precision }
                : {};
              return this.pad(Deno.inspect(val, options));
            } else {
              const p = this.flags.precision;
              return p === -1 ? val.toString() : val.toString().substr(0, p);
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fmtJ(val) {
            return JSON.stringify(val);
          }
        };
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fmt/mod",
  [
    "https://deno.land/std@0.52.0/fmt/colors",
    "https://deno.land/std@0.52.0/fmt/sprintf",
  ],
  function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    function exportStar_1(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_10(exports);
    }
    return {
      setters: [
        function (colors_ts_3_1) {
          exportStar_1(colors_ts_3_1);
        },
        function (sprintf_ts_1_1) {
          exportStar_1(sprintf_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/flags/mod",
  ["https://deno.land/std@0.52.0/testing/asserts"],
  function (exports_11, context_11) {
    "use strict";
    var asserts_ts_2;
    var __moduleName = context_11 && context_11.id;
    function get(obj, key) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return obj[key];
      }
    }
    function getForce(obj, key) {
      const v = get(obj, key);
      asserts_ts_2.assert(v != null);
      return v;
    }
    function isNumber(x) {
      if (typeof x === "number") {
        return true;
      }
      if (/^0x[0-9a-f]+$/i.test(String(x))) {
        return true;
      }
      return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
    }
    function hasKey(obj, keys) {
      let o = obj;
      keys.slice(0, -1).forEach((key) => {
        o = (get(o, key) ?? {});
      });
      const key = keys[keys.length - 1];
      return key in o;
    }
    /** Take a set of command line arguments, with an optional set of options, and
     * return an object representation of those argument.
     *
     *      const parsedArgs = parse(Deno.args);
     */
    function parse(
      args,
      {
        "--": doubleDash = false,
        alias = {},
        boolean = false,
        default: defaults = {},
        stopEarly = false,
        string = [],
        unknown = (i) => i,
      } = {},
    ) {
      const flags = {
        bools: {},
        strings: {},
        unknownFn: unknown,
        allBools: false,
      };
      if (boolean !== undefined) {
        if (typeof boolean === "boolean") {
          flags.allBools = !!boolean;
        } else {
          const booleanArgs = typeof boolean === "string" ? [boolean] : boolean;
          for (const key of booleanArgs.filter(Boolean)) {
            flags.bools[key] = true;
          }
        }
      }
      const aliases = {};
      if (alias !== undefined) {
        for (const key in alias) {
          const val = getForce(alias, key);
          if (typeof val === "string") {
            aliases[key] = [val];
          } else {
            aliases[key] = val;
          }
          for (const alias of getForce(aliases, key)) {
            aliases[alias] = [key].concat(
              aliases[key].filter((y) => alias !== y),
            );
          }
        }
      }
      if (string !== undefined) {
        const stringArgs = typeof string === "string" ? [string] : string;
        for (const key of stringArgs.filter(Boolean)) {
          flags.strings[key] = true;
          const alias = get(aliases, key);
          if (alias) {
            for (const al of alias) {
              flags.strings[al] = true;
            }
          }
        }
      }
      const argv = { _: [] };
      function argDefined(key, arg) {
        return ((flags.allBools && /^--[^=]+$/.test(arg)) ||
          get(flags.bools, key) ||
          !!get(flags.strings, key) ||
          !!get(aliases, key));
      }
      function setKey(obj, keys, value) {
        let o = obj;
        keys.slice(0, -1).forEach(function (key) {
          if (get(o, key) === undefined) {
            o[key] = {};
          }
          o = get(o, key);
        });
        const key = keys[keys.length - 1];
        if (
          get(o, key) === undefined ||
          get(flags.bools, key) ||
          typeof get(o, key) === "boolean"
        ) {
          o[key] = value;
        } else if (Array.isArray(get(o, key))) {
          o[key].push(value);
        } else {
          o[key] = [get(o, key), value];
        }
      }
      function setArg(key, val, arg = undefined) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
          if (flags.unknownFn(arg, key, val) === false) {
            return;
          }
        }
        const value = !get(flags.strings, key) && isNumber(val)
          ? Number(val)
          : val;
        setKey(argv, key.split("."), value);
        const alias = get(aliases, key);
        if (alias) {
          for (const x of alias) {
            setKey(argv, x.split("."), value);
          }
        }
      }
      function aliasIsBoolean(key) {
        return getForce(aliases, key).some((x) =>
          typeof get(flags.bools, x) === "boolean"
        );
      }
      for (const key of Object.keys(flags.bools)) {
        setArg(key, defaults[key] === undefined ? false : defaults[key]);
      }
      let notFlags = [];
      // all args after "--" are not parsed
      if (args.includes("--")) {
        notFlags = args.slice(args.indexOf("--") + 1);
        args = args.slice(0, args.indexOf("--"));
      }
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (/^--.+=/.test(arg)) {
          const m = arg.match(/^--([^=]+)=(.*)$/s);
          asserts_ts_2.assert(m != null);
          const [, key, value] = m;
          if (flags.bools[key]) {
            const booleanValue = value !== "false";
            setArg(key, booleanValue, arg);
          } else {
            setArg(key, value, arg);
          }
        } else if (/^--no-.+/.test(arg)) {
          const m = arg.match(/^--no-(.+)/);
          asserts_ts_2.assert(m != null);
          setArg(m[1], false, arg);
        } else if (/^--.+/.test(arg)) {
          const m = arg.match(/^--(.+)/);
          asserts_ts_2.assert(m != null);
          const [, key] = m;
          const next = args[i + 1];
          if (
            next !== undefined &&
            !/^-/.test(next) &&
            !get(flags.bools, key) &&
            !flags.allBools &&
            (get(aliases, key) ? !aliasIsBoolean(key) : true)
          ) {
            setArg(key, next, arg);
            i++;
          } else if (/^(true|false)$/.test(next)) {
            setArg(key, next === "true", arg);
            i++;
          } else {
            setArg(key, get(flags.strings, key) ? "" : true, arg);
          }
        } else if (/^-[^-]+/.test(arg)) {
          const letters = arg.slice(1, -1).split("");
          let broken = false;
          for (let j = 0; j < letters.length; j++) {
            const next = arg.slice(j + 2);
            if (next === "-") {
              setArg(letters[j], next, arg);
              continue;
            }
            if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
              setArg(letters[j], next.split("=")[1], arg);
              broken = true;
              break;
            }
            if (
              /[A-Za-z]/.test(letters[j]) &&
              /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)
            ) {
              setArg(letters[j], next, arg);
              broken = true;
              break;
            }
            if (letters[j + 1] && letters[j + 1].match(/\W/)) {
              setArg(letters[j], arg.slice(j + 2), arg);
              broken = true;
              break;
            } else {
              setArg(
                letters[j],
                get(flags.strings, letters[j]) ? "" : true,
                arg,
              );
            }
          }
          const [key] = arg.slice(-1);
          if (!broken && key !== "-") {
            if (
              args[i + 1] &&
              !/^(-|--)[^-]/.test(args[i + 1]) &&
              !get(flags.bools, key) &&
              (get(aliases, key) ? !aliasIsBoolean(key) : true)
            ) {
              setArg(key, args[i + 1], arg);
              i++;
            } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
              setArg(key, args[i + 1] === "true", arg);
              i++;
            } else {
              setArg(key, get(flags.strings, key) ? "" : true, arg);
            }
          }
        } else {
          if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
            argv._.push(
              flags.strings["_"] ?? !isNumber(arg) ? arg : Number(arg),
            );
          }
          if (stopEarly) {
            argv._.push(...args.slice(i + 1));
            break;
          }
        }
      }
      for (const key of Object.keys(defaults)) {
        if (!hasKey(argv, key.split("."))) {
          setKey(argv, key.split("."), defaults[key]);
          if (aliases[key]) {
            for (const x of aliases[key]) {
              setKey(argv, x.split("."), defaults[key]);
            }
          }
        }
      }
      if (doubleDash) {
        argv["--"] = [];
        for (const key of notFlags) {
          argv["--"].push(key);
        }
      } else {
        for (const key of notFlags) {
          argv._.push(key);
        }
      }
      return argv;
    }
    exports_11("parse", parse);
    return {
      setters: [
        function (asserts_ts_2_1) {
          asserts_ts_2 = asserts_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/path/interface",
  [],
  function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std@0.52.0/path/_constants",
  [],
  function (exports_13, context_13) {
    "use strict";
    var build,
      CHAR_UPPERCASE_A,
      CHAR_LOWERCASE_A,
      CHAR_UPPERCASE_Z,
      CHAR_LOWERCASE_Z,
      CHAR_DOT,
      CHAR_FORWARD_SLASH,
      CHAR_BACKWARD_SLASH,
      CHAR_VERTICAL_LINE,
      CHAR_COLON,
      CHAR_QUESTION_MARK,
      CHAR_UNDERSCORE,
      CHAR_LINE_FEED,
      CHAR_CARRIAGE_RETURN,
      CHAR_TAB,
      CHAR_FORM_FEED,
      CHAR_EXCLAMATION_MARK,
      CHAR_HASH,
      CHAR_SPACE,
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE,
      CHAR_LEFT_SQUARE_BRACKET,
      CHAR_RIGHT_SQUARE_BRACKET,
      CHAR_LEFT_ANGLE_BRACKET,
      CHAR_RIGHT_ANGLE_BRACKET,
      CHAR_LEFT_CURLY_BRACKET,
      CHAR_RIGHT_CURLY_BRACKET,
      CHAR_HYPHEN_MINUS,
      CHAR_PLUS,
      CHAR_DOUBLE_QUOTE,
      CHAR_SINGLE_QUOTE,
      CHAR_PERCENT,
      CHAR_SEMICOLON,
      CHAR_CIRCUMFLEX_ACCENT,
      CHAR_GRAVE_ACCENT,
      CHAR_AT,
      CHAR_AMPERSAND,
      CHAR_EQUAL,
      CHAR_0,
      CHAR_9,
      isWindows,
      SEP,
      SEP_PATTERN;
    var __moduleName = context_13 && context_13.id;
    return {
      setters: [],
      execute: function () {
        build = Deno.build;
        // Alphabet chars.
        exports_13("CHAR_UPPERCASE_A", CHAR_UPPERCASE_A = 65); /* A */
        exports_13("CHAR_LOWERCASE_A", CHAR_LOWERCASE_A = 97); /* a */
        exports_13("CHAR_UPPERCASE_Z", CHAR_UPPERCASE_Z = 90); /* Z */
        exports_13("CHAR_LOWERCASE_Z", CHAR_LOWERCASE_Z = 122); /* z */
        // Non-alphabetic chars.
        exports_13("CHAR_DOT", CHAR_DOT = 46); /* . */
        exports_13("CHAR_FORWARD_SLASH", CHAR_FORWARD_SLASH = 47); /* / */
        exports_13("CHAR_BACKWARD_SLASH", CHAR_BACKWARD_SLASH = 92); /* \ */
        exports_13("CHAR_VERTICAL_LINE", CHAR_VERTICAL_LINE = 124); /* | */
        exports_13("CHAR_COLON", CHAR_COLON = 58); /* : */
        exports_13("CHAR_QUESTION_MARK", CHAR_QUESTION_MARK = 63); /* ? */
        exports_13("CHAR_UNDERSCORE", CHAR_UNDERSCORE = 95); /* _ */
        exports_13("CHAR_LINE_FEED", CHAR_LINE_FEED = 10); /* \n */
        exports_13("CHAR_CARRIAGE_RETURN", CHAR_CARRIAGE_RETURN = 13); /* \r */
        exports_13("CHAR_TAB", CHAR_TAB = 9); /* \t */
        exports_13("CHAR_FORM_FEED", CHAR_FORM_FEED = 12); /* \f */
        exports_13("CHAR_EXCLAMATION_MARK", CHAR_EXCLAMATION_MARK = 33); /* ! */
        exports_13("CHAR_HASH", CHAR_HASH = 35); /* # */
        exports_13("CHAR_SPACE", CHAR_SPACE = 32); /*   */
        exports_13(
          "CHAR_NO_BREAK_SPACE",
          CHAR_NO_BREAK_SPACE = 160,
        ); /* \u00A0 */
        exports_13(
          "CHAR_ZERO_WIDTH_NOBREAK_SPACE",
          CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279,
        ); /* \uFEFF */
        exports_13(
          "CHAR_LEFT_SQUARE_BRACKET",
          CHAR_LEFT_SQUARE_BRACKET = 91,
        ); /* [ */
        exports_13(
          "CHAR_RIGHT_SQUARE_BRACKET",
          CHAR_RIGHT_SQUARE_BRACKET = 93,
        ); /* ] */
        exports_13(
          "CHAR_LEFT_ANGLE_BRACKET",
          CHAR_LEFT_ANGLE_BRACKET = 60,
        ); /* < */
        exports_13(
          "CHAR_RIGHT_ANGLE_BRACKET",
          CHAR_RIGHT_ANGLE_BRACKET = 62,
        ); /* > */
        exports_13(
          "CHAR_LEFT_CURLY_BRACKET",
          CHAR_LEFT_CURLY_BRACKET = 123,
        ); /* { */
        exports_13(
          "CHAR_RIGHT_CURLY_BRACKET",
          CHAR_RIGHT_CURLY_BRACKET = 125,
        ); /* } */
        exports_13("CHAR_HYPHEN_MINUS", CHAR_HYPHEN_MINUS = 45); /* - */
        exports_13("CHAR_PLUS", CHAR_PLUS = 43); /* + */
        exports_13("CHAR_DOUBLE_QUOTE", CHAR_DOUBLE_QUOTE = 34); /* " */
        exports_13("CHAR_SINGLE_QUOTE", CHAR_SINGLE_QUOTE = 39); /* ' */
        exports_13("CHAR_PERCENT", CHAR_PERCENT = 37); /* % */
        exports_13("CHAR_SEMICOLON", CHAR_SEMICOLON = 59); /* ; */
        exports_13(
          "CHAR_CIRCUMFLEX_ACCENT",
          CHAR_CIRCUMFLEX_ACCENT = 94,
        ); /* ^ */
        exports_13("CHAR_GRAVE_ACCENT", CHAR_GRAVE_ACCENT = 96); /* ` */
        exports_13("CHAR_AT", CHAR_AT = 64); /* @ */
        exports_13("CHAR_AMPERSAND", CHAR_AMPERSAND = 38); /* & */
        exports_13("CHAR_EQUAL", CHAR_EQUAL = 61); /* = */
        // Digits
        exports_13("CHAR_0", CHAR_0 = 48); /* 0 */
        exports_13("CHAR_9", CHAR_9 = 57); /* 9 */
        isWindows = build.os == "windows";
        exports_13("SEP", SEP = isWindows ? "\\" : "/");
        exports_13("SEP_PATTERN", SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/);
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std@0.52.0/path/_util",
  ["https://deno.land/std@0.52.0/path/_constants"],
  function (exports_14, context_14) {
    "use strict";
    var _constants_ts_1;
    var __moduleName = context_14 && context_14.id;
    function assertPath(path) {
      if (typeof path !== "string") {
        throw new TypeError(
          `Path must be a string. Received ${JSON.stringify(path)}`,
        );
      }
    }
    exports_14("assertPath", assertPath);
    function isPosixPathSeparator(code) {
      return code === _constants_ts_1.CHAR_FORWARD_SLASH;
    }
    exports_14("isPosixPathSeparator", isPosixPathSeparator);
    function isPathSeparator(code) {
      return isPosixPathSeparator(code) ||
        code === _constants_ts_1.CHAR_BACKWARD_SLASH;
    }
    exports_14("isPathSeparator", isPathSeparator);
    function isWindowsDeviceRoot(code) {
      return ((code >= _constants_ts_1.CHAR_LOWERCASE_A &&
        code <= _constants_ts_1.CHAR_LOWERCASE_Z) ||
        (code >= _constants_ts_1.CHAR_UPPERCASE_A &&
          code <= _constants_ts_1.CHAR_UPPERCASE_Z));
    }
    exports_14("isWindowsDeviceRoot", isWindowsDeviceRoot);
    // Resolves . and .. elements in a path with directory names
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
      let res = "";
      let lastSegmentLength = 0;
      let lastSlash = -1;
      let dots = 0;
      let code;
      for (let i = 0, len = path.length; i <= len; ++i) {
        if (i < len) {
          code = path.charCodeAt(i);
        } else if (isPathSeparator(code)) {
          break;
        } else {
          code = _constants_ts_1.CHAR_FORWARD_SLASH;
        }
        if (isPathSeparator(code)) {
          if (lastSlash === i - 1 || dots === 1) {
            // NOOP
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (
              res.length < 2 ||
              lastSegmentLength !== 2 ||
              res.charCodeAt(res.length - 1) !== _constants_ts_1.CHAR_DOT ||
              res.charCodeAt(res.length - 2) !== _constants_ts_1.CHAR_DOT
            ) {
              if (res.length > 2) {
                const lastSlashIndex = res.lastIndexOf(separator);
                if (lastSlashIndex === -1) {
                  res = "";
                  lastSegmentLength = 0;
                } else {
                  res = res.slice(0, lastSlashIndex);
                  lastSegmentLength = res.length - 1 -
                    res.lastIndexOf(separator);
                }
                lastSlash = i;
                dots = 0;
                continue;
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSegmentLength = 0;
                lastSlash = i;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0) {
                res += `${separator}..`;
              } else {
                res = "..";
              }
              lastSegmentLength = 2;
            }
          } else {
            if (res.length > 0) {
              res += separator + path.slice(lastSlash + 1, i);
            } else {
              res = path.slice(lastSlash + 1, i);
            }
            lastSegmentLength = i - lastSlash - 1;
          }
          lastSlash = i;
          dots = 0;
        } else if (code === _constants_ts_1.CHAR_DOT && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    exports_14("normalizeString", normalizeString);
    function _format(sep, pathObject) {
      const dir = pathObject.dir || pathObject.root;
      const base = pathObject.base ||
        (pathObject.name || "") + (pathObject.ext || "");
      if (!dir) {
        return base;
      }
      if (dir === pathObject.root) {
        return dir + base;
      }
      return dir + sep + base;
    }
    exports_14("_format", _format);
    return {
      setters: [
        function (_constants_ts_1_1) {
          _constants_ts_1 = _constants_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std@0.52.0/path/win32",
  [
    "https://deno.land/std@0.52.0/path/_constants",
    "https://deno.land/std@0.52.0/path/_util",
    "https://deno.land/std@0.52.0/testing/asserts",
  ],
  function (exports_15, context_15) {
    "use strict";
    var cwd, env, _constants_ts_2, _util_ts_1, asserts_ts_3, sep, delimiter;
    var __moduleName = context_15 && context_15.id;
    function resolve(...pathSegments) {
      let resolvedDevice = "";
      let resolvedTail = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
        } else if (!resolvedDevice) {
          path = cwd();
        } else {
          // Windows has the concept of drive-specific current working
          // directories. If we've resolved a drive letter but not yet an
          // absolute path, get cwd for that drive, or the process cwd if
          // the drive cwd is not available. We're sure the device is not
          // a UNC path at this points, because UNC paths are always absolute.
          path = env.get(`=${resolvedDevice}`) || cwd();
          // Verify that a cwd was found and that it actually points
          // to our drive. If not, default to the drive's root.
          if (
            path === undefined ||
            path.slice(0, 3).toLowerCase() !==
              `${resolvedDevice.toLowerCase()}\\`
          ) {
            path = `${resolvedDevice}\\`;
          }
        }
        _util_ts_1.assertPath(path);
        const len = path.length;
        // Skip empty entries
        if (len === 0) {
          continue;
        }
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
          if (_util_ts_1.isPathSeparator(code)) {
            // Possible UNC root
            // If we started with a separator, we know we at least have an
            // absolute path of some kind (UNC or otherwise)
            isAbsolute = true;
            if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
              // Matched double path separator at beginning
              let j = 2;
              let last = j;
              // Match 1 or more non-path separators
              for (; j < len; ++j) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                const firstPart = path.slice(last, j);
                // Matched!
                last = j;
                // Match 1 or more path separators
                for (; j < len; ++j) {
                  if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j < len && j !== last) {
                  // Matched!
                  last = j;
                  // Match 1 or more non-path separators
                  for (; j < len; ++j) {
                    if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                      break;
                    }
                  }
                  if (j === len) {
                    // We matched a UNC root only
                    device = `\\\\${firstPart}\\${path.slice(last)}`;
                    rootEnd = j;
                  } else if (j !== last) {
                    // We matched a UNC root with leftovers
                    device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                    rootEnd = j;
                  }
                }
              }
            } else {
              rootEnd = 1;
            }
          } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
            // Possible device root
            if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
              device = path.slice(0, 2);
              rootEnd = 2;
              if (len > 2) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                  // Treat separator following drive name as an absolute path
                  // indicator
                  isAbsolute = true;
                  rootEnd = 3;
                }
              }
            }
          }
        } else if (_util_ts_1.isPathSeparator(code)) {
          // `path` contains just a path separator
          rootEnd = 1;
          isAbsolute = true;
        }
        if (
          device.length > 0 &&
          resolvedDevice.length > 0 &&
          device.toLowerCase() !== resolvedDevice.toLowerCase()
        ) {
          // This path points to another device so it is not applicable
          continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
          resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
          resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
          resolvedAbsolute = isAbsolute;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) {
          break;
        }
      }
      // At this point the path should be resolved to a full absolute path,
      // but handle relative paths to be safe (might happen when process.cwd()
      // fails)
      // Normalize the tail path
      resolvedTail = _util_ts_1.normalizeString(
        resolvedTail,
        !resolvedAbsolute,
        "\\",
        _util_ts_1.isPathSeparator,
      );
      return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail ||
        ".";
    }
    exports_15("resolve", resolve);
    function normalize(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = 0;
      let device;
      let isAbsolute = false;
      const code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          // If we started with a separator, we know we at least have an absolute
          // path of some kind (UNC or otherwise)
          isAbsolute = true;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              const firstPart = path.slice(last, j);
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  // Return the normalized version of the UNC root since there
                  // is nothing left to process
                  return `\\\\${firstPart}\\${path.slice(last)}\\`;
                } else if (j !== last) {
                  // We matched a UNC root with leftovers
                  device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                  rootEnd = j;
                }
              }
            }
          } else {
            rootEnd = 1;
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            device = path.slice(0, 2);
            rootEnd = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                // Treat separator following drive name as an absolute path
                // indicator
                isAbsolute = true;
                rootEnd = 3;
              }
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid unnecessary
        // work
        return "\\";
      }
      let tail;
      if (rootEnd < len) {
        tail = _util_ts_1.normalizeString(
          path.slice(rootEnd),
          !isAbsolute,
          "\\",
          _util_ts_1.isPathSeparator,
        );
      } else {
        tail = "";
      }
      if (tail.length === 0 && !isAbsolute) {
        tail = ".";
      }
      if (
        tail.length > 0 &&
        _util_ts_1.isPathSeparator(path.charCodeAt(len - 1))
      ) {
        tail += "\\";
      }
      if (device === undefined) {
        if (isAbsolute) {
          if (tail.length > 0) {
            return `\\${tail}`;
          } else {
            return "\\";
          }
        } else if (tail.length > 0) {
          return tail;
        } else {
          return "";
        }
      } else if (isAbsolute) {
        if (tail.length > 0) {
          return `${device}\\${tail}`;
        } else {
          return `${device}\\`;
        }
      } else if (tail.length > 0) {
        return device + tail;
      } else {
        return device;
      }
    }
    exports_15("normalize", normalize);
    function isAbsolute(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return false;
      }
      const code = path.charCodeAt(0);
      if (_util_ts_1.isPathSeparator(code)) {
        return true;
      } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
        // Possible device root
        if (len > 2 && path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
          if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
            return true;
          }
        }
      }
      return false;
    }
    exports_15("isAbsolute", isAbsolute);
    function join(...paths) {
      const pathsCount = paths.length;
      if (pathsCount === 0) {
        return ".";
      }
      let joined;
      let firstPart = null;
      for (let i = 0; i < pathsCount; ++i) {
        const path = paths[i];
        _util_ts_1.assertPath(path);
        if (path.length > 0) {
          if (joined === undefined) {
            joined = firstPart = path;
          } else {
            joined += `\\${path}`;
          }
        }
      }
      if (joined === undefined) {
        return ".";
      }
      // Make sure that the joined path doesn't start with two slashes, because
      // normalize() will mistake it for an UNC path then.
      //
      // This step is skipped when it is very clear that the user actually
      // intended to point at an UNC path. This is assumed when the first
      // non-empty string arguments starts with exactly two slashes followed by
      // at least one more non-slash character.
      //
      // Note that for normalize() to treat a path as an UNC path it needs to
      // have at least 2 components, so we don't filter for that here.
      // This means that the user can use join to construct UNC paths from
      // a server name and a share name; for example:
      //   path.join('//server', 'share') -> '\\\\server\\share\\')
      let needsReplace = true;
      let slashCount = 0;
      asserts_ts_3.assert(firstPart != null);
      if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
          if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(1))) {
            ++slashCount;
            if (firstLen > 2) {
              if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(2))) {
                ++slashCount;
              } else {
                // We matched a UNC path in the first part
                needsReplace = false;
              }
            }
          }
        }
      }
      if (needsReplace) {
        // Find any more consecutive slashes we need to replace
        for (; slashCount < joined.length; ++slashCount) {
          if (!_util_ts_1.isPathSeparator(joined.charCodeAt(slashCount))) {
            break;
          }
        }
        // Replace the slashes if needed
        if (slashCount >= 2) {
          joined = `\\${joined.slice(slashCount)}`;
        }
      }
      return normalize(joined);
    }
    exports_15("join", join);
    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    function relative(from, to) {
      _util_ts_1.assertPath(from);
      _util_ts_1.assertPath(to);
      if (from === to) {
        return "";
      }
      const fromOrig = resolve(from);
      const toOrig = resolve(to);
      if (fromOrig === toOrig) {
        return "";
      }
      from = fromOrig.toLowerCase();
      to = toOrig.toLowerCase();
      if (from === to) {
        return "";
      }
      // Trim any leading backslashes
      let fromStart = 0;
      let fromEnd = from.length;
      for (; fromStart < fromEnd; ++fromStart) {
        if (
          from.charCodeAt(fromStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          break;
        }
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      for (; fromEnd - 1 > fromStart; --fromEnd) {
        if (
          from.charCodeAt(fromEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          break;
        }
      }
      const fromLen = fromEnd - fromStart;
      // Trim any leading backslashes
      let toStart = 0;
      let toEnd = to.length;
      for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH) {
          break;
        }
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      for (; toEnd - 1 > toStart; --toEnd) {
        if (to.charCodeAt(toEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH) {
          break;
        }
      }
      const toLen = toEnd - toStart;
      // Compare paths to find the longest common path from root
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (
              to.charCodeAt(toStart + i) === _constants_ts_2.CHAR_BACKWARD_SLASH
            ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
              return toOrig.slice(toStart + i + 1);
            } else if (i === 2) {
              // We get here if `from` is the device root.
              // For example: from='C:\\'; to='C:\\foo'
              return toOrig.slice(toStart + i);
            }
          }
          if (fromLen > length) {
            if (
              from.charCodeAt(fromStart + i) ===
                _constants_ts_2.CHAR_BACKWARD_SLASH
            ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='C:\\foo\\bar'; to='C:\\foo'
              lastCommonSep = i;
            } else if (i === 2) {
              // We get here if `to` is the device root.
              // For example: from='C:\\foo\\bar'; to='C:\\'
              lastCommonSep = 3;
            }
          }
          break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) {
          break;
        } else if (fromCode === _constants_ts_2.CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      // We found a mismatch before the first common path separator was seen, so
      // return the original `to`.
      if (i !== length && lastCommonSep === -1) {
        return toOrig;
      }
      let out = "";
      if (lastCommonSep === -1) {
        lastCommonSep = 0;
      }
      // Generate the relative path based on the path difference between `to` and
      // `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (
          i === fromEnd ||
          from.charCodeAt(i) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          if (out.length === 0) {
            out += "..";
          } else {
            out += "\\..";
          }
        }
      }
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
      } else {
        toStart += lastCommonSep;
        if (
          toOrig.charCodeAt(toStart) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          ++toStart;
        }
        return toOrig.slice(toStart, toEnd);
      }
    }
    exports_15("relative", relative);
    function toNamespacedPath(path) {
      // Note: this will *probably* throw somewhere.
      if (typeof path !== "string") {
        return path;
      }
      if (path.length === 0) {
        return "";
      }
      const resolvedPath = resolve(path);
      if (resolvedPath.length >= 3) {
        if (
          resolvedPath.charCodeAt(0) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          // Possible UNC root
          if (
            resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_BACKWARD_SLASH
          ) {
            const code = resolvedPath.charCodeAt(2);
            if (
              code !== _constants_ts_2.CHAR_QUESTION_MARK &&
              code !== _constants_ts_2.CHAR_DOT
            ) {
              // Matched non-long UNC root, convert the path to a long UNC path
              return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
          // Possible device root
          if (
            resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
            resolvedPath.charCodeAt(2) === _constants_ts_2.CHAR_BACKWARD_SLASH
          ) {
            // Matched device root, convert the path to a long UNC path
            return `\\\\?\\${resolvedPath}`;
          }
        }
      }
      return path;
    }
    exports_15("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = -1;
      let end = -1;
      let matchedSlash = true;
      let offset = 0;
      const code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          rootEnd = offset = 1;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  return path;
                }
                if (j !== last) {
                  // We matched a UNC root with leftovers
                  // Offset by 1 to include the separator after the UNC root to
                  // treat it as a "normal root" on top of a (UNC) root
                  rootEnd = offset = j + 1;
                }
              }
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            rootEnd = offset = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                rootEnd = offset = 3;
              }
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        return path;
      }
      for (let i = len - 1; i >= offset; --i) {
        if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
      if (end === -1) {
        if (rootEnd === -1) {
          return ".";
        } else {
          end = rootEnd;
        }
      }
      return path.slice(0, end);
    }
    exports_15("dirname", dirname);
    function basename(path, ext = "") {
      if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      _util_ts_1.assertPath(path);
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (_util_ts_1.isWindowsDeviceRoot(drive)) {
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            start = 2;
          }
        }
      }
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= start; --i) {
          const code = path.charCodeAt(i);
          if (_util_ts_1.isPathSeparator(code)) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= start; --i) {
          if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) {
          return "";
        }
        return path.slice(start, end);
      }
    }
    exports_15("basename", basename);
    function extname(path) {
      _util_ts_1.assertPath(path);
      let start = 0;
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (
        path.length >= 2 &&
        path.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
        _util_ts_1.isWindowsDeviceRoot(path.charCodeAt(0))
      ) {
        start = startPart = 2;
      }
      for (let i = path.length - 1; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (_util_ts_1.isPathSeparator(code)) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_2.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        return "";
      }
      return path.slice(startDot, end);
    }
    exports_15("extname", extname);
    function format(pathObject) {
      /* eslint-disable max-len */
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(
          `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`,
        );
      }
      return _util_ts_1._format("\\", pathObject);
    }
    exports_15("format", format);
    function parse(path) {
      _util_ts_1.assertPath(path);
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      const len = path.length;
      if (len === 0) {
        return ret;
      }
      let rootEnd = 0;
      let code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          rootEnd = 1;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  rootEnd = j;
                } else if (j !== last) {
                  // We matched a UNC root with leftovers
                  rootEnd = j + 1;
                }
              }
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            rootEnd = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                if (len === 3) {
                  // `path` contains just a drive root, exit early to avoid
                  // unnecessary work
                  ret.root = ret.dir = path;
                  return ret;
                }
                rootEnd = 3;
              }
            } else {
              // `path` contains just a drive root, exit early to avoid
              // unnecessary work
              ret.root = ret.dir = path;
              return ret;
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        ret.root = ret.dir = path;
        return ret;
      }
      if (rootEnd > 0) {
        ret.root = path.slice(0, rootEnd);
      }
      let startDot = -1;
      let startPart = rootEnd;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Get non-dir info
      for (; i >= rootEnd; --i) {
        code = path.charCodeAt(i);
        if (_util_ts_1.isPathSeparator(code)) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_2.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        if (end !== -1) {
          ret.base = ret.name = path.slice(startPart, end);
        }
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
      }
      // If the directory is the root, use the entire root as the `dir` including
      // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
      // trailing slash (`C:\abc\def` -> `C:\abc`).
      if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
      } else {
        ret.dir = ret.root;
      }
      return ret;
    }
    exports_15("parse", parse);
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///C:/Users/foo"); // "C:\\Users\\foo"
     *      fromFileUrl("file:///home/foo"); // "\\home\\foo"
     *
     * Note that non-file URLs are treated as file URLs and irrelevant components
     * are ignored.
     */
    function fromFileUrl(url) {
      return new URL(url).pathname
        .replace(/^\/*([A-Za-z]:)(\/|$)/, "$1/")
        .replace(/\//g, "\\");
    }
    exports_15("fromFileUrl", fromFileUrl);
    return {
      setters: [
        function (_constants_ts_2_1) {
          _constants_ts_2 = _constants_ts_2_1;
        },
        function (_util_ts_1_1) {
          _util_ts_1 = _util_ts_1_1;
        },
        function (asserts_ts_3_1) {
          asserts_ts_3 = asserts_ts_3_1;
        },
      ],
      execute: function () {
        cwd = Deno.cwd, env = Deno.env;
        exports_15("sep", sep = "\\");
        exports_15("delimiter", delimiter = ";");
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std@0.52.0/path/posix",
  [
    "https://deno.land/std@0.52.0/path/_constants",
    "https://deno.land/std@0.52.0/path/_util",
  ],
  function (exports_16, context_16) {
    "use strict";
    var cwd, _constants_ts_3, _util_ts_2, sep, delimiter;
    var __moduleName = context_16 && context_16.id;
    // path.resolve([from ...], to)
    function resolve(...pathSegments) {
      let resolvedPath = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
        } else {
          path = cwd();
        }
        _util_ts_2.assertPath(path);
        // Skip empty entries
        if (path.length === 0) {
          continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute =
          path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      }
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
      // Normalize the path
      resolvedPath = _util_ts_2.normalizeString(
        resolvedPath,
        !resolvedAbsolute,
        "/",
        _util_ts_2.isPosixPathSeparator,
      );
      if (resolvedAbsolute) {
        if (resolvedPath.length > 0) {
          return `/${resolvedPath}`;
        } else {
          return "/";
        }
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return ".";
      }
    }
    exports_16("resolve", resolve);
    function normalize(path) {
      _util_ts_2.assertPath(path);
      if (path.length === 0) {
        return ".";
      }
      const isAbsolute =
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      const trailingSeparator =
        path.charCodeAt(path.length - 1) === _constants_ts_3.CHAR_FORWARD_SLASH;
      // Normalize the path
      path = _util_ts_2.normalizeString(
        path,
        !isAbsolute,
        "/",
        _util_ts_2.isPosixPathSeparator,
      );
      if (path.length === 0 && !isAbsolute) {
        path = ".";
      }
      if (path.length > 0 && trailingSeparator) {
        path += "/";
      }
      if (isAbsolute) {
        return `/${path}`;
      }
      return path;
    }
    exports_16("normalize", normalize);
    function isAbsolute(path) {
      _util_ts_2.assertPath(path);
      return path.length > 0 &&
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
    }
    exports_16("isAbsolute", isAbsolute);
    function join(...paths) {
      if (paths.length === 0) {
        return ".";
      }
      let joined;
      for (let i = 0, len = paths.length; i < len; ++i) {
        const path = paths[i];
        _util_ts_2.assertPath(path);
        if (path.length > 0) {
          if (!joined) {
            joined = path;
          } else {
            joined += `/${path}`;
          }
        }
      }
      if (!joined) {
        return ".";
      }
      return normalize(joined);
    }
    exports_16("join", join);
    function relative(from, to) {
      _util_ts_2.assertPath(from);
      _util_ts_2.assertPath(to);
      if (from === to) {
        return "";
      }
      from = resolve(from);
      to = resolve(to);
      if (from === to) {
        return "";
      }
      // Trim any leading backslashes
      let fromStart = 1;
      const fromEnd = from.length;
      for (; fromStart < fromEnd; ++fromStart) {
        if (from.charCodeAt(fromStart) !== _constants_ts_3.CHAR_FORWARD_SLASH) {
          break;
        }
      }
      const fromLen = fromEnd - fromStart;
      // Trim any leading backslashes
      let toStart = 1;
      const toEnd = to.length;
      for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== _constants_ts_3.CHAR_FORWARD_SLASH) {
          break;
        }
      }
      const toLen = toEnd - toStart;
      // Compare paths to find the longest common path from root
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (
              to.charCodeAt(toStart + i) === _constants_ts_3.CHAR_FORWARD_SLASH
            ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='/foo/bar'; to='/foo/bar/baz'
              return to.slice(toStart + i + 1);
            } else if (i === 0) {
              // We get here if `from` is the root
              // For example: from='/'; to='/foo'
              return to.slice(toStart + i);
            }
          } else if (fromLen > length) {
            if (
              from.charCodeAt(fromStart + i) ===
                _constants_ts_3.CHAR_FORWARD_SLASH
            ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='/foo/bar/baz'; to='/foo/bar'
              lastCommonSep = i;
            } else if (i === 0) {
              // We get here if `to` is the root.
              // For example: from='/foo'; to='/'
              lastCommonSep = 0;
            }
          }
          break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) {
          break;
        } else if (fromCode === _constants_ts_3.CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      let out = "";
      // Generate the relative path based on the path difference between `to`
      // and `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (
          i === fromEnd ||
          from.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH
        ) {
          if (out.length === 0) {
            out += "..";
          } else {
            out += "/..";
          }
        }
      }
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) {
        return out + to.slice(toStart + lastCommonSep);
      } else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === _constants_ts_3.CHAR_FORWARD_SLASH) {
          ++toStart;
        }
        return to.slice(toStart);
      }
    }
    exports_16("relative", relative);
    function toNamespacedPath(path) {
      // Non-op on posix systems
      return path;
    }
    exports_16("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
      _util_ts_2.assertPath(path);
      if (path.length === 0) {
        return ".";
      }
      const hasRoot = path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      let end = -1;
      let matchedSlash = true;
      for (let i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
      if (end === -1) {
        return hasRoot ? "/" : ".";
      }
      if (hasRoot && end === 1) {
        return "//";
      }
      return path.slice(0, end);
    }
    exports_16("dirname", dirname);
    function basename(path, ext = "") {
      if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      _util_ts_2.assertPath(path);
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          const code = path.charCodeAt(i);
          if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= 0; --i) {
          if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) {
          return "";
        }
        return path.slice(start, end);
      }
    }
    exports_16("basename", basename);
    function extname(path) {
      _util_ts_2.assertPath(path);
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      for (let i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_3.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        return "";
      }
      return path.slice(startDot, end);
    }
    exports_16("extname", extname);
    function format(pathObject) {
      /* eslint-disable max-len */
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(
          `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`,
        );
      }
      return _util_ts_2._format("/", pathObject);
    }
    exports_16("format", format);
    function parse(path) {
      _util_ts_2.assertPath(path);
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path.length === 0) {
        return ret;
      }
      const isAbsolute =
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      let start;
      if (isAbsolute) {
        ret.root = "/";
        start = 1;
      } else {
        start = 0;
      }
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Get non-dir info
      for (; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_3.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        if (end !== -1) {
          if (startPart === 0 && isAbsolute) {
            ret.base = ret.name = path.slice(1, end);
          } else {
            ret.base = ret.name = path.slice(startPart, end);
          }
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path.slice(1, startDot);
          ret.base = path.slice(1, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
      }
      if (startPart > 0) {
        ret.dir = path.slice(0, startPart - 1);
      } else if (isAbsolute) {
        ret.dir = "/";
      }
      return ret;
    }
    exports_16("parse", parse);
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///home/foo"); // "/home/foo"
     *
     * Note that non-file URLs are treated as file URLs and irrelevant components
     * are ignored.
     */
    function fromFileUrl(url) {
      return new URL(url).pathname;
    }
    exports_16("fromFileUrl", fromFileUrl);
    return {
      setters: [
        function (_constants_ts_3_1) {
          _constants_ts_3 = _constants_ts_3_1;
        },
        function (_util_ts_2_1) {
          _util_ts_2 = _util_ts_2_1;
        },
      ],
      execute: function () {
        cwd = Deno.cwd;
        exports_16("sep", sep = "/");
        exports_16("delimiter", delimiter = ":");
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/path/separator",
  [],
  function (exports_17, context_17) {
    "use strict";
    var isWindows, SEP, SEP_PATTERN;
    var __moduleName = context_17 && context_17.id;
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        isWindows = Deno.build.os == "windows";
        exports_17("SEP", SEP = isWindows ? "\\" : "/");
        exports_17("SEP_PATTERN", SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/);
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/path/common",
  ["https://deno.land/std@0.52.0/path/separator"],
  function (exports_18, context_18) {
    "use strict";
    var separator_ts_1;
    var __moduleName = context_18 && context_18.id;
    /** Determines the common path from a set of paths, using an optional separator,
     * which defaults to the OS default separator.
     *
     *       import { common } from "https://deno.land/std/path/mod.ts";
     *       const p = common([
     *         "./deno/std/path/mod.ts",
     *         "./deno/std/fs/mod.ts",
     *       ]);
     *       console.log(p); // "./deno/std/"
     *
     */
    function common(paths, sep = separator_ts_1.SEP) {
      const [first = "", ...remaining] = paths;
      if (first === "" || remaining.length === 0) {
        return first.substring(0, first.lastIndexOf(sep) + 1);
      }
      const parts = first.split(sep);
      let endOfPrefix = parts.length;
      for (const path of remaining) {
        const compare = path.split(sep);
        for (let i = 0; i < endOfPrefix; i++) {
          if (compare[i] !== parts[i]) {
            endOfPrefix = i;
          }
        }
        if (endOfPrefix === 0) {
          return "";
        }
      }
      const prefix = parts.slice(0, endOfPrefix).join(sep);
      return prefix.endsWith(sep) ? prefix : `${prefix}${sep}`;
    }
    exports_18("common", common);
    return {
      setters: [
        function (separator_ts_1_1) {
          separator_ts_1 = separator_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// This file is ported from globrex@0.1.2
// MIT License
// Copyright (c) 2018 Terkel Gjervig Nielsen
System.register(
  "https://deno.land/std@0.52.0/path/_globrex",
  [],
  function (exports_19, context_19) {
    "use strict";
    var isWin,
      SEP,
      SEP_ESC,
      SEP_RAW,
      GLOBSTAR,
      WILDCARD,
      GLOBSTAR_SEGMENT,
      WILDCARD_SEGMENT;
    var __moduleName = context_19 && context_19.id;
    /**
     * Convert any glob pattern to a JavaScript Regexp object
     * @param glob Glob pattern to convert
     * @param opts Configuration object
     * @returns Converted object with string, segments and RegExp object
     */
    function globrex(
      glob,
      {
        extended = false,
        globstar = false,
        strict = false,
        filepath = false,
        flags = "",
      } = {},
    ) {
      const sepPattern = new RegExp(`^${SEP}${strict ? "" : "+"}$`);
      let regex = "";
      let segment = "";
      let pathRegexStr = "";
      const pathSegments = [];
      // If we are doing extended matching, this boolean is true when we are inside
      // a group (eg {*.html,*.js}), and false otherwise.
      let inGroup = false;
      let inRange = false;
      // extglob stack. Keep track of scope
      const ext = [];
      // Helper function to build string and segments
      function add(str, options = { split: false, last: false, only: "" }) {
        const { split, last, only } = options;
        if (only !== "path") {
          regex += str;
        }
        if (filepath && only !== "regex") {
          pathRegexStr += str.match(sepPattern) ? SEP : str;
          if (split) {
            if (last) {
              segment += str;
            }
            if (segment !== "") {
              // change it 'includes'
              if (!flags.includes("g")) {
                segment = `^${segment}$`;
              }
              pathSegments.push(new RegExp(segment, flags));
            }
            segment = "";
          } else {
            segment += str;
          }
        }
      }
      let c, n;
      for (let i = 0; i < glob.length; i++) {
        c = glob[i];
        n = glob[i + 1];
        if (["\\", "$", "^", ".", "="].includes(c)) {
          add(`\\${c}`);
          continue;
        }
        if (c.match(sepPattern)) {
          add(SEP, { split: true });
          if (n != null && n.match(sepPattern) && !strict) {
            regex += "?";
          }
          continue;
        }
        if (c === "(") {
          if (ext.length) {
            add(`${c}?:`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ")") {
          if (ext.length) {
            add(c);
            const type = ext.pop();
            if (type === "@") {
              add("{1}");
            } else if (type === "!") {
              add(WILDCARD);
            } else {
              add(type);
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "|") {
          if (ext.length) {
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "+") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "@" && extended) {
          if (n === "(") {
            ext.push(c);
            continue;
          }
        }
        if (c === "!") {
          if (extended) {
            if (inRange) {
              add("^");
              continue;
            }
            if (n === "(") {
              ext.push(c);
              add("(?!");
              i++;
              continue;
            }
            add(`\\${c}`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "?") {
          if (extended) {
            if (n === "(") {
              ext.push(c);
            } else {
              add(".");
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "[") {
          if (inRange && n === ":") {
            i++; // skip [
            let value = "";
            while (glob[++i] !== ":") {
              value += glob[i];
            }
            if (value === "alnum") {
              add("(?:\\w|\\d)");
            } else if (value === "space") {
              add("\\s");
            } else if (value === "digit") {
              add("\\d");
            }
            i++; // skip last ]
            continue;
          }
          if (extended) {
            inRange = true;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "]") {
          if (extended) {
            inRange = false;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "{") {
          if (extended) {
            inGroup = true;
            add("(?:");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "}") {
          if (extended) {
            inGroup = false;
            add(")");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ",") {
          if (inGroup) {
            add("|");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "*") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          // Move over all consecutive "*"'s.
          // Also store the previous and next characters
          const prevChar = glob[i - 1];
          let starCount = 1;
          while (glob[i + 1] === "*") {
            starCount++;
            i++;
          }
          const nextChar = glob[i + 1];
          if (!globstar) {
            // globstar is disabled, so treat any number of "*" as one
            add(".*");
          } else {
            // globstar is enabled, so determine if this is a globstar segment
            const isGlobstar = starCount > 1 && // multiple "*"'s
              // from the start of the segment
              [SEP_RAW, "/", undefined].includes(prevChar) &&
              // to the end of the segment
              [SEP_RAW, "/", undefined].includes(nextChar);
            if (isGlobstar) {
              // it's a globstar, so match zero or more path segments
              add(GLOBSTAR, { only: "regex" });
              add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
              i++; // move over the "/"
            } else {
              // it's not a globstar, so only match one path segment
              add(WILDCARD, { only: "regex" });
              add(WILDCARD_SEGMENT, { only: "path" });
            }
          }
          continue;
        }
        add(c);
      }
      // When regexp 'g' flag is specified don't
      // constrain the regular expression with ^ & $
      if (!flags.includes("g")) {
        regex = `^${regex}$`;
        segment = `^${segment}$`;
        if (filepath) {
          pathRegexStr = `^${pathRegexStr}$`;
        }
      }
      const result = { regex: new RegExp(regex, flags) };
      // Push the last segment
      if (filepath) {
        pathSegments.push(new RegExp(segment, flags));
        result.path = {
          regex: new RegExp(pathRegexStr, flags),
          segments: pathSegments,
          globstar: new RegExp(
            !flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT,
            flags,
          ),
        };
      }
      return result;
    }
    exports_19("globrex", globrex);
    return {
      setters: [],
      execute: function () {
        isWin = Deno.build.os === "windows";
        SEP = isWin ? `(?:\\\\|\\/)` : `\\/`;
        SEP_ESC = isWin ? `\\\\` : `/`;
        SEP_RAW = isWin ? `\\` : `/`;
        GLOBSTAR = `(?:(?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
        WILDCARD = `(?:[^${SEP_ESC}/]*)`;
        GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
        WILDCARD_SEGMENT = `(?:[^${SEP_ESC}/]*)`;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/path/glob",
  [
    "https://deno.land/std@0.52.0/path/separator",
    "https://deno.land/std@0.52.0/path/_globrex",
    "https://deno.land/std@0.52.0/path/mod",
    "https://deno.land/std@0.52.0/testing/asserts",
  ],
  function (exports_20, context_20) {
    "use strict";
    var separator_ts_2, _globrex_ts_1, mod_ts_1, asserts_ts_4;
    var __moduleName = context_20 && context_20.id;
    /**
     * Generate a regex based on glob pattern and options
     * This was meant to be using the the `fs.walk` function
     * but can be used anywhere else.
     * Examples:
     *
     *     Looking for all the `ts` files:
     *     walkSync(".", {
     *       match: [globToRegExp("*.ts")]
     *     })
     *
     *     Looking for all the `.json` files in any subfolder:
     *     walkSync(".", {
     *       match: [globToRegExp(join("a", "**", "*.json"),{
     *         flags: "g",
     *         extended: true,
     *         globstar: true
     *       })]
     *     })
     *
     * @param glob - Glob pattern to be used
     * @param options - Specific options for the glob pattern
     * @returns A RegExp for the glob pattern
     */
    function globToRegExp(glob, { extended = false, globstar = true } = {}) {
      const result = _globrex_ts_1.globrex(glob, {
        extended,
        globstar,
        strict: false,
        filepath: true,
      });
      asserts_ts_4.assert(result.path != null);
      return result.path.regex;
    }
    exports_20("globToRegExp", globToRegExp);
    /** Test whether the given string is a glob */
    function isGlob(str) {
      const chars = { "{": "}", "(": ")", "[": "]" };
      /* eslint-disable-next-line max-len */
      const regex =
        /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
      if (str === "") {
        return false;
      }
      let match;
      while ((match = regex.exec(str))) {
        if (match[2]) {
          return true;
        }
        let idx = match.index + match[0].length;
        // if an open bracket/brace/paren is escaped,
        // set the index to the next closing character
        const open = match[1];
        const close = open ? chars[open] : null;
        if (open && close) {
          const n = str.indexOf(close, idx);
          if (n !== -1) {
            idx = n + 1;
          }
        }
        str = str.slice(idx);
      }
      return false;
    }
    exports_20("isGlob", isGlob);
    /** Like normalize(), but doesn't collapse "**\/.." when `globstar` is true. */
    function normalizeGlob(glob, { globstar = false } = {}) {
      if (!!glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
      }
      if (!globstar) {
        return mod_ts_1.normalize(glob);
      }
      const s = separator_ts_2.SEP_PATTERN.source;
      const badParentPattern = new RegExp(
        `(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`,
        "g",
      );
      return mod_ts_1.normalize(glob.replace(badParentPattern, "\0")).replace(
        /\0/g,
        "..",
      );
    }
    exports_20("normalizeGlob", normalizeGlob);
    /** Like join(), but doesn't collapse "**\/.." when `globstar` is true. */
    function joinGlobs(globs, { extended = false, globstar = false } = {}) {
      if (!globstar || globs.length == 0) {
        return mod_ts_1.join(...globs);
      }
      if (globs.length === 0) {
        return ".";
      }
      let joined;
      for (const glob of globs) {
        const path = glob;
        if (path.length > 0) {
          if (!joined) {
            joined = path;
          } else {
            joined += `${separator_ts_2.SEP}${path}`;
          }
        }
      }
      if (!joined) {
        return ".";
      }
      return normalizeGlob(joined, { extended, globstar });
    }
    exports_20("joinGlobs", joinGlobs);
    return {
      setters: [
        function (separator_ts_2_1) {
          separator_ts_2 = separator_ts_2_1;
        },
        function (_globrex_ts_1_1) {
          _globrex_ts_1 = _globrex_ts_1_1;
        },
        function (mod_ts_1_1) {
          mod_ts_1 = mod_ts_1_1;
        },
        function (asserts_ts_4_1) {
          asserts_ts_4 = asserts_ts_4_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std@0.52.0/path/mod",
  [
    "https://deno.land/std@0.52.0/path/win32",
    "https://deno.land/std@0.52.0/path/posix",
    "https://deno.land/std@0.52.0/path/common",
    "https://deno.land/std@0.52.0/path/separator",
    "https://deno.land/std@0.52.0/path/interface",
    "https://deno.land/std@0.52.0/path/glob",
  ],
  function (exports_21, context_21) {
    "use strict";
    var _win32,
      _posix,
      isWindows,
      path,
      win32,
      posix,
      basename,
      delimiter,
      dirname,
      extname,
      format,
      fromFileUrl,
      isAbsolute,
      join,
      normalize,
      parse,
      relative,
      resolve,
      sep,
      toNamespacedPath;
    var __moduleName = context_21 && context_21.id;
    var exportedNames_1 = {
      "win32": true,
      "posix": true,
      "basename": true,
      "delimiter": true,
      "dirname": true,
      "extname": true,
      "format": true,
      "fromFileUrl": true,
      "isAbsolute": true,
      "join": true,
      "normalize": true,
      "parse": true,
      "relative": true,
      "resolve": true,
      "sep": true,
      "toNamespacedPath": true,
      "SEP": true,
      "SEP_PATTERN": true,
    };
    function exportStar_2(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) {
          exports[n] = m[n];
        }
      }
      exports_21(exports);
    }
    return {
      setters: [
        function (_win32_1) {
          _win32 = _win32_1;
        },
        function (_posix_1) {
          _posix = _posix_1;
        },
        function (common_ts_1_1) {
          exportStar_2(common_ts_1_1);
        },
        function (separator_ts_3_1) {
          exports_21({
            "SEP": separator_ts_3_1["SEP"],
            "SEP_PATTERN": separator_ts_3_1["SEP_PATTERN"],
          });
        },
        function (interface_ts_1_1) {
          exportStar_2(interface_ts_1_1);
        },
        function (glob_ts_1_1) {
          exportStar_2(glob_ts_1_1);
        },
      ],
      execute: function () {
        isWindows = Deno.build.os == "windows";
        path = isWindows ? _win32 : _posix;
        exports_21("win32", win32 = _win32);
        exports_21("posix", posix = _posix);
        exports_21("basename", basename = path.basename),
          exports_21("delimiter", delimiter = path.delimiter),
          exports_21("dirname", dirname = path.dirname),
          exports_21("extname", extname = path.extname),
          exports_21("format", format = path.format),
          exports_21("fromFileUrl", fromFileUrl = path.fromFileUrl),
          exports_21("isAbsolute", isAbsolute = path.isAbsolute),
          exports_21("join", join = path.join),
          exports_21("normalize", normalize = path.normalize),
          exports_21("parse", parse = path.parse),
          exports_21("relative", relative = path.relative),
          exports_21("resolve", resolve = path.resolve),
          exports_21("sep", sep = path.sep),
          exports_21(
            "toNamespacedPath",
            toNamespacedPath = path.toNamespacedPath,
          );
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/empty_dir",
  ["https://deno.land/std@0.52.0/path/mod"],
  function (exports_22, context_22) {
    "use strict";
    var mod_ts_2, readDir, readDirSync, mkdir, mkdirSync, remove, removeSync;
    var __moduleName = context_22 && context_22.id;
    /**
     * Ensures that a directory is empty.
     * Deletes directory contents if the directory is not empty.
     * If the directory does not exist, it is created.
     * The directory itself is not deleted.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    async function emptyDir(dir) {
      try {
        const items = [];
        for await (const dirEntry of readDir(dir)) {
          items.push(dirEntry);
        }
        while (items.length) {
          const item = items.shift();
          if (item && item.name) {
            const filepath = mod_ts_2.join(dir, item.name);
            await remove(filepath, { recursive: true });
          }
        }
      } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
          throw err;
        }
        // if not exist. then create it
        await mkdir(dir, { recursive: true });
      }
    }
    exports_22("emptyDir", emptyDir);
    /**
     * Ensures that a directory is empty.
     * Deletes directory contents if the directory is not empty.
     * If the directory does not exist, it is created.
     * The directory itself is not deleted.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    function emptyDirSync(dir) {
      try {
        const items = [...readDirSync(dir)];
        // If the directory exists, remove all entries inside it.
        while (items.length) {
          const item = items.shift();
          if (item && item.name) {
            const filepath = mod_ts_2.join(dir, item.name);
            removeSync(filepath, { recursive: true });
          }
        }
      } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
          throw err;
        }
        // if not exist. then create it
        mkdirSync(dir, { recursive: true });
        return;
      }
    }
    exports_22("emptyDirSync", emptyDirSync);
    return {
      setters: [
        function (mod_ts_2_1) {
          mod_ts_2 = mod_ts_2_1;
        },
      ],
      execute: function () {
        readDir = Deno.readDir,
          readDirSync = Deno.readDirSync,
          mkdir = Deno.mkdir,
          mkdirSync = Deno.mkdirSync,
          remove = Deno.remove,
          removeSync = Deno.removeSync;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/_util",
  ["https://deno.land/std@0.52.0/path/mod"],
  function (exports_23, context_23) {
    "use strict";
    var path;
    var __moduleName = context_23 && context_23.id;
    /**
     * Test whether or not `dest` is a sub-directory of `src`
     * @param src src file path
     * @param dest dest file path
     * @param sep path separator
     */
    function isSubdir(src, dest, sep = path.sep) {
      if (src === dest) {
        return false;
      }
      const srcArray = src.split(sep);
      const destArray = dest.split(sep);
      return srcArray.every((current, i) => destArray[i] === current);
    }
    exports_23("isSubdir", isSubdir);
    /**
     * Get a human readable file type string.
     *
     * @param fileInfo A FileInfo describes a file and is returned by `stat`,
     *                 `lstat`
     */
    function getFileInfoType(fileInfo) {
      return fileInfo.isFile ? "file" : fileInfo.isDirectory
      ? "dir"
      : fileInfo.isSymlink
      ? "symlink"
      : undefined;
    }
    exports_23("getFileInfoType", getFileInfoType);
    return {
      setters: [
        function (path_1) {
          path = path_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/ensure_dir",
  ["https://deno.land/std@0.52.0/fs/_util"],
  function (exports_24, context_24) {
    "use strict";
    var _util_ts_3, lstat, lstatSync, mkdir, mkdirSync;
    var __moduleName = context_24 && context_24.id;
    /**
     * Ensures that the directory exists.
     * If the directory structure does not exist, it is created. Like mkdir -p.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    async function ensureDir(dir) {
      try {
        const fileInfo = await lstat(dir);
        if (!fileInfo.isDirectory) {
          throw new Error(
            `Ensure path exists, expected 'dir', got '${
              _util_ts_3.getFileInfoType(fileInfo)
            }'`,
          );
        }
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          // if dir not exists. then create it.
          await mkdir(dir, { recursive: true });
          return;
        }
        throw err;
      }
    }
    exports_24("ensureDir", ensureDir);
    /**
     * Ensures that the directory exists.
     * If the directory structure does not exist, it is created. Like mkdir -p.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    function ensureDirSync(dir) {
      try {
        const fileInfo = lstatSync(dir);
        if (!fileInfo.isDirectory) {
          throw new Error(
            `Ensure path exists, expected 'dir', got '${
              _util_ts_3.getFileInfoType(fileInfo)
            }'`,
          );
        }
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          // if dir not exists. then create it.
          mkdirSync(dir, { recursive: true });
          return;
        }
        throw err;
      }
    }
    exports_24("ensureDirSync", ensureDirSync);
    return {
      setters: [
        function (_util_ts_3_1) {
          _util_ts_3 = _util_ts_3_1;
        },
      ],
      execute: function () {
        lstat = Deno.lstat,
          lstatSync = Deno.lstatSync,
          mkdir = Deno.mkdir,
          mkdirSync = Deno.mkdirSync;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/ensure_file",
  [
    "https://deno.land/std@0.52.0/path/mod",
    "https://deno.land/std@0.52.0/fs/ensure_dir",
    "https://deno.land/std@0.52.0/fs/_util",
  ],
  function (exports_25, context_25) {
    "use strict";
    var path,
      ensure_dir_ts_1,
      _util_ts_4,
      lstat,
      lstatSync,
      writeFile,
      writeFileSync;
    var __moduleName = context_25 && context_25.id;
    /**
     * Ensures that the file exists.
     * If the file that is requested to be created is in directories that do not
     * exist.
     * these directories are created. If the file already exists,
     * it is NOTMODIFIED.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    async function ensureFile(filePath) {
      try {
        // if file exists
        const stat = await lstat(filePath);
        if (!stat.isFile) {
          throw new Error(
            `Ensure path exists, expected 'file', got '${
              _util_ts_4.getFileInfoType(stat)
            }'`,
          );
        }
      } catch (err) {
        // if file not exists
        if (err instanceof Deno.errors.NotFound) {
          // ensure dir exists
          await ensure_dir_ts_1.ensureDir(path.dirname(filePath));
          // create file
          await writeFile(filePath, new Uint8Array());
          return;
        }
        throw err;
      }
    }
    exports_25("ensureFile", ensureFile);
    /**
     * Ensures that the file exists.
     * If the file that is requested to be created is in directories that do not
     * exist,
     * these directories are created. If the file already exists,
     * it is NOT MODIFIED.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    function ensureFileSync(filePath) {
      try {
        // if file exists
        const stat = lstatSync(filePath);
        if (!stat.isFile) {
          throw new Error(
            `Ensure path exists, expected 'file', got '${
              _util_ts_4.getFileInfoType(stat)
            }'`,
          );
        }
      } catch (err) {
        // if file not exists
        if (err instanceof Deno.errors.NotFound) {
          // ensure dir exists
          ensure_dir_ts_1.ensureDirSync(path.dirname(filePath));
          // create file
          writeFileSync(filePath, new Uint8Array());
          return;
        }
        throw err;
      }
    }
    exports_25("ensureFileSync", ensureFileSync);
    return {
      setters: [
        function (path_2) {
          path = path_2;
        },
        function (ensure_dir_ts_1_1) {
          ensure_dir_ts_1 = ensure_dir_ts_1_1;
        },
        function (_util_ts_4_1) {
          _util_ts_4 = _util_ts_4_1;
        },
      ],
      execute: function () {
        lstat = Deno.lstat,
          lstatSync = Deno.lstatSync,
          writeFile = Deno.writeFile,
          writeFileSync = Deno.writeFileSync;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/ensure_link",
  [
    "https://deno.land/std@0.52.0/path/mod",
    "https://deno.land/std@0.52.0/fs/ensure_dir",
    "https://deno.land/std@0.52.0/fs/exists",
    "https://deno.land/std@0.52.0/fs/_util",
  ],
  function (exports_26, context_26) {
    "use strict";
    var path, ensure_dir_ts_2, exists_ts_2, _util_ts_5;
    var __moduleName = context_26 && context_26.id;
    /**
     * Ensures that the hard link exists.
     * If the directory structure does not exist, it is created.
     *
     * @param src the source file path. Directory hard links are not allowed.
     * @param dest the destination link path
     */
    async function ensureLink(src, dest) {
      if (await exists_ts_2.exists(dest)) {
        const destStatInfo = await Deno.lstat(dest);
        const destFilePathType = _util_ts_5.getFileInfoType(destStatInfo);
        if (destFilePathType !== "file") {
          throw new Error(
            `Ensure path exists, expected 'file', got '${destFilePathType}'`,
          );
        }
        return;
      }
      await ensure_dir_ts_2.ensureDir(path.dirname(dest));
      await Deno.link(src, dest);
    }
    exports_26("ensureLink", ensureLink);
    /**
     * Ensures that the hard link exists.
     * If the directory structure does not exist, it is created.
     *
     * @param src the source file path. Directory hard links are not allowed.
     * @param dest the destination link path
     */
    function ensureLinkSync(src, dest) {
      if (exists_ts_2.existsSync(dest)) {
        const destStatInfo = Deno.lstatSync(dest);
        const destFilePathType = _util_ts_5.getFileInfoType(destStatInfo);
        if (destFilePathType !== "file") {
          throw new Error(
            `Ensure path exists, expected 'file', got '${destFilePathType}'`,
          );
        }
        return;
      }
      ensure_dir_ts_2.ensureDirSync(path.dirname(dest));
      Deno.linkSync(src, dest);
    }
    exports_26("ensureLinkSync", ensureLinkSync);
    return {
      setters: [
        function (path_3) {
          path = path_3;
        },
        function (ensure_dir_ts_2_1) {
          ensure_dir_ts_2 = ensure_dir_ts_2_1;
        },
        function (exists_ts_2_1) {
          exists_ts_2 = exists_ts_2_1;
        },
        function (_util_ts_5_1) {
          _util_ts_5 = _util_ts_5_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/ensure_symlink",
  [
    "https://deno.land/std@0.52.0/path/mod",
    "https://deno.land/std@0.52.0/fs/ensure_dir",
    "https://deno.land/std@0.52.0/fs/exists",
    "https://deno.land/std@0.52.0/fs/_util",
  ],
  function (exports_27, context_27) {
    "use strict";
    var path, ensure_dir_ts_3, exists_ts_3, _util_ts_6;
    var __moduleName = context_27 && context_27.id;
    /**
     * Ensures that the link exists.
     * If the directory structure does not exist, it is created.
     *
     * @param src the source file path
     * @param dest the destination link path
     */
    async function ensureSymlink(src, dest) {
      const srcStatInfo = await Deno.lstat(src);
      const srcFilePathType = _util_ts_6.getFileInfoType(srcStatInfo);
      if (await exists_ts_3.exists(dest)) {
        const destStatInfo = await Deno.lstat(dest);
        const destFilePathType = _util_ts_6.getFileInfoType(destStatInfo);
        if (destFilePathType !== "symlink") {
          throw new Error(
            `Ensure path exists, expected 'symlink', got '${destFilePathType}'`,
          );
        }
        return;
      }
      await ensure_dir_ts_3.ensureDir(path.dirname(dest));
      ensure_dir_ts_3.ensureDirSync(path.dirname(dest));
      if (Deno.build.os === "windows") {
        await Deno.symlink(src, dest, {
          type: srcFilePathType === "dir" ? "dir" : "file",
        });
      } else {
        await Deno.symlink(src, dest);
      }
    }
    exports_27("ensureSymlink", ensureSymlink);
    /**
     * Ensures that the link exists.
     * If the directory structure does not exist, it is created.
     *
     * @param src the source file path
     * @param dest the destination link path
     */
    function ensureSymlinkSync(src, dest) {
      const srcStatInfo = Deno.lstatSync(src);
      const srcFilePathType = _util_ts_6.getFileInfoType(srcStatInfo);
      if (exists_ts_3.existsSync(dest)) {
        const destStatInfo = Deno.lstatSync(dest);
        const destFilePathType = _util_ts_6.getFileInfoType(destStatInfo);
        if (destFilePathType !== "symlink") {
          throw new Error(
            `Ensure path exists, expected 'symlink', got '${destFilePathType}'`,
          );
        }
        return;
      }
      ensure_dir_ts_3.ensureDirSync(path.dirname(dest));
      if (Deno.build.os === "windows") {
        Deno.symlinkSync(src, dest, {
          type: srcFilePathType === "dir" ? "dir" : "file",
        });
      } else {
        Deno.symlinkSync(src, dest);
      }
    }
    exports_27("ensureSymlinkSync", ensureSymlinkSync);
    return {
      setters: [
        function (path_4) {
          path = path_4;
        },
        function (ensure_dir_ts_3_1) {
          ensure_dir_ts_3 = ensure_dir_ts_3_1;
        },
        function (exists_ts_3_1) {
          exists_ts_3 = exists_ts_3_1;
        },
        function (_util_ts_6_1) {
          _util_ts_6 = _util_ts_6_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/walk",
  [
    "https://deno.land/std@0.52.0/testing/asserts",
    "https://deno.land/std@0.52.0/path/mod",
  ],
  function (exports_28, context_28) {
    "use strict";
    var asserts_ts_5, mod_ts_3, readDir, readDirSync, stat, statSync;
    var __moduleName = context_28 && context_28.id;
    function createWalkEntrySync(path) {
      path = mod_ts_3.normalize(path);
      const name = mod_ts_3.basename(path);
      const info = statSync(path);
      return {
        path,
        name,
        isFile: info.isFile,
        isDirectory: info.isDirectory,
        isSymlink: info.isSymlink,
      };
    }
    exports_28("createWalkEntrySync", createWalkEntrySync);
    async function createWalkEntry(path) {
      path = mod_ts_3.normalize(path);
      const name = mod_ts_3.basename(path);
      const info = await stat(path);
      return {
        path,
        name,
        isFile: info.isFile,
        isDirectory: info.isDirectory,
        isSymlink: info.isSymlink,
      };
    }
    exports_28("createWalkEntry", createWalkEntry);
    function include(path, exts, match, skip) {
      if (exts && !exts.some((ext) => path.endsWith(ext))) {
        return false;
      }
      if (match && !match.some((pattern) => !!path.match(pattern))) {
        return false;
      }
      if (skip && skip.some((pattern) => !!path.match(pattern))) {
        return false;
      }
      return true;
    }
    /** Walks the file tree rooted at root, yielding each file or directory in the
     * tree filtered according to the given options. The files are walked in lexical
     * order, which makes the output deterministic but means that for very large
     * directories walk() can be inefficient.
     *
     * Options:
     * - maxDepth?: number = Infinity;
     * - includeFiles?: boolean = true;
     * - includeDirs?: boolean = true;
     * - followSymlinks?: boolean = false;
     * - exts?: string[];
     * - match?: RegExp[];
     * - skip?: RegExp[];
     *
     *      for await (const entry of walk(".")) {
     *        console.log(entry.path);
     *        assert(entry.isFile);
     *      };
     */
    async function* walk(
      root,
      {
        maxDepth = Infinity,
        includeFiles = true,
        includeDirs = true,
        followSymlinks = false,
        exts = undefined,
        match = undefined,
        skip = undefined,
      } = {},
    ) {
      if (maxDepth < 0) {
        return;
      }
      if (includeDirs && include(root, exts, match, skip)) {
        yield await createWalkEntry(root);
      }
      if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
      }
      for await (const entry of readDir(root)) {
        if (entry.isSymlink) {
          if (followSymlinks) {
            // TODO(ry) Re-enable followSymlinks.
            asserts_ts_5.unimplemented();
          } else {
            continue;
          }
        }
        asserts_ts_5.assert(entry.name != null);
        const path = mod_ts_3.join(root, entry.name);
        if (entry.isFile) {
          if (includeFiles && include(path, exts, match, skip)) {
            yield { path, ...entry };
          }
        } else {
          yield* walk(path, {
            maxDepth: maxDepth - 1,
            includeFiles,
            includeDirs,
            followSymlinks,
            exts,
            match,
            skip,
          });
        }
      }
    }
    exports_28("walk", walk);
    /** Same as walk() but uses synchronous ops */
    function* walkSync(
      root,
      {
        maxDepth = Infinity,
        includeFiles = true,
        includeDirs = true,
        followSymlinks = false,
        exts = undefined,
        match = undefined,
        skip = undefined,
      } = {},
    ) {
      if (maxDepth < 0) {
        return;
      }
      if (includeDirs && include(root, exts, match, skip)) {
        yield createWalkEntrySync(root);
      }
      if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
      }
      for (const entry of readDirSync(root)) {
        if (entry.isSymlink) {
          if (followSymlinks) {
            asserts_ts_5.unimplemented();
          } else {
            continue;
          }
        }
        asserts_ts_5.assert(entry.name != null);
        const path = mod_ts_3.join(root, entry.name);
        if (entry.isFile) {
          if (includeFiles && include(path, exts, match, skip)) {
            yield { path, ...entry };
          }
        } else {
          yield* walkSync(path, {
            maxDepth: maxDepth - 1,
            includeFiles,
            includeDirs,
            followSymlinks,
            exts,
            match,
            skip,
          });
        }
      }
    }
    exports_28("walkSync", walkSync);
    return {
      setters: [
        function (asserts_ts_5_1) {
          asserts_ts_5 = asserts_ts_5_1;
        },
        function (mod_ts_3_1) {
          mod_ts_3 = mod_ts_3_1;
        },
      ],
      execute: function () {
        readDir = Deno.readDir,
          readDirSync = Deno.readDirSync,
          stat = Deno.stat,
          statSync = Deno.statSync;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/expand_glob",
  [
    "https://deno.land/std@0.52.0/path/mod",
    "https://deno.land/std@0.52.0/fs/walk",
    "https://deno.land/std@0.52.0/testing/asserts",
  ],
  function (exports_29, context_29) {
    "use strict";
    var mod_ts_4, walk_ts_1, asserts_ts_6, cwd, isWindows;
    var __moduleName = context_29 && context_29.id;
    // TODO: Maybe make this public somewhere.
    function split(path) {
      const s = mod_ts_4.SEP_PATTERN.source;
      const segments = path
        .replace(new RegExp(`^${s}|${s}$`, "g"), "")
        .split(mod_ts_4.SEP_PATTERN);
      const isAbsolute_ = mod_ts_4.isAbsolute(path);
      return {
        segments,
        isAbsolute: isAbsolute_,
        hasTrailingSep: !!path.match(new RegExp(`${s}$`)),
        winRoot: isWindows && isAbsolute_ ? segments.shift() : undefined,
      };
    }
    function throwUnlessNotFound(error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
    function comparePath(a, b) {
      if (a.path < b.path) {
        return -1;
      }
      if (a.path > b.path) {
        return 1;
      }
      return 0;
    }
    /**
     * Expand the glob string from the specified `root` directory and yield each
     * result as a `WalkEntry` object.
     */
    async function* expandGlob(
      glob,
      {
        root = cwd(),
        exclude = [],
        includeDirs = true,
        extended = false,
        globstar = false,
      } = {},
    ) {
      const globOptions = { extended, globstar };
      const absRoot = mod_ts_4.isAbsolute(root) ? mod_ts_4.normalize(root)
      : mod_ts_4.joinGlobs([cwd(), root], globOptions);
      const resolveFromRoot = (path) =>
        mod_ts_4.isAbsolute(path)
          ? mod_ts_4.normalize(path)
          : mod_ts_4.joinGlobs([absRoot, path], globOptions);
      const excludePatterns = exclude
        .map(resolveFromRoot)
        .map((s) => mod_ts_4.globToRegExp(s, globOptions));
      const shouldInclude = (path) =>
        !excludePatterns.some((p) => !!path.match(p));
      const { segments, hasTrailingSep, winRoot } = split(
        resolveFromRoot(glob),
      );
      let fixedRoot = winRoot != undefined ? winRoot : "/";
      while (segments.length > 0 && !mod_ts_4.isGlob(segments[0])) {
        const seg = segments.shift();
        asserts_ts_6.assert(seg != null);
        fixedRoot = mod_ts_4.joinGlobs([fixedRoot, seg], globOptions);
      }
      let fixedRootInfo;
      try {
        fixedRootInfo = await walk_ts_1.createWalkEntry(fixedRoot);
      } catch (error) {
        return throwUnlessNotFound(error);
      }
      async function* advanceMatch(walkInfo, globSegment) {
        if (!walkInfo.isDirectory) {
          return;
        } else if (globSegment == "..") {
          const parentPath = mod_ts_4.joinGlobs(
            [walkInfo.path, ".."],
            globOptions,
          );
          try {
            if (shouldInclude(parentPath)) {
              return yield await walk_ts_1.createWalkEntry(parentPath);
            }
          } catch (error) {
            throwUnlessNotFound(error);
          }
          return;
        } else if (globSegment == "**") {
          return yield* walk_ts_1.walk(walkInfo.path, {
            includeFiles: false,
            skip: excludePatterns,
          });
        }
        yield* walk_ts_1.walk(walkInfo.path, {
          maxDepth: 1,
          match: [
            mod_ts_4.globToRegExp(
              mod_ts_4.joinGlobs([walkInfo.path, globSegment], globOptions),
              globOptions,
            ),
          ],
          skip: excludePatterns,
        });
      }
      let currentMatches = [fixedRootInfo];
      for (const segment of segments) {
        // Advancing the list of current matches may introduce duplicates, so we
        // pass everything through this Map.
        const nextMatchMap = new Map();
        for (const currentMatch of currentMatches) {
          for await (const nextMatch of advanceMatch(currentMatch, segment)) {
            nextMatchMap.set(nextMatch.path, nextMatch);
          }
        }
        currentMatches = [...nextMatchMap.values()].sort(comparePath);
      }
      if (hasTrailingSep) {
        currentMatches = currentMatches.filter((entry) => entry.isDirectory);
      }
      if (!includeDirs) {
        currentMatches = currentMatches.filter((entry) => !entry.isDirectory);
      }
      yield* currentMatches;
    }
    exports_29("expandGlob", expandGlob);
    /** Synchronous version of `expandGlob()`. */
    function* expandGlobSync(
      glob,
      {
        root = cwd(),
        exclude = [],
        includeDirs = true,
        extended = false,
        globstar = false,
      } = {},
    ) {
      const globOptions = { extended, globstar };
      const absRoot = mod_ts_4.isAbsolute(root) ? mod_ts_4.normalize(root)
      : mod_ts_4.joinGlobs([cwd(), root], globOptions);
      const resolveFromRoot = (path) =>
        mod_ts_4.isAbsolute(path) ? mod_ts_4.normalize(path)
        : mod_ts_4.joinGlobs([absRoot, path], globOptions);
      const excludePatterns = exclude
        .map(resolveFromRoot)
        .map((s) => mod_ts_4.globToRegExp(s, globOptions));
      const shouldInclude = (path) =>
        !excludePatterns.some((p) => !!path.match(p));
      const { segments, hasTrailingSep, winRoot } = split(
        resolveFromRoot(glob),
      );
      let fixedRoot = winRoot != undefined ? winRoot : "/";
      while (segments.length > 0 && !mod_ts_4.isGlob(segments[0])) {
        const seg = segments.shift();
        asserts_ts_6.assert(seg != null);
        fixedRoot = mod_ts_4.joinGlobs([fixedRoot, seg], globOptions);
      }
      let fixedRootInfo;
      try {
        fixedRootInfo = walk_ts_1.createWalkEntrySync(fixedRoot);
      } catch (error) {
        return throwUnlessNotFound(error);
      }
      function* advanceMatch(walkInfo, globSegment) {
        if (!walkInfo.isDirectory) {
          return;
        } else if (globSegment == "..") {
          const parentPath = mod_ts_4.joinGlobs(
            [walkInfo.path, ".."],
            globOptions,
          );
          try {
            if (shouldInclude(parentPath)) {
              return yield walk_ts_1.createWalkEntrySync(parentPath);
            }
          } catch (error) {
            throwUnlessNotFound(error);
          }
          return;
        } else if (globSegment == "**") {
          return yield* walk_ts_1.walkSync(walkInfo.path, {
            includeFiles: false,
            skip: excludePatterns,
          });
        }
        yield* walk_ts_1.walkSync(walkInfo.path, {
          maxDepth: 1,
          match: [
            mod_ts_4.globToRegExp(
              mod_ts_4.joinGlobs([walkInfo.path, globSegment], globOptions),
              globOptions,
            ),
          ],
          skip: excludePatterns,
        });
      }
      let currentMatches = [fixedRootInfo];
      for (const segment of segments) {
        // Advancing the list of current matches may introduce duplicates, so we
        // pass everything through this Map.
        const nextMatchMap = new Map();
        for (const currentMatch of currentMatches) {
          for (const nextMatch of advanceMatch(currentMatch, segment)) {
            nextMatchMap.set(nextMatch.path, nextMatch);
          }
        }
        currentMatches = [...nextMatchMap.values()].sort(comparePath);
      }
      if (hasTrailingSep) {
        currentMatches = currentMatches.filter((entry) => entry.isDirectory);
      }
      if (!includeDirs) {
        currentMatches = currentMatches.filter((entry) => !entry.isDirectory);
      }
      yield* currentMatches;
    }
    exports_29("expandGlobSync", expandGlobSync);
    return {
      setters: [
        function (mod_ts_4_1) {
          mod_ts_4 = mod_ts_4_1;
        },
        function (walk_ts_1_1) {
          walk_ts_1 = walk_ts_1_1;
        },
        function (asserts_ts_6_1) {
          asserts_ts_6 = asserts_ts_6_1;
        },
      ],
      execute: function () {
        cwd = Deno.cwd;
        isWindows = Deno.build.os == "windows";
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/move",
  [
    "https://deno.land/std@0.52.0/fs/exists",
    "https://deno.land/std@0.52.0/fs/_util",
  ],
  function (exports_30, context_30) {
    "use strict";
    var exists_ts_4, _util_ts_7;
    var __moduleName = context_30 && context_30.id;
    /** Moves a file or directory */
    async function move(src, dest, { overwrite = false } = {}) {
      const srcStat = await Deno.stat(src);
      if (srcStat.isDirectory && _util_ts_7.isSubdir(src, dest)) {
        throw new Error(
          `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`,
        );
      }
      if (overwrite) {
        if (await exists_ts_4.exists(dest)) {
          await Deno.remove(dest, { recursive: true });
        }
        await Deno.rename(src, dest);
      } else {
        if (await exists_ts_4.exists(dest)) {
          throw new Error("dest already exists.");
        }
        await Deno.rename(src, dest);
      }
      return;
    }
    exports_30("move", move);
    /** Moves a file or directory synchronously */
    function moveSync(src, dest, { overwrite = false } = {}) {
      const srcStat = Deno.statSync(src);
      if (srcStat.isDirectory && _util_ts_7.isSubdir(src, dest)) {
        throw new Error(
          `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`,
        );
      }
      if (overwrite) {
        if (exists_ts_4.existsSync(dest)) {
          Deno.removeSync(dest, { recursive: true });
        }
        Deno.renameSync(src, dest);
      } else {
        if (exists_ts_4.existsSync(dest)) {
          throw new Error("dest already exists.");
        }
        Deno.renameSync(src, dest);
      }
    }
    exports_30("moveSync", moveSync);
    return {
      setters: [
        function (exists_ts_4_1) {
          exists_ts_4 = exists_ts_4_1;
        },
        function (_util_ts_7_1) {
          _util_ts_7 = _util_ts_7_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/copy",
  [
    "https://deno.land/std@0.52.0/path/mod",
    "https://deno.land/std@0.52.0/fs/ensure_dir",
    "https://deno.land/std@0.52.0/fs/_util",
    "https://deno.land/std@0.52.0/testing/asserts",
  ],
  function (exports_31, context_31) {
    "use strict";
    var path, ensure_dir_ts_4, _util_ts_8, asserts_ts_7, isWindows;
    var __moduleName = context_31 && context_31.id;
    async function ensureValidCopy(src, dest, options, isCopyFolder = false) {
      let destStat;
      try {
        destStat = await Deno.lstat(dest);
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          return;
        }
        throw err;
      }
      if (isCopyFolder && !destStat.isDirectory) {
        throw new Error(
          `Cannot overwrite non-directory '${dest}' with directory '${src}'.`,
        );
      }
      if (!options.overwrite) {
        throw new Error(`'${dest}' already exists.`);
      }
      return destStat;
    }
    function ensureValidCopySync(src, dest, options, isCopyFolder = false) {
      let destStat;
      try {
        destStat = Deno.lstatSync(dest);
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          return;
        }
        throw err;
      }
      if (isCopyFolder && !destStat.isDirectory) {
        throw new Error(
          `Cannot overwrite non-directory '${dest}' with directory '${src}'.`,
        );
      }
      if (!options.overwrite) {
        throw new Error(`'${dest}' already exists.`);
      }
      return destStat;
    }
    /* copy file to dest */
    async function copyFile(src, dest, options) {
      await ensureValidCopy(src, dest, options);
      await Deno.copyFile(src, dest);
      if (options.preserveTimestamps) {
        const statInfo = await Deno.stat(src);
        asserts_ts_7.assert(
          statInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_7.assert(
          statInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        await Deno.utime(dest, statInfo.atime, statInfo.mtime);
      }
    }
    /* copy file to dest synchronously */
    function copyFileSync(src, dest, options) {
      ensureValidCopySync(src, dest, options);
      Deno.copyFileSync(src, dest);
      if (options.preserveTimestamps) {
        const statInfo = Deno.statSync(src);
        asserts_ts_7.assert(
          statInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_7.assert(
          statInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        Deno.utimeSync(dest, statInfo.atime, statInfo.mtime);
      }
    }
    /* copy symlink to dest */
    async function copySymLink(src, dest, options) {
      await ensureValidCopy(src, dest, options);
      const originSrcFilePath = await Deno.readLink(src);
      const type = _util_ts_8.getFileInfoType(await Deno.lstat(src));
      if (isWindows) {
        await Deno.symlink(originSrcFilePath, dest, {
          type: type === "dir" ? "dir" : "file",
        });
      } else {
        await Deno.symlink(originSrcFilePath, dest);
      }
      if (options.preserveTimestamps) {
        const statInfo = await Deno.lstat(src);
        asserts_ts_7.assert(
          statInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_7.assert(
          statInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        await Deno.utime(dest, statInfo.atime, statInfo.mtime);
      }
    }
    /* copy symlink to dest synchronously */
    function copySymlinkSync(src, dest, options) {
      ensureValidCopySync(src, dest, options);
      const originSrcFilePath = Deno.readLinkSync(src);
      const type = _util_ts_8.getFileInfoType(Deno.lstatSync(src));
      if (isWindows) {
        Deno.symlinkSync(originSrcFilePath, dest, {
          type: type === "dir" ? "dir" : "file",
        });
      } else {
        Deno.symlinkSync(originSrcFilePath, dest);
      }
      if (options.preserveTimestamps) {
        const statInfo = Deno.lstatSync(src);
        asserts_ts_7.assert(
          statInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_7.assert(
          statInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        Deno.utimeSync(dest, statInfo.atime, statInfo.mtime);
      }
    }
    /* copy folder from src to dest. */
    async function copyDir(src, dest, options) {
      const destStat = await ensureValidCopy(src, dest, options, true);
      if (!destStat) {
        await ensure_dir_ts_4.ensureDir(dest);
      }
      if (options.preserveTimestamps) {
        const srcStatInfo = await Deno.stat(src);
        asserts_ts_7.assert(
          srcStatInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_7.assert(
          srcStatInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        await Deno.utime(dest, srcStatInfo.atime, srcStatInfo.mtime);
      }
      for await (const entry of Deno.readDir(src)) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, path.basename(srcPath));
        if (entry.isSymlink) {
          await copySymLink(srcPath, destPath, options);
        } else if (entry.isDirectory) {
          await copyDir(srcPath, destPath, options);
        } else if (entry.isFile) {
          await copyFile(srcPath, destPath, options);
        }
      }
    }
    /* copy folder from src to dest synchronously */
    function copyDirSync(src, dest, options) {
      const destStat = ensureValidCopySync(src, dest, options, true);
      if (!destStat) {
        ensure_dir_ts_4.ensureDirSync(dest);
      }
      if (options.preserveTimestamps) {
        const srcStatInfo = Deno.statSync(src);
        asserts_ts_7.assert(
          srcStatInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_7.assert(
          srcStatInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        Deno.utimeSync(dest, srcStatInfo.atime, srcStatInfo.mtime);
      }
      for (const entry of Deno.readDirSync(src)) {
        asserts_ts_7.assert(entry.name != null, "file.name must be set");
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, path.basename(srcPath));
        if (entry.isSymlink) {
          copySymlinkSync(srcPath, destPath, options);
        } else if (entry.isDirectory) {
          copyDirSync(srcPath, destPath, options);
        } else if (entry.isFile) {
          copyFileSync(srcPath, destPath, options);
        }
      }
    }
    /**
     * Copy a file or directory. The directory can have contents. Like `cp -r`.
     * Requires the `--allow-read` and `--allow-write` flag.
     * @param src the file/directory path.
     *            Note that if `src` is a directory it will copy everything inside
     *            of this directory, not the entire directory itself
     * @param dest the destination path. Note that if `src` is a file, `dest` cannot
     *             be a directory
     * @param options
     */
    async function copy(src, dest, options = {}) {
      src = path.resolve(src);
      dest = path.resolve(dest);
      if (src === dest) {
        throw new Error("Source and destination cannot be the same.");
      }
      const srcStat = await Deno.lstat(src);
      if (srcStat.isDirectory && _util_ts_8.isSubdir(src, dest)) {
        throw new Error(
          `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`,
        );
      }
      if (srcStat.isSymlink) {
        await copySymLink(src, dest, options);
      } else if (srcStat.isDirectory) {
        await copyDir(src, dest, options);
      } else if (srcStat.isFile) {
        await copyFile(src, dest, options);
      }
    }
    exports_31("copy", copy);
    /**
     * Copy a file or directory. The directory can have contents. Like `cp -r`.
     * Requires the `--allow-read` and `--allow-write` flag.
     * @param src the file/directory path.
     *            Note that if `src` is a directory it will copy everything inside
     *            of this directory, not the entire directory itself
     * @param dest the destination path. Note that if `src` is a file, `dest` cannot
     *             be a directory
     * @param options
     */
    function copySync(src, dest, options = {}) {
      src = path.resolve(src);
      dest = path.resolve(dest);
      if (src === dest) {
        throw new Error("Source and destination cannot be the same.");
      }
      const srcStat = Deno.lstatSync(src);
      if (srcStat.isDirectory && _util_ts_8.isSubdir(src, dest)) {
        throw new Error(
          `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`,
        );
      }
      if (srcStat.isSymlink) {
        copySymlinkSync(src, dest, options);
      } else if (srcStat.isDirectory) {
        copyDirSync(src, dest, options);
      } else if (srcStat.isFile) {
        copyFileSync(src, dest, options);
      }
    }
    exports_31("copySync", copySync);
    return {
      setters: [
        function (path_5) {
          path = path_5;
        },
        function (ensure_dir_ts_4_1) {
          ensure_dir_ts_4 = ensure_dir_ts_4_1;
        },
        function (_util_ts_8_1) {
          _util_ts_8 = _util_ts_8_1;
        },
        function (asserts_ts_7_1) {
          asserts_ts_7 = asserts_ts_7_1;
        },
      ],
      execute: function () {
        isWindows = Deno.build.os === "windows";
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/fs/read_file_str",
  [],
  function (exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    /**
     * Read file synchronously and output it as a string.
     *
     * @param filename File to read
     * @param opts Read options
     */
    function readFileStrSync(filename, opts = {}) {
      const decoder = new TextDecoder(opts.encoding);
      return decoder.decode(Deno.readFileSync(filename));
    }
    exports_32("readFileStrSync", readFileStrSync);
    /**
     * Read file and output it as a string.
     *
     * @param filename File to read
     * @param opts Read options
     */
    async function readFileStr(filename, opts = {}) {
      const decoder = new TextDecoder(opts.encoding);
      return decoder.decode(await Deno.readFile(filename));
    }
    exports_32("readFileStr", readFileStr);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/fs/write_file_str",
  [],
  function (exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    /**
     * Write the string to file synchronously.
     *
     * @param filename File to write
     * @param content The content write to file
     * @returns void
     */
    function writeFileStrSync(filename, content) {
      const encoder = new TextEncoder();
      Deno.writeFileSync(filename, encoder.encode(content));
    }
    exports_33("writeFileStrSync", writeFileStrSync);
    /**
     * Write the string to file.
     *
     * @param filename File to write
     * @param content The content write to file
     * @returns Promise<void>
     */
    async function writeFileStr(filename, content) {
      const encoder = new TextEncoder();
      await Deno.writeFile(filename, encoder.encode(content));
    }
    exports_33("writeFileStr", writeFileStr);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/fs/read_json",
  [],
  function (exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    /** Reads a JSON file and then parses it into an object */
    async function readJson(filePath) {
      const decoder = new TextDecoder("utf-8");
      const content = decoder.decode(await Deno.readFile(filePath));
      try {
        return JSON.parse(content);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
    }
    exports_34("readJson", readJson);
    /** Reads a JSON file and then parses it into an object */
    function readJsonSync(filePath) {
      const decoder = new TextDecoder("utf-8");
      const content = decoder.decode(Deno.readFileSync(filePath));
      try {
        return JSON.parse(content);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
    }
    exports_34("readJsonSync", readJsonSync);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/write_json",
  [],
  function (exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    /* Writes an object to a JSON file. */
    async function writeJson(filePath, object, options = {}) {
      let contentRaw = "";
      try {
        contentRaw = JSON.stringify(object, options.replacer, options.spaces);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
      await Deno.writeFile(filePath, new TextEncoder().encode(contentRaw));
    }
    exports_35("writeJson", writeJson);
    /* Writes an object to a JSON file. */
    function writeJsonSync(filePath, object, options = {}) {
      let contentRaw = "";
      try {
        contentRaw = JSON.stringify(object, options.replacer, options.spaces);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
      Deno.writeFileSync(filePath, new TextEncoder().encode(contentRaw));
    }
    exports_35("writeJsonSync", writeJsonSync);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/fs/eol",
  [],
  function (exports_36, context_36) {
    "use strict";
    var EOL, regDetect;
    var __moduleName = context_36 && context_36.id;
    /**
     * Detect the EOL character for string input.
     * returns null if no newline
     */
    function detect(content) {
      const d = content.match(regDetect);
      if (!d || d.length === 0) {
        return null;
      }
      const crlf = d.filter((x) => x === EOL.CRLF);
      if (crlf.length > 0) {
        return EOL.CRLF;
      } else {
        return EOL.LF;
      }
    }
    exports_36("detect", detect);
    /** Format the file to the targeted EOL */
    function format(content, eol) {
      return content.replace(regDetect, eol);
    }
    exports_36("format", format);
    return {
      setters: [],
      execute: function () {
        /** EndOfLine character enum */
        (function (EOL) {
          EOL["LF"] = "\n";
          EOL["CRLF"] = "\r\n";
        })(EOL || (EOL = {}));
        exports_36("EOL", EOL);
        regDetect = /(?:\r?\n)/g;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/fs/mod",
  [
    "https://deno.land/std@0.52.0/fs/empty_dir",
    "https://deno.land/std@0.52.0/fs/ensure_dir",
    "https://deno.land/std@0.52.0/fs/ensure_file",
    "https://deno.land/std@0.52.0/fs/ensure_link",
    "https://deno.land/std@0.52.0/fs/ensure_symlink",
    "https://deno.land/std@0.52.0/fs/exists",
    "https://deno.land/std@0.52.0/fs/expand_glob",
    "https://deno.land/std@0.52.0/fs/move",
    "https://deno.land/std@0.52.0/fs/copy",
    "https://deno.land/std@0.52.0/fs/read_file_str",
    "https://deno.land/std@0.52.0/fs/write_file_str",
    "https://deno.land/std@0.52.0/fs/read_json",
    "https://deno.land/std@0.52.0/fs/write_json",
    "https://deno.land/std@0.52.0/fs/walk",
    "https://deno.land/std@0.52.0/fs/eol",
  ],
  function (exports_37, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    function exportStar_3(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_37(exports);
    }
    return {
      setters: [
        function (empty_dir_ts_1_1) {
          exportStar_3(empty_dir_ts_1_1);
        },
        function (ensure_dir_ts_5_1) {
          exportStar_3(ensure_dir_ts_5_1);
        },
        function (ensure_file_ts_1_1) {
          exportStar_3(ensure_file_ts_1_1);
        },
        function (ensure_link_ts_1_1) {
          exportStar_3(ensure_link_ts_1_1);
        },
        function (ensure_symlink_ts_1_1) {
          exportStar_3(ensure_symlink_ts_1_1);
        },
        function (exists_ts_5_1) {
          exportStar_3(exists_ts_5_1);
        },
        function (expand_glob_ts_1_1) {
          exportStar_3(expand_glob_ts_1_1);
        },
        function (move_ts_1_1) {
          exportStar_3(move_ts_1_1);
        },
        function (copy_ts_1_1) {
          exportStar_3(copy_ts_1_1);
        },
        function (read_file_str_ts_1_1) {
          exportStar_3(read_file_str_ts_1_1);
        },
        function (write_file_str_ts_1_1) {
          exportStar_3(write_file_str_ts_1_1);
        },
        function (read_json_ts_1_1) {
          exportStar_3(read_json_ts_1_1);
        },
        function (write_json_ts_1_1) {
          exportStar_3(write_json_ts_1_1);
        },
        function (walk_ts_2_1) {
          exportStar_3(walk_ts_2_1);
        },
        function (eol_ts_1_1) {
          exportStar_3(eol_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/utils",
  [],
  function (exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    function isNothing(subject) {
      return typeof subject === "undefined" || subject === null;
    }
    exports_38("isNothing", isNothing);
    function isArray(value) {
      return Array.isArray(value);
    }
    exports_38("isArray", isArray);
    function isBoolean(value) {
      return typeof value === "boolean" || value instanceof Boolean;
    }
    exports_38("isBoolean", isBoolean);
    function isNull(value) {
      return value === null;
    }
    exports_38("isNull", isNull);
    function isNumber(value) {
      return typeof value === "number" || value instanceof Number;
    }
    exports_38("isNumber", isNumber);
    function isString(value) {
      return typeof value === "string" || value instanceof String;
    }
    exports_38("isString", isString);
    function isSymbol(value) {
      return typeof value === "symbol";
    }
    exports_38("isSymbol", isSymbol);
    function isUndefined(value) {
      return value === undefined;
    }
    exports_38("isUndefined", isUndefined);
    function isObject(value) {
      return value !== null && typeof value === "object";
    }
    exports_38("isObject", isObject);
    function isError(e) {
      return e instanceof Error;
    }
    exports_38("isError", isError);
    function isFunction(value) {
      return typeof value === "function";
    }
    exports_38("isFunction", isFunction);
    function isRegExp(value) {
      return value instanceof RegExp;
    }
    exports_38("isRegExp", isRegExp);
    function toArray(sequence) {
      if (isArray(sequence)) {
        return sequence;
      }
      if (isNothing(sequence)) {
        return [];
      }
      return [sequence];
    }
    exports_38("toArray", toArray);
    function repeat(str, count) {
      let result = "";
      for (let cycle = 0; cycle < count; cycle++) {
        result += str;
      }
      return result;
    }
    exports_38("repeat", repeat);
    function isNegativeZero(i) {
      return i === 0 && Number.NEGATIVE_INFINITY === 1 / i;
    }
    exports_38("isNegativeZero", isNegativeZero);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/mark",
  ["https://deno.land/std@0.52.0/encoding/_yaml/utils"],
  function (exports_39, context_39) {
    "use strict";
    var utils_ts_1, Mark;
    var __moduleName = context_39 && context_39.id;
    return {
      setters: [
        function (utils_ts_1_1) {
          utils_ts_1 = utils_ts_1_1;
        },
      ],
      execute: function () {
        Mark = class Mark {
          constructor(name, buffer, position, line, column) {
            this.name = name;
            this.buffer = buffer;
            this.position = position;
            this.line = line;
            this.column = column;
          }
          getSnippet(indent = 4, maxLength = 75) {
            if (!this.buffer) {
              return null;
            }
            let head = "";
            let start = this.position;
            while (
              start > 0 &&
              "\x00\r\n\x85\u2028\u2029".indexOf(
                  this.buffer.charAt(start - 1),
                ) === -1
            ) {
              start -= 1;
              if (this.position - start > maxLength / 2 - 1) {
                head = " ... ";
                start += 5;
                break;
              }
            }
            let tail = "";
            let end = this.position;
            while (
              end < this.buffer.length &&
              "\x00\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(end)) ===
                -1
            ) {
              end += 1;
              if (end - this.position > maxLength / 2 - 1) {
                tail = " ... ";
                end -= 5;
                break;
              }
            }
            const snippet = this.buffer.slice(start, end);
            return `${
              utils_ts_1.repeat(" ", indent)
            }${head}${snippet}${tail}\n${
              utils_ts_1.repeat(
                " ",
                indent + this.position - start + head.length,
              )
            }^`;
          }
          toString(compact) {
            let snippet, where = "";
            if (this.name) {
              where += `in "${this.name}" `;
            }
            where += `at line ${this.line + 1}, column ${this.column + 1}`;
            if (!compact) {
              snippet = this.getSnippet();
              if (snippet) {
                where += `:\n${snippet}`;
              }
            }
            return where;
          }
        };
        exports_39("Mark", Mark);
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/error",
  [],
  function (exports_40, context_40) {
    "use strict";
    var YAMLError;
    var __moduleName = context_40 && context_40.id;
    return {
      setters: [],
      execute: function () {
        YAMLError = class YAMLError extends Error {
          constructor(message = "(unknown reason)", mark = "") {
            super(`${message} ${mark}`);
            this.mark = mark;
            this.name = this.constructor.name;
          }
          toString(_compact) {
            return `${this.name}: ${this.message} ${this.mark}`;
          }
        };
        exports_40("YAMLError", YAMLError);
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type",
  [],
  function (exports_41, context_41) {
    "use strict";
    var DEFAULT_RESOLVE, DEFAULT_CONSTRUCT, Type;
    var __moduleName = context_41 && context_41.id;
    function checkTagFormat(tag) {
      return tag;
    }
    return {
      setters: [],
      execute: function () {
        DEFAULT_RESOLVE = () => true;
        DEFAULT_CONSTRUCT = (data) => data;
        Type = class Type {
          constructor(tag, options) {
            this.kind = null;
            this.resolve = () => true;
            this.construct = (data) => data;
            this.tag = checkTagFormat(tag);
            if (options) {
              this.kind = options.kind;
              this.resolve = options.resolve || DEFAULT_RESOLVE;
              this.construct = options.construct || DEFAULT_CONSTRUCT;
              this.instanceOf = options.instanceOf;
              this.predicate = options.predicate;
              this.represent = options.represent;
              this.defaultStyle = options.defaultStyle;
              this.styleAliases = options.styleAliases;
            }
          }
        };
        exports_41("Type", Type);
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/schema",
  ["https://deno.land/std@0.52.0/encoding/_yaml/error"],
  function (exports_42, context_42) {
    "use strict";
    var error_ts_1, Schema;
    var __moduleName = context_42 && context_42.id;
    function compileList(schema, name, result) {
      const exclude = [];
      for (const includedSchema of schema.include) {
        result = compileList(includedSchema, name, result);
      }
      for (const currentType of schema[name]) {
        for (
          let previousIndex = 0; previousIndex < result.length; previousIndex++
        ) {
          const previousType = result[previousIndex];
          if (
            previousType.tag === currentType.tag &&
            previousType.kind === currentType.kind
          ) {
            exclude.push(previousIndex);
          }
        }
        result.push(currentType);
      }
      return result.filter((type, index) => !exclude.includes(index));
    }
    function compileMap(...typesList) {
      const result = {
        fallback: {},
        mapping: {},
        scalar: {},
        sequence: {},
      };
      for (const types of typesList) {
        for (const type of types) {
          if (type.kind !== null) {
            result[type.kind][type.tag] = result["fallback"][type.tag] = type;
          }
        }
      }
      return result;
    }
    return {
      setters: [
        function (error_ts_1_1) {
          error_ts_1 = error_ts_1_1;
        },
      ],
      execute: function () {
        Schema = class Schema {
          constructor(definition) {
            this.explicit = definition.explicit || [];
            this.implicit = definition.implicit || [];
            this.include = definition.include || [];
            for (const type of this.implicit) {
              if (type.loadKind && type.loadKind !== "scalar") {
                throw new error_ts_1.YAMLError(
                  // eslint-disable-next-line max-len
                  "There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.",
                );
              }
            }
            this.compiledImplicit = compileList(this, "implicit", []);
            this.compiledExplicit = compileList(this, "explicit", []);
            this.compiledTypeMap = compileMap(
              this.compiledImplicit,
              this.compiledExplicit,
            );
          }
          static create() {}
        };
        exports_42("Schema", Schema);
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/binary",
  ["https://deno.land/std@0.52.0/encoding/_yaml/type"],
  function (exports_43, context_43) {
    "use strict";
    var type_ts_1, Buffer, BASE64_MAP, binary;
    var __moduleName = context_43 && context_43.id;
    function resolveYamlBinary(data) {
      if (data === null) {
        return false;
      }
      let code;
      let bitlen = 0;
      const max = data.length;
      const map = BASE64_MAP;
      // Convert one by one.
      for (let idx = 0; idx < max; idx++) {
        code = map.indexOf(data.charAt(idx));
        // Skip CR/LF
        if (code > 64) {
          continue;
        }
        // Fail on illegal characters
        if (code < 0) {
          return false;
        }
        bitlen += 6;
      }
      // If there are any bits left, source was corrupted
      return bitlen % 8 === 0;
    }
    function constructYamlBinary(data) {
      // remove CR/LF & padding to simplify scan
      const input = data.replace(/[\r\n=]/g, "");
      const max = input.length;
      const map = BASE64_MAP;
      // Collect by 6*4 bits (3 bytes)
      const result = [];
      let bits = 0;
      for (let idx = 0; idx < max; idx++) {
        if (idx % 4 === 0 && idx) {
          result.push((bits >> 16) & 0xff);
          result.push((bits >> 8) & 0xff);
          result.push(bits & 0xff);
        }
        bits = (bits << 6) | map.indexOf(input.charAt(idx));
      }
      // Dump tail
      const tailbits = (max % 4) * 6;
      if (tailbits === 0) {
        result.push((bits >> 16) & 0xff);
        result.push((bits >> 8) & 0xff);
        result.push(bits & 0xff);
      } else if (tailbits === 18) {
        result.push((bits >> 10) & 0xff);
        result.push((bits >> 2) & 0xff);
      } else if (tailbits === 12) {
        result.push((bits >> 4) & 0xff);
      }
      return new Buffer(new Uint8Array(result));
    }
    function representYamlBinary(object) {
      const max = object.length;
      const map = BASE64_MAP;
      // Convert every three bytes to 4 ASCII characters.
      let result = "";
      let bits = 0;
      for (let idx = 0; idx < max; idx++) {
        if (idx % 3 === 0 && idx) {
          result += map[(bits >> 18) & 0x3f];
          result += map[(bits >> 12) & 0x3f];
          result += map[(bits >> 6) & 0x3f];
          result += map[bits & 0x3f];
        }
        bits = (bits << 8) + object[idx];
      }
      // Dump tail
      const tail = max % 3;
      if (tail === 0) {
        result += map[(bits >> 18) & 0x3f];
        result += map[(bits >> 12) & 0x3f];
        result += map[(bits >> 6) & 0x3f];
        result += map[bits & 0x3f];
      } else if (tail === 2) {
        result += map[(bits >> 10) & 0x3f];
        result += map[(bits >> 4) & 0x3f];
        result += map[(bits << 2) & 0x3f];
        result += map[64];
      } else if (tail === 1) {
        result += map[(bits >> 2) & 0x3f];
        result += map[(bits << 4) & 0x3f];
        result += map[64];
        result += map[64];
      }
      return result;
    }
    function isBinary(obj) {
      const buf = new Buffer();
      try {
        if (0 > buf.readFromSync(obj)) {
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        buf.reset();
      }
    }
    return {
      setters: [
        function (type_ts_1_1) {
          type_ts_1 = type_ts_1_1;
        },
      ],
      execute: function () {
        Buffer = Deno.Buffer;
        // [ 64, 65, 66 ] -> [ padding, CR, LF ]
        BASE64_MAP =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
        exports_43(
          "binary",
          binary = new type_ts_1.Type("tag:yaml.org,2002:binary", {
            construct: constructYamlBinary,
            kind: "scalar",
            predicate: isBinary,
            represent: representYamlBinary,
            resolve: resolveYamlBinary,
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/bool",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/type",
    "https://deno.land/std@0.52.0/encoding/_yaml/utils",
  ],
  function (exports_44, context_44) {
    "use strict";
    var type_ts_2, utils_ts_2, bool;
    var __moduleName = context_44 && context_44.id;
    function resolveYamlBoolean(data) {
      const max = data.length;
      return ((max === 4 &&
        (data === "true" || data === "True" || data === "TRUE")) ||
        (max === 5 &&
          (data === "false" || data === "False" || data === "FALSE")));
    }
    function constructYamlBoolean(data) {
      return data === "true" || data === "True" || data === "TRUE";
    }
    return {
      setters: [
        function (type_ts_2_1) {
          type_ts_2 = type_ts_2_1;
        },
        function (utils_ts_2_1) {
          utils_ts_2 = utils_ts_2_1;
        },
      ],
      execute: function () {
        exports_44(
          "bool",
          bool = new type_ts_2.Type("tag:yaml.org,2002:bool", {
            construct: constructYamlBoolean,
            defaultStyle: "lowercase",
            kind: "scalar",
            predicate: utils_ts_2.isBoolean,
            represent: {
              lowercase(object) {
                return object ? "true" : "false";
              },
              uppercase(object) {
                return object ? "TRUE" : "FALSE";
              },
              camelcase(object) {
                return object ? "True" : "False";
              },
            },
            resolve: resolveYamlBoolean,
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/float",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/type",
    "https://deno.land/std@0.52.0/encoding/_yaml/utils",
  ],
  function (exports_45, context_45) {
    "use strict";
    var type_ts_3,
      utils_ts_3,
      YAML_FLOAT_PATTERN,
      SCIENTIFIC_WITHOUT_DOT,
      float;
    var __moduleName = context_45 && context_45.id;
    function resolveYamlFloat(data) {
      if (
        !YAML_FLOAT_PATTERN.test(data) ||
        // Quick hack to not allow integers end with `_`
        // Probably should update regexp & check speed
        data[data.length - 1] === "_"
      ) {
        return false;
      }
      return true;
    }
    function constructYamlFloat(data) {
      let value = data.replace(/_/g, "").toLowerCase();
      const sign = value[0] === "-" ? -1 : 1;
      const digits = [];
      if ("+-".indexOf(value[0]) >= 0) {
        value = value.slice(1);
      }
      if (value === ".inf") {
        return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      }
      if (value === ".nan") {
        return NaN;
      }
      if (value.indexOf(":") >= 0) {
        value.split(":").forEach((v) => {
          digits.unshift(parseFloat(v));
        });
        let valueNb = 0.0;
        let base = 1;
        digits.forEach((d) => {
          valueNb += d * base;
          base *= 60;
        });
        return sign * valueNb;
      }
      return sign * parseFloat(value);
    }
    function representYamlFloat(object, style) {
      if (isNaN(object)) {
        switch (style) {
          case "lowercase":
            return ".nan";
          case "uppercase":
            return ".NAN";
          case "camelcase":
            return ".NaN";
        }
      } else if (Number.POSITIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return ".inf";
          case "uppercase":
            return ".INF";
          case "camelcase":
            return ".Inf";
        }
      } else if (Number.NEGATIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return "-.inf";
          case "uppercase":
            return "-.INF";
          case "camelcase":
            return "-.Inf";
        }
      } else if (utils_ts_3.isNegativeZero(object)) {
        return "-0.0";
      }
      const res = object.toString(10);
      // JS stringifier can build scientific format without dots: 5e-100,
      // while YAML requres dot: 5.e-100. Fix it with simple hack
      return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
    }
    function isFloat(object) {
      return (Object.prototype.toString.call(object) === "[object Number]" &&
        (object % 1 !== 0 || utils_ts_3.isNegativeZero(object)));
    }
    return {
      setters: [
        function (type_ts_3_1) {
          type_ts_3 = type_ts_3_1;
        },
        function (utils_ts_3_1) {
          utils_ts_3 = utils_ts_3_1;
        },
      ],
      execute: function () {
        YAML_FLOAT_PATTERN = new RegExp(
          // 2.5e4, 2.5 and integers
          "^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?" +
            // .2e4, .2
            // special case, seems not from spec
            "|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?" +
            // 20:59
            "|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*" +
            // .inf
            "|[-+]?\\.(?:inf|Inf|INF)" +
            // .nan
            "|\\.(?:nan|NaN|NAN))$",
        );
        SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
        exports_45(
          "float",
          float = new type_ts_3.Type("tag:yaml.org,2002:float", {
            construct: constructYamlFloat,
            defaultStyle: "lowercase",
            kind: "scalar",
            predicate: isFloat,
            represent: representYamlFloat,
            resolve: resolveYamlFloat,
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/int",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/type",
    "https://deno.land/std@0.52.0/encoding/_yaml/utils",
  ],
  function (exports_46, context_46) {
    "use strict";
    var type_ts_4, utils_ts_4, int;
    var __moduleName = context_46 && context_46.id;
    function isHexCode(c) {
      return ((0x30 <= /* 0 */ c && c <= 0x39) /* 9 */ ||
        (0x41 <= /* A */ c && c <= 0x46) /* F */ ||
        (0x61 <= /* a */ c && c <= 0x66) /* f */);
    }
    function isOctCode(c) {
      return 0x30 <= /* 0 */ c && c <= 0x37 /* 7 */;
    }
    function isDecCode(c) {
      return 0x30 <= /* 0 */ c && c <= 0x39 /* 9 */;
    }
    function resolveYamlInteger(data) {
      const max = data.length;
      let index = 0;
      let hasDigits = false;
      if (!max) {
        return false;
      }
      let ch = data[index];
      // sign
      if (ch === "-" || ch === "+") {
        ch = data[++index];
      }
      if (ch === "0") {
        // 0
        if (index + 1 === max) {
          return true;
        }
        ch = data[++index];
        // base 2, base 8, base 16
        if (ch === "b") {
          // base 2
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_") {
              continue;
            }
            if (ch !== "0" && ch !== "1") {
              return false;
            }
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        if (ch === "x") {
          // base 16
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_") {
              continue;
            }
            if (!isHexCode(data.charCodeAt(index))) {
              return false;
            }
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        // base 8
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") {
            continue;
          }
          if (!isOctCode(data.charCodeAt(index))) {
            return false;
          }
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      // base 10 (except 0) or base 60
      // value should not start with `_`;
      if (ch === "_") {
        return false;
      }
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") {
          continue;
        }
        if (ch === ":") {
          break;
        }
        if (!isDecCode(data.charCodeAt(index))) {
          return false;
        }
        hasDigits = true;
      }
      // Should have digits and should not end with `_`
      if (!hasDigits || ch === "_") {
        return false;
      }
      // if !base60 - done;
      if (ch !== ":") {
        return true;
      }
      // base60 almost not used, no needs to optimize
      return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
    }
    function constructYamlInteger(data) {
      let value = data;
      const digits = [];
      if (value.indexOf("_") !== -1) {
        value = value.replace(/_/g, "");
      }
      let sign = 1;
      let ch = value[0];
      if (ch === "-" || ch === "+") {
        if (ch === "-") {
          sign = -1;
        }
        value = value.slice(1);
        ch = value[0];
      }
      if (value === "0") {
        return 0;
      }
      if (ch === "0") {
        if (value[1] === "b") {
          return sign * parseInt(value.slice(2), 2);
        }
        if (value[1] === "x") {
          return sign * parseInt(value, 16);
        }
        return sign * parseInt(value, 8);
      }
      if (value.indexOf(":") !== -1) {
        value.split(":").forEach((v) => {
          digits.unshift(parseInt(v, 10));
        });
        let valueInt = 0;
        let base = 1;
        digits.forEach((d) => {
          valueInt += d * base;
          base *= 60;
        });
        return sign * valueInt;
      }
      return sign * parseInt(value, 10);
    }
    function isInteger(object) {
      return (Object.prototype.toString.call(object) === "[object Number]" &&
        object % 1 === 0 &&
        !utils_ts_4.isNegativeZero(object));
    }
    return {
      setters: [
        function (type_ts_4_1) {
          type_ts_4 = type_ts_4_1;
        },
        function (utils_ts_4_1) {
          utils_ts_4 = utils_ts_4_1;
        },
      ],
      execute: function () {
        exports_46(
          "int",
          int = new type_ts_4.Type("tag:yaml.org,2002:int", {
            construct: constructYamlInteger,
            defaultStyle: "decimal",
            kind: "scalar",
            predicate: isInteger,
            represent: {
              binary(obj) {
                return obj >= 0
                  ? `0b${obj.toString(2)}`
                  : `-0b${obj.toString(2).slice(1)}`;
              },
              octal(obj) {
                return obj >= 0
                  ? `0${obj.toString(8)}`
                  : `-0${obj.toString(8).slice(1)}`;
              },
              decimal(obj) {
                return obj.toString(10);
              },
              hexadecimal(obj) {
                return obj >= 0
                  ? `0x${obj.toString(16).toUpperCase()}`
                  : `-0x${obj.toString(16).toUpperCase().slice(1)}`;
              },
            },
            resolve: resolveYamlInteger,
            styleAliases: {
              binary: [2, "bin"],
              decimal: [10, "dec"],
              hexadecimal: [16, "hex"],
              octal: [8, "oct"],
            },
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/map",
  ["https://deno.land/std@0.52.0/encoding/_yaml/type"],
  function (exports_47, context_47) {
    "use strict";
    var type_ts_5, map;
    var __moduleName = context_47 && context_47.id;
    return {
      setters: [
        function (type_ts_5_1) {
          type_ts_5 = type_ts_5_1;
        },
      ],
      execute: function () {
        exports_47(
          "map",
          map = new type_ts_5.Type("tag:yaml.org,2002:map", {
            construct(data) {
              return data !== null ? data : {};
            },
            kind: "mapping",
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/merge",
  ["https://deno.land/std@0.52.0/encoding/_yaml/type"],
  function (exports_48, context_48) {
    "use strict";
    var type_ts_6, merge;
    var __moduleName = context_48 && context_48.id;
    function resolveYamlMerge(data) {
      return data === "<<" || data === null;
    }
    return {
      setters: [
        function (type_ts_6_1) {
          type_ts_6 = type_ts_6_1;
        },
      ],
      execute: function () {
        exports_48(
          "merge",
          merge = new type_ts_6.Type("tag:yaml.org,2002:merge", {
            kind: "scalar",
            resolve: resolveYamlMerge,
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/nil",
  ["https://deno.land/std@0.52.0/encoding/_yaml/type"],
  function (exports_49, context_49) {
    "use strict";
    var type_ts_7, nil;
    var __moduleName = context_49 && context_49.id;
    function resolveYamlNull(data) {
      const max = data.length;
      return ((max === 1 && data === "~") ||
        (max === 4 && (data === "null" || data === "Null" || data === "NULL")));
    }
    function constructYamlNull() {
      return null;
    }
    function isNull(object) {
      return object === null;
    }
    return {
      setters: [
        function (type_ts_7_1) {
          type_ts_7 = type_ts_7_1;
        },
      ],
      execute: function () {
        exports_49(
          "nil",
          nil = new type_ts_7.Type("tag:yaml.org,2002:null", {
            construct: constructYamlNull,
            defaultStyle: "lowercase",
            kind: "scalar",
            predicate: isNull,
            represent: {
              canonical() {
                return "~";
              },
              lowercase() {
                return "null";
              },
              uppercase() {
                return "NULL";
              },
              camelcase() {
                return "Null";
              },
            },
            resolve: resolveYamlNull,
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/omap",
  ["https://deno.land/std@0.52.0/encoding/_yaml/type"],
  function (exports_50, context_50) {
    "use strict";
    var type_ts_8, _hasOwnProperty, _toString, omap;
    var __moduleName = context_50 && context_50.id;
    function resolveYamlOmap(data) {
      const objectKeys = [];
      let pairKey = "";
      let pairHasKey = false;
      for (const pair of data) {
        pairHasKey = false;
        if (_toString.call(pair) !== "[object Object]") {
          return false;
        }
        for (pairKey in pair) {
          if (_hasOwnProperty.call(pair, pairKey)) {
            if (!pairHasKey) {
              pairHasKey = true;
            } else {
              return false;
            }
          }
        }
        if (!pairHasKey) {
          return false;
        }
        if (objectKeys.indexOf(pairKey) === -1) {
          objectKeys.push(pairKey);
        } else {
          return false;
        }
      }
      return true;
    }
    function constructYamlOmap(data) {
      return data !== null ? data : [];
    }
    return {
      setters: [
        function (type_ts_8_1) {
          type_ts_8 = type_ts_8_1;
        },
      ],
      execute: function () {
        _hasOwnProperty = Object.prototype.hasOwnProperty;
        _toString = Object.prototype.toString;
        exports_50(
          "omap",
          omap = new type_ts_8.Type("tag:yaml.org,2002:omap", {
            construct: constructYamlOmap,
            kind: "sequence",
            resolve: resolveYamlOmap,
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/pairs",
  ["https://deno.land/std@0.52.0/encoding/_yaml/type"],
  function (exports_51, context_51) {
    "use strict";
    var type_ts_9, _toString, pairs;
    var __moduleName = context_51 && context_51.id;
    function resolveYamlPairs(data) {
      const result = new Array(data.length);
      for (let index = 0; index < data.length; index++) {
        const pair = data[index];
        if (_toString.call(pair) !== "[object Object]") {
          return false;
        }
        const keys = Object.keys(pair);
        if (keys.length !== 1) {
          return false;
        }
        result[index] = [keys[0], pair[keys[0]]];
      }
      return true;
    }
    function constructYamlPairs(data) {
      if (data === null) {
        return [];
      }
      const result = new Array(data.length);
      for (let index = 0; index < data.length; index += 1) {
        const pair = data[index];
        const keys = Object.keys(pair);
        result[index] = [keys[0], pair[keys[0]]];
      }
      return result;
    }
    return {
      setters: [
        function (type_ts_9_1) {
          type_ts_9 = type_ts_9_1;
        },
      ],
      execute: function () {
        _toString = Object.prototype.toString;
        exports_51(
          "pairs",
          pairs = new type_ts_9.Type("tag:yaml.org,2002:pairs", {
            construct: constructYamlPairs,
            kind: "sequence",
            resolve: resolveYamlPairs,
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/seq",
  ["https://deno.land/std@0.52.0/encoding/_yaml/type"],
  function (exports_52, context_52) {
    "use strict";
    var type_ts_10, seq;
    var __moduleName = context_52 && context_52.id;
    return {
      setters: [
        function (type_ts_10_1) {
          type_ts_10 = type_ts_10_1;
        },
      ],
      execute: function () {
        exports_52(
          "seq",
          seq = new type_ts_10.Type("tag:yaml.org,2002:seq", {
            construct(data) {
              return data !== null ? data : [];
            },
            kind: "sequence",
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/set",
  ["https://deno.land/std@0.52.0/encoding/_yaml/type"],
  function (exports_53, context_53) {
    "use strict";
    var type_ts_11, _hasOwnProperty, set;
    var __moduleName = context_53 && context_53.id;
    function resolveYamlSet(data) {
      if (data === null) {
        return true;
      }
      for (const key in data) {
        if (_hasOwnProperty.call(data, key)) {
          if (data[key] !== null) {
            return false;
          }
        }
      }
      return true;
    }
    function constructYamlSet(data) {
      return data !== null ? data : {};
    }
    return {
      setters: [
        function (type_ts_11_1) {
          type_ts_11 = type_ts_11_1;
        },
      ],
      execute: function () {
        _hasOwnProperty = Object.prototype.hasOwnProperty;
        exports_53(
          "set",
          set = new type_ts_11.Type("tag:yaml.org,2002:set", {
            construct: constructYamlSet,
            kind: "mapping",
            resolve: resolveYamlSet,
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/str",
  ["https://deno.land/std@0.52.0/encoding/_yaml/type"],
  function (exports_54, context_54) {
    "use strict";
    var type_ts_12, str;
    var __moduleName = context_54 && context_54.id;
    return {
      setters: [
        function (type_ts_12_1) {
          type_ts_12 = type_ts_12_1;
        },
      ],
      execute: function () {
        exports_54(
          "str",
          str = new type_ts_12.Type("tag:yaml.org,2002:str", {
            construct(data) {
              return data !== null ? data : "";
            },
            kind: "scalar",
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/timestamp",
  ["https://deno.land/std@0.52.0/encoding/_yaml/type"],
  function (exports_55, context_55) {
    "use strict";
    var type_ts_13, YAML_DATE_REGEXP, YAML_TIMESTAMP_REGEXP, timestamp;
    var __moduleName = context_55 && context_55.id;
    function resolveYamlTimestamp(data) {
      if (data === null) {
        return false;
      }
      if (YAML_DATE_REGEXP.exec(data) !== null) {
        return true;
      }
      if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) {
        return true;
      }
      return false;
    }
    function constructYamlTimestamp(data) {
      let match = YAML_DATE_REGEXP.exec(data);
      if (match === null) {
        match = YAML_TIMESTAMP_REGEXP.exec(data);
      }
      if (match === null) {
        throw new Error("Date resolve error");
      }
      // match: [1] year [2] month [3] day
      const year = +match[1];
      const month = +match[2] - 1; // JS month starts with 0
      const day = +match[3];
      if (!match[4]) {
        // no hour
        return new Date(Date.UTC(year, month, day));
      }
      // match: [4] hour [5] minute [6] second [7] fraction
      const hour = +match[4];
      const minute = +match[5];
      const second = +match[6];
      let fraction = 0;
      if (match[7]) {
        let partFraction = match[7].slice(0, 3);
        while (partFraction.length < 3) {
          // milli-seconds
          partFraction += "0";
        }
        fraction = +partFraction;
      }
      // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute
      let delta = null;
      if (match[9]) {
        const tzHour = +match[10];
        const tzMinute = +(match[11] || 0);
        delta = (tzHour * 60 + tzMinute) * 60000; // delta in mili-seconds
        if (match[9] === "-") {
          delta = -delta;
        }
      }
      const date = new Date(
        Date.UTC(year, month, day, hour, minute, second, fraction),
      );
      if (delta) {
        date.setTime(date.getTime() - delta);
      }
      return date;
    }
    function representYamlTimestamp(date) {
      return date.toISOString();
    }
    return {
      setters: [
        function (type_ts_13_1) {
          type_ts_13 = type_ts_13_1;
        },
      ],
      execute: function () {
        YAML_DATE_REGEXP = new RegExp(
          "^([0-9][0-9][0-9][0-9])" + // [1] year
            "-([0-9][0-9])" + // [2] month
            "-([0-9][0-9])$", // [3] day
        );
        YAML_TIMESTAMP_REGEXP = new RegExp(
          "^([0-9][0-9][0-9][0-9])" + // [1] year
            "-([0-9][0-9]?)" + // [2] month
            "-([0-9][0-9]?)" + // [3] day
            "(?:[Tt]|[ \\t]+)" + // ...
            "([0-9][0-9]?)" + // [4] hour
            ":([0-9][0-9])" + // [5] minute
            ":([0-9][0-9])" + // [6] second
            "(?:\\.([0-9]*))?" + // [7] fraction
            "(?:[ \\t]*(Z|([-+])([0-9][0-9]?)" + // [8] tz [9] tz_sign [10] tz_hour
            "(?::([0-9][0-9]))?))?$", // [11] tz_minute
        );
        exports_55(
          "timestamp",
          timestamp = new type_ts_13.Type("tag:yaml.org,2002:timestamp", {
            construct: constructYamlTimestamp,
            instanceOf: Date,
            kind: "scalar",
            represent: representYamlTimestamp,
            resolve: resolveYamlTimestamp,
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/type/mod",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/type/binary",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/bool",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/float",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/int",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/map",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/merge",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/nil",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/omap",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/pairs",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/seq",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/set",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/str",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/timestamp",
  ],
  function (exports_56, context_56) {
    "use strict";
    var __moduleName = context_56 && context_56.id;
    return {
      setters: [
        function (binary_ts_1_1) {
          exports_56({
            "binary": binary_ts_1_1["binary"],
          });
        },
        function (bool_ts_1_1) {
          exports_56({
            "bool": bool_ts_1_1["bool"],
          });
        },
        function (float_ts_1_1) {
          exports_56({
            "float": float_ts_1_1["float"],
          });
        },
        function (int_ts_1_1) {
          exports_56({
            "int": int_ts_1_1["int"],
          });
        },
        function (map_ts_1_1) {
          exports_56({
            "map": map_ts_1_1["map"],
          });
        },
        function (merge_ts_1_1) {
          exports_56({
            "merge": merge_ts_1_1["merge"],
          });
        },
        function (nil_ts_1_1) {
          exports_56({
            "nil": nil_ts_1_1["nil"],
          });
        },
        function (omap_ts_1_1) {
          exports_56({
            "omap": omap_ts_1_1["omap"],
          });
        },
        function (pairs_ts_1_1) {
          exports_56({
            "pairs": pairs_ts_1_1["pairs"],
          });
        },
        function (seq_ts_1_1) {
          exports_56({
            "seq": seq_ts_1_1["seq"],
          });
        },
        function (set_ts_1_1) {
          exports_56({
            "set": set_ts_1_1["set"],
          });
        },
        function (str_ts_1_1) {
          exports_56({
            "str": str_ts_1_1["str"],
          });
        },
        function (timestamp_ts_1_1) {
          exports_56({
            "timestamp": timestamp_ts_1_1["timestamp"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/schema/failsafe",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/schema",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/mod",
  ],
  function (exports_57, context_57) {
    "use strict";
    var schema_ts_1, mod_ts_5, failsafe;
    var __moduleName = context_57 && context_57.id;
    return {
      setters: [
        function (schema_ts_1_1) {
          schema_ts_1 = schema_ts_1_1;
        },
        function (mod_ts_5_1) {
          mod_ts_5 = mod_ts_5_1;
        },
      ],
      execute: function () {
        // Standard YAML's Failsafe schema.
        // http://www.yaml.org/spec/1.2/spec.html#id2802346
        exports_57(
          "failsafe",
          failsafe = new schema_ts_1.Schema({
            explicit: [mod_ts_5.str, mod_ts_5.seq, mod_ts_5.map],
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/schema/json",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/schema",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/mod",
    "https://deno.land/std@0.52.0/encoding/_yaml/schema/failsafe",
  ],
  function (exports_58, context_58) {
    "use strict";
    var schema_ts_2, mod_ts_6, failsafe_ts_1, json;
    var __moduleName = context_58 && context_58.id;
    return {
      setters: [
        function (schema_ts_2_1) {
          schema_ts_2 = schema_ts_2_1;
        },
        function (mod_ts_6_1) {
          mod_ts_6 = mod_ts_6_1;
        },
        function (failsafe_ts_1_1) {
          failsafe_ts_1 = failsafe_ts_1_1;
        },
      ],
      execute: function () {
        // Standard YAML's JSON schema.
        // http://www.yaml.org/spec/1.2/spec.html#id2803231
        exports_58(
          "json",
          json = new schema_ts_2.Schema({
            implicit: [
              mod_ts_6.nil,
              mod_ts_6.bool,
              mod_ts_6.int,
              mod_ts_6.float,
            ],
            include: [failsafe_ts_1.failsafe],
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/schema/core",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/schema",
    "https://deno.land/std@0.52.0/encoding/_yaml/schema/json",
  ],
  function (exports_59, context_59) {
    "use strict";
    var schema_ts_3, json_ts_1, core;
    var __moduleName = context_59 && context_59.id;
    return {
      setters: [
        function (schema_ts_3_1) {
          schema_ts_3 = schema_ts_3_1;
        },
        function (json_ts_1_1) {
          json_ts_1 = json_ts_1_1;
        },
      ],
      execute: function () {
        // Standard YAML's Core schema.
        // http://www.yaml.org/spec/1.2/spec.html#id2804923
        exports_59(
          "core",
          core = new schema_ts_3.Schema({
            include: [json_ts_1.json],
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/schema/default",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/schema",
    "https://deno.land/std@0.52.0/encoding/_yaml/type/mod",
    "https://deno.land/std@0.52.0/encoding/_yaml/schema/core",
  ],
  function (exports_60, context_60) {
    "use strict";
    var schema_ts_4, mod_ts_7, core_ts_1, def;
    var __moduleName = context_60 && context_60.id;
    return {
      setters: [
        function (schema_ts_4_1) {
          schema_ts_4 = schema_ts_4_1;
        },
        function (mod_ts_7_1) {
          mod_ts_7 = mod_ts_7_1;
        },
        function (core_ts_1_1) {
          core_ts_1 = core_ts_1_1;
        },
      ],
      execute: function () {
        // JS-YAML's default schema for `safeLoad` function.
        // It is not described in the YAML specification.
        exports_60(
          "def",
          def = new schema_ts_4.Schema({
            explicit: [
              mod_ts_7.binary,
              mod_ts_7.omap,
              mod_ts_7.pairs,
              mod_ts_7.set,
            ],
            implicit: [mod_ts_7.timestamp, mod_ts_7.merge],
            include: [core_ts_1.core],
          }),
        );
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/schema/mod",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/schema/core",
    "https://deno.land/std@0.52.0/encoding/_yaml/schema/default",
    "https://deno.land/std@0.52.0/encoding/_yaml/schema/failsafe",
    "https://deno.land/std@0.52.0/encoding/_yaml/schema/json",
  ],
  function (exports_61, context_61) {
    "use strict";
    var __moduleName = context_61 && context_61.id;
    return {
      setters: [
        function (core_ts_2_1) {
          exports_61({
            "CORE_SCHEMA": core_ts_2_1["core"],
          });
        },
        function (default_ts_1_1) {
          exports_61({
            "DEFAULT_SCHEMA": default_ts_1_1["def"],
          });
        },
        function (failsafe_ts_2_1) {
          exports_61({
            "FAILSAFE_SCHEMA": failsafe_ts_2_1["failsafe"],
          });
        },
        function (json_ts_2_1) {
          exports_61({
            "JSON_SCHEMA": json_ts_2_1["json"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/state",
  ["https://deno.land/std@0.52.0/encoding/_yaml/schema/mod"],
  function (exports_62, context_62) {
    "use strict";
    var mod_ts_8, State;
    var __moduleName = context_62 && context_62.id;
    return {
      setters: [
        function (mod_ts_8_1) {
          mod_ts_8 = mod_ts_8_1;
        },
      ],
      execute: function () {
        State = class State {
          constructor(schema = mod_ts_8.DEFAULT_SCHEMA) {
            this.schema = schema;
          }
        };
        exports_62("State", State);
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/loader/loader_state",
  ["https://deno.land/std@0.52.0/encoding/_yaml/state"],
  function (exports_63, context_63) {
    "use strict";
    var state_ts_1, LoaderState;
    var __moduleName = context_63 && context_63.id;
    return {
      setters: [
        function (state_ts_1_1) {
          state_ts_1 = state_ts_1_1;
        },
      ],
      execute: function () {
        LoaderState = class LoaderState extends state_ts_1.State {
          constructor(
            input,
            {
              filename,
              schema,
              onWarning,
              legacy = false,
              json = false,
              listener = null,
            },
          ) {
            super(schema);
            this.input = input;
            this.documents = [];
            this.lineIndent = 0;
            this.lineStart = 0;
            this.position = 0;
            this.line = 0;
            this.result = "";
            this.filename = filename;
            this.onWarning = onWarning;
            this.legacy = legacy;
            this.json = json;
            this.listener = listener;
            this.implicitTypes = this.schema.compiledImplicit;
            this.typeMap = this.schema.compiledTypeMap;
            this.length = input.length;
          }
        };
        exports_63("LoaderState", LoaderState);
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/loader/loader",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/error",
    "https://deno.land/std@0.52.0/encoding/_yaml/mark",
    "https://deno.land/std@0.52.0/encoding/_yaml/utils",
    "https://deno.land/std@0.52.0/encoding/_yaml/loader/loader_state",
  ],
  function (exports_64, context_64) {
    "use strict";
    var error_ts_2,
      mark_ts_1,
      common,
      loader_state_ts_1,
      _hasOwnProperty,
      CONTEXT_FLOW_IN,
      CONTEXT_FLOW_OUT,
      CONTEXT_BLOCK_IN,
      CONTEXT_BLOCK_OUT,
      CHOMPING_CLIP,
      CHOMPING_STRIP,
      CHOMPING_KEEP,
      PATTERN_NON_PRINTABLE,
      PATTERN_NON_ASCII_LINE_BREAKS,
      PATTERN_FLOW_INDICATORS,
      PATTERN_TAG_HANDLE,
      PATTERN_TAG_URI,
      simpleEscapeCheck,
      simpleEscapeMap,
      directiveHandlers;
    var __moduleName = context_64 && context_64.id;
    function _class(obj) {
      return Object.prototype.toString.call(obj);
    }
    function isEOL(c) {
      return c === 0x0a || /* LF */ c === 0x0d /* CR */;
    }
    function isWhiteSpace(c) {
      return c === 0x09 || /* Tab */ c === 0x20 /* Space */;
    }
    function isWsOrEol(c) {
      return (c === 0x09 /* Tab */ ||
        c === 0x20 /* Space */ ||
        c === 0x0a /* LF */ ||
        c === 0x0d /* CR */);
    }
    function isFlowIndicator(c) {
      return (c === 0x2c /* , */ ||
        c === 0x5b /* [ */ ||
        c === 0x5d /* ] */ ||
        c === 0x7b /* { */ ||
        c === 0x7d /* } */);
    }
    function fromHexCode(c) {
      if (0x30 <= /* 0 */ c && c <= 0x39 /* 9 */) {
        return c - 0x30;
      }
      const lc = c | 0x20;
      if (0x61 <= /* a */ lc && lc <= 0x66 /* f */) {
        return lc - 0x61 + 10;
      }
      return -1;
    }
    function escapedHexLen(c) {
      if (c === 0x78 /* x */) {
        return 2;
      }
      if (c === 0x75 /* u */) {
        return 4;
      }
      if (c === 0x55 /* U */) {
        return 8;
      }
      return 0;
    }
    function fromDecimalCode(c) {
      if (0x30 <= /* 0 */ c && c <= 0x39 /* 9 */) {
        return c - 0x30;
      }
      return -1;
    }
    function simpleEscapeSequence(c) {
      /* eslint:disable:prettier */
      return c === 0x30 /* 0 */ ? "\x00" : c === 0x61 /* a */
      ? "\x07"
      : c === 0x62 /* b */
      ? "\x08"
      : c === 0x74 /* t */
      ? "\x09"
      : c === 0x09 /* Tab */
      ? "\x09"
      : c === 0x6e /* n */
      ? "\x0A"
      : c === 0x76 /* v */
      ? "\x0B"
      : c === 0x66 /* f */
      ? "\x0C"
      : c === 0x72 /* r */
      ? "\x0D"
      : c === 0x65 /* e */
      ? "\x1B"
      : c === 0x20 /* Space */
      ? " "
      : c === 0x22 /* " */
      ? "\x22"
      : c === 0x2f /* / */
      ? "/"
      : c === 0x5c /* \ */
      ? "\x5C"
      : c === 0x4e /* N */
      ? "\x85"
      : c === 0x5f /* _ */
      ? "\xA0"
      : c === 0x4c /* L */
      ? "\u2028"
      : c === 0x50 /* P */
      ? "\u2029"
      : "";
      /* eslint:enable:prettier */
    }
    function charFromCodepoint(c) {
      if (c <= 0xffff) {
        return String.fromCharCode(c);
      }
      // Encode UTF-16 surrogate pair
      // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
      return String.fromCharCode(
        ((c - 0x010000) >> 10) + 0xd800,
        ((c - 0x010000) & 0x03ff) + 0xdc00,
      );
    }
    function generateError(state, message) {
      return new error_ts_2.YAMLError(
        message,
        new mark_ts_1.Mark(
          state.filename,
          state.input,
          state.position,
          state.line,
          state.position - state.lineStart,
        ),
      );
    }
    function throwError(state, message) {
      throw generateError(state, message);
    }
    function throwWarning(state, message) {
      if (state.onWarning) {
        state.onWarning.call(null, generateError(state, message));
      }
    }
    function captureSegment(state, start, end, checkJson) {
      let result;
      if (start < end) {
        result = state.input.slice(start, end);
        if (checkJson) {
          for (
            let position = 0, length = result.length;
            position < length;
            position++
          ) {
            const character = result.charCodeAt(position);
            if (
              !(character === 0x09 ||
                (0x20 <= character && character <= 0x10ffff))
            ) {
              return throwError(state, "expected valid JSON character");
            }
          }
        } else if (PATTERN_NON_PRINTABLE.test(result)) {
          return throwError(
            state,
            "the stream contains non-printable characters",
          );
        }
        state.result += result;
      }
    }
    function mergeMappings(state, destination, source, overridableKeys) {
      if (!common.isObject(source)) {
        return throwError(
          state,
          "cannot merge mappings; the provided source object is unacceptable",
        );
      }
      const keys = Object.keys(source);
      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i];
        if (!_hasOwnProperty.call(destination, key)) {
          destination[key] = source[key];
          overridableKeys[key] = true;
        }
      }
    }
    function storeMappingPair(
      state,
      result,
      overridableKeys,
      keyTag,
      keyNode,
      valueNode,
      startLine,
      startPos,
    ) {
      // The output is a plain object here, so keys can only be strings.
      // We need to convert keyNode to a string, but doing so can hang the process
      // (deeply nested arrays that explode exponentially using aliases).
      if (Array.isArray(keyNode)) {
        keyNode = Array.prototype.slice.call(keyNode);
        for (
          let index = 0, quantity = keyNode.length; index < quantity; index++
        ) {
          if (Array.isArray(keyNode[index])) {
            return throwError(
              state,
              "nested arrays are not supported inside keys",
            );
          }
          if (
            typeof keyNode === "object" &&
            _class(keyNode[index]) === "[object Object]"
          ) {
            keyNode[index] = "[object Object]";
          }
        }
      }
      // Avoid code execution in load() via toString property
      // (still use its own toString for arrays, timestamps,
      // and whatever user schema extensions happen to have @@toStringTag)
      if (
        typeof keyNode === "object" && _class(keyNode) === "[object Object]"
      ) {
        keyNode = "[object Object]";
      }
      keyNode = String(keyNode);
      if (result === null) {
        result = {};
      }
      if (keyTag === "tag:yaml.org,2002:merge") {
        if (Array.isArray(valueNode)) {
          for (
            let index = 0, quantity = valueNode.length;
            index < quantity;
            index++
          ) {
            mergeMappings(state, result, valueNode[index], overridableKeys);
          }
        } else {
          mergeMappings(state, result, valueNode, overridableKeys);
        }
      } else {
        if (
          !state.json &&
          !_hasOwnProperty.call(overridableKeys, keyNode) &&
          _hasOwnProperty.call(result, keyNode)
        ) {
          state.line = startLine || state.line;
          state.position = startPos || state.position;
          return throwError(state, "duplicated mapping key");
        }
        result[keyNode] = valueNode;
        delete overridableKeys[keyNode];
      }
      return result;
    }
    function readLineBreak(state) {
      const ch = state.input.charCodeAt(state.position);
      if (ch === 0x0a /* LF */) {
        state.position++;
      } else if (ch === 0x0d /* CR */) {
        state.position++;
        if (state.input.charCodeAt(state.position) === 0x0a /* LF */) {
          state.position++;
        }
      } else {
        return throwError(state, "a line break is expected");
      }
      state.line += 1;
      state.lineStart = state.position;
    }
    function skipSeparationSpace(state, allowComments, checkIndent) {
      let lineBreaks = 0, ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        while (isWhiteSpace(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (allowComments && ch === 0x23 /* # */) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0x0a && /* LF */ ch !== 0x0d && /* CR */ ch !== 0);
        }
        if (isEOL(ch)) {
          readLineBreak(state);
          ch = state.input.charCodeAt(state.position);
          lineBreaks++;
          state.lineIndent = 0;
          while (ch === 0x20 /* Space */) {
            state.lineIndent++;
            ch = state.input.charCodeAt(++state.position);
          }
        } else {
          break;
        }
      }
      if (
        checkIndent !== -1 &&
        lineBreaks !== 0 &&
        state.lineIndent < checkIndent
      ) {
        throwWarning(state, "deficient indentation");
      }
      return lineBreaks;
    }
    function testDocumentSeparator(state) {
      let _position = state.position;
      let ch = state.input.charCodeAt(_position);
      // Condition state.position === state.lineStart is tested
      // in parent on each call, for efficiency. No needs to test here again.
      if (
        (ch === 0x2d || /* - */ ch === 0x2e) /* . */ &&
        ch === state.input.charCodeAt(_position + 1) &&
        ch === state.input.charCodeAt(_position + 2)
      ) {
        _position += 3;
        ch = state.input.charCodeAt(_position);
        if (ch === 0 || isWsOrEol(ch)) {
          return true;
        }
      }
      return false;
    }
    function writeFoldedLines(state, count) {
      if (count === 1) {
        state.result += " ";
      } else if (count > 1) {
        state.result += common.repeat("\n", count - 1);
      }
    }
    function readPlainScalar(state, nodeIndent, withinFlowCollection) {
      const kind = state.kind;
      const result = state.result;
      let ch = state.input.charCodeAt(state.position);
      if (
        isWsOrEol(ch) ||
        isFlowIndicator(ch) ||
        ch === 0x23 /* # */ ||
        ch === 0x26 /* & */ ||
        ch === 0x2a /* * */ ||
        ch === 0x21 /* ! */ ||
        ch === 0x7c /* | */ ||
        ch === 0x3e /* > */ ||
        ch === 0x27 /* ' */ ||
        ch === 0x22 /* " */ ||
        ch === 0x25 /* % */ ||
        ch === 0x40 /* @ */ ||
        ch === 0x60 /* ` */
      ) {
        return false;
      }
      let following;
      if (ch === 0x3f || /* ? */ ch === 0x2d /* - */) {
        following = state.input.charCodeAt(state.position + 1);
        if (
          isWsOrEol(following) ||
          (withinFlowCollection && isFlowIndicator(following))
        ) {
          return false;
        }
      }
      state.kind = "scalar";
      state.result = "";
      let captureEnd, captureStart = (captureEnd = state.position);
      let hasPendingContent = false;
      let line = 0;
      while (ch !== 0) {
        if (ch === 0x3a /* : */) {
          following = state.input.charCodeAt(state.position + 1);
          if (
            isWsOrEol(following) ||
            (withinFlowCollection && isFlowIndicator(following))
          ) {
            break;
          }
        } else if (ch === 0x23 /* # */) {
          const preceding = state.input.charCodeAt(state.position - 1);
          if (isWsOrEol(preceding)) {
            break;
          }
        } else if (
          (state.position === state.lineStart &&
            testDocumentSeparator(state)) ||
          (withinFlowCollection && isFlowIndicator(ch))
        ) {
          break;
        } else if (isEOL(ch)) {
          line = state.line;
          const lineStart = state.lineStart;
          const lineIndent = state.lineIndent;
          skipSeparationSpace(state, false, -1);
          if (state.lineIndent >= nodeIndent) {
            hasPendingContent = true;
            ch = state.input.charCodeAt(state.position);
            continue;
          } else {
            state.position = captureEnd;
            state.line = line;
            state.lineStart = lineStart;
            state.lineIndent = lineIndent;
            break;
          }
        }
        if (hasPendingContent) {
          captureSegment(state, captureStart, captureEnd, false);
          writeFoldedLines(state, state.line - line);
          captureStart = captureEnd = state.position;
          hasPendingContent = false;
        }
        if (!isWhiteSpace(ch)) {
          captureEnd = state.position + 1;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, captureEnd, false);
      if (state.result) {
        return true;
      }
      state.kind = kind;
      state.result = result;
      return false;
    }
    function readSingleQuotedScalar(state, nodeIndent) {
      let ch, captureStart, captureEnd;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 0x27 /* ' */) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 0x27 /* ' */) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (ch === 0x27 /* ' */) {
            captureStart = state.position;
            state.position++;
            captureEnd = state.position;
          } else {
            return true;
          }
        } else if (isEOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(
            state,
            skipSeparationSpace(state, false, nodeIndent),
          );
          captureStart = captureEnd = state.position;
        } else if (
          state.position === state.lineStart &&
          testDocumentSeparator(state)
        ) {
          return throwError(
            state,
            "unexpected end of the document within a single quoted scalar",
          );
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      return throwError(
        state,
        "unexpected end of the stream within a single quoted scalar",
      );
    }
    function readDoubleQuotedScalar(state, nodeIndent) {
      let ch = state.input.charCodeAt(state.position);
      if (ch !== 0x22 /* " */) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      let captureEnd, captureStart = (captureEnd = state.position);
      let tmp;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 0x22 /* " */) {
          captureSegment(state, captureStart, state.position, true);
          state.position++;
          return true;
        }
        if (ch === 0x5c /* \ */) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (isEOL(ch)) {
            skipSeparationSpace(state, false, nodeIndent);
            // TODO: rework to inline fn with no type cast?
          } else if (ch < 256 && simpleEscapeCheck[ch]) {
            state.result += simpleEscapeMap[ch];
            state.position++;
          } else if ((tmp = escapedHexLen(ch)) > 0) {
            let hexLength = tmp;
            let hexResult = 0;
            for (; hexLength > 0; hexLength--) {
              ch = state.input.charCodeAt(++state.position);
              if ((tmp = fromHexCode(ch)) >= 0) {
                hexResult = (hexResult << 4) + tmp;
              } else {
                return throwError(state, "expected hexadecimal character");
              }
            }
            state.result += charFromCodepoint(hexResult);
            state.position++;
          } else {
            return throwError(state, "unknown escape sequence");
          }
          captureStart = captureEnd = state.position;
        } else if (isEOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(
            state,
            skipSeparationSpace(state, false, nodeIndent),
          );
          captureStart = captureEnd = state.position;
        } else if (
          state.position === state.lineStart &&
          testDocumentSeparator(state)
        ) {
          return throwError(
            state,
            "unexpected end of the document within a double quoted scalar",
          );
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      return throwError(
        state,
        "unexpected end of the stream within a double quoted scalar",
      );
    }
    function readFlowCollection(state, nodeIndent) {
      let ch = state.input.charCodeAt(state.position);
      let terminator;
      let isMapping = true;
      let result = {};
      if (ch === 0x5b /* [ */) {
        terminator = 0x5d; /* ] */
        isMapping = false;
        result = [];
      } else if (ch === 0x7b /* { */) {
        terminator = 0x7d; /* } */
      } else {
        return false;
      }
      if (
        state.anchor !== null &&
        typeof state.anchor != "undefined" &&
        typeof state.anchorMap != "undefined"
      ) {
        state.anchorMap[state.anchor] = result;
      }
      ch = state.input.charCodeAt(++state.position);
      const tag = state.tag, anchor = state.anchor;
      let readNext = true;
      let valueNode,
        keyNode,
        keyTag = (keyNode = valueNode = null),
        isExplicitPair,
        isPair = (isExplicitPair = false);
      let following = 0, line = 0;
      const overridableKeys = {};
      while (ch !== 0) {
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === terminator) {
          state.position++;
          state.tag = tag;
          state.anchor = anchor;
          state.kind = isMapping ? "mapping" : "sequence";
          state.result = result;
          return true;
        }
        if (!readNext) {
          return throwError(
            state,
            "missed comma between flow collection entries",
          );
        }
        keyTag = keyNode = valueNode = null;
        isPair = isExplicitPair = false;
        if (ch === 0x3f /* ? */) {
          following = state.input.charCodeAt(state.position + 1);
          if (isWsOrEol(following)) {
            isPair = isExplicitPair = true;
            state.position++;
            skipSeparationSpace(state, true, nodeIndent);
          }
        }
        line = state.line;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        keyTag = state.tag || null;
        keyNode = state.result;
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if ((isExplicitPair || state.line === line) && ch === 0x3a /* : */) {
          isPair = true;
          ch = state.input.charCodeAt(++state.position);
          skipSeparationSpace(state, true, nodeIndent);
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
          valueNode = state.result;
        }
        if (isMapping) {
          storeMappingPair(
            state,
            result,
            overridableKeys,
            keyTag,
            keyNode,
            valueNode,
          );
        } else if (isPair) {
          result.push(
            storeMappingPair(
              state,
              null,
              overridableKeys,
              keyTag,
              keyNode,
              valueNode,
            ),
          );
        } else {
          result.push(keyNode);
        }
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === 0x2c /* , */) {
          readNext = true;
          ch = state.input.charCodeAt(++state.position);
        } else {
          readNext = false;
        }
      }
      return throwError(
        state,
        "unexpected end of the stream within a flow collection",
      );
    }
    function readBlockScalar(state, nodeIndent) {
      let chomping = CHOMPING_CLIP,
        didReadContent = false,
        detectedIndent = false,
        textIndent = nodeIndent,
        emptyLines = 0,
        atMoreIndented = false;
      let ch = state.input.charCodeAt(state.position);
      let folding = false;
      if (ch === 0x7c /* | */) {
        folding = false;
      } else if (ch === 0x3e /* > */) {
        folding = true;
      } else {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      let tmp = 0;
      while (ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
        if (ch === 0x2b || /* + */ ch === 0x2d /* - */) {
          if (CHOMPING_CLIP === chomping) {
            chomping = ch === 0x2b /* + */ ? CHOMPING_KEEP : CHOMPING_STRIP;
          } else {
            return throwError(state, "repeat of a chomping mode identifier");
          }
        } else if ((tmp = fromDecimalCode(ch)) >= 0) {
          if (tmp === 0) {
            return throwError(
              state,
              "bad explicit indentation width of a block scalar; it cannot be less than one",
            );
          } else if (!detectedIndent) {
            textIndent = nodeIndent + tmp - 1;
            detectedIndent = true;
          } else {
            return throwError(
              state,
              "repeat of an indentation width identifier",
            );
          }
        } else {
          break;
        }
      }
      if (isWhiteSpace(ch)) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (isWhiteSpace(ch));
        if (ch === 0x23 /* # */) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (!isEOL(ch) && ch !== 0);
        }
      }
      while (ch !== 0) {
        readLineBreak(state);
        state.lineIndent = 0;
        ch = state.input.charCodeAt(state.position);
        while (
          (!detectedIndent || state.lineIndent < textIndent) &&
          ch === 0x20 /* Space */
        ) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
        if (!detectedIndent && state.lineIndent > textIndent) {
          textIndent = state.lineIndent;
        }
        if (isEOL(ch)) {
          emptyLines++;
          continue;
        }
        // End of the scalar.
        if (state.lineIndent < textIndent) {
          // Perform the chomping.
          if (chomping === CHOMPING_KEEP) {
            state.result += common.repeat(
              "\n",
              didReadContent ? 1 + emptyLines : emptyLines,
            );
          } else if (chomping === CHOMPING_CLIP) {
            if (didReadContent) {
              // i.e. only if the scalar is not empty.
              state.result += "\n";
            }
          }
          // Break this `while` cycle and go to the funciton's epilogue.
          break;
        }
        // Folded style: use fancy rules to handle line breaks.
        if (folding) {
          // Lines starting with white space characters (more-indented lines) are not folded.
          if (isWhiteSpace(ch)) {
            atMoreIndented = true;
            // except for the first content line (cf. Example 8.1)
            state.result += common.repeat(
              "\n",
              didReadContent ? 1 + emptyLines : emptyLines,
            );
            // End of more-indented block.
          } else if (atMoreIndented) {
            atMoreIndented = false;
            state.result += common.repeat("\n", emptyLines + 1);
            // Just one line break - perceive as the same line.
          } else if (emptyLines === 0) {
            if (didReadContent) {
              // i.e. only if we have already read some scalar content.
              state.result += " ";
            }
            // Several line breaks - perceive as different lines.
          } else {
            state.result += common.repeat("\n", emptyLines);
          }
          // Literal style: just add exact number of line breaks between content lines.
        } else {
          // Keep all line breaks except the header line break.
          state.result += common.repeat(
            "\n",
            didReadContent ? 1 + emptyLines : emptyLines,
          );
        }
        didReadContent = true;
        detectedIndent = true;
        emptyLines = 0;
        const captureStart = state.position;
        while (!isEOL(ch) && ch !== 0) {
          ch = state.input.charCodeAt(++state.position);
        }
        captureSegment(state, captureStart, state.position, false);
      }
      return true;
    }
    function readBlockSequence(state, nodeIndent) {
      let line, following, detected = false, ch;
      const tag = state.tag, anchor = state.anchor, result = [];
      if (
        state.anchor !== null &&
        typeof state.anchor !== "undefined" &&
        typeof state.anchorMap !== "undefined"
      ) {
        state.anchorMap[state.anchor] = result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        if (ch !== 0x2d /* - */) {
          break;
        }
        following = state.input.charCodeAt(state.position + 1);
        if (!isWsOrEol(following)) {
          break;
        }
        detected = true;
        state.position++;
        if (skipSeparationSpace(state, true, -1)) {
          if (state.lineIndent <= nodeIndent) {
            result.push(null);
            ch = state.input.charCodeAt(state.position);
            continue;
          }
        }
        line = state.line;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
        result.push(state.result);
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if (
          (state.line === line || state.lineIndent > nodeIndent) && ch !== 0
        ) {
          return throwError(state, "bad indentation of a sequence entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (detected) {
        state.tag = tag;
        state.anchor = anchor;
        state.kind = "sequence";
        state.result = result;
        return true;
      }
      return false;
    }
    function readBlockMapping(state, nodeIndent, flowIndent) {
      const tag = state.tag,
        anchor = state.anchor,
        result = {},
        overridableKeys = {};
      let following,
        allowCompact = false,
        line,
        pos,
        keyTag = null,
        keyNode = null,
        valueNode = null,
        atExplicitKey = false,
        detected = false,
        ch;
      if (
        state.anchor !== null &&
        typeof state.anchor !== "undefined" &&
        typeof state.anchorMap !== "undefined"
      ) {
        state.anchorMap[state.anchor] = result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        following = state.input.charCodeAt(state.position + 1);
        line = state.line; // Save the current line.
        pos = state.position;
        //
        // Explicit notation case. There are two separate blocks:
        // first for the key (denoted by "?") and second for the value (denoted by ":")
        //
        if (
          (ch === 0x3f || /* ? */ ch === 0x3a) && /* : */ isWsOrEol(following)
        ) {
          if (ch === 0x3f /* ? */) {
            if (atExplicitKey) {
              storeMappingPair(
                state,
                result,
                overridableKeys,
                keyTag,
                keyNode,
                null,
              );
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = true;
            allowCompact = true;
          } else if (atExplicitKey) {
            // i.e. 0x3A/* : */ === character after the explicit key.
            atExplicitKey = false;
            allowCompact = true;
          } else {
            return throwError(
              state,
              "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line",
            );
          }
          state.position += 1;
          ch = following;
          //
          // Implicit notation case. Flow-style node as the key first, then ":", and the value.
          //
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
        } else if (
          composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)
        ) {
          if (state.line === line) {
            ch = state.input.charCodeAt(state.position);
            while (isWhiteSpace(ch)) {
              ch = state.input.charCodeAt(++state.position);
            }
            if (ch === 0x3a /* : */) {
              ch = state.input.charCodeAt(++state.position);
              if (!isWsOrEol(ch)) {
                return throwError(
                  state,
                  "a whitespace character is expected after the key-value separator within a block mapping",
                );
              }
              if (atExplicitKey) {
                storeMappingPair(
                  state,
                  result,
                  overridableKeys,
                  keyTag,
                  keyNode,
                  null,
                );
                keyTag = keyNode = valueNode = null;
              }
              detected = true;
              atExplicitKey = false;
              allowCompact = false;
              keyTag = state.tag;
              keyNode = state.result;
            } else if (detected) {
              return throwError(
                state,
                "can not read an implicit mapping pair; a colon is missed",
              );
            } else {
              state.tag = tag;
              state.anchor = anchor;
              return true; // Keep the result of `composeNode`.
            }
          } else if (detected) {
            return throwError(
              state,
              "can not read a block mapping entry; a multiline key may not be an implicit key",
            );
          } else {
            state.tag = tag;
            state.anchor = anchor;
            return true; // Keep the result of `composeNode`.
          }
        } else {
          break; // Reading is done. Go to the epilogue.
        }
        //
        // Common reading code for both explicit and implicit notations.
        //
        if (state.line === line || state.lineIndent > nodeIndent) {
          if (
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            composeNode(
              state,
              nodeIndent,
              CONTEXT_BLOCK_OUT,
              true,
              allowCompact,
            )
          ) {
            if (atExplicitKey) {
              keyNode = state.result;
            } else {
              valueNode = state.result;
            }
          }
          if (!atExplicitKey) {
            storeMappingPair(
              state,
              result,
              overridableKeys,
              keyTag,
              keyNode,
              valueNode,
              line,
              pos,
            );
            keyTag = keyNode = valueNode = null;
          }
          skipSeparationSpace(state, true, -1);
          ch = state.input.charCodeAt(state.position);
        }
        if (state.lineIndent > nodeIndent && ch !== 0) {
          return throwError(state, "bad indentation of a mapping entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      //
      // Epilogue.
      //
      // Special case: last mapping's node contains only the key in explicit notation.
      if (atExplicitKey) {
        storeMappingPair(state, result, overridableKeys, keyTag, keyNode, null);
      }
      // Expose the resulting mapping.
      if (detected) {
        state.tag = tag;
        state.anchor = anchor;
        state.kind = "mapping";
        state.result = result;
      }
      return detected;
    }
    function readTagProperty(state) {
      let position,
        isVerbatim = false,
        isNamed = false,
        tagHandle = "",
        tagName,
        ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 0x21 /* ! */) {
        return false;
      }
      if (state.tag !== null) {
        return throwError(state, "duplication of a tag property");
      }
      ch = state.input.charCodeAt(++state.position);
      if (ch === 0x3c /* < */) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);
      } else if (ch === 0x21 /* ! */) {
        isNamed = true;
        tagHandle = "!!";
        ch = state.input.charCodeAt(++state.position);
      } else {
        tagHandle = "!";
      }
      position = state.position;
      if (isVerbatim) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && ch !== 0x3e /* > */);
        if (state.position < state.length) {
          tagName = state.input.slice(position, state.position);
          ch = state.input.charCodeAt(++state.position);
        } else {
          return throwError(
            state,
            "unexpected end of the stream within a verbatim tag",
          );
        }
      } else {
        while (ch !== 0 && !isWsOrEol(ch)) {
          if (ch === 0x21 /* ! */) {
            if (!isNamed) {
              tagHandle = state.input.slice(position - 1, state.position + 1);
              if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                return throwError(
                  state,
                  "named tag handle cannot contain such characters",
                );
              }
              isNamed = true;
              position = state.position + 1;
            } else {
              return throwError(
                state,
                "tag suffix cannot contain exclamation marks",
              );
            }
          }
          ch = state.input.charCodeAt(++state.position);
        }
        tagName = state.input.slice(position, state.position);
        if (PATTERN_FLOW_INDICATORS.test(tagName)) {
          return throwError(
            state,
            "tag suffix cannot contain flow indicator characters",
          );
        }
      }
      if (tagName && !PATTERN_TAG_URI.test(tagName)) {
        return throwError(
          state,
          `tag name cannot contain such characters: ${tagName}`,
        );
      }
      if (isVerbatim) {
        state.tag = tagName;
      } else if (
        typeof state.tagMap !== "undefined" &&
        _hasOwnProperty.call(state.tagMap, tagHandle)
      ) {
        state.tag = state.tagMap[tagHandle] + tagName;
      } else if (tagHandle === "!") {
        state.tag = `!${tagName}`;
      } else if (tagHandle === "!!") {
        state.tag = `tag:yaml.org,2002:${tagName}`;
      } else {
        return throwError(state, `undeclared tag handle "${tagHandle}"`);
      }
      return true;
    }
    function readAnchorProperty(state) {
      let ch = state.input.charCodeAt(state.position);
      if (ch !== 0x26 /* & */) {
        return false;
      }
      if (state.anchor !== null) {
        return throwError(state, "duplication of an anchor property");
      }
      ch = state.input.charCodeAt(++state.position);
      const position = state.position;
      while (ch !== 0 && !isWsOrEol(ch) && !isFlowIndicator(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === position) {
        return throwError(
          state,
          "name of an anchor node must contain at least one character",
        );
      }
      state.anchor = state.input.slice(position, state.position);
      return true;
    }
    function readAlias(state) {
      let ch = state.input.charCodeAt(state.position);
      if (ch !== 0x2a /* * */) {
        return false;
      }
      ch = state.input.charCodeAt(++state.position);
      const _position = state.position;
      while (ch !== 0 && !isWsOrEol(ch) && !isFlowIndicator(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        return throwError(
          state,
          "name of an alias node must contain at least one character",
        );
      }
      const alias = state.input.slice(_position, state.position);
      if (
        typeof state.anchorMap !== "undefined" &&
        !state.anchorMap.hasOwnProperty(alias)
      ) {
        return throwError(state, `unidentified alias "${alias}"`);
      }
      if (typeof state.anchorMap !== "undefined") {
        state.result = state.anchorMap[alias];
      }
      skipSeparationSpace(state, true, -1);
      return true;
    }
    function composeNode(
      state,
      parentIndent,
      nodeContext,
      allowToSeek,
      allowCompact,
    ) {
      let allowBlockScalars,
        allowBlockCollections,
        indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
        atNewLine = false,
        hasContent = false,
        type,
        flowIndent,
        blockIndent;
      if (state.listener && state.listener !== null) {
        state.listener("open", state);
      }
      state.tag = null;
      state.anchor = null;
      state.kind = null;
      state.result = null;
      const allowBlockStyles =
        (allowBlockScalars = allowBlockCollections =
          CONTEXT_BLOCK_OUT === nodeContext ||
          CONTEXT_BLOCK_IN === nodeContext);
      if (allowToSeek) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        }
      }
      if (indentStatus === 1) {
        while (readTagProperty(state) || readAnchorProperty(state)) {
          if (skipSeparationSpace(state, true, -1)) {
            atNewLine = true;
            allowBlockCollections = allowBlockStyles;
            if (state.lineIndent > parentIndent) {
              indentStatus = 1;
            } else if (state.lineIndent === parentIndent) {
              indentStatus = 0;
            } else if (state.lineIndent < parentIndent) {
              indentStatus = -1;
            }
          } else {
            allowBlockCollections = false;
          }
        }
      }
      if (allowBlockCollections) {
        allowBlockCollections = atNewLine || allowCompact;
      }
      if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
        const cond = CONTEXT_FLOW_IN === nodeContext ||
          CONTEXT_FLOW_OUT === nodeContext;
        flowIndent = cond ? parentIndent : parentIndent + 1;
        blockIndent = state.position - state.lineStart;
        if (indentStatus === 1) {
          if (
            (allowBlockCollections &&
              (readBlockSequence(state, blockIndent) ||
                readBlockMapping(state, blockIndent, flowIndent))) ||
            readFlowCollection(state, flowIndent)
          ) {
            hasContent = true;
          } else {
            if (
              (allowBlockScalars && readBlockScalar(state, flowIndent)) ||
              readSingleQuotedScalar(state, flowIndent) ||
              readDoubleQuotedScalar(state, flowIndent)
            ) {
              hasContent = true;
            } else if (readAlias(state)) {
              hasContent = true;
              if (state.tag !== null || state.anchor !== null) {
                return throwError(
                  state,
                  "alias node should not have Any properties",
                );
              }
            } else if (
              readPlainScalar(
                state,
                flowIndent,
                CONTEXT_FLOW_IN === nodeContext,
              )
            ) {
              hasContent = true;
              if (state.tag === null) {
                state.tag = "?";
              }
            }
            if (
              state.anchor !== null && typeof state.anchorMap !== "undefined"
            ) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else if (indentStatus === 0) {
          // Special case: block sequences are allowed to have same indentation level as the parent.
          // http://www.yaml.org/spec/1.2/spec.html#id2799784
          hasContent = allowBlockCollections &&
            readBlockSequence(state, blockIndent);
        }
      }
      if (state.tag !== null && state.tag !== "!") {
        if (state.tag === "?") {
          for (
            let typeIndex = 0, typeQuantity = state.implicitTypes.length;
            typeIndex < typeQuantity;
            typeIndex++
          ) {
            type = state.implicitTypes[typeIndex];
            // Implicit resolving is not allowed for non-scalar types, and '?'
            // non-specific tag is only assigned to plain scalars. So, it isn't
            // needed to check for 'kind' conformity.
            if (type.resolve(state.result)) {
              // `state.result` updated in resolver if matched
              state.result = type.construct(state.result);
              state.tag = type.tag;
              if (
                state.anchor !== null &&
                typeof state.anchorMap !== "undefined"
              ) {
                state.anchorMap[state.anchor] = state.result;
              }
              break;
            }
          }
        } else if (
          _hasOwnProperty.call(
            state.typeMap[state.kind || "fallback"],
            state.tag,
          )
        ) {
          type = state.typeMap[state.kind || "fallback"][state.tag];
          if (state.result !== null && type.kind !== state.kind) {
            return throwError(
              state,
              `unacceptable node kind for !<${state.tag}> tag; it should be "${type.kind}", not "${state.kind}"`,
            );
          }
          if (!type.resolve(state.result)) {
            // `state.result` updated in resolver if matched
            return throwError(
              state,
              `cannot resolve a node with !<${state.tag}> explicit tag`,
            );
          } else {
            state.result = type.construct(state.result);
            if (
              state.anchor !== null && typeof state.anchorMap !== "undefined"
            ) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else {
          return throwError(state, `unknown tag !<${state.tag}>`);
        }
      }
      if (state.listener && state.listener !== null) {
        state.listener("close", state);
      }
      return state.tag !== null || state.anchor !== null || hasContent;
    }
    function readDocument(state) {
      const documentStart = state.position;
      let position, directiveName, directiveArgs, hasDirectives = false, ch;
      state.version = null;
      state.checkLineBreaks = state.legacy;
      state.tagMap = {};
      state.anchorMap = {};
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if (state.lineIndent > 0 || ch !== 0x25 /* % */) {
          break;
        }
        hasDirectives = true;
        ch = state.input.charCodeAt(++state.position);
        position = state.position;
        while (ch !== 0 && !isWsOrEol(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveName = state.input.slice(position, state.position);
        directiveArgs = [];
        if (directiveName.length < 1) {
          return throwError(
            state,
            "directive name must not be less than one character in length",
          );
        }
        while (ch !== 0) {
          while (isWhiteSpace(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 0x23 /* # */) {
            do {
              ch = state.input.charCodeAt(++state.position);
            } while (ch !== 0 && !isEOL(ch));
            break;
          }
          if (isEOL(ch)) {
            break;
          }
          position = state.position;
          while (ch !== 0 && !isWsOrEol(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          directiveArgs.push(state.input.slice(position, state.position));
        }
        if (ch !== 0) {
          readLineBreak(state);
        }
        if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
          directiveHandlers[directiveName](
            state,
            directiveName,
            ...directiveArgs,
          );
        } else {
          throwWarning(state, `unknown document directive "${directiveName}"`);
        }
      }
      skipSeparationSpace(state, true, -1);
      if (
        state.lineIndent === 0 &&
        state.input.charCodeAt(state.position) === 0x2d /* - */ &&
        state.input.charCodeAt(state.position + 1) === 0x2d /* - */ &&
        state.input.charCodeAt(state.position + 2) === 0x2d /* - */
      ) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      } else if (hasDirectives) {
        return throwError(state, "directives end mark is expected");
      }
      composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
      skipSeparationSpace(state, true, -1);
      if (
        state.checkLineBreaks &&
        PATTERN_NON_ASCII_LINE_BREAKS.test(
          state.input.slice(documentStart, state.position),
        )
      ) {
        throwWarning(state, "non-ASCII line breaks are interpreted as content");
      }
      state.documents.push(state.result);
      if (state.position === state.lineStart && testDocumentSeparator(state)) {
        if (state.input.charCodeAt(state.position) === 0x2e /* . */) {
          state.position += 3;
          skipSeparationSpace(state, true, -1);
        }
        return;
      }
      if (state.position < state.length - 1) {
        return throwError(
          state,
          "end of the stream or a document separator is expected",
        );
      } else {
        return;
      }
    }
    function loadDocuments(input, options) {
      input = String(input);
      options = options || {};
      if (input.length !== 0) {
        // Add tailing `\n` if not exists
        if (
          input.charCodeAt(input.length - 1) !== 0x0a /* LF */ &&
          input.charCodeAt(input.length - 1) !== 0x0d /* CR */
        ) {
          input += "\n";
        }
        // Strip BOM
        if (input.charCodeAt(0) === 0xfeff) {
          input = input.slice(1);
        }
      }
      const state = new loader_state_ts_1.LoaderState(input, options);
      // Use 0 as string terminator. That significantly simplifies bounds check.
      state.input += "\0";
      while (state.input.charCodeAt(state.position) === 0x20 /* Space */) {
        state.lineIndent += 1;
        state.position += 1;
      }
      while (state.position < state.length - 1) {
        readDocument(state);
      }
      return state.documents;
    }
    function isCbFunction(fn) {
      return typeof fn === "function";
    }
    function loadAll(input, iteratorOrOption, options) {
      if (!isCbFunction(iteratorOrOption)) {
        return loadDocuments(input, iteratorOrOption);
      }
      const documents = loadDocuments(input, options);
      const iterator = iteratorOrOption;
      for (let index = 0, length = documents.length; index < length; index++) {
        iterator(documents[index]);
      }
      return void 0;
    }
    exports_64("loadAll", loadAll);
    function load(input, options) {
      const documents = loadDocuments(input, options);
      if (documents.length === 0) {
        return;
      }
      if (documents.length === 1) {
        return documents[0];
      }
      throw new error_ts_2.YAMLError(
        "expected a single document in the stream, but found more",
      );
    }
    exports_64("load", load);
    return {
      setters: [
        function (error_ts_2_1) {
          error_ts_2 = error_ts_2_1;
        },
        function (mark_ts_1_1) {
          mark_ts_1 = mark_ts_1_1;
        },
        function (common_1) {
          common = common_1;
        },
        function (loader_state_ts_1_1) {
          loader_state_ts_1 = loader_state_ts_1_1;
        },
      ],
      execute: function () {
        _hasOwnProperty = Object.prototype.hasOwnProperty;
        CONTEXT_FLOW_IN = 1;
        CONTEXT_FLOW_OUT = 2;
        CONTEXT_BLOCK_IN = 3;
        CONTEXT_BLOCK_OUT = 4;
        CHOMPING_CLIP = 1;
        CHOMPING_STRIP = 2;
        CHOMPING_KEEP = 3;
        PATTERN_NON_PRINTABLE =
          /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
        PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
        PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
        PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
        /* eslint-disable-next-line max-len */
        PATTERN_TAG_URI =
          /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
        simpleEscapeCheck = new Array(256); // integer, for fast access
        simpleEscapeMap = new Array(256);
        for (let i = 0; i < 256; i++) {
          simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
          simpleEscapeMap[i] = simpleEscapeSequence(i);
        }
        directiveHandlers = {
          YAML(state, _name, ...args) {
            if (state.version !== null) {
              return throwError(state, "duplication of %YAML directive");
            }
            if (args.length !== 1) {
              return throwError(
                state,
                "YAML directive accepts exactly one argument",
              );
            }
            const match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
            if (match === null) {
              return throwError(
                state,
                "ill-formed argument of the YAML directive",
              );
            }
            const major = parseInt(match[1], 10);
            const minor = parseInt(match[2], 10);
            if (major !== 1) {
              return throwError(
                state,
                "unacceptable YAML version of the document",
              );
            }
            state.version = args[0];
            state.checkLineBreaks = minor < 2;
            if (minor !== 1 && minor !== 2) {
              return throwWarning(
                state,
                "unsupported YAML version of the document",
              );
            }
          },
          TAG(state, _name, ...args) {
            if (args.length !== 2) {
              return throwError(
                state,
                "TAG directive accepts exactly two arguments",
              );
            }
            const handle = args[0];
            const prefix = args[1];
            if (!PATTERN_TAG_HANDLE.test(handle)) {
              return throwError(
                state,
                "ill-formed tag handle (first argument) of the TAG directive",
              );
            }
            if (_hasOwnProperty.call(state.tagMap, handle)) {
              return throwError(
                state,
                `there is a previously declared suffix for "${handle}" tag handle`,
              );
            }
            if (!PATTERN_TAG_URI.test(prefix)) {
              return throwError(
                state,
                "ill-formed tag prefix (second argument) of the TAG directive",
              );
            }
            if (typeof state.tagMap === "undefined") {
              state.tagMap = {};
            }
            state.tagMap[handle] = prefix;
          },
        };
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/parse",
  ["https://deno.land/std@0.52.0/encoding/_yaml/loader/loader"],
  function (exports_65, context_65) {
    "use strict";
    var loader_ts_1;
    var __moduleName = context_65 && context_65.id;
    /**
     * Parses `content` as single YAML document.
     *
     * Returns a JavaScript object or throws `YAMLException` on error.
     * By default, does not support regexps, functions and undefined. This method is safe for untrusted data.
     *
     */
    function parse(content, options) {
      return loader_ts_1.load(content, options);
    }
    exports_65("parse", parse);
    /**
     * Same as `parse()`, but understands multi-document sources.
     * Applies iterator to each document if specified, or returns array of documents.
     */
    function parseAll(content, iterator, options) {
      return loader_ts_1.loadAll(content, iterator, options);
    }
    exports_65("parseAll", parseAll);
    return {
      setters: [
        function (loader_ts_1_1) {
          loader_ts_1 = loader_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/dumper/dumper_state",
  ["https://deno.land/std@0.52.0/encoding/_yaml/state"],
  function (exports_66, context_66) {
    "use strict";
    var state_ts_2, _hasOwnProperty, DumperState;
    var __moduleName = context_66 && context_66.id;
    function compileStyleMap(schema, map) {
      if (typeof map === "undefined" || map === null) {
        return {};
      }
      let type;
      const result = {};
      const keys = Object.keys(map);
      let tag, style;
      for (let index = 0, length = keys.length; index < length; index += 1) {
        tag = keys[index];
        style = String(map[tag]);
        if (tag.slice(0, 2) === "!!") {
          tag = `tag:yaml.org,2002:${tag.slice(2)}`;
        }
        type = schema.compiledTypeMap.fallback[tag];
        if (
          type &&
          typeof type.styleAliases !== "undefined" &&
          _hasOwnProperty.call(type.styleAliases, style)
        ) {
          style = type.styleAliases[style];
        }
        result[tag] = style;
      }
      return result;
    }
    return {
      setters: [
        function (state_ts_2_1) {
          state_ts_2 = state_ts_2_1;
        },
      ],
      execute: function () {
        _hasOwnProperty = Object.prototype.hasOwnProperty;
        DumperState = class DumperState extends state_ts_2.State {
          constructor(
            {
              schema,
              indent = 2,
              noArrayIndent = false,
              skipInvalid = false,
              flowLevel = -1,
              styles = null,
              sortKeys = false,
              lineWidth = 80,
              noRefs = false,
              noCompatMode = false,
              condenseFlow = false,
            },
          ) {
            super(schema);
            this.tag = null;
            this.result = "";
            this.duplicates = [];
            this.usedDuplicates = []; // changed from null to []
            this.indent = Math.max(1, indent);
            this.noArrayIndent = noArrayIndent;
            this.skipInvalid = skipInvalid;
            this.flowLevel = flowLevel;
            this.styleMap = compileStyleMap(this.schema, styles);
            this.sortKeys = sortKeys;
            this.lineWidth = lineWidth;
            this.noRefs = noRefs;
            this.noCompatMode = noCompatMode;
            this.condenseFlow = condenseFlow;
            this.implicitTypes = this.schema.compiledImplicit;
            this.explicitTypes = this.schema.compiledExplicit;
          }
        };
        exports_66("DumperState", DumperState);
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/dumper/dumper",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/error",
    "https://deno.land/std@0.52.0/encoding/_yaml/utils",
    "https://deno.land/std@0.52.0/encoding/_yaml/dumper/dumper_state",
  ],
  function (exports_67, context_67) {
    "use strict";
    var error_ts_3,
      common,
      dumper_state_ts_1,
      _toString,
      _hasOwnProperty,
      CHAR_TAB,
      CHAR_LINE_FEED,
      CHAR_SPACE,
      CHAR_EXCLAMATION,
      CHAR_DOUBLE_QUOTE,
      CHAR_SHARP,
      CHAR_PERCENT,
      CHAR_AMPERSAND,
      CHAR_SINGLE_QUOTE,
      CHAR_ASTERISK,
      CHAR_COMMA,
      CHAR_MINUS,
      CHAR_COLON,
      CHAR_GREATER_THAN,
      CHAR_QUESTION,
      CHAR_COMMERCIAL_AT,
      CHAR_LEFT_SQUARE_BRACKET,
      CHAR_RIGHT_SQUARE_BRACKET,
      CHAR_GRAVE_ACCENT,
      CHAR_LEFT_CURLY_BRACKET,
      CHAR_VERTICAL_LINE,
      CHAR_RIGHT_CURLY_BRACKET,
      ESCAPE_SEQUENCES,
      DEPRECATED_BOOLEANS_SYNTAX,
      STYLE_PLAIN,
      STYLE_SINGLE,
      STYLE_LITERAL,
      STYLE_FOLDED,
      STYLE_DOUBLE;
    var __moduleName = context_67 && context_67.id;
    function encodeHex(character) {
      const string = character.toString(16).toUpperCase();
      let handle;
      let length;
      if (character <= 0xff) {
        handle = "x";
        length = 2;
      } else if (character <= 0xffff) {
        handle = "u";
        length = 4;
      } else if (character <= 0xffffffff) {
        handle = "U";
        length = 8;
      } else {
        throw new error_ts_3.YAMLError(
          "code point within a string may not be greater than 0xFFFFFFFF",
        );
      }
      return `\\${handle}${
        common.repeat("0", length - string.length)
      }${string}`;
    }
    // Indents every line in a string. Empty lines (\n only) are not indented.
    function indentString(string, spaces) {
      const ind = common.repeat(" ", spaces), length = string.length;
      let position = 0, next = -1, result = "", line;
      while (position < length) {
        next = string.indexOf("\n", position);
        if (next === -1) {
          line = string.slice(position);
          position = length;
        } else {
          line = string.slice(position, next + 1);
          position = next + 1;
        }
        if (line.length && line !== "\n") {
          result += ind;
        }
        result += line;
      }
      return result;
    }
    function generateNextLine(state, level) {
      return `\n${common.repeat(" ", state.indent * level)}`;
    }
    function testImplicitResolving(state, str) {
      let type;
      for (
        let index = 0, length = state.implicitTypes.length;
        index < length;
        index += 1
      ) {
        type = state.implicitTypes[index];
        if (type.resolve(str)) {
          return true;
        }
      }
      return false;
    }
    // [33] s-white ::= s-space | s-tab
    function isWhitespace(c) {
      return c === CHAR_SPACE || c === CHAR_TAB;
    }
    // Returns true if the character can be printed without escaping.
    // From YAML 1.2: "any allowed characters known to be non-printable
    // should also be escaped. [However,] This isn’t mandatory"
    // Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
    function isPrintable(c) {
      return ((0x00020 <= c && c <= 0x00007e) ||
        (0x000a1 <= c && c <= 0x00d7ff && c !== 0x2028 && c !== 0x2029) ||
        (0x0e000 <= c && c <= 0x00fffd && c !== 0xfeff) /* BOM */ ||
        (0x10000 <= c && c <= 0x10ffff));
    }
    // Simplified test for values allowed after the first character in plain style.
    function isPlainSafe(c) {
      // Uses a subset of nb-char - c-flow-indicator - ":" - "#"
      // where nb-char ::= c-printable - b-char - c-byte-order-mark.
      return (isPrintable(c) &&
        c !== 0xfeff &&
        // - c-flow-indicator
        c !== CHAR_COMMA &&
        c !== CHAR_LEFT_SQUARE_BRACKET &&
        c !== CHAR_RIGHT_SQUARE_BRACKET &&
        c !== CHAR_LEFT_CURLY_BRACKET &&
        c !== CHAR_RIGHT_CURLY_BRACKET &&
        // - ":" - "#"
        c !== CHAR_COLON &&
        c !== CHAR_SHARP);
    }
    // Simplified test for values allowed as the first character in plain style.
    function isPlainSafeFirst(c) {
      // Uses a subset of ns-char - c-indicator
      // where ns-char = nb-char - s-white.
      return (isPrintable(c) &&
        c !== 0xfeff &&
        !isWhitespace(c) && // - s-white
        // - (c-indicator ::=
        // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
        c !== CHAR_MINUS &&
        c !== CHAR_QUESTION &&
        c !== CHAR_COLON &&
        c !== CHAR_COMMA &&
        c !== CHAR_LEFT_SQUARE_BRACKET &&
        c !== CHAR_RIGHT_SQUARE_BRACKET &&
        c !== CHAR_LEFT_CURLY_BRACKET &&
        c !== CHAR_RIGHT_CURLY_BRACKET &&
        // | “#” | “&” | “*” | “!” | “|” | “>” | “'” | “"”
        c !== CHAR_SHARP &&
        c !== CHAR_AMPERSAND &&
        c !== CHAR_ASTERISK &&
        c !== CHAR_EXCLAMATION &&
        c !== CHAR_VERTICAL_LINE &&
        c !== CHAR_GREATER_THAN &&
        c !== CHAR_SINGLE_QUOTE &&
        c !== CHAR_DOUBLE_QUOTE &&
        // | “%” | “@” | “`”)
        c !== CHAR_PERCENT &&
        c !== CHAR_COMMERCIAL_AT &&
        c !== CHAR_GRAVE_ACCENT);
    }
    // Determines whether block indentation indicator is required.
    function needIndentIndicator(string) {
      const leadingSpaceRe = /^\n* /;
      return leadingSpaceRe.test(string);
    }
    // Determines which scalar styles are possible and returns the preferred style.
    // lineWidth = -1 => no limit.
    // Pre-conditions: str.length > 0.
    // Post-conditions:
    //  STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
    //  STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
    //  STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
    function chooseScalarStyle(
      string,
      singleLineOnly,
      indentPerLevel,
      lineWidth,
      testAmbiguousType,
    ) {
      const shouldTrackWidth = lineWidth !== -1;
      let hasLineBreak = false,
        hasFoldableLine = false, // only checked if shouldTrackWidth
        previousLineBreak = -1, // count the first line correctly
        plain = isPlainSafeFirst(string.charCodeAt(0)) &&
          !isWhitespace(string.charCodeAt(string.length - 1));
      let char, i;
      if (singleLineOnly) {
        // Case: no block styles.
        // Check for disallowed characters to rule out plain and single.
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          plain = plain && isPlainSafe(char);
        }
      } else {
        // Case: block styles permitted.
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (char === CHAR_LINE_FEED) {
            hasLineBreak = true;
            // Check if any line can be folded.
            if (shouldTrackWidth) {
              hasFoldableLine = hasFoldableLine ||
                // Foldable line = too long, and not more-indented.
                (i - previousLineBreak - 1 > lineWidth &&
                  string[previousLineBreak + 1] !== " ");
              previousLineBreak = i;
            }
          } else if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          plain = plain && isPlainSafe(char);
        }
        // in case the end is missing a \n
        hasFoldableLine = hasFoldableLine ||
          (shouldTrackWidth &&
            i - previousLineBreak - 1 > lineWidth &&
            string[previousLineBreak + 1] !== " ");
      }
      // Although every style can represent \n without escaping, prefer block styles
      // for multiline, since they're more readable and they don't add empty lines.
      // Also prefer folding a super-long line.
      if (!hasLineBreak && !hasFoldableLine) {
        // Strings interpretable as another type have to be quoted;
        // e.g. the string 'true' vs. the boolean true.
        return plain && !testAmbiguousType(string) ? STYLE_PLAIN : STYLE_SINGLE;
      }
      // Edge case: block indentation indicator can only have one digit.
      if (indentPerLevel > 9 && needIndentIndicator(string)) {
        return STYLE_DOUBLE;
      }
      // At this point we know block styles are valid.
      // Prefer literal style unless we want to fold.
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    // Greedy line breaking.
    // Picks the longest line under the limit each time,
    // otherwise settles for the shortest line over the limit.
    // NB. More-indented lines *cannot* be folded, as that would add an extra \n.
    function foldLine(line, width) {
      if (line === "" || line[0] === " ") {
        return line;
      }
      // Since a more-indented line adds a \n, breaks can't be followed by a space.
      const breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
      let match;
      // start is an inclusive index. end, curr, and next are exclusive.
      let start = 0, end, curr = 0, next = 0;
      let result = "";
      // Invariants: 0 <= start <= length-1.
      //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
      // Inside the loop:
      //   A match implies length >= 2, so curr and next are <= length-2.
      // tslint:disable-next-line:no-conditional-assignment
      while ((match = breakRe.exec(line))) {
        next = match.index;
        // maintain invariant: curr - start <= width
        if (next - start > width) {
          end = curr > start ? curr : next; // derive end <= length-2
          result += `\n${line.slice(start, end)}`;
          // skip the space that was output as \n
          start = end + 1; // derive start <= length-1
        }
        curr = next;
      }
      // By the invariants, start <= length-1, so there is something left over.
      // It is either the whole string or a part starting from non-whitespace.
      result += "\n";
      // Insert a break if the remainder is too long and there is a break available.
      if (line.length - start > width && curr > start) {
        result += `${line.slice(start, curr)}\n${line.slice(curr + 1)}`;
      } else {
        result += line.slice(start);
      }
      return result.slice(1); // drop extra \n joiner
    }
    // (See the note for writeScalar.)
    function dropEndingNewline(string) {
      return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
    }
    // Note: a long line without a suitable break point will exceed the width limit.
    // Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
    function foldString(string, width) {
      // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
      // unless they're before or after a more-indented line, or at the very
      // beginning or end, in which case $k$ maps to $k$.
      // Therefore, parse each chunk as newline(s) followed by a content line.
      const lineRe = /(\n+)([^\n]*)/g;
      // first line (possibly an empty line)
      let result = (() => {
        let nextLF = string.indexOf("\n");
        nextLF = nextLF !== -1 ? nextLF : string.length;
        lineRe.lastIndex = nextLF;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return foldLine(string.slice(0, nextLF), width);
      })();
      // If we haven't reached the first content line yet, don't add an extra \n.
      let prevMoreIndented = string[0] === "\n" || string[0] === " ";
      let moreIndented;
      // rest of the lines
      let match;
      // tslint:disable-next-line:no-conditional-assignment
      while ((match = lineRe.exec(string))) {
        const prefix = match[1], line = match[2];
        moreIndented = line[0] === " ";
        result += prefix +
          (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") +
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          foldLine(line, width);
        prevMoreIndented = moreIndented;
      }
      return result;
    }
    // Escapes a double-quoted string.
    function escapeString(string) {
      let result = "";
      let char, nextChar;
      let escapeSeq;
      for (let i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        // Check for surrogate pairs (reference Unicode 3.0 section "3.7 Surrogates").
        if (char >= 0xd800 && char <= 0xdbff /* high surrogate */) {
          nextChar = string.charCodeAt(i + 1);
          if (nextChar >= 0xdc00 && nextChar <= 0xdfff /* low surrogate */) {
            // Combine the surrogate pair and store it escaped.
            result += encodeHex(
              (char - 0xd800) * 0x400 + nextChar - 0xdc00 + 0x10000,
            );
            // Advance index one extra since we already used that char here.
            i++;
            continue;
          }
        }
        escapeSeq = ESCAPE_SEQUENCES[char];
        result += !escapeSeq && isPrintable(char) ? string[i]
        : escapeSeq || encodeHex(char);
      }
      return result;
    }
    // Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
    function blockHeader(string, indentPerLevel) {
      const indentIndicator = needIndentIndicator(string)
        ? String(indentPerLevel) : "";
      // note the special case: the string '\n' counts as a "trailing" empty line.
      const clip = string[string.length - 1] === "\n";
      const keep = clip &&
        (string[string.length - 2] === "\n" || string === "\n");
      const chomp = keep ? "+" : clip ? "" : "-";
      return `${indentIndicator}${chomp}\n`;
    }
    // Note: line breaking/folding is implemented for only the folded style.
    // NB. We drop the last trailing newline (if any) of a returned block scalar
    //  since the dumper adds its own newline. This always works:
    //    • No ending newline => unaffected; already using strip "-" chomping.
    //    • Ending newline    => removed then restored.
    //  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
    function writeScalar(state, string, level, iskey) {
      state.dump = (() => {
        if (string.length === 0) {
          return "''";
        }
        if (
          !state.noCompatMode &&
          DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1
        ) {
          return `'${string}'`;
        }
        const indent = state.indent * Math.max(1, level); // no 0-indent scalars
        // As indentation gets deeper, let the width decrease monotonically
        // to the lower bound min(state.lineWidth, 40).
        // Note that this implies
        //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
        //  state.lineWidth > 40 + state.indent: width decreases until the lower
        //  bound.
        // This behaves better than a constant minimum width which disallows
        // narrower options, or an indent threshold which causes the width
        // to suddenly increase.
        const lineWidth = state.lineWidth === -1 ? -1
        : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
        // Without knowing if keys are implicit/explicit,
        // assume implicit for safety.
        const singleLineOnly = iskey ||
          // No block styles in flow mode.
          (state.flowLevel > -1 && level >= state.flowLevel);
        function testAmbiguity(str) {
          return testImplicitResolving(state, str);
        }
        switch (
          chooseScalarStyle(
            string,
            singleLineOnly,
            state.indent,
            lineWidth,
            testAmbiguity,
          )
        ) {
          case STYLE_PLAIN:
            return string;
          case STYLE_SINGLE:
            return `'${string.replace(/'/g, "''")}'`;
          case STYLE_LITERAL:
            return `|${blockHeader(string, state.indent)}${
              dropEndingNewline(indentString(string, indent))
            }`;
          case STYLE_FOLDED:
            return `>${blockHeader(string, state.indent)}${
              dropEndingNewline(
                indentString(foldString(string, lineWidth), indent),
              )
            }`;
          case STYLE_DOUBLE:
            return `"${escapeString(string)}"`;
          default:
            throw new error_ts_3.YAMLError(
              "impossible error: invalid scalar style",
            );
        }
      })();
    }
    function writeFlowSequence(state, level, object) {
      let _result = "";
      const _tag = state.tag;
      for (let index = 0, length = object.length; index < length; index += 1) {
        // Write only valid elements.
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (writeNode(state, level, object[index], false, false)) {
          if (index !== 0) {
            _result += `,${!state.condenseFlow ? " " : ""}`;
          }
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = `[${_result}]`;
    }
    function writeBlockSequence(state, level, object, compact = false) {
      let _result = "";
      const _tag = state.tag;
      for (let index = 0, length = object.length; index < length; index += 1) {
        // Write only valid elements.
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (writeNode(state, level + 1, object[index], true, true)) {
          if (!compact || index !== 0) {
            _result += generateNextLine(state, level);
          }
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            _result += "-";
          } else {
            _result += "- ";
          }
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = _result || "[]"; // Empty sequence if no valid values.
    }
    function writeFlowMapping(state, level, object) {
      let _result = "";
      const _tag = state.tag, objectKeyList = Object.keys(object);
      let pairBuffer, objectKey, objectValue;
      for (
        let index = 0, length = objectKeyList.length; index < length; index += 1
      ) {
        pairBuffer = state.condenseFlow ? '"' : "";
        if (index !== 0) {
          pairBuffer += ", ";
        }
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (!writeNode(state, level, objectKey, false, false)) {
          continue; // Skip this pair because of invalid key;
        }
        if (state.dump.length > 1024) {
          pairBuffer += "? ";
        }
        pairBuffer += `${state.dump}${state.condenseFlow ? '"' : ""}:${
          state.condenseFlow ? "" : " "
        }`;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (!writeNode(state, level, objectValue, false, false)) {
          continue; // Skip this pair because of invalid value.
        }
        pairBuffer += state.dump;
        // Both key and value are valid.
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = `{${_result}}`;
    }
    function writeBlockMapping(state, level, object, compact = false) {
      const _tag = state.tag, objectKeyList = Object.keys(object);
      let _result = "";
      // Allow sorting keys so that the output file is deterministic
      if (state.sortKeys === true) {
        // Default sorting
        objectKeyList.sort();
      } else if (typeof state.sortKeys === "function") {
        // Custom sort function
        objectKeyList.sort(state.sortKeys);
      } else if (state.sortKeys) {
        // Something is wrong
        throw new error_ts_3.YAMLError(
          "sortKeys must be a boolean or a function",
        );
      }
      let pairBuffer = "", objectKey, objectValue, explicitPair;
      for (
        let index = 0, length = objectKeyList.length; index < length; index += 1
      ) {
        pairBuffer = "";
        if (!compact || index !== 0) {
          pairBuffer += generateNextLine(state, level);
        }
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (!writeNode(state, level + 1, objectKey, true, true, true)) {
          continue; // Skip this pair because of invalid key.
        }
        explicitPair = (state.tag !== null && state.tag !== "?") ||
          (state.dump && state.dump.length > 1024);
        if (explicitPair) {
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            pairBuffer += "?";
          } else {
            pairBuffer += "? ";
          }
        }
        pairBuffer += state.dump;
        if (explicitPair) {
          pairBuffer += generateNextLine(state, level);
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
          continue; // Skip this pair because of invalid value.
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += ":";
        } else {
          pairBuffer += ": ";
        }
        pairBuffer += state.dump;
        // Both key and value are valid.
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = _result || "{}"; // Empty mapping if no valid pairs.
    }
    function detectType(state, object, explicit = false) {
      const typeList = explicit ? state.explicitTypes : state.implicitTypes;
      let type;
      let style;
      let _result;
      for (
        let index = 0, length = typeList.length; index < length; index += 1
      ) {
        type = typeList[index];
        if (
          (type.instanceOf || type.predicate) &&
          (!type.instanceOf ||
            (typeof object === "object" &&
              object instanceof type.instanceOf)) &&
          (!type.predicate || type.predicate(object))
        ) {
          state.tag = explicit ? type.tag : "?";
          if (type.represent) {
            style = state.styleMap[type.tag] || type.defaultStyle;
            if (_toString.call(type.represent) === "[object Function]") {
              _result = type.represent(object, style);
            } else if (_hasOwnProperty.call(type.represent, style)) {
              _result = type.represent[style](object, style);
            } else {
              throw new error_ts_3.YAMLError(
                `!<${type.tag}> tag resolver accepts not "${style}" style`,
              );
            }
            state.dump = _result;
          }
          return true;
        }
      }
      return false;
    }
    // Serializes `object` and writes it to global `result`.
    // Returns true on success, or false on invalid object.
    //
    function writeNode(state, level, object, block, compact, iskey = false) {
      state.tag = null;
      state.dump = object;
      if (!detectType(state, object, false)) {
        detectType(state, object, true);
      }
      const type = _toString.call(state.dump);
      if (block) {
        block = state.flowLevel < 0 || state.flowLevel > level;
      }
      const objectOrArray = type === "[object Object]" ||
        type === "[object Array]";
      let duplicateIndex = -1;
      let duplicate = false;
      if (objectOrArray) {
        duplicateIndex = state.duplicates.indexOf(object);
        duplicate = duplicateIndex !== -1;
      }
      if (
        (state.tag !== null && state.tag !== "?") ||
        duplicate ||
        (state.indent !== 2 && level > 0)
      ) {
        compact = false;
      }
      if (duplicate && state.usedDuplicates[duplicateIndex]) {
        state.dump = `*ref_${duplicateIndex}`;
      } else {
        if (
          objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]
        ) {
          state.usedDuplicates[duplicateIndex] = true;
        }
        if (type === "[object Object]") {
          if (block && Object.keys(state.dump).length !== 0) {
            writeBlockMapping(state, level, state.dump, compact);
            if (duplicate) {
              state.dump = `&ref_${duplicateIndex}${state.dump}`;
            }
          } else {
            writeFlowMapping(state, level, state.dump);
            if (duplicate) {
              state.dump = `&ref_${duplicateIndex} ${state.dump}`;
            }
          }
        } else if (type === "[object Array]") {
          const arrayLevel = state.noArrayIndent && level > 0 ? level - 1
          : level;
          if (block && state.dump.length !== 0) {
            writeBlockSequence(state, arrayLevel, state.dump, compact);
            if (duplicate) {
              state.dump = `&ref_${duplicateIndex}${state.dump}`;
            }
          } else {
            writeFlowSequence(state, arrayLevel, state.dump);
            if (duplicate) {
              state.dump = `&ref_${duplicateIndex} ${state.dump}`;
            }
          }
        } else if (type === "[object String]") {
          if (state.tag !== "?") {
            writeScalar(state, state.dump, level, iskey);
          }
        } else {
          if (state.skipInvalid) {
            return false;
          }
          throw new error_ts_3.YAMLError(
            `unacceptable kind of an object to dump ${type}`,
          );
        }
        if (state.tag !== null && state.tag !== "?") {
          state.dump = `!<${state.tag}> ${state.dump}`;
        }
      }
      return true;
    }
    function inspectNode(object, objects, duplicatesIndexes) {
      if (object !== null && typeof object === "object") {
        const index = objects.indexOf(object);
        if (index !== -1) {
          if (duplicatesIndexes.indexOf(index) === -1) {
            duplicatesIndexes.push(index);
          }
        } else {
          objects.push(object);
          if (Array.isArray(object)) {
            for (let idx = 0, length = object.length; idx < length; idx += 1) {
              inspectNode(object[idx], objects, duplicatesIndexes);
            }
          } else {
            const objectKeyList = Object.keys(object);
            for (
              let idx = 0, length = objectKeyList.length; idx < length; idx += 1
            ) {
              inspectNode(
                object[objectKeyList[idx]],
                objects,
                duplicatesIndexes,
              );
            }
          }
        }
      }
    }
    function getDuplicateReferences(object, state) {
      const objects = [], duplicatesIndexes = [];
      inspectNode(object, objects, duplicatesIndexes);
      const length = duplicatesIndexes.length;
      for (let index = 0; index < length; index += 1) {
        state.duplicates.push(objects[duplicatesIndexes[index]]);
      }
      state.usedDuplicates = new Array(length);
    }
    function dump(input, options) {
      options = options || {};
      const state = new dumper_state_ts_1.DumperState(options);
      if (!state.noRefs) {
        getDuplicateReferences(input, state);
      }
      if (writeNode(state, 0, input, true, true)) {
        return `${state.dump}\n`;
      }
      return "";
    }
    exports_67("dump", dump);
    return {
      setters: [
        function (error_ts_3_1) {
          error_ts_3 = error_ts_3_1;
        },
        function (common_2) {
          common = common_2;
        },
        function (dumper_state_ts_1_1) {
          dumper_state_ts_1 = dumper_state_ts_1_1;
        },
      ],
      execute: function () {
        _toString = Object.prototype.toString;
        _hasOwnProperty = Object.prototype.hasOwnProperty;
        CHAR_TAB = 0x09; /* Tab */
        CHAR_LINE_FEED = 0x0a; /* LF */
        CHAR_SPACE = 0x20; /* Space */
        CHAR_EXCLAMATION = 0x21; /* ! */
        CHAR_DOUBLE_QUOTE = 0x22; /* " */
        CHAR_SHARP = 0x23; /* # */
        CHAR_PERCENT = 0x25; /* % */
        CHAR_AMPERSAND = 0x26; /* & */
        CHAR_SINGLE_QUOTE = 0x27; /* ' */
        CHAR_ASTERISK = 0x2a; /* * */
        CHAR_COMMA = 0x2c; /* , */
        CHAR_MINUS = 0x2d; /* - */
        CHAR_COLON = 0x3a; /* : */
        CHAR_GREATER_THAN = 0x3e; /* > */
        CHAR_QUESTION = 0x3f; /* ? */
        CHAR_COMMERCIAL_AT = 0x40; /* @ */
        CHAR_LEFT_SQUARE_BRACKET = 0x5b; /* [ */
        CHAR_RIGHT_SQUARE_BRACKET = 0x5d; /* ] */
        CHAR_GRAVE_ACCENT = 0x60; /* ` */
        CHAR_LEFT_CURLY_BRACKET = 0x7b; /* { */
        CHAR_VERTICAL_LINE = 0x7c; /* | */
        CHAR_RIGHT_CURLY_BRACKET = 0x7d; /* } */
        ESCAPE_SEQUENCES = {};
        ESCAPE_SEQUENCES[0x00] = "\\0";
        ESCAPE_SEQUENCES[0x07] = "\\a";
        ESCAPE_SEQUENCES[0x08] = "\\b";
        ESCAPE_SEQUENCES[0x09] = "\\t";
        ESCAPE_SEQUENCES[0x0a] = "\\n";
        ESCAPE_SEQUENCES[0x0b] = "\\v";
        ESCAPE_SEQUENCES[0x0c] = "\\f";
        ESCAPE_SEQUENCES[0x0d] = "\\r";
        ESCAPE_SEQUENCES[0x1b] = "\\e";
        ESCAPE_SEQUENCES[0x22] = '\\"';
        ESCAPE_SEQUENCES[0x5c] = "\\\\";
        ESCAPE_SEQUENCES[0x85] = "\\N";
        ESCAPE_SEQUENCES[0xa0] = "\\_";
        ESCAPE_SEQUENCES[0x2028] = "\\L";
        ESCAPE_SEQUENCES[0x2029] = "\\P";
        DEPRECATED_BOOLEANS_SYNTAX = [
          "y",
          "Y",
          "yes",
          "Yes",
          "YES",
          "on",
          "On",
          "ON",
          "n",
          "N",
          "no",
          "No",
          "NO",
          "off",
          "Off",
          "OFF",
        ];
        STYLE_PLAIN = 1,
          STYLE_SINGLE = 2,
          STYLE_LITERAL = 3,
          STYLE_FOLDED = 4,
          STYLE_DOUBLE = 5;
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/_yaml/stringify",
  ["https://deno.land/std@0.52.0/encoding/_yaml/dumper/dumper"],
  function (exports_68, context_68) {
    "use strict";
    var dumper_ts_1;
    var __moduleName = context_68 && context_68.id;
    /**
     * Serializes `object` as a YAML document.
     *
     * You can disable exceptions by setting the skipInvalid option to true.
     */
    function stringify(obj, options) {
      return dumper_ts_1.dump(obj, options);
    }
    exports_68("stringify", stringify);
    return {
      setters: [
        function (dumper_ts_1_1) {
          dumper_ts_1 = dumper_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/encoding/yaml",
  [
    "https://deno.land/std@0.52.0/encoding/_yaml/parse",
    "https://deno.land/std@0.52.0/encoding/_yaml/stringify",
    "https://deno.land/std@0.52.0/encoding/_yaml/schema/mod",
  ],
  function (exports_69, context_69) {
    "use strict";
    var __moduleName = context_69 && context_69.id;
    return {
      setters: [
        function (parse_ts_1_1) {
          exports_69({
            "parse": parse_ts_1_1["parse"],
            "parseAll": parse_ts_1_1["parseAll"],
          });
        },
        function (stringify_ts_1_1) {
          exports_69({
            "stringify": stringify_ts_1_1["stringify"],
          });
        },
        function (mod_ts_9_1) {
          exports_69({
            "CORE_SCHEMA": mod_ts_9_1["CORE_SCHEMA"],
            "DEFAULT_SCHEMA": mod_ts_9_1["DEFAULT_SCHEMA"],
            "FAILSAFE_SCHEMA": mod_ts_9_1["FAILSAFE_SCHEMA"],
            "JSON_SCHEMA": mod_ts_9_1["JSON_SCHEMA"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/async/deferred",
  [],
  function (exports_70, context_70) {
    "use strict";
    var __moduleName = context_70 && context_70.id;
    /** Creates a Promise with the `reject` and `resolve` functions
     * placed as methods on the promise object itself. It allows you to do:
     *
     *     const p = deferred<number>();
     *     // ...
     *     p.resolve(42);
     */
    function deferred() {
      let methods;
      const promise = new Promise((resolve, reject) => {
        methods = { resolve, reject };
      });
      return Object.assign(promise, methods);
    }
    exports_70("deferred", deferred);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/async/delay",
  [],
  function (exports_71, context_71) {
    "use strict";
    var __moduleName = context_71 && context_71.id;
    // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
    /* Resolves after the given number of milliseconds. */
    function delay(ms) {
      return new Promise((res) =>
        setTimeout(() => {
          res();
        }, ms)
      );
    }
    exports_71("delay", delay);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/async/mux_async_iterator",
  ["https://deno.land/std@0.52.0/async/deferred"],
  function (exports_72, context_72) {
    "use strict";
    var deferred_ts_1, MuxAsyncIterator;
    var __moduleName = context_72 && context_72.id;
    return {
      setters: [
        function (deferred_ts_1_1) {
          deferred_ts_1 = deferred_ts_1_1;
        },
      ],
      execute: function () {
        /** The MuxAsyncIterator class multiplexes multiple async iterators into a
             * single stream. It currently makes a few assumptions:
             * - The iterators do not throw.
             * - The final result (the value returned and not yielded from the iterator)
             *   does not matter; if there is any, it is discarded.
             */
        MuxAsyncIterator = class MuxAsyncIterator {
          constructor() {
            this.iteratorCount = 0;
            this.yields = [];
            this.signal = deferred_ts_1.deferred();
          }
          add(iterator) {
            ++this.iteratorCount;
            this.callIteratorNext(iterator);
          }
          async callIteratorNext(iterator) {
            const { value, done } = await iterator.next();
            if (done) {
              --this.iteratorCount;
            } else {
              this.yields.push({ iterator, value });
            }
            this.signal.resolve();
          }
          async *iterate() {
            while (this.iteratorCount > 0) {
              // Sleep until any of the wrapped iterators yields.
              await this.signal;
              // Note that while we're looping over `yields`, new items may be added.
              for (let i = 0; i < this.yields.length; i++) {
                const { iterator, value } = this.yields[i];
                yield value;
                this.callIteratorNext(iterator);
              }
              // Clear the `yields` list and reset the `signal` promise.
              this.yields.length = 0;
              this.signal = deferred_ts_1.deferred();
            }
          }
          [Symbol.asyncIterator]() {
            return this.iterate();
          }
        };
        exports_72("MuxAsyncIterator", MuxAsyncIterator);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.52.0/async/mod",
  [
    "https://deno.land/std@0.52.0/async/deferred",
    "https://deno.land/std@0.52.0/async/delay",
    "https://deno.land/std@0.52.0/async/mux_async_iterator",
  ],
  function (exports_73, context_73) {
    "use strict";
    var __moduleName = context_73 && context_73.id;
    function exportStar_4(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_73(exports);
    }
    return {
      setters: [
        function (deferred_ts_2_1) {
          exportStar_4(deferred_ts_2_1);
        },
        function (delay_ts_1_1) {
          exportStar_4(delay_ts_1_1);
        },
        function (mux_async_iterator_ts_1_1) {
          exportStar_4(mux_async_iterator_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.52.0/permissions/mod",
  [],
  function (exports_74, context_74) {
    "use strict";
    var PermissionDenied;
    var __moduleName = context_74 && context_74.id;
    function getPermissionString(descriptors) {
      return descriptors.length
        ? `  ${
          descriptors
            .map((pd) => {
              switch (pd.name) {
                case "read":
                case "write":
                  return pd.path
                    ? `--allow-${pd.name}=${pd.path}`
                    : `--allow-${pd.name}`;
                case "net":
                  return pd.url
                    ? `--allow-${pd.name}=${pd.url}`
                    : `--allow-${pd.name}`;
                default:
                  return `--allow-${pd.name}`;
              }
            })
            .join("\n  ")
        }`
        : "";
    }
    async function grant(descriptor, ...descriptors) {
      const result = [];
      descriptors = Array.isArray(descriptor) ? descriptor
      : [descriptor, ...descriptors];
      for (const descriptor of descriptors) {
        let state = (await Deno.permissions.query(descriptor)).state;
        if (state === "prompt") {
          state = (await Deno.permissions.request(descriptor)).state;
        }
        if (state === "granted") {
          result.push(descriptor);
        }
      }
      return result.length ? result : undefined;
    }
    exports_74("grant", grant);
    async function grantOrThrow(descriptor, ...descriptors) {
      const denied = [];
      descriptors = Array.isArray(descriptor)
        ? descriptor
        : [descriptor, ...descriptors];
      for (const descriptor of descriptors) {
        const { state } = await Deno.permissions.request(descriptor);
        if (state !== "granted") {
          denied.push(descriptor);
        }
      }
      if (denied.length) {
        throw new PermissionDenied(
          `The following permissions have not been granted:\n${
            getPermissionString(denied)
          }`,
        );
      }
    }
    exports_74("grantOrThrow", grantOrThrow);
    return {
      setters: [],
      execute: function () {
        PermissionDenied = Deno.errors.PermissionDenied;
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/deps",
  [
    "https://deno.land/std@0.52.0/log/mod",
    "https://deno.land/std@0.52.0/log/logger",
    "https://deno.land/std@0.52.0/fmt/mod",
    "https://deno.land/std@0.52.0/flags/mod",
    "https://deno.land/std@0.52.0/fs/mod",
    "https://deno.land/std@0.52.0/encoding/yaml",
    "https://deno.land/std@0.52.0/path/mod",
    "https://deno.land/std@0.52.0/fs/read_json",
    "https://deno.land/std@0.52.0/fs/write_json",
    "https://deno.land/std@0.52.0/async/mod",
    "https://deno.land/std@0.52.0/permissions/mod",
  ],
  function (exports_75, context_75) {
    "use strict";
    var __moduleName = context_75 && context_75.id;
    return {
      setters: [
        function (log_1) {
          exports_75("log", log_1);
        },
        function (logger_ts_2_1) {
          exports_75({
            "LogRecord": logger_ts_2_1["LogRecord"],
          });
        },
        function (mod_ts_10_1) {
          exports_75({
            "setColorEnabled": mod_ts_10_1["setColorEnabled"],
            "reset": mod_ts_10_1["reset"],
            "blue": mod_ts_10_1["blue"],
            "yellow": mod_ts_10_1["yellow"],
            "gray": mod_ts_10_1["gray"],
            "bold": mod_ts_10_1["bold"],
          });
        },
        function (mod_ts_11_1) {
          exports_75({
            "parseFlags": mod_ts_11_1["parse"],
          });
        },
        function (mod_ts_12_1) {
          exports_75({
            "exists": mod_ts_12_1["exists"],
            "existsSync": mod_ts_12_1["existsSync"],
            "readFileStr": mod_ts_12_1["readFileStr"],
            "walk": mod_ts_12_1["walk"],
          });
        },
        function (yaml_ts_1_1) {
          exports_75({
            "JSON_SCHEMA": yaml_ts_1_1["JSON_SCHEMA"],
            "parseYaml": yaml_ts_1_1["parse"],
          });
        },
        function (mod_ts_13_1) {
          exports_75({
            "relative": mod_ts_13_1["relative"],
            "dirname": mod_ts_13_1["dirname"],
            "extname": mod_ts_13_1["extname"],
            "globToRegExp": mod_ts_13_1["globToRegExp"],
          });
        },
        function (read_json_ts_2_1) {
          exports_75({
            "readJson": read_json_ts_2_1["readJson"],
          });
        },
        function (write_json_ts_2_1) {
          exports_75({
            "writeJson": write_json_ts_2_1["writeJson"],
          });
        },
        function (mod_ts_14_1) {
          exports_75({
            "deferred": mod_ts_14_1["deferred"],
            "delay": mod_ts_14_1["delay"],
          });
        },
        function (mod_ts_15_1) {
          exports_75({
            "grant": mod_ts_15_1["grant"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/src/watcher",
  ["file:///home/main/Desktop/yolk/denon/deps"],
  function (exports_76, context_76) {
    "use strict";
    var deps_ts_1, Watcher;
    var __moduleName = context_76 && context_76.id;
    return {
      setters: [
        function (deps_ts_1_1) {
          deps_ts_1 = deps_ts_1_1;
        },
      ],
      execute: function () {
        /**
             * Watches for file changes in `paths` path
             * yielding an array of all of the changes
             * each time one or more changes are detected.
             * It is debounced by `interval`, `recursive`, `exts`,
             * `match` and `skip` are filtering the files which
             * will yield a change
             */
        Watcher = class Watcher {
          constructor(config) {
            this.#signal = deps_ts_1.deferred();
            this.#changes = {};
            this.#exts = undefined;
            this.#match = undefined;
            this.#skip = undefined;
            this.#watch = this.denoWatch;
            this.#config = config;
            this.reload();
          }
          #signal;
          #changes;
          #exts;
          #match;
          #skip;
          #watch;
          #config;
          reload() {
            this.#watch = this.#config.legacy
              ? this.legacyWatch
              : this.denoWatch;
            if (this.#config.exts) {
              this.#exts = this.#config.exts.map((_) =>
                _.startsWith(".") ? _ : `.${_}`
              );
            }
            if (this.#config.match) {
              this.#match = this.#config.match.map((_) =>
                deps_ts_1.globToRegExp(_, { extended: true, globstar: false })
              );
            }
            if (this.#config.skip) {
              this.#skip = this.#config.skip.map((_) =>
                deps_ts_1.globToRegExp(_, { extended: true, globstar: false })
              );
            }
          }
          isWatched(path) {
            path = this.verifyPath(path);
            deps_ts_1.log.debug(`evaluating path ${path}`);
            if (
              deps_ts_1.extname(path) && this.#exts?.length &&
              this.#exts?.every((ext) => !path.endsWith(ext))
            ) {
              deps_ts_1.log.debug(`path ${path} does not have right extension`);
              return false;
            } else if (
              this.#skip?.length && this.#skip?.some((skip) => path.match(skip))
            ) {
              deps_ts_1.log.debug(`path ${path} is skipped`);
              return false;
            } else if (
              this.#match?.length &&
              this.#match?.every((match) => !path.match(match))
            ) {
              deps_ts_1.log.debug(`path ${path} is not matched`);
              return false;
            }
            deps_ts_1.log.debug(`path ${path} is matched`);
            return true;
          }
          reset() {
            this.#changes = {};
            this.#signal = deps_ts_1.deferred();
          }
          verifyPath(path) {
            for (const directory of this.#config.paths) {
              const rel = deps_ts_1.relative(directory, path);
              if (rel && !rel.startsWith("..")) {
                path = deps_ts_1.relative(directory, path);
              }
            }
            return path;
          }
          async *iterate() {
            this.#watch();
            while (true) {
              await this.#signal;
              yield Object.entries(this.#changes).map(([path, type]) => ({
                path,
                type,
              }));
              this.reset();
            }
          }
          [Symbol.asyncIterator]() {
            return this.iterate();
          }
          async denoWatch() {
            let timer = 0;
            const debounce = () => {
              clearTimeout(timer);
              timer = setTimeout(this.#signal.resolve, this.#config.interval);
            };
            const run = async () => {
              for await (const event of Deno.watchFs(this.#config.paths)) {
                const { kind, paths } = event;
                for (const path of paths) {
                  if (this.isWatched(path)) {
                    this.#changes[path] = kind;
                    debounce();
                  }
                }
              }
            };
            run();
            while (true) {
              debounce();
              await deps_ts_1.delay(this.#config.interval);
            }
          }
          async legacyWatch() {
            let timer = 0;
            const debounce = () => {
              clearTimeout(timer);
              timer = setTimeout(this.#signal.resolve, this.#config.interval);
            };
            const walkPaths = async () => {
              const tree = {};
              for (let i in this.#config.paths) {
                const action = deps_ts_1.walk(this.#config.paths[i], {
                  maxDepth: Infinity,
                  includeDirs: false,
                  followSymlinks: false,
                  exts: this.#exts,
                  match: this.#match,
                  skip: this.#skip,
                });
                for await (const { path } of action) {
                  if (this.isWatched(path)) {
                    const stat = await Deno.stat(path);
                    tree[path] = stat.mtime;
                  }
                }
              }
              return tree;
            };
            let previous = await walkPaths();
            while (true) {
              const current = await walkPaths();
              for (const path in previous) {
                const pre = previous[path];
                const post = current[path];
                if (pre && !post) {
                  this.#changes[path] = "remove";
                } else if (
                  pre &&
                  post &&
                  pre.getTime() !== post.getTime()
                ) {
                  this.#changes[path] = "modify";
                }
              }
              for (const path in current) {
                if (!previous[path] && current[path]) {
                  this.#changes[path] = "create";
                }
              }
              previous = current;
              debounce();
              await deps_ts_1.delay(this.#config.interval);
            }
          }
        };
        exports_76("Watcher", Watcher);
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/src/scripts",
  [],
  function (exports_77, context_77) {
    "use strict";
    var __moduleName = context_77 && context_77.id;
    /**
     * Build deno flags from ScriptOptions.
     * `{ allow: [ run, env ]}` -> `[--allow-run, --allow-env]`
     */
    function buildFlags(options) {
      let flags = [];
      if (options.allow) {
        if (Array.isArray(options.allow)) {
          options.allow.forEach((flag) => flags.push(`--allow-${flag}`));
        } else if (typeof options.allow == "object") {
          Object.entries(options.allow).map(([flag, value]) => {
            if (!value || (typeof value == "boolean" && value)) {
              flags.push(`--allow-${flag}`);
            } else {
              flags.push(`--allow-${flag}=${value}`);
            }
          });
        }
      }
      if (options.importmap) {
        flags.push("--importmap");
        flags.push(options.importmap);
      }
      if (options.lock) {
        flags.push("--lock");
        flags.push(options.lock);
      }
      if (options.log) {
        flags.push("--log-level");
        flags.push(options.log);
      }
      if (options.tsconfig) {
        flags.push("--config");
        flags.push(options.tsconfig);
      }
      if (options.cert) {
        flags.push("--cert");
        flags.push(options.cert);
      }
      if (options.inspect) {
        flags.push(`--inspect=${options.inspect}`);
      }
      if (options.inspectBrk) {
        flags.push(`--inspect-brk=${options.inspectBrk}`);
      }
      if (options.unstable) {
        flags.push("--unstable");
      }
      return flags;
    }
    exports_77("buildFlags", buildFlags);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/src/merge",
  [],
  function (exports_78, context_78) {
    "use strict";
    var __moduleName = context_78 && context_78.id;
    /**
     * Performs a deep merge of `source` into `target`.
     * Mutates `target` only but not its objects and arrays.
     */
    function merge(target, source) {
      const t = target;
      const isObject = (obj) => obj && typeof obj === "object";
      if (!isObject(target) || !isObject(source)) {
        return source;
      }
      for (const key of Object.keys(source)) {
        const targetValue = target[key];
        const sourceValue = source[key];
        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          t[key] = sourceValue;
        } else if (isObject(targetValue) && isObject(sourceValue)) {
          t[key] = merge(Object.assign({}, targetValue), sourceValue);
        } else {
          t[key] = sourceValue;
        }
      }
      return t;
    }
    exports_78("merge", merge);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/src/runner",
  [
    "file:///home/main/Desktop/yolk/denon/deps",
    "file:///home/main/Desktop/yolk/denon/src/scripts",
    "file:///home/main/Desktop/yolk/denon/src/merge",
  ],
  function (exports_79, context_79) {
    "use strict";
    var deps_ts_2,
      scripts_ts_1,
      merge_ts_2,
      reDenoAction,
      reCompact,
      reCliCompact,
      Runner;
    var __moduleName = context_79 && context_79.id;
    function stdCmd(cmd) {
      return cmd.trim().replace(/\s\s+/g, " ").split(" ");
    }
    return {
      setters: [
        function (deps_ts_2_1) {
          deps_ts_2 = deps_ts_2_1;
        },
        function (scripts_ts_1_1) {
          scripts_ts_1 = scripts_ts_1_1;
        },
        function (merge_ts_2_1) {
          merge_ts_2 = merge_ts_2_1;
        },
      ],
      execute: function () {
        reDenoAction = new RegExp(/^(deno +\w+) +(.*)$/);
        reCompact = new RegExp(
          /^'(?:\\'|.)*?\.(ts|js)'|^"(?:\\"|.)*?\.(ts|js)"|^(?:\\\ |\S)+\.(ts|js)$/,
        );
        reCliCompact = new RegExp(/^(run|test|fmt) *(.*)$/);
        /**
             * Handle all the things related to process management.
             * Scripts are built into executable commands that are
             * executed by `Deno.run()` and managed in an `Executable`
             * object to make available process events.
             */
        Runner = class Runner {
          constructor(config) {
            this.#config = config;
            this.cmdline = config.args.cmdline;
          }
          #config;
          /**
                 * Build the script, in whatever form it is declared in,
                 * to be compatible with `Deno.run()`.
                 * This function add flags, arguments and actions.
                 */
          build(script) {
            // global options
            const g = Object.assign({}, this.#config);
            delete g.scripts;
            const s = this.#config.scripts[script];
            if (!s) {
              const cmd = this.cmdline;
              let out = [];
              if (reCompact.test(cmd)) {
                out = ["deno", "run"];
                out = out.concat(stdCmd(cmd));
              } else if (reCliCompact.test(cmd)) {
                out = ["deno"];
                out = out.concat(stdCmd(cmd));
              } else {
                out = stdCmd(cmd);
              }
              return {
                cmd: out,
                options: g,
              };
            }
            let o;
            let cmd;
            if (typeof s == "string") {
              o = g;
              cmd = s;
            } else {
              o = Object.assign({}, merge_ts_2.merge(g, s));
              cmd = s.cmd;
            }
            let out = [];
            let denoAction = reDenoAction.exec(cmd);
            if (denoAction && denoAction.length == 3) {
              const action = denoAction[1];
              const args = denoAction[2];
              out = out.concat(stdCmd(action));
              out = out.concat(scripts_ts_1.buildFlags(o));
              out = out.concat(stdCmd(args));
            } else if (reCompact.test(cmd)) {
              out = ["deno", "run"];
              out = out.concat(scripts_ts_1.buildFlags(o));
              out = out.concat(stdCmd(cmd));
            } else {
              out = stdCmd(cmd);
            }
            return {
              cmd: out,
              options: o,
            };
          }
          /**
                 * Create an `Execution` object to handle the lifetime
                 * of the process that is executed.
                 */
          execute(script) {
            const command = this.build(script);
            deps_ts_2.log.info(`starting \`${command.cmd.join(" ")}\``);
            const options = {
              cmd: command.cmd,
              env: command.options.env ?? {},
              stdin: command.options.stdin ?? "inherit",
              stdout: command.options.stdout ?? "inherit",
              stderr: command.options.stderr ?? "inherit",
            };
            return Deno.run(options);
          }
        };
        exports_79("Runner", Runner);
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/src/log",
  ["file:///home/main/Desktop/yolk/denon/deps"],
  function (exports_80, context_80) {
    "use strict";
    var deps_ts_3,
      TAG,
      DEBUG_LEVEL,
      QUIET_LEVEL,
      DEFAULT_LEVEL,
      DEFAULT_HANDLER;
    var __moduleName = context_80 && context_80.id;
    /**
     * Deno logger, but slightly better.
     */
    function formatter(record) {
      let msg = `${TAG} ${deps_ts_3.reset(record.msg)}`;
      for (const arg of record.args) {
        if (arg instanceof Object) {
          msg += ` ${JSON.stringify(arg)}`;
        } else {
          msg += ` ${String(arg)}`;
        }
      }
      return msg;
    }
    /**
     * Determines the log level based on configuration
     * preferences.
     */
    function logLevel(config) {
      let level = DEFAULT_LEVEL;
      if (config.logger.debug) {
        level = DEBUG_LEVEL;
      }
      if (config.logger.quiet) {
        level = QUIET_LEVEL;
      }
      return level;
    }
    /**
     * Modify default deno logger with configurable
     * log level.
     */
    async function setupLog(config) {
      const level = config ? logLevel(config) : DEBUG_LEVEL;
      await deps_ts_3.log.setup({
        handlers: {
          [DEFAULT_HANDLER]: new deps_ts_3.log.handlers.ConsoleHandler(
            DEBUG_LEVEL,
            {
              formatter,
            },
          ),
        },
        loggers: {
          default: {
            level,
            handlers: [DEFAULT_HANDLER],
          },
        },
      });
    }
    exports_80("setupLog", setupLog);
    return {
      setters: [
        function (deps_ts_3_1) {
          deps_ts_3 = deps_ts_3_1;
        },
      ],
      execute: function () {
        /**
             * Logger tag
             */
        TAG = "[denon]";
        DEBUG_LEVEL = "DEBUG";
        QUIET_LEVEL = "ERROR";
        DEFAULT_LEVEL = "INFO";
        DEFAULT_HANDLER = "format_fn";
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/src/args",
  ["file:///home/main/Desktop/yolk/denon/deps"],
  function (exports_81, context_81) {
    "use strict";
    var deps_ts_4;
    var __moduleName = context_81 && context_81.id;
    /**
     * Parse Deno.args into a flag map (`Args`)
     * to be handled by th CLI.
     */
    function parseArgs(args = Deno.args) {
      if (args[0] === "--") {
        args = args.slice(1);
      }
      const flags = deps_ts_4.parseFlags(args, {
        string: [
          "config",
        ],
        boolean: [
          "help",
          "version",
          "init",
          "upgrade",
        ],
        alias: {
          help: "h",
          version: "v",
          init: "i",
          config: "c",
        },
      });
      return {
        help: flags.help ?? false,
        version: flags.version ?? false,
        init: flags.init ?? false,
        upgrade: flags.upgrade ?? false,
        config: flags.config,
        cmd: flags._.map((_) => _.toString()),
      };
    }
    exports_81("parseArgs", parseArgs);
    return {
      setters: [
        function (deps_ts_4_1) {
          deps_ts_4 = deps_ts_4_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/src/config",
  [
    "file:///home/main/Desktop/yolk/denon/deps",
    "file:///home/main/Desktop/yolk/denon/src/merge",
  ],
  function (exports_82, context_82) {
    "use strict";
    var deps_ts_5, merge_ts_3, configs, DEFAULT_DENON_CONFIG;
    var __moduleName = context_82 && context_82.id;
    async function readYaml(file) {
      const source = await deps_ts_5.readFileStr(file);
      const parsed = deps_ts_5.parseYaml(source, {
        schema: deps_ts_5.JSON_SCHEMA,
        json: true,
      });
      return parsed;
    }
    exports_82("readYaml", readYaml);
    function cleanConfig(config) {
      if (config.watcher?.exts) {
        config.watcher.exts = config.watcher.exts.map((_) =>
          _.startsWith(".") ? _.substr(0) : _
        );
      }
      return config;
    }
    exports_82("cleanConfig", cleanConfig);
    /**
     * Returns, if exists, the config filename
     */
    function getConfigFilename() {
      return configs.find((filename) => {
        return deps_ts_5.existsSync(filename);
      });
    }
    exports_82("getConfigFilename", getConfigFilename);
    /**
     * Reads the denon config from a file
     */
    async function readConfig(file = getConfigFilename()) {
      let config = DEFAULT_DENON_CONFIG;
      config.watcher.paths.push(Deno.cwd());
      if (file) {
        try {
          const extension = deps_ts_5.extname(file);
          if (/^\.ya?ml$/.test(extension)) {
            const parsed = await readYaml(file);
            config = merge_ts_3.merge(config, cleanConfig(parsed));
          } else if (/^\.json$/.test(extension)) {
            const parsed = await deps_ts_5.readJson(file);
            config = merge_ts_3.merge(config, cleanConfig(parsed));
          } else {
            try {
              const parsed = await deps_ts_5.readJson(file);
              config = merge_ts_3.merge(config, cleanConfig(parsed));
            } catch {
              const parsed = await readYaml(file);
              config = merge_ts_3.merge(config, cleanConfig(parsed));
            }
          }
        } catch {
          deps_ts_5.log.warning(`unsupported configuration \`${file}\``);
        }
      }
      return config;
    }
    exports_82("readConfig", readConfig);
    /**
     * Reads the denon config from a file
     */
    async function writeConfig(file) {
      let config = {
        "$schema": "https://deno.land/x/denon/schema.json",
        scripts: {
          "start": "app.ts",
        },
      };
      await deps_ts_5.writeJson(file, config, { spaces: 2 });
    }
    exports_82("writeConfig", writeConfig);
    return {
      setters: [
        function (deps_ts_5_1) {
          deps_ts_5 = deps_ts_5_1;
        },
        function (merge_ts_3_1) {
          merge_ts_3 = merge_ts_3_1;
        },
      ],
      execute: function () {
        /**
             * Possible default configuration files.
             */
        configs = [
          "denon",
          "denon.yaml",
          "denon.yml",
          "denon.json",
          ".denon",
          ".denon.yaml",
          ".denon.yml",
          ".denon.json",
          ".denonrc",
          ".denonrc.yaml",
          ".denonrc.yml",
          ".denonrc.json",
        ];
        /** The default denon configuration */
        exports_82(
          "DEFAULT_DENON_CONFIG",
          DEFAULT_DENON_CONFIG = {
            scripts: {},
            watcher: {
              interval: 350,
              paths: [],
              exts: ["ts", "js", "json"],
              match: ["*.*"],
              skip: ["**/.git/**"],
            },
            logger: {},
          },
        );
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/src/daemon",
  ["file:///home/main/Desktop/yolk/denon/deps"],
  function (exports_83, context_83) {
    "use strict";
    var deps_ts_6, Daemon;
    var __moduleName = context_83 && context_83.id;
    return {
      setters: [
        function (deps_ts_6_1) {
          deps_ts_6 = deps_ts_6_1;
        },
      ],
      execute: function () {
        /**
             * Daemon instance.
             * Returned by Denon instance when
             * `start(script)` is called. It can be used in a for
             * loop to listen to DenonEvents.
             */
        Daemon = class Daemon {
          constructor(denon, script) {
            this.#processes = {};
            this.#denon = denon;
            this.#script = script;
            this.#config = denon.config; // just as a shortcut
          }
          #denon;
          #script;
          #config;
          #processes;
          /**
                 * Restart current process.
                 */
          async reload() {
            if (this.#config.logger.fullscreen) {
              deps_ts_6.log.debug("clearing screen");
              console.clear();
            }
            deps_ts_6.log.info(
              `watching path(s): ${this.#config.watcher.match.join(" ")}`,
            );
            deps_ts_6.log.info(
              `watching extensions: ${this.#config.watcher.exts.join(",")}`,
            );
            deps_ts_6.log.info("restarting due to changes...");
            // kill all processes spawned
            let pcopy = Object.assign({}, this.#processes);
            this.#processes = {};
            for (let id in pcopy) {
              const p = pcopy[id];
              if (Deno.build.os === "windows") {
                deps_ts_6.log.debug(
                  `closing (windows) process with pid ${p.pid}`,
                );
                p.close();
              } else {
                deps_ts_6.log.debug(`killing (unix) process with pid ${p.pid}`);
                Deno.kill(p.pid, Deno.Signal.SIGKILL);
              }
            }
            await this.start();
          }
          async start() {
            const process = this.#denon.runner.execute(this.#script);
            deps_ts_6.log.debug(`starting process with pid ${process.pid}`);
            this.#processes[process.pid] = (process);
            this.monitor(process);
          }
          async monitor(process) {
            const pid = process.pid;
            let s;
            try {
              s = await process.status();
            } catch (error) {
              deps_ts_6.log.debug(error);
            }
            let p = this.#processes[pid];
            if (p) {
              // process exited on its own, so we should wait a reload
              // remove it from processes array as it is already dead
              delete this.#processes[pid];
              if (s) {
                // log status status
                if (s.success) {
                  deps_ts_6.log.info(
                    "clean exit - waiting for changes before restart",
                  );
                } else {
                  deps_ts_6.log.info(
                    "app crashed - waiting for file changes before starting ...",
                  );
                }
              }
            }
          }
          async *iterate() {
            yield {
              type: "start",
            };
            this.start();
            for await (const watchE of this.#denon.watcher) {
              if (
                watchE.some((_) => _.type === "modify" || _.type === "access")
              ) {
                deps_ts_6.log.debug(
                  `reload event detected, starting the reload procedure...`,
                );
                yield {
                  type: "reload",
                  change: watchE,
                };
                await this.reload();
              }
            }
            yield {
              type: "exit",
            };
          }
          [Symbol.asyncIterator]() {
            return this.iterate();
          }
        };
        exports_83("Daemon", Daemon);
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/src/cli",
  [
    "file:///home/main/Desktop/yolk/denon/deps",
    "file:///home/main/Desktop/yolk/denon/src/config",
    "file:///home/main/Desktop/yolk/denon/src/runner",
  ],
  function (exports_84, context_84) {
    "use strict";
    var deps_ts_7, config_ts_1, runner_ts_1, PERMISSIONS, PERMISSION_OPTIONAL;
    var __moduleName = context_84 && context_84.id;
    async function grantPermissions() {
      // @see PERMISSIONS .
      let permissions = await deps_ts_7.grant([...PERMISSIONS]);
      if (!permissions || permissions.length < 2) {
        deps_ts_7.log.critical(
          "Required permissions `read` and `run` not granted",
        );
        Deno.exit(1);
      }
    }
    exports_84("grantPermissions", grantPermissions);
    /**
     * Create configuration file in the root of current work directory.
     * // TODO: make it interactive
     */
    async function initializeConfig() {
      let permissions = await deps_ts_7.grant(PERMISSION_OPTIONAL.write);
      if (!permissions || permissions.length < 1) {
        deps_ts_7.log.critical("Required permissions `write` not granted");
        Deno.exit(1);
      }
      const file = "denon.json";
      if (!await deps_ts_7.exists(file)) {
        deps_ts_7.log.info("creating json configuration...");
        try {
          await config_ts_1.writeConfig(file);
        } catch (_) {
          deps_ts_7.log.error("`denon.json` cannot be saved in root dir");
        }
        deps_ts_7.log.info("`denon.json` created correctly in root dir");
      } else {
        deps_ts_7.log.error("`denon.json` already exists in root dir");
      }
    }
    exports_84("initializeConfig", initializeConfig);
    /**
     * Grab a fresh copy of denon
     */
    async function upgrade() {
      deps_ts_7.log.info(
        "Running \`deno install -Af --unstable https://deno.land/x/denon/denon.ts\`",
      );
      await Deno.run({
        cmd: [
          "deno",
          "install",
          "-Af",
          "--unstable",
          "https://deno.land/x/denon/denon.ts",
        ],
      }).status();
      Deno.exit(0);
    }
    exports_84("upgrade", upgrade);
    /**
     * List all available scripts declared in the config file.
     * // TODO: make it interactive
     */
    function printAvailableScripts(config) {
      if (Object.keys(config.scripts).length) {
        deps_ts_7.log.info("available scripts:");
        const runner = new runner_ts_1.Runner(config);
        for (const name of Object.keys(config.scripts)) {
          const script = config.scripts[name];
          console.log();
          console.log(` - ${deps_ts_7.yellow(deps_ts_7.bold(name))}`);
          if (typeof script === "object" && script.desc) {
            console.log(`   ${script.desc}`);
          }
          console.log(
            deps_ts_7.gray(`   $ ${runner.build(name).cmd.join(" ")}`),
          );
        }
        console.log();
        console.log(
          `You can run scripts with \`${deps_ts_7.blue("denon")} ${
            deps_ts_7.yellow("<script>")
          }\``,
        );
      } else {
        deps_ts_7.log.error("It looks like you don't have any scripts...");
        const config = config_ts_1.getConfigFilename();
        if (config) {
          deps_ts_7.log.info(
            `You can add scripts to your \`${config}\` file. Check the docs.`,
          );
        } else {
          deps_ts_7.log.info(
            `You can create a config to add scripts to with \`${
              deps_ts_7.blue("denon")
            } ${deps_ts_7.yellow("--init")}${deps_ts_7.reset("\`.")}`,
          );
        }
      }
    }
    exports_84("printAvailableScripts", printAvailableScripts);
    /**
     * Help message to be shown if `denon`
     * is run with `--help` flag.
     */
    function printHelp(version) {
      deps_ts_7.setColorEnabled(true);
      console.log(`${deps_ts_7.blue("DENON")} - ${version}
Monitor any changes in your Deno application and automatically restart.

Usage:
    ${deps_ts_7.blue("denon")} ${deps_ts_7.yellow("<script name>")}     ${
        deps_ts_7.gray("-- eg: denon start")
      }
    ${deps_ts_7.blue("denon")} ${deps_ts_7.yellow("<command>")}         ${
        deps_ts_7.gray("-- eg: denon run helloworld.ts")
      }
    ${deps_ts_7.blue("denon")} [options]         ${
        deps_ts_7.gray("-- eg: denon --help")
      }

Options:
    -h --help            Show this screen.
    -v --version         Show version.
    -i --init            Create config file in current working dir.
    -u --upgrade         Upgrade to latest version.
    -c --config <file>   Use specific file as configuration.
`);
    }
    exports_84("printHelp", printHelp);
    return {
      setters: [
        function (deps_ts_7_1) {
          deps_ts_7 = deps_ts_7_1;
        },
        function (config_ts_1_1) {
          config_ts_1 = config_ts_1_1;
        },
        function (runner_ts_1_1) {
          runner_ts_1 = runner_ts_1_1;
        },
      ],
      execute: function () {
        /**
             * These are the permissions required for a clean run
             * of `denon`. If not provided through installation they
             * will be asked on every run by the `grant()` std function.
             *
             * The permissions required are:
             * - *read*, used to correctly load a configuration file and
             * to monitor for filesystem changes in the directory `denon`
             * is executed to reload scripts.
             * - *run*, used to run scripts as child processes.
             */
        PERMISSIONS = [
          { name: "read" },
          { name: "run" },
        ];
        /**
             * These permissions are required on specific situations,
             * `denon` should not be installed with this permissions
             * but you should be granting them when they are required.
             */
        PERMISSION_OPTIONAL = {
          write: [{ name: "write" }],
        };
      },
    };
  },
);
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.
System.register(
  "file:///home/main/Desktop/yolk/denon/denon",
  [
    "file:///home/main/Desktop/yolk/denon/deps",
    "file:///home/main/Desktop/yolk/denon/src/watcher",
    "file:///home/main/Desktop/yolk/denon/src/runner",
    "file:///home/main/Desktop/yolk/denon/src/daemon",
    "file:///home/main/Desktop/yolk/denon/src/cli",
    "file:///home/main/Desktop/yolk/denon/src/config",
    "file:///home/main/Desktop/yolk/denon/src/args",
    "file:///home/main/Desktop/yolk/denon/src/log",
  ],
  function (exports_85, context_85) {
    "use strict";
    var deps_ts_8,
      watcher_ts_1,
      runner_ts_2,
      daemon_ts_1,
      cli_ts_1,
      config_ts_2,
      args_ts_1,
      log_ts_1,
      VERSION,
      Denon;
    var __moduleName = context_85 && context_85.id;
    /**
     * CLI starts here,
     * other than the awesome `denon` cli this is an
     * example on how the library should be used if
     * included as a module.
     */
    async function rundenon(cmdline) {
      await log_ts_1.setupLog();
      await cli_ts_1.grantPermissions();
      const args = args_ts_1.parseArgs([]);
      const config = await config_ts_2.readConfig(args.config);
      await log_ts_1.setupLog(config);
      config.watcher.exts = ["*"];
      config.args = args;
      config.args.cmdline = cmdline;
      const script = args.cmd[0];
      const denon = new Denon(config);
      if (config.logger.fullscreen) {
        console.clear();
      }
      deps_ts_8.log.info(`watching path(s): ${config.watcher.match.join(" ")}`);
      deps_ts_8.log.info(
        `watching extensions: ${config.watcher.exts.join(",")}`,
      );
      for await (let _ of denon.run(script)) {}
    }
    exports_85("rundenon", rundenon);
    return {
      setters: [
        function (deps_ts_8_1) {
          deps_ts_8 = deps_ts_8_1;
        },
        function (watcher_ts_1_1) {
          watcher_ts_1 = watcher_ts_1_1;
        },
        function (runner_ts_2_1) {
          runner_ts_2 = runner_ts_2_1;
        },
        function (daemon_ts_1_1) {
          daemon_ts_1 = daemon_ts_1_1;
        },
        function (cli_ts_1_1) {
          cli_ts_1 = cli_ts_1_1;
        },
        function (config_ts_2_1) {
          config_ts_2 = config_ts_2_1;
        },
        function (args_ts_1_1) {
          args_ts_1 = args_ts_1_1;
        },
        function (log_ts_1_1) {
          log_ts_1 = log_ts_1_1;
        },
      ],
      execute: function () {
        VERSION = "v2.0.0";
        /**
             * Denon instance.
             * Holds loaded configuration and handles creation
             * of daemons with the `start(script)` method.
             */
        Denon = class Denon {
          constructor(config) {
            this.config = config;
            this.watcher = new watcher_ts_1.Watcher(config.watcher);
            this.runner = new runner_ts_2.Runner(config);
          }
          run(script) {
            return new daemon_ts_1.Daemon(this, script);
          }
        };
        exports_85("Denon", Denon);
      },
    };
  },
);

const __exp = await __instantiateAsync(
  "file:///home/main/Desktop/yolk/denon/denon",
);
export const rundenon = __exp["rundenon"];
export const Denon = __exp["Denon"];
