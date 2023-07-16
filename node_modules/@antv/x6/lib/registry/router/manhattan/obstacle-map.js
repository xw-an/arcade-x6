"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObstacleMap = void 0;
var util_1 = require("../../../util");
var geometry_1 = require("../../../geometry");
/**
 * Helper structure to identify whether a point lies inside an obstacle.
 */
var ObstacleMap = /** @class */ (function () {
    function ObstacleMap(options) {
        this.options = options;
        this.mapGridSize = 100;
        this.map = {};
    }
    /**
     * Builds a map of all nodes for quicker obstacle queries i.e. is a point
     * contained in any obstacle?
     *
     * A simplified grid search.
     */
    ObstacleMap.prototype.build = function (model, edge) {
        var options = this.options;
        // source or target node could be excluded from set of obstacles
        var excludedTerminals = options.excludeTerminals.reduce(function (memo, type) {
            var terminal = edge[type];
            if (terminal) {
                var cell = model.getCell(terminal.cell);
                if (cell) {
                    memo.push(cell);
                }
            }
            return memo;
        }, []);
        var excludedAncestors = [];
        var source = model.getCell(edge.getSourceCellId());
        if (source) {
            excludedAncestors = util_1.ArrayExt.union(excludedAncestors, source.getAncestors().map(function (cell) { return cell.id; }));
        }
        var target = model.getCell(edge.getTargetCellId());
        if (target) {
            excludedAncestors = util_1.ArrayExt.union(excludedAncestors, target.getAncestors().map(function (cell) { return cell.id; }));
        }
        // The graph is divided into smaller cells, where each holds information
        // about which node belong to it. When we query whether a point lies
        // inside an obstacle we don't need to go through all obstacles, we check
        // only those in a particular cell.
        var mapGridSize = this.mapGridSize;
        model.getNodes().reduce(function (map, node) {
            var shape = node.shape;
            var excludeShapes = options.excludeShapes;
            var excType = shape ? excludeShapes.includes(shape) : false;
            var excTerminal = excludedTerminals.some(function (cell) { return cell.id === node.id; });
            var excludedNode = options.excludeNodes.some(function (item) {
                if (typeof item === 'string') {
                    return node.id === item;
                }
                return item === node;
            });
            var excAncestor = excludedAncestors.includes(node.id);
            var excHidden = options.excludeHiddenNodes && !node.isVisible();
            var excluded = excType || excTerminal || excludedNode || excAncestor || excHidden;
            if (!excluded) {
                var bbox = node.getBBox().moveAndExpand(options.paddingBox);
                var origin_1 = bbox.getOrigin().snapToGrid(mapGridSize);
                var corner = bbox.getCorner().snapToGrid(mapGridSize);
                for (var x = origin_1.x; x <= corner.x; x += mapGridSize) {
                    for (var y = origin_1.y; y <= corner.y; y += mapGridSize) {
                        var key = new geometry_1.Point(x, y).toString();
                        if (map[key] == null) {
                            map[key] = [];
                        }
                        map[key].push(bbox);
                    }
                }
            }
            return map;
        }, this.map);
        return this;
    };
    ObstacleMap.prototype.isAccessible = function (point) {
        var key = point.clone().snapToGrid(this.mapGridSize).toString();
        var rects = this.map[key];
        return rects ? rects.every(function (rect) { return !rect.containsPoint(point); }) : true;
    };
    return ObstacleMap;
}());
exports.ObstacleMap = ObstacleMap;
//# sourceMappingURL=obstacle-map.js.map