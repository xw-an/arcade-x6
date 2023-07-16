"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = void 0;
function notify(name, evt, view, args) {
    if (args === void 0) { args = {}; }
    if (view) {
        var graph = view.graph;
        var e = graph.view.normalizeEvent(evt);
        var localPoint = graph.snapToGrid(e.clientX, e.clientY);
        view.notify(name, __assign({ e: e, view: view, node: view.cell, cell: view.cell, x: localPoint.x, y: localPoint.y }, args));
    }
}
exports.notify = notify;
//# sourceMappingURL=util.js.map