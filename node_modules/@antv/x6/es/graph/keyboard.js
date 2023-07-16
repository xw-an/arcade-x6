var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Mousetrap from 'mousetrap';
import { Dom, FunctionExt } from '../util';
import { Disposable } from '../common';
export class Keyboard extends Disposable {
    constructor(options) {
        super();
        this.options = options;
        const scroller = this.graph.scroller.widget;
        this.container = scroller ? scroller.container : this.graph.container;
        if (options.global) {
            this.target = document;
        }
        else {
            this.target = this.container;
            if (!this.disabled) {
                // ensure the container focusable
                this.target.setAttribute('tabindex', '-1');
            }
            // change to mouseup event，prevent page stalling caused by focus
            this.graph.on('cell:mouseup', this.focus, this);
            this.graph.on('blank:mouseup', this.focus, this);
        }
        this.mousetrap = Keyboard.createMousetrap(this);
    }
    get graph() {
        return this.options.graph;
    }
    get disabled() {
        return this.options.enabled !== true;
    }
    enable() {
        if (this.disabled) {
            this.options.enabled = true;
            this.graph.options.keyboard.enabled = true;
            if (this.target instanceof HTMLElement) {
                this.target.setAttribute('tabindex', '-1');
            }
        }
    }
    disable() {
        if (!this.disabled) {
            this.options.enabled = false;
            this.graph.options.keyboard.enabled = false;
            if (this.target instanceof HTMLElement) {
                this.target.removeAttribute('tabindex');
            }
        }
    }
    on(keys, callback, action) {
        this.mousetrap.bind(this.getKeys(keys), callback, action);
    }
    off(keys, action) {
        this.mousetrap.unbind(this.getKeys(keys), action);
    }
    focus(e) {
        const isInputEvent = this.isInputEvent(e.e);
        if (isInputEvent) {
            return;
        }
        const target = this.target;
        target.focus({
            preventScroll: true,
        });
    }
    getKeys(keys) {
        return (Array.isArray(keys) ? keys : [keys]).map((key) => this.formatkey(key));
    }
    formatkey(key) {
        const formated = key
            .toLowerCase()
            .replace(/\s/g, '')
            .replace('delete', 'del')
            .replace('cmd', 'command');
        const formatFn = this.options.format;
        if (formatFn) {
            return FunctionExt.call(formatFn, this.graph, formated);
        }
        return formated;
    }
    isGraphEvent(e) {
        const target = (e.srcElement || e.target);
        const currentTarget = e.currentTarget;
        if (target) {
            if (target === this.target ||
                currentTarget === this.target ||
                target === document.body) {
                return true;
            }
            return Dom.contains(this.container, target);
        }
        return false;
    }
    isInputEvent(e) {
        var _a;
        const target = e.target;
        const tagName = (_a = target === null || target === void 0 ? void 0 : target.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        return ['input', 'textarea'].includes(tagName);
    }
    isEnabledForEvent(e) {
        const allowed = !this.disabled && this.isGraphEvent(e);
        const isInputEvent = this.isInputEvent(e);
        if (allowed) {
            const code = e.keyCode || e.which;
            if (isInputEvent && (code === 8 || code === 46)) {
                return false;
            }
            if (this.options.guard) {
                return FunctionExt.call(this.options.guard, this.graph, e);
            }
        }
        return allowed;
    }
    dispose() {
        this.mousetrap.reset();
    }
}
__decorate([
    Disposable.dispose()
], Keyboard.prototype, "dispose", null);
(function (Keyboard) {
    function createMousetrap(keyboard) {
        const mousetrap = new Mousetrap(keyboard.target);
        const stopCallback = mousetrap.stopCallback;
        mousetrap.stopCallback = (e, elem, combo) => {
            if (keyboard.isEnabledForEvent(e)) {
                if (stopCallback) {
                    return stopCallback.call(mousetrap, e, elem, combo);
                }
                return false;
            }
            return true;
        };
        return mousetrap;
    }
    Keyboard.createMousetrap = createMousetrap;
})(Keyboard || (Keyboard = {}));
//# sourceMappingURL=keyboard.js.map