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
exports.HeaderedRect = void 0;
var node_1 = require("../../model/node");
var base_1 = require("../base");
exports.HeaderedRect = node_1.Node.define({
    shape: 'rect-headered',
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        {
            tagName: 'rect',
            selector: 'header',
        },
        {
            tagName: 'text',
            selector: 'headerText',
        },
        {
            tagName: 'text',
            selector: 'bodyText',
        },
    ],
    attrs: {
        body: __assign(__assign({}, base_1.Base.bodyAttr), { refWidth: '100%', refHeight: '100%' }),
        header: __assign(__assign({}, base_1.Base.bodyAttr), { refWidth: '100%', height: 30, stroke: '#000000' }),
        headerText: __assign(__assign({}, base_1.Base.labelAttr), { refX: '50%', refY: 15, fontSize: 16 }),
        bodyText: __assign(__assign({}, base_1.Base.labelAttr), { refY2: 15 }),
    },
});
//# sourceMappingURL=rect-headered.js.map