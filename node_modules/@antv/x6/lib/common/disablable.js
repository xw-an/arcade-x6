"use strict";
/* eslint-disable no-underscore-dangle */
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
exports.Disablable = void 0;
var basecoat_1 = require("./basecoat");
var Disablable = /** @class */ (function (_super) {
    __extends(Disablable, _super);
    function Disablable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Disablable.prototype, "disabled", {
        get: function () {
            return this._disabled === true;
        },
        enumerable: false,
        configurable: true
    });
    Disablable.prototype.enable = function () {
        delete this._disabled;
    };
    Disablable.prototype.disable = function () {
        this._disabled = true;
    };
    return Disablable;
}(basecoat_1.Basecoat));
exports.Disablable = Disablable;
//# sourceMappingURL=disablable.js.map