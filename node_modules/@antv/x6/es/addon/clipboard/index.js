import { ArrayExt } from '../../util';
import { Config } from '../../global/config';
import { Graph } from '../../graph/graph';
import { Model } from '../../model/model';
export class Clipboard {
    constructor() {
        this.cells = [];
    }
    copy(cells, graph, options = {}) {
        this.options = Object.assign({}, options);
        const model = Model.isModel(graph) ? graph : graph.model;
        const cloned = model.cloneSubGraph(cells, options);
        // sort asc by cell type
        this.cells = ArrayExt.sortBy(Object.keys(cloned).map((key) => cloned[key]), (cell) => (cell.isEdge() ? 2 : 1));
        this.serialize(options);
    }
    cut(cells, graph, options = {}) {
        this.copy(cells, graph, options);
        const model = Graph.isGraph(graph) ? graph.model : graph;
        model.batchUpdate('cut', () => {
            cells.forEach((cell) => cell.remove());
        });
    }
    paste(graph, options = {}) {
        const localOptions = Object.assign(Object.assign({}, this.options), options);
        const { offset, edgeProps, nodeProps } = localOptions;
        let dx = 20;
        let dy = 20;
        if (offset) {
            dx = typeof offset === 'number' ? offset : offset.dx;
            dy = typeof offset === 'number' ? offset : offset.dy;
        }
        this.deserialize(localOptions);
        const cells = this.cells;
        cells.forEach((cell) => {
            cell.model = null;
            cell.removeProp('zIndex');
            if (dx || dy) {
                cell.translate(dx, dy);
            }
            if (nodeProps && cell.isNode()) {
                cell.prop(nodeProps);
            }
            if (edgeProps && cell.isEdge()) {
                cell.prop(edgeProps);
            }
        });
        const model = Graph.isGraph(graph) ? graph.model : graph;
        model.batchUpdate('paste', () => {
            model.addCells(this.cells);
        });
        this.copy(cells, graph, options);
        return cells;
    }
    serialize(options) {
        if (options.useLocalStorage !== false) {
            Storage.save(this.cells);
        }
    }
    deserialize(options) {
        if (options.useLocalStorage) {
            const cells = Storage.fetch();
            if (cells) {
                this.cells = cells;
            }
        }
    }
    isEmpty() {
        return this.cells.length <= 0;
    }
    clean() {
        this.options = {};
        this.cells = [];
        Storage.clean();
    }
}
var Storage;
(function (Storage) {
    const LOCAL_STORAGE_KEY = `${Config.prefixCls}.clipboard.cells`;
    function save(cells) {
        if (window.localStorage) {
            const data = cells.map((cell) => cell.toJSON());
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
    }
    Storage.save = save;
    function fetch() {
        if (window.localStorage) {
            const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
            const cells = raw ? JSON.parse(raw) : [];
            if (cells) {
                return Model.fromJSON(cells);
            }
        }
    }
    Storage.fetch = fetch;
    function clean() {
        if (window.localStorage) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }
    Storage.clean = clean;
})(Storage || (Storage = {}));
//# sourceMappingURL=index.js.map