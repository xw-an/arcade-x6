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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefsManager = void 0;
var util_1 = require("../util");
var registry_1 = require("../registry");
var view_1 = require("../view");
var base_1 = require("./base");
var DefsManager = /** @class */ (function (_super) {
    __extends(DefsManager, _super);
    function DefsManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DefsManager.prototype, "cid", {
        get: function () {
            return this.graph.view.cid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefsManager.prototype, "svg", {
        get: function () {
            return this.view.svg;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefsManager.prototype, "defs", {
        get: function () {
            return this.view.defs;
        },
        enumerable: false,
        configurable: true
    });
    DefsManager.prototype.isDefined = function (id) {
        return this.svg.getElementById(id) != null;
    };
    DefsManager.prototype.filter = function (options) {
        var filterId = options.id;
        var name = options.name;
        if (!filterId) {
            filterId = "filter-" + name + "-" + this.cid + "-" + util_1.StringExt.hashcode(JSON.stringify(options));
        }
        if (!this.isDefined(filterId)) {
            var fn = registry_1.Filter.registry.get(name);
            if (fn == null) {
                return registry_1.Filter.registry.onNotFound(name);
            }
            var markup = fn(options.args || {});
            // Set the filter area to be 3x the bounding box of the cell
            // and center the filter around the cell.
            var attrs = __assign(__assign({ x: -1, y: -1, width: 3, height: 3, filterUnits: 'objectBoundingBox' }, options.attrs), { id: filterId });
            util_1.Vector.create(view_1.Markup.sanitize(markup), attrs).appendTo(this.defs);
        }
        return filterId;
    };
    DefsManager.prototype.gradient = function (options) {
        var id = options.id;
        var type = options.type;
        if (!id) {
            id = "gradient-" + type + "-" + this.cid + "-" + util_1.StringExt.hashcode(JSON.stringify(options));
        }
        if (!this.isDefined(id)) {
            var stops = options.stops;
            var arr = stops.map(function (stop) {
                var opacity = stop.opacity != null && Number.isFinite(stop.opacity)
                    ? stop.opacity
                    : 1;
                return "<stop offset=\"" + stop.offset + "\" stop-color=\"" + stop.color + "\" stop-opacity=\"" + opacity + "\"/>";
            });
            var markup = "<" + type + ">" + arr.join('') + "</" + type + ">";
            var attrs = __assign({ id: id }, options.attrs);
            util_1.Vector.create(markup, attrs).appendTo(this.defs);
        }
        return id;
    };
    DefsManager.prototype.marker = function (options) {
        var id = options.id, refX = options.refX, refY = options.refY, markerUnits = options.markerUnits, markerOrient = options.markerOrient, tagName = options.tagName, children = options.children, attrs = __rest(options, ["id", "refX", "refY", "markerUnits", "markerOrient", "tagName", "children"]);
        var markerId = id;
        if (!markerId) {
            markerId = "marker-" + this.cid + "-" + util_1.StringExt.hashcode(JSON.stringify(options));
        }
        if (!this.isDefined(markerId)) {
            if (tagName !== 'path') {
                // remove unnecessary d attribute inherit from standard edge.
                delete attrs.d;
            }
            var pathMarker = util_1.Vector.create('marker', {
                refX: refX,
                refY: refY,
                id: markerId,
                overflow: 'visible',
                orient: markerOrient != null ? markerOrient : 'auto',
                markerUnits: markerUnits || 'userSpaceOnUse',
            }, children
                ? children.map(function (_a) {
                    var tagName = _a.tagName, other = __rest(_a, ["tagName"]);
                    return util_1.Vector.create("" + tagName || 'path', util_1.Dom.kebablizeAttrs(__assign(__assign({}, attrs), other)));
                })
                : [util_1.Vector.create(tagName || 'path', util_1.Dom.kebablizeAttrs(attrs))]);
            this.defs.appendChild(pathMarker.node);
        }
        return markerId;
    };
    DefsManager.prototype.remove = function (id) {
        var elem = this.svg.getElementById(id);
        if (elem && elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }
    };
    return DefsManager;
}(base_1.Base));
exports.DefsManager = DefsManager;
//# sourceMappingURL=defs.js.map