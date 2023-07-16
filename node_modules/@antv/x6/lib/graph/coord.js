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
exports.CoordManager = void 0;
var base_1 = require("./base");
var util_1 = require("../util");
var geometry_1 = require("../geometry");
var CoordManager = /** @class */ (function (_super) {
    __extends(CoordManager, _super);
    function CoordManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CoordManager.prototype.getClientMatrix = function () {
        return util_1.Dom.createSVGMatrix(this.view.stage.getScreenCTM());
    };
    /**
     * Returns coordinates of the graph viewport, relative to the window.
     */
    CoordManager.prototype.getClientOffset = function () {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        var rect = this.view.svg.getBoundingClientRect();
        return new geometry_1.Point(rect.left, rect.top);
    };
    /**
     * Returns coordinates of the graph viewport, relative to the document.
     */
    CoordManager.prototype.getPageOffset = function () {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        return this.getClientOffset().translate(window.scrollX, window.scrollY);
    };
    CoordManager.prototype.snapToGrid = function (x, y) {
        var p = typeof x === 'number'
            ? this.clientToLocalPoint(x, y)
            : this.clientToLocalPoint(x.x, x.y);
        return p.snapToGrid(this.graph.getGridSize());
    };
    CoordManager.prototype.localToGraphPoint = function (x, y) {
        var localPoint = geometry_1.Point.create(x, y);
        return util_1.Dom.transformPoint(localPoint, this.graph.matrix());
    };
    CoordManager.prototype.localToClientPoint = function (x, y) {
        var localPoint = geometry_1.Point.create(x, y);
        return util_1.Dom.transformPoint(localPoint, this.getClientMatrix());
    };
    CoordManager.prototype.localToPagePoint = function (x, y) {
        var p = typeof x === 'number'
            ? this.localToGraphPoint(x, y)
            : this.localToGraphPoint(x);
        return p.translate(this.getPageOffset());
    };
    CoordManager.prototype.localToGraphRect = function (x, y, width, height) {
        var localRect = geometry_1.Rectangle.create(x, y, width, height);
        return util_1.Dom.transformRectangle(localRect, this.graph.matrix());
    };
    CoordManager.prototype.localToClientRect = function (x, y, width, height) {
        var localRect = geometry_1.Rectangle.create(x, y, width, height);
        return util_1.Dom.transformRectangle(localRect, this.getClientMatrix());
    };
    CoordManager.prototype.localToPageRect = function (x, y, width, height) {
        var rect = typeof x === 'number'
            ? this.localToGraphRect(x, y, width, height)
            : this.localToGraphRect(x);
        return rect.translate(this.getPageOffset());
    };
    CoordManager.prototype.graphToLocalPoint = function (x, y) {
        var graphPoint = geometry_1.Point.create(x, y);
        return util_1.Dom.transformPoint(graphPoint, this.graph.matrix().inverse());
    };
    CoordManager.prototype.clientToLocalPoint = function (x, y) {
        var clientPoint = geometry_1.Point.create(x, y);
        return util_1.Dom.transformPoint(clientPoint, this.getClientMatrix().inverse());
    };
    CoordManager.prototype.clientToGraphPoint = function (x, y) {
        var clientPoint = geometry_1.Point.create(x, y);
        return util_1.Dom.transformPoint(clientPoint, this.graph.matrix().multiply(this.getClientMatrix().inverse()));
    };
    CoordManager.prototype.pageToLocalPoint = function (x, y) {
        var pagePoint = geometry_1.Point.create(x, y);
        var graphPoint = pagePoint.diff(this.getPageOffset());
        return this.graphToLocalPoint(graphPoint);
    };
    CoordManager.prototype.graphToLocalRect = function (x, y, width, height) {
        var graphRect = geometry_1.Rectangle.create(x, y, width, height);
        return util_1.Dom.transformRectangle(graphRect, this.graph.matrix().inverse());
    };
    CoordManager.prototype.clientToLocalRect = function (x, y, width, height) {
        var clientRect = geometry_1.Rectangle.create(x, y, width, height);
        return util_1.Dom.transformRectangle(clientRect, this.getClientMatrix().inverse());
    };
    CoordManager.prototype.clientToGraphRect = function (x, y, width, height) {
        var clientRect = geometry_1.Rectangle.create(x, y, width, height);
        return util_1.Dom.transformRectangle(clientRect, this.graph.matrix().multiply(this.getClientMatrix().inverse()));
    };
    CoordManager.prototype.pageToLocalRect = function (x, y, width, height) {
        var graphRect = geometry_1.Rectangle.create(x, y, width, height);
        var pageOffset = this.getPageOffset();
        graphRect.x -= pageOffset.x;
        graphRect.y -= pageOffset.y;
        return this.graphToLocalRect(graphRect);
    };
    return CoordManager;
}(base_1.Base));
exports.CoordManager = CoordManager;
//# sourceMappingURL=coord.js.map