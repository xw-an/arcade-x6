"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.style = void 0;
var util_1 = require("../../util");
exports.style = {
    qualify: util_1.ObjectExt.isPlainObject,
    set: function (styles, _a) {
        var view = _a.view, elem = _a.elem;
        view.$(elem).css(styles);
    },
};
//# sourceMappingURL=style.js.map