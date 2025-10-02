var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
export function runAudit(url) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, context, page, axe, axeResults, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chromium.launch({ headless: true })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newContext()];
                case 2:
                    context = _a.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle' })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    axe = new AxeBuilder({ page: page });
                    return [4 /*yield*/, axe.analyze()];
                case 6:
                    axeResults = _a.sent();
                    //console.log("--- AXE-CORE VIOLATIONS RESULTS ---");
                    //const violations = axeResults.violations.filter(v => v.nodes.length > 0);
                    /* console.log(JSON.stringify(violations, null, 2));
            
            
                    console.log("--- EACH AXE-CORE VIOLATION ---");
            
                    violations.forEach(v => {
                        console.log(`\nRule: ${v.id}`);
                        console.log(`Impact: ${v.impact}`);
                        console.log(`Description: ${v.description}`);
            
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        v.nodes.forEach((n: any) => {
                            console.log(`  → Target: ${n.target}`);
                            console.log(`    Failure: ${n.failureSummary}`);
                        });
                    });
            
            
                    const snapshot = await page.accessibility.snapshot();
                    console.log("\n--- PLAYWRIGHT SNAPSHOT ---");
                    console.log(snapshot); */
                    return [2 /*return*/, axeResults];
                case 7:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 8];
                case 8: return [4 /*yield*/, browser.close()];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
