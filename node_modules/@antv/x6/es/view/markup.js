import JQuery from 'jquery';
import { ObjectExt, StringExt, Dom, Vector } from '../util';
// eslint-disable-next-line
export var Markup;
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
            : ObjectExt.cloneDeep(markup);
    }
    Markup.clone = clone;
    /**
     * Removes blank space in markup to prevent create empty text node.
     */
    function sanitize(markup) {
        return `${markup}`
            .trim()
            .replace(/[\r|\n]/g, ' ')
            .replace(/>\s+</g, '><');
    }
    Markup.sanitize = sanitize;
    function parseStringMarkup(markup) {
        const fragment = document.createDocumentFragment();
        const groups = {};
        const selectors = {};
        const sanitized = sanitize(markup);
        const nodes = StringExt.sanitizeHTML(sanitized, { raw: true });
        nodes.forEach((node) => {
            fragment.appendChild(node);
        });
        return { fragment, selectors, groups };
    }
    Markup.parseStringMarkup = parseStringMarkup;
    function parseJSONMarkup(markup, options = { ns: Dom.ns.svg }) {
        const fragment = document.createDocumentFragment();
        const groups = {};
        const selectors = {};
        const queue = [
            {
                markup: Array.isArray(markup) ? markup : [markup],
                parent: fragment,
                ns: options.ns,
            },
        ];
        while (queue.length > 0) {
            const item = queue.pop();
            let ns = item.ns || Dom.ns.svg;
            const defines = item.markup;
            const parentNode = item.parent;
            defines.forEach((define) => {
                // tagName
                const tagName = define.tagName;
                if (!tagName) {
                    throw new TypeError('Invalid tagName');
                }
                // ns
                if (define.ns) {
                    ns = define.ns;
                }
                const svg = ns === Dom.ns.svg;
                const node = ns
                    ? Dom.createElementNS(tagName, ns)
                    : Dom.createElement(tagName);
                // attrs
                const attrs = define.attrs;
                if (attrs) {
                    if (svg) {
                        Dom.attr(node, Dom.kebablizeAttrs(attrs));
                    }
                    else {
                        JQuery(node).attr(attrs);
                    }
                }
                // style
                const style = define.style;
                if (style) {
                    JQuery(node).css(style);
                }
                // classname
                const className = define.className;
                if (className != null) {
                    node.setAttribute('class', Array.isArray(className) ? className.join(' ') : className);
                }
                // textContent
                if (define.textContent) {
                    node.textContent = define.textContent;
                }
                // selector
                const selector = define.selector;
                if (selector != null) {
                    if (selectors[selector]) {
                        throw new TypeError('Selector must be unique');
                    }
                    selectors[selector] = node;
                }
                // group
                if (define.groupSelector) {
                    let nodeGroups = define.groupSelector;
                    if (!Array.isArray(nodeGroups)) {
                        nodeGroups = [nodeGroups];
                    }
                    nodeGroups.forEach((name) => {
                        if (!groups[name]) {
                            groups[name] = [];
                        }
                        groups[name].push(node);
                    });
                }
                parentNode.appendChild(node);
                // children
                const children = define.children;
                if (Array.isArray(children)) {
                    queue.push({ ns, markup: children, parent: node });
                }
            });
        }
        Object.keys(groups).forEach((groupName) => {
            if (selectors[groupName]) {
                throw new Error('Ambiguous group selector');
            }
            selectors[groupName] = groups[groupName];
        });
        return { fragment, selectors, groups };
    }
    Markup.parseJSONMarkup = parseJSONMarkup;
    function createContainer(firstChild) {
        return firstChild instanceof SVGElement
            ? Dom.createSvgElement('g')
            : Dom.createElement('div');
    }
    function renderMarkup(markup) {
        if (isStringMarkup(markup)) {
            const nodes = Vector.createVectors(markup);
            const count = nodes.length;
            if (count === 1) {
                return {
                    elem: nodes[0].node,
                };
            }
            if (count > 1) {
                const elem = createContainer(nodes[0].node);
                nodes.forEach((node) => {
                    elem.appendChild(node.node);
                });
                return { elem };
            }
            return {};
        }
        const result = parseJSONMarkup(markup);
        const fragment = result.fragment;
        let elem = null;
        if (fragment.childNodes.length > 1) {
            elem = createContainer(fragment.firstChild);
            elem.appendChild(fragment);
        }
        else {
            elem = fragment.firstChild;
        }
        return { elem, selectors: result.selectors };
    }
    Markup.renderMarkup = renderMarkup;
    function parseLabelStringMarkup(markup) {
        const children = Vector.createVectors(markup);
        const fragment = document.createDocumentFragment();
        for (let i = 0, n = children.length; i < n; i += 1) {
            const currentChild = children[i].node;
            fragment.appendChild(currentChild);
        }
        return { fragment, selectors: {} };
    }
    Markup.parseLabelStringMarkup = parseLabelStringMarkup;
})(Markup || (Markup = {}));
// eslint-disable-next-line
(function (Markup) {
    function getSelector(elem, stop, prev) {
        if (elem != null) {
            let selector;
            const tagName = elem.tagName.toLowerCase();
            if (elem === stop) {
                if (typeof prev === 'string') {
                    selector = `> ${tagName} > ${prev}`;
                }
                else {
                    selector = `> ${tagName}`;
                }
                return selector;
            }
            const parent = elem.parentNode;
            if (parent && parent.childNodes.length > 1) {
                const nth = Dom.index(elem) + 1;
                selector = `${tagName}:nth-child(${nth})`;
            }
            else {
                selector = tagName;
            }
            if (prev) {
                selector += ` > ${prev}`;
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
        let selector = null;
        let groupSelector = null;
        // let classNames: string | null = null
        let attrs = null;
        let isCSSSelector = false;
        const markup = {
            tagName: node.tagName,
        };
        if (node.attributes) {
            attrs = {};
            for (let i = 0, l = node.attributes.length; i < l; i += 1) {
                const attr = node.attributes[i];
                const name = attr.nodeName;
                const value = attr.nodeValue;
                if (name === 'selector') {
                    selector = value;
                }
                else if (name === 'groupSelector') {
                    groupSelector = value;
                }
                else if (name === 'class') {
                    markup.attrs = { class: value };
                }
                else {
                    attrs[name] = value;
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
                markup.ns = Dom.ns.xhtml;
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
            markup,
            attrs,
            isCSSSelector,
        };
    }
    function xml2json(xml) {
        const sanitized = Markup.sanitize(xml);
        const doc = Dom.parseXML(sanitized, { mimeType: 'image/svg+xml' });
        const nodes = Array.prototype.slice.call(doc.childNodes);
        const attrMap = {};
        const markupMap = new WeakMap();
        const parse = (node, root, ns) => {
            const data = parseNode(node, root, ns);
            if (data == null) {
                const parent = markupMap.get(node.parentNode);
                if (parent && node.textContent) {
                    parent.textContent = node.textContent;
                }
            }
            else {
                const { markup, attrs, isCSSSelector } = data;
                markupMap.set(node, markup);
                if (markup.selector && attrs != null) {
                    if (Object.keys(attrs).length) {
                        attrMap[markup.selector] = attrs;
                    }
                    if (isCSSSelector) {
                        delete markup.selector;
                    }
                }
                if (node.childNodes && node.childNodes.length > 0) {
                    for (let i = 0, l = node.childNodes.length; i < l; i += 1) {
                        const child = node.childNodes[i];
                        const childMarkup = parse(child, root, markup.ns);
                        if (childMarkup) {
                            if (markup.children == null) {
                                markup.children = [];
                            }
                            markup.children.push(childMarkup);
                        }
                    }
                }
                return markup;
            }
        };
        const markup = nodes
            .map((node) => parse(node, node))
            .filter((mk) => mk != null);
        return {
            markup,
            attrs: attrMap,
        };
    }
    Markup.xml2json = xml2json;
})(Markup || (Markup = {}));
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
})(Markup || (Markup = {}));
// eslint-disable-next-line
(function (Markup) {
    function getEdgeMarkup() {
        return Markup.sanitize(`
    <path class="connection" stroke="black" d="M 0 0 0 0"/>
    <path class="source-marker" fill="black" stroke="black" d="M 0 0 0 0"/>
    <path class="target-marker" fill="black" stroke="black" d="M 0 0 0 0"/>
    <path class="connection-wrap" d="M 0 0 0 0"/>
    <g class="labels"/>
    <g class="vertices"/>
    <g class="arrowheads"/>
    <g class="tools"/>
  `);
    }
    Markup.getEdgeMarkup = getEdgeMarkup;
    function getEdgeToolMarkup() {
        return Markup.sanitize(`
    <g class="edge-tool">
      <g class="tool-remove" event="edge:remove">
        <circle r="11" />
        <path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />
        <title>Remove edge.</title>
      </g>
      <g class="tool-options" event="edge:options">
        <circle r="11" transform="translate(25)"/>
        <path fill="white" transform="scale(.55) translate(29, -16)" d="M31.229,17.736c0.064-0.571,0.104-1.148,0.104-1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,18.689,18.689,20.871,16,20.871z"/>
        <title>Edge options.</title>
      </g>
    </g>
  `);
    }
    Markup.getEdgeToolMarkup = getEdgeToolMarkup;
    function getEdgeVertexMarkup() {
        return Markup.sanitize(`
    <g class="vertex-group" transform="translate(<%= x %>, <%= y %>)">
      <circle class="vertex" data-index="<%= index %>" r="10" />
      <path class="vertex-remove-area" data-index="<%= index %>" d="M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z" transform="translate(5, -33)"/>
      <path class="vertex-remove" data-index="<%= index %>" transform="scale(.8) translate(9.5, -37)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z">
      <title>Remove vertex.</title>
      </path>
    </g>
  `);
    }
    Markup.getEdgeVertexMarkup = getEdgeVertexMarkup;
    function getEdgeArrowheadMarkup() {
        return Markup.sanitize(`
    <g class="arrowhead-group arrowhead-group-<%= end %>">
      <path class="arrowhead" data-terminal="<%= end %>" d="M 26 0 L 0 13 L 26 26 z" />
    </g>
  `);
    }
    Markup.getEdgeArrowheadMarkup = getEdgeArrowheadMarkup;
})(Markup || (Markup = {}));
// eslint-disable-next-line
(function (Markup) {
    function getForeignObjectMarkup(bare = false) {
        return {
            tagName: 'foreignObject',
            selector: 'fo',
            children: [
                {
                    ns: Dom.ns.xhtml,
                    tagName: 'body',
                    selector: 'foBody',
                    attrs: {
                        xmlns: Dom.ns.xhtml,
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
})(Markup || (Markup = {}));
//# sourceMappingURL=markup.js.map