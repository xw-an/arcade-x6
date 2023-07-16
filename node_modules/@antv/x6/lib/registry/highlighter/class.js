"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.className = void 0;
var util_1 = require("../../util");
var global_1 = require("../../global");
var defaultClassName = global_1.Util.prefix('highlighted');
exports.className = {
    highlight: function (cellView, magnet, options) {
        var cls = (options && options.className) || defaultClassName;
        util_1.Dom.addClass(magnet, cls);
    },
    unhighlight: function (cellView, magnet, options) {
        var cls = (options && options.className) || defaultClassName;
        util_1.Dom.removeClass(magnet, cls);
    },
};
//# sourceMappingURL=class.js.map