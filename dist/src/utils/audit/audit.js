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
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
// src/utils/audit/audit.ts
function runAudit(url) {
    return _async_to_generator(function() {
        var browser, context, page, axe, axeResults, error;
        return _ts_generator(this, function(_state) {
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
                    if (_instanceof(error, Error)) {
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
export { runAudit }; //# sourceMappingURL=audit.js.map
//# sourceMappingURL=audit.js.map