"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
var common_1 = require("../common");
var util_1 = require("../util");
var Cache = /** @class */ (function () {
    function Cache(view) {
        this.view = view;
        this.clean();
    }
    Cache.prototype.clean = function () {
        if (this.elemCache) {
            this.elemCache.dispose();
        }
        this.elemCache = new common_1.Dictionary();
        this.pathCache = {};
    };
    Cache.prototype.get = function (elem) {
        var cache = this.elemCache;
        if (!cache.has(elem)) {
            this.elemCache.set(elem, {});
        }
        return this.elemCache.get(elem);
    };
    Cache.prototype.getData = function (elem) {
        var meta = this.get(elem);
        if (!meta.data) {
            meta.data = {};
        }
        return meta.data;
    };
    Cache.prototype.getMatrix = function (elem) {
        var meta = this.get(elem);
        if (meta.matrix == null) {
            var target = this.view.rotatableNode || this.view.container;
            meta.matrix = util_1.Dom.getTransformToElement(elem, target);
        }
        return util_1.Dom.createSVGMatrix(meta.matrix);
    };
    Cache.prototype.getShape = function (elem) {
        var meta = this.get(elem);
        if (meta.shape == null) {
            meta.shape = util_1.Dom.toGeometryShape(elem);
        }
        return meta.shape.clone();
    };
    Cache.prototype.getBoundingRect = function (elem) {
        var meta = this.get(elem);
        if (meta.boundingRect == null) {
            meta.boundingRect = util_1.Dom.getBBox(elem);
        }
        return meta.boundingRect.clone();
    };
    return Cache;
}());
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map