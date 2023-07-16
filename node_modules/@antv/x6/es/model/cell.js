/* eslint-disable no-underscore-dangle */
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
import { ArrayExt, StringExt, ObjectExt, FunctionExt } from '../util';
import { Rectangle, Point } from '../geometry';
import { Basecoat } from '../common';
import { Attr } from '../registry';
import { Animation } from './animation';
import { Store } from './store';
export class Cell extends Basecoat {
    constructor(metadata = {}) {
        super();
        const ctor = this.constructor;
        const defaults = ctor.getDefaults(true);
        const props = ObjectExt.merge({}, this.preprocess(defaults), this.preprocess(metadata));
        this.id = props.id || StringExt.uuid();
        this.store = new Store(props);
        this.animation = new Animation(this);
        this.setup();
        this.init();
        this.postprocess(metadata);
    }
    static config(presets) {
        const { markup, propHooks, attrHooks } = presets, others = __rest(presets, ["markup", "propHooks", "attrHooks"]);
        if (markup != null) {
            this.markup = markup;
        }
        if (propHooks) {
            this.propHooks = this.propHooks.slice();
            if (Array.isArray(propHooks)) {
                this.propHooks.push(...propHooks);
            }
            else if (typeof propHooks === 'function') {
                this.propHooks.push(propHooks);
            }
            else {
                Object.keys(propHooks).forEach((name) => {
                    const hook = propHooks[name];
                    if (typeof hook === 'function') {
                        this.propHooks.push(hook);
                    }
                });
            }
        }
        if (attrHooks) {
            this.attrHooks = Object.assign(Object.assign({}, this.attrHooks), attrHooks);
        }
        this.defaults = ObjectExt.merge({}, this.defaults, others);
    }
    static getMarkup() {
        return this.markup;
    }
    static getDefaults(raw) {
        return (raw ? this.defaults : ObjectExt.cloneDeep(this.defaults));
    }
    static getAttrHooks() {
        return this.attrHooks;
    }
    static applyPropHooks(cell, metadata) {
        return this.propHooks.reduce((memo, hook) => {
            return hook ? FunctionExt.call(hook, cell, memo) : memo;
        }, metadata);
    }
    // #endregion
    get [Symbol.toStringTag]() {
        return Cell.toStringTag;
    }
    init() { }
    // #region model
    get model() {
        return this._model;
    }
    set model(model) {
        if (this._model !== model) {
            this._model = model;
        }
    }
    // #endregion
    preprocess(metadata, ignoreIdCheck) {
        const id = metadata.id;
        const ctor = this.constructor;
        const props = ctor.applyPropHooks(this, metadata);
        if (id == null && ignoreIdCheck !== true) {
            props.id = StringExt.uuid();
        }
        return props;
    }
    postprocess(metadata) { } // eslint-disable-line
    setup() {
        this.store.on('change:*', (metadata) => {
            const { key, current, previous, options } = metadata;
            this.notify('change:*', {
                key,
                options,
                current,
                previous,
                cell: this,
            });
            this.notify(`change:${key}`, {
                options,
                current,
                previous,
                cell: this,
            });
            const type = key;
            if (type === 'source' || type === 'target') {
                this.notify(`change:terminal`, {
                    type,
                    current,
                    previous,
                    options,
                    cell: this,
                });
            }
        });
        this.store.on('changed', ({ options }) => this.notify('changed', { options, cell: this }));
    }
    notify(name, args) {
        this.trigger(name, args);
        const model = this.model;
        if (model) {
            model.notify(`cell:${name}`, args);
            if (this.isNode()) {
                model.notify(`node:${name}`, Object.assign(Object.assign({}, args), { node: this }));
            }
            else if (this.isEdge()) {
                model.notify(`edge:${name}`, Object.assign(Object.assign({}, args), { edge: this }));
            }
        }
        return this;
    }
    isNode() {
        return false;
    }
    isEdge() {
        return false;
    }
    isSameStore(cell) {
        return this.store === cell.store;
    }
    get view() {
        return this.store.get('view');
    }
    get shape() {
        return this.store.get('shape', '');
    }
    getProp(key, defaultValue) {
        if (key == null) {
            return this.store.get();
        }
        return this.store.get(key, defaultValue);
    }
    setProp(key, value, options) {
        if (typeof key === 'string') {
            this.store.set(key, value, options);
        }
        else {
            const props = this.preprocess(key, true);
            this.store.set(ObjectExt.merge({}, this.getProp(), props), value);
            this.postprocess(key);
        }
        return this;
    }
    removeProp(key, options) {
        if (typeof key === 'string' || Array.isArray(key)) {
            this.store.removeByPath(key, options);
        }
        else {
            this.store.remove(options);
        }
        return this;
    }
    hasChanged(key) {
        return key == null ? this.store.hasChanged() : this.store.hasChanged(key);
    }
    getPropByPath(path) {
        return this.store.getByPath(path);
    }
    setPropByPath(path, value, options = {}) {
        if (this.model) {
            // update inner reference
            if (path === 'children') {
                this._children = value
                    ? value
                        .map((id) => this.model.getCell(id))
                        .filter((child) => child != null)
                    : null;
            }
            else if (path === 'parent') {
                this._parent = value ? this.model.getCell(value) : null;
            }
        }
        this.store.setByPath(path, value, options);
        return this;
    }
    removePropByPath(path, options = {}) {
        const paths = Array.isArray(path) ? path : path.split('/');
        // Once a property is removed from the `attrs` the CellView will
        // recognize a `dirty` flag and re-render itself in order to remove
        // the attribute from SVGElement.
        if (paths[0] === 'attrs') {
            options.dirty = true;
        }
        this.store.removeByPath(paths, options);
        return this;
    }
    prop(key, value, options) {
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
    }
    previous(name) {
        return this.store.getPrevious(name);
    }
    // #endregion
    // #region zIndex
    get zIndex() {
        return this.getZIndex();
    }
    set zIndex(z) {
        if (z == null) {
            this.removeZIndex();
        }
        else {
            this.setZIndex(z);
        }
    }
    getZIndex() {
        return this.store.get('zIndex');
    }
    setZIndex(z, options = {}) {
        this.store.set('zIndex', z, options);
        return this;
    }
    removeZIndex(options = {}) {
        this.store.remove('zIndex', options);
        return this;
    }
    toFront(options = {}) {
        const model = this.model;
        if (model) {
            let z = model.getMaxZIndex();
            let cells;
            if (options.deep) {
                cells = this.getDescendants({ deep: true, breadthFirst: true });
                cells.unshift(this);
            }
            else {
                cells = [this];
            }
            z = z - cells.length + 1;
            const count = model.total();
            let changed = model.indexOf(this) !== count - cells.length;
            if (!changed) {
                changed = cells.some((cell, index) => cell.getZIndex() !== z + index);
            }
            if (changed) {
                this.batchUpdate('to-front', () => {
                    z += cells.length;
                    cells.forEach((cell, index) => {
                        cell.setZIndex(z + index, options);
                    });
                });
            }
        }
        return this;
    }
    toBack(options = {}) {
        const model = this.model;
        if (model) {
            let z = model.getMinZIndex();
            let cells;
            if (options.deep) {
                cells = this.getDescendants({ deep: true, breadthFirst: true });
                cells.unshift(this);
            }
            else {
                cells = [this];
            }
            let changed = model.indexOf(this) !== 0;
            if (!changed) {
                changed = cells.some((cell, index) => cell.getZIndex() !== z + index);
            }
            if (changed) {
                this.batchUpdate('to-back', () => {
                    z -= cells.length;
                    cells.forEach((cell, index) => {
                        cell.setZIndex(z + index, options);
                    });
                });
            }
        }
        return this;
    }
    // #endregion
    // #region markup
    get markup() {
        return this.getMarkup();
    }
    set markup(value) {
        if (value == null) {
            this.removeMarkup();
        }
        else {
            this.setMarkup(value);
        }
    }
    getMarkup() {
        let markup = this.store.get('markup');
        if (markup == null) {
            const ctor = this.constructor;
            markup = ctor.getMarkup();
        }
        return markup;
    }
    setMarkup(markup, options = {}) {
        this.store.set('markup', markup, options);
        return this;
    }
    removeMarkup(options = {}) {
        this.store.remove('markup', options);
        return this;
    }
    // #endregion
    // #region attrs
    get attrs() {
        return this.getAttrs();
    }
    set attrs(value) {
        if (value == null) {
            this.removeAttrs();
        }
        else {
            this.setAttrs(value);
        }
    }
    getAttrs() {
        const result = this.store.get('attrs');
        return result ? Object.assign({}, result) : {};
    }
    setAttrs(attrs, options = {}) {
        if (attrs == null) {
            this.removeAttrs(options);
        }
        else {
            const set = (attrs) => this.store.set('attrs', attrs, options);
            if (options.overwrite === true) {
                set(attrs);
            }
            else {
                const prev = this.getAttrs();
                if (options.deep === false) {
                    set(Object.assign(Object.assign({}, prev), attrs));
                }
                else {
                    set(ObjectExt.merge({}, prev, attrs));
                }
            }
        }
        return this;
    }
    replaceAttrs(attrs, options = {}) {
        return this.setAttrs(attrs, Object.assign(Object.assign({}, options), { overwrite: true }));
    }
    updateAttrs(attrs, options = {}) {
        return this.setAttrs(attrs, Object.assign(Object.assign({}, options), { deep: false }));
    }
    removeAttrs(options = {}) {
        this.store.remove('attrs', options);
        return this;
    }
    getAttrDefinition(attrName) {
        if (!attrName) {
            return null;
        }
        const ctor = this.constructor;
        const hooks = ctor.getAttrHooks() || {};
        let definition = hooks[attrName] || Attr.registry.get(attrName);
        if (!definition) {
            const name = StringExt.camelCase(attrName);
            definition = hooks[name] || Attr.registry.get(name);
        }
        return definition || null;
    }
    getAttrByPath(path) {
        if (path == null || path === '') {
            return this.getAttrs();
        }
        return this.getPropByPath(this.prefixAttrPath(path));
    }
    setAttrByPath(path, value, options = {}) {
        this.setPropByPath(this.prefixAttrPath(path), value, options);
        return this;
    }
    removeAttrByPath(path, options = {}) {
        this.removePropByPath(this.prefixAttrPath(path), options);
        return this;
    }
    prefixAttrPath(path) {
        return Array.isArray(path) ? ['attrs'].concat(path) : `attrs/${path}`;
    }
    attr(path, value, options) {
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
    }
    // #endregion
    // #region visible
    get visible() {
        return this.isVisible();
    }
    set visible(value) {
        this.setVisible(value);
    }
    setVisible(visible, options = {}) {
        this.store.set('visible', visible, options);
        return this;
    }
    isVisible() {
        return this.store.get('visible') !== false;
    }
    show(options = {}) {
        if (!this.isVisible()) {
            this.setVisible(true, options);
        }
        return this;
    }
    hide(options = {}) {
        if (this.isVisible()) {
            this.setVisible(false, options);
        }
        return this;
    }
    toggleVisible(isVisible, options = {}) {
        const visible = typeof isVisible === 'boolean' ? isVisible : !this.isVisible();
        const localOptions = typeof isVisible === 'boolean' ? options : isVisible;
        if (visible) {
            this.show(localOptions);
        }
        else {
            this.hide(localOptions);
        }
        return this;
    }
    // #endregion
    // #region data
    get data() {
        return this.getData();
    }
    set data(val) {
        this.setData(val);
    }
    getData() {
        return this.store.get('data');
    }
    setData(data, options = {}) {
        if (data == null) {
            this.removeData(options);
        }
        else {
            const set = (data) => this.store.set('data', data, options);
            if (options.overwrite === true) {
                set(data);
            }
            else {
                const prev = this.getData();
                if (options.deep === false) {
                    set(typeof data === 'object' ? Object.assign(Object.assign({}, prev), data) : data);
                }
                else {
                    set(ObjectExt.merge({}, prev, data));
                }
            }
        }
        return this;
    }
    replaceData(data, options = {}) {
        return this.setData(data, Object.assign(Object.assign({}, options), { overwrite: true }));
    }
    updateData(data, options = {}) {
        return this.setData(data, Object.assign(Object.assign({}, options), { deep: false }));
    }
    removeData(options = {}) {
        this.store.remove('data', options);
        return this;
    }
    // #endregion
    // #region parent children
    get parent() {
        return this.getParent();
    }
    get children() {
        return this.getChildren();
    }
    getParentId() {
        return this.store.get('parent');
    }
    getParent() {
        const parentId = this.getParentId();
        if (parentId && this.model) {
            const parent = this.model.getCell(parentId);
            this._parent = parent;
            return parent;
        }
        return null;
    }
    getChildren() {
        const childrenIds = this.store.get('children');
        if (childrenIds && childrenIds.length && this.model) {
            const children = childrenIds
                .map((id) => { var _a; return (_a = this.model) === null || _a === void 0 ? void 0 : _a.getCell(id); })
                .filter((cell) => cell != null);
            this._children = children;
            return [...children];
        }
        return null;
    }
    hasParent() {
        return this.parent != null;
    }
    isParentOf(child) {
        return child != null && child.getParent() === this;
    }
    isChildOf(parent) {
        return parent != null && this.getParent() === parent;
    }
    eachChild(iterator, context) {
        if (this.children) {
            this.children.forEach(iterator, context);
        }
        return this;
    }
    filterChild(filter, context) {
        return this.children ? this.children.filter(filter, context) : [];
    }
    getChildCount() {
        return this.children == null ? 0 : this.children.length;
    }
    getChildIndex(child) {
        return this.children == null ? -1 : this.children.indexOf(child);
    }
    getChildAt(index) {
        return this.children != null && index >= 0 ? this.children[index] : null;
    }
    getAncestors(options = {}) {
        const ancestors = [];
        let parent = this.getParent();
        while (parent) {
            ancestors.push(parent);
            parent = options.deep !== false ? parent.getParent() : null;
        }
        return ancestors;
    }
    getDescendants(options = {}) {
        if (options.deep !== false) {
            // breadth first
            if (options.breadthFirst) {
                const cells = [];
                const queue = this.getChildren() || [];
                while (queue.length > 0) {
                    const parent = queue.shift();
                    const children = parent.getChildren();
                    cells.push(parent);
                    if (children) {
                        queue.push(...children);
                    }
                }
                return cells;
            }
            // depth first
            {
                const cells = this.getChildren() || [];
                cells.forEach((cell) => {
                    cells.push(...cell.getDescendants(options));
                });
                return cells;
            }
        }
        return this.getChildren() || [];
    }
    isDescendantOf(ancestor, options = {}) {
        if (ancestor == null) {
            return false;
        }
        if (options.deep !== false) {
            let current = this.getParent();
            while (current) {
                if (current === ancestor) {
                    return true;
                }
                current = current.getParent();
            }
            return false;
        }
        return this.isChildOf(ancestor);
    }
    isAncestorOf(descendant, options = {}) {
        if (descendant == null) {
            return false;
        }
        return descendant.isDescendantOf(this, options);
    }
    contains(cell) {
        return this.isAncestorOf(cell);
    }
    getCommonAncestor(...cells) {
        return Cell.getCommonAncestor(this, ...cells);
    }
    setParent(parent, options = {}) {
        this._parent = parent;
        if (parent) {
            this.store.set('parent', parent.id, options);
        }
        else {
            this.store.remove('parent', options);
        }
        return this;
    }
    setChildren(children, options = {}) {
        this._children = children;
        if (children != null) {
            this.store.set('children', children.map((child) => child.id), options);
        }
        else {
            this.store.remove('children', options);
        }
        return this;
    }
    unembed(child, options = {}) {
        const children = this.children;
        if (children != null && child != null) {
            const index = this.getChildIndex(child);
            if (index !== -1) {
                children.splice(index, 1);
                child.setParent(null, options);
                this.setChildren(children, options);
            }
        }
        return this;
    }
    embed(child, options = {}) {
        child.addTo(this, options);
        return this;
    }
    addTo(target, options = {}) {
        if (Cell.isCell(target)) {
            target.addChild(this, options);
        }
        else {
            target.addCell(this, options);
        }
        return this;
    }
    insertTo(parent, index, options = {}) {
        parent.insertChild(this, index, options);
        return this;
    }
    addChild(child, options = {}) {
        return this.insertChild(child, undefined, options);
    }
    insertChild(child, index, options = {}) {
        if (child != null && child !== this) {
            const oldParent = child.getParent();
            const changed = this !== oldParent;
            let pos = index;
            if (pos == null) {
                pos = this.getChildCount();
                if (!changed) {
                    pos -= 1;
                }
            }
            // remove from old parent
            if (oldParent) {
                const children = oldParent.getChildren();
                if (children) {
                    const index = children.indexOf(child);
                    if (index >= 0) {
                        child.setParent(null, options);
                        children.splice(index, 1);
                        oldParent.setChildren(children, options);
                    }
                }
            }
            let children = this.children;
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
                const incomings = this.model.getIncomingEdges(this);
                const outgoings = this.model.getOutgoingEdges(this);
                if (incomings) {
                    incomings.forEach((edge) => edge.updateParent(options));
                }
                if (outgoings) {
                    outgoings.forEach((edge) => edge.updateParent(options));
                }
            }
            if (this.model) {
                this.model.addCell(child, options);
            }
        }
        return this;
    }
    removeFromParent(options = {}) {
        const parent = this.getParent();
        if (parent != null) {
            const index = parent.getChildIndex(this);
            parent.removeChildAt(index, options);
        }
        return this;
    }
    removeChild(child, options = {}) {
        const index = this.getChildIndex(child);
        return this.removeChildAt(index, options);
    }
    removeChildAt(index, options = {}) {
        const child = this.getChildAt(index);
        const children = this.children;
        if (children != null && child != null) {
            this.unembed(child, options);
            child.remove(options);
        }
        return child;
    }
    remove(options = {}) {
        this.batchUpdate('remove', () => {
            const parent = this.getParent();
            if (parent) {
                parent.removeChild(this, options);
            }
            if (options.deep !== false) {
                this.eachChild((child) => child.remove(options));
            }
            if (this.model) {
                this.model.removeCell(this, options);
            }
        });
        return this;
    }
    transition(path, target, options = {}, delim = '/') {
        return this.animation.start(path, target, options, delim);
    }
    stopTransition(path, options, delim = '/') {
        this.animation.stop(path, options, delim);
        return this;
    }
    getTransitions() {
        return this.animation.get();
    }
    // #endregion
    // #region transform
    // eslint-disable-next-line
    translate(tx, ty, options) {
        return this;
    }
    scale(sx, // eslint-disable-line
    sy, // eslint-disable-line
    origin, // eslint-disable-line
    options) {
        return this;
    }
    addTools(items, obj, options) {
        const toolItems = Array.isArray(items) ? items : [items];
        const name = typeof obj === 'string' ? obj : null;
        const config = typeof obj === 'object' ? obj : typeof options === 'object' ? options : {};
        if (config.reset) {
            return this.setTools({ name, items: toolItems, local: config.local }, config);
        }
        let tools = ObjectExt.cloneDeep(this.getTools());
        if (tools == null || name == null || tools.name === name) {
            if (tools == null) {
                tools = {};
            }
            if (!tools.items) {
                tools.items = [];
            }
            tools.name = name;
            tools.items = [...tools.items, ...toolItems];
            return this.setTools(Object.assign({}, tools), config);
        }
    }
    setTools(tools, options = {}) {
        if (tools == null) {
            this.removeTools();
        }
        else {
            this.store.set('tools', Cell.normalizeTools(tools), options);
        }
        return this;
    }
    getTools() {
        return this.store.get('tools');
    }
    removeTools(options = {}) {
        this.store.remove('tools', options);
        return this;
    }
    hasTools(name) {
        const tools = this.getTools();
        if (tools == null) {
            return false;
        }
        if (name == null) {
            return true;
        }
        return tools.name === name;
    }
    hasTool(name) {
        const tools = this.getTools();
        if (tools == null) {
            return false;
        }
        return tools.items.some((item) => typeof item === 'string' ? item === name : item.name === name);
    }
    removeTool(nameOrIndex, options = {}) {
        const tools = ObjectExt.cloneDeep(this.getTools());
        if (tools) {
            let updated = false;
            const items = tools.items.slice();
            const remove = (index) => {
                items.splice(index, 1);
                updated = true;
            };
            if (typeof nameOrIndex === 'number') {
                remove(nameOrIndex);
            }
            else {
                for (let i = items.length - 1; i >= 0; i -= 1) {
                    const item = items[i];
                    const exist = typeof item === 'string'
                        ? item === nameOrIndex
                        : item.name === nameOrIndex;
                    if (exist) {
                        remove(i);
                    }
                }
            }
            if (updated) {
                tools.items = items;
                this.setTools(tools, options);
            }
        }
        return this;
    }
    // #endregion
    // #region common
    // eslint-disable-next-line
    getBBox(options) {
        return new Rectangle();
    }
    // eslint-disable-next-line
    getConnectionPoint(edge, type) {
        return new Point();
    }
    toJSON(options = {}) {
        const props = Object.assign({}, this.store.get());
        const toString = Object.prototype.toString;
        const cellType = this.isNode() ? 'node' : this.isEdge() ? 'edge' : 'cell';
        if (!props.shape) {
            const ctor = this.constructor;
            throw new Error(`Unable to serialize ${cellType} missing "shape" prop, check the ${cellType} "${ctor.name || toString.call(ctor)}"`);
        }
        const ctor = this.constructor;
        const diff = options.diff === true;
        const attrs = props.attrs || {};
        const presets = ctor.getDefaults(true);
        // When `options.diff` is `true`, we should process the custom options,
        // such as `width`, `height` etc. to ensure the comparing work correctly.
        const defaults = diff ? this.preprocess(presets, true) : presets;
        const defaultAttrs = defaults.attrs || {};
        const finalAttrs = {};
        Object.keys(props).forEach((key) => {
            const val = props[key];
            if (val != null &&
                !Array.isArray(val) &&
                typeof val === 'object' &&
                !ObjectExt.isPlainObject(val)) {
                throw new Error(`Can only serialize ${cellType} with plain-object props, but got a "${toString.call(val)}" type of key "${key}" on ${cellType} "${this.id}"`);
            }
            if (key !== 'attrs' && key !== 'shape' && diff) {
                const preset = defaults[key];
                if (ObjectExt.isEqual(val, preset)) {
                    delete props[key];
                }
            }
        });
        Object.keys(attrs).forEach((key) => {
            const attr = attrs[key];
            const defaultAttr = defaultAttrs[key];
            Object.keys(attr).forEach((name) => {
                const value = attr[name];
                const defaultValue = defaultAttr ? defaultAttr[name] : null;
                if (value != null &&
                    typeof value === 'object' &&
                    !Array.isArray(value)) {
                    Object.keys(value).forEach((subName) => {
                        const subValue = value[subName];
                        if (defaultAttr == null ||
                            defaultValue == null ||
                            !ObjectExt.isObject(defaultValue) ||
                            !ObjectExt.isEqual(defaultValue[subName], subValue)) {
                            if (finalAttrs[key] == null) {
                                finalAttrs[key] = {};
                            }
                            if (finalAttrs[key][name] == null) {
                                finalAttrs[key][name] = {};
                            }
                            const tmp = finalAttrs[key][name];
                            tmp[subName] = subValue;
                        }
                    });
                }
                else if (defaultAttr == null ||
                    !ObjectExt.isEqual(defaultValue, value)) {
                    // `value` is not an object, default attribute with `key` does not
                    // exist or it is different than the attribute value set on the cell.
                    if (finalAttrs[key] == null) {
                        finalAttrs[key] = {};
                    }
                    finalAttrs[key][name] = value;
                }
            });
        });
        const finalProps = Object.assign(Object.assign({}, props), { attrs: ObjectExt.isEmpty(finalAttrs) ? undefined : finalAttrs });
        if (finalProps.attrs == null) {
            delete finalProps.attrs;
        }
        const ret = finalProps;
        if (ret.angle === 0) {
            delete ret.angle;
        }
        return ObjectExt.cloneDeep(ret);
    }
    clone(options = {}) {
        if (!options.deep) {
            const data = Object.assign({}, this.store.get());
            if (!options.keepId) {
                delete data.id;
            }
            delete data.parent;
            delete data.children;
            const ctor = this.constructor;
            return new ctor(data); // eslint-disable-line new-cap
        }
        // Deep cloning. Clone the cell itself and all its children.
        const map = Cell.deepClone(this);
        return map[this.id];
    }
    findView(graph) {
        return graph.renderer.findViewByCell(this);
    }
    // #endregion
    // #region batch
    startBatch(name, data = {}, model = this.model) {
        this.notify('batch:start', { name, data, cell: this });
        if (model) {
            model.startBatch(name, Object.assign(Object.assign({}, data), { cell: this }));
        }
        return this;
    }
    stopBatch(name, data = {}, model = this.model) {
        if (model) {
            model.stopBatch(name, Object.assign(Object.assign({}, data), { cell: this }));
        }
        this.notify('batch:stop', { name, data, cell: this });
        return this;
    }
    batchUpdate(name, execute, data) {
        // The model is null after cell was removed(remove batch).
        // So we should temp save model to trigger pairing batch event.
        const model = this.model;
        this.startBatch(name, data, model);
        const result = execute();
        this.stopBatch(name, data, model);
        return result;
    }
    // #endregion
    // #region IDisposable
    dispose() {
        this.removeFromParent();
        this.store.dispose();
    }
}
Cell.defaults = {};
Cell.attrHooks = {};
Cell.propHooks = [];
__decorate([
    Basecoat.dispose()
], Cell.prototype, "dispose", null);
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
})(Cell || (Cell = {}));
(function (Cell) {
    Cell.toStringTag = `X6.${Cell.name}`;
    function isCell(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Cell) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const cell = instance;
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
})(Cell || (Cell = {}));
(function (Cell) {
    function getCommonAncestor(...cells) {
        const ancestors = cells
            .filter((cell) => cell != null)
            .map((cell) => cell.getAncestors())
            .sort((a, b) => {
            return a.length - b.length;
        });
        const first = ancestors.shift();
        return (first.find((cell) => ancestors.every((item) => item.includes(cell))) ||
            null);
    }
    Cell.getCommonAncestor = getCommonAncestor;
    function getCellsBBox(cells, options = {}) {
        let bbox = null;
        for (let i = 0, ii = cells.length; i < ii; i += 1) {
            const cell = cells[i];
            let rect = cell.getBBox(options);
            if (rect) {
                if (cell.isNode()) {
                    const angle = cell.getAngle();
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
        const cells = [cell, ...cell.getDescendants({ deep: true })];
        return Cell.cloneCells(cells);
    }
    Cell.deepClone = deepClone;
    function cloneCells(cells) {
        const inputs = ArrayExt.uniq(cells);
        const cloneMap = inputs.reduce((map, cell) => {
            map[cell.id] = cell.clone();
            return map;
        }, {});
        inputs.forEach((cell) => {
            const clone = cloneMap[cell.id];
            if (clone.isEdge()) {
                const sourceId = clone.getSourceCellId();
                const targetId = clone.getTargetCellId();
                if (sourceId && cloneMap[sourceId]) {
                    // Source is a node and the node is among the clones.
                    // Then update the source of the cloned edge.
                    clone.setSource(Object.assign(Object.assign({}, clone.getSource()), { cell: cloneMap[sourceId].id }));
                }
                if (targetId && cloneMap[targetId]) {
                    // Target is a node and the node is among the clones.
                    // Then update the target of the cloned edge.
                    clone.setTarget(Object.assign(Object.assign({}, clone.getTarget()), { cell: cloneMap[targetId].id }));
                }
            }
            // Find the parent of the original cell
            const parent = cell.getParent();
            if (parent && cloneMap[parent.id]) {
                clone.setParent(cloneMap[parent.id]);
            }
            // Find the children of the original cell
            const children = cell.getChildren();
            if (children && children.length) {
                const embeds = children.reduce((memo, child) => {
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
})(Cell || (Cell = {}));
(function (Cell) {
    Cell.config({
        propHooks(_a) {
            var { tools } = _a, metadata = __rest(_a, ["tools"]);
            if (tools) {
                metadata.tools = Cell.normalizeTools(tools);
            }
            return metadata;
        },
    });
})(Cell || (Cell = {}));
//# sourceMappingURL=cell.js.map