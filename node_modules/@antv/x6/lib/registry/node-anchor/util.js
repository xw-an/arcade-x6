"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPointAtEdge = exports.resolve = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
// eslint-disable-next-line
function resolve(fn) {
    return function (view, magnet, ref, options) {
        if (ref instanceof Element) {
            var refView = this.graph.renderer.findViewByElem(ref);
            var refPoint = void 0;
            if (refView) {
                if (refView.isEdgeElement(ref)) {
                    var distance = options.fixedAt != null ? options.fixedAt : '50%';
                    refPoint = getPointAtEdge(refView, distance);
                }
                else {
                    refPoint = refView.getBBoxOfElement(ref).getCenter();
                }
            }
            else {
                refPoint = new geometry_1.Point();
            }
            return fn.call(this, view, magnet, refPoint, options);
        }
        return fn.apply(this, arguments); // eslint-disable-line
    };
}
exports.resolve = resolve;
function getPointAtEdge(edgeView, value) {
    var isPercentage = util_1.NumberExt.isPercentage(value);
    var num = typeof value === 'string' ? parseFloat(value) : value;
    if (isPercentage) {
        return edgeView.getPointAtRatio(num / 100);
    }
    return edgeView.getPointAtLength(num);
}
exports.getPointAtEdge = getPointAtEdge;
//# sourceMappingURL=util.js.map