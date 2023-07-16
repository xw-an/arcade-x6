import { Widget } from '../common';
import { Dom } from '../../util';
import { Angle, Point } from '../../geometry';
export class Knob extends Widget {
    get node() {
        return this.cell;
    }
    get metadata() {
        const meta = this.cell.prop('knob');
        if (Array.isArray(meta)) {
            if (this.options.index != null) {
                return meta[this.options.index];
            }
            return null;
        }
        return meta;
    }
    init(options) {
        this.options = Object.assign({}, options);
        this.render();
        this.startListening();
    }
    startListening() {
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
        super.startListening();
    }
    stopListening() {
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
        super.stopListening();
    }
    render() {
        this.container = document.createElement('div');
        Dom.addClass(this.container, this.prefixClassName('widget-knob'));
        if (this.options.className) {
            Dom.addClass(this.container, this.options.className);
        }
        this.view.addClass(Private.KNOB);
        this.graph.container.appendChild(this.container);
        this.update();
        return this;
    }
    remove() {
        this.view.removeClass(Private.KNOB);
        return super.remove();
    }
    update() {
        if (this.metadata) {
            const { update, position } = this.metadata;
            const args = {
                knob: this,
                cell: this.cell,
                node: this.node,
            };
            if (position) {
                const pos = position.call(this.graph, Object.assign({}, args));
                if (pos) {
                    const ctm = this.graph.matrix();
                    const bbox = this.node.getBBox();
                    const angle = Angle.normalize(this.node.getAngle());
                    const local = Point.create(pos);
                    if (angle !== 0) {
                        local.rotate(-angle, { x: bbox.width / 2, y: bbox.height / 2 });
                    }
                    local.translate(bbox).scale(ctm.a, ctm.d).translate(ctm.e, ctm.f);
                    this.container.style.left = `${local.x}px`;
                    this.container.style.top = `${local.y}px`;
                }
            }
            if (update) {
                update.call(this.graph, Object.assign({}, args));
            }
        }
    }
    hide() {
        this.container.style.display = 'none';
    }
    show() {
        this.container.style.display = '';
    }
    onTransform() {
        this.hide();
    }
    onTransformed() {
        this.show();
    }
    onKnobMouseDown({ knob }) {
        if (this.cid !== knob.cid) {
            this.hide();
        }
    }
    onKnobMouseUp() {
        this.show();
    }
    notify(name, evt) {
        if (this.view) {
            const e = this.view.normalizeEvent(evt);
            const localPoint = this.graph.snapToGrid(e.clientX, e.clientY);
            this.view.notify(`cell:${name}`, {
                e,
                view: this.view,
                node: this.node,
                cell: this.cell,
                x: localPoint.x,
                y: localPoint.y,
                knob: this,
            });
            if (this.cell.isNode()) {
                this.view.notify(`node:${name}`, {
                    e,
                    view: this.view,
                    node: this.node,
                    cell: this.cell,
                    x: localPoint.x,
                    y: localPoint.y,
                    knob: this,
                });
            }
            else if (this.cell.isEdge()) {
                this.view.notify(`edge:${name}`, {
                    e,
                    view: this.view,
                    edge: this.cell,
                    cell: this.cell,
                    x: localPoint.x,
                    y: localPoint.y,
                    knob: this,
                });
            }
        }
    }
    onMouseDown(e) {
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
                e,
                data: this.getEventData(e),
                knob: this,
                cell: this.cell,
                node: this.node,
            });
        }
        this.notify('knob:mousedown', e);
    }
    onMouseMove(e) {
        const data = this.getEventData(e);
        const view = this.graph.findViewByCell(this.node);
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
            const ctm = this.graph.matrix();
            const dx = (e.clientX - data.originX) / ctm.a;
            const dy = (e.clientY - data.originY) / ctm.d;
            const angle = this.node.getAngle();
            const delta = new Point(dx, dy).rotate(angle);
            this.metadata.onMouseMove.call(this.graph, {
                e,
                data,
                deltaX: delta.x,
                deltaY: delta.y,
                knob: this,
                cell: this.cell,
                node: this.node,
            });
        }
        this.notify('knobbing', e);
        this.notify('knob:mousemove', e);
    }
    onMouseUp(e) {
        this.undelegateDocumentEvents();
        this.graph.view.delegateEvents();
        const data = this.getEventData(e);
        const view = this.graph.findViewByCell(this.node);
        if (data.knobbing) {
            if (view) {
                view.removeClass(Private.KNOBBING);
            }
            if (this.metadata && this.metadata.onMouseUp) {
                this.metadata.onMouseUp.call(this.graph, {
                    e,
                    data,
                    knob: this,
                    cell: this.cell,
                    node: this.node,
                });
            }
            this.model.stopBatch('knob', { cid: this.cid });
            this.notify('knobbed', e);
        }
        this.notify('knob:mouseup', e);
    }
}
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