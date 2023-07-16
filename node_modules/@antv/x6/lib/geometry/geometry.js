"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Geometry = void 0;
var Geometry = /** @class */ (function () {
    function Geometry() {
    }
    Geometry.prototype.valueOf = function () {
        return this.toJSON();
    };
    Geometry.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };
    return Geometry;
}());
exports.Geometry = Geometry;
//# sourceMappingURL=geometry.js.map