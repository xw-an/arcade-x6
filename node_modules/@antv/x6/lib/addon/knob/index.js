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
exports.Knob = void 0;
var common_1 = require("../common");
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var Knob = /** @class */ (function (_super) {
    __extends(Knob, _super);
    function Knob() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Knob.prototype, "node", {
        get: function () {
            return this.cell;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Knob.prototype, "metadata", {
        get: function () {
            var meta = this.cell.prop('knob');
            if (Array.isArray(meta)) {
                if (this.options.index != null) {
                    return meta[this.options.index];
                }
                return null;
            }
            return meta;
        },
        enumerable: false,
        configurable: true
    });
    Knob.prototype.init = function (options) {
        this.options = __assign({}, options);
        this.render();
        this.startListening();
    };
    Knob.prototype.startListening = function () {
        this.delegateEvents({
            mousedown: 'onMouseDown',
            touchstart: 'onMouseDown',
        });
        this.model.on('*', this.update, this);
        this.graph.on('scale', this.update, this);
        this.graph.on('translate', this.update, this);
        this.model.on('reseted', this.remove, this);
        this.node.on('removed', this.remove, this);
        this.view.on('node:resize:mousedown', this.onTransform, this);
        this.view.on('node:rotate:mousedown', this.onTransform, this);
        this.view.on('node:resize:mouseup', this.onTransformed, this);
        this.view.on('node:rotate:mouseup', this.onTransformed, this);
        this.view.on('cell:knob:mousedown', this.onKnobMouseDown, this);
        this.view.on('cell:knob:mouseup', this.onKnobMouseUp, this);
        _super.prototype.startListening.call(this);
    };
    Knob.prototype.stopListening = function () {
        this.undelegateEvents();
        this.model.off('*', this.update, this);
        this.graph.off('scale', this.update, this);
        this.graph.off('translate', this.update, this);
        this.model.off('reseted', this.remove, this);
        this.node.off('removed', this.remove, this);
        this.view.off('node:resize:mousedown', this.onTransform, this);
        this.view.off('node:rotate:mousedown', this.onTransform, this);
        this.view.off('node:resize:mouseup', this.onTransformed, this);
        this.view.off('node:rotate:mouseup', this.onTransformed, this);
        this.view.off('cell:knob:mousedown', this.onKnobMouseDown, this);
        this.view.off('cell:knob:mouseup', this.onKnobMouseUp, this);
        _super.prototype.stopListening.call(this);
    };
    Knob.prototype.render = function () {
        this.container = document.createElement('div');
        util_1.Dom.addClass(this.container, this.prefixClassName('widget-knob'));
        if (this.options.className) {
            util_1.Dom.addClass(this.container, this.options.className);
        }
        this.view.addClass(Private.KNOB);
        this.graph.container.appendChild(this.container);
        this.update();
        return this;
    };
    Knob.prototype.remove = function () {
        this.view.removeClass(Private.KNOB);
        return _super.prototype.remove.call(this);
    };
    Knob.prototype.update = function () {
        if (this.metadata) {
            var _a = this.metadata, update = _a.update, position = _a.position;
            var args = {
                knob: this,
                cell: this.cell,
                node: this.node,
            };
            if (position) {
                var pos = position.call(this.graph, __assign({}, args));
                if (pos) {
                    var ctm = this.graph.matrix();
                    var bbox = this.node.getBBox();
                    var angle = geometry_1.Angle.normalize(this.node.getAngle());
                    var local = geometry_1.Point.create(pos);
                    if (angle !== 0) {
                        local.rotate(-angle, { x: bbox.width / 2, y: bbox.height / 2 });
                    }
                    local.translate(bbox).scale(ctm.a, ctm.d).translate(ctm.e, ctm.f);
                    this.container.style.left = local.x + "px";
                    this.container.style.top = local.y + "px";
                }
            }
            if (update) {
                update.call(this.graph, __assign({}, args));
            }
        }
    };
    Knob.prototype.hide = function () {
        this.container.style.display = 'none';
    };
    Knob.prototype.show = function () {
        this.container.style.display = '';
    };
    Knob.prototype.onTransform = function () {
        this.hide();
    };
    Knob.prototype.onTransformed = function () {
        this.show();
    };
    Knob.prototype.onKnobMouseDown = function (_a) {
        var knob = _a.knob;
        if (this.cid !== knob.cid) {
            this.hide();
        }
    };
    Knob.prototype.onKnobMouseUp = function () {
        this.show();
    };
    Knob.prototype.notify = function (name, evt) {
        if (this.view) {
            var e = this.view.normalizeEvent(evt);
            var localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
            this.view.notify("cell:" + name, {
                e: e,
                view: this.view,
                node: this.node,
                cell: this.cell,
                x: localPoint.x,
                y: localPoint.y,
                knob: this,
            });
            if (this.cell.isNode()) {
                this.view.notify("node:" + name, {
                    e: e,
                    view: this.view,
                    node: this.node,
                    cell: this.cell,
                    x: localPoint.x,
                    y: localPoint.y,
                    knob: this,
                });
            }
            else if (this.cell.isEdge()) {
                this.view.notify("edge:" + name, {
                    e: e,
                    view: this.view,
                    edge: this.cell,
                    cell: this.cell,
                    x: localPoint.x,
                    y: localPoint.y,
                    knob: this,
                });
            }
        }
    };
    Knob.prototype.onMouseDown = function (e) {
        e.stopPropagation();
        this.setEventData(e, {
            knobbing: false,
            originX: e.clientX,
            originY: e.clientY,
            clientX: e.clientX,
            clientY: e.clientY,
        });
        this.graph.view.undelegateEvents();
        this.delegateDocumentEvents(Private.documentEvents, e.data);
        if (this.metadata && this.metadata.onMouseDown) {
            this.metadata.onMouseDown.call(this.graph, {
                e: e,
                data: this.getEventData(e),
                knob: this,
                cell: this.cell,
                node: this.node,
            });
        }
        this.notify('knob:mousedown', e);
    };
    Knob.prototype.onMouseMove = function (e) {
        var data = this.getEventData(e);
        var view = this.graph.findViewByCell(this.node);
        if (!data.knobbing) {
            data.knobbing = true;
            if (view) {
                view.addClass(Private.KNOBBING);
                this.notify('knob', e);
            }
            this.model.startBatch('knob', { cid: this.cid });
        }
        data.clientX = e.clientX;
        data.clientY = e.clientY;
        if (this.metadata && this.metadata.onMouseMove) {
            var ctm = this.graph.matrix();
            var dx = (e.clientX - data.originX) / ctm.a;
            var dy = (e.clientY - data.originY) / ctm.d;
            var angle = this.node.getAngle();
            var delta = new geometry_1.Point(dx, dy).rotate(angle);
            this.metadata.onMouseMove.call(this.graph, {
                e: e,
                data: data,
                deltaX: delta.x,
                deltaY: delta.y,
                knob: this,
                cell: this.cell,
                node: this.node,
            });
        }
        this.notify('knobbing', e);
        this.notify('knob:mousemove', e);
    };
    Knob.prototype.onMouseUp = function (e) {
        this.undelegateDocumentEvents();
        this.graph.view.delegateEvents();
        var data = this.getEventData(e);
        var view = this.graph.findViewByCell(this.node);
        if (data.knobbing) {
            if (view) {
                view.removeClass(Private.KNOBBING);
            }
            if (this.metadata && this.metadata.onMouseUp) {
                this.metadata.onMouseUp.call(this.graph, {
                    e: e,
                    data: data,
                    knob: this,
                    cell: this.cell,
                    node: this.node,
                });
            }
            this.model.stopBatch('knob', { cid: this.cid });
            this.notify('knobbed', e);
        }
        this.notify('knob:mouseup', e);
    };
    return Knob;
}(common_1.Widget));
exports.Knob = Knob;
var Private;
(function (Private) {
    Private.KNOB = 'has-widget-knob';
    Private.KNOBBING = 'node-knobbing';
    Private.documentEvents = {
        mousemove: 'onMouseMove',
        touchmove: 'onMouseMove',
        mouseup: 'onMouseUp',
        touchend: 'onMouseUp',
    };
})(Private || (Private = {}));
//# sourceMappingURL=index.js.map