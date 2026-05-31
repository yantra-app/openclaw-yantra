var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name14 in all)
    __defProp(target, name14, { get: all[name14], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/tslib/tslib.es6.mjs
var tslib_es6_exports = {};
__export(tslib_es6_exports, {
  __addDisposableResource: () => __addDisposableResource,
  __assign: () => __assign,
  __asyncDelegator: () => __asyncDelegator,
  __asyncGenerator: () => __asyncGenerator,
  __asyncValues: () => __asyncValues,
  __await: () => __await,
  __awaiter: () => __awaiter,
  __classPrivateFieldGet: () => __classPrivateFieldGet,
  __classPrivateFieldIn: () => __classPrivateFieldIn,
  __classPrivateFieldSet: () => __classPrivateFieldSet,
  __createBinding: () => __createBinding,
  __decorate: () => __decorate,
  __disposeResources: () => __disposeResources,
  __esDecorate: () => __esDecorate,
  __exportStar: () => __exportStar,
  __extends: () => __extends,
  __generator: () => __generator,
  __importDefault: () => __importDefault,
  __importStar: () => __importStar,
  __makeTemplateObject: () => __makeTemplateObject,
  __metadata: () => __metadata,
  __param: () => __param,
  __propKey: () => __propKey,
  __read: () => __read,
  __rest: () => __rest,
  __rewriteRelativeImportExtension: () => __rewriteRelativeImportExtension,
  __runInitializers: () => __runInitializers,
  __setFunctionName: () => __setFunctionName,
  __spread: () => __spread,
  __spreadArray: () => __spreadArray,
  __spreadArrays: () => __spreadArrays,
  __values: () => __values,
  default: () => tslib_es6_default
});
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}
function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name14, prefix) {
  if (typeof name14 === "symbol") name14 = name14.description ? "[".concat(name14.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name14) : name14 });
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
    ar = ar.concat(__read(arguments[i]));
  return ar;
}
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f) {
    return function(v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f) i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  }
  __setModuleDefault(result, mod);
  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}
function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
            fail(e);
            return next();
          });
        } else s |= 1;
      } catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}
function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
    return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
      return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
    });
  }
  return path;
}
var extendStatics, __assign, __createBinding, __setModuleDefault, ownKeys, _SuppressedError, tslib_es6_default;
var init_tslib_es6 = __esm({
  "node_modules/tslib/tslib.es6.mjs"() {
    "use strict";
    extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    __assign = function() {
      __assign = Object.assign || function __assign2(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    ownKeys = function(o) {
      ownKeys = Object.getOwnPropertyNames || function(o2) {
        var ar = [];
        for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
        return ar;
      };
      return ownKeys(o);
    };
    _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    tslib_es6_default = {
      __extends,
      __assign,
      __rest,
      __decorate,
      __param,
      __esDecorate,
      __runInitializers,
      __propKey,
      __setFunctionName,
      __metadata,
      __awaiter,
      __generator,
      __createBinding,
      __exportStar,
      __values,
      __read,
      __spread,
      __spreadArrays,
      __spreadArray,
      __await,
      __asyncGenerator,
      __asyncDelegator,
      __asyncValues,
      __makeTemplateObject,
      __importStar,
      __importDefault,
      __classPrivateFieldGet,
      __classPrivateFieldSet,
      __classPrivateFieldIn,
      __addDisposableResource,
      __disposeResources,
      __rewriteRelativeImportExtension
    };
  }
});

// node_modules/envalid/dist/errors.js
var require_errors = __commonJS({
  "node_modules/envalid/dist/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EnvMissingError = exports.EnvError = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var EnvError = (
      /** @class */
      (function(_super) {
        tslib_1.__extends(EnvError2, _super);
        function EnvError2(message) {
          var _newTarget = this.constructor;
          var _this = _super.call(this, message) || this;
          Object.setPrototypeOf(_this, _newTarget.prototype);
          Error.captureStackTrace(_this, EnvError2);
          _this.name = _this.constructor.name;
          return _this;
        }
        return EnvError2;
      })(TypeError)
    );
    exports.EnvError = EnvError;
    var EnvMissingError = (
      /** @class */
      (function(_super) {
        tslib_1.__extends(EnvMissingError2, _super);
        function EnvMissingError2(message) {
          var _newTarget = this.constructor;
          var _this = _super.call(this, message) || this;
          Object.setPrototypeOf(_this, _newTarget.prototype);
          Error.captureStackTrace(_this, EnvMissingError2);
          _this.name = _this.constructor.name;
          return _this;
        }
        return EnvMissingError2;
      })(ReferenceError)
    );
    exports.EnvMissingError = EnvMissingError;
  }
});

// node_modules/envalid/dist/reporter.js
var require_reporter = __commonJS({
  "node_modules/envalid/dist/reporter.js"(exports) {
    "use strict";
    var _a15;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultReporter = exports.envalidErrorFormatter = void 0;
    var errors_1 = require_errors();
    var defaultLogger = console.error.bind(console);
    var isNode = !!(typeof process === "object" && ((_a15 = process === null || process === void 0 ? void 0 : process.versions) === null || _a15 === void 0 ? void 0 : _a15.node));
    var colorWith = function(colorCode) {
      return function(str2) {
        return isNode ? "\x1B[".concat(colorCode, "m").concat(str2, "\x1B[0m") : str2;
      };
    };
    var colors = {
      blue: colorWith("34"),
      white: colorWith("37"),
      yellow: colorWith("33")
    };
    var RULE = colors.white("================================");
    var envalidErrorFormatter = function(errors, logger) {
      if (logger === void 0) {
        logger = defaultLogger;
      }
      var missingVarsOutput = [];
      var invalidVarsOutput = [];
      for (var _i = 0, _a16 = Object.entries(errors); _i < _a16.length; _i++) {
        var _b15 = _a16[_i], k = _b15[0], err = _b15[1];
        if (err instanceof errors_1.EnvMissingError) {
          missingVarsOutput.push("    ".concat(colors.blue(k), ": ").concat(err.message || "(required)"));
        } else
          invalidVarsOutput.push("    ".concat(colors.blue(k), ": ").concat((err === null || err === void 0 ? void 0 : err.message) || "(invalid format)"));
      }
      if (invalidVarsOutput.length) {
        invalidVarsOutput.unshift(" ".concat(colors.yellow("Invalid"), " environment variables:"));
      }
      if (missingVarsOutput.length) {
        missingVarsOutput.unshift(" ".concat(colors.yellow("Missing"), " environment variables:"));
      }
      var output = [
        RULE,
        invalidVarsOutput.sort().join("\n"),
        missingVarsOutput.sort().join("\n"),
        RULE
      ].filter(function(x) {
        return !!x;
      }).join("\n");
      logger(output);
    };
    exports.envalidErrorFormatter = envalidErrorFormatter;
    var defaultReporter = function(_a16, _b15) {
      var _c = _a16.errors, errors = _c === void 0 ? {} : _c;
      var _d = _b15 === void 0 ? { logger: defaultLogger } : _b15, onError = _d.onError, logger = _d.logger;
      if (!Object.keys(errors).length)
        return;
      (0, exports.envalidErrorFormatter)(errors, logger);
      if (onError) {
        onError(errors);
      } else if (isNode) {
        logger(colors.yellow("\n Exiting with error code 1"));
        process.exit(1);
      } else {
        throw new TypeError("Environment validation failed");
      }
    };
    exports.defaultReporter = defaultReporter;
  }
});

// node_modules/envalid/dist/core.js
var require_core = __commonJS({
  "node_modules/envalid/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSanitizedEnv = exports.formatSpecDescription = exports.testOnlySymbol = void 0;
    var errors_1 = require_errors();
    var reporter_1 = require_reporter();
    exports.testOnlySymbol = /* @__PURE__ */ Symbol("envalid - test only");
    function validateVar(_a15) {
      var spec = _a15.spec, name14 = _a15.name, rawValue = _a15.rawValue;
      if (typeof spec._parse !== "function") {
        throw new errors_1.EnvError('Invalid spec for "'.concat(name14, '"'));
      }
      var value = spec._parse(rawValue);
      if (spec.choices) {
        if (!Array.isArray(spec.choices)) {
          throw new TypeError('"choices" must be an array (in spec for "'.concat(name14, '")'));
        } else if (!spec.choices.includes(value)) {
          throw new errors_1.EnvError('Value "'.concat(value, '" not in choices [').concat(spec.choices, "]"));
        }
      }
      if (value == null)
        throw new errors_1.EnvError('Invalid value for env var "'.concat(name14, '"'));
      return value;
    }
    function formatSpecDescription(spec) {
      var egText = spec.example ? ' (eg. "'.concat(spec.example, '")') : "";
      var docsText = spec.docs ? ". See ".concat(spec.docs) : "";
      return "".concat(spec.desc).concat(egText).concat(docsText);
    }
    exports.formatSpecDescription = formatSpecDescription;
    var readRawEnvValue = function(env, k) {
      return env[k];
    };
    var isTestOnlySymbol = function(value) {
      return value === exports.testOnlySymbol;
    };
    function getSanitizedEnv(environment, specs, options) {
      if (options === void 0) {
        options = {};
      }
      var cleanedEnv = {};
      var castedSpecs = specs;
      var errors = {};
      var varKeys = Object.keys(castedSpecs);
      var rawNodeEnv = readRawEnvValue(environment, "NODE_ENV");
      for (var _i = 0, varKeys_1 = varKeys; _i < varKeys_1.length; _i++) {
        var k = varKeys_1[_i];
        var spec = castedSpecs[k];
        var rawValue = readRawEnvValue(environment, k);
        try {
          if (rawValue === void 0) {
            var usingDevDefault = rawNodeEnv && rawNodeEnv !== "production" && Object.hasOwn(spec, "devDefault");
            if (usingDevDefault) {
              cleanedEnv[k] = spec.devDefault;
              if (isTestOnlySymbol(spec.devDefault) && rawNodeEnv != "test") {
                throw new errors_1.EnvMissingError(formatSpecDescription(spec));
              }
              continue;
            }
            if ("default" in spec) {
              cleanedEnv[k] = spec.default;
              continue;
            }
            cleanedEnv[k] = void 0;
            throw new errors_1.EnvMissingError(formatSpecDescription(spec));
          }
          cleanedEnv[k] = validateVar({ name: k, spec, rawValue });
        } catch (err) {
          if ((options === null || options === void 0 ? void 0 : options.reporter) === null)
            throw err;
          if (err instanceof Error)
            errors[k] = err;
        }
      }
      for (var _a15 = 0, varKeys_2 = varKeys; _a15 < varKeys_2.length; _a15++) {
        var k = varKeys_2[_a15];
        if (errors[k] == void 0) {
          var spec = castedSpecs[k];
          if (cleanedEnv[k] == void 0 && spec.requiredWhen !== void 0 && spec.requiredWhen(cleanedEnv)) {
            errors[k] = new errors_1.EnvMissingError(formatSpecDescription(spec));
          }
        }
      }
      var reporter = (options === null || options === void 0 ? void 0 : options.reporter) || reporter_1.defaultReporter;
      reporter({ errors, env: cleanedEnv });
      return cleanedEnv;
    }
    exports.getSanitizedEnv = getSanitizedEnv;
  }
});

// node_modules/envalid/dist/middleware.js
var require_middleware = __commonJS({
  "node_modules/envalid/dist/middleware.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyDefaultMiddleware = exports.accessorMiddleware = exports.strictProxyMiddleware = void 0;
    var strictProxyMiddleware = function(envObj, rawEnv, options) {
      if (options === void 0) {
        options = {};
      }
      var _a15 = options.extraInspectables, extraInspectables = _a15 === void 0 ? [] : _a15;
      var inspectables = [
        "length",
        "inspect",
        "hasOwnProperty",
        "toJSON",
        Symbol.toStringTag,
        Symbol.iterator,
        // For jest
        "asymmetricMatch",
        "nodeType",
        // For react-refresh, see #150
        "$$typeof",
        // For libs that use `then` checks to see if objects are Promises (see #74):
        "then",
        // For usage with TypeScript esModuleInterop flag
        "__esModule"
      ];
      var inspectSymbolStrings = ["Symbol(util.inspect.custom)", "Symbol(nodejs.util.inspect.custom)"];
      return new Proxy(envObj, {
        get: function(target, name14) {
          var _a16;
          if (inspectables.includes(name14) || inspectSymbolStrings.includes(name14.toString()) || extraInspectables.includes(name14)) {
            return target[name14];
          }
          var varExists = Object.hasOwn(target, name14);
          if (!varExists) {
            if (typeof rawEnv === "object" && ((_a16 = rawEnv === null || rawEnv === void 0 ? void 0 : rawEnv.hasOwnProperty) === null || _a16 === void 0 ? void 0 : _a16.call(rawEnv, name14))) {
              throw new ReferenceError("[envalid] Env var ".concat(name14, " was accessed but not validated. This var is set in the environment; please add an envalid validator for it."));
            }
            throw new ReferenceError("[envalid] Env var not found: ".concat(name14));
          }
          return target[name14];
        },
        set: function(_target, name14) {
          throw new TypeError("[envalid] Attempt to mutate environment value: ".concat(name14));
        }
      });
    };
    exports.strictProxyMiddleware = strictProxyMiddleware;
    var accessorMiddleware = function(envObj, rawEnv) {
      var computedNodeEnv = envObj.NODE_ENV || rawEnv.NODE_ENV;
      var isProd = !computedNodeEnv || computedNodeEnv === "production";
      Object.defineProperties(envObj, {
        isDevelopment: { value: computedNodeEnv === "development" },
        isDev: { value: computedNodeEnv === "development" },
        isProduction: { value: isProd },
        isProd: { value: isProd },
        isTest: { value: computedNodeEnv === "test" }
      });
      return envObj;
    };
    exports.accessorMiddleware = accessorMiddleware;
    var applyDefaultMiddleware = function(cleanedEnv, rawEnv) {
      return (0, exports.strictProxyMiddleware)((0, exports.accessorMiddleware)(cleanedEnv, rawEnv), rawEnv);
    };
    exports.applyDefaultMiddleware = applyDefaultMiddleware;
  }
});

// node_modules/envalid/dist/envalid.js
var require_envalid = __commonJS({
  "node_modules/envalid/dist/envalid.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.testOnly = exports.customCleanEnv = exports.cleanEnv = void 0;
    var core_1 = require_core();
    var middleware_1 = require_middleware();
    function cleanEnv2(environment, specs, options) {
      if (options === void 0) {
        options = {};
      }
      var cleaned = (0, core_1.getSanitizedEnv)(environment, specs, options);
      return Object.freeze((0, middleware_1.applyDefaultMiddleware)(cleaned, environment));
    }
    exports.cleanEnv = cleanEnv2;
    function customCleanEnv(environment, specs, applyMiddleware, options) {
      if (options === void 0) {
        options = {};
      }
      var cleaned = (0, core_1.getSanitizedEnv)(environment, specs, options);
      return Object.freeze(applyMiddleware(cleaned, environment));
    }
    exports.customCleanEnv = customCleanEnv;
    var testOnly = function(defaultValueForTests) {
      return process.env.NODE_ENV === "test" ? defaultValueForTests : core_1.testOnlySymbol;
    };
    exports.testOnly = testOnly;
  }
});

// node_modules/envalid/dist/types.js
var require_types = __commonJS({
  "node_modules/envalid/dist/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/envalid/dist/makers.js
var require_makers = __commonJS({
  "node_modules/envalid/dist/makers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeStructuredValidator = exports.makeExactValidator = exports.makeValidator = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var internalMakeValidator = function(parseFn) {
      return function(spec) {
        return tslib_1.__assign(tslib_1.__assign({}, spec), { _parse: parseFn });
      };
    };
    var makeValidator = function(parseFn) {
      return internalMakeValidator(parseFn);
    };
    exports.makeValidator = makeValidator;
    var makeExactValidator = function(parseFn) {
      return internalMakeValidator(parseFn);
    };
    exports.makeExactValidator = makeExactValidator;
    var makeStructuredValidator = function(parseFn) {
      return internalMakeValidator(parseFn);
    };
    exports.makeStructuredValidator = makeStructuredValidator;
  }
});

// node_modules/envalid/dist/validators.js
var require_validators = __commonJS({
  "node_modules/envalid/dist/validators.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.json = exports.url = exports.port = exports.host = exports.email = exports.str = exports.num = exports.bool = void 0;
    var errors_1 = require_errors();
    var makers_1 = require_makers();
    var isFQDN = function(input) {
      if (!input.length)
        return false;
      var parts = input.split(".");
      for (var part = void 0, i = 0; i < parts.length; i++) {
        part = parts[i];
        if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part))
          return false;
        if (/[\uff01-\uff5e]/.test(part))
          return false;
        if (part[0] === "-" || part[part.length - 1] === "-")
          return false;
      }
      return true;
    };
    var ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}$/;
    var ipv6Regex = /^(([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|([0-9a-f]{1,4}:)+:([0-9a-f]{1,4}:)*[0-9a-f]{1,4}|([0-9a-f]{1,4}:)*::([0-9a-f]{1,4}:)*[0-9a-f]{0,4}|::|(([0-9a-f]{1,4}:){1,6}|:):((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]))(%[0-9a-z.\-:]+)?$/i;
    var isIP = function(input) {
      if (!input.length)
        return false;
      return ipv4Regex.test(input) || ipv6Regex.test(input);
    };
    var EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    exports.bool = (0, makers_1.makeExactValidator)(function(input) {
      switch (input) {
        case true:
        case "true":
        case "t":
        case "yes":
        case "on":
        case "1":
          return true;
        case false:
        case "false":
        case "f":
        case "no":
        case "off":
        case "0":
          return false;
        default:
          throw new errors_1.EnvError('Invalid bool input: "'.concat(input, '"'));
      }
    });
    exports.num = (0, makers_1.makeValidator)(function(input) {
      var coerced = parseFloat(input);
      if (Number.isNaN(coerced))
        throw new errors_1.EnvError('Invalid number input: "'.concat(input, '"'));
      return coerced;
    });
    exports.str = (0, makers_1.makeValidator)(function(input) {
      if (typeof input === "string")
        return input;
      throw new errors_1.EnvError('Not a string: "'.concat(input, '"'));
    });
    exports.email = (0, makers_1.makeValidator)(function(x) {
      if (EMAIL_REGEX.test(x))
        return x;
      throw new errors_1.EnvError('Invalid email address: "'.concat(x, '"'));
    });
    exports.host = (0, makers_1.makeValidator)(function(input) {
      if (!isFQDN(input) && !isIP(input)) {
        throw new errors_1.EnvError('Invalid host (domain or ip): "'.concat(input, '"'));
      }
      return input;
    });
    exports.port = (0, makers_1.makeValidator)(function(input) {
      var coerced = +input;
      if (Number.isNaN(coerced) || "".concat(coerced) !== "".concat(input) || coerced % 1 !== 0 || coerced < 1 || coerced > 65535) {
        throw new errors_1.EnvError('Invalid port input: "'.concat(input, '"'));
      }
      return coerced;
    });
    exports.url = (0, makers_1.makeValidator)(function(x) {
      try {
        new URL(x);
        return x;
      } catch (e) {
        throw new errors_1.EnvError('Invalid url: "'.concat(x, '"'));
      }
    });
    exports.json = (0, makers_1.makeStructuredValidator)(function(x) {
      try {
        return JSON.parse(x);
      } catch (e) {
        throw new errors_1.EnvError('Invalid json: "'.concat(x, '"'));
      }
    });
  }
});

// node_modules/envalid/dist/index.js
var require_dist = __commonJS({
  "node_modules/envalid/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeValidator = exports.makeExactValidator = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_envalid(), exports);
    tslib_1.__exportStar(require_errors(), exports);
    tslib_1.__exportStar(require_middleware(), exports);
    tslib_1.__exportStar(require_types(), exports);
    tslib_1.__exportStar(require_validators(), exports);
    tslib_1.__exportStar(require_reporter(), exports);
    var makers_1 = require_makers();
    Object.defineProperty(exports, "makeExactValidator", { enumerable: true, get: function() {
      return makers_1.makeExactValidator;
    } });
    Object.defineProperty(exports, "makeValidator", { enumerable: true, get: function() {
      return makers_1.makeValidator;
    } });
  }
});

// src/index.ts
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

// src/config/env-config.ts
var import_envalid = __toESM(require_dist(), 1);
function loadYantraEnvConfig(env = process.env) {
  return (0, import_envalid.cleanEnv)(env, {
    YANTRA_BASE_URL: (0, import_envalid.str)({ default: "https://cdecli-agent.cdebase.dev" }),
    YANTRA_API_KEY: (0, import_envalid.str)({ default: "" })
  });
}

// src/http-client.ts
function buildHeaders(token) {
  const h = { "content-type": "application/json" };
  if (token) h.authorization = `Bearer ${token}`;
  return h;
}
var YantraHttpClient = class {
  baseUrl;
  authToken;
  fetchImpl;
  timeoutMs;
  constructor(options) {
    if (!options.baseUrl) throw new Error("YantraHttpClient: baseUrl is required");
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.authToken = options.authToken;
    this.fetchImpl = options.fetch ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 12e4;
  }
  async health() {
    try {
      const res = await this.fetchImpl(`${this.baseUrl}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
  /** Create a new server-side session. */
  async createSession(input = {}, signal) {
    const body = {
      model: input.model,
      skill: input.skill,
      skill_id: input.skillId,
      system_prompt: input.systemPrompt
    };
    const res = await this.fetchImpl(`${this.baseUrl}/v1/agent/session`, {
      method: "POST",
      headers: buildHeaders(this.authToken),
      body: JSON.stringify(body),
      signal
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`yantra createSession HTTP ${res.status}: ${text.slice(0, 500)}`);
    }
    return await res.json();
  }
  /** Non-streaming chat call. Returns the full assembled response text. */
  async chat(req, signal) {
    const ctrl = new AbortController();
    const linked = linkSignals(signal, ctrl.signal);
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await this.fetchImpl(`${this.baseUrl}/v1/agent/chat`, {
        method: "POST",
        headers: buildHeaders(this.authToken),
        body: JSON.stringify({ ...req, stream: false }),
        signal: linked
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`yantra chat HTTP ${res.status}: ${text.slice(0, 500)}`);
      }
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }
  /**
   * Streaming chat call. Yields parsed SSE events from the cdecli agent.
   * The stream ends after the `done` event or when the underlying response closes.
   */
  async *chatStream(req, signal) {
    const res = await this.fetchImpl(`${this.baseUrl}/v1/agent/chat`, {
      method: "POST",
      headers: { ...buildHeaders(this.authToken), accept: "text/event-stream" },
      body: JSON.stringify({ ...req, stream: true }),
      signal
    });
    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "");
      throw new Error(`yantra chatStream HTTP ${res.status}: ${text.slice(0, 500)}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let sepIdx;
        while ((sepIdx = buffer.indexOf("\n\n")) !== -1) {
          const frame = buffer.slice(0, sepIdx);
          buffer = buffer.slice(sepIdx + 2);
          const parsed = parseSseFrame(frame);
          if (parsed) {
            yield parsed;
            if (parsed.event === "done") return;
          }
        }
      }
    } finally {
      try {
        reader.releaseLock();
      } catch {
      }
    }
  }
};
function parseSseFrame(frame) {
  let event = "message";
  const dataLines = [];
  for (const rawLine of frame.split("\n")) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith(":")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const field = line.slice(0, colon);
    let value = line.slice(colon + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "event") event = value;
    else if (field === "data") dataLines.push(value);
  }
  if (dataLines.length === 0) return null;
  const dataStr = dataLines.join("\n");
  try {
    const data = JSON.parse(dataStr);
    return { event, data };
  } catch {
    return null;
  }
}
function linkSignals(a, b) {
  if (!a) return b;
  if (a.aborted) return a;
  const ctrl = new AbortController();
  const onA = () => ctrl.abort(a.reason);
  const onB = () => ctrl.abort(b.reason);
  a.addEventListener("abort", onA, { once: true });
  b.addEventListener("abort", onB, { once: true });
  return ctrl.signal;
}

// src/pi-event-stream.ts
var EventStream = class {
  constructor(isComplete, extractResult) {
    this.isComplete = isComplete;
    this.extractResult = extractResult;
    this.finalResultPromise = new Promise((resolve) => {
      this.resolveFinalResult = resolve;
    });
  }
  isComplete;
  extractResult;
  queue = [];
  waiting = [];
  done = false;
  finalResultPromise;
  resolveFinalResult;
  push(event) {
    if (this.done) return;
    if (this.isComplete(event)) {
      this.done = true;
      this.resolveFinalResult(this.extractResult(event));
    }
    const waiter = this.waiting.shift();
    if (waiter) waiter({ value: event, done: false });
    else this.queue.push(event);
  }
  end(result) {
    this.done = true;
    if (result !== void 0) this.resolveFinalResult(result);
    while (this.waiting.length > 0) {
      const waiter = this.waiting.shift();
      waiter?.({ value: void 0, done: true });
    }
  }
  async *[Symbol.asyncIterator]() {
    while (true) {
      if (this.queue.length > 0) {
        yield this.queue.shift();
      } else if (this.done) {
        return;
      } else {
        const result = await new Promise(
          (resolve) => this.waiting.push(resolve)
        );
        if (result.done) return;
        yield result.value;
      }
    }
  }
  result() {
    return this.finalResultPromise;
  }
};
var AssistantMessageEventStream = class extends EventStream {
  constructor() {
    super(
      (event) => event.type === "done" || event.type === "error",
      (event) => {
        if (event.type === "done") return event.message;
        if (event.type === "error") return event.error;
        throw new Error("Unexpected event type for final result");
      }
    );
  }
};
function createAssistantMessageEventStream() {
  return new AssistantMessageEventStream();
}

// src/openclaw-cdecli-stream.ts
var CDELI_AGENT_API = "yantra-cdecli-agent";
var sessionByOpenClaw = /* @__PURE__ */ new Map();
var EMPTY_USAGE = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
};
function resolveAgentBaseUrl() {
  return loadYantraEnvConfig().YANTRA_BASE_URL.replace(/\/+$/, "");
}
function resolveAuthToken(options) {
  const env = loadYantraEnvConfig();
  const fromOptions = options?.apiKey?.trim();
  return fromOptions || env.YANTRA_API_KEY || void 0;
}
function textFromUserContent(content) {
  if (typeof content === "string") return content;
  return content.filter((part) => part.type === "text").map((part) => part.text ?? "").join("");
}
function extractLatestUserMessage(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg?.role === "user") {
      const text = textFromUserContent(msg.content).trim();
      if (text) return text;
    }
  }
  throw new Error("yantrarouter: no user message in context");
}
function sessionKey(options) {
  return options?.sessionId?.trim() || "default";
}
function createCdecliAgentStreamFn() {
  return (model, context, options) => {
    const stream = createAssistantMessageEventStream();
    const output = {
      role: "assistant",
      content: [],
      api: model.api,
      provider: model.provider,
      model: model.id,
      usage: { ...EMPTY_USAGE },
      stopReason: "stop",
      timestamp: Date.now()
    };
    void (async () => {
      try {
        const client = new YantraHttpClient({
          baseUrl: resolveAgentBaseUrl(),
          authToken: resolveAuthToken(options)
        });
        const key = sessionKey(options);
        let cdecliSession = sessionByOpenClaw.get(key);
        if (!cdecliSession) {
          const info = await client.createSession(
            { systemPrompt: context.systemPrompt },
            options?.signal
          );
          cdecliSession = info.session_id;
          sessionByOpenClaw.set(key, cdecliSession);
        }
        const message = extractLatestUserMessage(context.messages);
        stream.push({ type: "start", partial: output });
        const textBlock = { type: "text", text: "" };
        output.content.push(textBlock);
        stream.push({ type: "text_start", contentIndex: 0, partial: output });
        for await (const ev of client.chatStream(
          { session_id: cdecliSession, message, stream: true },
          options?.signal
        )) {
          if (ev.event === "delta" || ev.event === "output") {
            const delta = ev.data.text;
            if (delta) {
              textBlock.text += delta;
              stream.push({
                type: "text_delta",
                contentIndex: 0,
                delta,
                partial: output
              });
            }
          } else if (ev.event === "error") {
            output.stopReason = "error";
            output.errorMessage = ev.data.error || "yantra stream error";
            stream.push({ type: "error", reason: "error", error: { ...output } });
            return;
          }
        }
        stream.push({
          type: "text_end",
          contentIndex: 0,
          content: textBlock.text,
          partial: output
        });
        stream.push({ type: "done", reason: "stop", message: { ...output } });
      } catch (err) {
        output.stopReason = "error";
        output.errorMessage = err instanceof Error ? err.message : String(err);
        stream.push({ type: "error", reason: "error", error: { ...output } });
      }
    })();
    return stream;
  };
}

// node_modules/@ai-sdk/provider/dist/index.mjs
var marker = "vercel.ai.error";
var symbol = Symbol.for(marker);
var _a;
var _b;
var AISDKError = class _AISDKError extends (_b = Error, _a = symbol, _b) {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError.hasMarker(error, marker);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
var name = "AI_APICallError";
var marker2 = `vercel.ai.error.${name}`;
var symbol2 = Symbol.for(marker2);
var _a2;
var _b2;
var APICallError = class extends (_b2 = AISDKError, _a2 = symbol2, _b2) {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name, message, cause });
    this[_a2] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker2);
  }
};
var name2 = "AI_EmptyResponseBodyError";
var marker3 = `vercel.ai.error.${name2}`;
var symbol3 = Symbol.for(marker3);
var _a3;
var _b3;
var EmptyResponseBodyError = class extends (_b3 = AISDKError, _a3 = symbol3, _b3) {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2, message });
    this[_a3] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker3);
  }
};
function getErrorMessage(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}
var name3 = "AI_InvalidArgumentError";
var marker4 = `vercel.ai.error.${name3}`;
var symbol4 = Symbol.for(marker4);
var _a4;
var _b4;
var InvalidArgumentError = class extends (_b4 = AISDKError, _a4 = symbol4, _b4) {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3, message, cause });
    this[_a4] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker4);
  }
};
var name4 = "AI_InvalidPromptError";
var marker5 = `vercel.ai.error.${name4}`;
var symbol5 = Symbol.for(marker5);
var _a5;
var _b5;
var InvalidPromptError = class extends (_b5 = AISDKError, _a5 = symbol5, _b5) {
  constructor({
    prompt,
    message,
    cause
  }) {
    super({ name: name4, message: `Invalid prompt: ${message}`, cause });
    this[_a5] = true;
    this.prompt = prompt;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker5);
  }
};
var name5 = "AI_InvalidResponseDataError";
var marker6 = `vercel.ai.error.${name5}`;
var symbol6 = Symbol.for(marker6);
var _a6;
var _b6;
var InvalidResponseDataError = class extends (_b6 = AISDKError, _a6 = symbol6, _b6) {
  constructor({
    data,
    message = `Invalid response data: ${JSON.stringify(data)}.`
  }) {
    super({ name: name5, message });
    this[_a6] = true;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker6);
  }
};
var name6 = "AI_JSONParseError";
var marker7 = `vercel.ai.error.${name6}`;
var symbol7 = Symbol.for(marker7);
var _a7;
var _b7;
var JSONParseError = class extends (_b7 = AISDKError, _a7 = symbol7, _b7) {
  constructor({ text, cause }) {
    super({
      name: name6,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a7] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker7);
  }
};
var name7 = "AI_LoadAPIKeyError";
var marker8 = `vercel.ai.error.${name7}`;
var symbol8 = Symbol.for(marker8);
var _a8;
var _b8;
var LoadAPIKeyError = class extends (_b8 = AISDKError, _a8 = symbol8, _b8) {
  // used in isInstance
  constructor({ message }) {
    super({ name: name7, message });
    this[_a8] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker8);
  }
};
var name8 = "AI_LoadSettingError";
var marker9 = `vercel.ai.error.${name8}`;
var symbol9 = Symbol.for(marker9);
var _a9;
var _b9;
var LoadSettingError = class extends (_b9 = AISDKError, _a9 = symbol9, _b9) {
  // used in isInstance
  constructor({ message }) {
    super({ name: name8, message });
    this[_a9] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker9);
  }
};
var name9 = "AI_NoContentGeneratedError";
var marker10 = `vercel.ai.error.${name9}`;
var symbol10 = Symbol.for(marker10);
var _a10;
var _b10;
var NoContentGeneratedError = class extends (_b10 = AISDKError, _a10 = symbol10, _b10) {
  // used in isInstance
  constructor({
    message = "No content generated."
  } = {}) {
    super({ name: name9, message });
    this[_a10] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker10);
  }
};
var name10 = "AI_NoSuchModelError";
var marker11 = `vercel.ai.error.${name10}`;
var symbol11 = Symbol.for(marker11);
var _a11;
var _b11;
var NoSuchModelError = class extends (_b11 = AISDKError, _a11 = symbol11, _b11) {
  constructor({
    errorName = name10,
    modelId,
    modelType,
    message = `No such ${modelType}: ${modelId}`
  }) {
    super({ name: errorName, message });
    this[_a11] = true;
    this.modelId = modelId;
    this.modelType = modelType;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker11);
  }
};
var name11 = "AI_TooManyEmbeddingValuesForCallError";
var marker12 = `vercel.ai.error.${name11}`;
var symbol12 = Symbol.for(marker12);
var _a12;
var _b12;
var TooManyEmbeddingValuesForCallError = class extends (_b12 = AISDKError, _a12 = symbol12, _b12) {
  constructor(options) {
    super({
      name: name11,
      message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
    });
    this[_a12] = true;
    this.provider = options.provider;
    this.modelId = options.modelId;
    this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
    this.values = options.values;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker12);
  }
};
var name12 = "AI_TypeValidationError";
var marker13 = `vercel.ai.error.${name12}`;
var symbol13 = Symbol.for(marker13);
var _a13;
var _b13;
var TypeValidationError = class _TypeValidationError extends (_b13 = AISDKError, _a13 = symbol13, _b13) {
  constructor({
    value,
    cause,
    context
  }) {
    let contextPrefix = "Type validation failed";
    if (context == null ? void 0 : context.field) {
      contextPrefix += ` for ${context.field}`;
    }
    if ((context == null ? void 0 : context.entityName) || (context == null ? void 0 : context.entityId)) {
      contextPrefix += " (";
      const parts = [];
      if (context.entityName) {
        parts.push(context.entityName);
      }
      if (context.entityId) {
        parts.push(`id: "${context.entityId}"`);
      }
      contextPrefix += parts.join(", ");
      contextPrefix += ")";
    }
    super({
      name: name12,
      message: `${contextPrefix}: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a13] = true;
    this.value = value;
    this.context = context;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker13);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value and context, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @param {TypeValidationContext} params.context - Optional context about what is being validated.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause,
    context
  }) {
    var _a15, _b15, _c;
    if (_TypeValidationError.isInstance(cause) && cause.value === value && ((_a15 = cause.context) == null ? void 0 : _a15.field) === (context == null ? void 0 : context.field) && ((_b15 = cause.context) == null ? void 0 : _b15.entityName) === (context == null ? void 0 : context.entityName) && ((_c = cause.context) == null ? void 0 : _c.entityId) === (context == null ? void 0 : context.entityId)) {
      return cause;
    }
    return new _TypeValidationError({ value, cause, context });
  }
};
var name13 = "AI_UnsupportedFunctionalityError";
var marker14 = `vercel.ai.error.${name13}`;
var symbol14 = Symbol.for(marker14);
var _a14;
var _b14;
var UnsupportedFunctionalityError = class extends (_b14 = AISDKError, _a14 = symbol14, _b14) {
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name13, message });
    this[_a14] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker14);
  }
};

// src/language-model.ts
var EMPTY_USAGE2 = {
  inputTokens: { total: void 0, noCache: void 0, cacheRead: void 0, cacheWrite: void 0 },
  outputTokens: { total: void 0, text: void 0, reasoning: void 0 }
};
var STOP = { unified: "stop", raw: void 0 };
var ERRORED = { unified: "error", raw: void 0 };
function extractLatestUserMessage2(prompt) {
  const warnings = [];
  const systemParts = [];
  let lastUserText;
  for (const msg of prompt) {
    if (msg.role === "system") {
      systemParts.push(msg.content);
      continue;
    }
    if (msg.role === "user") {
      const text = msg.content.map((part) => {
        if (part.type === "text") return part.text;
        warnings.push(`yantra provider: ignoring unsupported user part type "${part.type}"`);
        return "";
      }).join("");
      if (text) lastUserText = text;
      continue;
    }
  }
  if (lastUserText === void 0) {
    throw new Error("yantra provider: prompt contains no user text content");
  }
  return {
    message: lastUserText,
    systemPrompt: systemParts.length > 0 ? systemParts.join("\n\n") : void 0,
    warnings
  };
}
function unsupported(feature) {
  return { type: "unsupported", feature };
}
var YantraLanguageModel = class {
  specificationVersion = "v3";
  provider = "yantra";
  modelId;
  supportedUrls = {};
  client;
  opts;
  sessionId;
  sessionInit;
  constructor(opts) {
    this.modelId = opts.modelId;
    this.client = opts.client;
    this.opts = opts;
    this.sessionId = opts.sessionId;
  }
  async ensureSession(systemPrompt) {
    if (this.sessionId) return this.sessionId;
    if (!this.sessionInit) {
      this.sessionInit = (async () => {
        const info = await this.client.createSession({
          model: this.modelId && this.modelId !== "default" ? this.modelId : void 0,
          skill: this.opts.skill,
          skillId: this.opts.skillId,
          systemPrompt
        });
        this.sessionId = info.session_id;
        return this.sessionId;
      })();
    }
    return this.sessionInit;
  }
  collectWarnings(options) {
    const warnings = [];
    if (options.temperature !== void 0) warnings.push(unsupported("temperature"));
    if (options.topP !== void 0) warnings.push(unsupported("topP"));
    if (options.topK !== void 0) warnings.push(unsupported("topK"));
    if (options.frequencyPenalty !== void 0) warnings.push(unsupported("frequencyPenalty"));
    if (options.presencePenalty !== void 0) warnings.push(unsupported("presencePenalty"));
    if (options.stopSequences && options.stopSequences.length > 0) warnings.push(unsupported("stopSequences"));
    if (options.seed !== void 0) warnings.push(unsupported("seed"));
    if (options.maxOutputTokens !== void 0) warnings.push(unsupported("maxOutputTokens"));
    if (options.tools && options.tools.length > 0) {
      warnings.push({
        type: "other",
        message: "yantra executes tools server-side; client-supplied tool definitions are ignored."
      });
    }
    return warnings;
  }
  async doGenerate(options) {
    const warnings = this.collectWarnings(options);
    const { message, systemPrompt, warnings: convWarnings } = extractLatestUserMessage2(options.prompt);
    for (const w of convWarnings) warnings.push({ type: "other", message: w });
    const sessionId = await this.ensureSession(systemPrompt);
    const requestBody = {
      session_id: sessionId,
      message,
      ...this.modelId && this.modelId !== "default" ? { model: this.modelId } : {},
      skill: this.opts.skill,
      skill_id: this.opts.skillId,
      local: this.opts.local,
      stream: false
    };
    const resp = await this.client.chat(requestBody, options.abortSignal);
    const providerMetadata = {
      yantra: { sessionId: resp.session_id }
    };
    return {
      content: [{ type: "text", text: resp.response }],
      finishReason: STOP,
      usage: EMPTY_USAGE2,
      warnings,
      request: { body: requestBody },
      response: { id: resp.session_id, modelId: this.modelId },
      providerMetadata
    };
  }
  async doStream(options) {
    const warnings = this.collectWarnings(options);
    const { message, systemPrompt, warnings: convWarnings } = extractLatestUserMessage2(options.prompt);
    for (const w of convWarnings) warnings.push({ type: "other", message: w });
    const sessionId = await this.ensureSession(systemPrompt);
    const requestBody = {
      session_id: sessionId,
      message,
      ...this.modelId && this.modelId !== "default" ? { model: this.modelId } : {},
      skill: this.opts.skill,
      skill_id: this.opts.skillId,
      local: this.opts.local,
      stream: true
    };
    const client = this.client;
    const modelId = this.modelId;
    const textBlockId = "txt-0";
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue({ type: "stream-start", warnings });
        controller.enqueue({ type: "response-metadata", id: sessionId, modelId });
        controller.enqueue({ type: "text-start", id: textBlockId });
        let finishReason = STOP;
        try {
          for await (const ev of client.chatStream(requestBody, options.abortSignal)) {
            switch (ev.event) {
              case "delta":
              case "output":
                if (ev.data.text) {
                  controller.enqueue({ type: "text-delta", id: textBlockId, delta: ev.data.text });
                }
                break;
              case "error":
                finishReason = ERRORED;
                controller.enqueue({
                  type: "error",
                  error: new Error(ev.data.error || "yantra stream error")
                });
                break;
              case "done":
              case "session":
              case "status":
              case "tool_call":
              case "tool_result":
                break;
            }
          }
        } catch (err) {
          finishReason = ERRORED;
          controller.enqueue({ type: "error", error: err });
        } finally {
          controller.enqueue({ type: "text-end", id: textBlockId });
          controller.enqueue({ type: "finish", finishReason, usage: EMPTY_USAGE2 });
          controller.close();
        }
      }
    });
    return { stream, request: { body: requestBody } };
  }
};

// src/provider.ts
function resolveBaseUrl(explicit) {
  const env = loadYantraEnvConfig();
  const url = explicit || env.YANTRA_BASE_URL;
  if (!url) {
    throw new Error(
      "yantra provider: no baseUrl supplied. Pass `createYantra({ baseUrl })` or set YANTRA_BASE_URL to the cdecli agent URL."
    );
  }
  return url.replace(/\/+$/, "");
}
function resolveAuthToken2(explicit) {
  if (explicit) return explicit;
  const env = loadYantraEnvConfig();
  return env.YANTRA_API_KEY || void 0;
}
function createYantra(options = {}) {
  const client = new YantraHttpClient({
    baseUrl: resolveBaseUrl(options.baseUrl),
    authToken: resolveAuthToken2(options.authToken),
    fetch: options.fetch,
    timeoutMs: options.timeoutMs
  });
  const createModel = (modelId, settings) => {
    return new YantraLanguageModel({
      modelId,
      client,
      ...options.defaultSettings,
      ...settings
    });
  };
  const provider = Object.assign(
    (modelId, settings) => createModel(modelId, settings),
    {
      languageModel: createModel,
      chat: createModel,
      provider: "yantra",
      specificationVersion: "v3",
      embeddingModel(modelId) {
        throw new NoSuchModelError({ modelId, modelType: "embeddingModel" });
      },
      imageModel(modelId) {
        throw new NoSuchModelError({ modelId, modelType: "imageModel" });
      },
      getClient() {
        return client;
      }
    }
  );
  return provider;
}
var yantra = new Proxy(
  function yantraProxyTarget() {
  },
  {
    get(_t, prop, receiver) {
      const real = createYantra();
      return Reflect.get(real, prop, receiver);
    },
    apply(_t, _thisArg, args) {
      return createYantra()(...args);
    }
  }
);

// src/index.ts
function cdecliAgentBaseUrl() {
  return loadYantraEnvConfig().YANTRA_BASE_URL.replace(/\/+$/, "");
}
var CDELI_MODEL = {
  id: "yantra",
  name: "cdecli agent",
  provider: "yantrarouter",
  api: CDELI_AGENT_API,
  baseUrl: cdecliAgentBaseUrl(),
  reasoning: false,
  input: ["text"],
  contextWindow: 128e3,
  maxTokens: 8192,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
};
var index_default = definePluginEntry({
  id: "yantrarouter",
  name: "YantraRouter",
  description: "Connect OpenClaw to the cdecli agent",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(api) {
    api.registerProvider({
      id: "yantrarouter",
      label: "Yantra (cdecli agent)",
      envVars: ["YANTRA_API_KEY"],
      auth: [
        {
          id: "api-key",
          methodId: "api-key",
          label: "Yantra API key",
          hint: "Bearer token from your Yantra / cdebase dashboard",
          optionKey: "yantraApiKey",
          flagName: "--yantra-api-key",
          envVar: "YANTRA_API_KEY",
          promptMessage: "Enter your Yantra API key",
          defaultModel: "yantrarouter/yantra"
        }
      ],
      resolveDynamicModel: () => ({ ...CDELI_MODEL, baseUrl: cdecliAgentBaseUrl() }),
      createStreamFn: () => createCdecliAgentStreamFn()
    });
  }
});
export {
  CDELI_AGENT_API,
  YantraHttpClient,
  YantraLanguageModel,
  createCdecliAgentStreamFn,
  createYantra,
  index_default as default,
  parseSseFrame,
  yantra
};
