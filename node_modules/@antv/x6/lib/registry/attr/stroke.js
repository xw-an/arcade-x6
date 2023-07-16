"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stroke = void 0;
var util_1 = require("../../util");
exports.stroke = {
    qualify: util_1.ObjectExt.isPlainObject,
    set: function (stroke, _a) {
        var view = _a.view;
        var cell = view.cell;
        var options = __assign({}, stroke);
        if (cell.isEdge() && options.type === 'linearGradient') {
            var edgeView = view;
            var source = edgeView.sourcePoint;
            var target = edgeView.targetPoint;
            options.id = "gradient-" + options.type + "-" + cell.id;
            options.attrs = __assign(__assign({}, options.attrs), { x1: source.x, y1: source.y, x2: target.x, y2: target.y, gradientUnits: 'userSpaceOnUse' });
            view.graph.defs.remove(options.id);
        }
        return "url(#" + view.graph.defineGradient(options) + ")";
    },
};
//# sourceMappingURL=stroke.js.map