import { Point } from '../../geometry';
import { Dom, NumberExt, FunctionExt } from '../../util';
import { ToolsView } from '../../view/tool';
import * as Util from './util';
export class Button extends ToolsView.ToolItem {
    onRender() {
        Dom.addClass(this.container, this.prefixClassName('cell-tool-button'));
        this.update();
    }
    update() {
        this.updatePosition();
        return this;
    }
    updatePosition() {
        const view = this.cellView;
        const matrix = view.cell.isEdge()
            ? this.getEdgeMatrix()
            : this.getNodeMatrix();
        Dom.transform(this.container, matrix, { absolute: true });
    }
    getNodeMatrix() {
        const view = this.cellView;
        const options = this.options;
        let { x = 0, y = 0 } = options;
        const { offset, useCellGeometry, rotate } = options;
        let bbox = Util.getViewBBox(view, useCellGeometry);
        const angle = view.cell.getAngle();
        if (!rotate) {
            bbox = bbox.bbox(angle);
        }
        let offsetX = 0;
        let offsetY = 0;
        if (typeof offset === 'number') {
            offsetX = offset;
            offsetY = offset;
        }
        else if (typeof offset === 'object') {
            offsetX = offset.x;
            offsetY = offset.y;
        }
        x = NumberExt.normalizePercentage(x, bbox.width);
        y = NumberExt.normalizePercentage(y, bbox.height);
        let matrix = Dom.createSVGMatrix().translate(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        if (rotate) {
            matrix = matrix.rotate(angle);
        }
        matrix = matrix.translate(x + offsetX - bbox.width / 2, y + offsetY - bbox.height / 2);
        return matrix;
    }
    getEdgeMatrix() {
        const view = this.cellView;
        const options = this.options;
        const { offset = 0, distance = 0, rotate } = options;
        let tangent;
        let position;
        let angle;
        const d = NumberExt.normalizePercentage(distance, 1);
        if (d >= 0 && d <= 1) {
            tangent = view.getTangentAtRatio(d);
        }
        else {
            tangent = view.getTangentAtLength(d);
        }
        if (tangent) {
            position = tangent.start;
            angle = tangent.vector().vectorAngle(new Point(1, 0)) || 0;
        }
        else {
            position = view.getConnection().start;
            angle = 0;
        }
        let matrix = Dom.createSVGMatrix()
            .translate(position.x, position.y)
            .rotate(angle);
        if (typeof offset === 'object') {
            matrix = matrix.translate(offset.x || 0, offset.y || 0);
        }
        else {
            matrix = matrix.translate(0, offset);
        }
        if (!rotate) {
            matrix = matrix.rotate(-angle);
        }
        return matrix;
    }
    onMouseDown(e) {
        if (this.guard(e)) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        const onClick = this.options.onClick;
        if (typeof onClick === 'function') {
            FunctionExt.call(onClick, this.cellView, {
                e,
                view: this.cellView,
                cell: this.cellView.cell,
                btn: this,
            });
        }
    }
}
(function (Button) {
    Button.config({
        name: 'button',
        events: {
            mousedown: 'onMouseDown',
            touchstart: 'onMouseDown',
        },
    });
})(Button || (Button = {}));
(function (Button) {
    Button.Remove = Button.define({
        name: 'button-remove',
        markup: [
            {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                    r: 7,
                    fill: '#FF1D00',
                    cursor: 'pointer',
                },
            },
            {
                tagName: 'path',
                selector: 'icon',
                attrs: {
                    d: 'M -3 -3 3 3 M -3 3 3 -3',
                    fill: 'none',
                    stroke: '#FFFFFF',
                    'stroke-width': 2,
                    'pointer-events': 'none',
                },
            },
        ],
        distance: 60,
        offset: 0,
        onClick({ view, btn }) {
            btn.parent.remove();
            view.cell.remove({ ui: true, toolId: btn.cid });
        },
    });
})(Button || (Button = {}));
//# sourceMappingURL=button.js.map