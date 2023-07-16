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
import { ToolsView } from '../../view/tool';
import { Registry } from '../registry';
import { Button } from './button';
import { Boundary } from './boundary';
import { Vertices } from './vertices';
import { Segments } from './segments';
import { SourceAnchor, TargetAnchor } from './anchor';
import { SourceArrowhead, TargetArrowhead } from './arrowhead';
import { CellEditor } from './editor';
export var NodeTool;
(function (NodeTool) {
    NodeTool.presets = {
        boundary: Boundary,
        button: Button,
        'button-remove': Button.Remove,
        'node-editor': CellEditor.NodeEditor,
    };
    NodeTool.registry = Registry.create({
        type: 'node tool',
        process(name, options) {
            if (typeof options === 'function') {
                return options;
            }
            let parent = ToolsView.ToolItem;
            const { inherit } = options, others = __rest(options, ["inherit"]);
            if (inherit) {
                const base = this.get(inherit);
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
})(NodeTool || (NodeTool = {}));
export var EdgeTool;
(function (EdgeTool) {
    EdgeTool.presets = {
        boundary: Boundary,
        vertices: Vertices,
        segments: Segments,
        button: Button,
        'button-remove': Button.Remove,
        'source-anchor': SourceAnchor,
        'target-anchor': TargetAnchor,
        'source-arrowhead': SourceArrowhead,
        'target-arrowhead': TargetArrowhead,
        'edge-editor': CellEditor.EdgeEditor,
    };
    EdgeTool.registry = Registry.create({
        type: 'edge tool',
        process(name, options) {
            if (typeof options === 'function') {
                return options;
            }
            let parent = ToolsView.ToolItem;
            const { inherit } = options, others = __rest(options, ["inherit"]);
            if (inherit) {
                const base = this.get(inherit);
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
})(EdgeTool || (EdgeTool = {}));
//# sourceMappingURL=index.js.map