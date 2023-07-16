"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rhombus = void 0;
var path_1 = require("./path");
var util_1 = require("./util");
exports.Rhombus = (0, util_1.createShape)('rhombus', {
    d: 'M 30 0 L 60 30 30 60 0 30 z',
    attrs: {
        text: {
            refY: 0.5,
            refDy: null,
        },
    },
}, {
    parent: path_1.Path,
    ignoreMarkup: true,
});
//# sourceMappingURL=rhombus.js.map