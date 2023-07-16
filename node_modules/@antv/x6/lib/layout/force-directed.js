"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ForceDirected = void 0;
var common_1 = require("../common");
var util_1 = require("../util");
var ForceDirected = /** @class */ (function (_super) {
    __extends(ForceDirected, _super);
    function ForceDirected(options) {
        var _this = _super.call(this) || this;
        _this.options = __assign({ charge: 10, edgeDistance: 10, edgeStrength: 1 }, options);
        _this.nodes = _this.model.getNodes();
        _this.edges = _this.model.getEdges();
        _this.t = 1;
        _this.energy = Infinity;
        _this.progress = 0;
        return _this;
    }
    Object.defineProperty(ForceDirected.prototype, "model", {
        get: function () {
            return this.options.model;
        },
        enumerable: false,
        configurable: true
    });
    ForceDirected.prototype.start = function () {
        var _this = this;
        var x = this.options.x;
        var y = this.options.y;
        var width = this.options.width;
        var height = this.options.height;
        this.nodeData = {};
        this.edgeData = {};
        this.nodes.forEach(function (node) {
            var posX = util_1.NumberExt.random(x, x + width);
            var posY = util_1.NumberExt.random(y, y + height);
            node.position(posX, posY, { forceDirected: true });
            _this.nodeData[node.id] = {
                charge: node.prop('charge') || _this.options.charge,
                weight: node.prop('weight') || 1,
                x: posX,
                y: posY,
                px: posX,
                py: posY,
                fx: 0,
                fy: 0,
            };
        });
        this.edges.forEach(function (edge) {
            _this.edgeData[edge.id] = {
                source: edge.getSourceCell(),
                target: edge.getTargetCell(),
                strength: edge.prop('strength') || _this.options.edgeStrength,
                distance: edge.prop('distance') || _this.options.edgeDistance,
            };
        });
    };
    ForceDirected.prototype.step = function () {
        if (0.99 * this.t < 0.005) {
            return this.notifyEnd();
        }
        this.energy = 0;
        var xBefore = 0;
        var yBefore = 0;
        var xAfter = 0;
        var yAfter = 0;
        var nodeCount = this.nodes.length;
        var edgeCount = this.edges.length;
        for (var i = 0; i < nodeCount - 1; i += 1) {
            var v = this.nodeData[this.nodes[i].id];
            xBefore += v.x;
            yBefore += v.y;
            for (var j = i + 1; j < nodeCount; j += 1) {
                var u = this.nodeData[this.nodes[j].id];
                var dx = u.x - v.x;
                var dy = u.y - v.y;
                var distanceSquared = dx * dx + dy * dy;
                // const distance = Math.sqrt(distanceSquared)
                var fr = (this.t * v.charge) / distanceSquared;
                var fx = fr * dx;
                var fy = fr * dy;
                v.fx -= fx;
                v.fy -= fy;
                u.fx += fx;
                u.fy += fy;
                this.energy += fx * fx + fy * fy;
            }
        }
        // Add the last node positions as it couldn't be done in the loops above.
        var last = this.nodeData[this.nodes[nodeCount - 1].id];
        xBefore += last.x;
        yBefore += last.y;
        // Calculate attractive forces.
        for (var i = 0; i < edgeCount; i += 1) {
            var a = this.edgeData[this.edges[i].id];
            var v = this.nodeData[a.source.id];
            var u = this.nodeData[a.target.id];
            var dx = u.x - v.x;
            var dy = u.y - v.y;
            var distanceSquared = dx * dx + dy * dy;
            var distance = Math.sqrt(distanceSquared);
            var fa = (this.t * a.strength * (distance - a.distance)) / distance;
            var fx = fa * dx;
            var fy = fa * dy;
            var k = v.weight / (v.weight + u.weight);
            v.x += fx * (1 - k);
            v.y += fy * (1 - k);
            u.x -= fx * k;
            u.y -= fy * k;
            this.energy += fx * fx + fy * fy;
        }
        var x = this.options.x;
        var y = this.options.y;
        var w = this.options.width;
        var h = this.options.height;
        var gravityCenter = this.options.gravityCenter;
        var gravity = 0.1;
        var energyBefore = this.energy;
        // Set positions on nodes.
        for (var i = 0; i < nodeCount; i += 1) {
            var node = this.nodes[i];
            var data = this.nodeData[node.id];
            var pos = {
                x: data.x,
                y: data.y,
            };
            if (gravityCenter) {
                pos.x += (gravityCenter.x - pos.x) * this.t * gravity;
                pos.y += (gravityCenter.y - pos.y) * this.t * gravity;
            }
            pos.x += data.fx;
            pos.y += data.fy;
            // Make sure positions don't go out of the graph area.
            pos.x = Math.max(x, Math.min(x + w, pos.x));
            pos.y = Math.max(y, Math.min(x + h, pos.y));
            // Position Verlet integration.
            var friction = 0.9;
            pos.x += friction * (data.px - pos.x);
            pos.y += friction * (data.py - pos.y);
            data.px = pos.x;
            data.py = pos.y;
            data.fx = 0;
            data.fy = 0;
            data.x = pos.x;
            data.y = pos.y;
            xAfter += data.x;
            yAfter += data.y;
            node.setPosition(pos, { forceDirected: true });
        }
        this.t = this.cool(this.t, this.energy, energyBefore);
        // If the global distance hasn't change much, the layout converged
        // and therefore trigger the `end` event.
        var gdx = xBefore - xAfter;
        var gdy = yBefore - yAfter;
        var gd = Math.sqrt(gdx * gdx + gdy * gdy);
        if (gd < 1) {
            this.notifyEnd();
        }
    };
    ForceDirected.prototype.cool = function (t, energy, energyBefore) {
        if (energy < energyBefore) {
            this.progress += 1;
            if (this.progress >= 5) {
                this.progress = 0;
                return t / 0.99; // Warm up.
            }
        }
        else {
            this.progress = 0;
            return t * 0.99; // Cool down.
        }
        return t; // Keep the same temperature.
    };
    ForceDirected.prototype.notifyEnd = function () {
        this.trigger('end');
    };
    return ForceDirected;
}(common_1.Events));
exports.ForceDirected = ForceDirected;
//# sourceMappingURL=force-directed.js.map