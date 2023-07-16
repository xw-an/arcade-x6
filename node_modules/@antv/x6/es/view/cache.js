import { Dictionary } from '../common';
import { Dom } from '../util';
export class Cache {
    constructor(view) {
        this.view = view;
        this.clean();
    }
    clean() {
        if (this.elemCache) {
            this.elemCache.dispose();
        }
        this.elemCache = new Dictionary();
        this.pathCache = {};
    }
    get(elem) {
        const cache = this.elemCache;
        if (!cache.has(elem)) {
            this.elemCache.set(elem, {});
        }
        return this.elemCache.get(elem);
    }
    getData(elem) {
        const meta = this.get(elem);
        if (!meta.data) {
            meta.data = {};
        }
        return meta.data;
    }
    getMatrix(elem) {
        const meta = this.get(elem);
        if (meta.matrix == null) {
            const target = this.view.rotatableNode || this.view.container;
            meta.matrix = Dom.getTransformToElement(elem, target);
        }
        return Dom.createSVGMatrix(meta.matrix);
    }
    getShape(elem) {
        const meta = this.get(elem);
        if (meta.shape == null) {
            meta.shape = Dom.toGeometryShape(elem);
        }
        return meta.shape.clone();
    }
    getBoundingRect(elem) {
        const meta = this.get(elem);
        if (meta.boundingRect == null) {
            meta.boundingRect = Dom.getBBox(elem);
        }
        return meta.boundingRect.clone();
    }
}
//# sourceMappingURL=cache.js.map