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
exports.Stencil = void 0;
var util_1 = require("../../util");
var grid_1 = require("../../layout/grid");
var node_1 = require("../../model/node");
var model_1 = require("../../model/model");
var view_1 = require("../../view/view");
var graph_1 = require("../../graph/graph");
var dnd_1 = require("../dnd");
var Stencil = /** @class */ (function (_super) {
    __extends(Stencil, _super);
    function Stencil(options) {
        var _this = _super.call(this) || this;
        _this.graphs = {};
        _this.$groups = {};
        _this.options = __assign(__assign({}, Stencil.defaultOptions), options);
        _this.dnd = new dnd_1.Dnd(_this.options);
        _this.onSearch = util_1.FunctionExt.debounce(_this.onSearch, 200);
        _this.container = document.createElement('div');
        _this.$container = _this.$(_this.container)
            .addClass(_this.prefixClassName(ClassNames.base))
            .attr('data-not-found-text', _this.options.notFoundText || 'No matches found');
        _this.options.collapsable =
            options.collapsable &&
                options.groups &&
                options.groups.some(function (group) { return group.collapsable !== false; });
        if (_this.options.collapsable) {
            _this.$container.addClass('collapsable');
            var collapsed = options.groups &&
                options.groups.every(function (group) { return group.collapsed || group.collapsable === false; });
            if (collapsed) {
                _this.$container.addClass('collapsed');
            }
        }
        _this.$('<div/>')
            .addClass(_this.prefixClassName(ClassNames.title))
            .html(_this.options.title)
            .appendTo(_this.$container);
        if (options.search) {
            _this.$container.addClass('searchable').append(_this.renderSearch());
        }
        _this.$content = _this.$('<div/>')
            .addClass(_this.prefixClassName(ClassNames.content))
            .appendTo(_this.$container);
        var globalGraphOptions = options.stencilGraphOptions || {};
        if (options.groups && options.groups.length) {
            options.groups.forEach(function (group) {
                var $group = _this.$('<div/>')
                    .addClass(_this.prefixClassName(ClassNames.group))
                    .attr('data-name', group.name);
                if ((group.collapsable == null && options.collapsable) ||
                    group.collapsable !== false) {
                    $group.addClass('collapsable');
                }
                $group.toggleClass('collapsed', group.collapsed === true);
                var $title = _this.$('<h3/>')
                    .addClass(_this.prefixClassName(ClassNames.groupTitle))
                    .html(group.title || group.name);
                var $content = _this.$('<div/>').addClass(_this.prefixClassName(ClassNames.groupContent));
                var graphOptionsInGroup = group.graphOptions;
                var graph = new graph_1.Graph(__assign(__assign(__assign({}, globalGraphOptions), graphOptionsInGroup), { container: document.createElement('div'), model: globalGraphOptions.model || new model_1.Model(), width: group.graphWidth || options.stencilGraphWidth, height: group.graphHeight || options.stencilGraphHeight, interacting: false, preventDefaultBlankAction: false }));
                $content.append(graph.container);
                $group.append($title, $content).appendTo(_this.$content);
                _this.$groups[group.name] = $group;
                _this.graphs[group.name] = graph;
            });
        }
        else {
            var graph = new graph_1.Graph(__assign(__assign({}, globalGraphOptions), { container: document.createElement('div'), model: globalGraphOptions.model || new model_1.Model(), width: options.stencilGraphWidth, height: options.stencilGraphHeight, interacting: false, preventDefaultBlankAction: false }));
            _this.$content.append(graph.container);
            _this.graphs[Private.defaultGroupName] = graph;
        }
        _this.startListening();
        return _this;
    }
    Object.defineProperty(Stencil.prototype, "targetScroller", {
        get: function () {
            var target = this.options.target;
            return graph_1.Graph.isGraph(target) ? target.scroller.widget : target;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stencil.prototype, "targetGraph", {
        get: function () {
            var target = this.options.target;
            return graph_1.Graph.isGraph(target) ? target : target.graph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stencil.prototype, "targetModel", {
        get: function () {
            return this.targetGraph.model;
        },
        enumerable: false,
        configurable: true
    });
    Stencil.prototype.renderSearch = function () {
        return this.$('<div/>')
            .addClass(this.prefixClassName(ClassNames.search))
            .append(this.$('<input/>')
            .attr({
            type: 'search',
            placeholder: this.options.placeholder || 'Search',
        })
            .addClass(this.prefixClassName(ClassNames.searchText)));
    };
    Stencil.prototype.startListening = function () {
        var _a;
        var _this = this;
        var title = this.prefixClassName(ClassNames.title);
        var searchText = this.prefixClassName(ClassNames.searchText);
        var groupTitle = this.prefixClassName(ClassNames.groupTitle);
        this.delegateEvents((_a = {},
            _a["click ." + title] = 'onTitleClick',
            _a["touchstart ." + title] = 'onTitleClick',
            _a["click ." + groupTitle] = 'onGroupTitleClick',
            _a["touchstart ." + groupTitle] = 'onGroupTitleClick',
            _a["input ." + searchText] = 'onSearch',
            _a["focusin ." + searchText] = 'onSearchFocusIn',
            _a["focusout ." + searchText] = 'onSearchFocusOut',
            _a));
        Object.keys(this.graphs).forEach(function (groupName) {
            var graph = _this.graphs[groupName];
            graph.on('cell:mousedown', _this.onDragStart, _this);
        });
    };
    Stencil.prototype.stopListening = function () {
        var _this = this;
        this.undelegateEvents();
        Object.keys(this.graphs).forEach(function (groupName) {
            var graph = _this.graphs[groupName];
            graph.off('cell:mousedown', _this.onDragStart, _this);
        });
    };
    Stencil.prototype.load = function (data, groupName) {
        var _this = this;
        if (Array.isArray(data)) {
            this.loadGroup(data, groupName);
        }
        else if (this.options.groups) {
            Object.keys(this.options.groups).forEach(function (groupName) {
                if (data[groupName]) {
                    _this.loadGroup(data[groupName], groupName);
                }
            });
        }
        return this;
    };
    Stencil.prototype.loadGroup = function (cells, groupName) {
        var model = this.getModel(groupName);
        if (model) {
            var nodes = cells.map(function (cell) {
                return node_1.Node.isNode(cell) ? cell : node_1.Node.create(cell);
            });
            model.resetCells(nodes);
        }
        var group = this.getGroup(groupName);
        var height = this.options.stencilGraphHeight;
        if (group && group.graphHeight != null) {
            height = group.graphHeight;
        }
        var layout = (group && group.layout) || this.options.layout;
        if (layout && model) {
            util_1.FunctionExt.call(layout, this, model, group);
        }
        if (!height) {
            var graph = this.getGraph(groupName);
            graph.fitToContent({
                minWidth: graph.options.width,
                gridHeight: 1,
                padding: (group && group.graphPadding) ||
                    this.options.stencilGraphPadding ||
                    10,
            });
        }
        return this;
    };
    Stencil.prototype.onDragStart = function (args) {
        var e = args.e, node = args.node;
        this.dnd.start(node, e);
    };
    Stencil.prototype.filter = function (keyword, filter) {
        var _this = this;
        var found = Object.keys(this.graphs).reduce(function (memo, groupName) {
            var graph = _this.graphs[groupName];
            var name = groupName === Private.defaultGroupName ? null : groupName;
            var items = graph.model.getNodes().filter(function (cell) {
                var matched = false;
                if (typeof filter === 'function') {
                    matched = util_1.FunctionExt.call(filter, _this, cell, keyword, name, _this);
                }
                else if (typeof filter === 'boolean') {
                    matched = filter;
                }
                else {
                    matched = _this.isCellMatched(cell, keyword, filter, keyword.toLowerCase() !== keyword);
                }
                var view = graph.renderer.findViewByCell(cell);
                if (view) {
                    view.$(view.container).toggleClass('unmatched', !matched);
                }
                return matched;
            });
            var found = items.length > 0;
            var options = _this.options;
            var model = new model_1.Model();
            model.resetCells(items);
            if (options.layout) {
                util_1.FunctionExt.call(options.layout, _this, model, _this.getGroup(groupName));
            }
            if (_this.$groups[groupName]) {
                _this.$groups[groupName].toggleClass('unmatched', !found);
            }
            graph.fitToContent({
                gridWidth: 1,
                gridHeight: 1,
                padding: options.stencilGraphPadding || 10,
            });
            return memo || found;
        }, false);
        this.$container.toggleClass('not-found', !found);
    };
    Stencil.prototype.isCellMatched = function (cell, keyword, filters, ignoreCase) {
        if (keyword && filters) {
            return Object.keys(filters).some(function (shape) {
                if (shape === '*' || cell.shape === shape) {
                    var filter = filters[shape];
                    if (typeof filter === 'boolean') {
                        return filter;
                    }
                    var paths = Array.isArray(filter) ? filter : [filter];
                    return paths.some(function (path) {
                        var val = cell.getPropByPath(path);
                        if (val != null) {
                            val = "" + val;
                            if (!ignoreCase) {
                                val = val.toLowerCase();
                            }
                            return val.indexOf(keyword) >= 0;
                        }
                        return false;
                    });
                }
                return false;
            });
        }
        return true;
    };
    Stencil.prototype.onSearch = function (evt) {
        this.filter(evt.target.value, this.options.search);
    };
    Stencil.prototype.onSearchFocusIn = function () {
        this.$container.addClass('is-focused');
    };
    Stencil.prototype.onSearchFocusOut = function () {
        this.$container.removeClass('is-focused');
    };
    Stencil.prototype.onTitleClick = function () {
        if (this.options.collapsable) {
            this.$container.toggleClass('collapsed');
            if (this.$container.hasClass('collapsed')) {
                this.collapseGroups();
            }
            else {
                this.expandGroups();
            }
        }
    };
    Stencil.prototype.onGroupTitleClick = function (evt) {
        var _this = this;
        var $group = this.$(evt.target).closest("." + this.prefixClassName(ClassNames.group));
        this.toggleGroup($group.attr('data-name') || '');
        var allCollapsed = Object.keys(this.$groups).every(function (name) {
            var group = _this.getGroup(name);
            var $group = _this.$groups[name];
            return ((group && group.collapsable === false) || $group.hasClass('collapsed'));
        });
        this.$container.toggleClass('collapsed', allCollapsed);
    };
    Stencil.prototype.getModel = function (groupName) {
        var graph = this.getGraph(groupName);
        return graph ? graph.model : null;
    };
    Stencil.prototype.getGraph = function (groupName) {
        return this.graphs[groupName || Private.defaultGroupName];
    };
    Stencil.prototype.getGroup = function (groupName) {
        var groups = this.options.groups;
        if (groupName != null && groups && groups.length) {
            return groups.find(function (group) { return group.name === groupName; });
        }
        return null;
    };
    Stencil.prototype.toggleGroup = function (groupName) {
        if (this.isGroupCollapsed(groupName)) {
            this.expandGroup(groupName);
        }
        else {
            this.collapseGroup(groupName);
        }
        return this;
    };
    Stencil.prototype.collapseGroup = function (groupName) {
        if (this.isGroupCollapsable(groupName)) {
            var $group = this.$groups[groupName];
            if ($group && !this.isGroupCollapsed(groupName)) {
                this.trigger('group:collapse', { name: groupName });
                $group.addClass('collapsed');
            }
        }
        return this;
    };
    Stencil.prototype.expandGroup = function (groupName) {
        if (this.isGroupCollapsable(groupName)) {
            var $group = this.$groups[groupName];
            if ($group && this.isGroupCollapsed(groupName)) {
                this.trigger('group:expand', { name: groupName });
                $group.removeClass('collapsed');
            }
        }
        return this;
    };
    Stencil.prototype.isGroupCollapsable = function (groupName) {
        var $group = this.$groups[groupName];
        return $group.hasClass('collapsable');
    };
    Stencil.prototype.isGroupCollapsed = function (groupName) {
        var $group = this.$groups[groupName];
        return $group && $group.hasClass('collapsed');
    };
    Stencil.prototype.collapseGroups = function () {
        var _this = this;
        Object.keys(this.$groups).forEach(function (groupName) {
            return _this.collapseGroup(groupName);
        });
        return this;
    };
    Stencil.prototype.expandGroups = function () {
        var _this = this;
        Object.keys(this.$groups).forEach(function (groupName) {
            return _this.expandGroup(groupName);
        });
        return this;
    };
    Stencil.prototype.resizeGroup = function (groupName, size) {
        var graph = this.graphs[groupName];
        if (graph) {
            graph.resize(size.width, size.height);
        }
        return this;
    };
    Stencil.prototype.onRemove = function () {
        var _this = this;
        Object.keys(this.graphs).forEach(function (groupName) {
            var graph = _this.graphs[groupName];
            graph.view.remove();
            delete _this.graphs[groupName];
        });
        this.dnd.remove();
        this.stopListening();
        this.undelegateDocumentEvents();
    };
    return Stencil;
}(view_1.View));
exports.Stencil = Stencil;
(function (Stencil) {
    Stencil.defaultOptions = __assign({ stencilGraphWidth: 200, stencilGraphHeight: 800, title: 'Stencil', collapsable: false, placeholder: 'Search', notFoundText: 'No matches found', layout: function (model, group) {
            var options = {
                columnWidth: this.options.stencilGraphWidth / 2 - 10,
                columns: 2,
                rowHeight: 80,
                resizeToFit: false,
                dx: 10,
                dy: 10,
            };
            (0, grid_1.grid)(model, __assign(__assign(__assign({}, options), this.options.layoutOptions), (group ? group.layoutOptions : {})));
        } }, dnd_1.Dnd.defaults);
})(Stencil = exports.Stencil || (exports.Stencil = {}));
exports.Stencil = Stencil;
var ClassNames;
(function (ClassNames) {
    ClassNames.base = 'widget-stencil';
    ClassNames.title = ClassNames.base + "-title";
    ClassNames.search = ClassNames.base + "-search";
    ClassNames.searchText = ClassNames.search + "-text";
    ClassNames.content = ClassNames.base + "-content";
    ClassNames.group = ClassNames.base + "-group";
    ClassNames.groupTitle = ClassNames.group + "-title";
    ClassNames.groupContent = ClassNames.group + "-content";
})(ClassNames || (ClassNames = {}));
var Private;
(function (Private) {
    Private.defaultGroupName = '__default__';
})(Private || (Private = {}));
//# sourceMappingURL=index.js.map