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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellEditor = void 0;
var tool_1 = require("../../view/tool");
var geometry_1 = require("../../geometry");
var util_1 = require("../../util");
var CellEditor = /** @class */ (function (_super) {
    __extends(CellEditor, _super);
    function CellEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.labelIndex = -1;
        _this.distance = 0.5;
        return _this;
    }
    CellEditor.prototype.render = function () {
        this.createElement();
        this.updateEditor();
        this.autoFocus();
        this.delegateDocumentEvents(this.options.documentEvents);
        return this;
    };
    CellEditor.prototype.createElement = function () {
        var cell = this.cell;
        var classNames = [
            this.prefixClassName((cell.isEdge() ? 'edge' : 'node') + "-tool-editor"),
            this.prefixClassName('cell-tool-editor'),
        ];
        this.editor = tool_1.ToolsView.createElement('div', false);
        this.addClass(classNames, this.editor);
        this.editor.contentEditable = 'true';
        this.container.appendChild(this.editor);
    };
    CellEditor.prototype.updateEditor = function () {
        var _a = this, graph = _a.graph, cell = _a.cell, editor = _a.editor;
        var style = editor.style;
        // set tool position
        var pos = new geometry_1.Point();
        var minWidth = 20;
        if (cell.isNode()) {
            pos = cell.getBBox().center;
            minWidth = cell.size().width - 4;
        }
        else if (cell.isEdge()) {
            var e = this.options.event;
            var target = e.target;
            var parent_1 = target.parentElement;
            var isEdgeLabel = parent_1 && util_1.Dom.hasClass(parent_1, this.prefixClassName('edge-label'));
            if (isEdgeLabel) {
                var index = parent_1.getAttribute('data-index') || '0';
                this.labelIndex = parseInt(index, 10);
                var matrix = parent_1.getAttribute('transform');
                var translation = util_1.Dom.parseTransformString(matrix).translation;
                pos = new geometry_1.Point(translation.tx, translation.ty);
                minWidth = util_1.Dom.getBBox(target).width;
            }
            else {
                if (!this.options.labelAddable) {
                    return this;
                }
                pos = graph.clientToLocal(geometry_1.Point.create(e.clientX, e.clientY));
                var view = this.cellView;
                var d = view.path.closestPointLength(pos);
                this.distance = d;
            }
        }
        pos = graph.localToGraph(pos);
        style.left = pos.x + "px";
        style.top = pos.y + "px";
        style.minWidth = minWidth + "px";
        // set tool transform
        var scale = graph.scale();
        style.transform = "scale(" + scale.sx + ", " + scale.sy + ") translate(-50%, -50%)";
        // set font style
        var attrs = this.options.attrs;
        style.fontSize = attrs.fontSize + "px";
        style.fontFamily = attrs.fontFamily;
        style.color = attrs.color;
        style.backgroundColor = attrs.backgroundColor;
        // set init value
        var getText = this.options.getText;
        var text;
        if (typeof getText === 'function') {
            text = util_1.FunctionExt.call(getText, this.cellView, {
                cell: this.cell,
                index: this.labelIndex,
            });
        }
        editor.innerText = text || '';
        return this;
    };
    CellEditor.prototype.onDocumentMouseDown = function (e) {
        if (e.target !== this.editor) {
            var cell = this.cell;
            var value = this.editor.innerText.replace(/\n$/, '') || '';
            // set value
            var setText = this.options.setText;
            if (typeof setText === 'function') {
                util_1.FunctionExt.call(setText, this.cellView, {
                    cell: this.cell,
                    value: value,
                    index: this.labelIndex,
                    distance: this.distance,
                });
            }
            // remove tool
            cell.removeTool(cell.isEdge() ? 'edge-editor' : 'node-editor');
            this.undelegateDocumentEvents();
        }
    };
    CellEditor.prototype.onDblClick = function (e) {
        e.stopPropagation();
    };
    CellEditor.prototype.onMouseDown = function (e) {
        e.stopPropagation();
    };
    CellEditor.prototype.autoFocus = function () {
        var _this = this;
        setTimeout(function () {
            _this.editor.focus();
            _this.selectText();
        });
    };
    CellEditor.prototype.selectText = function () {
        if (window.getSelection) {
            var range = document.createRange();
            var selection = window.getSelection();
            range.selectNodeContents(this.editor);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
    return CellEditor;
}(tool_1.ToolsView.ToolItem));
exports.CellEditor = CellEditor;
(function (CellEditor) {
    CellEditor.config({
        tagName: 'div',
        isSVGElement: false,
        events: {
            dblclick: 'onDblClick',
            mousedown: 'onMouseDown',
        },
        documentEvents: {
            mousedown: 'onDocumentMouseDown',
        },
    });
})(CellEditor = exports.CellEditor || (exports.CellEditor = {}));
exports.CellEditor = CellEditor;
(function (CellEditor) {
    CellEditor.NodeEditor = CellEditor.define({
        attrs: {
            fontSize: 14,
            fontFamily: 'Arial, helvetica, sans-serif',
            color: '#000',
            backgroundColor: '#fff',
        },
        getText: function (_a) {
            var cell = _a.cell;
            return cell.attr('text/text');
        },
        setText: function (_a) {
            var cell = _a.cell, value = _a.value;
            cell.attr('text/text', value);
        },
    });
    CellEditor.EdgeEditor = CellEditor.define({
        attrs: {
            fontSize: 14,
            fontFamily: 'Arial, helvetica, sans-serif',
            color: '#000',
            backgroundColor: '#fff',
        },
        labelAddable: true,
        getText: function (_a) {
            var cell = _a.cell, index = _a.index;
            if (index === -1) {
                return '';
            }
            return cell.prop("labels/" + index + "/attrs/label/text");
        },
        setText: function (_a) {
            var cell = _a.cell, value = _a.value, index = _a.index, distance = _a.distance;
            var edge = cell;
            if (index === -1) {
                edge.appendLabel({
                    position: {
                        distance: distance,
                    },
                    attrs: {
                        label: {
                            text: value,
                        },
                    },
                });
            }
            else {
                if (value) {
                    edge.prop("labels/" + index + "/attrs/label/text", value);
                }
                else if (typeof index === 'number') {
                    edge.removeLabelAt(index);
                }
            }
        },
    });
})(CellEditor = exports.CellEditor || (exports.CellEditor = {}));
exports.CellEditor = CellEditor;
//# sourceMappingURL=editor.js.map