"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opacity = void 0;
var util_1 = require("../../util");
var global_1 = require("../../global");
var className = global_1.Util.prefix('highlight-opacity');
exports.opacity = {
    highlight: function (cellView, magnet) {
        util_1.Dom.addClass(magnet, className);
    },
    unhighlight: function (cellView, magnetEl) {
        util_1.Dom.removeClass(magnetEl, className);
    },
};
//# sourceMappingURL=opacity.js.map