var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ModifierKey } from '../types';
import { Dom, NumberExt } from '../util';
import { Disposable } from '../common';
export class MouseWheel extends Disposable {
    constructor(options) {
        super();
        this.options = options;
        this.cumulatedFactor = 1;
        const scroller = this.graph.scroller.widget;
        this.container = scroller ? scroller.container : this.graph.container;
        this.target = this.options.global ? document : this.container;
        this.mousewheelHandle = new Dom.MouseWheelHandle(this.target, this.onMouseWheel.bind(this), this.allowMouseWheel.bind(this));
        if (this.options.enabled) {
            this.enable(true);
        }
    }
    get graph() {
        return this.options.graph;
    }
    get disabled() {
        return this.options.enabled !== true;
    }
    enable(force) {
        if (this.disabled || force) {
            this.options.enabled = true;
            this.graph.options.mousewheel.enabled = true;
            this.mousewheelHandle.enable();
        }
    }
    disable() {
        if (!this.disabled) {
            this.options.enabled = false;
            this.graph.options.mousewheel.enabled = false;
            this.mousewheelHandle.disable();
        }
    }
    allowMouseWheel(evt) {
        const e = (evt.originalEvent || evt);
        const guard = this.options.guard;
        return ((guard == null || guard.call(this.graph, e)) &&
            ModifierKey.isMatch(e, this.options.modifiers));
    }
    onMouseWheel(evt) {
        const e = (evt.originalEvent || evt);
        const guard = this.options.guard;
        if ((guard == null || guard.call(this.graph, e)) &&
            ModifierKey.isMatch(e, this.options.modifiers)) {
            const factor = this.options.factor || 1.2;
            if (this.currentScale == null) {
                this.startPos = { x: evt.clientX, y: evt.clientY };
                this.currentScale = this.graph.scroller.widget
                    ? this.graph.scroller.widget.zoom()
                    : this.graph.transform.getScale().sx;
            }
            const delta = evt.deltaY;
            if (delta < 0) {
                // zoomin
                // ------
                // Switches to 1% zoom steps below 15%
                if (this.currentScale < 0.15) {
                    this.cumulatedFactor = (this.currentScale + 0.01) / this.currentScale;
                }
                else {
                    // Uses to 5% zoom steps for better grid rendering in
                    // webkit and to avoid rounding errors for zoom steps
                    this.cumulatedFactor =
                        Math.round(this.currentScale * factor * 20) / 20 / this.currentScale;
                }
            }
            else {
                // zoomout
                // -------
                // Switches to 1% zoom steps below 15%
                if (this.currentScale <= 0.15) {
                    this.cumulatedFactor = (this.currentScale - 0.01) / this.currentScale;
                }
                else {
                    // Uses to 5% zoom steps for better grid rendering in
                    // webkit and to avoid rounding errors for zoom steps
                    this.cumulatedFactor =
                        Math.round(this.currentScale * (1 / factor) * 20) /
                            20 /
                            this.currentScale;
                }
            }
            this.cumulatedFactor = Math.max(0.01, Math.min(this.currentScale * this.cumulatedFactor, 160) /
                this.currentScale);
            const scroller = this.graph.scroller.widget;
            const currentScale = this.currentScale;
            let targetScale = this.graph.transform.clampScale(currentScale * this.cumulatedFactor);
            const minScale = this.options.minScale || Number.MIN_SAFE_INTEGER;
            const maxScale = this.options.maxScale || Number.MAX_SAFE_INTEGER;
            targetScale = NumberExt.clamp(targetScale, minScale, maxScale);
            if (targetScale !== currentScale) {
                if (scroller) {
                    if (this.options.zoomAtMousePosition) {
                        const origin = this.graph.coord.clientToLocalPoint(this.startPos);
                        scroller.zoom(targetScale, {
                            absolute: true,
                            center: origin.clone(),
                        });
                    }
                    else {
                        scroller.zoom(targetScale, { absolute: true });
                    }
                }
                else {
                    if (this.options.zoomAtMousePosition) {
                        const origin = this.graph.coord.clientToGraphPoint(this.startPos);
                        this.graph.transform.zoom(targetScale, {
                            absolute: true,
                            center: origin.clone(),
                            ui: true,
                        });
                    }
                    else {
                        this.graph.transform.zoom(targetScale, { absolute: true, ui: true });
                    }
                }
            }
            this.currentScale = null;
            this.cumulatedFactor = 1;
        }
    }
    dispose() {
        this.disable();
    }
}
__decorate([
    Disposable.dispose()
], MouseWheel.prototype, "dispose", null);
//# sourceMappingURL=mousewheel.js.map