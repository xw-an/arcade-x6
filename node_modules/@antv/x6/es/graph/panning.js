var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ModifierKey } from '../types';
import { Dom } from '../util';
import { Base } from './base';
export class PanningManager extends Base {
    get widgetOptions() {
        return this.options.panning;
    }
    get pannable() {
        return this.widgetOptions && this.widgetOptions.enabled === true;
    }
    init() {
        this.startListening();
        this.updateClassName();
    }
    startListening() {
        const eventTypes = this.widgetOptions.eventTypes;
        if (!eventTypes) {
            return;
        }
        if (eventTypes.includes('leftMouseDown')) {
            this.graph.on('blank:mousedown', this.preparePanning, this);
            this.graph.on('node:unhandled:mousedown', this.preparePanning, this);
            this.graph.on('edge:unhandled:mousedown', this.preparePanning, this);
        }
        if (eventTypes.includes('rightMouseDown')) {
            this.onRightMouseDown = this.onRightMouseDown.bind(this);
            this.view.$(this.graph.container).on('mousedown', this.onRightMouseDown);
        }
        if (eventTypes.includes('mouseWheel')) {
            this.mousewheelHandle = new Dom.MouseWheelHandle(this.graph.container, this.onMouseWheel.bind(this), this.allowMouseWheel.bind(this));
            this.mousewheelHandle.enable();
        }
    }
    stopListening() {
        const eventTypes = this.widgetOptions.eventTypes;
        if (!eventTypes) {
            return;
        }
        if (eventTypes.includes('leftMouseDown')) {
            this.graph.off('blank:mousedown', this.preparePanning, this);
            this.graph.off('node:unhandled:mousedown', this.preparePanning, this);
            this.graph.off('edge:unhandled:mousedown', this.preparePanning, this);
        }
        if (eventTypes.includes('rightMouseDown')) {
            this.view.$(this.graph.container).off('mousedown', this.onRightMouseDown);
        }
        if (eventTypes.includes('mouseWheel')) {
            if (this.mousewheelHandle) {
                this.mousewheelHandle.disable();
            }
        }
    }
    preparePanning({ e }) {
        if (this.allowPanning(e, true) ||
            (this.allowPanning(e) && !this.graph.selection.allowRubberband(e, true))) {
            this.startPanning(e);
        }
    }
    allowPanning(e, strict) {
        return (this.pannable &&
            ModifierKey.isMatch(e, this.widgetOptions.modifiers, strict) &&
            this.graph.hook.allowPanning(e));
    }
    startPanning(evt) {
        const e = this.view.normalizeEvent(evt);
        this.clientX = e.clientX;
        this.clientY = e.clientY;
        this.panning = true;
        this.updateClassName();
        this.view.$(document.body).on({
            'mousemove.panning touchmove.panning': this.pan.bind(this),
            'mouseup.panning touchend.panning': this.stopPanning.bind(this),
            'mouseleave.panning': this.stopPanning.bind(this),
        });
        this.view.$(window).on('mouseup.panning', this.stopPanning.bind(this));
    }
    pan(evt) {
        const e = this.view.normalizeEvent(evt);
        const dx = e.clientX - this.clientX;
        const dy = e.clientY - this.clientY;
        this.clientX = e.clientX;
        this.clientY = e.clientY;
        const ts = this.graph.transform.getTranslation();
        const tx = ts.tx + dx;
        const ty = ts.ty + dy;
        this.graph.transform.translate(tx, ty, { ui: true });
    }
    // eslint-disable-next-line
    stopPanning(e) {
        this.panning = false;
        this.updateClassName();
        this.view.$(document.body).off('.panning');
        this.view.$(window).off('.panning');
    }
    updateClassName() {
        const container = this.view.container;
        const panning = this.view.prefixClassName('graph-panning');
        const pannable = this.view.prefixClassName('graph-pannable');
        if (this.pannable) {
            if (this.panning) {
                Dom.addClass(container, panning);
                Dom.removeClass(container, pannable);
            }
            else {
                Dom.removeClass(container, panning);
                Dom.addClass(container, pannable);
            }
        }
        else {
            Dom.removeClass(container, panning);
            Dom.removeClass(container, pannable);
        }
    }
    onRightMouseDown(e) {
        if (e.button === 2 && this.allowPanning(e, true)) {
            this.startPanning(e);
        }
    }
    allowMouseWheel(e) {
        return this.pannable && !e.ctrlKey;
    }
    onMouseWheel(e, deltaX, deltaY) {
        if (!e.ctrlKey) {
            this.graph.translateBy(-deltaX, -deltaY);
        }
    }
    autoPanning(x, y) {
        const buffer = 10;
        const graphArea = this.graph.getGraphArea();
        let dx = 0;
        let dy = 0;
        if (x <= graphArea.left + buffer) {
            dx = -buffer;
        }
        if (y <= graphArea.top + buffer) {
            dy = -buffer;
        }
        if (x >= graphArea.right - buffer) {
            dx = buffer;
        }
        if (y >= graphArea.bottom - buffer) {
            dy = buffer;
        }
        if (dx !== 0 || dy !== 0) {
            this.graph.translateBy(-dx, -dy);
        }
    }
    enablePanning() {
        if (!this.pannable) {
            this.widgetOptions.enabled = true;
            this.updateClassName();
        }
    }
    disablePanning() {
        if (this.pannable) {
            this.widgetOptions.enabled = false;
            this.updateClassName();
        }
    }
    dispose() {
        this.stopListening();
    }
}
__decorate([
    Base.dispose()
], PanningManager.prototype, "dispose", null);
//# sourceMappingURL=panning.js.map