"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.absolute = void 0;
var util_1 = require("./util");
var absolute = function (portsPositionArgs, elemBBox) {
    return portsPositionArgs.map(function (_a) {
        var x = _a.x, y = _a.y, angle = _a.angle;
        return (0, util_1.toResult)((0, util_1.normalizePoint)(elemBBox, { x: x, y: y }), angle || 0);
    });
};
exports.absolute = absolute;
//# sourceMappingURL=absolute.js.map