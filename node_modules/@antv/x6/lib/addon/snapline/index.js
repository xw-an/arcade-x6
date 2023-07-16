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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snapline = void 0;
var geometry_1 = require("../../geometry");
var util_1 = require("../../util");
var vector_1 = require("../../util/vector");
var view_1 = require("../../view/view");
var Snapline = /** @class */ (function (_super) {
    __extends(Snapline, _super);
    function Snapline(options) {
        var _this = _super.call(this) || this;
        var graph = options.graph, others = __rest(options, ["graph"]);
        _this.graph = graph;
        _this.options = __assign({ tolerance: 10 }, others);
        _this.offset = { x: 0, y: 0 };
        _this.render();
        _this.parseFilter();
        if (!_this.disabled) {
            _this.startListening();
        }
        return _this;
    }
    Object.defineProperty(Snapline.prototype, "model", {
        get: function () {
            return this.graph.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snapline.prototype, "containerClassName", {
        get: function () {
            return this.prefixClassName('widget-snapline');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snapline.prototype, "verticalClassName", {
        get: function () {
            return this.containerClassName + "-vertical";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snapline.prototype, "horizontalClassName", {
        get: function () {
            return this.containerClassName + "-horizontal";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Snapline.prototype, "disabled", {
        get: function () {
            return (this.options.enabled !== true ||
                this.graph.options.snapline.enabled !== true);
        },
        enumerable: false,
        configurable: true
    });
    Snapline.prototype.enable = function () {
        if (this.disabled) {
            this.options.enabled = true;
            this.graph.options.snapline.enabled = true;
            this.startListening();
        }
    };
    Snapline.prototype.disable = function () {
        if (!this.disabled) {
            this.options.enabled = false;
            this.graph.options.snapline.enabled = false;
            this.stopListening();
        }
    };
    Snapline.prototype.setFilter = function (filter) {
        this.options.filter = filter;
        this.parseFilter();
    };
    Snapline.prototype.render = function () {
        var container = (this.containerWrapper = new vector_1.Vector('svg'));
        var horizontal = (this.horizontal = new vector_1.Vector('line'));
        var vertical = (this.vertical = new vector_1.Vector('line'));
        container.addClass(this.containerClassName);
        horizontal.addClass(this.horizontalClassName);
        vertical.addClass(this.verticalClassName);
        container.setAttribute('width', '100%');
        container.setAttribute('height', '100%');
        horizontal.setAttribute('display', 'none');
        vertical.setAttribute('display', 'none');
        container.append([horizontal, vertical]);
        if (this.options.className) {
            container.addClass(this.options.className);
        }
        this.container = this.containerWrapper.node;
    };
    Snapline.prototype.startListening = function () {
        this.stopListening();
        this.graph.on('node:mousedown', this.captureCursorOffset, this);
        this.graph.on('node:mousemove', this.snapOnMoving, this);
        this.model.on('batch:stop', this.onBatchStop, this);
        this.delegateDocumentEvents({
            mouseup: 'hide',
            touchend: 'hide',
        });
    };
    Snapline.prototype.stopListening = function () {
        this.graph.off('node:mousedown', this.captureCursorOffset, this);
        this.graph.off('node:mousemove', this.snapOnMoving, this);
        this.model.off('batch:stop', this.onBatchStop, this);
        this.undelegateDocumentEvents();
    };
    Snapline.prototype.parseFilter = function () {
        var _this = this;
        this.filterShapes = {};
        this.filterCells = {};
        this.filterFunction = null;
        var filter = this.options.filter;
        if (Array.isArray(filter)) {
            filter.forEach(function (item) {
                if (typeof item === 'string') {
                    _this.filterShapes[item] = true;
                }
                else {
                    _this.filterCells[item.id] = true;
                }
            });
        }
        else if (typeof filter === 'function') {
            this.filterFunction = filter;
        }
    };
    Snapline.prototype.onBatchStop = function (_a) {
        var name = _a.name, data = _a.data;
        if (name === 'resize') {
            this.snapOnResizing(data.cell, data);
        }
    };
    Snapline.prototype.captureCursorOffset = function (_a) {
        var view = _a.view, x = _a.x, y = _a.y;
        var targetView = view.getDelegatedView();
        if (targetView && this.isNodeMovable(targetView)) {
            var pos = view.cell.getPosition();
            this.offset = {
                x: x - pos.x,
                y: y - pos.y,
            };
        }
    };
    Snapline.prototype.isNodeMovable = function (view) {
        return view && view.cell.isNode() && view.can('nodeMovable');
    };
    Snapline.prototype.snapOnResizing = function (node, options) {
        var _this = this;
        if (this.options.resizing &&
            !options.snapped &&
            options.ui &&
            options.direction &&
            options.trueDirection) {
            var view = this.graph.renderer.findViewByCell(node);
            if (view && view.cell.isNode()) {
                var nodeBbox = node.getBBox();
                var nodeBBoxRotated_1 = nodeBbox.bbox(node.getAngle());
                var nodeTopLeft = nodeBBoxRotated_1.getTopLeft();
                var nodeBottomRight_1 = nodeBBoxRotated_1.getBottomRight();
                var angle = geometry_1.Angle.normalize(node.getAngle());
                var tolerance_1 = this.options.tolerance || 0;
                var verticalLeft_1;
                var verticalTop_1;
                var verticalHeight_1;
                var horizontalTop_1;
                var horizontalLeft_1;
                var horizontalWidth_1;
                var snapOrigin_1 = {
                    vertical: 0,
                    horizontal: 0,
                };
                var direction = options.direction;
                var trueDirection = options.trueDirection;
                var relativeDirection = options.relativeDirection;
                if (trueDirection.indexOf('right') !== -1) {
                    snapOrigin_1.vertical = nodeBottomRight_1.x;
                }
                else {
                    snapOrigin_1.vertical = nodeTopLeft.x;
                }
                if (trueDirection.indexOf('bottom') !== -1) {
                    snapOrigin_1.horizontal = nodeBottomRight_1.y;
                }
                else {
                    snapOrigin_1.horizontal = nodeTopLeft.y;
                }
                this.model.getNodes().some(function (cell) {
                    if (_this.isIgnored(node, cell)) {
                        return false;
                    }
                    var snapBBox = cell.getBBox().bbox(cell.getAngle());
                    var snapTopLeft = snapBBox.getTopLeft();
                    var snapBottomRight = snapBBox.getBottomRight();
                    var groups = {
                        vertical: [snapTopLeft.x, snapBottomRight.x],
                        horizontal: [snapTopLeft.y, snapBottomRight.y],
                    };
                    var distances = {};
                    Object.keys(groups).forEach(function (k) {
                        var key = k;
                        var list = groups[key]
                            .map(function (value) { return ({
                            position: value,
                            distance: Math.abs(value - snapOrigin_1[key]),
                        }); })
                            .filter(function (item) { return item.distance <= tolerance_1; });
                        distances[key] = util_1.ArrayExt.sortBy(list, function (item) { return item.distance; });
                    });
                    if (verticalLeft_1 == null && distances.vertical.length > 0) {
                        verticalLeft_1 = distances.vertical[0].position;
                        verticalTop_1 = Math.min(nodeBBoxRotated_1.y, snapBBox.y);
                        verticalHeight_1 =
                            Math.max(nodeBottomRight_1.y, snapBottomRight.y) - verticalTop_1;
                    }
                    if (horizontalTop_1 == null && distances.horizontal.length > 0) {
                        horizontalTop_1 = distances.horizontal[0].position;
                        horizontalLeft_1 = Math.min(nodeBBoxRotated_1.x, snapBBox.x);
                        horizontalWidth_1 =
                            Math.max(nodeBottomRight_1.x, snapBottomRight.x) - horizontalLeft_1;
                    }
                    return verticalLeft_1 != null && horizontalTop_1 != null;
                });
                this.hide();
                var dx = 0;
                var dy = 0;
                if (horizontalTop_1 != null || verticalLeft_1 != null) {
                    if (verticalLeft_1 != null) {
                        dx =
                            trueDirection.indexOf('right') !== -1
                                ? verticalLeft_1 - nodeBottomRight_1.x
                                : nodeTopLeft.x - verticalLeft_1;
                    }
                    if (horizontalTop_1 != null) {
                        dy =
                            trueDirection.indexOf('bottom') !== -1
                                ? horizontalTop_1 - nodeBottomRight_1.y
                                : nodeTopLeft.y - horizontalTop_1;
                    }
                }
                var dWidth = 0;
                var dHeight = 0;
                if (angle % 90 === 0) {
                    if (angle === 90 || angle === 270) {
                        dWidth = dy;
                        dHeight = dx;
                    }
                    else {
                        dWidth = dx;
                        dHeight = dy;
                    }
                }
                else {
                    var quadrant = angle >= 0 && angle < 90
                        ? 1
                        : angle >= 90 && angle < 180
                            ? 4
                            : angle >= 180 && angle < 270
                                ? 3
                                : 2;
                    if (horizontalTop_1 != null && verticalLeft_1 != null) {
                        if (dx < dy) {
                            dy = 0;
                            horizontalTop_1 = undefined;
                        }
                        else {
                            dx = 0;
                            verticalLeft_1 = undefined;
                        }
                    }
                    var rad = geometry_1.Angle.toRad(angle % 90);
                    if (dx) {
                        dWidth = quadrant === 3 ? dx / Math.cos(rad) : dx / Math.sin(rad);
                    }
                    if (dy) {
                        dHeight = quadrant === 3 ? dy / Math.cos(rad) : dy / Math.sin(rad);
                    }
                    var quadrant13 = quadrant === 1 || quadrant === 3;
                    switch (relativeDirection) {
                        case 'top':
                        case 'bottom':
                            dHeight = dy
                                ? dy / (quadrant13 ? Math.cos(rad) : Math.sin(rad))
                                : dx / (quadrant13 ? Math.sin(rad) : Math.cos(rad));
                            break;
                        case 'left':
                        case 'right':
                            dWidth = dx
                                ? dx / (quadrant13 ? Math.cos(rad) : Math.sin(rad))
                                : dy / (quadrant13 ? Math.sin(rad) : Math.cos(rad));
                            break;
                        default:
                            break;
                    }
                }
                switch (relativeDirection) {
                    case 'top':
                    case 'bottom':
                        dWidth = 0;
                        break;
                    case 'left':
                    case 'right':
                        dHeight = 0;
                        break;
                    default:
                        break;
                }
                var gridSize = this.graph.getGridSize();
                var newWidth = Math.max(nodeBbox.width + dWidth, gridSize);
                var newHeight = Math.max(nodeBbox.height + dHeight, gridSize);
                if (options.minWidth && options.minWidth > gridSize) {
                    newWidth = Math.max(newWidth, options.minWidth);
                }
                if (options.minHeight && options.minHeight > gridSize) {
                    newHeight = Math.max(newHeight, options.minHeight);
                }
                if (options.maxWidth) {
                    newWidth = Math.min(newWidth, options.maxWidth);
                }
                if (options.maxHeight) {
                    newHeight = Math.min(newHeight, options.maxHeight);
                }
                if (options.preserveAspectRatio) {
                    if (dHeight < dWidth) {
                        newHeight = newWidth * (nodeBbox.height / nodeBbox.width);
                    }
                    else {
                        newWidth = newHeight * (nodeBbox.width / nodeBbox.height);
                    }
                }
                if (newWidth !== nodeBbox.width || newHeight !== nodeBbox.height) {
                    node.resize(newWidth, newHeight, {
                        direction: direction,
                        relativeDirection: relativeDirection,
                        trueDirection: trueDirection,
                        snapped: true,
                        snaplines: this.cid,
                        restrict: this.graph.hook.getRestrictArea(view),
                    });
                    if (verticalHeight_1) {
                        verticalHeight_1 += newHeight - nodeBbox.height;
                    }
                    if (horizontalWidth_1) {
                        horizontalWidth_1 += newWidth - nodeBbox.width;
                    }
                }
                var newRotatedBBox = node.getBBox().bbox(angle);
                if (verticalLeft_1 &&
                    Math.abs(newRotatedBBox.x - verticalLeft_1) > 1 &&
                    Math.abs(newRotatedBBox.width + newRotatedBBox.x - verticalLeft_1) > 1) {
                    verticalLeft_1 = undefined;
                }
                if (horizontalTop_1 &&
                    Math.abs(newRotatedBBox.y - horizontalTop_1) > 1 &&
                    Math.abs(newRotatedBBox.height + newRotatedBBox.y - horizontalTop_1) > 1) {
                    horizontalTop_1 = undefined;
                }
                this.update({
                    verticalLeft: verticalLeft_1,
                    verticalTop: verticalTop_1,
                    verticalHeight: verticalHeight_1,
                    horizontalTop: horizontalTop_1,
                    horizontalLeft: horizontalLeft_1,
                    horizontalWidth: horizontalWidth_1,
                });
            }
        }
    };
    Snapline.prototype.snapOnMoving = function (_a) {
        var _this = this;
        var view = _a.view, e = _a.e, x = _a.x, y = _a.y;
        var targetView = view.getEventData(e).delegatedView || view;
        if (!this.isNodeMovable(targetView)) {
            return;
        }
        var node = targetView.cell;
        var size = node.getSize();
        var position = node.getPosition();
        var cellBBox = new geometry_1.Rectangle(x - this.offset.x, y - this.offset.y, size.width, size.height);
        var angle = node.getAngle();
        var nodeCenter = cellBBox.getCenter();
        var nodeBBoxRotated = cellBBox.bbox(angle);
        var nodeTopLeft = nodeBBoxRotated.getTopLeft();
        var nodeBottomRight = nodeBBoxRotated.getBottomRight();
        var distance = this.options.tolerance || 0;
        var verticalLeft;
        var verticalTop;
        var verticalHeight;
        var horizontalTop;
        var horizontalLeft;
        var horizontalWidth;
        var verticalFix = 0;
        var horizontalFix = 0;
        this.model.getNodes().some(function (targetNode) {
            if (_this.isIgnored(node, targetNode)) {
                return false;
            }
            var snapBBox = targetNode.getBBox().bbox(targetNode.getAngle());
            var snapCenter = snapBBox.getCenter();
            var snapTopLeft = snapBBox.getTopLeft();
            var snapBottomRight = snapBBox.getBottomRight();
            if (verticalLeft == null) {
                if (Math.abs(snapCenter.x - nodeCenter.x) < distance) {
                    verticalLeft = snapCenter.x;
                    verticalFix = 0.5;
                }
                else if (Math.abs(snapTopLeft.x - nodeTopLeft.x) < distance) {
                    verticalLeft = snapTopLeft.x;
                    verticalFix = 0;
                }
                else if (Math.abs(snapTopLeft.x - nodeBottomRight.x) < distance) {
                    verticalLeft = snapTopLeft.x;
                    verticalFix = 1;
                }
                else if (Math.abs(snapBottomRight.x - nodeBottomRight.x) < distance) {
                    verticalLeft = snapBottomRight.x;
                    verticalFix = 1;
                }
                else if (Math.abs(snapBottomRight.x - nodeTopLeft.x) < distance) {
                    verticalLeft = snapBottomRight.x;
                }
                if (verticalLeft != null) {
                    verticalTop = Math.min(nodeBBoxRotated.y, snapBBox.y);
                    verticalHeight =
                        Math.max(nodeBottomRight.y, snapBottomRight.y) - verticalTop;
                }
            }
            if (horizontalTop == null) {
                if (Math.abs(snapCenter.y - nodeCenter.y) < distance) {
                    horizontalTop = snapCenter.y;
                    horizontalFix = 0.5;
                }
                else if (Math.abs(snapTopLeft.y - nodeTopLeft.y) < distance) {
                    horizontalTop = snapTopLeft.y;
                }
                else if (Math.abs(snapTopLeft.y - nodeBottomRight.y) < distance) {
                    horizontalTop = snapTopLeft.y;
                    horizontalFix = 1;
                }
                else if (Math.abs(snapBottomRight.y - nodeBottomRight.y) < distance) {
                    horizontalTop = snapBottomRight.y;
                    horizontalFix = 1;
                }
                else if (Math.abs(snapBottomRight.y - nodeTopLeft.y) < distance) {
                    horizontalTop = snapBottomRight.y;
                }
                if (horizontalTop != null) {
                    horizontalLeft = Math.min(nodeBBoxRotated.x, snapBBox.x);
                    horizontalWidth =
                        Math.max(nodeBottomRight.x, snapBottomRight.x) - horizontalLeft;
                }
            }
            return verticalLeft != null && horizontalTop != null;
        });
        this.hide();
        if (horizontalTop != null || verticalLeft != null) {
            if (horizontalTop != null) {
                nodeBBoxRotated.y =
                    horizontalTop - horizontalFix * nodeBBoxRotated.height;
            }
            if (verticalLeft != null) {
                nodeBBoxRotated.x = verticalLeft - verticalFix * nodeBBoxRotated.width;
            }
            var newCenter = nodeBBoxRotated.getCenter();
            var newX = newCenter.x - cellBBox.width / 2;
            var newY = newCenter.y - cellBBox.height / 2;
            var dx = newX - position.x;
            var dy = newY - position.y;
            if (dx !== 0 || dy !== 0) {
                node.translate(dx, dy, {
                    snapped: true,
                    restrict: this.graph.hook.getRestrictArea(targetView),
                });
                if (horizontalWidth) {
                    horizontalWidth += dx;
                }
                if (verticalHeight) {
                    verticalHeight += dy;
                }
            }
            this.update({
                verticalLeft: verticalLeft,
                verticalTop: verticalTop,
                verticalHeight: verticalHeight,
                horizontalTop: horizontalTop,
                horizontalLeft: horizontalLeft,
                horizontalWidth: horizontalWidth,
            });
        }
    };
    Snapline.prototype.isIgnored = function (snapNode, targetNode) {
        return (targetNode.id === snapNode.id ||
            targetNode.isDescendantOf(snapNode) ||
            this.filterShapes[targetNode.shape] ||
            this.filterCells[targetNode.id] ||
            (this.filterFunction &&
                util_1.FunctionExt.call(this.filterFunction, this.graph, targetNode)));
    };
    Snapline.prototype.update = function (metadata) {
        // https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations
        if (metadata.horizontalTop) {
            var start = this.graph.localToGraph(new geometry_1.Point(metadata.horizontalLeft, metadata.horizontalTop));
            var end = this.graph.localToGraph(new geometry_1.Point(metadata.horizontalLeft + metadata.horizontalWidth, metadata.horizontalTop));
            this.horizontal.setAttributes({
                x1: this.options.sharp ? "" + start.x : '0',
                y1: "" + start.y,
                x2: this.options.sharp ? "" + end.x : '100%',
                y2: "" + end.y,
                display: 'inherit',
            });
        }
        else {
            this.horizontal.setAttribute('display', 'none');
        }
        if (metadata.verticalLeft) {
            var start = this.graph.localToGraph(new geometry_1.Point(metadata.verticalLeft, metadata.verticalTop));
            var end = this.graph.localToGraph(new geometry_1.Point(metadata.verticalLeft, metadata.verticalTop + metadata.verticalHeight));
            this.vertical.setAttributes({
                x1: "" + start.x,
                y1: this.options.sharp ? "" + start.y : '0',
                x2: "" + end.x,
                y2: this.options.sharp ? "" + end.y : '100%',
                display: 'inherit',
            });
        }
        else {
            this.vertical.setAttribute('display', 'none');
        }
        this.show();
    };
    Snapline.prototype.resetTimer = function () {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    };
    Snapline.prototype.show = function () {
        this.resetTimer();
        if (this.container.parentNode == null) {
            this.graph.container.appendChild(this.container);
        }
        return this;
    };
    Snapline.prototype.hide = function () {
        var _this = this;
        this.resetTimer();
        this.vertical.setAttribute('display', 'none');
        this.horizontal.setAttribute('display', 'none');
        var clean = this.options.clean;
        var delay = typeof clean === 'number' ? clean : clean !== false ? 3000 : 0;
        if (delay > 0) {
            this.timer = window.setTimeout(function () {
                if (_this.container.parentNode !== null) {
                    _this.unmount();
                }
            }, delay);
        }
        return this;
    };
    Snapline.prototype.onRemove = function () {
        this.stopListening();
        this.hide();
    };
    Snapline.prototype.dispose = function () {
        this.remove();
    };
    __decorate([
        view_1.View.dispose()
    ], Snapline.prototype, "dispose", null);
    return Snapline;
}(view_1.View));
exports.Snapline = Snapline;
//# sourceMappingURL=index.js.map