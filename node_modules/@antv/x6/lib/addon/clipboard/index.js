"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clipboard = void 0;
var util_1 = require("../../util");
var config_1 = require("../../global/config");
var graph_1 = require("../../graph/graph");
var model_1 = require("../../model/model");
var Clipboard = /** @class */ (function () {
    function Clipboard() {
        this.cells = [];
    }
    Clipboard.prototype.copy = function (cells, graph, options) {
        if (options === void 0) { options = {}; }
        this.options = __assign({}, options);
        var model = model_1.Model.isModel(graph) ? graph : graph.model;
        var cloned = model.cloneSubGraph(cells, options);
        // sort asc by cell type
        this.cells = util_1.ArrayExt.sortBy(Object.keys(cloned).map(function (key) { return cloned[key]; }), function (cell) { return (cell.isEdge() ? 2 : 1); });
        this.serialize(options);
    };
    Clipboard.prototype.cut = function (cells, graph, options) {
        if (options === void 0) { options = {}; }
        this.copy(cells, graph, options);
        var model = graph_1.Graph.isGraph(graph) ? graph.model : graph;
        model.batchUpdate('cut', function () {
            cells.forEach(function (cell) { return cell.remove(); });
        });
    };
    Clipboard.prototype.paste = function (graph, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var localOptions = __assign(__assign({}, this.options), options);
        var offset = localOptions.offset, edgeProps = localOptions.edgeProps, nodeProps = localOptions.nodeProps;
        var dx = 20;
        var dy = 20;
        if (offset) {
            dx = typeof offset === 'number' ? offset : offset.dx;
            dy = typeof offset === 'number' ? offset : offset.dy;
        }
        this.deserialize(localOptions);
        var cells = this.cells;
        cells.forEach(function (cell) {
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
        var model = graph_1.Graph.isGraph(graph) ? graph.model : graph;
        model.batchUpdate('paste', function () {
            model.addCells(_this.cells);
        });
        this.copy(cells, graph, options);
        return cells;
    };
    Clipboard.prototype.serialize = function (options) {
        if (options.useLocalStorage !== false) {
            Storage.save(this.cells);
        }
    };
    Clipboard.prototype.deserialize = function (options) {
        if (options.useLocalStorage) {
            var cells = Storage.fetch();
            if (cells) {
                this.cells = cells;
            }
        }
    };
    Clipboard.prototype.isEmpty = function () {
        return this.cells.length <= 0;
    };
    Clipboard.prototype.clean = function () {
        this.options = {};
        this.cells = [];
        Storage.clean();
    };
    return Clipboard;
}());
exports.Clipboard = Clipboard;
var Storage;
(function (Storage) {
    var LOCAL_STORAGE_KEY = config_1.Config.prefixCls + ".clipboard.cells";
    function save(cells) {
        if (window.localStorage) {
            var data = cells.map(function (cell) { return cell.toJSON(); });
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
    }
    Storage.save = save;
    function fetch() {
        if (window.localStorage) {
            var raw = localStorage.getItem(LOCAL_STORAGE_KEY);
            var cells = raw ? JSON.parse(raw) : [];
            if (cells) {
                return model_1.Model.fromJSON(cells);
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