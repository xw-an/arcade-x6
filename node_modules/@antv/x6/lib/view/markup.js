"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markup = void 0;
var jquery_1 = __importDefault(require("jquery"));
var util_1 = require("../util");
// eslint-disable-next-line
var Markup;
(function (Markup) {
    function isJSONMarkup(markup) {
        return markup != null && !isStringMarkup(markup);
    }
    Markup.isJSONMarkup = isJSONMarkup;
    function isStringMarkup(markup) {
        return markup != null && typeof markup === 'string';
    }
    Markup.isStringMarkup = isStringMarkup;
    function clone(markup) {
        return markup == null || isStringMarkup(markup)
            ? markup
            : util_1.ObjectExt.cloneDeep(markup);
    }
    Markup.clone = clone;
    /**
     * Removes blank space in markup to prevent create empty text node.
     */
    function sanitize(markup) {
        return ("" + markup)
            .trim()
            .replace(/[\r|\n]/g, ' ')
            .replace(/>\s+</g, '><');
    }
    Markup.sanitize = sanitize;
    function parseStringMarkup(markup) {
        var fragment = document.createDocumentFragment();
        var groups = {};
        var selectors = {};
        var sanitized = sanitize(markup);
        var nodes = util_1.StringExt.sanitizeHTML(sanitized, { raw: true });
        nodes.forEach(function (node) {
            fragment.appendChild(node);
        });
        return { fragment: fragment, selectors: selectors, groups: groups };
    }
    Markup.parseStringMarkup = parseStringMarkup;
    function parseJSONMarkup(markup, options) {
        if (options === void 0) { options = { ns: util_1.Dom.ns.svg }; }
        var fragment = document.createDocumentFragment();
        var groups = {};
        var selectors = {};
        var queue = [
            {
                markup: Array.isArray(markup) ? markup : [markup],
                parent: fragment,
                ns: options.ns,
            },
        ];
        var _loop_1 = function () {
            var item = queue.pop();
            var ns = item.ns || util_1.Dom.ns.svg;
            var defines = item.markup;
            var parentNode = item.parent;
            defines.forEach(function (define) {
                // tagName
                var tagName = define.tagName;
                if (!tagName) {
                    throw new TypeError('Invalid tagName');
                }
                // ns
                if (define.ns) {
                    ns = define.ns;
                }
                var svg = ns === util_1.Dom.ns.svg;
                var node = ns
                    ? util_1.Dom.createElementNS(tagName, ns)
                    : util_1.Dom.createElement(tagName);
                // attrs
                var attrs = define.attrs;
                if (attrs) {
                    if (svg) {
                        util_1.Dom.attr(node, util_1.Dom.kebablizeAttrs(attrs));
                    }
                    else {
                        (0, jquery_1.default)(node).attr(attrs);
                    }
                }
                // style
                var style = define.style;
                if (style) {
                    (0, jquery_1.default)(node).css(style);
                }
                // classname
                var className = define.className;
                if (className != null) {
                    node.setAttribute('class', Array.isArray(className) ? className.join(' ') : className);
                }
                // textContent
                if (define.textContent) {
                    node.textContent = define.textContent;
                }
                // selector
                var selector = define.selector;
                if (selector != null) {
                    if (selectors[selector]) {
                        throw new TypeError('Selector must be unique');
                    }
                    selectors[selector] = node;
                }
                // group
                if (define.groupSelector) {
                    var nodeGroups = define.groupSelector;
                    if (!Array.isArray(nodeGroups)) {
                        nodeGroups = [nodeGroups];
                    }
                    nodeGroups.forEach(function (name) {
                        if (!groups[name]) {
                            groups[name] = [];
                        }
                        groups[name].push(node);
                    });
                }
                parentNode.appendChild(node);
                // children
                var children = define.children;
                if (Array.isArray(children)) {
                    queue.push({ ns: ns, markup: children, parent: node });
                }
            });
        };
        while (queue.length > 0) {
            _loop_1();
        }
        Object.keys(groups).forEach(function (groupName) {
            if (selectors[groupName]) {
                throw new Error('Ambiguous group selector');
            }
            selectors[groupName] = groups[groupName];
        });
        return { fragment: fragment, selectors: selectors, groups: groups };
    }
    Markup.parseJSONMarkup = parseJSONMarkup;
    function createContainer(firstChild) {
        return firstChild instanceof SVGElement
            ? util_1.Dom.createSvgElement('g')
            : util_1.Dom.createElement('div');
    }
    function renderMarkup(markup) {
        if (isStringMarkup(markup)) {
            var nodes = util_1.Vector.createVectors(markup);
            var count = nodes.length;
            if (count === 1) {
                return {
                    elem: nodes[0].node,
                };
            }
            if (count > 1) {
                var elem_1 = createContainer(nodes[0].node);
                nodes.forEach(function (node) {
                    elem_1.appendChild(node.node);
                });
                return { elem: elem_1 };
            }
            return {};
        }
        var result = parseJSONMarkup(markup);
        var fragment = result.fragment;
        var elem = null;
        if (fragment.childNodes.length > 1) {
            elem = createContainer(fragment.firstChild);
            elem.appendChild(fragment);
        }
        else {
            elem = fragment.firstChild;
        }
        return { elem: elem, selectors: result.selectors };
    }
    Markup.renderMarkup = renderMarkup;
    function parseLabelStringMarkup(markup) {
        var children = util_1.Vector.createVectors(markup);
        var fragment = document.createDocumentFragment();
        for (var i = 0, n = children.length; i < n; i += 1) {
            var currentChild = children[i].node;
            fragment.appendChild(currentChild);
        }
        return { fragment: fragment, selectors: {} };
    }
    Markup.parseLabelStringMarkup = parseLabelStringMarkup;
})(Markup = exports.Markup || (exports.Markup = {}));
// eslint-disable-next-line
(function (Markup) {
    function getSelector(elem, stop, prev) {
        if (elem != null) {
            var selector = void 0;
            var tagName = elem.tagName.toLowerCase();
            if (elem === stop) {
                if (typeof prev === 'string') {
                    selector = "> " + tagName + " > " + prev;
                }
                else {
                    selector = "> " + tagName;
                }
                return selector;
            }
            var parent_1 = elem.parentNode;
            if (parent_1 && parent_1.childNodes.length > 1) {
                var nth = util_1.Dom.index(elem) + 1;
                selector = tagName + ":nth-child(" + nth + ")";
            }
            else {
                selector = tagName;
            }
            if (prev) {
                selector += " > " + prev;
            }
            return getSelector(elem.parentNode, stop, selector);
        }
        return prev;
    }
    Markup.getSelector = getSelector;
    function parseNode(node, root, ns) {
        if (node.nodeName === '#text') {
            return null;
        }
        var selector = null;
        var groupSelector = null;
        // let classNames: string | null = null
        var attrs = null;
        var isCSSSelector = false;
        var markup = {
            tagName: node.tagName,
        };
        if (node.attributes) {
            attrs = {};
            for (var i = 0, l = node.attributes.length; i < l; i += 1) {
                var attr = node.attributes[i];
                var name_1 = attr.nodeName;
                var value = attr.nodeValue;
                if (name_1 === 'selector') {
                    selector = value;
                }
                else if (name_1 === 'groupSelector') {
                    groupSelector = value;
                }
                else if (name_1 === 'class') {
                    markup.attrs = { class: value };
                }
                else {
                    attrs[name_1] = value;
                }
            }
        }
        if (selector == null) {
            isCSSSelector = true;
            selector = getSelector(node, root);
        }
        if (node.namespaceURI) {
            markup.ns = node.namespaceURI;
        }
        if (markup.ns == null) {
            if ([
                'body',
                'div',
                'section',
                'main',
                'nav',
                'footer',
                'span',
                'p',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'ul',
                'ol',
                'dl',
                'center',
                'strong',
                'pre',
                'form',
                'select',
                'textarea',
                'fieldset',
                'marquee',
                'bgsound',
                'iframe',
                'frameset',
            ].includes(node.tagName)) {
                markup.ns = util_1.Dom.ns.xhtml;
            }
            else if (ns) {
                markup.ns = ns;
            }
        }
        if (selector) {
            markup.selector = selector;
        }
        if (groupSelector != null) {
            markup.groupSelector = groupSelector;
        }
        return {
            markup: markup,
            attrs: attrs,
            isCSSSelector: isCSSSelector,
        };
    }
    function xml2json(xml) {
        var sanitized = Markup.sanitize(xml);
        var doc = util_1.Dom.parseXML(sanitized, { mimeType: 'image/svg+xml' });
        var nodes = Array.prototype.slice.call(doc.childNodes);
        var attrMap = {};
        var markupMap = new WeakMap();
        var parse = function (node, root, ns) {
            var data = parseNode(node, root, ns);
            if (data == null) {
                var parent_2 = markupMap.get(node.parentNode);
                if (parent_2 && node.textContent) {
                    parent_2.textContent = node.textContent;
                }
            }
            else {
                var markup_1 = data.markup, attrs = data.attrs, isCSSSelector = data.isCSSSelector;
                markupMap.set(node, markup_1);
                if (markup_1.selector && attrs != null) {
                    if (Object.keys(attrs).length) {
                        attrMap[markup_1.selector] = attrs;
                    }
                    if (isCSSSelector) {
                        delete markup_1.selector;
                    }
                }
                if (node.childNodes && node.childNodes.length > 0) {
                    for (var i = 0, l = node.childNodes.length; i < l; i += 1) {
                        var child = node.childNodes[i];
                        var childMarkup = parse(child, root, markup_1.ns);
                        if (childMarkup) {
                            if (markup_1.children == null) {
                                markup_1.children = [];
                            }
                            markup_1.children.push(childMarkup);
                        }
                    }
                }
                return markup_1;
            }
        };
        var markup = nodes
            .map(function (node) { return parse(node, node); })
            .filter(function (mk) { return mk != null; });
        return {
            markup: markup,
            attrs: attrMap,
        };
    }
    Markup.xml2json = xml2json;
})(Markup = exports.Markup || (exports.Markup = {}));
// eslint-disable-next-line
(function (Markup) {
    function getPortContainerMarkup() {
        return 'g';
    }
    Markup.getPortContainerMarkup = getPortContainerMarkup;
    function getPortMarkup() {
        return {
            tagName: 'circle',
            selector: 'circle',
            attrs: {
                r: 10,
                fill: '#FFFFFF',
                stroke: '#000000',
            },
        };
    }
    Markup.getPortMarkup = getPortMarkup;
    function getPortLabelMarkup() {
        return {
            tagName: 'text',
            selector: 'text',
            attrs: {
                fill: '#000000',
            },
        };
    }
    Markup.getPortLabelMarkup = getPortLabelMarkup;
})(Markup = exports.Markup || (exports.Markup = {}));
// eslint-disable-next-line
(function (Markup) {
    function getEdgeMarkup() {
        return Markup.sanitize("\n    <path class=\"connection\" stroke=\"black\" d=\"M 0 0 0 0\"/>\n    <path class=\"source-marker\" fill=\"black\" stroke=\"black\" d=\"M 0 0 0 0\"/>\n    <path class=\"target-marker\" fill=\"black\" stroke=\"black\" d=\"M 0 0 0 0\"/>\n    <path class=\"connection-wrap\" d=\"M 0 0 0 0\"/>\n    <g class=\"labels\"/>\n    <g class=\"vertices\"/>\n    <g class=\"arrowheads\"/>\n    <g class=\"tools\"/>\n  ");
    }
    Markup.getEdgeMarkup = getEdgeMarkup;
    function getEdgeToolMarkup() {
        return Markup.sanitize("\n    <g class=\"edge-tool\">\n      <g class=\"tool-remove\" event=\"edge:remove\">\n        <circle r=\"11\" />\n        <path transform=\"scale(.8) translate(-16, -16)\" d=\"M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z\" />\n        <title>Remove edge.</title>\n      </g>\n      <g class=\"tool-options\" event=\"edge:options\">\n        <circle r=\"11\" transform=\"translate(25)\"/>\n        <path fill=\"white\" transform=\"scale(.55) translate(29, -16)\" d=\"M31.229,17.736c0.064-0.571,0.104-1.148,0.104-1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,18.689,18.689,20.871,16,20.871z\"/>\n        <title>Edge options.</title>\n      </g>\n    </g>\n  ");
    }
    Markup.getEdgeToolMarkup = getEdgeToolMarkup;
    function getEdgeVertexMarkup() {
        return Markup.sanitize("\n    <g class=\"vertex-group\" transform=\"translate(<%= x %>, <%= y %>)\">\n      <circle class=\"vertex\" data-index=\"<%= index %>\" r=\"10\" />\n      <path class=\"vertex-remove-area\" data-index=\"<%= index %>\" d=\"M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z\" transform=\"translate(5, -33)\"/>\n      <path class=\"vertex-remove\" data-index=\"<%= index %>\" transform=\"scale(.8) translate(9.5, -37)\" d=\"M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z\">\n      <title>Remove vertex.</title>\n      </path>\n    </g>\n  ");
    }
    Markup.getEdgeVertexMarkup = getEdgeVertexMarkup;
    function getEdgeArrowheadMarkup() {
        return Markup.sanitize("\n    <g class=\"arrowhead-group arrowhead-group-<%= end %>\">\n      <path class=\"arrowhead\" data-terminal=\"<%= end %>\" d=\"M 26 0 L 0 13 L 26 26 z\" />\n    </g>\n  ");
    }
    Markup.getEdgeArrowheadMarkup = getEdgeArrowheadMarkup;
})(Markup = exports.Markup || (exports.Markup = {}));
// eslint-disable-next-line
(function (Markup) {
    function getForeignObjectMarkup(bare) {
        if (bare === void 0) { bare = false; }
        return {
            tagName: 'foreignObject',
            selector: 'fo',
            children: [
                {
                    ns: util_1.Dom.ns.xhtml,
                    tagName: 'body',
                    selector: 'foBody',
                    attrs: {
                        xmlns: util_1.Dom.ns.xhtml,
                    },
                    style: {
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                    },
                    children: bare
                        ? []
                        : [
                            {
                                tagName: 'div',
                                selector: 'foContent',
                                style: {
                                    width: '100%',
                                    height: '100%',
                                },
                            },
                        ],
                },
            ],
        };
    }
    Markup.getForeignObjectMarkup = getForeignObjectMarkup;
})(Markup = exports.Markup || (exports.Markup = {}));
//# sourceMappingURL=markup.js.map