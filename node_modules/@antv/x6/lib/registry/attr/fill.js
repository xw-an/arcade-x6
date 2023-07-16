"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fill = void 0;
var util_1 = require("../../util");
exports.fill = {
    qualify: util_1.ObjectExt.isPlainObject,
    set: function (fill, _a) {
        var view = _a.view;
        return "url(#" + view.graph.defineGradient(fill) + ")";
    },
};
//# sourceMappingURL=fill.js.map