"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInputElement = exports.clickable = exports.isHTMLElement = exports.appendTo = exports.before = exports.prepend = exports.append = exports.empty = exports.remove = exports.contains = exports.findParentByClass = exports.findOne = exports.find = exports.index = exports.tagName = exports.parseXML = exports.createSvgDocument = exports.createSvgElement = exports.createElementNS = exports.createElement = exports.svgVersion = exports.ns = exports.isSVGGraphicsElement = exports.ensureId = exports.uniqueId = void 0;
var class_1 = require("./class");
var idCounter = 0;
function uniqueId() {
    idCounter += 1;
    return "v" + idCounter;
}
exports.uniqueId = uniqueId;
function ensureId(elem) {
    if (elem.id == null || elem.id === '') {
        elem.id = uniqueId();
    }
    return elem.id;
}
exports.ensureId = ensureId;
/**
 * Returns true if object is an instance of SVGGraphicsElement.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement
 */
function isSVGGraphicsElement(elem) {
    if (elem == null) {
        return false;
    }
    return typeof elem.getScreenCTM === 'function' && elem instanceof SVGElement;
}
exports.isSVGGraphicsElement = isSVGGraphicsElement;
exports.ns = {
    svg: 'http://www.w3.org/2000/svg',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xlink: 'http://www.w3.org/1999/xlink',
    xhtml: 'http://www.w3.org/1999/xhtml',
};
exports.svgVersion = '1.1';
function createElement(tagName, doc) {
    if (doc === void 0) { doc = document; }
    return doc.createElement(tagName);
}
exports.createElement = createElement;
function createElementNS(tagName, namespaceURI, doc) {
    if (namespaceURI === void 0) { namespaceURI = exports.ns.xhtml; }
    if (doc === void 0) { doc = document; }
    return doc.createElementNS(namespaceURI, tagName);
}
exports.createElementNS = createElementNS;
function createSvgElement(tagName, doc) {
    if (doc === void 0) { doc = document; }
    return createElementNS(tagName, exports.ns.svg, doc);
}
exports.createSvgElement = createSvgElement;
function createSvgDocument(content) {
    if (content) {
        var xml = "<svg xmlns=\"" + exports.ns.svg + "\" xmlns:xlink=\"" + exports.ns.xlink + "\" version=\"" + exports.svgVersion + "\">" + content + "</svg>"; // lgtm[js/html-constructed-from-input]
        var documentElement = parseXML(xml, { async: false }).documentElement;
        return documentElement;
    }
    var svg = document.createElementNS(exports.ns.svg, 'svg');
    svg.setAttributeNS(exports.ns.xmlns, 'xmlns:xlink', exports.ns.xlink);
    svg.setAttribute('version', exports.svgVersion);
    return svg;
}
exports.createSvgDocument = createSvgDocument;
function parseXML(data, options) {
    if (options === void 0) { options = {}; }
    var xml;
    try {
        var parser = new DOMParser();
        if (options.async != null) {
            var instance = parser;
            instance.async = options.async;
        }
        xml = parser.parseFromString(data, options.mimeType || 'text/xml');
    }
    catch (error) {
        xml = undefined;
    }
    if (!xml || xml.getElementsByTagName('parsererror').length) {
        throw new Error("Invalid XML: " + data);
    }
    return xml;
}
exports.parseXML = parseXML;
function tagName(node, lowercase) {
    if (lowercase === void 0) { lowercase = true; }
    var nodeName = node.nodeName;
    return lowercase ? nodeName.toLowerCase() : nodeName.toUpperCase();
}
exports.tagName = tagName;
function index(elem) {
    var index = 0;
    var node = elem.previousSibling;
    while (node) {
        if (node.nodeType === 1) {
            index += 1;
        }
        node = node.previousSibling;
    }
    return index;
}
exports.index = index;
function find(elem, selector) {
    return elem.querySelectorAll(selector);
}
exports.find = find;
function findOne(elem, selector) {
    return elem.querySelector(selector);
}
exports.findOne = findOne;
function findParentByClass(elem, className, terminator) {
    var ownerSVGElement = elem.ownerSVGElement;
    var node = elem.parentNode;
    while (node && node !== terminator && node !== ownerSVGElement) {
        if ((0, class_1.hasClass)(node, className)) {
            return node;
        }
        node = node.parentNode;
    }
    return null;
}
exports.findParentByClass = findParentByClass;
function contains(parent, child) {
    var bup = child && child.parentNode;
    return (parent === bup ||
        !!(bup && bup.nodeType === 1 && parent.compareDocumentPosition(bup) & 16) // eslint-disable-line no-bitwise
    );
}
exports.contains = contains;
function remove(elem) {
    if (elem.parentNode) {
        elem.parentNode.removeChild(elem);
    }
}
exports.remove = remove;
function empty(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}
exports.empty = empty;
function append(elem, elems) {
    var arr = Array.isArray(elems) ? elems : [elems];
    arr.forEach(function (child) {
        if (child != null) {
            elem.appendChild(child);
        }
    });
}
exports.append = append;
function prepend(elem, elems) {
    var child = elem.firstChild;
    return child ? before(child, elems) : append(elem, elems);
}
exports.prepend = prepend;
function before(elem, elems) {
    var parent = elem.parentNode;
    if (parent) {
        var arr = Array.isArray(elems) ? elems : [elems];
        arr.forEach(function (child) {
            if (child != null) {
                parent.insertBefore(child, elem);
            }
        });
    }
}
exports.before = before;
function appendTo(elem, target) {
    if (target != null) {
        target.appendChild(elem);
    }
}
exports.appendTo = appendTo;
// Determines whether a node is an HTML node
function isHTMLElement(elem) {
    try {
        // Using W3 DOM2 (works for FF, Opera and Chrome)
        return elem instanceof HTMLElement;
    }
    catch (e) {
        // Browsers not supporting W3 DOM2 don't have HTMLElement and
        // an exception is thrown and we end up here. Testing some
        // properties that all elements have (works on IE7)
        return (typeof elem === 'object' &&
            elem.nodeType === 1 &&
            typeof elem.style === 'object' &&
            typeof elem.ownerDocument === 'object');
    }
}
exports.isHTMLElement = isHTMLElement;
function clickable(elem) {
    if (!elem || !isHTMLElement(elem)) {
        return false;
    }
    if (['a', 'button'].includes(tagName(elem))) {
        return true;
    }
    if (elem.getAttribute('role') === 'button' ||
        elem.getAttribute('type') === 'button') {
        return true;
    }
    return clickable(elem.parentNode);
}
exports.clickable = clickable;
function isInputElement(elem) {
    var elemTagName = tagName(elem);
    if (elemTagName === 'input') {
        var type = elem.getAttribute('type');
        if (type == null ||
            ['text', 'password', 'number', 'email', 'search', 'tel', 'url'].includes(type)) {
            return true;
        }
    }
    return false;
}
exports.isInputElement = isInputElement;
//# sourceMappingURL=elem.js.map