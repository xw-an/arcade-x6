import { Dom, ObjectExt, StringExt } from '../util';
import { NodeTool, EdgeTool } from '../registry/tool';
import { View } from './view';
import { CellView } from './cell';
import { Markup } from './markup';
export class ToolsView extends View {
    constructor(options = {}) {
        super();
        this.svgContainer = this.createContainer(true, options);
        this.htmlContainer = this.createContainer(false, options);
        this.config(options);
    }
    get name() {
        return this.options.name;
    }
    get graph() {
        return this.cellView.graph;
    }
    get cell() {
        return this.cellView.cell;
    }
    get [Symbol.toStringTag]() {
        return ToolsView.toStringTag;
    }
    createContainer(svg, options) {
        const container = svg
            ? View.createElement('g', true)
            : View.createElement('div', false);
        Dom.addClass(container, this.prefixClassName('cell-tools'));
        if (options.className) {
            Dom.addClass(container, options.className);
        }
        return container;
    }
    config(options) {
        this.options = Object.assign(Object.assign({}, this.options), options);
        if (!CellView.isCellView(options.view) || options.view === this.cellView) {
            return this;
        }
        this.cellView = options.view;
        if (this.cell.isEdge()) {
            Dom.addClass(this.svgContainer, this.prefixClassName('edge-tools'));
            Dom.addClass(this.htmlContainer, this.prefixClassName('edge-tools'));
        }
        else if (this.cell.isNode()) {
            Dom.addClass(this.svgContainer, this.prefixClassName('node-tools'));
            Dom.addClass(this.htmlContainer, this.prefixClassName('node-tools'));
        }
        this.svgContainer.setAttribute('data-cell-id', this.cell.id);
        this.htmlContainer.setAttribute('data-cell-id', this.cell.id);
        if (this.name) {
            this.svgContainer.setAttribute('data-tools-name', this.name);
            this.htmlContainer.setAttribute('data-tools-name', this.name);
        }
        const tools = this.options.items;
        if (!Array.isArray(tools)) {
            return this;
        }
        this.tools = [];
        const normalizedTools = [];
        tools.forEach((meta) => {
            if (ToolsView.ToolItem.isToolItem(meta)) {
                if (meta.name === 'vertices') {
                    normalizedTools.unshift(meta);
                }
                else {
                    normalizedTools.push(meta);
                }
            }
            else {
                const name = typeof meta === 'object' ? meta.name : meta;
                if (name === 'vertices') {
                    normalizedTools.unshift(meta);
                }
                else {
                    normalizedTools.push(meta);
                }
            }
        });
        for (let i = 0; i < normalizedTools.length; i += 1) {
            const meta = normalizedTools[i];
            let tool;
            if (ToolsView.ToolItem.isToolItem(meta)) {
                tool = meta;
            }
            else {
                const name = typeof meta === 'object' ? meta.name : meta;
                const args = typeof meta === 'object' ? meta.args || {} : {};
                if (name) {
                    if (this.cell.isNode()) {
                        const ctor = NodeTool.registry.get(name);
                        if (ctor) {
                            tool = new ctor(args); // eslint-disable-line
                        }
                        else {
                            return NodeTool.registry.onNotFound(name);
                        }
                    }
                    else if (this.cell.isEdge()) {
                        const ctor = EdgeTool.registry.get(name);
                        if (ctor) {
                            tool = new ctor(args); // eslint-disable-line
                        }
                        else {
                            return EdgeTool.registry.onNotFound(name);
                        }
                    }
                }
            }
            if (tool) {
                tool.config(this.cellView, this);
                tool.render();
                const container = tool.options.isSVGElement !== false
                    ? this.svgContainer
                    : this.htmlContainer;
                container.appendChild(tool.container);
                this.tools.push(tool);
            }
        }
        return this;
    }
    update(options = {}) {
        const tools = this.tools;
        if (tools) {
            tools.forEach((tool) => {
                if (options.toolId !== tool.cid && tool.isVisible()) {
                    tool.update();
                }
            });
        }
        return this;
    }
    focus(focusedTool) {
        const tools = this.tools;
        if (tools) {
            tools.forEach((tool) => {
                if (focusedTool === tool) {
                    tool.show();
                }
                else {
                    tool.hide();
                }
            });
        }
        return this;
    }
    blur(blurredTool) {
        const tools = this.tools;
        if (tools) {
            tools.forEach((tool) => {
                if (tool !== blurredTool && !tool.isVisible()) {
                    tool.show();
                    tool.update();
                }
            });
        }
        return this;
    }
    hide() {
        return this.focus(null);
    }
    show() {
        return this.blur(null);
    }
    remove() {
        const tools = this.tools;
        if (tools) {
            tools.forEach((tool) => tool.remove());
            this.tools = null;
        }
        Dom.remove(this.svgContainer);
        Dom.remove(this.htmlContainer);
        return super.remove();
    }
    mount() {
        const tools = this.tools;
        const cellView = this.cellView;
        if (cellView && tools) {
            const hasSVG = tools.some((tool) => tool.options.isSVGElement !== false);
            const hasHTML = tools.some((tool) => tool.options.isSVGElement === false);
            if (hasSVG) {
                const parent = this.options.local
                    ? cellView.container
                    : cellView.graph.view.decorator;
                parent.appendChild(this.svgContainer);
            }
            if (hasHTML) {
                this.graph.container.appendChild(this.htmlContainer);
            }
        }
        return this;
    }
}
(function (ToolsView) {
    ToolsView.toStringTag = `X6.${ToolsView.name}`;
    function isToolsView(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof ToolsView) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const view = instance;
        if ((tag == null || tag === ToolsView.toStringTag) &&
            view.graph != null &&
            view.cell != null &&
            typeof view.config === 'function' &&
            typeof view.update === 'function' &&
            typeof view.focus === 'function' &&
            typeof view.blur === 'function' &&
            typeof view.show === 'function' &&
            typeof view.hide === 'function') {
            return true;
        }
        return false;
    }
    ToolsView.isToolsView = isToolsView;
})(ToolsView || (ToolsView = {}));
(function (ToolsView) {
    class ToolItem extends View {
        constructor(options = {}) {
            super();
            this.visible = true;
            this.options = this.getOptions(options);
            this.container = View.createElement(this.options.tagName || 'g', this.options.isSVGElement !== false);
            Dom.addClass(this.container, this.prefixClassName('cell-tool'));
            if (typeof this.options.className === 'string') {
                Dom.addClass(this.container, this.options.className);
            }
            this.init();
        }
        static getDefaults() {
            return this.defaults;
        }
        static config(options) {
            this.defaults = this.getOptions(options);
        }
        static getOptions(options) {
            return ObjectExt.merge(ObjectExt.cloneDeep(this.getDefaults()), options);
        }
        get graph() {
            return this.cellView.graph;
        }
        get cell() {
            return this.cellView.cell;
        }
        get name() {
            return this.options.name;
        }
        get [Symbol.toStringTag]() {
            return ToolItem.toStringTag;
        }
        init() { }
        getOptions(options) {
            const ctor = this.constructor;
            return ctor.getOptions(options);
        }
        delegateEvents() {
            if (this.options.events) {
                super.delegateEvents(this.options.events);
            }
            return this;
        }
        config(view, toolsView) {
            this.cellView = view;
            this.parent = toolsView;
            this.stamp(this.container);
            if (this.cell.isEdge()) {
                Dom.addClass(this.container, this.prefixClassName('edge-tool'));
            }
            else if (this.cell.isNode()) {
                Dom.addClass(this.container, this.prefixClassName('node-tool'));
            }
            if (this.name) {
                this.container.setAttribute('data-tool-name', this.name);
            }
            this.delegateEvents();
            return this;
        }
        render() {
            this.empty();
            const markup = this.options.markup;
            if (markup) {
                const meta = Markup.isStringMarkup(markup)
                    ? Markup.parseStringMarkup(markup)
                    : Markup.parseJSONMarkup(markup);
                this.container.appendChild(meta.fragment);
                this.childNodes = meta.selectors;
            }
            this.onRender();
            return this;
        }
        onRender() { }
        update() {
            return this;
        }
        stamp(elem) {
            if (elem) {
                elem.setAttribute('data-cell-id', this.cellView.cell.id);
            }
        }
        show() {
            this.container.style.display = '';
            this.visible = true;
            return this;
        }
        hide() {
            this.container.style.display = 'none';
            this.visible = false;
            return this;
        }
        isVisible() {
            return !!this.visible;
        }
        focus() {
            const opacity = this.options.focusOpacity;
            if (opacity != null && Number.isFinite(opacity)) {
                this.container.style.opacity = `${opacity}`;
            }
            this.parent.focus(this);
            return this;
        }
        blur() {
            this.container.style.opacity = '';
            this.parent.blur(this);
            return this;
        }
        guard(evt) {
            if (this.graph == null || this.cellView == null) {
                return true;
            }
            return this.graph.view.guard(evt, this.cellView);
        }
    }
    // #region static
    ToolItem.defaults = {
        isSVGElement: true,
        tagName: 'g',
    };
    ToolsView.ToolItem = ToolItem;
    (function (ToolItem) {
        let counter = 0;
        function getClassName(name) {
            if (name) {
                return StringExt.pascalCase(name);
            }
            counter += 1;
            return `CustomTool${counter}`;
        }
        function define(options) {
            const tool = ObjectExt.createClass(getClassName(options.name), this);
            tool.config(options);
            return tool;
        }
        ToolItem.define = define;
    })(ToolItem = ToolsView.ToolItem || (ToolsView.ToolItem = {}));
    (function (ToolItem) {
        ToolItem.toStringTag = `X6.${ToolItem.name}`;
        function isToolItem(instance) {
            if (instance == null) {
                return false;
            }
            if (instance instanceof ToolItem) {
                return true;
            }
            const tag = instance[Symbol.toStringTag];
            const view = instance;
            if ((tag == null || tag === ToolItem.toStringTag) &&
                view.graph != null &&
                view.cell != null &&
                typeof view.config === 'function' &&
                typeof view.update === 'function' &&
                typeof view.focus === 'function' &&
                typeof view.blur === 'function' &&
                typeof view.show === 'function' &&
                typeof view.hide === 'function' &&
                typeof view.isVisible === 'function') {
                return true;
            }
            return false;
        }
        ToolItem.isToolItem = isToolItem;
    })(ToolItem = ToolsView.ToolItem || (ToolsView.ToolItem = {}));
})(ToolsView || (ToolsView = {}));
//# sourceMappingURL=tool.js.map