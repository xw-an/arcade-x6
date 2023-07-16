"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleEdge = void 0;
var edge_1 = require("../../model/edge");
exports.DoubleEdge = edge_1.Edge.define({
    shape: 'double-edge',
    markup: [
        {
            tagName: 'path',
            selector: 'outline',
            attrs: {
                fill: 'none',
            },
        },
        {
            tagName: 'path',
            selector: 'line',
            attrs: {
                fill: 'none',
                cursor: 'pointer',
            },
        },
    ],
    attrs: {
        line: {
            connection: true,
            stroke: '#dddddd',
            strokeWidth: 4,
            strokeLinejoin: 'round',
            targetMarker: {
                tagName: 'path',
                stroke: '#000000',
                d: 'M 10 -3 10 -10 -2 0 10 10 10 3',
            },
        },
        outline: {
            connection: true,
            stroke: '#000000',
            strokeWidth: 6,
            strokeLinejoin: 'round',
        },
    },
});
//# sourceMappingURL=edge-doubled.js.map