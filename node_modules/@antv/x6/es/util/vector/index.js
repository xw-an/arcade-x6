import { Path } from '../../geometry';
import * as Dom from '../dom/core';
export class Vector {
    constructor(elem, attrs, children) {
        if (!elem) {
            throw new TypeError('Invalid element to create vector');
        }
        let node;
        if (Vector.isVector(elem)) {
            node = elem.node;
        }
        else if (typeof elem === 'string') {
            if (elem.toLowerCase() === 'svg') {
                node = Dom.createSvgDocument();
            }
            else if (elem[0] === '<') {
                const doc = Dom.createSvgDocument(elem);
                // only import the first child
                node = document.importNode(doc.firstChild, true);
            }
            else {
                node = document.createElementNS(Dom.ns.svg, elem);
            }
        }
        else {
            node = elem;
        }
        this.node = node;
        if (attrs) {
            this.setAttributes(attrs);
        }
        if (children) {
            this.append(children);
        }
    }
    get [Symbol.toStringTag]() {
        return Vector.toStringTag;
    }
    get type() {
        return this.node.nodeName;
    }
    get id() {
        return this.node.id;
    }
    set id(id) {
        this.node.id = id;
    }
    transform(matrix, options) {
        if (matrix == null) {
            return Dom.transform(this.node);
        }
        Dom.transform(this.node, matrix, options);
        return this;
    }
    translate(tx, ty = 0, options = {}) {
        if (tx == null) {
            return Dom.translate(this.node);
        }
        Dom.translate(this.node, tx, ty, options);
        return this;
    }
    rotate(angle, cx, cy, options = {}) {
        if (angle == null) {
            return Dom.rotate(this.node);
        }
        Dom.rotate(this.node, angle, cx, cy, options);
        return this;
    }
    scale(sx, sy) {
        if (sx == null) {
            return Dom.scale(this.node);
        }
        Dom.scale(this.node, sx, sy);
        return this;
    }
    /**
     * Returns an SVGMatrix that specifies the transformation necessary
     * to convert this coordinate system into `target` coordinate system.
     */
    getTransformToElement(target) {
        const ref = Vector.toNode(target);
        return Dom.getTransformToElement(this.node, ref);
    }
    removeAttribute(name) {
        Dom.removeAttribute(this.node, name);
        return this;
    }
    getAttribute(name) {
        return Dom.getAttribute(this.node, name);
    }
    setAttribute(name, value) {
        Dom.setAttribute(this.node, name, value);
        return this;
    }
    setAttributes(attrs) {
        Dom.setAttributes(this.node, attrs);
        return this;
    }
    attr(name, value) {
        if (name == null) {
            return Dom.attr(this.node);
        }
        if (typeof name === 'string' && value === undefined) {
            return Dom.attr(this.node, name);
        }
        if (typeof name === 'object') {
            Dom.attr(this.node, name);
        }
        else {
            Dom.attr(this.node, name, value);
        }
        return this;
    }
    svg() {
        return this.node instanceof SVGSVGElement
            ? this
            : Vector.create(this.node.ownerSVGElement);
    }
    defs() {
        const context = this.svg() || this;
        const defsNode = context.node.getElementsByTagName('defs')[0];
        if (defsNode) {
            return Vector.create(defsNode);
        }
        return Vector.create('defs').appendTo(context);
    }
    text(content, options = {}) {
        Dom.text(this.node, content, options);
        return this;
    }
    tagName() {
        return Dom.tagName(this.node);
    }
    clone() {
        return Vector.create(this.node.cloneNode(true));
    }
    remove() {
        Dom.remove(this.node);
        return this;
    }
    empty() {
        Dom.empty(this.node);
        return this;
    }
    append(elems) {
        Dom.append(this.node, Vector.toNodes(elems));
        return this;
    }
    appendTo(target) {
        Dom.appendTo(this.node, Vector.isVector(target) ? target.node : target);
        return this;
    }
    prepend(elems) {
        Dom.prepend(this.node, Vector.toNodes(elems));
        return this;
    }
    before(elems) {
        Dom.before(this.node, Vector.toNodes(elems));
        return this;
    }
    replace(elem) {
        if (this.node.parentNode) {
            this.node.parentNode.replaceChild(Vector.toNode(elem), this.node);
        }
        return Vector.create(elem);
    }
    first() {
        return this.node.firstChild
            ? Vector.create(this.node.firstChild)
            : null;
    }
    last() {
        return this.node.lastChild
            ? Vector.create(this.node.lastChild)
            : null;
    }
    get(index) {
        const child = this.node.childNodes[index];
        return child ? Vector.create(child) : null;
    }
    indexOf(elem) {
        const children = Array.prototype.slice.call(this.node.childNodes);
        return children.indexOf(Vector.toNode(elem));
    }
    find(selector) {
        const vels = [];
        const nodes = Dom.find(this.node, selector);
        if (nodes) {
            for (let i = 0, ii = nodes.length; i < ii; i += 1) {
                vels.push(Vector.create(nodes[i]));
            }
        }
        return vels;
    }
    findOne(selector) {
        const found = Dom.findOne(this.node, selector);
        return found ? Vector.create(found) : null;
    }
    findParentByClass(className, terminator) {
        const node = Dom.findParentByClass(this.node, className, terminator);
        return node ? Vector.create(node) : null;
    }
    matches(selector) {
        const node = this.node;
        const matches = this.node.matches;
        const matcher = node.matches ||
            node.matchesSelector ||
            node.msMatchesSelector ||
            node.mozMatchesSelector ||
            node.webkitMatchesSelector ||
            node.oMatchesSelector ||
            null;
        return matcher && matcher.call(node, selector);
    }
    contains(child) {
        return Dom.contains(this.node, Vector.isVector(child) ? child.node : child);
    }
    wrap(node) {
        const vel = Vector.create(node);
        const parentNode = this.node.parentNode;
        if (parentNode != null) {
            parentNode.insertBefore(vel.node, this.node);
        }
        return vel.append(this);
    }
    parent(type) {
        let parent = this; // eslint-disable-line @typescript-eslint/no-this-alias
        // check for parent
        if (parent.node.parentNode == null) {
            return null;
        }
        // get parent element
        parent = Vector.create(parent.node.parentNode);
        if (type == null) {
            return parent;
        }
        // loop trough ancestors if type is given
        do {
            if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) {
                return parent;
            }
        } while ((parent = Vector.create(parent.node.parentNode)));
        return parent;
    }
    children() {
        const children = this.node.childNodes;
        const vels = [];
        for (let i = 0; i < children.length; i += 1) {
            const currentChild = children[i];
            if (currentChild.nodeType === 1) {
                vels.push(Vector.create(children[i]));
            }
        }
        return vels;
    }
    eachChild(fn, deep) {
        const children = this.children();
        for (let i = 0, l = children.length; i < l; i += 1) {
            fn.call(children[i], children[i], i, children);
            if (deep) {
                children[i].eachChild(fn, deep);
            }
        }
        return this;
    }
    index() {
        return Dom.index(this.node);
    }
    hasClass(className) {
        return Dom.hasClass(this.node, className);
    }
    addClass(className) {
        Dom.addClass(this.node, className);
        return this;
    }
    removeClass(className) {
        Dom.removeClass(this.node, className);
        return this;
    }
    toggleClass(className, stateVal) {
        Dom.toggleClass(this.node, className, stateVal);
        return this;
    }
    toLocalPoint(x, y) {
        return Dom.toLocalPoint(this.node, x, y);
    }
    toGeometryShape() {
        return Dom.toGeometryShape(this.node);
    }
    translateCenterToPoint(p) {
        const bbox = this.getBBox({ target: this.svg() });
        const center = bbox.getCenter();
        this.translate(p.x - center.x, p.y - center.y);
        return this;
    }
    translateAndAutoOrient(position, reference, target) {
        Dom.translateAndAutoOrient(this.node, position, reference, target);
        return this;
    }
    animate(options) {
        return Dom.animate(this.node, options);
    }
    animateTransform(options) {
        return Dom.animateTransform(this.node, options);
    }
    animateAlongPath(options, path) {
        return Dom.animateAlongPath(this.node, options, path);
    }
    /**
     * Normalize this element's d attribute. SVGPathElements without
     * a path data attribute obtain a value of 'M 0 0'.
     */
    normalizePath() {
        const tagName = this.tagName();
        if (tagName === 'path') {
            this.attr('d', Path.normalize(this.attr('d')));
        }
        return this;
    }
    /**
     * Returns the bounding box of the element after transformations are applied.
     * If `withoutTransformations` is `true`, transformations of the element
     * will not be considered when computing the bounding box. If `target` is
     * specified, bounding box will be computed relatively to the target element.
     */
    bbox(withoutTransformations, target) {
        return Dom.bbox(this.node, withoutTransformations, target);
    }
    getBBox(options = {}) {
        return Dom.getBBox(this.node, {
            recursive: options.recursive,
            target: options.target ? Vector.toNode(options.target) : null,
        });
    }
    /**
     * Samples the underlying SVG element (it currently works only on
     * paths - where it is most useful anyway). Returns an array of objects
     * of the form `{ x: Number, y: Number, distance: Number }`. Each of these
     * objects represent a point on the path. This basically creates a discrete
     * representation of the path (which is possible a curve). The sampling
     * interval defines the accuracy of the sampling. In other words, we travel
     * from the beginning of the path to the end by interval distance (on the
     * path, not between the resulting points) and collect the discrete points
     * on the path. This is very useful in many situations. For example, SVG
     * does not provide a built-in mechanism to find intersections between two
     * paths. Using sampling, we can just generate bunch of points for each of
     * the path and find the closest ones from each set.
     */
    sample(interval = 1) {
        if (this.node instanceof SVGPathElement) {
            return Dom.sample(this.node, interval);
        }
        return [];
    }
    toPath() {
        return Vector.create(Dom.toPath(this.node));
    }
    toPathData() {
        return Dom.toPathData(this.node);
    }
}
(function (Vector) {
    Vector.toStringTag = `X6.${Vector.name}`;
    function isVector(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Vector) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const vector = instance;
        if ((tag == null || tag === Vector.toStringTag) &&
            vector.node instanceof SVGElement &&
            typeof vector.animate === 'function' &&
            typeof vector.sample === 'function' &&
            typeof vector.normalizePath === 'function' &&
            typeof vector.toPath === 'function') {
            return true;
        }
        return false;
    }
    Vector.isVector = isVector;
    function create(elem, attrs, children) {
        return new Vector(elem, attrs, children);
    }
    Vector.create = create;
    function createVectors(markup) {
        if (markup[0] === '<') {
            const svgDoc = Dom.createSvgDocument(markup);
            const vels = [];
            for (let i = 0, ii = svgDoc.childNodes.length; i < ii; i += 1) {
                const childNode = svgDoc.childNodes[i];
                vels.push(create(document.importNode(childNode, true)));
            }
            return vels;
        }
        return [create(markup)];
    }
    Vector.createVectors = createVectors;
    function toNode(elem) {
        if (isVector(elem)) {
            return elem.node;
        }
        return elem;
    }
    Vector.toNode = toNode;
    function toNodes(elems) {
        if (Array.isArray(elems)) {
            return elems.map((elem) => toNode(elem));
        }
        return [toNode(elems)];
    }
    Vector.toNodes = toNodes;
})(Vector || (Vector = {}));
//# sourceMappingURL=index.js.map