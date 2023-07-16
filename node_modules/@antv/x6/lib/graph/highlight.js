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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighlightManager = void 0;
var util_1 = require("../util");
var registry_1 = require("../registry");
var base_1 = require("./base");
var HighlightManager = /** @class */ (function (_super) {
    __extends(HighlightManager, _super);
    function HighlightManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.highlights = {};
        return _this;
    }
    HighlightManager.prototype.init = function () {
        this.startListening();
    };
    HighlightManager.prototype.startListening = function () {
        this.graph.on('cell:highlight', this.onCellHighlight, this);
        this.graph.on('cell:unhighlight', this.onCellUnhighlight, this);
    };
    HighlightManager.prototype.stopListening = function () {
        this.graph.off('cell:highlight', this.onCellHighlight, this);
        this.graph.off('cell:unhighlight', this.onCellUnhighlight, this);
    };
    HighlightManager.prototype.onCellHighlight = function (_a) {
        var cellView = _a.view, magnet = _a.magnet, _b = _a.options, options = _b === void 0 ? {} : _b;
        var resolved = this.resolveHighlighter(options);
        if (!resolved) {
            return;
        }
        var key = this.getHighlighterId(magnet, resolved);
        if (!this.highlights[key]) {
            var highlighter = resolved.highlighter;
            highlighter.highlight(cellView, magnet, __assign({}, resolved.args));
            this.highlights[key] = {
                cellView: cellView,
                magnet: magnet,
                highlighter: highlighter,
                args: resolved.args,
            };
        }
    };
    HighlightManager.prototype.onCellUnhighlight = function (_a) {
        var magnet = _a.magnet, _b = _a.options, options = _b === void 0 ? {} : _b;
        var resolved = this.resolveHighlighter(options);
        if (!resolved) {
            return;
        }
        var id = this.getHighlighterId(magnet, resolved);
        this.unhighlight(id);
    };
    HighlightManager.prototype.resolveHighlighter = function (options) {
        var graphOptions = this.options;
        var highlighterDef = options.highlighter;
        if (highlighterDef == null) {
            // check for built-in types
            var type = options.type;
            highlighterDef =
                (type && graphOptions.highlighting[type]) ||
                    graphOptions.highlighting.default;
        }
        if (highlighterDef == null) {
            return null;
        }
        var def = typeof highlighterDef === 'string'
            ? {
                name: highlighterDef,
            }
            : highlighterDef;
        var name = def.name;
        var highlighter = registry_1.Highlighter.registry.get(name);
        if (highlighter == null) {
            return registry_1.Highlighter.registry.onNotFound(name);
        }
        registry_1.Highlighter.check(name, highlighter);
        return {
            name: name,
            highlighter: highlighter,
            args: def.args || {},
        };
    };
    HighlightManager.prototype.getHighlighterId = function (magnet, options) {
        util_1.Dom.ensureId(magnet);
        return options.name + magnet.id + JSON.stringify(options.args);
    };
    HighlightManager.prototype.unhighlight = function (id) {
        var highlight = this.highlights[id];
        if (highlight) {
            highlight.highlighter.unhighlight(highlight.cellView, highlight.magnet, highlight.args);
            delete this.highlights[id];
        }
    };
    HighlightManager.prototype.dispose = function () {
        var _this = this;
        Object.keys(this.highlights).forEach(function (id) { return _this.unhighlight(id); });
        this.stopListening();
    };
    __decorate([
        HighlightManager.dispose()
    ], HighlightManager.prototype, "dispose", null);
    return HighlightManager;
}(base_1.Base));
exports.HighlightManager = HighlightManager;
//# sourceMappingURL=highlight.js.map