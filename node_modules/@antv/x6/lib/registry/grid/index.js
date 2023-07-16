"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
var util_1 = require("../../util");
var registry_1 = require("../registry");
var patterns = __importStar(require("./main"));
var Grid = /** @class */ (function () {
    function Grid() {
        this.patterns = {};
        this.root = util_1.Vector.create(util_1.Dom.createSvgDocument(), {
            width: '100%',
            height: '100%',
        }, [util_1.Dom.createSvgElement('defs')]).node;
    }
    Grid.prototype.add = function (id, elem) {
        var firstChild = this.root.childNodes[0];
        if (firstChild) {
            firstChild.appendChild(elem);
        }
        this.patterns[id] = elem;
        util_1.Vector.create('rect', {
            width: '100%',
            height: '100%',
            fill: "url(#" + id + ")",
        }).appendTo(this.root);
    };
    Grid.prototype.get = function (id) {
        return this.patterns[id];
    };
    Grid.prototype.has = function (id) {
        return this.patterns[id] != null;
    };
    return Grid;
}());
exports.Grid = Grid;
(function (Grid) {
    Grid.presets = patterns;
    Grid.registry = registry_1.Registry.create({
        type: 'grid',
    });
    Grid.registry.register(Grid.presets, true);
})(Grid = exports.Grid || (exports.Grid = {}));
exports.Grid = Grid;
//# sourceMappingURL=index.js.map