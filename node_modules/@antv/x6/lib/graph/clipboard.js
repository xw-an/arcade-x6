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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClipboardManager = void 0;
var base_1 = require("./base");
var ClipboardManager = /** @class */ (function (_super) {
    __extends(ClipboardManager, _super);
    function ClipboardManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ClipboardManager.prototype, "commonOptions", {
        get: function () {
            var _a = this.instanceOptions, enabled = _a.enabled, others = __rest(_a, ["enabled"]);
            return others;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClipboardManager.prototype, "instanceOptions", {
        get: function () {
            return this.options.clipboard;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClipboardManager.prototype, "cells", {
        get: function () {
            return this.widget.cells;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClipboardManager.prototype, "disabled", {
        get: function () {
            return this.instanceOptions.enabled !== true;
        },
        enumerable: false,
        configurable: true
    });
    ClipboardManager.prototype.init = function () {
        this.widget = this.graph.hook.createClipboard();
        this.widget.deserialize(this.instanceOptions);
    };
    ClipboardManager.prototype.enable = function () {
        if (this.disabled) {
            this.instanceOptions.enabled = true;
        }
    };
    ClipboardManager.prototype.disable = function () {
        if (!this.disabled) {
            this.instanceOptions.enabled = false;
        }
    };
    ClipboardManager.prototype.copy = function (cells, options) {
        if (options === void 0) { options = {}; }
        if (!this.disabled) {
            this.widget.copy(cells, this.graph, __assign(__assign({}, this.commonOptions), options));
            this.graph.trigger('clipboard:changed', { cells: cells });
        }
    };
    ClipboardManager.prototype.cut = function (cells, options) {
        if (options === void 0) { options = {}; }
        if (!this.disabled) {
            this.widget.cut(cells, this.graph, __assign(__assign({}, this.commonOptions), options));
            this.graph.trigger('clipboard:changed', { cells: cells });
        }
    };
    ClipboardManager.prototype.paste = function (options, graph) {
        if (options === void 0) { options = {}; }
        if (graph === void 0) { graph = this.graph; }
        if (!this.disabled) {
            return this.widget.paste(graph, __assign(__assign({}, this.commonOptions), options));
        }
        return [];
    };
    ClipboardManager.prototype.clean = function (force) {
        if (!this.disabled || force) {
            this.widget.clean();
            this.graph.trigger('clipboard:changed', { cells: [] });
        }
    };
    ClipboardManager.prototype.isEmpty = function () {
        return this.widget.isEmpty();
    };
    ClipboardManager.prototype.dispose = function () {
        this.clean(true);
    };
    __decorate([
        base_1.Base.dispose()
    ], ClipboardManager.prototype, "dispose", null);
    return ClipboardManager;
}(base_1.Base));
exports.ClipboardManager = ClipboardManager;
//# sourceMappingURL=clipboard.js.map