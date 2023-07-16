var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Base } from './base';
import { SizeSensor } from '../util';
export class SizeManager extends Base {
    hasScroller() {
        return this.graph.scroller.widget != null;
    }
    getContainer() {
        return this.hasScroller()
            ? this.graph.scroller.widget.container
            : this.graph.container;
    }
    init() {
        const autoResize = this.options.autoResize;
        if (autoResize) {
            const target = typeof autoResize === 'boolean'
                ? this.getContainer()
                : autoResize;
            SizeSensor.bind(target, () => {
                const container = this.getContainer();
                // container is border-box
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                this.resize(width, height);
            });
        }
    }
    resize(width, height) {
        if (this.hasScroller()) {
            this.resizeScroller(width, height);
        }
        else {
            this.resizeGraph(width, height);
        }
    }
    resizeGraph(width, height) {
        this.graph.transform.resize(width, height);
    }
    resizeScroller(width, height) {
        this.graph.scroller.resize(width, height);
    }
    resizePage(width, height) {
        const instance = this.graph.scroller.widget;
        if (instance) {
            instance.updatePageSize(width, height);
        }
    }
    dispose() {
        SizeSensor.clear(this.getContainer());
    }
}
__decorate([
    Base.dispose()
], SizeManager.prototype, "dispose", null);
//# sourceMappingURL=size.js.map