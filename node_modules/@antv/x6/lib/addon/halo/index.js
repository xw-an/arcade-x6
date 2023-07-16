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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Halo = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var common_1 = require("../common");
var node_preset_1 = require("./node-preset");
var edge_preset_1 = require("./edge-preset");
var Halo = /** @class */ (function (_super) {
    __extends(Halo, _super);
    function Halo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Halo.prototype, "type", {
        get: function () {
            return this.options.type || 'surround';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Halo.prototype, "handleOptions", {
        get: function () {
            return this.options;
        },
        enumerable: false,
        configurable: true
    });
    Halo.prototype.init = function (options) {
        this.options = util_1.ObjectExt.merge(Halo.defaultOptions, this.cell.isNode()
            ? new node_preset_1.NodePreset(this).getPresets()
            : this.cell.isEdge()
                ? new edge_preset_1.EdgePreset(this).getPresets()
                : null, options);
        this.render();
        this.initHandles();
        this.update();
        this.startListening();
    };
    Halo.prototype.startListening = function () {
        var model = this.model;
        var graph = this.graph;
        var cell = this.view.cell;
        cell.on('removed', this.remove, this);
        model.on('reseted', this.remove, this);
        graph.on('halo:destroy', this.remove, this);
        model.on('*', this.update, this);
        graph.on('scale', this.update, this);
        graph.on('translate', this.update, this);
        _super.prototype.startListening.call(this);
    };
    Halo.prototype.stopListening = function () {
        var model = this.model;
        var graph = this.graph;
        var cell = this.view.cell;
        this.undelegateEvents();
        cell.off('removed', this.remove, this);
        model.off('reseted', this.remove, this);
        graph.off('halo:destroy', this.remove, this);
        model.off('*', this.update, this);
        graph.off('scale', this.update, this);
        graph.off('translate', this.update, this);
        _super.prototype.stopListening.call(this);
    };
    Halo.prototype.render = function () {
        var options = this.options;
        var cls = this.prefixClassName('widget-halo');
        this.view.addClass(Private.NODE_CLS);
        this.container = document.createElement('div');
        this.$container = this.$(this.container)
            .addClass(cls)
            .attr('data-shape', this.view.cell.shape);
        if (options.className) {
            this.$container.addClass(options.className);
        }
        this.$handleContainer = this.$('<div/>')
            .addClass(cls + "-handles")
            .appendTo(this.container);
        this.$content = this.$('<div/>')
            .addClass(cls + "-content")
            .appendTo(this.container);
        this.$container.appendTo(this.graph.container);
        return this;
    };
    Halo.prototype.remove = function () {
        this.stopBatch();
        this.view.removeClass(Private.NODE_CLS);
        return _super.prototype.remove.call(this);
    };
    Halo.prototype.update = function () {
        if (this.isRendered()) {
            this.updateContent();
            var bbox = this.getBBox();
            var tinyThreshold = this.options.tinyThreshold || 0;
            var smallThreshold = this.options.smallThreshold || 0;
            this.$handleContainer.toggleClass(this.handleClassName + "-tiny", bbox.width < tinyThreshold && bbox.height < tinyThreshold);
            var className = this.handleClassName + "-small";
            this.$handleContainer.toggleClass(className, !this.$handleContainer.hasClass(className) &&
                bbox.width < smallThreshold &&
                bbox.height < smallThreshold);
            this.$container.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x,
                top: bbox.y,
            });
            if (this.hasHandle('unlink')) {
                this.toggleUnlink();
            }
            if (this.type === 'surround' || this.type === 'toolbar') {
                if (this.hasHandle('fork')) {
                    this.toggleFork();
                }
            }
        }
    };
    Halo.prototype.updateContent = function () {
        var content = this.options.content;
        if (typeof content === 'function') {
            var ret = util_1.FunctionExt.call(content, this, this.view, this.$content[0]);
            if (ret) {
                this.$content.html(ret);
            }
        }
        else if (content) {
            this.$content.html(content);
        }
        else {
            this.$content.remove();
        }
    };
    Halo.prototype.getBBox = function () {
        var view = this.view;
        var bbox = this.options.bbox;
        var rect = typeof bbox === 'function' ? util_1.FunctionExt.call(bbox, this, view) : bbox;
        return geometry_1.Rectangle.create(__assign({ x: 0, y: 0, width: 1, height: 1 }, rect));
    };
    Halo.prototype.removeCell = function () {
        this.cell.remove();
    };
    Halo.prototype.toggleFork = function () {
        var cell = this.view.cell.clone();
        var view = this.graph.hook.createCellView(cell);
        var valid = this.graph.hook.validateConnection(this.view, null, view, null, 'target');
        this.$handleContainer.children('.fork').toggleClass('hidden', !valid);
        view.remove();
    };
    Halo.prototype.toggleUnlink = function () {
        var hasEdges = this.model.getConnectedEdges(this.view.cell).length > 0;
        this.$handleContainer.children('.unlink').toggleClass('hidden', !hasEdges);
    };
    // #region batch
    Halo.prototype.startBatch = function () {
        this.model.startBatch('halo', {
            halo: this.cid,
        });
    };
    Halo.prototype.stopBatch = function () {
        if (this.model.hasActiveBatch('halo')) {
            this.model.stopBatch('halo', {
                halo: this.cid,
            });
        }
    };
    return Halo;
}(common_1.Widget));
exports.Halo = Halo;
(function (Halo) {
    Halo.defaultOptions = {
        type: 'surround',
        clearAll: true,
        clearOnBlankMouseDown: true,
        useCellGeometry: false,
        clone: function (cell) { return cell.clone().removeZIndex(); },
    };
})(Halo = exports.Halo || (exports.Halo = {}));
exports.Halo = Halo;
Object.getOwnPropertyNames(common_1.Handle.prototype).forEach(function (name) {
    if (name !== 'constructor') {
        Object.defineProperty(Halo.prototype, name, Object.getOwnPropertyDescriptor(common_1.Handle.prototype, name));
    }
});
var Private;
(function (Private) {
    Private.NODE_CLS = 'has-widget-halo';
})(Private || (Private = {}));
//# sourceMappingURL=index.js.map