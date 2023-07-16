var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Disablable } from '../../common';
export class AutoSave extends Disablable {
    constructor(options) {
        super();
        this.delay = 10;
        this.throttle = 2;
        this.threshold = 5;
        this.changeCount = 0;
        this.timestamp = 0;
        this.options = Object.assign(Object.assign({}, AutoSave.defaultOptions), options);
        this.graph.model.on('cell:change:*', this.onModelChanged, this);
    }
    get graph() {
        return this.options.graph;
    }
    onModelChanged() {
        if (this.disabled) {
            return;
        }
        const now = new Date().getTime();
        const dt = (now - this.timestamp) / 1000;
        if (dt > this.delay ||
            (this.changeCount >= this.threshold && dt > this.throttle)) {
            this.save();
            this.reset();
        }
        else {
            this.changeCount += 1;
        }
    }
    save() {
        this.trigger('save');
    }
    reset() {
        this.changeCount = 0;
        this.timestamp = new Date().getTime();
    }
    dispose() {
        this.graph.model.off('cell:change:*', this.onModelChanged, this);
    }
}
__decorate([
    Disablable.dispose()
], AutoSave.prototype, "dispose", null);
(function (AutoSave) {
    AutoSave.defaultOptions = {
        delay: 10,
        throttle: 2,
        threshold: 5,
    };
})(AutoSave || (AutoSave = {}));
//# sourceMappingURL=index.js.map