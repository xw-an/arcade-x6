"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgePreset = void 0;
var EdgePreset = /** @class */ (function () {
    function EdgePreset(halo) {
        this.halo = halo;
    }
    Object.defineProperty(EdgePreset.prototype, "options", {
        get: function () {
            return this.halo.options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EdgePreset.prototype, "graph", {
        get: function () {
            return this.halo.graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EdgePreset.prototype, "model", {
        get: function () {
            return this.halo.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EdgePreset.prototype, "view", {
        get: function () {
            return this.halo.view;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EdgePreset.prototype, "cell", {
        get: function () {
            return this.halo.cell;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EdgePreset.prototype, "edge", {
        get: function () {
            return this.cell;
        },
        enumerable: false,
        configurable: true
    });
    EdgePreset.prototype.getPresets = function () {
        return {
            className: 'type-edge',
            handles: [
                {
                    name: 'remove',
                    position: 'nw',
                    icon: null,
                    events: {
                        mousedown: this.removeEdge.bind(this),
                    },
                },
                {
                    name: 'direction',
                    position: 'se',
                    icon: null,
                    events: {
                        mousedown: this.directionSwap.bind(this),
                    },
                },
            ],
            content: false,
            bbox: function (view) {
                return view.graph.localToGraph(view.getPointAtRatio(0.5));
            },
            tinyThreshold: -1,
            smallThreshold: -1,
        };
    };
    EdgePreset.prototype.removeEdge = function () {
        this.cell.remove();
    };
    EdgePreset.prototype.directionSwap = function () {
        var source = this.edge.getSource();
        var target = this.edge.getTarget();
        this.edge.prop({
            source: target,
            target: source,
        });
    };
    return EdgePreset;
}());
exports.EdgePreset = EdgePreset;
//# sourceMappingURL=edge-preset.js.map