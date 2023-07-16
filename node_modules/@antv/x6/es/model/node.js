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
import { Registry } from '../registry';
import { Point, Rectangle, Angle } from '../geometry';
import { StringExt, ObjectExt, NumberExt } from '../util';
import { Markup } from '../view/markup';
import { Cell } from './cell';
import { ShareRegistry } from './registry';
import { PortManager } from './port';
import { Interp } from '../common';
export class Node extends Cell {
    constructor(metadata = {}) {
        super(metadata);
        this.initPorts();
    }
    get [Symbol.toStringTag]() {
        return Node.toStringTag;
    }
    preprocess(metadata, ignoreIdCheck) {
        const { x, y, width, height } = metadata, others = __rest(metadata, ["x", "y", "width", "height"]);
        if (x != null || y != null) {
            const position = others.position;
            others.position = Object.assign(Object.assign({}, position), { x: x != null ? x : position ? position.x : 0, y: y != null ? y : position ? position.y : 0 });
        }
        if (width != null || height != null) {
            const size = others.size;
            others.size = Object.assign(Object.assign({}, size), { width: width != null ? width : size ? size.width : 0, height: height != null ? height : size ? size.height : 0 });
        }
        return super.preprocess(others, ignoreIdCheck);
    }
    isNode() {
        return true;
    }
    size(width, height, options) {
        if (width === undefined) {
            return this.getSize();
        }
        if (typeof width === 'number') {
            return this.setSize(width, height, options);
        }
        return this.setSize(width, height);
    }
    getSize() {
        const size = this.store.get('size');
        return size ? Object.assign({}, size) : { width: 1, height: 1 };
    }
    setSize(width, height, options) {
        if (typeof width === 'object') {
            this.resize(width.width, width.height, height);
        }
        else {
            this.resize(width, height, options);
        }
        return this;
    }
    resize(width, height, options = {}) {
        this.startBatch('resize', options);
        const direction = options.direction;
        if (direction) {
            const currentSize = this.getSize();
            switch (direction) {
                case 'left':
                case 'right':
                    // Don't change height when resizing horizontally.
                    height = currentSize.height; // eslint-disable-line
                    break;
                case 'top':
                case 'bottom':
                    // Don't change width when resizing vertically.
                    width = currentSize.width; // eslint-disable-line
                    break;
                default:
                    break;
            }
            const map = {
                right: 0,
                'top-right': 0,
                top: 1,
                'top-left': 1,
                left: 2,
                'bottom-left': 2,
                bottom: 3,
                'bottom-right': 3,
            };
            let quadrant = map[direction];
            const angle = Angle.normalize(this.getAngle() || 0);
            if (options.absolute) {
                // We are taking the node's rotation into account
                quadrant += Math.floor((angle + 45) / 90);
                quadrant %= 4;
            }
            // This is a rectangle in size of the un-rotated node.
            const bbox = this.getBBox();
            // Pick the corner point on the node, which meant to stay on its
            // place before and after the rotation.
            let fixedPoint;
            if (quadrant === 0) {
                fixedPoint = bbox.getBottomLeft();
            }
            else if (quadrant === 1) {
                fixedPoint = bbox.getCorner();
            }
            else if (quadrant === 2) {
                fixedPoint = bbox.getTopRight();
            }
            else {
                fixedPoint = bbox.getOrigin();
            }
            // Find an image of the previous indent point. This is the position,
            // where is the point actually located on the screen.
            const imageFixedPoint = fixedPoint
                .clone()
                .rotate(-angle, bbox.getCenter());
            // Every point on the element rotates around a circle with the centre of
            // rotation in the middle of the element while the whole element is being
            // rotated. That means that the distance from a point in the corner of
            // the element (supposed its always rect) to the center of the element
            // doesn't change during the rotation and therefore it equals to a
            // distance on un-rotated element.
            // We can find the distance as DISTANCE = (ELEMENTWIDTH/2)^2 + (ELEMENTHEIGHT/2)^2)^0.5.
            const radius = Math.sqrt(width * width + height * height) / 2;
            // Now we are looking for an angle between x-axis and the line starting
            // at image of fixed point and ending at the center of the element.
            // We call this angle `alpha`.
            // The image of a fixed point is located in n-th quadrant. For each
            // quadrant passed going anti-clockwise we have to add 90 degrees.
            // Note that the first quadrant has index 0.
            //
            // 3 | 2
            // --c-- Quadrant positions around the element's center `c`
            // 0 | 1
            //
            let alpha = (quadrant * Math.PI) / 2;
            // Add an angle between the beginning of the current quadrant (line
            // parallel with x-axis or y-axis going through the center of the
            // element) and line crossing the indent of the fixed point and the
            // center of the element. This is the angle we need but on the
            // un-rotated element.
            alpha += Math.atan(quadrant % 2 === 0 ? height / width : width / height);
            // Lastly we have to deduct the original angle the element was rotated
            // by and that's it.
            alpha -= Angle.toRad(angle);
            // With this angle and distance we can easily calculate the centre of
            // the un-rotated element.
            // Note that fromPolar constructor accepts an angle in radians.
            const center = Point.fromPolar(radius, alpha, imageFixedPoint);
            // The top left corner on the un-rotated element has to be half a width
            // on the left and half a height to the top from the center. This will
            // be the origin of rectangle we were looking for.
            const origin = center.clone().translate(width / -2, height / -2);
            this.store.set('size', { width, height }, options);
            this.setPosition(origin.x, origin.y, options);
        }
        else {
            this.store.set('size', { width, height }, options);
        }
        this.stopBatch('resize', options);
        return this;
    }
    scale(sx, sy, origin, options = {}) {
        const scaledBBox = this.getBBox().scale(sx, sy, origin == null ? undefined : origin);
        this.startBatch('scale', options);
        this.setPosition(scaledBBox.x, scaledBBox.y, options);
        this.resize(scaledBBox.width, scaledBBox.height, options);
        this.stopBatch('scale');
        return this;
    }
    position(arg0, arg1, arg2) {
        if (typeof arg0 === 'number') {
            return this.setPosition(arg0, arg1, arg2);
        }
        return this.getPosition(arg0);
    }
    getPosition(options = {}) {
        if (options.relative) {
            const parent = this.getParent();
            if (parent != null && parent.isNode()) {
                const currentPosition = this.getPosition();
                const parentPosition = parent.getPosition();
                return {
                    x: currentPosition.x - parentPosition.x,
                    y: currentPosition.y - parentPosition.y,
                };
            }
        }
        const pos = this.store.get('position');
        return pos ? Object.assign({}, pos) : { x: 0, y: 0 };
    }
    setPosition(arg0, arg1, arg2 = {}) {
        let x;
        let y;
        let options;
        if (typeof arg0 === 'object') {
            x = arg0.x;
            y = arg0.y;
            options = arg1 || {};
        }
        else {
            x = arg0;
            y = arg1;
            options = arg2 || {};
        }
        if (options.relative) {
            const parent = this.getParent();
            if (parent != null && parent.isNode()) {
                const parentPosition = parent.getPosition();
                x += parentPosition.x;
                y += parentPosition.y;
            }
        }
        if (options.deep) {
            const currentPosition = this.getPosition();
            this.translate(x - currentPosition.x, y - currentPosition.y, options);
        }
        else {
            this.store.set('position', { x, y }, options);
        }
        return this;
    }
    translate(tx = 0, ty = 0, options = {}) {
        if (tx === 0 && ty === 0) {
            return this;
        }
        // Pass the initiator of the translation.
        options.translateBy = options.translateBy || this.id;
        const position = this.getPosition();
        if (options.restrict != null && options.translateBy === this.id) {
            // We are restricting the translation for the element itself only. We get
            // the bounding box of the element including all its embeds.
            // All embeds have to be translated the exact same way as the element.
            const bbox = this.getBBox({ deep: true });
            const ra = options.restrict;
            // - - - - - - - - - - - - -> ra.x + ra.width
            // - - - -> position.x      |
            // -> bbox.x
            //                ▓▓▓▓▓▓▓   |
            //         ░░░░░░░▓▓▓▓▓▓▓
            //         ░░░░░░░░░        |
            //   ▓▓▓▓▓▓▓▓░░░░░░░
            //   ▓▓▓▓▓▓▓▓               |
            //   <-dx->                     | restricted area right border
            //         <-width->        |   ░ translated element
            //   <- - bbox.width - ->       ▓ embedded element
            const dx = position.x - bbox.x;
            const dy = position.y - bbox.y;
            // Find the maximal/minimal coordinates that the element can be translated
            // while complies the restrictions.
            const x = Math.max(ra.x + dx, Math.min(ra.x + ra.width + dx - bbox.width, position.x + tx));
            const y = Math.max(ra.y + dy, Math.min(ra.y + ra.height + dy - bbox.height, position.y + ty));
            // recalculate the translation taking the restrictions into account.
            tx = x - position.x; // eslint-disable-line
            ty = y - position.y; // eslint-disable-line
        }
        const translatedPosition = {
            x: position.x + tx,
            y: position.y + ty,
        };
        // To find out by how much an element was translated in event
        // 'change:position' handlers.
        options.tx = tx;
        options.ty = ty;
        if (options.transition) {
            if (typeof options.transition !== 'object') {
                options.transition = {};
            }
            this.transition('position', translatedPosition, Object.assign(Object.assign({}, options.transition), { interp: Interp.object }));
            this.eachChild((child) => {
                var _a;
                const excluded = (_a = options.exclude) === null || _a === void 0 ? void 0 : _a.includes(child);
                if (!excluded) {
                    child.translate(tx, ty, options);
                }
            });
        }
        else {
            this.startBatch('translate', options);
            this.store.set('position', translatedPosition, options);
            this.eachChild((child) => {
                var _a;
                const excluded = (_a = options.exclude) === null || _a === void 0 ? void 0 : _a.includes(child);
                if (!excluded) {
                    child.translate(tx, ty, options);
                }
            });
            this.stopBatch('translate', options);
        }
        return this;
    }
    angle(val, options) {
        if (val == null) {
            return this.getAngle();
        }
        return this.rotate(val, options);
    }
    getAngle() {
        return this.store.get('angle', 0);
    }
    rotate(angle, options = {}) {
        const currentAngle = this.getAngle();
        if (options.center) {
            const size = this.getSize();
            const position = this.getPosition();
            const center = this.getBBox().getCenter();
            center.rotate(currentAngle - angle, options.center);
            const dx = center.x - size.width / 2 - position.x;
            const dy = center.y - size.height / 2 - position.y;
            this.startBatch('rotate', { angle, options });
            this.setPosition(position.x + dx, position.y + dy, options);
            this.rotate(angle, Object.assign(Object.assign({}, options), { center: null }));
            this.stopBatch('rotate');
        }
        else {
            this.store.set('angle', options.absolute ? angle : (currentAngle + angle) % 360, options);
        }
        return this;
    }
    // #endregion
    // #region common
    getBBox(options = {}) {
        if (options.deep) {
            const cells = this.getDescendants({ deep: true, breadthFirst: true });
            cells.push(this);
            return Cell.getCellsBBox(cells);
        }
        return Rectangle.fromPositionAndSize(this.getPosition(), this.getSize());
    }
    getConnectionPoint(edge, type) {
        const bbox = this.getBBox();
        const center = bbox.getCenter();
        const terminal = edge.getTerminal(type);
        if (terminal == null) {
            return center;
        }
        const portId = terminal.port;
        if (!portId || !this.hasPort(portId)) {
            return center;
        }
        const port = this.getPort(portId);
        if (!port || !port.group) {
            return center;
        }
        const layouts = this.getPortsPosition(port.group);
        const position = layouts[portId].position;
        const portCenter = Point.create(position).translate(bbox.getOrigin());
        const angle = this.getAngle();
        if (angle) {
            portCenter.rotate(-angle, center);
        }
        return portCenter;
    }
    /**
     * Sets cell's size and position based on the children bbox and given padding.
     */
    fit(options = {}) {
        const children = this.getChildren() || [];
        const embeds = children.filter((cell) => cell.isNode());
        if (embeds.length === 0) {
            return this;
        }
        this.startBatch('fit-embeds', options);
        if (options.deep) {
            embeds.forEach((cell) => cell.fit(options));
        }
        let { x, y, width, height } = Cell.getCellsBBox(embeds);
        const padding = NumberExt.normalizeSides(options.padding);
        x -= padding.left;
        y -= padding.top;
        width += padding.left + padding.right;
        height += padding.bottom + padding.top;
        this.store.set({
            position: { x, y },
            size: { width, height },
        }, options);
        this.stopBatch('fit-embeds');
        return this;
    }
    // #endregion
    // #region ports
    get portContainerMarkup() {
        return this.getPortContainerMarkup();
    }
    set portContainerMarkup(markup) {
        this.setPortContainerMarkup(markup);
    }
    getDefaultPortContainerMarkup() {
        return (this.store.get('defaultPortContainerMarkup') ||
            Markup.getPortContainerMarkup());
    }
    getPortContainerMarkup() {
        return (this.store.get('portContainerMarkup') ||
            this.getDefaultPortContainerMarkup());
    }
    setPortContainerMarkup(markup, options = {}) {
        this.store.set('portContainerMarkup', Markup.clone(markup), options);
        return this;
    }
    get portMarkup() {
        return this.getPortMarkup();
    }
    set portMarkup(markup) {
        this.setPortMarkup(markup);
    }
    getDefaultPortMarkup() {
        return this.store.get('defaultPortMarkup') || Markup.getPortMarkup();
    }
    getPortMarkup() {
        return this.store.get('portMarkup') || this.getDefaultPortMarkup();
    }
    setPortMarkup(markup, options = {}) {
        this.store.set('portMarkup', Markup.clone(markup), options);
        return this;
    }
    get portLabelMarkup() {
        return this.getPortLabelMarkup();
    }
    set portLabelMarkup(markup) {
        this.setPortLabelMarkup(markup);
    }
    getDefaultPortLabelMarkup() {
        return (this.store.get('defaultPortLabelMarkup') || Markup.getPortLabelMarkup());
    }
    getPortLabelMarkup() {
        return this.store.get('portLabelMarkup') || this.getDefaultPortLabelMarkup();
    }
    setPortLabelMarkup(markup, options = {}) {
        this.store.set('portLabelMarkup', Markup.clone(markup), options);
        return this;
    }
    get ports() {
        const res = this.store.get('ports', { items: [] });
        if (res.items == null) {
            res.items = [];
        }
        return res;
    }
    getPorts() {
        return ObjectExt.cloneDeep(this.ports.items);
    }
    getPortsByGroup(groupName) {
        return this.getPorts().filter((port) => port.group === groupName);
    }
    getPort(portId) {
        return ObjectExt.cloneDeep(this.ports.items.find((port) => port.id && port.id === portId));
    }
    getPortAt(index) {
        return this.ports.items[index] || null;
    }
    hasPorts() {
        return this.ports.items.length > 0;
    }
    hasPort(portId) {
        return this.getPortIndex(portId) !== -1;
    }
    getPortIndex(port) {
        const portId = typeof port === 'string' ? port : port.id;
        return portId != null
            ? this.ports.items.findIndex((item) => item.id === portId)
            : -1;
    }
    getPortsPosition(groupName) {
        const size = this.getSize();
        const layouts = this.port.getPortsLayoutByGroup(groupName, new Rectangle(0, 0, size.width, size.height));
        return layouts.reduce((memo, item) => {
            const layout = item.portLayout;
            memo[item.portId] = {
                position: Object.assign({}, layout.position),
                angle: layout.angle || 0,
            };
            return memo;
        }, {});
    }
    getPortProp(portId, path) {
        return this.getPropByPath(this.prefixPortPath(portId, path));
    }
    setPortProp(portId, arg1, arg2, arg3) {
        if (typeof arg1 === 'string' || Array.isArray(arg1)) {
            const path = this.prefixPortPath(portId, arg1);
            const value = arg2;
            return this.setPropByPath(path, value, arg3);
        }
        const path = this.prefixPortPath(portId);
        const value = arg1;
        return this.setPropByPath(path, value, arg2);
    }
    removePortProp(portId, path, options) {
        if (typeof path === 'string' || Array.isArray(path)) {
            return this.removePropByPath(this.prefixPortPath(portId, path), options);
        }
        return this.removePropByPath(this.prefixPortPath(portId), path);
    }
    portProp(portId, path, value, options) {
        if (path == null) {
            return this.getPortProp(portId);
        }
        if (typeof path === 'string' || Array.isArray(path)) {
            if (arguments.length === 2) {
                return this.getPortProp(portId, path);
            }
            if (value == null) {
                return this.removePortProp(portId, path, options);
            }
            return this.setPortProp(portId, path, value, options);
        }
        return this.setPortProp(portId, path, value);
    }
    prefixPortPath(portId, path) {
        const index = this.getPortIndex(portId);
        if (index === -1) {
            throw new Error(`Unable to find port with id: "${portId}"`);
        }
        if (path == null || path === '') {
            return ['ports', 'items', `${index}`];
        }
        if (Array.isArray(path)) {
            return ['ports', 'items', `${index}`, ...path];
        }
        return `ports/items/${index}/${path}`;
    }
    addPort(port, options) {
        const ports = [...this.ports.items];
        ports.push(port);
        this.setPropByPath('ports/items', ports, options);
        return this;
    }
    addPorts(ports, options) {
        this.setPropByPath('ports/items', [...this.ports.items, ...ports], options);
        return this;
    }
    insertPort(index, port, options) {
        const ports = [...this.ports.items];
        ports.splice(index, 0, port);
        this.setPropByPath('ports/items', ports, options);
        return this;
    }
    removePort(port, options = {}) {
        return this.removePortAt(this.getPortIndex(port), options);
    }
    removePortAt(index, options = {}) {
        if (index >= 0) {
            const ports = [...this.ports.items];
            ports.splice(index, 1);
            options.rewrite = true;
            this.setPropByPath('ports/items', ports, options);
        }
        return this;
    }
    removePorts(portsForRemoval, opt) {
        let options;
        if (Array.isArray(portsForRemoval)) {
            options = opt || {};
            if (portsForRemoval.length) {
                options.rewrite = true;
                const currentPorts = [...this.ports.items];
                const remainingPorts = currentPorts.filter((cp) => !portsForRemoval.some((p) => {
                    const id = typeof p === 'string' ? p : p.id;
                    return cp.id === id;
                }));
                this.setPropByPath('ports/items', remainingPorts, options);
            }
        }
        else {
            options = portsForRemoval || {};
            options.rewrite = true;
            this.setPropByPath('ports/items', [], options);
        }
        return this;
    }
    getParsedPorts() {
        return this.port.getPorts();
    }
    getParsedGroups() {
        return this.port.groups;
    }
    getPortsLayoutByGroup(groupName, bbox) {
        return this.port.getPortsLayoutByGroup(groupName, bbox);
    }
    initPorts() {
        this.updatePortData();
        this.on('change:ports', () => {
            this.processRemovedPort();
            this.updatePortData();
        });
    }
    processRemovedPort() {
        const current = this.ports;
        const currentItemsMap = {};
        current.items.forEach((item) => {
            if (item.id) {
                currentItemsMap[item.id] = true;
            }
        });
        const removed = {};
        const previous = this.store.getPrevious('ports') || {
            items: [],
        };
        previous.items.forEach((item) => {
            if (item.id && !currentItemsMap[item.id]) {
                removed[item.id] = true;
            }
        });
        const model = this.model;
        if (model && !ObjectExt.isEmpty(removed)) {
            const incomings = model.getConnectedEdges(this, { incoming: true });
            incomings.forEach((edge) => {
                const portId = edge.getTargetPortId();
                if (portId && removed[portId]) {
                    edge.remove();
                }
            });
            const outgoings = model.getConnectedEdges(this, { outgoing: true });
            outgoings.forEach((edge) => {
                const portId = edge.getSourcePortId();
                if (portId && removed[portId]) {
                    edge.remove();
                }
            });
        }
    }
    validatePorts() {
        const ids = {};
        const errors = [];
        this.ports.items.forEach((p) => {
            if (typeof p !== 'object') {
                errors.push(`Invalid port ${p}.`);
            }
            if (p.id == null) {
                p.id = this.generatePortId();
            }
            if (ids[p.id]) {
                errors.push('Duplicitied port id.');
            }
            ids[p.id] = true;
        });
        return errors;
    }
    generatePortId() {
        return StringExt.uuid();
    }
    updatePortData() {
        const err = this.validatePorts();
        if (err.length > 0) {
            this.store.set('ports', this.store.getPrevious('ports'));
            throw new Error(err.join(' '));
        }
        const prev = this.port ? this.port.getPorts() : null;
        this.port = new PortManager(this.ports);
        const curr = this.port.getPorts();
        const added = prev
            ? curr.filter((item) => {
                if (!prev.find((prevPort) => prevPort.id === item.id)) {
                    return item;
                }
                return null;
            })
            : [...curr];
        const removed = prev
            ? prev.filter((item) => {
                if (!curr.find((curPort) => curPort.id === item.id)) {
                    return item;
                }
                return null;
            })
            : [];
        if (added.length > 0) {
            this.notify('ports:added', { added, cell: this, node: this });
        }
        if (removed.length > 0) {
            this.notify('ports:removed', { removed, cell: this, node: this });
        }
    }
}
Node.defaults = {
    angle: 0,
    position: { x: 0, y: 0 },
    size: { width: 1, height: 1 },
};
(function (Node) {
    Node.toStringTag = `X6.${Node.name}`;
    function isNode(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Node) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const node = instance;
        if ((tag == null || tag === Node.toStringTag) &&
            typeof node.isNode === 'function' &&
            typeof node.isEdge === 'function' &&
            typeof node.prop === 'function' &&
            typeof node.attr === 'function' &&
            typeof node.size === 'function' &&
            typeof node.position === 'function') {
            return true;
        }
        return false;
    }
    Node.isNode = isNode;
})(Node || (Node = {}));
(function (Node) {
    Node.config({
        propHooks(_a) {
            var { ports } = _a, metadata = __rest(_a, ["ports"]);
            if (ports) {
                metadata.ports = Array.isArray(ports) ? { items: ports } : ports;
            }
            return metadata;
        },
    });
})(Node || (Node = {}));
(function (Node) {
    Node.registry = Registry.create({
        type: 'node',
        process(shape, options) {
            if (ShareRegistry.exist(shape, true)) {
                throw new Error(`Node with name '${shape}' was registered by anthor Edge`);
            }
            if (typeof options === 'function') {
                options.config({ shape });
                return options;
            }
            let parent = Node;
            const { inherit } = options, config = __rest(options, ["inherit"]);
            if (inherit) {
                if (typeof inherit === 'string') {
                    const base = this.get(inherit);
                    if (base == null) {
                        this.onNotFound(inherit, 'inherited');
                    }
                    else {
                        parent = base;
                    }
                }
                else {
                    parent = inherit;
                }
            }
            if (config.constructorName == null) {
                config.constructorName = shape;
            }
            const ctor = parent.define.call(parent, config);
            ctor.config({ shape });
            return ctor;
        },
    });
    ShareRegistry.setNodeRegistry(Node.registry);
})(Node || (Node = {}));
(function (Node) {
    let counter = 0;
    function getClassName(name) {
        if (name) {
            return StringExt.pascalCase(name);
        }
        counter += 1;
        return `CustomNode${counter}`;
    }
    function define(config) {
        const { constructorName, overwrite } = config, others = __rest(config, ["constructorName", "overwrite"]);
        const ctor = ObjectExt.createClass(getClassName(constructorName || others.shape), this);
        ctor.config(others);
        if (others.shape) {
            Node.registry.register(others.shape, ctor, overwrite);
        }
        return ctor;
    }
    Node.define = define;
    function create(options) {
        const shape = options.shape || 'rect';
        const Ctor = Node.registry.get(shape);
        if (Ctor) {
            return new Ctor(options);
        }
        return Node.registry.onNotFound(shape);
    }
    Node.create = create;
})(Node || (Node = {}));
//# sourceMappingURL=node.js.map