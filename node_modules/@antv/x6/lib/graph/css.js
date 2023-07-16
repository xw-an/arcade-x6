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
exports.CSSManager = void 0;
var config_1 = require("../global/config");
var raw_1 = require("../style/raw");
var util_1 = require("../util");
var base_1 = require("./base");
var CSSManager = /** @class */ (function (_super) {
    __extends(CSSManager, _super);
    function CSSManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CSSManager.prototype.init = function () {
        if (config_1.Config.autoInsertCSS) {
            CSSManager.ensure();
        }
    };
    CSSManager.prototype.dispose = function () {
        CSSManager.clean();
    };
    __decorate([
        CSSManager.dispose()
    ], CSSManager.prototype, "dispose", null);
    return CSSManager;
}(base_1.Base));
exports.CSSManager = CSSManager;
(function (CSSManager) {
    var styleElement;
    var counter = 0;
    function ensure() {
        counter += 1;
        if (counter > 1)
            return;
        if (!util_1.Platform.isApplyingHMR()) {
            styleElement = document.createElement('style');
            styleElement.setAttribute('type', 'text/css');
            styleElement.textContent = raw_1.content;
            var head = document.querySelector('head');
            if (head) {
                head.insertBefore(styleElement, head.firstChild);
            }
        }
    }
    CSSManager.ensure = ensure;
    function clean() {
        counter -= 1;
        if (counter > 0)
            return;
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
        styleElement = null;
    }
    CSSManager.clean = clean;
})(CSSManager = exports.CSSManager || (exports.CSSManager = {}));
exports.CSSManager = CSSManager;
//# sourceMappingURL=css.js.map