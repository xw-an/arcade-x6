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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
var disposable_1 = require("./disposable");
var Dictionary = /** @class */ (function (_super) {
    __extends(Dictionary, _super);
    function Dictionary() {
        var _this = _super.call(this) || this;
        _this.clear();
        return _this;
    }
    Dictionary.prototype.clear = function () {
        this.map = new WeakMap();
        this.arr = [];
    };
    Dictionary.prototype.has = function (key) {
        return this.map.has(key);
    };
    Dictionary.prototype.get = function (key) {
        return this.map.get(key);
    };
    Dictionary.prototype.set = function (key, value) {
        this.map.set(key, value);
        this.arr.push(key);
    };
    Dictionary.prototype.delete = function (key) {
        var index = this.arr.indexOf(key);
        if (index >= 0) {
            this.arr.splice(index, 1);
        }
        var ret = this.map.get(key);
        this.map.delete(key);
        return ret;
    };
    Dictionary.prototype.each = function (iterator) {
        var _this = this;
        this.arr.forEach(function (key) {
            var value = _this.map.get(key);
            iterator(value, key);
        });
    };
    Dictionary.prototype.dispose = function () {
        this.clear();
    };
    __decorate([
        disposable_1.Disposable.dispose()
    ], Dictionary.prototype, "dispose", null);
    return Dictionary;
}(disposable_1.Disposable));
exports.Dictionary = Dictionary;
//# sourceMappingURL=dictionary.js.map