"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.html = void 0;
exports.html = {
    set: function (html, _a) {
        var view = _a.view, elem = _a.elem;
        view.$(elem).html("" + html);
    },
};
//# sourceMappingURL=html.js.map