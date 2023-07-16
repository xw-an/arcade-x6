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
exports.TargetArrowhead = exports.SourceArrowhead = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var tool_1 = require("../../view/tool");
var Arrowhead = /** @class */ (function (_super) {
    __extends(Arrowhead, _super);
    function Arrowhead() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Arrowhead.prototype, "type", {
        get: function () {
            return this.options.type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Arrowhead.prototype, "ratio", {
        get: function () {
            return this.options.ratio;
        },
        enumerable: false,
        configurable: true
    });
    Arrowhead.prototype.init = function () {
        if (this.options.attrs) {
            var _a = this.options.attrs, className = _a.class, attrs = __rest(_a, ["class"]);
            this.setAttrs(attrs, this.container);
            if (className) {
                util_1.Dom.addClass(this.container, className);
            }
        }
    };
    Arrowhead.prototype.onRender = function () {
        util_1.Dom.addClass(this.container, this.prefixClassName("edge-tool-" + this.type + "-arrowhead"));
        this.update();
    };
    Arrowhead.prototype.update = function () {
        var ratio = this.ratio;
        var edgeView = this.cellView;
        var tangent = edgeView.getTangentAtRatio(ratio);
        var position = tangent ? tangent.start : edgeView.getPointAtRatio(ratio);
        var angle = (tangent && tangent.vector().vectorAngle(new geometry_1.Point(1, 0))) || 0;
        if (!position) {
            return this;
        }
        var matrix = util_1.Dom.createSVGMatrix()
            .translate(position.x, position.y)
            .rotate(angle);
        util_1.Dom.transform(this.container, matrix, { absolute: true });
        return this;
    };
    Arrowhead.prototype.onMouseDown = function (evt) {
        if (this.guard(evt)) {
            return;
        }
        evt.stopPropagation();
        evt.preventDefault();
        var edgeView = this.cellView;
        if (edgeView.can('arrowheadMovable')) {
            edgeView.cell.startBatch('move-arrowhead', {
                ui: true,
                toolId: this.cid,
            });
            var coords = this.graph.snapToGrid(evt.clientX, evt.clientY);
            var data = edgeView.prepareArrowheadDragging(this.type, {
                x: coords.x,
                y: coords.y,
                options: {
                    toolId: this.cid,
                },
            });
            this.cellView.setEventData(evt, data);
            this.delegateDocumentEvents(this.options.documentEvents, evt.data);
            edgeView.graph.view.undelegateEvents();
            this.container.style.pointerEvents = 'none';
        }
        this.focus();
    };
    Arrowhead.prototype.onMouseMove = function (evt) {
        var e = this.normalizeEvent(evt);
        var coords = this.graph.snapToGrid(e.clientX, e.clientY);
        this.cellView.onMouseMove(e, coords.x, coords.y);
        this.update();
    };
    Arrowhead.prototype.onMouseUp = function (evt) {
        this.undelegateDocumentEvents();
        var e = this.normalizeEvent(evt);
        var edgeView = this.cellView;
        var coords = this.graph.snapToGrid(e.clientX, e.clientY);
        edgeView.onMouseUp(e, coords.x, coords.y);
        this.graph.view.delegateEvents();
        this.blur();
        this.container.style.pointerEvents = '';
        edgeView.cell.stopBatch('move-arrowhead', {
            ui: true,
            toolId: this.cid,
        });
    };
    return Arrowhead;
}(tool_1.ToolsView.ToolItem));
(function (Arrowhead) {
    Arrowhead.config({
        tagName: 'path',
        isSVGElement: true,
        events: {
            mousedown: 'onMouseDown',
            touchstart: 'onMouseDown',
        },
        documentEvents: {
            mousemove: 'onMouseMove',
            touchmove: 'onMouseMove',
            mouseup: 'onMouseUp',
            touchend: 'onMouseUp',
            touchcancel: 'onMouseUp',
        },
    });
})(Arrowhead || (Arrowhead = {}));
exports.SourceArrowhead = Arrowhead.define({
    name: 'source-arrowhead',
    type: 'source',
    ratio: 0,
    attrs: {
        d: 'M 10 -8 -10 0 10 8 Z',
        fill: '#333',
        stroke: '#fff',
        'stroke-width': 2,
        cursor: 'move',
    },
});
exports.TargetArrowhead = Arrowhead.define({
    name: 'target-arrowhead',
    type: 'target',
    ratio: 1,
    attrs: {
        d: 'M -10 -8 10 0 -10 8 Z',
        fill: '#333',
        stroke: '#fff',
        'stroke-width': 2,
        cursor: 'move',
    },
});
//# sourceMappingURL=arrowhead.js.map