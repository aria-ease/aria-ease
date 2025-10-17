#!/usr/bin/env node
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
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
function _instanceof1(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return _instanceof(left, right);
    }
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
                    _state.trys.push([
                        0,
                        6,
                        7,
                        10
                    ]);
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
                    axe = new AxeBuilder({
                        page: page
                    });
                    return [
                        4,
                        axe.analyze()
                    ];
                case 5:
                    axeResults = _state.sent();
                    return [
                        2,
                        axeResults
                    ];
                case 6:
                    error = _state.sent();
                    if (_instanceof1(error, Error)) {
                        if (error.message.includes("Executable doesn't exist")) {
                            console.error("\n\u274C Playwright browsers not found!\n");
                            console.log("\uD83D\uDCE6 First-time setup required:");
                            console.log("   Run: npx playwright install chromium\n");
                            console.log("\uD83D\uDCA1 This downloads the browser needed for auditing (~200MB)");
                            console.log("   You only need to do this once.\n");
                        } else if (error.message.includes("page.goto: net::ERR_CONNECTION_REFUSED")) {
                            console.error("\n\u274C Server Not Running!\n");
                            console.log("   Make sure your server is running before auditing URL");
                            console.log("   Run: npm run dev # or your start command");
                        }
                        process.exit(1);
                    }
                    console.error("Error during audit:", error);
                    throw error;
                case 7:
                    if (!browser) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        browser.close()
                    ];
                case 8:
                    _state.sent();
                    _state.label = 9;
                case 9:
                    return [
                        7
                    ];
                case 10:
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
        case "html":
            return toHTML(allResults);
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
                    var _n_failureSummary;
                    rows.push(escapeCSV(url) + "," + escapeCSV(v.id) + "," + escapeCSV(v.impact) + "," + escapeCSV(v.description) + "," + escapeCSV(Array.isArray(n.target) ? n.target.join("; ") : String(n.target)) + "," + escapeCSV((_n_failureSummary = n.failureSummary) !== null && _n_failureSummary !== void 0 ? _n_failureSummary : ""));
                });
            });
        }
    });
    return rows.join("\n");
}
function escapeCSV(value) {
    var s = String(value !== null && value !== void 0 ? value : "");
    return '"'.concat(s.replace(/"/g, '""'), '"');
}
function toHTML(allResults) {
    var summary = {
        pagesAudited: 0,
        pagesWithViolations: 0,
        totalViolations: 0,
        distinctRules: /* @__PURE__ */ new Set(),
        impactCounts: /* @__PURE__ */ new Map()
    };
    allResults.forEach(function(param) {
        var result = param.result;
        if (!result) return;
        summary.pagesAudited++;
        var pageViolations = result.violations.reduce(function(acc, v) {
            var nodesCount = (v.nodes || []).length;
            if (nodesCount > 0) {
                summary.distinctRules.add(v.id);
                summary.totalViolations += nodesCount;
                acc += nodesCount;
                var _v_impact;
                var impact = String((_v_impact = v.impact) !== null && _v_impact !== void 0 ? _v_impact : "unknown");
                summary.impactCounts.set(impact, (summary.impactCounts.get(impact) || 0) + nodesCount);
            }
            return acc;
        }, 0);
        if (pageViolations > 0) summary.pagesWithViolations++;
    });
    var rows = [];
    allResults.forEach(function(param) {
        var url = param.url, result = param.result;
        if (!result) return;
        result.violations.forEach(function(v) {
            v.nodes.forEach(function(n) {
                var target = Array.isArray(n.target) ? n.target.join("; ") : String(n.target);
                var _v_impact, _v_impact1, _v_description, _n_failureSummary;
                rows.push('\n          <tr>\n            <td class="nowrap">'.concat(escapeHTML(url), '</td>\n            <td class="nowrap">').concat(escapeHTML(v.id), '</td>\n            <td class="impact ').concat(escapeClass(String((_v_impact = v.impact) !== null && _v_impact !== void 0 ? _v_impact : "unknown")), '">').concat(escapeHTML(String((_v_impact1 = v.impact) !== null && _v_impact1 !== void 0 ? _v_impact1 : "")), '</td>\n            <td class="desc">').concat(escapeHTML((_v_description = v.description) !== null && _v_description !== void 0 ? _v_description : ""), '</td>\n            <td class="target"><code>').concat(escapeHTML(target), '</code></td>\n            <td class="fail">').concat(escapeHTML((_n_failureSummary = n.failureSummary) !== null && _n_failureSummary !== void 0 ? _n_failureSummary : "").split(/\r?\n/).join("<br/>"), "</td>\n          </tr>\n        "));
            });
        });
    });
    var impactSummary = Array.from(summary.impactCounts.entries()).map(function(param) {
        var _param = _sliced_to_array(param, 2), impact = _param[0], count = _param[1];
        return '<li><strong class="impact '.concat(escapeClass(impact), '">').concat(escapeHTML(impact), "</strong>: ").concat(count, "</li>");
    }).join("\n");
    var d = /* @__PURE__ */ new Date();
    var pad = function(n) {
        return String(n).padStart(2, "0");
    };
    var reportDateTime = "".concat(pad(d.getDate()), "-").concat(pad(d.getMonth() + 1), "-").concat(d.getFullYear(), " ").concat(pad(d.getHours()), ":").concat(pad(d.getMinutes()), ":").concat(pad(d.getSeconds()));
    var headerSummary = '\n    <section class="summary">\n      <h2>Report summary</h2>\n      <ul>\n        <li><strong>Date:</strong> '.concat(reportDateTime, "</li>\n        <li><strong>Pages audited:</strong> ").concat(summary.pagesAudited, "</li>\n        <li><strong>Pages with violations:</strong> ").concat(summary.pagesWithViolations, "</li>\n        <li><strong>Total violations:</strong> ").concat(summary.totalViolations, "</li>\n        <li><strong>Distinct rules:</strong> ").concat(summary.distinctRules.size, '</li>\n      </ul>\n      <div class="impact-summary">\n        <h3>By impact</h3>\n        <ul class="summary-list">\n          ').concat(impactSummary || "<li>None</li>", "\n        </ul>\n      </div>\n    </section>\n  ").trim();
    var html = '\n    <!DOCTYPE html>\n    <html lang="en">\n      <head>\n        <meta charset="utf-8"/>\n        <title>Aria-Ease Accessibility Audit Report</title>\n        <meta name="viewport" content="width=device-width, initial-scale=1"/>\n        <style>\n          :root{\n            --bg:#ffffff; --muted:#6b7280; --border:#e6e9ee;\n            --impact-critical: red; --impact-moderate:#fff4dd; --impact-serious:rgb(255, 123, 0);\n          }\n          body{font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial; background:var(--bg); color:#111827; padding:24px; line-height:1.4}\n          h1{margin:0 0 8px}\n          .summary{background:#f8fafc;border:1px solid var(--border);padding:12px 16px;border-radius:8px;margin-bottom:18px}\n          .summary ul{margin:6px 0 0 0;padding:0 18px}\n          .impact-summary h3{margin:12px 0 6px}\n          table{width:100%; border-collapse:collapse; margin-top:12px}\n          th,td{border:1px solid var(--border); padding:10px; text-align:left; vertical-align:top}\n          th{background:#f3f4f6; font-weight:600; position:sticky; top:0; z-index:1}\n          .nowrap{white-space:nowrap}\n          .target code{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace; white-space:pre-wrap}\n          .desc{max-width:380px}\n          tr:nth-child(even){background:#fbfbfb}\n          td.fail{color:#7b1e1e}\n          .impact.critical{background:var(--impact-critical); font-weight:600}\n          .impact.moderate{background:var(--impact-moderate); font-weight:600}\n          .impact.serious{background:var(--impact-serious); font-weight:600}\n          @media (max-width:900px){\n            .desc{max-width:200px}\n            table, thead, tbody, th, td, tr{display:block}\n            thead{display:none}\n            tr{margin-bottom:10px; border: 1px solid var(--border);}\n            td{border:1px solid var(--border); padding:6px}\n            td::before{font-weight:600; display:inline-block; width:120px}\n          }\n          .summary-list strong,\n          .summary-list li {\n            padding: 2px 4px;\n          }\n        </style>\n      </head>\n      <body>\n        <h1>Aria-Ease Accessibility Audit Report</h1>\n        '.concat(headerSummary, "\n        <table>\n          <thead>\n            <tr>\n              <th>URL</th><th>Rule</th><th>Impact</th><th>Description</th><th>Target</th><th>FailureSummary</th>\n            </tr>\n          </thead>\n          <tbody>\n            ").concat(rows.join("\n") || '<tr><td colspan="6"><em>No violations found.</em></td></tr>', "\n          </tbody>\n        </table>\n      </body>\n    </html>\n  ").trim();
    return html;
}
function escapeHTML(str) {
    return String(str !== null && str !== void 0 ? str : "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function escapeClass(s) {
    return String(s !== null && s !== void 0 ? s : "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
// bin/audit-cli.ts
var program = new Command();
program.name("aria-ease").description("Run accessibility tests and audits").version("2.1.1");
program.command("audit").description("Run axe-core powered accessibility audit on webpages").option("-u, --url <url>", "Single URL to audit").option("-f, --format <format>", "Output format for the audit report: json | csv | html", "all").option("-o, --out <path>", "Directory to save the audit report", "./accessibility-reports/audit").action(function(opts) {
    return _async_to_generator(function() {
        var _urls, _opts_audit, _config_audit, _config_audit1, _opts_audit1, configPath, config, _tmp, urls, format, allResults, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, url, result, error, err, hasResults;
        function createReport(format2) {
            return _async_to_generator(function() {
                var _config_audit, formatted, out, d, pad, timestamp, fileName, filePath;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            formatted = formatResults(allResults, format2);
                            out = ((_config_audit = config.audit) === null || _config_audit === void 0 ? void 0 : _config_audit.output) && config.audit.output.out || opts.audit.out;
                            return [
                                4,
                                fs.ensureDir(out)
                            ];
                        case 1:
                            _state.sent();
                            d = /* @__PURE__ */ new Date();
                            pad = function(n) {
                                return String(n).padStart(2, "0");
                            };
                            timestamp = "".concat(pad(d.getDate()), "-").concat(pad(d.getMonth() + 1), "-").concat(d.getFullYear(), " ").concat(pad(d.getHours()), ":").concat(pad(d.getMinutes()), ":").concat(pad(d.getSeconds()));
                            fileName = "ariaease-report-".concat(timestamp, ".").concat(format2);
                            filePath = path.join(out, fileName);
                            return [
                                4,
                                fs.writeFile(filePath, formatted, "utf-8")
                            ];
                        case 2:
                            _state.sent();
                            console.log(chalk.magentaBright("\uD83D\uDCC1 Report saved to ".concat(filePath)));
                            return [
                                2
                            ];
                    }
                });
            })();
        }
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
                    console.log(chalk.yellow("\u2139\uFE0F  No ariaease.config.js found at project root, using CLI configurations."));
                    _state.label = 6;
                case 6:
                    urls = [];
                    if ((_opts_audit = opts.audit) === null || _opts_audit === void 0 ? void 0 : _opts_audit.url) urls.push(opts.audit.url);
                    if (((_config_audit = config.audit) === null || _config_audit === void 0 ? void 0 : _config_audit.urls) && Array.isArray(config.audit.urls)) (_urls = urls).push.apply(_urls, _to_consumable_array(config.audit.urls));
                    format = ((_config_audit1 = config.audit) === null || _config_audit1 === void 0 ? void 0 : _config_audit1.output) && config.audit.output.format || ((_opts_audit1 = opts.audit) === null || _opts_audit1 === void 0 ? void 0 : _opts_audit1.format);
                    if (![
                        "json",
                        "csv",
                        "html",
                        "all"
                    ].includes(format)) {
                        console.log(chalk.red('\u274C Invalid format. Use "json", "csv", "html" or "all".'));
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
                    error = _state.sent();
                    if (_instanceof(error, Error) && error.message) {
                        console.log(chalk.red("❌ Failed auditing ".concat(url, ": ").concat(error.message)));
                    }
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
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
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
                    if ([
                        "json",
                        "csv",
                        "html"
                    ].includes(format)) {
                        createReport(format);
                    } else if (format === "all") {
                        [
                            "json",
                            "csv",
                            "html"
                        ].map(function(format2) {
                            createReport(format2);
                        });
                    }
                    console.log(chalk.green("\n\uD83C\uDF89 All audits completed."));
                    return [
                        2
                    ];
            }
        });
    })();
});
program.command("test").description("Run core a11y accessibility standard tests on UI components").option("-f, --format <format>", "Output format for the test report: json | csv | html", "html").option("-o, --out <path>", "Directory to save the test report", "./accessibility-reports/test").action(function() {
    console.log("Coming soon");
});
program.command("help").description("Display help information").action(function() {
    program.outputHelp();
});
program.parse(process.argv);
//# sourceMappingURL=audit-cli.js.map