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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.GridManager = void 0;
var Registry = __importStar(require("../registry"));
var util_1 = require("../util");
var base_1 = require("./base");
var GridManager = /** @class */ (function (_super) {
    __extends(GridManager, _super);
    function GridManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(GridManager.prototype, "elem", {
        get: function () {
            return this.view.grid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridManager.prototype, "grid", {
        get: function () {
            return this.options.grid;
        },
        enumerable: false,
        configurable: true
    });
    GridManager.prototype.init = function () {
        this.startListening();
        this.draw(this.grid);
    };
    GridManager.prototype.startListening = function () {
        this.graph.on('scale', this.update, this);
        this.graph.on('translate', this.update, this);
    };
    GridManager.prototype.stopListening = function () {
        this.graph.off('scale', this.update, this);
        this.graph.off('translate', this.update, this);
    };
    GridManager.prototype.setVisible = function (visible) {
        if (this.grid.visible !== visible) {
            this.grid.visible = visible;
            this.update();
        }
    };
    GridManager.prototype.getGridSize = function () {
        return this.grid.size;
    };
    GridManager.prototype.setGridSize = function (size) {
        this.grid.size = Math.max(size, 1);
        this.update();
    };
    GridManager.prototype.show = function () {
        this.setVisible(true);
        this.update();
    };
    GridManager.prototype.hide = function () {
        this.setVisible(false);
        this.update();
    };
    GridManager.prototype.clear = function () {
        this.elem.style.backgroundImage = '';
    };
    GridManager.prototype.draw = function (options) {
        this.clear();
        this.instance = null;
        Object.assign(this.grid, options);
        this.patterns = this.resolveGrid(options);
        this.update();
    };
    GridManager.prototype.update = function (options) {
        if (options === void 0) { options = {}; }
        var gridSize = this.grid.size;
        if (gridSize <= 1 || !this.grid.visible) {
            return this.clear();
        }
        var ctm = this.graph.matrix();
        var grid = this.getInstance();
        var items = Array.isArray(options) ? options : [options];
        this.patterns.forEach(function (settings, index) {
            var id = "pattern_" + index;
            var sx = ctm.a || 1;
            var sy = ctm.d || 1;
            var update = settings.update, markup = settings.markup, others = __rest(settings, ["update", "markup"]);
            var options = __assign(__assign(__assign({}, others), items[index]), { sx: sx, sy: sy, ox: ctm.e || 0, oy: ctm.f || 0, width: gridSize * sx, height: gridSize * sy });
            if (!grid.has(id)) {
                grid.add(id, util_1.Vector.create('pattern', { id: id, patternUnits: 'userSpaceOnUse' }, util_1.Vector.createVectors(markup)).node);
            }
            var patternElem = grid.get(id);
            if (typeof update === 'function') {
                update(patternElem.childNodes[0], options);
            }
            var x = options.ox % options.width;
            if (x < 0) {
                x += options.width;
            }
            var y = options.oy % options.height;
            if (y < 0) {
                y += options.height;
            }
            util_1.Dom.attr(patternElem, {
                x: x,
                y: y,
                width: options.width,
                height: options.height,
            });
        });
        var base64 = new XMLSerializer().serializeToString(grid.root);
        var url = "url(data:image/svg+xml;base64," + btoa(base64) + ")";
        this.elem.style.backgroundImage = url;
    };
    GridManager.prototype.getInstance = function () {
        if (!this.instance) {
            this.instance = new Registry.Grid();
        }
        return this.instance;
    };
    GridManager.prototype.resolveGrid = function (options) {
        if (!options) {
            return [];
        }
        var type = options.type;
        if (type == null) {
            return [
                __assign(__assign({}, Registry.Grid.presets.dot), options.args),
            ];
        }
        var items = Registry.Grid.registry.get(type);
        if (items) {
            var args_1 = options.args || [];
            if (!Array.isArray(args_1)) {
                args_1 = [args_1];
            }
            return Array.isArray(items)
                ? items.map(function (item, index) { return (__assign(__assign({}, item), args_1[index])); })
                : [__assign(__assign({}, items), args_1[0])];
        }
        return Registry.Grid.registry.onNotFound(type);
    };
    GridManager.prototype.dispose = function () {
        this.stopListening();
        this.clear();
    };
    __decorate([
        base_1.Base.dispose()
    ], GridManager.prototype, "dispose", null);
    return GridManager;
}(base_1.Base));
exports.GridManager = GridManager;
//# sourceMappingURL=grid.js.map