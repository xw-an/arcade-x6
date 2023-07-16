var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as Registry from '../registry';
import { Dom, Vector } from '../util';
import { Base } from './base';
export class GridManager extends Base {
    get elem() {
        return this.view.grid;
    }
    get grid() {
        return this.options.grid;
    }
    init() {
        this.startListening();
        this.draw(this.grid);
    }
    startListening() {
        this.graph.on('scale', this.update, this);
        this.graph.on('translate', this.update, this);
    }
    stopListening() {
        this.graph.off('scale', this.update, this);
        this.graph.off('translate', this.update, this);
    }
    setVisible(visible) {
        if (this.grid.visible !== visible) {
            this.grid.visible = visible;
            this.update();
        }
    }
    getGridSize() {
        return this.grid.size;
    }
    setGridSize(size) {
        this.grid.size = Math.max(size, 1);
        this.update();
    }
    show() {
        this.setVisible(true);
        this.update();
    }
    hide() {
        this.setVisible(false);
        this.update();
    }
    clear() {
        this.elem.style.backgroundImage = '';
    }
    draw(options) {
        this.clear();
        this.instance = null;
        Object.assign(this.grid, options);
        this.patterns = this.resolveGrid(options);
        this.update();
    }
    update(options = {}) {
        const gridSize = this.grid.size;
        if (gridSize <= 1 || !this.grid.visible) {
            return this.clear();
        }
        const ctm = this.graph.matrix();
        const grid = this.getInstance();
        const items = Array.isArray(options) ? options : [options];
        this.patterns.forEach((settings, index) => {
            const id = `pattern_${index}`;
            const sx = ctm.a || 1;
            const sy = ctm.d || 1;
            const { update, markup } = settings, others = __rest(settings, ["update", "markup"]);
            const options = Object.assign(Object.assign(Object.assign({}, others), items[index]), { sx,
                sy, ox: ctm.e || 0, oy: ctm.f || 0, width: gridSize * sx, height: gridSize * sy });
            if (!grid.has(id)) {
                grid.add(id, Vector.create('pattern', { id, patternUnits: 'userSpaceOnUse' }, Vector.createVectors(markup)).node);
            }
            const patternElem = grid.get(id);
            if (typeof update === 'function') {
                update(patternElem.childNodes[0], options);
            }
            let x = options.ox % options.width;
            if (x < 0) {
                x += options.width;
            }
            let y = options.oy % options.height;
            if (y < 0) {
                y += options.height;
            }
            Dom.attr(patternElem, {
                x,
                y,
                width: options.width,
                height: options.height,
            });
        });
        const base64 = new XMLSerializer().serializeToString(grid.root);
        const url = `url(data:image/svg+xml;base64,${btoa(base64)})`;
        this.elem.style.backgroundImage = url;
    }
    getInstance() {
        if (!this.instance) {
            this.instance = new Registry.Grid();
        }
        return this.instance;
    }
    resolveGrid(options) {
        if (!options) {
            return [];
        }
        const type = options.type;
        if (type == null) {
            return [
                Object.assign(Object.assign({}, Registry.Grid.presets.dot), options.args),
            ];
        }
        const items = Registry.Grid.registry.get(type);
        if (items) {
            let args = options.args || [];
            if (!Array.isArray(args)) {
                args = [args];
            }
            return Array.isArray(items)
                ? items.map((item, index) => (Object.assign(Object.assign({}, item), args[index])))
                : [Object.assign(Object.assign({}, items), args[0])];
        }
        return Registry.Grid.registry.onNotFound(type);
    }
    dispose() {
        this.stopListening();
        this.clear();
    }
}
__decorate([
    Base.dispose()
], GridManager.prototype, "dispose", null);
//# sourceMappingURL=grid.js.map