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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetAnchor = exports.SourceAnchor = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var tool_1 = require("../../view/tool");
var Util = __importStar(require("./util"));
var Anchor = /** @class */ (function (_super) {
    __extends(Anchor, _super);
    function Anchor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Anchor.prototype, "type", {
        get: function () {
            return this.options.type;
        },
        enumerable: false,
        configurable: true
    });
    Anchor.prototype.onRender = function () {
        util_1.Dom.addClass(this.container, this.prefixClassName("edge-tool-" + this.type + "-anchor"));
        this.toggleArea(false);
        this.update();
    };
    Anchor.prototype.update = function () {
        var type = this.type;
        var edgeView = this.cellView;
        var terminalView = edgeView.getTerminalView(type);
        if (terminalView) {
            this.updateAnchor();
            this.updateArea();
            this.container.style.display = '';
        }
        else {
            this.container.style.display = 'none';
        }
        return this;
    };
    Anchor.prototype.updateAnchor = function () {
        var childNodes = this.childNodes;
        if (!childNodes) {
            return;
        }
        var anchorNode = childNodes.anchor;
        if (!anchorNode) {
            return;
        }
        var type = this.type;
        var edgeView = this.cellView;
        var options = this.options;
        var position = edgeView.getTerminalAnchor(type);
        var customAnchor = edgeView.cell.prop([type, 'anchor']);
        anchorNode.setAttribute('transform', "translate(" + position.x + ", " + position.y + ")");
        var anchorAttrs = customAnchor
            ? options.customAnchorAttrs
            : options.defaultAnchorAttrs;
        if (anchorAttrs) {
            Object.keys(anchorAttrs).forEach(function (attrName) {
                anchorNode.setAttribute(attrName, anchorAttrs[attrName]);
            });
        }
    };
    Anchor.prototype.updateArea = function () {
        var childNodes = this.childNodes;
        if (!childNodes) {
            return;
        }
        var areaNode = childNodes.area;
        if (!areaNode) {
            return;
        }
        var type = this.type;
        var edgeView = this.cellView;
        var terminalView = edgeView.getTerminalView(type);
        if (terminalView) {
            var terminalCell = terminalView.cell;
            var magnet = edgeView.getTerminalMagnet(type);
            var padding = this.options.areaPadding || 0;
            if (!Number.isFinite(padding)) {
                padding = 0;
            }
            var bbox = void 0;
            var angle = void 0;
            var center = void 0;
            if (terminalView.isEdgeElement(magnet)) {
                bbox = terminalView.getBBox();
                angle = 0;
                center = bbox.getCenter();
            }
            else {
                bbox = terminalView.getUnrotatedBBoxOfElement(magnet);
                angle = terminalCell.getAngle();
                center = bbox.getCenter();
                if (angle) {
                    center.rotate(-angle, terminalCell.getBBox().getCenter());
                }
            }
            bbox.inflate(padding);
            util_1.Dom.attr(areaNode, {
                x: -bbox.width / 2,
                y: -bbox.height / 2,
                width: bbox.width,
                height: bbox.height,
                transform: "translate(" + center.x + ", " + center.y + ") rotate(" + angle + ")",
            });
        }
    };
    Anchor.prototype.toggleArea = function (visible) {
        if (this.childNodes) {
            var elem = this.childNodes.area;
            if (elem) {
                elem.style.display = visible ? '' : 'none';
            }
        }
    };
    Anchor.prototype.onMouseDown = function (evt) {
        if (this.guard(evt)) {
            return;
        }
        evt.stopPropagation();
        evt.preventDefault();
        this.graph.view.undelegateEvents();
        if (this.options.documentEvents) {
            this.delegateDocumentEvents(this.options.documentEvents);
        }
        this.focus();
        this.toggleArea(this.options.restrictArea);
        this.cell.startBatch('move-anchor', {
            ui: true,
            toolId: this.cid,
        });
    };
    Anchor.prototype.resetAnchor = function (anchor) {
        var type = this.type;
        var cell = this.cell;
        if (anchor) {
            cell.prop([type, 'anchor'], anchor, {
                rewrite: true,
                ui: true,
                toolId: this.cid,
            });
        }
        else {
            cell.removeProp([type, 'anchor'], {
                ui: true,
                toolId: this.cid,
            });
        }
    };
    Anchor.prototype.onMouseMove = function (evt) {
        var terminalType = this.type;
        var edgeView = this.cellView;
        var terminalView = edgeView.getTerminalView(terminalType);
        if (terminalView == null) {
            return;
        }
        var e = this.normalizeEvent(evt);
        var terminalCell = terminalView.cell;
        var terminalMagnet = edgeView.getTerminalMagnet(terminalType);
        var coords = this.graph.clientToLocal(e.clientX, e.clientY);
        var snapFn = this.options.snap;
        if (typeof snapFn === 'function') {
            var tmp = util_1.FunctionExt.call(snapFn, edgeView, coords, terminalView, terminalMagnet, terminalType, edgeView, this);
            coords = geometry_1.Point.create(tmp);
        }
        if (this.options.restrictArea) {
            if (terminalView.isEdgeElement(terminalMagnet)) {
                var pointAtConnection = terminalView.getClosestPoint(coords);
                if (pointAtConnection) {
                    coords = pointAtConnection;
                }
            }
            else {
                var bbox = terminalView.getUnrotatedBBoxOfElement(terminalMagnet);
                var angle = terminalCell.getAngle();
                var origin_1 = terminalCell.getBBox().getCenter();
                var rotatedCoords = coords.clone().rotate(angle, origin_1);
                if (!bbox.containsPoint(rotatedCoords)) {
                    coords = bbox
                        .getNearestPointToPoint(rotatedCoords)
                        .rotate(-angle, origin_1);
                }
            }
        }
        var anchor;
        var anchorFn = this.options.anchor;
        if (typeof anchorFn === 'function') {
            anchor = util_1.FunctionExt.call(anchorFn, edgeView, coords, terminalView, terminalMagnet, terminalType, edgeView, this);
        }
        this.resetAnchor(anchor);
        this.update();
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Anchor.prototype.onMouseUp = function (evt) {
        this.graph.view.delegateEvents();
        this.undelegateDocumentEvents();
        this.blur();
        this.toggleArea(false);
        var edgeView = this.cellView;
        if (this.options.removeRedundancies) {
            edgeView.removeRedundantLinearVertices({ ui: true, toolId: this.cid });
        }
        this.cell.stopBatch('move-anchor', { ui: true, toolId: this.cid });
    };
    Anchor.prototype.onDblClick = function () {
        var anchor = this.options.resetAnchor;
        if (anchor) {
            this.resetAnchor(anchor === true ? undefined : anchor);
        }
        this.update();
    };
    return Anchor;
}(tool_1.ToolsView.ToolItem));
(function (Anchor) {
    Anchor.config({
        tagName: 'g',
        markup: [
            {
                tagName: 'circle',
                selector: 'anchor',
                attrs: {
                    cursor: 'pointer',
                },
            },
            {
                tagName: 'rect',
                selector: 'area',
                attrs: {
                    'pointer-events': 'none',
                    fill: 'none',
                    stroke: '#33334F',
                    'stroke-dasharray': '2,4',
                    rx: 5,
                    ry: 5,
                },
            },
        ],
        events: {
            mousedown: 'onMouseDown',
            touchstart: 'onMouseDown',
            dblclick: 'onDblClick',
        },
        documentEvents: {
            mousemove: 'onMouseMove',
            touchmove: 'onMouseMove',
            mouseup: 'onMouseUp',
            touchend: 'onMouseUp',
            touchcancel: 'onMouseUp',
        },
        customAnchorAttrs: {
            'stroke-width': 4,
            stroke: '#33334F',
            fill: '#FFFFFF',
            r: 5,
        },
        defaultAnchorAttrs: {
            'stroke-width': 2,
            stroke: '#FFFFFF',
            fill: '#33334F',
            r: 6,
        },
        areaPadding: 6,
        snapRadius: 10,
        resetAnchor: true,
        restrictArea: true,
        removeRedundancies: true,
        anchor: Util.getAnchor,
        snap: function (pos, terminalView, terminalMagnet, terminalType, edgeView, toolView) {
            var snapRadius = toolView.options.snapRadius || 0;
            var isSource = terminalType === 'source';
            var refIndex = isSource ? 0 : -1;
            var ref = this.cell.getVertexAt(refIndex) ||
                this.getTerminalAnchor(isSource ? 'target' : 'source');
            if (ref) {
                if (Math.abs(ref.x - pos.x) < snapRadius)
                    pos.x = ref.x;
                if (Math.abs(ref.y - pos.y) < snapRadius)
                    pos.y = ref.y;
            }
            return pos;
        },
    });
})(Anchor || (Anchor = {}));
exports.SourceAnchor = Anchor.define({
    name: 'source-anchor',
    type: 'source',
});
exports.TargetAnchor = Anchor.define({
    name: 'target-anchor',
    type: 'target',
});
//# sourceMappingURL=anchor.js.map