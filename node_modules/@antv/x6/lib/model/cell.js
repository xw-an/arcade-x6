"use strict";
/* eslint-disable no-underscore-dangle */
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
exports.Cell = void 0;
var util_1 = require("../util");
var geometry_1 = require("../geometry");
var common_1 = require("../common");
var registry_1 = require("../registry");
var animation_1 = require("./animation");
var store_1 = require("./store");
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell(metadata) {
        if (metadata === void 0) { metadata = {}; }
        var _this = _super.call(this) || this;
        var ctor = _this.constructor;
        var defaults = ctor.getDefaults(true);
        var props = util_1.ObjectExt.merge({}, _this.preprocess(defaults), _this.preprocess(metadata));
        _this.id = props.id || util_1.StringExt.uuid();
        _this.store = new store_1.Store(props);
        _this.animation = new animation_1.Animation(_this);
        _this.setup();
        _this.init();
        _this.postprocess(metadata);
        return _this;
    }
    Cell.config = function (presets) {
        var _a;
        var _this = this;
        var markup = presets.markup, propHooks = presets.propHooks, attrHooks = presets.attrHooks, others = __rest(presets, ["markup", "propHooks", "attrHooks"]);
        if (markup != null) {
            this.markup = markup;
        }
        if (propHooks) {
            this.propHooks = this.propHooks.slice();
            if (Array.isArray(propHooks)) {
                (_a = this.propHooks).push.apply(_a, propHooks);
            }
            else if (typeof propHooks === 'function') {
                this.propHooks.push(propHooks);
            }
            else {
                Object.keys(propHooks).forEach(function (name) {
                    var hook = propHooks[name];
                    if (typeof hook === 'function') {
                        _this.propHooks.push(hook);
                    }
                });
            }
        }
        if (attrHooks) {
            this.attrHooks = __assign(__assign({}, this.attrHooks), attrHooks);
        }
        this.defaults = util_1.ObjectExt.merge({}, this.defaults, others);
    };
    Cell.getMarkup = function () {
        return this.markup;
    };
    Cell.getDefaults = function (raw) {
        return (raw ? this.defaults : util_1.ObjectExt.cloneDeep(this.defaults));
    };
    Cell.getAttrHooks = function () {
        return this.attrHooks;
    };
    Cell.applyPropHooks = function (cell, metadata) {
        return this.propHooks.reduce(function (memo, hook) {
            return hook ? util_1.FunctionExt.call(hook, cell, memo) : memo;
        }, metadata);
    };
    Object.defineProperty(Cell.prototype, Symbol.toStringTag, {
        // #endregion
        get: function () {
            return Cell.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.init = function () { };
    Object.defineProperty(Cell.prototype, "model", {
        // #region model
        get: function () {
            return this._model;
        },
        set: function (model) {
            if (this._model !== model) {
                this._model = model;
            }
        },
        enumerable: false,
        configurable: true
    });
    // #endregion
    Cell.prototype.preprocess = function (metadata, ignoreIdCheck) {
        var id = metadata.id;
        var ctor = this.constructor;
        var props = ctor.applyPropHooks(this, metadata);
        if (id == null && ignoreIdCheck !== true) {
            props.id = util_1.StringExt.uuid();
        }
        return props;
    };
    Cell.prototype.postprocess = function (metadata) { }; // eslint-disable-line
    Cell.prototype.setup = function () {
        var _this = this;
        this.store.on('change:*', function (metadata) {
            var key = metadata.key, current = metadata.current, previous = metadata.previous, options = metadata.options;
            _this.notify('change:*', {
                key: key,
                options: options,
                current: current,
                previous: previous,
                cell: _this,
            });
            _this.notify("change:" + key, {
                options: options,
                current: current,
                previous: previous,
                cell: _this,
            });
            var type = key;
            if (type === 'source' || type === 'target') {
                _this.notify("change:terminal", {
                    type: type,
                    current: current,
                    previous: previous,
                    options: options,
                    cell: _this,
                });
            }
        });
        this.store.on('changed', function (_a) {
            var options = _a.options;
            return _this.notify('changed', { options: options, cell: _this });
        });
    };
    Cell.prototype.notify = function (name, args) {
        this.trigger(name, args);
        var model = this.model;
        if (model) {
            model.notify("cell:" + name, args);
            if (this.isNode()) {
                model.notify("node:" + name, __assign(__assign({}, args), { node: this }));
            }
            else if (this.isEdge()) {
                model.notify("edge:" + name, __assign(__assign({}, args), { edge: this }));
            }
        }
        return this;
    };
    Cell.prototype.isNode = function () {
        return false;
    };
    Cell.prototype.isEdge = function () {
        return false;
    };
    Cell.prototype.isSameStore = function (cell) {
        return this.store === cell.store;
    };
    Object.defineProperty(Cell.prototype, "view", {
        get: function () {
            return this.store.get('view');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "shape", {
        get: function () {
            return this.store.get('shape', '');
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.getProp = function (key, defaultValue) {
        if (key == null) {
            return this.store.get();
        }
        return this.store.get(key, defaultValue);
    };
    Cell.prototype.setProp = function (key, value, options) {
        if (typeof key === 'string') {
            this.store.set(key, value, options);
        }
        else {
            var props = this.preprocess(key, true);
            this.store.set(util_1.ObjectExt.merge({}, this.getProp(), props), value);
            this.postprocess(key);
        }
        return this;
    };
    Cell.prototype.removeProp = function (key, options) {
        if (typeof key === 'string' || Array.isArray(key)) {
            this.store.removeByPath(key, options);
        }
        else {
            this.store.remove(options);
        }
        return this;
    };
    Cell.prototype.hasChanged = function (key) {
        return key == null ? this.store.hasChanged() : this.store.hasChanged(key);
    };
    Cell.prototype.getPropByPath = function (path) {
        return this.store.getByPath(path);
    };
    Cell.prototype.setPropByPath = function (path, value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (this.model) {
            // update inner reference
            if (path === 'children') {
                this._children = value
                    ? value
                        .map(function (id) { return _this.model.getCell(id); })
                        .filter(function (child) { return child != null; })
                    : null;
            }
            else if (path === 'parent') {
                this._parent = value ? this.model.getCell(value) : null;
            }
        }
        this.store.setByPath(path, value, options);
        return this;
    };
    Cell.prototype.removePropByPath = function (path, options) {
        if (options === void 0) { options = {}; }
        var paths = Array.isArray(path) ? path : path.split('/');
        // Once a property is removed from the `attrs` the CellView will
        // recognize a `dirty` flag and re-render itself in order to remove
        // the attribute from SVGElement.
        if (paths[0] === 'attrs') {
            options.dirty = true;
        }
        this.store.removeByPath(paths, options);
        return this;
    };
    Cell.prototype.prop = function (key, value, options) {
        if (key == null) {
            return this.getProp();
        }
        if (typeof key === 'string' || Array.isArray(key)) {
            if (arguments.length === 1) {
                return this.getPropByPath(key);
            }
            if (value == null) {
                return this.removePropByPath(key, options || {});
            }
            return this.setPropByPath(key, value, options || {});
        }
        return this.setProp(key, value || {});
    };
    Cell.prototype.previous = function (name) {
        return this.store.getPrevious(name);
    };
    Object.defineProperty(Cell.prototype, "zIndex", {
        // #endregion
        // #region zIndex
        get: function () {
            return this.getZIndex();
        },
        set: function (z) {
            if (z == null) {
                this.removeZIndex();
            }
            else {
                this.setZIndex(z);
            }
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.getZIndex = function () {
        return this.store.get('zIndex');
    };
    Cell.prototype.setZIndex = function (z, options) {
        if (options === void 0) { options = {}; }
        this.store.set('zIndex', z, options);
        return this;
    };
    Cell.prototype.removeZIndex = function (options) {
        if (options === void 0) { options = {}; }
        this.store.remove('zIndex', options);
        return this;
    };
    Cell.prototype.toFront = function (options) {
        if (options === void 0) { options = {}; }
        var model = this.model;
        if (model) {
            var z_1 = model.getMaxZIndex();
            var cells_1;
            if (options.deep) {
                cells_1 = this.getDescendants({ deep: true, breadthFirst: true });
                cells_1.unshift(this);
            }
            else {
                cells_1 = [this];
            }
            z_1 = z_1 - cells_1.length + 1;
            var count = model.total();
            var changed = model.indexOf(this) !== count - cells_1.length;
            if (!changed) {
                changed = cells_1.some(function (cell, index) { return cell.getZIndex() !== z_1 + index; });
            }
            if (changed) {
                this.batchUpdate('to-front', function () {
                    z_1 += cells_1.length;
                    cells_1.forEach(function (cell, index) {
                        cell.setZIndex(z_1 + index, options);
                    });
                });
            }
        }
        return this;
    };
    Cell.prototype.toBack = function (options) {
        if (options === void 0) { options = {}; }
        var model = this.model;
        if (model) {
            var z_2 = model.getMinZIndex();
            var cells_2;
            if (options.deep) {
                cells_2 = this.getDescendants({ deep: true, breadthFirst: true });
                cells_2.unshift(this);
            }
            else {
                cells_2 = [this];
            }
            var changed = model.indexOf(this) !== 0;
            if (!changed) {
                changed = cells_2.some(function (cell, index) { return cell.getZIndex() !== z_2 + index; });
            }
            if (changed) {
                this.batchUpdate('to-back', function () {
                    z_2 -= cells_2.length;
                    cells_2.forEach(function (cell, index) {
                        cell.setZIndex(z_2 + index, options);
                    });
                });
            }
        }
        return this;
    };
    Object.defineProperty(Cell.prototype, "markup", {
        // #endregion
        // #region markup
        get: function () {
            return this.getMarkup();
        },
        set: function (value) {
            if (value == null) {
                this.removeMarkup();
            }
            else {
                this.setMarkup(value);
            }
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.getMarkup = function () {
        var markup = this.store.get('markup');
        if (markup == null) {
            var ctor = this.constructor;
            markup = ctor.getMarkup();
        }
        return markup;
    };
    Cell.prototype.setMarkup = function (markup, options) {
        if (options === void 0) { options = {}; }
        this.store.set('markup', markup, options);
        return this;
    };
    Cell.prototype.removeMarkup = function (options) {
        if (options === void 0) { options = {}; }
        this.store.remove('markup', options);
        return this;
    };
    Object.defineProperty(Cell.prototype, "attrs", {
        // #endregion
        // #region attrs
        get: function () {
            return this.getAttrs();
        },
        set: function (value) {
            if (value == null) {
                this.removeAttrs();
            }
            else {
                this.setAttrs(value);
            }
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.getAttrs = function () {
        var result = this.store.get('attrs');
        return result ? __assign({}, result) : {};
    };
    Cell.prototype.setAttrs = function (attrs, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (attrs == null) {
            this.removeAttrs(options);
        }
        else {
            var set = function (attrs) {
                return _this.store.set('attrs', attrs, options);
            };
            if (options.overwrite === true) {
                set(attrs);
            }
            else {
                var prev = this.getAttrs();
                if (options.deep === false) {
                    set(__assign(__assign({}, prev), attrs));
                }
                else {
                    set(util_1.ObjectExt.merge({}, prev, attrs));
                }
            }
        }
        return this;
    };
    Cell.prototype.replaceAttrs = function (attrs, options) {
        if (options === void 0) { options = {}; }
        return this.setAttrs(attrs, __assign(__assign({}, options), { overwrite: true }));
    };
    Cell.prototype.updateAttrs = function (attrs, options) {
        if (options === void 0) { options = {}; }
        return this.setAttrs(attrs, __assign(__assign({}, options), { deep: false }));
    };
    Cell.prototype.removeAttrs = function (options) {
        if (options === void 0) { options = {}; }
        this.store.remove('attrs', options);
        return this;
    };
    Cell.prototype.getAttrDefinition = function (attrName) {
        if (!attrName) {
            return null;
        }
        var ctor = this.constructor;
        var hooks = ctor.getAttrHooks() || {};
        var definition = hooks[attrName] || registry_1.Attr.registry.get(attrName);
        if (!definition) {
            var name_1 = util_1.StringExt.camelCase(attrName);
            definition = hooks[name_1] || registry_1.Attr.registry.get(name_1);
        }
        return definition || null;
    };
    Cell.prototype.getAttrByPath = function (path) {
        if (path == null || path === '') {
            return this.getAttrs();
        }
        return this.getPropByPath(this.prefixAttrPath(path));
    };
    Cell.prototype.setAttrByPath = function (path, value, options) {
        if (options === void 0) { options = {}; }
        this.setPropByPath(this.prefixAttrPath(path), value, options);
        return this;
    };
    Cell.prototype.removeAttrByPath = function (path, options) {
        if (options === void 0) { options = {}; }
        this.removePropByPath(this.prefixAttrPath(path), options);
        return this;
    };
    Cell.prototype.prefixAttrPath = function (path) {
        return Array.isArray(path) ? ['attrs'].concat(path) : "attrs/" + path;
    };
    Cell.prototype.attr = function (path, value, options) {
        if (path == null) {
            return this.getAttrByPath();
        }
        if (typeof path === 'string' || Array.isArray(path)) {
            if (arguments.length === 1) {
                return this.getAttrByPath(path);
            }
            if (value == null) {
                return this.removeAttrByPath(path, options || {});
            }
            return this.setAttrByPath(path, value, options || {});
        }
        return this.setAttrs(path, (value || {}));
    };
    Object.defineProperty(Cell.prototype, "visible", {
        // #endregion
        // #region visible
        get: function () {
            return this.isVisible();
        },
        set: function (value) {
            this.setVisible(value);
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.setVisible = function (visible, options) {
        if (options === void 0) { options = {}; }
        this.store.set('visible', visible, options);
        return this;
    };
    Cell.prototype.isVisible = function () {
        return this.store.get('visible') !== false;
    };
    Cell.prototype.show = function (options) {
        if (options === void 0) { options = {}; }
        if (!this.isVisible()) {
            this.setVisible(true, options);
        }
        return this;
    };
    Cell.prototype.hide = function (options) {
        if (options === void 0) { options = {}; }
        if (this.isVisible()) {
            this.setVisible(false, options);
        }
        return this;
    };
    Cell.prototype.toggleVisible = function (isVisible, options) {
        if (options === void 0) { options = {}; }
        var visible = typeof isVisible === 'boolean' ? isVisible : !this.isVisible();
        var localOptions = typeof isVisible === 'boolean' ? options : isVisible;
        if (visible) {
            this.show(localOptions);
        }
        else {
            this.hide(localOptions);
        }
        return this;
    };
    Object.defineProperty(Cell.prototype, "data", {
        // #endregion
        // #region data
        get: function () {
            return this.getData();
        },
        set: function (val) {
            this.setData(val);
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.getData = function () {
        return this.store.get('data');
    };
    Cell.prototype.setData = function (data, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (data == null) {
            this.removeData(options);
        }
        else {
            var set = function (data) { return _this.store.set('data', data, options); };
            if (options.overwrite === true) {
                set(data);
            }
            else {
                var prev = this.getData();
                if (options.deep === false) {
                    set(typeof data === 'object' ? __assign(__assign({}, prev), data) : data);
                }
                else {
                    set(util_1.ObjectExt.merge({}, prev, data));
                }
            }
        }
        return this;
    };
    Cell.prototype.replaceData = function (data, options) {
        if (options === void 0) { options = {}; }
        return this.setData(data, __assign(__assign({}, options), { overwrite: true }));
    };
    Cell.prototype.updateData = function (data, options) {
        if (options === void 0) { options = {}; }
        return this.setData(data, __assign(__assign({}, options), { deep: false }));
    };
    Cell.prototype.removeData = function (options) {
        if (options === void 0) { options = {}; }
        this.store.remove('data', options);
        return this;
    };
    Object.defineProperty(Cell.prototype, "parent", {
        // #endregion
        // #region parent children
        get: function () {
            return this.getParent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "children", {
        get: function () {
            return this.getChildren();
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.getParentId = function () {
        return this.store.get('parent');
    };
    Cell.prototype.getParent = function () {
        var parentId = this.getParentId();
        if (parentId && this.model) {
            var parent_1 = this.model.getCell(parentId);
            this._parent = parent_1;
            return parent_1;
        }
        return null;
    };
    Cell.prototype.getChildren = function () {
        var _this = this;
        var childrenIds = this.store.get('children');
        if (childrenIds && childrenIds.length && this.model) {
            var children = childrenIds
                .map(function (id) { var _a; return (_a = _this.model) === null || _a === void 0 ? void 0 : _a.getCell(id); })
                .filter(function (cell) { return cell != null; });
            this._children = children;
            return __spreadArray([], children, true);
        }
        return null;
    };
    Cell.prototype.hasParent = function () {
        return this.parent != null;
    };
    Cell.prototype.isParentOf = function (child) {
        return child != null && child.getParent() === this;
    };
    Cell.prototype.isChildOf = function (parent) {
        return parent != null && this.getParent() === parent;
    };
    Cell.prototype.eachChild = function (iterator, context) {
        if (this.children) {
            this.children.forEach(iterator, context);
        }
        return this;
    };
    Cell.prototype.filterChild = function (filter, context) {
        return this.children ? this.children.filter(filter, context) : [];
    };
    Cell.prototype.getChildCount = function () {
        return this.children == null ? 0 : this.children.length;
    };
    Cell.prototype.getChildIndex = function (child) {
        return this.children == null ? -1 : this.children.indexOf(child);
    };
    Cell.prototype.getChildAt = function (index) {
        return this.children != null && index >= 0 ? this.children[index] : null;
    };
    Cell.prototype.getAncestors = function (options) {
        if (options === void 0) { options = {}; }
        var ancestors = [];
        var parent = this.getParent();
        while (parent) {
            ancestors.push(parent);
            parent = options.deep !== false ? parent.getParent() : null;
        }
        return ancestors;
    };
    Cell.prototype.getDescendants = function (options) {
        if (options === void 0) { options = {}; }
        if (options.deep !== false) {
            // breadth first
            if (options.breadthFirst) {
                var cells = [];
                var queue = this.getChildren() || [];
                while (queue.length > 0) {
                    var parent_2 = queue.shift();
                    var children = parent_2.getChildren();
                    cells.push(parent_2);
                    if (children) {
                        queue.push.apply(queue, children);
                    }
                }
                return cells;
            }
            // depth first
            {
                var cells_3 = this.getChildren() || [];
                cells_3.forEach(function (cell) {
                    cells_3.push.apply(cells_3, cell.getDescendants(options));
                });
                return cells_3;
            }
        }
        return this.getChildren() || [];
    };
    Cell.prototype.isDescendantOf = function (ancestor, options) {
        if (options === void 0) { options = {}; }
        if (ancestor == null) {
            return false;
        }
        if (options.deep !== false) {
            var current = this.getParent();
            while (current) {
                if (current === ancestor) {
                    return true;
                }
                current = current.getParent();
            }
            return false;
        }
        return this.isChildOf(ancestor);
    };
    Cell.prototype.isAncestorOf = function (descendant, options) {
        if (options === void 0) { options = {}; }
        if (descendant == null) {
            return false;
        }
        return descendant.isDescendantOf(this, options);
    };
    Cell.prototype.contains = function (cell) {
        return this.isAncestorOf(cell);
    };
    Cell.prototype.getCommonAncestor = function () {
        var cells = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            cells[_i] = arguments[_i];
        }
        return Cell.getCommonAncestor.apply(Cell, __spreadArray([this], cells, false));
    };
    Cell.prototype.setParent = function (parent, options) {
        if (options === void 0) { options = {}; }
        this._parent = parent;
        if (parent) {
            this.store.set('parent', parent.id, options);
        }
        else {
            this.store.remove('parent', options);
        }
        return this;
    };
    Cell.prototype.setChildren = function (children, options) {
        if (options === void 0) { options = {}; }
        this._children = children;
        if (children != null) {
            this.store.set('children', children.map(function (child) { return child.id; }), options);
        }
        else {
            this.store.remove('children', options);
        }
        return this;
    };
    Cell.prototype.unembed = function (child, options) {
        if (options === void 0) { options = {}; }
        var children = this.children;
        if (children != null && child != null) {
            var index = this.getChildIndex(child);
            if (index !== -1) {
                children.splice(index, 1);
                child.setParent(null, options);
                this.setChildren(children, options);
            }
        }
        return this;
    };
    Cell.prototype.embed = function (child, options) {
        if (options === void 0) { options = {}; }
        child.addTo(this, options);
        return this;
    };
    Cell.prototype.addTo = function (target, options) {
        if (options === void 0) { options = {}; }
        if (Cell.isCell(target)) {
            target.addChild(this, options);
        }
        else {
            target.addCell(this, options);
        }
        return this;
    };
    Cell.prototype.insertTo = function (parent, index, options) {
        if (options === void 0) { options = {}; }
        parent.insertChild(this, index, options);
        return this;
    };
    Cell.prototype.addChild = function (child, options) {
        if (options === void 0) { options = {}; }
        return this.insertChild(child, undefined, options);
    };
    Cell.prototype.insertChild = function (child, index, options) {
        if (options === void 0) { options = {}; }
        if (child != null && child !== this) {
            var oldParent = child.getParent();
            var changed = this !== oldParent;
            var pos = index;
            if (pos == null) {
                pos = this.getChildCount();
                if (!changed) {
                    pos -= 1;
                }
            }
            // remove from old parent
            if (oldParent) {
                var children_1 = oldParent.getChildren();
                if (children_1) {
                    var index_1 = children_1.indexOf(child);
                    if (index_1 >= 0) {
                        child.setParent(null, options);
                        children_1.splice(index_1, 1);
                        oldParent.setChildren(children_1, options);
                    }
                }
            }
            var children = this.children;
            if (children == null) {
                children = [];
                children.push(child);
            }
            else {
                children.splice(pos, 0, child);
            }
            child.setParent(this, options);
            this.setChildren(children, options);
            if (changed && this.model) {
                var incomings = this.model.getIncomingEdges(this);
                var outgoings = this.model.getOutgoingEdges(this);
                if (incomings) {
                    incomings.forEach(function (edge) { return edge.updateParent(options); });
                }
                if (outgoings) {
                    outgoings.forEach(function (edge) { return edge.updateParent(options); });
                }
            }
            if (this.model) {
                this.model.addCell(child, options);
            }
        }
        return this;
    };
    Cell.prototype.removeFromParent = function (options) {
        if (options === void 0) { options = {}; }
        var parent = this.getParent();
        if (parent != null) {
            var index = parent.getChildIndex(this);
            parent.removeChildAt(index, options);
        }
        return this;
    };
    Cell.prototype.removeChild = function (child, options) {
        if (options === void 0) { options = {}; }
        var index = this.getChildIndex(child);
        return this.removeChildAt(index, options);
    };
    Cell.prototype.removeChildAt = function (index, options) {
        if (options === void 0) { options = {}; }
        var child = this.getChildAt(index);
        var children = this.children;
        if (children != null && child != null) {
            this.unembed(child, options);
            child.remove(options);
        }
        return child;
    };
    Cell.prototype.remove = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.batchUpdate('remove', function () {
            var parent = _this.getParent();
            if (parent) {
                parent.removeChild(_this, options);
            }
            if (options.deep !== false) {
                _this.eachChild(function (child) { return child.remove(options); });
            }
            if (_this.model) {
                _this.model.removeCell(_this, options);
            }
        });
        return this;
    };
    Cell.prototype.transition = function (path, target, options, delim) {
        if (options === void 0) { options = {}; }
        if (delim === void 0) { delim = '/'; }
        return this.animation.start(path, target, options, delim);
    };
    Cell.prototype.stopTransition = function (path, options, delim) {
        if (delim === void 0) { delim = '/'; }
        this.animation.stop(path, options, delim);
        return this;
    };
    Cell.prototype.getTransitions = function () {
        return this.animation.get();
    };
    // #endregion
    // #region transform
    // eslint-disable-next-line
    Cell.prototype.translate = function (tx, ty, options) {
        return this;
    };
    Cell.prototype.scale = function (sx, // eslint-disable-line
    sy, // eslint-disable-line
    origin, // eslint-disable-line
    options) {
        return this;
    };
    Cell.prototype.addTools = function (items, obj, options) {
        var toolItems = Array.isArray(items) ? items : [items];
        var name = typeof obj === 'string' ? obj : null;
        var config = typeof obj === 'object' ? obj : typeof options === 'object' ? options : {};
        if (config.reset) {
            return this.setTools({ name: name, items: toolItems, local: config.local }, config);
        }
        var tools = util_1.ObjectExt.cloneDeep(this.getTools());
        if (tools == null || name == null || tools.name === name) {
            if (tools == null) {
                tools = {};
            }
            if (!tools.items) {
                tools.items = [];
            }
            tools.name = name;
            tools.items = __spreadArray(__spreadArray([], tools.items, true), toolItems, true);
            return this.setTools(__assign({}, tools), config);
        }
    };
    Cell.prototype.setTools = function (tools, options) {
        if (options === void 0) { options = {}; }
        if (tools == null) {
            this.removeTools();
        }
        else {
            this.store.set('tools', Cell.normalizeTools(tools), options);
        }
        return this;
    };
    Cell.prototype.getTools = function () {
        return this.store.get('tools');
    };
    Cell.prototype.removeTools = function (options) {
        if (options === void 0) { options = {}; }
        this.store.remove('tools', options);
        return this;
    };
    Cell.prototype.hasTools = function (name) {
        var tools = this.getTools();
        if (tools == null) {
            return false;
        }
        if (name == null) {
            return true;
        }
        return tools.name === name;
    };
    Cell.prototype.hasTool = function (name) {
        var tools = this.getTools();
        if (tools == null) {
            return false;
        }
        return tools.items.some(function (item) {
            return typeof item === 'string' ? item === name : item.name === name;
        });
    };
    Cell.prototype.removeTool = function (nameOrIndex, options) {
        if (options === void 0) { options = {}; }
        var tools = util_1.ObjectExt.cloneDeep(this.getTools());
        if (tools) {
            var updated_1 = false;
            var items_1 = tools.items.slice();
            var remove = function (index) {
                items_1.splice(index, 1);
                updated_1 = true;
            };
            if (typeof nameOrIndex === 'number') {
                remove(nameOrIndex);
            }
            else {
                for (var i = items_1.length - 1; i >= 0; i -= 1) {
                    var item = items_1[i];
                    var exist = typeof item === 'string'
                        ? item === nameOrIndex
                        : item.name === nameOrIndex;
                    if (exist) {
                        remove(i);
                    }
                }
            }
            if (updated_1) {
                tools.items = items_1;
                this.setTools(tools, options);
            }
        }
        return this;
    };
    // #endregion
    // #region common
    // eslint-disable-next-line
    Cell.prototype.getBBox = function (options) {
        return new geometry_1.Rectangle();
    };
    // eslint-disable-next-line
    Cell.prototype.getConnectionPoint = function (edge, type) {
        return new geometry_1.Point();
    };
    Cell.prototype.toJSON = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var props = __assign({}, this.store.get());
        var toString = Object.prototype.toString;
        var cellType = this.isNode() ? 'node' : this.isEdge() ? 'edge' : 'cell';
        if (!props.shape) {
            var ctor_1 = this.constructor;
            throw new Error("Unable to serialize " + cellType + " missing \"shape\" prop, check the " + cellType + " \"" + (ctor_1.name || toString.call(ctor_1)) + "\"");
        }
        var ctor = this.constructor;
        var diff = options.diff === true;
        var attrs = props.attrs || {};
        var presets = ctor.getDefaults(true);
        // When `options.diff` is `true`, we should process the custom options,
        // such as `width`, `height` etc. to ensure the comparing work correctly.
        var defaults = diff ? this.preprocess(presets, true) : presets;
        var defaultAttrs = defaults.attrs || {};
        var finalAttrs = {};
        Object.keys(props).forEach(function (key) {
            var val = props[key];
            if (val != null &&
                !Array.isArray(val) &&
                typeof val === 'object' &&
                !util_1.ObjectExt.isPlainObject(val)) {
                throw new Error("Can only serialize " + cellType + " with plain-object props, but got a \"" + toString.call(val) + "\" type of key \"" + key + "\" on " + cellType + " \"" + _this.id + "\"");
            }
            if (key !== 'attrs' && key !== 'shape' && diff) {
                var preset = defaults[key];
                if (util_1.ObjectExt.isEqual(val, preset)) {
                    delete props[key];
                }
            }
        });
        Object.keys(attrs).forEach(function (key) {
            var attr = attrs[key];
            var defaultAttr = defaultAttrs[key];
            Object.keys(attr).forEach(function (name) {
                var value = attr[name];
                var defaultValue = defaultAttr ? defaultAttr[name] : null;
                if (value != null &&
                    typeof value === 'object' &&
                    !Array.isArray(value)) {
                    Object.keys(value).forEach(function (subName) {
                        var subValue = value[subName];
                        if (defaultAttr == null ||
                            defaultValue == null ||
                            !util_1.ObjectExt.isObject(defaultValue) ||
                            !util_1.ObjectExt.isEqual(defaultValue[subName], subValue)) {
                            if (finalAttrs[key] == null) {
                                finalAttrs[key] = {};
                            }
                            if (finalAttrs[key][name] == null) {
                                finalAttrs[key][name] = {};
                            }
                            var tmp = finalAttrs[key][name];
                            tmp[subName] = subValue;
                        }
                    });
                }
                else if (defaultAttr == null ||
                    !util_1.ObjectExt.isEqual(defaultValue, value)) {
                    // `value` is not an object, default attribute with `key` does not
                    // exist or it is different than the attribute value set on the cell.
                    if (finalAttrs[key] == null) {
                        finalAttrs[key] = {};
                    }
                    finalAttrs[key][name] = value;
                }
            });
        });
        var finalProps = __assign(__assign({}, props), { attrs: util_1.ObjectExt.isEmpty(finalAttrs) ? undefined : finalAttrs });
        if (finalProps.attrs == null) {
            delete finalProps.attrs;
        }
        var ret = finalProps;
        if (ret.angle === 0) {
            delete ret.angle;
        }
        return util_1.ObjectExt.cloneDeep(ret);
    };
    Cell.prototype.clone = function (options) {
        if (options === void 0) { options = {}; }
        if (!options.deep) {
            var data = __assign({}, this.store.get());
            if (!options.keepId) {
                delete data.id;
            }
            delete data.parent;
            delete data.children;
            var ctor = this.constructor;
            return new ctor(data); // eslint-disable-line new-cap
        }
        // Deep cloning. Clone the cell itself and all its children.
        var map = Cell.deepClone(this);
        return map[this.id];
    };
    Cell.prototype.findView = function (graph) {
        return graph.renderer.findViewByCell(this);
    };
    // #endregion
    // #region batch
    Cell.prototype.startBatch = function (name, data, model) {
        if (data === void 0) { data = {}; }
        if (model === void 0) { model = this.model; }
        this.notify('batch:start', { name: name, data: data, cell: this });
        if (model) {
            model.startBatch(name, __assign(__assign({}, data), { cell: this }));
        }
        return this;
    };
    Cell.prototype.stopBatch = function (name, data, model) {
        if (data === void 0) { data = {}; }
        if (model === void 0) { model = this.model; }
        if (model) {
            model.stopBatch(name, __assign(__assign({}, data), { cell: this }));
        }
        this.notify('batch:stop', { name: name, data: data, cell: this });
        return this;
    };
    Cell.prototype.batchUpdate = function (name, execute, data) {
        // The model is null after cell was removed(remove batch).
        // So we should temp save model to trigger pairing batch event.
        var model = this.model;
        this.startBatch(name, data, model);
        var result = execute();
        this.stopBatch(name, data, model);
        return result;
    };
    // #endregion
    // #region IDisposable
    Cell.prototype.dispose = function () {
        this.removeFromParent();
        this.store.dispose();
    };
    Cell.defaults = {};
    Cell.attrHooks = {};
    Cell.propHooks = [];
    __decorate([
        common_1.Basecoat.dispose()
    ], Cell.prototype, "dispose", null);
    return Cell;
}(common_1.Basecoat));
exports.Cell = Cell;
(function (Cell) {
    function normalizeTools(raw) {
        if (typeof raw === 'string') {
            return { items: [raw] };
        }
        if (Array.isArray(raw)) {
            return { items: raw };
        }
        if (raw.items) {
            return raw;
        }
        return {
            items: [raw],
        };
    }
    Cell.normalizeTools = normalizeTools;
})(Cell = exports.Cell || (exports.Cell = {}));
exports.Cell = Cell;
(function (Cell) {
    Cell.toStringTag = "X6." + Cell.name;
    function isCell(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Cell) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var cell = instance;
        if ((tag == null || tag === Cell.toStringTag) &&
            typeof cell.isNode === 'function' &&
            typeof cell.isEdge === 'function' &&
            typeof cell.prop === 'function' &&
            typeof cell.attr === 'function') {
            return true;
        }
        return false;
    }
    Cell.isCell = isCell;
})(Cell = exports.Cell || (exports.Cell = {}));
exports.Cell = Cell;
(function (Cell) {
    function getCommonAncestor() {
        var cells = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            cells[_i] = arguments[_i];
        }
        var ancestors = cells
            .filter(function (cell) { return cell != null; })
            .map(function (cell) { return cell.getAncestors(); })
            .sort(function (a, b) {
            return a.length - b.length;
        });
        var first = ancestors.shift();
        return (first.find(function (cell) { return ancestors.every(function (item) { return item.includes(cell); }); }) ||
            null);
    }
    Cell.getCommonAncestor = getCommonAncestor;
    function getCellsBBox(cells, options) {
        if (options === void 0) { options = {}; }
        var bbox = null;
        for (var i = 0, ii = cells.length; i < ii; i += 1) {
            var cell = cells[i];
            var rect = cell.getBBox(options);
            if (rect) {
                if (cell.isNode()) {
                    var angle = cell.getAngle();
                    if (angle != null && angle !== 0) {
                        rect = rect.bbox(angle);
                    }
                }
                bbox = bbox == null ? rect : bbox.union(rect);
            }
        }
        return bbox;
    }
    Cell.getCellsBBox = getCellsBBox;
    function deepClone(cell) {
        var cells = __spreadArray([cell], cell.getDescendants({ deep: true }), true);
        return Cell.cloneCells(cells);
    }
    Cell.deepClone = deepClone;
    function cloneCells(cells) {
        var inputs = util_1.ArrayExt.uniq(cells);
        var cloneMap = inputs.reduce(function (map, cell) {
            map[cell.id] = cell.clone();
            return map;
        }, {});
        inputs.forEach(function (cell) {
            var clone = cloneMap[cell.id];
            if (clone.isEdge()) {
                var sourceId = clone.getSourceCellId();
                var targetId = clone.getTargetCellId();
                if (sourceId && cloneMap[sourceId]) {
                    // Source is a node and the node is among the clones.
                    // Then update the source of the cloned edge.
                    clone.setSource(__assign(__assign({}, clone.getSource()), { cell: cloneMap[sourceId].id }));
                }
                if (targetId && cloneMap[targetId]) {
                    // Target is a node and the node is among the clones.
                    // Then update the target of the cloned edge.
                    clone.setTarget(__assign(__assign({}, clone.getTarget()), { cell: cloneMap[targetId].id }));
                }
            }
            // Find the parent of the original cell
            var parent = cell.getParent();
            if (parent && cloneMap[parent.id]) {
                clone.setParent(cloneMap[parent.id]);
            }
            // Find the children of the original cell
            var children = cell.getChildren();
            if (children && children.length) {
                var embeds = children.reduce(function (memo, child) {
                    // Embedded cells that are not being cloned can not be carried
                    // over with other embedded cells.
                    if (cloneMap[child.id]) {
                        memo.push(cloneMap[child.id]);
                    }
                    return memo;
                }, []);
                if (embeds.length > 0) {
                    clone.setChildren(embeds);
                }
            }
        });
        return cloneMap;
    }
    Cell.cloneCells = cloneCells;
})(Cell = exports.Cell || (exports.Cell = {}));
exports.Cell = Cell;
(function (Cell) {
    Cell.config({
        propHooks: function (_a) {
            var tools = _a.tools, metadata = __rest(_a, ["tools"]);
            if (tools) {
                metadata.tools = Cell.normalizeTools(tools);
            }
            return metadata;
        },
    });
})(Cell = exports.Cell || (exports.Cell = {}));
exports.Cell = Cell;
//# sourceMappingURL=cell.js.map