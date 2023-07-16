import { Util } from '../../global';
import { NumberExt } from '../../util';
import { Angle, Point } from '../../geometry';
import { Widget } from '../common';
import { notify } from './util';
export class Transform extends Widget {
    get node() {
        return this.cell;
    }
    get containerClassName() {
        return this.prefixClassName('widget-transform');
    }
    get resizeClassName() {
        return `${this.containerClassName}-resize`;
    }
    get rotateClassName() {
        return `${this.containerClassName}-rotate`;
    }
    init(options) {
        this.options = Object.assign(Object.assign({}, Private.defaultOptions), options);
        this.render();
        this.startListening();
    }
    startListening() {
        this.delegateEvents({
            [`mousedown .${this.resizeClassName}`]: 'startResizing',
            [`touchstart .${this.resizeClassName}`]: 'startResizing',
            [`mousedown .${this.rotateClassName}`]: 'startRotating',
            [`touchstart .${this.rotateClassName}`]: 'startRotating',
        });
        this.model.on('*', this.update, this);
        this.graph.on('scale', this.update, this);
        this.graph.on('translate', this.update, this);
        this.node.on('removed', this.remove, this);
        this.model.on('reseted', this.remove, this);
        this.view.on('cell:knob:mousedown', this.onKnobMouseDown, this);
        this.view.on('cell:knob:mouseup', this.onKnobMouseUp, this);
        super.startListening();
    }
    stopListening() {
        this.undelegateEvents();
        this.model.off('*', this.update, this);
        this.graph.off('scale', this.update, this);
        this.graph.off('translate', this.update, this);
        this.node.off('removed', this.remove, this);
        this.model.off('reseted', this.remove, this);
        this.view.off('cell:knob:mousedown', this.onKnobMouseDown, this);
        this.view.off('cell:knob:mouseup', this.onKnobMouseUp, this);
        super.stopListening();
    }
    renderHandles() {
        this.container = document.createElement('div');
        this.$container = this.$(this.container);
        const $knob = this.$('<div/>').prop('draggable', false);
        const $rotate = $knob.clone().addClass(this.rotateClassName);
        const $resizes = Private.POSITIONS.map((pos) => {
            return $knob
                .clone()
                .addClass(this.resizeClassName)
                .attr('data-position', pos);
        });
        this.empty();
        this.$container.append($resizes, $rotate);
    }
    render() {
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
    }
    update() {
        const ctm = this.graph.matrix();
        const bbox = this.node.getBBox();
        bbox.x *= ctm.a;
        bbox.x += ctm.e;
        bbox.y *= ctm.d;
        bbox.y += ctm.f;
        bbox.width *= ctm.a;
        bbox.height *= ctm.d;
        const angle = Angle.normalize(this.node.getAngle());
        const transform = angle !== 0 ? `rotate(${angle}deg)` : '';
        this.$container.css({
            transform,
            width: bbox.width,
            height: bbox.height,
            left: bbox.x,
            top: bbox.y,
        });
        this.updateResizerDirections();
        return this;
    }
    remove() {
        this.view.removeClass(Private.NODE_CLS);
        return super.remove();
    }
    onKnobMouseDown() {
        this.startHandle();
    }
    onKnobMouseUp() {
        this.stopHandle();
    }
    updateResizerDirections() {
        // Update the directions on the resizer divs while the node being rotated.
        // The directions are represented by cardinal points (N,S,E,W). For example
        // the div originally pointed to north needs to be changed to point to south
        // if the node was rotated by 180 degrees.
        const angle = Angle.normalize(this.node.getAngle());
        const shift = Math.floor(angle * (Private.DIRECTIONS.length / 360));
        if (shift !== this.prevShift) {
            // Create the current directions array based on the calculated shift.
            const directions = Private.DIRECTIONS.slice(shift).concat(Private.DIRECTIONS.slice(0, shift));
            const className = (dir) => `${this.containerClassName}-cursor-${dir}`;
            this.$container
                .find(`.${this.resizeClassName}`)
                .removeClass(Private.DIRECTIONS.map((dir) => className(dir)).join(' '))
                .each((index, elem) => {
                this.$(elem).addClass(className(directions[index]));
            });
            this.prevShift = shift;
        }
    }
    getTrueDirection(dir) {
        const angle = Angle.normalize(this.node.getAngle());
        let index = Private.POSITIONS.indexOf(dir);
        index += Math.floor(angle * (Private.POSITIONS.length / 360));
        index %= Private.POSITIONS.length;
        return Private.POSITIONS[index];
    }
    toValidResizeDirection(dir) {
        return ({
            top: 'top-left',
            bottom: 'bottom-right',
            left: 'bottom-left',
            right: 'top-right',
        }[dir] || dir);
    }
    startResizing(evt) {
        evt.stopPropagation();
        this.model.startBatch('resize', { cid: this.cid });
        const dir = this.$(evt.target).attr('data-position');
        const view = this.graph.findViewByCell(this.node);
        this.prepareResizing(evt, dir);
        this.startAction(evt);
        notify('node:resize:mousedown', evt, view);
    }
    prepareResizing(evt, relativeDirection) {
        const trueDirection = this.getTrueDirection(relativeDirection);
        let rx = 0;
        let ry = 0;
        relativeDirection.split('-').forEach((direction) => {
            rx = { left: -1, right: 1 }[direction] || rx;
            ry = { top: -1, bottom: 1 }[direction] || ry;
        });
        const direction = this.toValidResizeDirection(relativeDirection);
        const selector = {
            'top-right': 'bottomLeft',
            'top-left': 'bottomRight',
            'bottom-left': 'topRight',
            'bottom-right': 'topLeft',
        }[direction];
        const angle = Angle.normalize(this.node.getAngle());
        this.setEventData(evt, {
            selector,
            direction,
            trueDirection,
            relativeDirection,
            angle,
            resizeX: rx,
            resizeY: ry,
            action: 'resizing',
        });
    }
    startRotating(evt) {
        evt.stopPropagation();
        this.model.startBatch('rotate', { cid: this.cid });
        const view = this.graph.findViewByCell(this.node);
        const center = this.node.getBBox().getCenter();
        const e = this.normalizeEvent(evt);
        const client = this.graph.snapToGrid(e.clientX, e.clientY);
        this.setEventData(evt, {
            center,
            action: 'rotating',
            angle: Angle.normalize(this.node.getAngle()),
            start: Point.create(client).theta(center),
        });
        this.startAction(evt);
        notify('node:rotate:mousedown', evt, view);
    }
    onMouseMove(evt) {
        const view = this.graph.findViewByCell(this.node);
        let data = this.getEventData(evt);
        if (data.action) {
            const e = this.normalizeEvent(evt);
            let clientX = e.clientX;
            let clientY = e.clientY;
            const scroller = this.graph.scroller.widget;
            const restrict = this.options.restrictedResizing;
            if (restrict === true || typeof restrict === 'number') {
                const factor = restrict === true ? 0 : restrict;
                const fix = scroller ? Math.max(factor, 8) : factor;
                const rect = this.graph.container.getBoundingClientRect();
                clientX = NumberExt.clamp(clientX, rect.left + fix, rect.right - fix);
                clientY = NumberExt.clamp(clientY, rect.top + fix, rect.bottom - fix);
            }
            else if (this.options.autoScrollOnResizing && scroller) {
                scroller.autoScroll(clientX, clientY);
            }
            const pos = this.graph.snapToGrid(clientX, clientY);
            const gridSize = this.graph.getGridSize();
            const node = this.node;
            const options = this.options;
            if (data.action === 'resizing') {
                data = data;
                if (!data.resized) {
                    if (view) {
                        view.addClass('node-resizing');
                        notify('node:resize', evt, view);
                    }
                    data.resized = true;
                }
                const currentBBox = node.getBBox();
                const requestedSize = Point.create(pos)
                    .rotate(data.angle, currentBBox.getCenter())
                    .diff(currentBBox[data.selector]);
                let width = data.resizeX
                    ? requestedSize.x * data.resizeX
                    : currentBBox.width;
                let height = data.resizeY
                    ? requestedSize.y * data.resizeY
                    : currentBBox.height;
                const rawWidth = width;
                const rawHeight = height;
                width = Util.snapToGrid(width, gridSize);
                height = Util.snapToGrid(height, gridSize);
                width = Math.max(width, options.minWidth || gridSize);
                height = Math.max(height, options.minHeight || gridSize);
                width = Math.min(width, options.maxWidth || Infinity);
                height = Math.min(height, options.maxHeight || Infinity);
                if (options.preserveAspectRatio) {
                    const candidateWidth = (currentBBox.width * height) / currentBBox.height;
                    const candidateHeight = (currentBBox.height * width) / currentBBox.width;
                    if (width < candidateWidth) {
                        height = candidateHeight;
                    }
                    else {
                        width = candidateWidth;
                    }
                }
                const relativeDirection = data.relativeDirection;
                if (options.allowReverse &&
                    (rawWidth <= -width || rawHeight <= -height)) {
                    let reverted;
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
                    const revertedDir = reverted;
                    this.stopHandle();
                    const $handle = this.$container.find(`.${this.resizeClassName}[data-position="${revertedDir}"]`);
                    this.startHandle($handle[0]);
                    this.prepareResizing(evt, revertedDir);
                    this.onMouseMove(evt);
                }
                if (currentBBox.width !== width || currentBBox.height !== height) {
                    const resizeOptions = {
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
                    notify('node:resizing', evt, view);
                }
                notify('node:resize:mousemove', evt, view);
            }
            else if (data.action === 'rotating') {
                data = data;
                if (!data.rotated) {
                    if (view) {
                        view.addClass('node-rotating');
                        notify('node:rotate', evt, view);
                    }
                    data.rotated = true;
                }
                const currentAngle = node.getAngle();
                const theta = data.start - Point.create(pos).theta(data.center);
                let target = data.angle + theta;
                if (options.rotateGrid) {
                    target = Util.snapToGrid(target, options.rotateGrid);
                }
                target = Angle.normalize(target);
                if (currentAngle !== target) {
                    node.rotate(target, { absolute: true });
                    notify('node:rotating', evt, view);
                }
                notify('node:rotate:mousemove', evt, view);
            }
        }
    }
    onMouseUp(evt) {
        const view = this.graph.findViewByCell(this.node);
        const data = this.getEventData(evt);
        if (data.action) {
            this.stopAction(evt);
            this.model.stopBatch(data.action === 'resizing' ? 'resize' : 'rotate', {
                cid: this.cid,
            });
            if (data.action === 'resizing') {
                notify('node:resize:mouseup', evt, view);
            }
            else if (data.action === 'rotating') {
                notify('node:rotate:mouseup', evt, view);
            }
        }
    }
    startHandle(handle) {
        this.handle = handle || null;
        this.$container.addClass(`${this.containerClassName}-active`);
        if (handle) {
            this.$(handle).addClass(`${this.containerClassName}-active-handle`);
            const pos = handle.getAttribute('data-position');
            if (pos) {
                const dir = Private.DIRECTIONS[Private.POSITIONS.indexOf(pos)];
                this.$container.addClass(`${this.containerClassName}-cursor-${dir}`);
            }
        }
    }
    stopHandle() {
        this.$container.removeClass(`${this.containerClassName}-active`);
        if (this.handle) {
            this.$(this.handle).removeClass(`${this.containerClassName}-active-handle`);
            const pos = this.handle.getAttribute('data-position');
            if (pos) {
                const dir = Private.DIRECTIONS[Private.POSITIONS.indexOf(pos)];
                this.$container.removeClass(`${this.containerClassName}-cursor-${dir}`);
            }
            this.handle = null;
        }
    }
    startAction(evt) {
        this.startHandle(evt.target);
        this.graph.view.undelegateEvents();
        this.delegateDocumentEvents(Private.documentEvents, evt.data);
    }
    stopAction(evt) {
        this.stopHandle();
        this.undelegateDocumentEvents();
        this.graph.view.delegateEvents();
        const view = this.graph.findViewByCell(this.node);
        const data = this.getEventData(evt);
        if (view) {
            view.removeClass(`node-${data.action}`);
            if (data.action === 'resizing' && data.resized) {
                notify('node:resized', evt, view);
            }
            else if (data.action === 'rotating' && data.rotated) {
                notify('node:rotated', evt, view);
            }
        }
    }
}
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