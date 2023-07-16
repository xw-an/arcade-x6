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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
var jquery_1 = __importDefault(require("jquery"));
var util_1 = require("../util");
var common_1 = require("../common");
var global_1 = require("../global");
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View() {
        var _this = _super.call(this) || this;
        _this.cid = Private.uniqueId();
        View.views[_this.cid] = _this;
        return _this;
    }
    Object.defineProperty(View.prototype, "priority", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    View.prototype.confirmUpdate = function (flag, options) {
        return 0;
    };
    View.prototype.$ = function (elem) {
        return View.$(elem);
    };
    View.prototype.empty = function (elem) {
        if (elem === void 0) { elem = this.container; }
        this.$(elem).empty();
        return this;
    };
    View.prototype.unmount = function (elem) {
        if (elem === void 0) { elem = this.container; }
        this.$(elem).remove();
        return this;
    };
    View.prototype.remove = function (elem) {
        if (elem === void 0) { elem = this.container; }
        if (elem === this.container) {
            this.removeEventListeners(document);
            this.onRemove();
            delete View.views[this.cid];
        }
        this.unmount(elem);
        return this;
    };
    View.prototype.onRemove = function () { };
    View.prototype.setClass = function (className, elem) {
        if (elem === void 0) { elem = this.container; }
        elem.classList.value = Array.isArray(className)
            ? className.join(' ')
            : className;
    };
    View.prototype.addClass = function (className, elem) {
        if (elem === void 0) { elem = this.container; }
        this.$(elem).addClass(Array.isArray(className) ? className.join(' ') : className);
        return this;
    };
    View.prototype.removeClass = function (className, elem) {
        if (elem === void 0) { elem = this.container; }
        this.$(elem).removeClass(Array.isArray(className) ? className.join(' ') : className);
        return this;
    };
    View.prototype.setStyle = function (style, elem) {
        if (elem === void 0) { elem = this.container; }
        this.$(elem).css(style);
        return this;
    };
    View.prototype.setAttrs = function (attrs, elem) {
        if (elem === void 0) { elem = this.container; }
        if (attrs != null && elem != null) {
            if (elem instanceof SVGElement) {
                util_1.Dom.attr(elem, attrs);
            }
            else {
                this.$(elem).attr(attrs);
            }
        }
        return this;
    };
    /**
     * Returns the value of the specified attribute of `node`.
     *
     * If the node does not set a value for attribute, start recursing up
     * the DOM tree from node to lookup for attribute at the ancestors of
     * node. If the recursion reaches CellView's root node and attribute
     * is not found even there, return `null`.
     */
    View.prototype.findAttr = function (attrName, elem) {
        if (elem === void 0) { elem = this.container; }
        var current = elem;
        while (current && current.nodeType === 1) {
            var value = current.getAttribute(attrName);
            if (value != null) {
                return value;
            }
            if (current === this.container) {
                return null;
            }
            current = current.parentNode;
        }
        return null;
    };
    View.prototype.find = function (selector, rootElem, selectors) {
        if (rootElem === void 0) { rootElem = this.container; }
        if (selectors === void 0) { selectors = this.selectors; }
        return View.find(selector, rootElem, selectors).elems;
    };
    View.prototype.findOne = function (selector, rootElem, selectors) {
        if (rootElem === void 0) { rootElem = this.container; }
        if (selectors === void 0) { selectors = this.selectors; }
        var nodes = this.find(selector, rootElem, selectors);
        return nodes.length > 0 ? nodes[0] : null;
    };
    View.prototype.findByAttr = function (attrName, elem) {
        if (elem === void 0) { elem = this.container; }
        var node = elem;
        while (node && node.getAttribute) {
            var val = node.getAttribute(attrName);
            if ((val != null || node === this.container) && val !== 'false') {
                return node;
            }
            node = node.parentNode;
        }
        // If the overall cell has set `magnet === false`, then returns
        // `null` to announce there is no magnet found for this cell.
        // This is especially useful to set on cells that have 'ports'.
        // In this case, only the ports have set `magnet === true` and the
        // overall element has `magnet === false`.
        return null;
    };
    View.prototype.getSelector = function (elem, prevSelector) {
        var selector;
        if (elem === this.container) {
            if (typeof prevSelector === 'string') {
                selector = "> " + prevSelector;
            }
            return selector;
        }
        if (elem) {
            var nth = util_1.Dom.index(elem) + 1;
            selector = elem.tagName.toLowerCase() + ":nth-child(" + nth + ")";
            if (prevSelector) {
                selector += " > " + prevSelector;
            }
            selector = this.getSelector(elem.parentNode, selector);
        }
        return selector;
    };
    View.prototype.prefixClassName = function (className) {
        return global_1.Util.prefix(className);
    };
    View.prototype.delegateEvents = function (events, append) {
        var _this = this;
        if (events == null) {
            return this;
        }
        if (!append) {
            this.undelegateEvents();
        }
        var splitter = /^(\S+)\s*(.*)$/;
        Object.keys(events).forEach(function (key) {
            var match = key.match(splitter);
            if (match == null) {
                return;
            }
            var method = _this.getEventHandler(events[key]);
            if (typeof method === 'function') {
                _this.delegateEvent(match[1], match[2], method);
            }
        });
        return this;
    };
    View.prototype.undelegateEvents = function () {
        this.$(this.container).off(this.getEventNamespace());
        return this;
    };
    View.prototype.delegateDocumentEvents = function (events, data) {
        this.addEventListeners(document, events, data);
        return this;
    };
    View.prototype.undelegateDocumentEvents = function () {
        this.removeEventListeners(document);
        return this;
    };
    View.prototype.delegateEvent = function (eventName, selector, listener) {
        this.$(this.container).on(eventName + this.getEventNamespace(), selector, listener);
        return this;
    };
    View.prototype.undelegateEvent = function (eventName, selector, listener) {
        var name = eventName + this.getEventNamespace();
        if (selector == null) {
            this.$(this.container).off(name);
        }
        else if (typeof selector === 'string') {
            this.$(this.container).off(name, selector, listener);
        }
        else {
            this.$(this.container).off(name, selector);
        }
        return this;
    };
    View.prototype.addEventListeners = function (elem, events, data) {
        var _this = this;
        if (events == null) {
            return this;
        }
        var ns = this.getEventNamespace();
        var $elem = this.$(elem);
        Object.keys(events).forEach(function (eventName) {
            var method = _this.getEventHandler(events[eventName]);
            if (typeof method === 'function') {
                $elem.on(eventName + ns, data, method);
            }
        });
        return this;
    };
    View.prototype.removeEventListeners = function (elem) {
        if (elem != null) {
            this.$(elem).off(this.getEventNamespace());
        }
        return this;
    };
    View.prototype.getEventNamespace = function () {
        return "." + global_1.Config.prefixCls + "-event-" + this.cid;
    };
    // eslint-disable-next-line
    View.prototype.getEventHandler = function (handler) {
        var _this = this;
        // eslint-disable-next-line
        var method;
        if (typeof handler === 'string') {
            var fn_1 = this[handler];
            if (typeof fn_1 === 'function') {
                method = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return fn_1.call.apply(fn_1, __spreadArray([_this], args, false));
                };
            }
        }
        else {
            method = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return handler.call.apply(handler, __spreadArray([_this], args, false));
            };
        }
        return method;
    };
    View.prototype.getEventTarget = function (e, options) {
        if (options === void 0) { options = {}; }
        // Touchmove/Touchend event's target is not reflecting the element
        // under the coordinates as mousemove does.
        // It holds the element when a touchstart triggered.
        var target = e.target, type = e.type, _a = e.clientX, clientX = _a === void 0 ? 0 : _a, _b = e.clientY, clientY = _b === void 0 ? 0 : _b;
        if (options.fromPoint || type === 'touchmove' || type === 'touchend') {
            return document.elementFromPoint(clientX, clientY);
        }
        return target;
    };
    View.prototype.stopPropagation = function (e) {
        this.setEventData(e, { propagationStopped: true });
        return this;
    };
    View.prototype.isPropagationStopped = function (e) {
        return this.getEventData(e).propagationStopped === true;
    };
    View.prototype.getEventData = function (e) {
        return this.eventData(e);
    };
    View.prototype.setEventData = function (e, data) {
        return this.eventData(e, data);
    };
    View.prototype.eventData = function (e, data) {
        if (e == null) {
            throw new TypeError('Event object required');
        }
        var currentData = e.data;
        var key = "__" + this.cid + "__";
        // get
        if (data == null) {
            if (currentData == null) {
                return {};
            }
            return currentData[key] || {};
        }
        // set
        if (currentData == null) {
            currentData = e.data = {};
        }
        if (currentData[key] == null) {
            currentData[key] = __assign({}, data);
        }
        else {
            currentData[key] = __assign(__assign({}, currentData[key]), data);
        }
        return currentData[key];
    };
    View.prototype.normalizeEvent = function (evt) {
        return View.normalizeEvent(evt);
    };
    return View;
}(common_1.Basecoat));
exports.View = View;
(function (View) {
    function $(elem) {
        return (0, jquery_1.default)(elem);
    }
    View.$ = $;
    function createElement(tagName, isSvgElement) {
        return isSvgElement
            ? util_1.Dom.createSvgElement(tagName || 'g')
            : util_1.Dom.createElementNS(tagName || 'div');
    }
    View.createElement = createElement;
    function find(selector, rootElem, selectors) {
        if (!selector || selector === '.') {
            return { elems: [rootElem] };
        }
        if (selectors) {
            var nodes = selectors[selector];
            if (nodes) {
                return { elems: Array.isArray(nodes) ? nodes : [nodes] };
            }
        }
        if (global_1.Config.useCSSSelector) {
            return {
                isCSSSelector: true,
                // elems: Array.prototype.slice.call(rootElem.querySelectorAll(selector)),
                elems: $(rootElem).find(selector).toArray(),
            };
        }
        return { elems: [] };
    }
    View.find = find;
    function normalizeEvent(evt) {
        var normalizedEvent = evt;
        var originalEvent = evt.originalEvent;
        var touchEvt = originalEvent &&
            originalEvent.changedTouches &&
            originalEvent.changedTouches[0];
        if (touchEvt) {
            // eslint-disable-next-line no-restricted-syntax
            for (var key in evt) {
                // copy all the properties from the input event that are not
                // defined on the touch event (functions included).
                if (touchEvt[key] === undefined) {
                    touchEvt[key] = evt[key];
                }
            }
            normalizedEvent = touchEvt;
        }
        // IE: evt.target could be set to SVGElementInstance for SVGUseElement
        var target = normalizedEvent.target;
        if (target) {
            var useElement = target.correspondingUseElement;
            if (useElement) {
                normalizedEvent.target = useElement;
            }
        }
        return normalizedEvent;
    }
    View.normalizeEvent = normalizeEvent;
})(View = exports.View || (exports.View = {}));
exports.View = View;
(function (View) {
    View.views = {};
    function getView(cid) {
        return View.views[cid] || null;
    }
    View.getView = getView;
})(View = exports.View || (exports.View = {}));
exports.View = View;
var Private;
(function (Private) {
    var counter = 0;
    function uniqueId() {
        var id = "v" + counter;
        counter += 1;
        return id;
    }
    Private.uniqueId = uniqueId;
})(Private || (Private = {}));
//# sourceMappingURL=view.js.map