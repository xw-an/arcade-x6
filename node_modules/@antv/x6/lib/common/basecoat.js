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
exports.Basecoat = void 0;
var util_1 = require("../util");
var events_1 = require("./events");
var disposable_1 = require("./disposable");
var Basecoat = /** @class */ (function (_super) {
    __extends(Basecoat, _super);
    function Basecoat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Basecoat;
}(events_1.Events));
exports.Basecoat = Basecoat;
(function (Basecoat) {
    Basecoat.dispose = disposable_1.Disposable.dispose;
})(Basecoat = exports.Basecoat || (exports.Basecoat = {}));
exports.Basecoat = Basecoat;
util_1.ObjectExt.applyMixins(Basecoat, disposable_1.Disposable);
//# sourceMappingURL=basecoat.js.map