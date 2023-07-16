"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var geometry_1 = require("../../geometry");
var Dom = __importStar(require("../dom/core"));
var Vector = /** @class */ (function () {
    function Vector(elem, attrs, children) {
        if (!elem) {
            throw new TypeError('Invalid element to create vector');
        }
        var node;
        if (Vector.isVector(elem)) {
            node = elem.node;
        }
        else if (typeof elem === 'string') {
            if (elem.toLowerCase() === 'svg') {
                node = Dom.createSvgDocument();
            }
            else if (elem[0] === '<') {
                var doc = Dom.createSvgDocument(elem);
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
    Object.defineProperty(Vector.prototype, Symbol.toStringTag, {
        get: function () {
            return Vector.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "type", {
        get: function () {
            return this.node.nodeName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "id", {
        get: function () {
            return this.node.id;
        },
        set: function (id) {
            this.node.id = id;
        },
        enumerable: false,
        configurable: true
    });
    Vector.prototype.transform = function (matrix, options) {
        if (matrix == null) {
            return Dom.transform(this.node);
        }
        Dom.transform(this.node, matrix, options);
        return this;
    };
    Vector.prototype.translate = function (tx, ty, options) {
        if (ty === void 0) { ty = 0; }
        if (options === void 0) { options = {}; }
        if (tx == null) {
            return Dom.translate(this.node);
        }
        Dom.translate(this.node, tx, ty, options);
        return this;
    };
    Vector.prototype.rotate = function (angle, cx, cy, options) {
        if (options === void 0) { options = {}; }
        if (angle == null) {
            return Dom.rotate(this.node);
        }
        Dom.rotate(this.node, angle, cx, cy, options);
        return this;
    };
    Vector.prototype.scale = function (sx, sy) {
        if (sx == null) {
            return Dom.scale(this.node);
        }
        Dom.scale(this.node, sx, sy);
        return this;
    };
    /**
     * Returns an SVGMatrix that specifies the transformation necessary
     * to convert this coordinate system into `target` coordinate system.
     */
    Vector.prototype.getTransformToElement = function (target) {
        var ref = Vector.toNode(target);
        return Dom.getTransformToElement(this.node, ref);
    };
    Vector.prototype.removeAttribute = function (name) {
        Dom.removeAttribute(this.node, name);
        return this;
    };
    Vector.prototype.getAttribute = function (name) {
        return Dom.getAttribute(this.node, name);
    };
    Vector.prototype.setAttribute = function (name, value) {
        Dom.setAttribute(this.node, name, value);
        return this;
    };
    Vector.prototype.setAttributes = function (attrs) {
        Dom.setAttributes(this.node, attrs);
        return this;
    };
    Vector.prototype.attr = function (name, value) {
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
    };
    Vector.prototype.svg = function () {
        return this.node instanceof SVGSVGElement
            ? this
            : Vector.create(this.node.ownerSVGElement);
    };
    Vector.prototype.defs = function () {
        var context = this.svg() || this;
        var defsNode = context.node.getElementsByTagName('defs')[0];
        if (defsNode) {
            return Vector.create(defsNode);
        }
        return Vector.create('defs').appendTo(context);
    };
    Vector.prototype.text = function (content, options) {
        if (options === void 0) { options = {}; }
        Dom.text(this.node, content, options);
        return this;
    };
    Vector.prototype.tagName = function () {
        return Dom.tagName(this.node);
    };
    Vector.prototype.clone = function () {
        return Vector.create(this.node.cloneNode(true));
    };
    Vector.prototype.remove = function () {
        Dom.remove(this.node);
        return this;
    };
    Vector.prototype.empty = function () {
        Dom.empty(this.node);
        return this;
    };
    Vector.prototype.append = function (elems) {
        Dom.append(this.node, Vector.toNodes(elems));
        return this;
    };
    Vector.prototype.appendTo = function (target) {
        Dom.appendTo(this.node, Vector.isVector(target) ? target.node : target);
        return this;
    };
    Vector.prototype.prepend = function (elems) {
        Dom.prepend(this.node, Vector.toNodes(elems));
        return this;
    };
    Vector.prototype.before = function (elems) {
        Dom.before(this.node, Vector.toNodes(elems));
        return this;
    };
    Vector.prototype.replace = function (elem) {
        if (this.node.parentNode) {
            this.node.parentNode.replaceChild(Vector.toNode(elem), this.node);
        }
        return Vector.create(elem);
    };
    Vector.prototype.first = function () {
        return this.node.firstChild
            ? Vector.create(this.node.firstChild)
            : null;
    };
    Vector.prototype.last = function () {
        return this.node.lastChild
            ? Vector.create(this.node.lastChild)
            : null;
    };
    Vector.prototype.get = function (index) {
        var child = this.node.childNodes[index];
        return child ? Vector.create(child) : null;
    };
    Vector.prototype.indexOf = function (elem) {
        var children = Array.prototype.slice.call(this.node.childNodes);
        return children.indexOf(Vector.toNode(elem));
    };
    Vector.prototype.find = function (selector) {
        var vels = [];
        var nodes = Dom.find(this.node, selector);
        if (nodes) {
            for (var i = 0, ii = nodes.length; i < ii; i += 1) {
                vels.push(Vector.create(nodes[i]));
            }
        }
        return vels;
    };
    Vector.prototype.findOne = function (selector) {
        var found = Dom.findOne(this.node, selector);
        return found ? Vector.create(found) : null;
    };
    Vector.prototype.findParentByClass = function (className, terminator) {
        var node = Dom.findParentByClass(this.node, className, terminator);
        return node ? Vector.create(node) : null;
    };
    Vector.prototype.matches = function (selector) {
        var node = this.node;
        var matches = this.node.matches;
        var matcher = node.matches ||
            node.matchesSelector ||
            node.msMatchesSelector ||
            node.mozMatchesSelector ||
            node.webkitMatchesSelector ||
            node.oMatchesSelector ||
            null;
        return matcher && matcher.call(node, selector);
    };
    Vector.prototype.contains = function (child) {
        return Dom.contains(this.node, Vector.isVector(child) ? child.node : child);
    };
    Vector.prototype.wrap = function (node) {
        var vel = Vector.create(node);
        var parentNode = this.node.parentNode;
        if (parentNode != null) {
            parentNode.insertBefore(vel.node, this.node);
        }
        return vel.append(this);
    };
    Vector.prototype.parent = function (type) {
        var parent = this; // eslint-disable-line @typescript-eslint/no-this-alias
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
    };
    Vector.prototype.children = function () {
        var children = this.node.childNodes;
        var vels = [];
        for (var i = 0; i < children.length; i += 1) {
            var currentChild = children[i];
            if (currentChild.nodeType === 1) {
                vels.push(Vector.create(children[i]));
            }
        }
        return vels;
    };
    Vector.prototype.eachChild = function (fn, deep) {
        var children = this.children();
        for (var i = 0, l = children.length; i < l; i += 1) {
            fn.call(children[i], children[i], i, children);
            if (deep) {
                children[i].eachChild(fn, deep);
            }
        }
        return this;
    };
    Vector.prototype.index = function () {
        return Dom.index(this.node);
    };
    Vector.prototype.hasClass = function (className) {
        return Dom.hasClass(this.node, className);
    };
    Vector.prototype.addClass = function (className) {
        Dom.addClass(this.node, className);
        return this;
    };
    Vector.prototype.removeClass = function (className) {
        Dom.removeClass(this.node, className);
        return this;
    };
    Vector.prototype.toggleClass = function (className, stateVal) {
        Dom.toggleClass(this.node, className, stateVal);
        return this;
    };
    Vector.prototype.toLocalPoint = function (x, y) {
        return Dom.toLocalPoint(this.node, x, y);
    };
    Vector.prototype.toGeometryShape = function () {
        return Dom.toGeometryShape(this.node);
    };
    Vector.prototype.translateCenterToPoint = function (p) {
        var bbox = this.getBBox({ target: this.svg() });
        var center = bbox.getCenter();
        this.translate(p.x - center.x, p.y - center.y);
        return this;
    };
    Vector.prototype.translateAndAutoOrient = function (position, reference, target) {
        Dom.translateAndAutoOrient(this.node, position, reference, target);
        return this;
    };
    Vector.prototype.animate = function (options) {
        return Dom.animate(this.node, options);
    };
    Vector.prototype.animateTransform = function (options) {
        return Dom.animateTransform(this.node, options);
    };
    Vector.prototype.animateAlongPath = function (options, path) {
        return Dom.animateAlongPath(this.node, options, path);
    };
    /**
     * Normalize this element's d attribute. SVGPathElements without
     * a path data attribute obtain a value of 'M 0 0'.
     */
    Vector.prototype.normalizePath = function () {
        var tagName = this.tagName();
        if (tagName === 'path') {
            this.attr('d', geometry_1.Path.normalize(this.attr('d')));
        }
        return this;
    };
    /**
     * Returns the bounding box of the element after transformations are applied.
     * If `withoutTransformations` is `true`, transformations of the element
     * will not be considered when computing the bounding box. If `target` is
     * specified, bounding box will be computed relatively to the target element.
     */
    Vector.prototype.bbox = function (withoutTransformations, target) {
        return Dom.bbox(this.node, withoutTransformations, target);
    };
    Vector.prototype.getBBox = function (options) {
        if (options === void 0) { options = {}; }
        return Dom.getBBox(this.node, {
            recursive: options.recursive,
            target: options.target ? Vector.toNode(options.target) : null,
        });
    };
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
    Vector.prototype.sample = function (interval) {
        if (interval === void 0) { interval = 1; }
        if (this.node instanceof SVGPathElement) {
            return Dom.sample(this.node, interval);
        }
        return [];
    };
    Vector.prototype.toPath = function () {
        return Vector.create(Dom.toPath(this.node));
    };
    Vector.prototype.toPathData = function () {
        return Dom.toPathData(this.node);
    };
    return Vector;
}());
exports.Vector = Vector;
(function (Vector) {
    Vector.toStringTag = "X6." + Vector.name;
    function isVector(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Vector) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var vector = instance;
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
            var svgDoc = Dom.createSvgDocument(markup);
            var vels = [];
            for (var i = 0, ii = svgDoc.childNodes.length; i < ii; i += 1) {
                var childNode = svgDoc.childNodes[i];
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
            return elems.map(function (elem) { return toNode(elem); });
        }
        return [toNode(elems)];
    }
    Vector.toNodes = toNodes;
})(Vector = exports.Vector || (exports.Vector = {}));
exports.Vector = Vector;
//# sourceMappingURL=index.js.map