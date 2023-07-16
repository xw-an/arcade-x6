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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
var util_1 = require("../util");
var common_1 = require("../common");
var Collection = /** @class */ (function (_super) {
    __extends(Collection, _super);
    function Collection(cells, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.length = 0;
        _this.comparator = options.comparator || 'zIndex';
        _this.clean();
        if (cells) {
            _this.reset(cells, { silent: true });
        }
        return _this;
    }
    Collection.prototype.toJSON = function () {
        return this.cells.map(function (cell) { return cell.toJSON(); });
    };
    Collection.prototype.add = function (cells, index, options) {
        var _a;
        var _this = this;
        var localIndex;
        var localOptions;
        if (typeof index === 'number') {
            localIndex = index;
            localOptions = __assign({ merge: false }, options);
        }
        else {
            localIndex = this.length;
            localOptions = __assign({ merge: false }, index);
        }
        if (localIndex > this.length) {
            localIndex = this.length;
        }
        if (localIndex < 0) {
            localIndex += this.length + 1;
        }
        var entities = Array.isArray(cells) ? cells : [cells];
        var sortable = this.comparator &&
            typeof index !== 'number' &&
            localOptions.sort !== false;
        var sortAttr = this.comparator || null;
        var sort = false;
        var added = [];
        var merged = [];
        entities.forEach(function (cell) {
            var existing = _this.get(cell);
            if (existing) {
                if (localOptions.merge && !cell.isSameStore(existing)) {
                    existing.setProp(cell.getProp(), options); // merge
                    merged.push(existing);
                    if (sortable && !sort) {
                        if (sortAttr == null || typeof sortAttr === 'function') {
                            sort = existing.hasChanged();
                        }
                        else if (typeof sortAttr === 'string') {
                            sort = existing.hasChanged(sortAttr);
                        }
                        else {
                            sort = sortAttr.some(function (key) { return existing.hasChanged(key); });
                        }
                    }
                }
            }
            else {
                added.push(cell);
                _this.reference(cell);
            }
        });
        if (added.length) {
            if (sortable) {
                sort = true;
            }
            (_a = this.cells).splice.apply(_a, __spreadArray([localIndex, 0], added, false));
            this.length = this.cells.length;
        }
        if (sort) {
            this.sort({ silent: true });
        }
        if (!localOptions.silent) {
            added.forEach(function (cell, i) {
                var args = {
                    cell: cell,
                    index: localIndex + i,
                    options: localOptions,
                };
                _this.trigger('added', args);
                if (!localOptions.dryrun) {
                    cell.notify('added', __assign({}, args));
                }
            });
            if (sort) {
                this.trigger('sorted');
            }
            if (added.length || merged.length) {
                this.trigger('updated', {
                    added: added,
                    merged: merged,
                    removed: [],
                    options: localOptions,
                });
            }
        }
        return this;
    };
    Collection.prototype.remove = function (cells, options) {
        if (options === void 0) { options = {}; }
        var arr = Array.isArray(cells) ? cells : [cells];
        var removed = this.removeCells(arr, options);
        if (!options.silent && removed.length > 0) {
            this.trigger('updated', {
                options: options,
                removed: removed,
                added: [],
                merged: [],
            });
        }
        return Array.isArray(cells) ? removed : removed[0];
    };
    Collection.prototype.removeCells = function (cells, options) {
        var removed = [];
        for (var i = 0; i < cells.length; i += 1) {
            var cell = this.get(cells[i]);
            if (cell == null) {
                continue;
            }
            var index = this.cells.indexOf(cell);
            this.cells.splice(index, 1);
            this.length -= 1;
            delete this.map[cell.id];
            removed.push(cell);
            this.unreference(cell);
            if (!options.dryrun) {
                cell.remove();
            }
            if (!options.silent) {
                this.trigger('removed', { cell: cell, index: index, options: options });
                if (!options.dryrun) {
                    cell.notify('removed', { cell: cell, index: index, options: options });
                }
            }
        }
        return removed;
    };
    Collection.prototype.reset = function (cells, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var previous = this.cells.slice();
        previous.forEach(function (cell) { return _this.unreference(cell); });
        this.clean();
        this.add(cells, __assign({ silent: true }, options));
        if (!options.silent) {
            var current_1 = this.cells.slice();
            this.trigger('reseted', {
                options: options,
                previous: previous,
                current: current_1,
            });
            var added_1 = [];
            var removed_1 = [];
            current_1.forEach(function (a) {
                var exist = previous.some(function (b) { return b.id === a.id; });
                if (!exist) {
                    added_1.push(a);
                }
            });
            previous.forEach(function (a) {
                var exist = current_1.some(function (b) { return b.id === a.id; });
                if (!exist) {
                    removed_1.push(a);
                }
            });
            this.trigger('updated', { options: options, added: added_1, removed: removed_1, merged: [] });
        }
        return this;
    };
    Collection.prototype.push = function (cell, options) {
        return this.add(cell, this.length, options);
    };
    Collection.prototype.pop = function (options) {
        var cell = this.at(this.length - 1);
        return this.remove(cell, options);
    };
    Collection.prototype.unshift = function (cell, options) {
        return this.add(cell, 0, options);
    };
    Collection.prototype.shift = function (options) {
        var cell = this.at(0);
        return this.remove(cell, options);
    };
    Collection.prototype.get = function (cell) {
        if (cell == null) {
            return null;
        }
        var id = typeof cell === 'string' || typeof cell === 'number' ? cell : cell.id;
        return this.map[id] || null;
    };
    Collection.prototype.has = function (cell) {
        return this.get(cell) != null;
    };
    Collection.prototype.at = function (index) {
        if (index < 0) {
            index += this.length; // eslint-disable-line
        }
        return this.cells[index] || null;
    };
    Collection.prototype.first = function () {
        return this.at(0);
    };
    Collection.prototype.last = function () {
        return this.at(-1);
    };
    Collection.prototype.indexOf = function (cell) {
        return this.cells.indexOf(cell);
    };
    Collection.prototype.toArray = function () {
        return this.cells.slice();
    };
    Collection.prototype.sort = function (options) {
        if (options === void 0) { options = {}; }
        if (this.comparator != null) {
            this.cells = util_1.ArrayExt.sortBy(this.cells, this.comparator);
            if (!options.silent) {
                this.trigger('sorted');
            }
        }
        return this;
    };
    Collection.prototype.clone = function () {
        var constructor = this.constructor;
        return new constructor(this.cells.slice(), {
            comparator: this.comparator,
        });
    };
    Collection.prototype.reference = function (cell) {
        this.map[cell.id] = cell;
        cell.on('*', this.notifyCellEvent, this);
    };
    Collection.prototype.unreference = function (cell) {
        cell.off('*', this.notifyCellEvent, this);
        delete this.map[cell.id];
    };
    Collection.prototype.notifyCellEvent = function (name, args) {
        var cell = args.cell;
        this.trigger("cell:" + name, args);
        if (cell) {
            if (cell.isNode()) {
                this.trigger("node:" + name, __assign(__assign({}, args), { node: cell }));
            }
            else if (cell.isEdge()) {
                this.trigger("edge:" + name, __assign(__assign({}, args), { edge: cell }));
            }
        }
    };
    Collection.prototype.clean = function () {
        this.length = 0;
        this.cells = [];
        this.map = {};
    };
    return Collection;
}(common_1.Basecoat));
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map