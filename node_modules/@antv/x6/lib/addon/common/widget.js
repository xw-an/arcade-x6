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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Widget = void 0;
var view_1 = require("../../view");
var Widget = /** @class */ (function (_super) {
    __extends(Widget, _super);
    function Widget(options) {
        var _this = _super.call(this) || this;
        var _a = options, view = _a.view, cell = _a.cell, node = _a.node, edge = _a.edge, graph = _a.graph, localOptions = __rest(_a, ["view", "cell", "node", "edge", "graph"]);
        if (view) {
            _this.view = view;
            _this.cell = view.cell;
            _this.graph = view.graph;
            _this.model = _this.graph.model;
        }
        else if ((cell || edge || node) && graph) {
            _this.cell = node || edge || cell;
            _this.view = graph.renderer.findViewByCell(_this.cell);
            _this.graph = graph;
            _this.model = _this.graph.model;
        }
        var ctor = _this.constructor;
        if (options.clearAll !== false) {
            ctor.removeInstances(_this.graph);
        }
        ctor.register(_this);
        _this.init(localOptions);
        return _this;
    }
    Widget.ensureCache = function () {
        if (!this.instanceCache.has(this)) {
            this.instanceCache.set(this, {});
        }
        return this.instanceCache.get(this);
    };
    Widget.register = function (instance, graph) {
        if (graph == null) {
            // eslint-disable-next-line
            graph = instance.graph;
        }
        var dic = this.ensureCache();
        var cache = dic[graph.view.cid];
        if (cache == null) {
            cache = dic[graph.view.cid] = {};
        }
        cache[instance.cid] = instance;
    };
    Widget.unregister = function (instance, graph) {
        if (graph == null) {
            // eslint-disable-next-line
            graph = instance.graph;
        }
        var dic = this.ensureCache();
        if (dic[graph.view.cid]) {
            delete dic[graph.view.cid][instance.cid];
        }
    };
    Widget.removeInstances = function (graph) {
        var dic = this.ensureCache();
        var cache = dic[graph.view.cid];
        if (cache) {
            Object.keys(cache).forEach(function (cid) {
                var instance = cache[cid];
                if (instance) {
                    instance.remove();
                }
            });
        }
    };
    Widget.getInstances = function (graph) {
        var dic = this.ensureCache();
        return dic[graph.view.cid] || {};
    };
    Widget.prototype.init = function (options) { }; // eslint-disable-line
    Widget.prototype.render = function () {
        return this;
    };
    Widget.prototype.startListening = function () {
        if (this.options.clearOnBlankMouseDown !== false) {
            this.graph.on('blank:mousedown', this.remove, this);
        }
    };
    Widget.prototype.stopListening = function () {
        if (this.options.clearOnBlankMouseDown !== false) {
            this.graph.off('blank:mousedown', this.remove, this);
        }
    };
    Widget.prototype.remove = function () {
        this.stopListening();
        var ctor = this.constructor;
        ctor.unregister(this);
        return _super.prototype.remove.call(this);
    };
    Widget.prototype.dispose = function () {
        this.remove();
    };
    // #region static
    Widget.instanceCache = new WeakMap();
    __decorate([
        view_1.View.dispose()
    ], Widget.prototype, "dispose", null);
    return Widget;
}(view_1.View));
exports.Widget = Widget;
//# sourceMappingURL=widget.js.map