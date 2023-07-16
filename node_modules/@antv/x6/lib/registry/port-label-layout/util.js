"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toResult = void 0;
var util_1 = require("../../util");
var defaults = {
    position: { x: 0, y: 0 },
    angle: 0,
    attrs: {
        '.': {
            y: '0',
            'text-anchor': 'start',
        },
    },
};
function toResult(preset, args) {
    var _a = args || {}, x = _a.x, y = _a.y, angle = _a.angle, attrs = _a.attrs;
    return util_1.ObjectExt.defaultsDeep({}, { angle: angle, attrs: attrs, position: { x: x, y: y } }, preset, defaults);
}
exports.toResult = toResult;
//# sourceMappingURL=util.js.map