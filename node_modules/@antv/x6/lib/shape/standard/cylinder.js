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
exports.Cylinder = void 0;
var util_1 = require("../../util");
var base_1 = require("../base");
var CYLINDER_TILT = 10;
exports.Cylinder = base_1.Base.define({
    shape: 'cylinder',
    overwrite: true,
    markup: [
        {
            tagName: 'path',
            selector: 'body',
        },
        {
            tagName: 'ellipse',
            selector: 'top',
        },
        {
            tagName: 'text',
            selector: 'label',
        },
    ],
    attrs: {
        body: __assign(__assign({}, base_1.Base.bodyAttr), { lateral: CYLINDER_TILT }),
        top: __assign(__assign({}, base_1.Base.bodyAttr), { refCx: '50%', refRx: '50%', cy: CYLINDER_TILT, ry: CYLINDER_TILT }),
    },
    attrHooks: {
        lateral: {
            set: function (t, _a) {
                var refBBox = _a.refBBox;
                var isPercentage = util_1.NumberExt.isPercentage(t);
                if (isPercentage) {
                    // eslint-disable-next-line
                    t = parseFloat(t) / 100;
                }
                var x = refBBox.x;
                var y = refBBox.y;
                var w = refBBox.width;
                var h = refBBox.height;
                // curve control point variables
                var rx = w / 2;
                var ry = isPercentage ? h * t : t;
                var kappa = 0.551784;
                var cx = kappa * rx;
                var cy = kappa * ry;
                // shape variables
                var xLeft = x;
                var xCenter = x + w / 2;
                var xRight = x + w;
                var ySideTop = y + ry;
                var yCurveTop = ySideTop - ry;
                var ySideBottom = y + h - ry;
                var yCurveBottom = y + h;
                // return calculated shape
                var data = [
                    'M',
                    xLeft,
                    ySideTop,
                    'L',
                    xLeft,
                    ySideBottom,
                    'C',
                    x,
                    ySideBottom + cy,
                    xCenter - cx,
                    yCurveBottom,
                    xCenter,
                    yCurveBottom,
                    'C',
                    xCenter + cx,
                    yCurveBottom,
                    xRight,
                    ySideBottom + cy,
                    xRight,
                    ySideBottom,
                    'L',
                    xRight,
                    ySideTop,
                    'C',
                    xRight,
                    ySideTop - cy,
                    xCenter + cx,
                    yCurveTop,
                    xCenter,
                    yCurveTop,
                    'C',
                    xCenter - cx,
                    yCurveTop,
                    xLeft,
                    ySideTop - cy,
                    xLeft,
                    ySideTop,
                    'Z',
                ];
                return { d: data.join(' ') };
            },
        },
    },
    knob: {
        enabled: true,
        position: function (_a) {
            var node = _a.node;
            var lateral = node.attr('body/lateral');
            return { x: 0, y: lateral };
        },
        onMouseMove: function (_a) {
            var node = _a.node, data = _a.data, deltaY = _a.deltaY;
            if (deltaY !== 0) {
                var bbox = node.getBBox();
                var previous = node.attr('body/lateral');
                if (data.round == null) {
                    data.round = previous;
                }
                var min = 0;
                var max = bbox.height / 2;
                var current = util_1.NumberExt.clamp(data.round + deltaY, min, max);
                if (current !== previous) {
                    node.attr({
                        body: { lateral: current },
                        top: {
                            cy: current,
                            ry: current,
                        },
                    });
                }
            }
        },
    },
});
//# sourceMappingURL=cylinder.js.map