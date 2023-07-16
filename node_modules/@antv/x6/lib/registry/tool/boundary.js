"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boundary = void 0;
var util_1 = require("../../util");
var tool_1 = require("../../view/tool");
var Util = __importStar(require("./util"));
var Boundary = /** @class */ (function (_super) {
    __extends(Boundary, _super);
    function Boundary() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Boundary.prototype.onRender = function () {
        util_1.Dom.addClass(this.container, this.prefixClassName('cell-tool-boundary'));
        if (this.options.attrs) {
            var _a = this.options.attrs, className = _a.class, attrs = __rest(_a, ["class"]);
            util_1.Dom.attr(this.container, util_1.Dom.kebablizeAttrs(attrs));
            if (className) {
                util_1.Dom.addClass(this.container, className);
            }
        }
        this.update();
    };
    Boundary.prototype.update = function () {
        var view = this.cellView;
        var options = this.options;
        var useCellGeometry = options.useCellGeometry, rotate = options.rotate;
        var padding = util_1.NumberExt.normalizeSides(options.padding);
        var bbox = Util.getViewBBox(view, useCellGeometry).moveAndExpand({
            x: -padding.left,
            y: -padding.top,
            width: padding.left + padding.right,
            height: padding.top + padding.bottom,
        });
        var cell = view.cell;
        if (cell.isNode()) {
            var angle = cell.getAngle();
            if (angle) {
                if (rotate) {
                    var origin_1 = cell.getBBox().getCenter();
                    util_1.Dom.rotate(this.container, angle, origin_1.x, origin_1.y, {
                        absolute: true,
                    });
                }
                else {
                    bbox = bbox.bbox(angle);
                }
            }
        }
        util_1.Dom.attr(this.container, bbox.toJSON());
        return this;
    };
    return Boundary;
}(tool_1.ToolsView.ToolItem));
exports.Boundary = Boundary;
(function (Boundary) {
    Boundary.config({
        name: 'boundary',
        tagName: 'rect',
        padding: 10,
        attrs: {
            fill: 'none',
            stroke: '#333',
            'stroke-width': 0.5,
            'stroke-dasharray': '5, 5',
            'pointer-events': 'none',
        },
    });
})(Boundary = exports.Boundary || (exports.Boundary = {}));
exports.Boundary = Boundary;
//# sourceMappingURL=boundary.js.map