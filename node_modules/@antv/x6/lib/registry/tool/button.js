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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("../../util");
var tool_1 = require("../../view/tool");
var Util = __importStar(require("./util"));
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Button.prototype.onRender = function () {
        util_1.Dom.addClass(this.container, this.prefixClassName('cell-tool-button'));
        this.update();
    };
    Button.prototype.update = function () {
        this.updatePosition();
        return this;
    };
    Button.prototype.updatePosition = function () {
        var view = this.cellView;
        var matrix = view.cell.isEdge()
            ? this.getEdgeMatrix()
            : this.getNodeMatrix();
        util_1.Dom.transform(this.container, matrix, { absolute: true });
    };
    Button.prototype.getNodeMatrix = function () {
        var view = this.cellView;
        var options = this.options;
        var _a = options.x, x = _a === void 0 ? 0 : _a, _b = options.y, y = _b === void 0 ? 0 : _b;
        var offset = options.offset, useCellGeometry = options.useCellGeometry, rotate = options.rotate;
        var bbox = Util.getViewBBox(view, useCellGeometry);
        var angle = view.cell.getAngle();
        if (!rotate) {
            bbox = bbox.bbox(angle);
        }
        var offsetX = 0;
        var offsetY = 0;
        if (typeof offset === 'number') {
            offsetX = offset;
            offsetY = offset;
        }
        else if (typeof offset === 'object') {
            offsetX = offset.x;
            offsetY = offset.y;
        }
        x = util_1.NumberExt.normalizePercentage(x, bbox.width);
        y = util_1.NumberExt.normalizePercentage(y, bbox.height);
        var matrix = util_1.Dom.createSVGMatrix().translate(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        if (rotate) {
            matrix = matrix.rotate(angle);
        }
        matrix = matrix.translate(x + offsetX - bbox.width / 2, y + offsetY - bbox.height / 2);
        return matrix;
    };
    Button.prototype.getEdgeMatrix = function () {
        var view = this.cellView;
        var options = this.options;
        var _a = options.offset, offset = _a === void 0 ? 0 : _a, _b = options.distance, distance = _b === void 0 ? 0 : _b, rotate = options.rotate;
        var tangent;
        var position;
        var angle;
        var d = util_1.NumberExt.normalizePercentage(distance, 1);
        if (d >= 0 && d <= 1) {
            tangent = view.getTangentAtRatio(d);
        }
        else {
            tangent = view.getTangentAtLength(d);
        }
        if (tangent) {
            position = tangent.start;
            angle = tangent.vector().vectorAngle(new geometry_1.Point(1, 0)) || 0;
        }
        else {
            position = view.getConnection().start;
            angle = 0;
        }
        var matrix = util_1.Dom.createSVGMatrix()
            .translate(position.x, position.y)
            .rotate(angle);
        if (typeof offset === 'object') {
            matrix = matrix.translate(offset.x || 0, offset.y || 0);
        }
        else {
            matrix = matrix.translate(0, offset);
        }
        if (!rotate) {
            matrix = matrix.rotate(-angle);
        }
        return matrix;
    };
    Button.prototype.onMouseDown = function (e) {
        if (this.guard(e)) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        var onClick = this.options.onClick;
        if (typeof onClick === 'function') {
            util_1.FunctionExt.call(onClick, this.cellView, {
                e: e,
                view: this.cellView,
                cell: this.cellView.cell,
                btn: this,
            });
        }
    };
    return Button;
}(tool_1.ToolsView.ToolItem));
exports.Button = Button;
(function (Button) {
    Button.config({
        name: 'button',
        events: {
            mousedown: 'onMouseDown',
            touchstart: 'onMouseDown',
        },
    });
})(Button = exports.Button || (exports.Button = {}));
exports.Button = Button;
(function (Button) {
    Button.Remove = Button.define({
        name: 'button-remove',
        markup: [
            {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                    r: 7,
                    fill: '#FF1D00',
                    cursor: 'pointer',
                },
            },
            {
                tagName: 'path',
                selector: 'icon',
                attrs: {
                    d: 'M -3 -3 3 3 M -3 3 3 -3',
                    fill: 'none',
                    stroke: '#FFFFFF',
                    'stroke-width': 2,
                    'pointer-events': 'none',
                },
            },
        ],
        distance: 60,
        offset: 0,
        onClick: function (_a) {
            var view = _a.view, btn = _a.btn;
            btn.parent.remove();
            view.cell.remove({ ui: true, toolId: btn.cid });
        },
    });
})(Button = exports.Button || (exports.Button = {}));
exports.Button = Button;
//# sourceMappingURL=button.js.map