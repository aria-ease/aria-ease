#!/usr/bin/env node
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
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
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
// bin/audit-cli.ts
import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
// dist/src/utils/audit/audit.js
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
function asyncGeneratorStep1(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator1(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep1(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep1(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(void 0);
        });
    };
}
function _ts_generator1(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function sent() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
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
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
function runAudit(url) {
    return _async_to_generator1(function() {
        var browser, context, page, axe, axeResults, error;
        return _ts_generator1(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        chromium.launch({
                            headless: true
                        })
                    ];
                case 1:
                    browser = _state.sent();
                    return [
                        4,
                        browser.newContext()
                    ];
                case 2:
                    context = _state.sent();
                    return [
                        4,
                        context.newPage()
                    ];
                case 3:
                    page = _state.sent();
                    return [
                        4,
                        page.goto(url, {
                            waitUntil: "networkidle"
                        })
                    ];
                case 4:
                    _state.sent();
                    _state.label = 5;
                case 5:
                    _state.trys.push([
                        5,
                        7,
                        ,
                        8
                    ]);
                    axe = new AxeBuilder({
                        page: page
                    });
                    return [
                        4,
                        axe.analyze()
                    ];
                case 6:
                    axeResults = _state.sent();
                    return [
                        2,
                        axeResults
                    ];
                case 7:
                    error = _state.sent();
                    console.log(error);
                    return [
                        3,
                        8
                    ];
                case 8:
                    return [
                        4,
                        browser.close()
                    ];
                case 9:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
// src/utils/audit/formatters.ts
function formatResults(allResults, format) {
    switch(format){
        case "json":
            return JSON.stringify(allResults.flatMap(function(param) {
                var url = param.url, result = param.result;
                return result ? result.violations.flatMap(function(v) {
                    return v.nodes.map(function(n) {
                        return {
                            URL: url,
                            Rule: v.id,
                            Impact: v.impact,
                            Description: v.description,
                            Target: n.target,
                            FailureSummary: n.failureSummary
                        };
                    });
                }) : [];
            }), null, 2);
        case "csv":
            return toCSV(allResults);
        default:
            return "";
    }
}
function toCSV(allResults) {
    var rows = [
        "URL,Rule,Impact,Description,Target,FailureSummary"
    ];
    allResults.forEach(function(param) {
        var url = param.url, result = param.result;
        if (result) {
            result.violations.forEach(function(v) {
                v.nodes.forEach(function(n) {
                    rows.push('"'.concat(url, '","').concat(v.id, '","').concat(v.impact, '","').concat(v.description, '","').concat(n.target, '","').concat(n.failureSummary, '"'));
                });
            });
        }
    });
    return rows.join("\n");
}
// bin/audit-cli.ts
var program = new Command();
program.name("aria-ease").description("Run accessibility audits").version("2.0.4");
program.command("audit").description("Run accessibility audit").option("-u, --url <url>", "Single URL to audit").option("-f, --format <format>", "Output format for the audit report: json | csv", "csv").option("-o, --out <path>", "Directory to save the audit report", "./accessibility-reports").action(function(opts) {
    return _async_to_generator(function() {
        var _urls, configPath, config, _tmp, urls, format, allResults, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, url, result, err, err1, hasResults, formatted, out, timestamp, fileName, filePath;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(chalk.cyanBright("\uD83D\uDE80 Starting accessibility audit...\n"));
                    configPath = path.resolve(process.cwd(), "ariaease.config.js");
                    config = {};
                    return [
                        4,
                        fs.pathExists(configPath)
                    ];
                case 1:
                    if (!_state.sent()) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        import(configPath)
                    ];
                case 2:
                    _tmp = _state.sent().default;
                    if (_tmp) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        import(configPath)
                    ];
                case 3:
                    _tmp = _state.sent();
                    _state.label = 4;
                case 4:
                    config = _tmp;
                    console.log(chalk.green("\u2705 Loaded config from ariaease.config.js\n"));
                    return [
                        3,
                        6
                    ];
                case 5:
                    console.log(chalk.yellow("\u2139\uFE0F  No ariaease.config.js found at project root, using default configurations."));
                    _state.label = 6;
                case 6:
                    urls = [];
                    if (opts.url) urls.push(opts.url);
                    if (config.urls && Array.isArray(config.urls)) (_urls = urls).push.apply(_urls, _to_consumable_array(config.urls));
                    format = config.output && config.output.format || opts.format;
                    if (![
                        "json",
                        "csv"
                    ].includes(format)) {
                        console.log(chalk.red('\u274C Invalid format. Use "json" or "csv".'));
                        process.exit(1);
                    }
                    if (urls.length === 0) {
                        console.log(chalk.red('\u274C No URLs provided. Use --url option or add "urls" in ariaease.config.js'));
                        process.exit(1);
                    }
                    allResults = [];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 7;
                case 7:
                    _state.trys.push([
                        7,
                        14,
                        15,
                        16
                    ]);
                    _iterator = urls[Symbol.iterator]();
                    _state.label = 8;
                case 8:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        13
                    ];
                    url = _step.value;
                    console.log(chalk.yellow("\uD83D\uDD0E Auditing: ".concat(url)));
                    _state.label = 9;
                case 9:
                    _state.trys.push([
                        9,
                        11,
                        ,
                        12
                    ]);
                    return [
                        4,
                        runAudit(url)
                    ];
                case 10:
                    result = _state.sent();
                    allResults.push({
                        url: url,
                        result: result
                    });
                    console.log(chalk.green("✅ Completed audit for ".concat(url, "\n")));
                    return [
                        3,
                        12
                    ];
                case 11:
                    err = _state.sent();
                    console.log(chalk.red("❌ Failed auditing ".concat(url, ": ").concat(err.message)));
                    return [
                        3,
                        12
                    ];
                case 12:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        8
                    ];
                case 13:
                    return [
                        3,
                        16
                    ];
                case 14:
                    err1 = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err1;
                    return [
                        3,
                        16
                    ];
                case 15:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 16:
                    hasResults = allResults.some(function(r) {
                        return r.result && r.result.violations && r.result.violations.length > 0;
                    });
                    if (!hasResults) {
                        console.log(chalk.red("\u274C No audit report generated"));
                        process.exit(1);
                    }
                    formatted = formatResults(allResults, format);
                    out = config.output && config.output.out || opts.out;
                    return [
                        4,
                        fs.ensureDir(out)
                    ];
                case 17:
                    _state.sent();
                    timestamp = /* @__PURE__ */ new Date().toISOString().replace(/[:.]/g, "-");
                    fileName = "ariaease-report-".concat(timestamp, ".").concat(format);
                    filePath = path.join(out, fileName);
                    return [
                        4,
                        fs.writeFile(filePath, formatted, "utf-8")
                    ];
                case 18:
                    _state.sent();
                    console.log(chalk.magentaBright("\uD83D\uDCC1 Report saved to ".concat(filePath)));
                    console.log(chalk.green("\n\uD83C\uDF89 All audits completed."));
                    return [
                        2
                    ];
            }
        });
    })();
});
program.command("help").description("Display help information").action(function() {
    program.outputHelp();
});
program.parse(process.argv);
//# sourceMappingURL=audit-cli.js.map