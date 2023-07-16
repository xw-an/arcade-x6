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
exports.Transform = void 0;
var global_1 = require("../../global");
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var common_1 = require("../common");
var util_2 = require("./util");
var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    function Transform() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Transform.prototype, "node", {
        get: function () {
            return this.cell;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "containerClassName", {
        get: function () {
            return this.prefixClassName('widget-transform');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "resizeClassName", {
        get: function () {
            return this.containerClassName + "-resize";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "rotateClassName", {
        get: function () {
            return this.containerClassName + "-rotate";
        },
        enumerable: false,
        configurable: true
    });
    Transform.prototype.init = function (options) {
        this.options = __assign(__assign({}, Private.defaultOptions), options);
        this.render();
        this.startListening();
    };
    Transform.prototype.startListening = function () {
        var _a;
        this.delegateEvents((_a = {},
            _a["mousedown ." + this.resizeClassName] = 'startResizing',
            _a["touchstart ." + this.resizeClassName] = 'startResizing',
            _a["mousedown ." + this.rotateClassName] = 'startRotating',
            _a["touchstart ." + this.rotateClassName] = 'startRotating',
            _a));
        this.model.on('*', this.update, this);
        this.graph.on('scale', this.update, this);
        this.graph.on('translate', this.update, this);
        this.node.on('removed', this.remove, this);
        this.model.on('reseted', this.remove, this);
        this.view.on('cell:knob:mousedown', this.onKnobMouseDown, this);
        this.view.on('cell:knob:mouseup', this.onKnobMouseUp, this);
        _super.prototype.startListening.call(this);
    };
    Transform.prototype.stopListening = function () {
        this.undelegateEvents();
        this.model.off('*', this.update, this);
        this.graph.off('scale', this.update, this);
        this.graph.off('translate', this.update, this);
        this.node.off('removed', this.remove, this);
        this.model.off('reseted', this.remove, this);
        this.view.off('cell:knob:mousedown', this.onKnobMouseDown, this);
        this.view.off('cell:knob:mouseup', this.onKnobMouseUp, this);
        _super.prototype.stopListening.call(this);
    };
    Transform.prototype.renderHandles = function () {
        var _this = this;
        this.container = document.createElement('div');
        this.$container = this.$(this.container);
        var $knob = this.$('<div/>').prop('draggable', false);
        var $rotate = $knob.clone().addClass(this.rotateClassName);
        var $resizes = Private.POSITIONS.map(function (pos) {
            return $knob
                .clone()
                .addClass(_this.resizeClassName)
                .attr('data-position', pos);
        });
        this.empty();
        this.$container.append($resizes, $rotate);
    };
    Transform.prototype.render = function () {
        this.renderHandles();
        this.view.addClass(Private.NODE_CLS);
        this.$container
            .addClass(this.containerClassName)
            .toggleClass('no-orth-resize', this.options.preserveAspectRatio || !this.options.orthogonalResizing)
            .toggleClass('no-resize', !this.options.resizable)
            .toggleClass('no-rotate', !this.options.rotatable);
        if (this.options.className) {
            this.$container.addClass(this.options.className);
        }
        this.graph.container.appendChild(this.container);
        return this.update();
    };
    Transform.prototype.update = function () {
        var ctm = this.graph.matrix();
        var bbox = this.node.getBBox();
        bbox.x *= ctm.a;
        bbox.x += ctm.e;
        bbox.y *= ctm.d;
        bbox.y += ctm.f;
        bbox.width *= ctm.a;
        bbox.height *= ctm.d;
        var angle = geometry_1.Angle.normalize(this.node.getAngle());
        var transform = angle !== 0 ? "rotate(" + angle + "deg)" : '';
        this.$container.css({
            transform: transform,
            width: bbox.width,
            height: bbox.height,
            left: bbox.x,
            top: bbox.y,
        });
        this.updateResizerDirections();
        return this;
    };
    Transform.prototype.remove = function () {
        this.view.removeClass(Private.NODE_CLS);
        return _super.prototype.remove.call(this);
    };
    Transform.prototype.onKnobMouseDown = function () {
        this.startHandle();
    };
    Transform.prototype.onKnobMouseUp = function () {
        this.stopHandle();
    };
    Transform.prototype.updateResizerDirections = function () {
        var _this = this;
        // Update the directions on the resizer divs while the node being rotated.
        // The directions are represented by cardinal points (N,S,E,W). For example
        // the div originally pointed to north needs to be changed to point to south
        // if the node was rotated by 180 degrees.
        var angle = geometry_1.Angle.normalize(this.node.getAngle());
        var shift = Math.floor(angle * (Private.DIRECTIONS.length / 360));
        if (shift !== this.prevShift) {
            // Create the current directions array based on the calculated shift.
            var directions_1 = Private.DIRECTIONS.slice(shift).concat(Private.DIRECTIONS.slice(0, shift));
            var className_1 = function (dir) {
                return _this.containerClassName + "-cursor-" + dir;
            };
            this.$container
                .find("." + this.resizeClassName)
                .removeClass(Private.DIRECTIONS.map(function (dir) { return className_1(dir); }).join(' '))
                .each(function (index, elem) {
                _this.$(elem).addClass(className_1(directions_1[index]));
            });
            this.prevShift = shift;
        }
    };
    Transform.prototype.getTrueDirection = function (dir) {
        var angle = geometry_1.Angle.normalize(this.node.getAngle());
        var index = Private.POSITIONS.indexOf(dir);
        index += Math.floor(angle * (Private.POSITIONS.length / 360));
        index %= Private.POSITIONS.length;
        return Private.POSITIONS[index];
    };
    Transform.prototype.toValidResizeDirection = function (dir) {
        return ({
            top: 'top-left',
            bottom: 'bottom-right',
            left: 'bottom-left',
            right: 'top-right',
        }[dir] || dir);
    };
    Transform.prototype.startResizing = function (evt) {
        evt.stopPropagation();
        this.model.startBatch('resize', { cid: this.cid });
        var dir = this.$(evt.target).attr('data-position');
        var view = this.graph.findViewByCell(this.node);
        this.prepareResizing(evt, dir);
        this.startAction(evt);
        (0, util_2.notify)('node:resize:mousedown', evt, view);
    };
    Transform.prototype.prepareResizing = function (evt, relativeDirection) {
        var trueDirection = this.getTrueDirection(relativeDirection);
        var rx = 0;
        var ry = 0;
        relativeDirection.split('-').forEach(function (direction) {
            rx = { left: -1, right: 1 }[direction] || rx;
            ry = { top: -1, bottom: 1 }[direction] || ry;
        });
        var direction = this.toValidResizeDirection(relativeDirection);
        var selector = {
            'top-right': 'bottomLeft',
            'top-left': 'bottomRight',
            'bottom-left': 'topRight',
            'bottom-right': 'topLeft',
        }[direction];
        var angle = geometry_1.Angle.normalize(this.node.getAngle());
        this.setEventData(evt, {
            selector: selector,
            direction: direction,
            trueDirection: trueDirection,
            relativeDirection: relativeDirection,
            angle: angle,
            resizeX: rx,
            resizeY: ry,
            action: 'resizing',
        });
    };
    Transform.prototype.startRotating = function (evt) {
        evt.stopPropagation();
        this.model.startBatch('rotate', { cid: this.cid });
        var view = this.graph.findViewByCell(this.node);
        var center = this.node.getBBox().getCenter();
        var e = this.normalizeEvent(evt);
        var client = this.graph.snapToGrid(e.clientX, e.clientY);
        this.setEventData(evt, {
            center: center,
            action: 'rotating',
            angle: geometry_1.Angle.normalize(this.node.getAngle()),
            start: geometry_1.Point.create(client).theta(center),
        });
        this.startAction(evt);
        (0, util_2.notify)('node:rotate:mousedown', evt, view);
    };
    Transform.prototype.onMouseMove = function (evt) {
        var view = this.graph.findViewByCell(this.node);
        var data = this.getEventData(evt);
        if (data.action) {
            var e = this.normalizeEvent(evt);
            var clientX = e.clientX;
            var clientY = e.clientY;
            var scroller = this.graph.scroller.widget;
            var restrict = this.options.restrictedResizing;
            if (restrict === true || typeof restrict === 'number') {
                var factor = restrict === true ? 0 : restrict;
                var fix = scroller ? Math.max(factor, 8) : factor;
                var rect = this.graph.container.getBoundingClientRect();
                clientX = util_1.NumberExt.clamp(clientX, rect.left + fix, rect.right - fix);
                clientY = util_1.NumberExt.clamp(clientY, rect.top + fix, rect.bottom - fix);
            }
            else if (this.options.autoScrollOnResizing && scroller) {
                scroller.autoScroll(clientX, clientY);
            }
            var pos = this.graph.snapToGrid(clientX, clientY);
            var gridSize = this.graph.getGridSize();
            var node = this.node;
            var options = this.options;
            if (data.action === 'resizing') {
                data = data;
                if (!data.resized) {
                    if (view) {
                        view.addClass('node-resizing');
                        (0, util_2.notify)('node:resize', evt, view);
                    }
                    data.resized = true;
                }
                var currentBBox = node.getBBox();
                var requestedSize = geometry_1.Point.create(pos)
                    .rotate(data.angle, currentBBox.getCenter())
                    .diff(currentBBox[data.selector]);
                var width = data.resizeX
                    ? requestedSize.x * data.resizeX
                    : currentBBox.width;
                var height = data.resizeY
                    ? requestedSize.y * data.resizeY
                    : currentBBox.height;
                var rawWidth = width;
                var rawHeight = height;
                width = global_1.Util.snapToGrid(width, gridSize);
                height = global_1.Util.snapToGrid(height, gridSize);
                width = Math.max(width, options.minWidth || gridSize);
                height = Math.max(height, options.minHeight || gridSize);
                width = Math.min(width, options.maxWidth || Infinity);
                height = Math.min(height, options.maxHeight || Infinity);
                if (options.preserveAspectRatio) {
                    var candidateWidth = (currentBBox.width * height) / currentBBox.height;
                    var candidateHeight = (currentBBox.height * width) / currentBBox.width;
                    if (width < candidateWidth) {
                        height = candidateHeight;
                    }
                    else {
                        width = candidateWidth;
                    }
                }
                var relativeDirection = data.relativeDirection;
                if (options.allowReverse &&
                    (rawWidth <= -width || rawHeight <= -height)) {
                    var reverted = void 0;
                    if (relativeDirection === 'left') {
                        if (rawWidth <= -width) {
                            reverted = 'right';
                        }
                    }
                    else if (relativeDirection === 'right') {
                        if (rawWidth <= -width) {
                            reverted = 'left';
                        }
                    }
                    else if (relativeDirection === 'top') {
                        if (rawHeight <= -height) {
                            reverted = 'bottom';
                        }
                    }
                    else if (relativeDirection === 'bottom') {
                        if (rawHeight <= -height) {
                            reverted = 'top';
                        }
                    }
                    else if (relativeDirection === 'top-left') {
                        if (rawWidth <= -width && rawHeight <= -height) {
                            reverted = 'bottom-right';
                        }
                        else if (rawWidth <= -width) {
                            reverted = 'top-right';
                        }
                        else if (rawHeight <= -height) {
                            reverted = 'bottom-left';
                        }
                    }
                    else if (relativeDirection === 'top-right') {
                        if (rawWidth <= -width && rawHeight <= -height) {
                            reverted = 'bottom-left';
                        }
                        else if (rawWidth <= -width) {
                            reverted = 'top-left';
                        }
                        else if (rawHeight <= -height) {
                            reverted = 'bottom-right';
                        }
                    }
                    else if (relativeDirection === 'bottom-left') {
                        if (rawWidth <= -width && rawHeight <= -height) {
                            reverted = 'top-right';
                        }
                        else if (rawWidth <= -width) {
                            reverted = 'bottom-right';
                        }
                        else if (rawHeight <= -height) {
                            reverted = 'top-left';
                        }
                    }
                    else if (relativeDirection === 'bottom-right') {
                        if (rawWidth <= -width && rawHeight <= -height) {
                            reverted = 'top-left';
                        }
                        else if (rawWidth <= -width) {
                            reverted = 'bottom-left';
                        }
                        else if (rawHeight <= -height) {
                            reverted = 'top-right';
                        }
                    }
                    var revertedDir = reverted;
                    this.stopHandle();
                    var $handle = this.$container.find("." + this.resizeClassName + "[data-position=\"" + revertedDir + "\"]");
                    this.startHandle($handle[0]);
                    this.prepareResizing(evt, revertedDir);
                    this.onMouseMove(evt);
                }
                if (currentBBox.width !== width || currentBBox.height !== height) {
                    var resizeOptions = {
                        ui: true,
                        direction: data.direction,
                        relativeDirection: data.relativeDirection,
                        trueDirection: data.trueDirection,
                        minWidth: options.minWidth,
                        minHeight: options.minHeight,
                        maxWidth: options.maxWidth,
                        maxHeight: options.maxHeight,
                        preserveAspectRatio: options.preserveAspectRatio === true,
                    };
                    node.resize(width, height, resizeOptions);
                    (0, util_2.notify)('node:resizing', evt, view);
                }
                (0, util_2.notify)('node:resize:mousemove', evt, view);
            }
            else if (data.action === 'rotating') {
                data = data;
                if (!data.rotated) {
                    if (view) {
                        view.addClass('node-rotating');
                        (0, util_2.notify)('node:rotate', evt, view);
                    }
                    data.rotated = true;
                }
                var currentAngle = node.getAngle();
                var theta = data.start - geometry_1.Point.create(pos).theta(data.center);
                var target = data.angle + theta;
                if (options.rotateGrid) {
                    target = global_1.Util.snapToGrid(target, options.rotateGrid);
                }
                target = geometry_1.Angle.normalize(target);
                if (currentAngle !== target) {
                    node.rotate(target, { absolute: true });
                    (0, util_2.notify)('node:rotating', evt, view);
                }
                (0, util_2.notify)('node:rotate:mousemove', evt, view);
            }
        }
    };
    Transform.prototype.onMouseUp = function (evt) {
        var view = this.graph.findViewByCell(this.node);
        var data = this.getEventData(evt);
        if (data.action) {
            this.stopAction(evt);
            this.model.stopBatch(data.action === 'resizing' ? 'resize' : 'rotate', {
                cid: this.cid,
            });
            if (data.action === 'resizing') {
                (0, util_2.notify)('node:resize:mouseup', evt, view);
            }
            else if (data.action === 'rotating') {
                (0, util_2.notify)('node:rotate:mouseup', evt, view);
            }
        }
    };
    Transform.prototype.startHandle = function (handle) {
        this.handle = handle || null;
        this.$container.addClass(this.containerClassName + "-active");
        if (handle) {
            this.$(handle).addClass(this.containerClassName + "-active-handle");
            var pos = handle.getAttribute('data-position');
            if (pos) {
                var dir = Private.DIRECTIONS[Private.POSITIONS.indexOf(pos)];
                this.$container.addClass(this.containerClassName + "-cursor-" + dir);
            }
        }
    };
    Transform.prototype.stopHandle = function () {
        this.$container.removeClass(this.containerClassName + "-active");
        if (this.handle) {
            this.$(this.handle).removeClass(this.containerClassName + "-active-handle");
            var pos = this.handle.getAttribute('data-position');
            if (pos) {
                var dir = Private.DIRECTIONS[Private.POSITIONS.indexOf(pos)];
                this.$container.removeClass(this.containerClassName + "-cursor-" + dir);
            }
            this.handle = null;
        }
    };
    Transform.prototype.startAction = function (evt) {
        this.startHandle(evt.target);
        this.graph.view.undelegateEvents();
        this.delegateDocumentEvents(Private.documentEvents, evt.data);
    };
    Transform.prototype.stopAction = function (evt) {
        this.stopHandle();
        this.undelegateDocumentEvents();
        this.graph.view.delegateEvents();
        var view = this.graph.findViewByCell(this.node);
        var data = this.getEventData(evt);
        if (view) {
            view.removeClass("node-" + data.action);
            if (data.action === 'resizing' && data.resized) {
                (0, util_2.notify)('node:resized', evt, view);
            }
            else if (data.action === 'rotating' && data.rotated) {
                (0, util_2.notify)('node:rotated', evt, view);
            }
        }
    };
    return Transform;
}(common_1.Widget));
exports.Transform = Transform;
var Private;
(function (Private) {
    Private.NODE_CLS = 'has-widget-transform';
    Private.DIRECTIONS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    Private.POSITIONS = [
        'top-left',
        'top',
        'top-right',
        'right',
        'bottom-right',
        'bottom',
        'bottom-left',
        'left',
    ];
    Private.documentEvents = {
        mousemove: 'onMouseMove',
        touchmove: 'onMouseMove',
        mouseup: 'onMouseUp',
        touchend: 'onMouseUp',
    };
    Private.defaultOptions = {
        minWidth: 0,
        minHeight: 0,
        maxWidth: Infinity,
        maxHeight: Infinity,
        rotateGrid: 15,
        rotatable: true,
        preserveAspectRatio: false,
        orthogonalResizing: true,
        restrictedResizing: false,
        autoScrollOnResizing: true,
        allowReverse: true,
    };
})(Private || (Private = {}));
//# sourceMappingURL=index.js.map