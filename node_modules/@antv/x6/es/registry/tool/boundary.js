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
import { NumberExt, Dom } from '../../util';
import { ToolsView } from '../../view/tool';
import * as Util from './util';
export class Boundary extends ToolsView.ToolItem {
    onRender() {
        Dom.addClass(this.container, this.prefixClassName('cell-tool-boundary'));
        if (this.options.attrs) {
            const _a = this.options.attrs, { class: className } = _a, attrs = __rest(_a, ["class"]);
            Dom.attr(this.container, Dom.kebablizeAttrs(attrs));
            if (className) {
                Dom.addClass(this.container, className);
            }
        }
        this.update();
    }
    update() {
        const view = this.cellView;
        const options = this.options;
        const { useCellGeometry, rotate } = options;
        const padding = NumberExt.normalizeSides(options.padding);
        let bbox = Util.getViewBBox(view, useCellGeometry).moveAndExpand({
            x: -padding.left,
            y: -padding.top,
            width: padding.left + padding.right,
            height: padding.top + padding.bottom,
        });
        const cell = view.cell;
        if (cell.isNode()) {
            const angle = cell.getAngle();
            if (angle) {
                if (rotate) {
                    const origin = cell.getBBox().getCenter();
                    Dom.rotate(this.container, angle, origin.x, origin.y, {
                        absolute: true,
                    });
                }
                else {
                    bbox = bbox.bbox(angle);
                }
            }
        }
        Dom.attr(this.container, bbox.toJSON());
        return this;
    }
}
(function (Boundary) {
    Boundary.config({
        name: 'boundary',
        tagName: 'rect',
        padding: 10,
        attrs: {
            fill: 'none',
            stroke: '#333',
            'stroke-width': 0.5,
            'stroke-dasharray': '5, 5',
            'pointer-events': 'none',
        },
    });
})(Boundary || (Boundary = {}));
//# sourceMappingURL=boundary.js.map