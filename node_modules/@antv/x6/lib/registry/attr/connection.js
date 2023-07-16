"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atConnectionRatio = exports.atConnectionLength = exports.atConnectionRatioIgnoreGradient = exports.atConnectionRatioKeepGradient = exports.atConnectionLengthIgnoreGradient = exports.atConnectionLengthKeepGradient = exports.connection = void 0;
var isEdgeView = function (val, _a) {
    var view = _a.view;
    return view.cell.isEdge();
};
exports.connection = {
    qualify: isEdgeView,
    set: function (val, args) {
        var _a, _b, _c, _d;
        var view = args.view;
        var reverse = (val.reverse || false);
        var stubs = (val.stubs || 0);
        var d;
        if (Number.isFinite(stubs) && stubs !== 0) {
            if (!reverse) {
                var offset = void 0;
                if (stubs < 0) {
                    var len = view.getConnectionLength() || 0;
                    offset = (len + stubs) / 2;
                }
                else {
                    offset = stubs;
                }
                var path = view.getConnection();
                if (path) {
                    var sourceParts = path.divideAtLength(offset);
                    var targetParts = path.divideAtLength(-offset);
                    if (sourceParts && targetParts) {
                        d = sourceParts[0].serialize() + " " + targetParts[1].serialize();
                    }
                }
            }
            else {
                var offset = void 0;
                var length_1;
                var len = view.getConnectionLength() || 0;
                if (stubs < 0) {
                    offset = (len + stubs) / 2;
                    length_1 = -stubs;
                }
                else {
                    offset = stubs;
                    length_1 = len - stubs * 2;
                }
                var path = view.getConnection();
                d = (_d = (_c = (_b = (_a = path === null || path === void 0 ? void 0 : path.divideAtLength(offset)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.divideAtLength(length_1)) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.serialize();
            }
        }
        return { d: d || view.getConnectionPathData() };
    },
};
exports.atConnectionLengthKeepGradient = {
    qualify: isEdgeView,
    set: atConnectionWrapper('getTangentAtLength', { rotate: true }),
};
exports.atConnectionLengthIgnoreGradient = {
    qualify: isEdgeView,
    set: atConnectionWrapper('getTangentAtLength', { rotate: false }),
};
exports.atConnectionRatioKeepGradient = {
    qualify: isEdgeView,
    set: atConnectionWrapper('getTangentAtRatio', { rotate: true }),
};
exports.atConnectionRatioIgnoreGradient = {
    qualify: isEdgeView,
    set: atConnectionWrapper('getTangentAtRatio', { rotate: false }),
};
// aliases
// -------
exports.atConnectionLength = exports.atConnectionLengthKeepGradient;
exports.atConnectionRatio = exports.atConnectionRatioKeepGradient;
// utils
// -----
function atConnectionWrapper(method, options) {
    var zeroVector = { x: 1, y: 0 };
    return function (value, args) {
        var p;
        var angle;
        var view = args.view;
        var tangent = view[method](Number(value));
        if (tangent) {
            angle = options.rotate ? tangent.vector().vectorAngle(zeroVector) : 0;
            p = tangent.start;
        }
        else {
            p = view.path.start;
            angle = 0;
        }
        if (angle === 0) {
            return { transform: "translate(" + p.x + "," + p.y + "')" };
        }
        return {
            transform: "translate(" + p.x + "," + p.y + "') rotate(" + angle + ")",
        };
    };
}
//# sourceMappingURL=connection.js.map