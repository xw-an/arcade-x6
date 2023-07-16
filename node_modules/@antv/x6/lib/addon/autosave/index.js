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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoSave = void 0;
var common_1 = require("../../common");
var AutoSave = /** @class */ (function (_super) {
    __extends(AutoSave, _super);
    function AutoSave(options) {
        var _this = _super.call(this) || this;
        _this.delay = 10;
        _this.throttle = 2;
        _this.threshold = 5;
        _this.changeCount = 0;
        _this.timestamp = 0;
        _this.options = __assign(__assign({}, AutoSave.defaultOptions), options);
        _this.graph.model.on('cell:change:*', _this.onModelChanged, _this);
        return _this;
    }
    Object.defineProperty(AutoSave.prototype, "graph", {
        get: function () {
            return this.options.graph;
        },
        enumerable: false,
        configurable: true
    });
    AutoSave.prototype.onModelChanged = function () {
        if (this.disabled) {
            return;
        }
        var now = new Date().getTime();
        var dt = (now - this.timestamp) / 1000;
        if (dt > this.delay ||
            (this.changeCount >= this.threshold && dt > this.throttle)) {
            this.save();
            this.reset();
        }
        else {
            this.changeCount += 1;
        }
    };
    AutoSave.prototype.save = function () {
        this.trigger('save');
    };
    AutoSave.prototype.reset = function () {
        this.changeCount = 0;
        this.timestamp = new Date().getTime();
    };
    AutoSave.prototype.dispose = function () {
        this.graph.model.off('cell:change:*', this.onModelChanged, this);
    };
    __decorate([
        common_1.Disablable.dispose()
    ], AutoSave.prototype, "dispose", null);
    return AutoSave;
}(common_1.Disablable));
exports.AutoSave = AutoSave;
(function (AutoSave) {
    AutoSave.defaultOptions = {
        delay: 10,
        throttle: 2,
        threshold: 5,
    };
})(AutoSave = exports.AutoSave || (exports.AutoSave = {}));
exports.AutoSave = AutoSave;
//# sourceMappingURL=index.js.map