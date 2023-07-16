import { FunctionExt } from '../../util';
import { grid } from '../../layout/grid';
import { Node } from '../../model/node';
import { Model } from '../../model/model';
import { View } from '../../view/view';
import { Graph } from '../../graph/graph';
import { Dnd } from '../dnd';
export class Stencil extends View {
    constructor(options) {
        super();
        this.graphs = {};
        this.$groups = {};
        this.options = Object.assign(Object.assign({}, Stencil.defaultOptions), options);
        this.dnd = new Dnd(this.options);
        this.onSearch = FunctionExt.debounce(this.onSearch, 200);
        this.container = document.createElement('div');
        this.$container = this.$(this.container)
            .addClass(this.prefixClassName(ClassNames.base))
            .attr('data-not-found-text', this.options.notFoundText || 'No matches found');
        this.options.collapsable =
            options.collapsable &&
                options.groups &&
                options.groups.some((group) => group.collapsable !== false);
        if (this.options.collapsable) {
            this.$container.addClass('collapsable');
            const collapsed = options.groups &&
                options.groups.every((group) => group.collapsed || group.collapsable === false);
            if (collapsed) {
                this.$container.addClass('collapsed');
            }
        }
        this.$('<div/>')
            .addClass(this.prefixClassName(ClassNames.title))
            .html(this.options.title)
            .appendTo(this.$container);
        if (options.search) {
            this.$container.addClass('searchable').append(this.renderSearch());
        }
        this.$content = this.$('<div/>')
            .addClass(this.prefixClassName(ClassNames.content))
            .appendTo(this.$container);
        const globalGraphOptions = options.stencilGraphOptions || {};
        if (options.groups && options.groups.length) {
            options.groups.forEach((group) => {
                const $group = this.$('<div/>')
                    .addClass(this.prefixClassName(ClassNames.group))
                    .attr('data-name', group.name);
                if ((group.collapsable == null && options.collapsable) ||
                    group.collapsable !== false) {
                    $group.addClass('collapsable');
                }
                $group.toggleClass('collapsed', group.collapsed === true);
                const $title = this.$('<h3/>')
                    .addClass(this.prefixClassName(ClassNames.groupTitle))
                    .html(group.title || group.name);
                const $content = this.$('<div/>').addClass(this.prefixClassName(ClassNames.groupContent));
                const graphOptionsInGroup = group.graphOptions;
                const graph = new Graph(Object.assign(Object.assign(Object.assign({}, globalGraphOptions), graphOptionsInGroup), { container: document.createElement('div'), model: globalGraphOptions.model || new Model(), width: group.graphWidth || options.stencilGraphWidth, height: group.graphHeight || options.stencilGraphHeight, interacting: false, preventDefaultBlankAction: false }));
                $content.append(graph.container);
                $group.append($title, $content).appendTo(this.$content);
                this.$groups[group.name] = $group;
                this.graphs[group.name] = graph;
            });
        }
        else {
            const graph = new Graph(Object.assign(Object.assign({}, globalGraphOptions), { container: document.createElement('div'), model: globalGraphOptions.model || new Model(), width: options.stencilGraphWidth, height: options.stencilGraphHeight, interacting: false, preventDefaultBlankAction: false }));
            this.$content.append(graph.container);
            this.graphs[Private.defaultGroupName] = graph;
        }
        this.startListening();
        return this;
    }
    get targetScroller() {
        const target = this.options.target;
        return Graph.isGraph(target) ? target.scroller.widget : target;
    }
    get targetGraph() {
        const target = this.options.target;
        return Graph.isGraph(target) ? target : target.graph;
    }
    get targetModel() {
        return this.targetGraph.model;
    }
    renderSearch() {
        return this.$('<div/>')
            .addClass(this.prefixClassName(ClassNames.search))
            .append(this.$('<input/>')
            .attr({
            type: 'search',
            placeholder: this.options.placeholder || 'Search',
        })
            .addClass(this.prefixClassName(ClassNames.searchText)));
    }
    startListening() {
        const title = this.prefixClassName(ClassNames.title);
        const searchText = this.prefixClassName(ClassNames.searchText);
        const groupTitle = this.prefixClassName(ClassNames.groupTitle);
        this.delegateEvents({
            [`click .${title}`]: 'onTitleClick',
            [`touchstart .${title}`]: 'onTitleClick',
            [`click .${groupTitle}`]: 'onGroupTitleClick',
            [`touchstart .${groupTitle}`]: 'onGroupTitleClick',
            [`input .${searchText}`]: 'onSearch',
            [`focusin .${searchText}`]: 'onSearchFocusIn',
            [`focusout .${searchText}`]: 'onSearchFocusOut',
        });
        Object.keys(this.graphs).forEach((groupName) => {
            const graph = this.graphs[groupName];
            graph.on('cell:mousedown', this.onDragStart, this);
        });
    }
    stopListening() {
        this.undelegateEvents();
        Object.keys(this.graphs).forEach((groupName) => {
            const graph = this.graphs[groupName];
            graph.off('cell:mousedown', this.onDragStart, this);
        });
    }
    load(data, groupName) {
        if (Array.isArray(data)) {
            this.loadGroup(data, groupName);
        }
        else if (this.options.groups) {
            Object.keys(this.options.groups).forEach((groupName) => {
                if (data[groupName]) {
                    this.loadGroup(data[groupName], groupName);
                }
            });
        }
        return this;
    }
    loadGroup(cells, groupName) {
        const model = this.getModel(groupName);
        if (model) {
            const nodes = cells.map((cell) => Node.isNode(cell) ? cell : Node.create(cell));
            model.resetCells(nodes);
        }
        const group = this.getGroup(groupName);
        let height = this.options.stencilGraphHeight;
        if (group && group.graphHeight != null) {
            height = group.graphHeight;
        }
        const layout = (group && group.layout) || this.options.layout;
        if (layout && model) {
            FunctionExt.call(layout, this, model, group);
        }
        if (!height) {
            const graph = this.getGraph(groupName);
            graph.fitToContent({
                minWidth: graph.options.width,
                gridHeight: 1,
                padding: (group && group.graphPadding) ||
                    this.options.stencilGraphPadding ||
                    10,
            });
        }
        return this;
    }
    onDragStart(args) {
        const { e, node } = args;
        this.dnd.start(node, e);
    }
    filter(keyword, filter) {
        const found = Object.keys(this.graphs).reduce((memo, groupName) => {
            const graph = this.graphs[groupName];
            const name = groupName === Private.defaultGroupName ? null : groupName;
            const items = graph.model.getNodes().filter((cell) => {
                let matched = false;
                if (typeof filter === 'function') {
                    matched = FunctionExt.call(filter, this, cell, keyword, name, this);
                }
                else if (typeof filter === 'boolean') {
                    matched = filter;
                }
                else {
                    matched = this.isCellMatched(cell, keyword, filter, keyword.toLowerCase() !== keyword);
                }
                const view = graph.renderer.findViewByCell(cell);
                if (view) {
                    view.$(view.container).toggleClass('unmatched', !matched);
                }
                return matched;
            });
            const found = items.length > 0;
            const options = this.options;
            const model = new Model();
            model.resetCells(items);
            if (options.layout) {
                FunctionExt.call(options.layout, this, model, this.getGroup(groupName));
            }
            if (this.$groups[groupName]) {
                this.$groups[groupName].toggleClass('unmatched', !found);
            }
            graph.fitToContent({
                gridWidth: 1,
                gridHeight: 1,
                padding: options.stencilGraphPadding || 10,
            });
            return memo || found;
        }, false);
        this.$container.toggleClass('not-found', !found);
    }
    isCellMatched(cell, keyword, filters, ignoreCase) {
        if (keyword && filters) {
            return Object.keys(filters).some((shape) => {
                if (shape === '*' || cell.shape === shape) {
                    const filter = filters[shape];
                    if (typeof filter === 'boolean') {
                        return filter;
                    }
                    const paths = Array.isArray(filter) ? filter : [filter];
                    return paths.some((path) => {
                        let val = cell.getPropByPath(path);
                        if (val != null) {
                            val = `${val}`;
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
    }
    onSearch(evt) {
        this.filter(evt.target.value, this.options.search);
    }
    onSearchFocusIn() {
        this.$container.addClass('is-focused');
    }
    onSearchFocusOut() {
        this.$container.removeClass('is-focused');
    }
    onTitleClick() {
        if (this.options.collapsable) {
            this.$container.toggleClass('collapsed');
            if (this.$container.hasClass('collapsed')) {
                this.collapseGroups();
            }
            else {
                this.expandGroups();
            }
        }
    }
    onGroupTitleClick(evt) {
        const $group = this.$(evt.target).closest(`.${this.prefixClassName(ClassNames.group)}`);
        this.toggleGroup($group.attr('data-name') || '');
        const allCollapsed = Object.keys(this.$groups).every((name) => {
            const group = this.getGroup(name);
            const $group = this.$groups[name];
            return ((group && group.collapsable === false) || $group.hasClass('collapsed'));
        });
        this.$container.toggleClass('collapsed', allCollapsed);
    }
    getModel(groupName) {
        const graph = this.getGraph(groupName);
        return graph ? graph.model : null;
    }
    getGraph(groupName) {
        return this.graphs[groupName || Private.defaultGroupName];
    }
    getGroup(groupName) {
        const groups = this.options.groups;
        if (groupName != null && groups && groups.length) {
            return groups.find((group) => group.name === groupName);
        }
        return null;
    }
    toggleGroup(groupName) {
        if (this.isGroupCollapsed(groupName)) {
            this.expandGroup(groupName);
        }
        else {
            this.collapseGroup(groupName);
        }
        return this;
    }
    collapseGroup(groupName) {
        if (this.isGroupCollapsable(groupName)) {
            const $group = this.$groups[groupName];
            if ($group && !this.isGroupCollapsed(groupName)) {
                this.trigger('group:collapse', { name: groupName });
                $group.addClass('collapsed');
            }
        }
        return this;
    }
    expandGroup(groupName) {
        if (this.isGroupCollapsable(groupName)) {
            const $group = this.$groups[groupName];
            if ($group && this.isGroupCollapsed(groupName)) {
                this.trigger('group:expand', { name: groupName });
                $group.removeClass('collapsed');
            }
        }
        return this;
    }
    isGroupCollapsable(groupName) {
        const $group = this.$groups[groupName];
        return $group.hasClass('collapsable');
    }
    isGroupCollapsed(groupName) {
        const $group = this.$groups[groupName];
        return $group && $group.hasClass('collapsed');
    }
    collapseGroups() {
        Object.keys(this.$groups).forEach((groupName) => this.collapseGroup(groupName));
        return this;
    }
    expandGroups() {
        Object.keys(this.$groups).forEach((groupName) => this.expandGroup(groupName));
        return this;
    }
    resizeGroup(groupName, size) {
        const graph = this.graphs[groupName];
        if (graph) {
            graph.resize(size.width, size.height);
        }
        return this;
    }
    onRemove() {
        Object.keys(this.graphs).forEach((groupName) => {
            const graph = this.graphs[groupName];
            graph.view.remove();
            delete this.graphs[groupName];
        });
        this.dnd.remove();
        this.stopListening();
        this.undelegateDocumentEvents();
    }
}
(function (Stencil) {
    Stencil.defaultOptions = Object.assign({ stencilGraphWidth: 200, stencilGraphHeight: 800, title: 'Stencil', collapsable: false, placeholder: 'Search', notFoundText: 'No matches found', layout(model, group) {
            const options = {
                columnWidth: this.options.stencilGraphWidth / 2 - 10,
                columns: 2,
                rowHeight: 80,
                resizeToFit: false,
                dx: 10,
                dy: 10,
            };
            grid(model, Object.assign(Object.assign(Object.assign({}, options), this.options.layoutOptions), (group ? group.layoutOptions : {})));
        } }, Dnd.defaults);
})(Stencil || (Stencil = {}));
var ClassNames;
(function (ClassNames) {
    ClassNames.base = 'widget-stencil';
    ClassNames.title = `${ClassNames.base}-title`;
    ClassNames.search = `${ClassNames.base}-search`;
    ClassNames.searchText = `${ClassNames.search}-text`;
    ClassNames.content = `${ClassNames.base}-content`;
    ClassNames.group = `${ClassNames.base}-group`;
    ClassNames.groupTitle = `${ClassNames.group}-title`;
    ClassNames.groupContent = `${ClassNames.group}-content`;
})(ClassNames || (ClassNames = {}));
var Private;
(function (Private) {
    Private.defaultGroupName = '__default__';
})(Private || (Private = {}));
//# sourceMappingURL=index.js.map