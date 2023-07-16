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
exports.createClass = exports.inherit = void 0;
var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
        function (d, b) {
            d.__proto__ = b; // eslint-disable-line no-proto
        }) ||
    function (d, b) {
        // eslint-disable-next-line no-restricted-syntax
        for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) {
                d[p] = b[p];
            }
        }
    };
/**
 * @see https://github.com/microsoft/TypeScript/blob/5c85febb0ce9d6088cbe9b09cb42f73f9ee8ea05/src/compiler/transformers/es2015.ts#L4309
 */
// eslint-disable-next-line
function inherit(cls, base) {
    extendStatics(cls, base);
    function tmp() {
        this.constructor = cls;
    }
    cls.prototype =
        base === null
            ? Object.create(base)
            : ((tmp.prototype = base.prototype), new tmp());
}
exports.inherit = inherit;
var A = /** @class */ (function () {
    function A() {
    }
    return A;
}());
var isNativeClass = /^\s*class\s+/.test("" + A) || /^\s*class\s*\{/.test("" + /** @class */ (function () {
    function class_1() {
    }
    return class_1;
}()));
/**
 * Extends class with specified class name.
 */
function createClass(className, base) {
    var cls;
    if (isNativeClass) {
        cls = /** @class */ (function (_super) {
            __extends(cls, _super);
            function cls() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return cls;
        }(base));
    }
    else {
        cls = function () {
            return base.apply(this, arguments); // eslint-disable-line
        };
        inherit(cls, base);
    }
    Object.defineProperty(cls, 'name', { value: className });
    return cls;
}
exports.createClass = createClass;
//# sourceMappingURL=inherit.js.map