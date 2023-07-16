"use strict";
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
exports.EdgeTool = exports.NodeTool = void 0;
var tool_1 = require("../../view/tool");
var registry_1 = require("../registry");
var button_1 = require("./button");
var boundary_1 = require("./boundary");
var vertices_1 = require("./vertices");
var segments_1 = require("./segments");
var anchor_1 = require("./anchor");
var arrowhead_1 = require("./arrowhead");
var editor_1 = require("./editor");
var NodeTool;
(function (NodeTool) {
    NodeTool.presets = {
        boundary: boundary_1.Boundary,
        button: button_1.Button,
        'button-remove': button_1.Button.Remove,
        'node-editor': editor_1.CellEditor.NodeEditor,
    };
    NodeTool.registry = registry_1.Registry.create({
        type: 'node tool',
        process: function (name, options) {
            if (typeof options === 'function') {
                return options;
            }
            var parent = tool_1.ToolsView.ToolItem;
            var inherit = options.inherit, others = __rest(options, ["inherit"]);
            if (inherit) {
                var base = this.get(inherit);
                if (base == null) {
                    this.onNotFound(inherit, 'inherited');
                }
                else {
                    parent = base;
                }
            }
            if (others.name == null) {
                others.name = name;
            }
            return parent.define.call(parent, others);
        },
    });
    NodeTool.registry.register(NodeTool.presets, true);
})(NodeTool = exports.NodeTool || (exports.NodeTool = {}));
var EdgeTool;
(function (EdgeTool) {
    EdgeTool.presets = {
        boundary: boundary_1.Boundary,
        vertices: vertices_1.Vertices,
        segments: segments_1.Segments,
        button: button_1.Button,
        'button-remove': button_1.Button.Remove,
        'source-anchor': anchor_1.SourceAnchor,
        'target-anchor': anchor_1.TargetAnchor,
        'source-arrowhead': arrowhead_1.SourceArrowhead,
        'target-arrowhead': arrowhead_1.TargetArrowhead,
        'edge-editor': editor_1.CellEditor.EdgeEditor,
    };
    EdgeTool.registry = registry_1.Registry.create({
        type: 'edge tool',
        process: function (name, options) {
            if (typeof options === 'function') {
                return options;
            }
            var parent = tool_1.ToolsView.ToolItem;
            var inherit = options.inherit, others = __rest(options, ["inherit"]);
            if (inherit) {
                var base = this.get(inherit);
                if (base == null) {
                    this.onNotFound(inherit, 'inherited');
                }
                else {
                    parent = base;
                }
            }
            if (others.name == null) {
                others.name = name;
            }
            return parent.define.call(parent, others);
        },
    });
    EdgeTool.registry.register(EdgeTool.presets, true);
})(EdgeTool = exports.EdgeTool || (exports.EdgeTool = {}));
//# sourceMappingURL=index.js.map