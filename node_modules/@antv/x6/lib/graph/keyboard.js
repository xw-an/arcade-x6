"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keyboard = void 0;
var mousetrap_1 = __importDefault(require("mousetrap"));
var util_1 = require("../util");
var common_1 = require("../common");
var Keyboard = /** @class */ (function (_super) {
    __extends(Keyboard, _super);
    function Keyboard(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        var scroller = _this.graph.scroller.widget;
        _this.container = scroller ? scroller.container : _this.graph.container;
        if (options.global) {
            _this.target = document;
        }
        else {
            _this.target = _this.container;
            if (!_this.disabled) {
                // ensure the container focusable
                _this.target.setAttribute('tabindex', '-1');
            }
            // change to mouseup event，prevent page stalling caused by focus
            _this.graph.on('cell:mouseup', _this.focus, _this);
            _this.graph.on('blank:mouseup', _this.focus, _this);
        }
        _this.mousetrap = Keyboard.createMousetrap(_this);
        return _this;
    }
    Object.defineProperty(Keyboard.prototype, "graph", {
        get: function () {
            return this.options.graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Keyboard.prototype, "disabled", {
        get: function () {
            return this.options.enabled !== true;
        },
        enumerable: false,
        configurable: true
    });
    Keyboard.prototype.enable = function () {
        if (this.disabled) {
            this.options.enabled = true;
            this.graph.options.keyboard.enabled = true;
            if (this.target instanceof HTMLElement) {
                this.target.setAttribute('tabindex', '-1');
            }
        }
    };
    Keyboard.prototype.disable = function () {
        if (!this.disabled) {
            this.options.enabled = false;
            this.graph.options.keyboard.enabled = false;
            if (this.target instanceof HTMLElement) {
                this.target.removeAttribute('tabindex');
            }
        }
    };
    Keyboard.prototype.on = function (keys, callback, action) {
        this.mousetrap.bind(this.getKeys(keys), callback, action);
    };
    Keyboard.prototype.off = function (keys, action) {
        this.mousetrap.unbind(this.getKeys(keys), action);
    };
    Keyboard.prototype.focus = function (e) {
        var isInputEvent = this.isInputEvent(e.e);
        if (isInputEvent) {
            return;
        }
        var target = this.target;
        target.focus({
            preventScroll: true,
        });
    };
    Keyboard.prototype.getKeys = function (keys) {
        var _this = this;
        return (Array.isArray(keys) ? keys : [keys]).map(function (key) {
            return _this.formatkey(key);
        });
    };
    Keyboard.prototype.formatkey = function (key) {
        var formated = key
            .toLowerCase()
            .replace(/\s/g, '')
            .replace('delete', 'del')
            .replace('cmd', 'command');
        var formatFn = this.options.format;
        if (formatFn) {
            return util_1.FunctionExt.call(formatFn, this.graph, formated);
        }
        return formated;
    };
    Keyboard.prototype.isGraphEvent = function (e) {
        var target = (e.srcElement || e.target);
        var currentTarget = e.currentTarget;
        if (target) {
            if (target === this.target ||
                currentTarget === this.target ||
                target === document.body) {
                return true;
            }
            return util_1.Dom.contains(this.container, target);
        }
        return false;
    };
    Keyboard.prototype.isInputEvent = function (e) {
        var _a;
        var target = e.target;
        var tagName = (_a = target === null || target === void 0 ? void 0 : target.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        return ['input', 'textarea'].includes(tagName);
    };
    Keyboard.prototype.isEnabledForEvent = function (e) {
        var allowed = !this.disabled && this.isGraphEvent(e);
        var isInputEvent = this.isInputEvent(e);
        if (allowed) {
            var code = e.keyCode || e.which;
            if (isInputEvent && (code === 8 || code === 46)) {
                return false;
            }
            if (this.options.guard) {
                return util_1.FunctionExt.call(this.options.guard, this.graph, e);
            }
        }
        return allowed;
    };
    Keyboard.prototype.dispose = function () {
        this.mousetrap.reset();
    };
    __decorate([
        common_1.Disposable.dispose()
    ], Keyboard.prototype, "dispose", null);
    return Keyboard;
}(common_1.Disposable));
exports.Keyboard = Keyboard;
(function (Keyboard) {
    function createMousetrap(keyboard) {
        var mousetrap = new mousetrap_1.default(keyboard.target);
        var stopCallback = mousetrap.stopCallback;
        mousetrap.stopCallback = function (e, elem, combo) {
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
})(Keyboard = exports.Keyboard || (exports.Keyboard = {}));
exports.Keyboard = Keyboard;
//# sourceMappingURL=keyboard.js.map