"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
var util_1 = require("../../util");
exports.filter = {
    qualify: util_1.ObjectExt.isPlainObject,
    set: function (filter, _a) {
        var view = _a.view;
        return "url(#" + view.graph.defineFilter(filter) + ")";
    },
};
//# sourceMappingURL=filter.js.map