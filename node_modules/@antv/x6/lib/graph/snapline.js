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
exports.SnaplineManager = void 0;
var base_1 = require("./base");
var SnaplineManager = /** @class */ (function (_super) {
    __extends(SnaplineManager, _super);
    function SnaplineManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.widget = _this.graph.hook.createSnapline();
        return _this;
    }
    SnaplineManager.prototype.dispose = function () {
        this.widget.dispose();
    };
    __decorate([
        base_1.Base.dispose()
    ], SnaplineManager.prototype, "dispose", null);
    return SnaplineManager;
}(base_1.Base));
exports.SnaplineManager = SnaplineManager;
//# sourceMappingURL=snapline.js.map