"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSelection = void 0;
exports.clearSelection = (function () {
    var doc = document;
    if (doc.selection) {
        return function () {
            doc.selection.empty();
        };
    }
    if (window.getSelection) {
        return function () {
            var selection = window.getSelection();
            if (selection) {
                if (selection.empty) {
                    selection.empty();
                }
                else if (selection.removeAllRanges) {
                    selection.removeAllRanges();
                }
            }
        };
    }
    return function () { };
})();
//# sourceMappingURL=selection.js.map