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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
var common_1 = require("../common");
var Base = /** @class */ (function (_super) {
    __extends(Base, _super);
    function Base(graph) {
        var _this = _super.call(this) || this;
        _this.graph = graph;
        _this.init();
        return _this;
    }
    Object.defineProperty(Base.prototype, "options", {
        get: function () {
            return this.graph.options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "model", {
        get: function () {
            return this.graph.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "view", {
        get: function () {
            return this.graph.view;
        },
        enumerable: false,
        configurable: true
    });
    Base.prototype.init = function () { };
    return Base;
}(common_1.Disposable));
exports.Base = Base;
//# sourceMappingURL=base.js.map