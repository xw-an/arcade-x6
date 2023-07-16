var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Util } from '../../global';
import { Rectangle, Angle } from '../../geometry';
import { ObjectExt, StringExt, FunctionExt } from '../../util';
import { Cell } from '../../model/cell';
import { Collection } from '../../model/collection';
import { View } from '../../view/view';
import { notify } from '../transform/util';
import { Handle } from '../common';
export class Selection extends View {
    constructor(options) {
        super();
        this.options = ObjectExt.merge({}, Private.defaultOptions, options);
        if (this.options.model) {
            this.options.collection = this.options.model.collection;
        }
        if (this.options.collection) {
            this.collection = this.options.collection;
        }
        else {
            this.collection = new Collection([], {
                comparator: Private.depthComparator,
            });
            this.options.collection = this.collection;
        }
        this.boxCount = 0;
        this.createContainer();
        this.initHandles();
        this.startListening();
    }
    get graph() {
        return this.options.graph;
    }
    get boxClassName() {
        return this.prefixClassName(Private.classNames.box);
    }
    get $boxes() {
        return this.$container.children(`.${this.boxClassName}`);
    }
    get handleOptions() {
        return this.options;
    }
    startListening() {
        const graph = this.graph;
        const collection = this.collection;
        this.delegateEvents({
            [`mousedown .${this.boxClassName}`]: 'onSelectionBoxMouseDown',
            [`touchstart .${this.boxClassName}`]: 'onSelectionBoxMouseDown',
        }, true);
        graph.on('scale', this.onGraphTransformed, this);
        graph.on('translate', this.onGraphTransformed, this);
        graph.model.on('updated', this.onModelUpdated, this);
        collection.on('added', this.onCellAdded, this);
        collection.on('removed', this.onCellRemoved, this);
        collection.on('reseted', this.onReseted, this);
        collection.on('updated', this.onCollectionUpdated, this);
        collection.on('node:change:position', this.onNodePositionChanged, this);
        collection.on('cell:changed', this.onCellChanged, this);
    }
    stopListening() {
        const graph = this.graph;
        const collection = this.collection;
        this.undelegateEvents();
        graph.off('scale', this.onGraphTransformed, this);
        graph.off('translate', this.onGraphTransformed, this);
        graph.model.off('updated', this.onModelUpdated, this);
        collection.off('added', this.onCellAdded, this);
        collection.off('removed', this.onCellRemoved, this);
        collection.off('reseted', this.onReseted, this);
        collection.off('updated', this.onCollectionUpdated, this);
        collection.off('node:change:position', this.onNodePositionChanged, this);
        collection.off('cell:changed', this.onCellChanged, this);
    }
    onRemove() {
        this.stopListening();
    }
    onGraphTransformed() {
        this.updateSelectionBoxes({ async: false });
    }
    onCellChanged() {
        this.updateSelectionBoxes();
    }
    onNodePositionChanged({ node, options, }) {
        const { showNodeSelectionBox, pointerEvents } = this.options;
        const { ui, selection, translateBy, snapped } = options;
        const allowTranslating = (showNodeSelectionBox !== true || pointerEvents === 'none') &&
            !this.translating &&
            !selection;
        const translateByUi = ui && translateBy && node.id === translateBy;
        if (allowTranslating && (translateByUi || snapped)) {
            this.translating = true;
            const current = node.position();
            const previous = node.previous('position');
            const dx = current.x - previous.x;
            const dy = current.y - previous.y;
            if (dx !== 0 || dy !== 0) {
                this.translateSelectedNodes(dx, dy, node, options);
            }
            this.translating = false;
        }
    }
    onModelUpdated({ removed }) {
        if (removed && removed.length) {
            this.unselect(removed);
        }
    }
    isEmpty() {
        return this.length <= 0;
    }
    isSelected(cell) {
        return this.collection.has(cell);
    }
    get length() {
        return this.collection.length;
    }
    get cells() {
        return this.collection.toArray();
    }
    select(cells, options = {}) {
        options.dryrun = true;
        const items = this.filter(Array.isArray(cells) ? cells : [cells]);
        this.collection.add(items, options);
        return this;
    }
    unselect(cells, options = {}) {
        // dryrun to prevent cell be removed from graph
        options.dryrun = true;
        this.collection.remove(Array.isArray(cells) ? cells : [cells], options);
        return this;
    }
    reset(cells, options = {}) {
        if (cells) {
            if (options.batch) {
                const filterCells = this.filter(Array.isArray(cells) ? cells : [cells]);
                this.collection.reset(filterCells, Object.assign(Object.assign({}, options), { ui: true }));
                return this;
            }
            const prev = this.cells;
            const next = this.filter(Array.isArray(cells) ? cells : [cells]);
            const prevMap = {};
            const nextMap = {};
            prev.forEach((cell) => (prevMap[cell.id] = cell));
            next.forEach((cell) => (nextMap[cell.id] = cell));
            const added = [];
            const removed = [];
            next.forEach((cell) => {
                if (!prevMap[cell.id]) {
                    added.push(cell);
                }
            });
            prev.forEach((cell) => {
                if (!nextMap[cell.id]) {
                    removed.push(cell);
                }
            });
            if (removed.length) {
                this.unselect(removed, Object.assign(Object.assign({}, options), { ui: true }));
            }
            if (added.length) {
                this.select(added, Object.assign(Object.assign({}, options), { ui: true }));
            }
            if (removed.length === 0 && added.length === 0) {
                this.updateContainer();
            }
            return this;
        }
        return this.clean(options);
    }
    clean(options = {}) {
        if (this.length) {
            if (options.batch === false) {
                this.unselect(this.cells, options);
            }
            else {
                this.collection.reset([], Object.assign(Object.assign({}, options), { ui: true }));
            }
        }
        return this;
    }
    setFilter(filter) {
        this.options.filter = filter;
    }
    setContent(content) {
        this.options.content = content;
    }
    startSelecting(evt) {
        // Flow: startSelecting => adjustSelection => stopSelecting
        evt = this.normalizeEvent(evt); // eslint-disable-line
        this.clean();
        let x;
        let y;
        const graphContainer = this.graph.container;
        if (evt.offsetX != null &&
            evt.offsetY != null &&
            graphContainer.contains(evt.target)) {
            x = evt.offsetX;
            y = evt.offsetY;
        }
        else {
            const offset = this.$(graphContainer).offset();
            const scrollLeft = graphContainer.scrollLeft;
            const scrollTop = graphContainer.scrollTop;
            x = evt.clientX - offset.left + window.pageXOffset + scrollLeft;
            y = evt.clientY - offset.top + window.pageYOffset + scrollTop;
        }
        this.$container.css({
            top: y,
            left: x,
            width: 1,
            height: 1,
        });
        this.setEventData(evt, {
            action: 'selecting',
            clientX: evt.clientX,
            clientY: evt.clientY,
            offsetX: x,
            offsetY: y,
            scrollerX: 0,
            scrollerY: 0,
            moving: false,
        });
        this.delegateDocumentEvents(Private.documentEvents, evt.data);
    }
    filter(cells) {
        const filter = this.options.filter;
        if (Array.isArray(filter)) {
            return cells.filter((cell) => !filter.includes(cell) && !filter.includes(cell.shape));
        }
        if (typeof filter === 'function') {
            return cells.filter((cell) => FunctionExt.call(filter, this.graph, cell));
        }
        return cells;
    }
    stopSelecting(evt) {
        const graph = this.graph;
        const eventData = this.getEventData(evt);
        const action = eventData.action;
        switch (action) {
            case 'selecting': {
                let width = this.$container.width();
                let height = this.$container.height();
                const offset = this.$container.offset();
                const origin = graph.pageToLocal(offset.left, offset.top);
                const scale = graph.transform.getScale();
                width /= scale.sx;
                height /= scale.sy;
                const rect = new Rectangle(origin.x, origin.y, width, height);
                const cells = this.getCellViewsInArea(rect).map((view) => view.cell);
                this.reset(cells, { batch: true });
                this.hideRubberband();
                break;
            }
            case 'translating': {
                const client = graph.snapToGrid(evt.clientX, evt.clientY);
                if (!this.options.following) {
                    const data = eventData;
                    this.updateSelectedNodesPosition({
                        dx: data.clientX - data.originX,
                        dy: data.clientY - data.originY,
                    });
                }
                this.graph.model.stopBatch('move-selection');
                this.notifyBoxEvent('box:mouseup', evt, client.x, client.y);
                break;
            }
            default: {
                this.clean();
                break;
            }
        }
    }
    onMouseUp(evt) {
        const action = this.getEventData(evt).action;
        if (action) {
            this.stopSelecting(evt);
            this.undelegateDocumentEvents();
        }
    }
    onSelectionBoxMouseDown(evt) {
        if (!this.options.following) {
            evt.stopPropagation();
        }
        const e = this.normalizeEvent(evt);
        if (this.options.movable) {
            this.startTranslating(e);
        }
        const activeView = this.getCellViewFromElem(e.target);
        this.setEventData(e, { activeView });
        const client = this.graph.snapToGrid(e.clientX, e.clientY);
        this.notifyBoxEvent('box:mousedown', e, client.x, client.y);
        this.delegateDocumentEvents(Private.documentEvents, e.data);
    }
    startTranslating(evt) {
        this.graph.model.startBatch('move-selection');
        const client = this.graph.snapToGrid(evt.clientX, evt.clientY);
        this.setEventData(evt, {
            action: 'translating',
            clientX: client.x,
            clientY: client.y,
            originX: client.x,
            originY: client.y,
        });
    }
    getSelectionOffset(client, data) {
        let dx = client.x - data.clientX;
        let dy = client.y - data.clientY;
        const restrict = this.graph.hook.getRestrictArea();
        if (restrict) {
            const cells = this.collection.toArray();
            const totalBBox = Cell.getCellsBBox(cells, { deep: true }) || Rectangle.create();
            const minDx = restrict.x - totalBBox.x;
            const minDy = restrict.y - totalBBox.y;
            const maxDx = restrict.x + restrict.width - (totalBBox.x + totalBBox.width);
            const maxDy = restrict.y + restrict.height - (totalBBox.y + totalBBox.height);
            if (dx < minDx) {
                dx = minDx;
            }
            if (dy < minDy) {
                dy = minDy;
            }
            if (maxDx < dx) {
                dx = maxDx;
            }
            if (maxDy < dy) {
                dy = maxDy;
            }
            if (!this.options.following) {
                const offsetX = client.x - data.originX;
                const offsetY = client.y - data.originY;
                dx = offsetX <= minDx || offsetX >= maxDx ? 0 : dx;
                dy = offsetY <= minDy || offsetY >= maxDy ? 0 : dy;
            }
        }
        return {
            dx,
            dy,
        };
    }
    updateSelectedNodesPosition(offset) {
        const { dx, dy } = offset;
        if (dx || dy) {
            if ((this.translateSelectedNodes(dx, dy), this.boxesUpdated)) {
                if (this.collection.length > 1) {
                    this.updateSelectionBoxes();
                }
            }
            else {
                const scale = this.graph.transform.getScale();
                this.$boxes.add(this.$selectionContainer).css({
                    left: `+=${dx * scale.sx}`,
                    top: `+=${dy * scale.sy}`,
                });
            }
        }
    }
    autoScrollGraph(x, y) {
        const scroller = this.graph.scroller.widget;
        if (scroller) {
            return scroller.autoScroll(x, y);
        }
        return { scrollerX: 0, scrollerY: 0 };
    }
    adjustSelection(evt) {
        const e = this.normalizeEvent(evt);
        const eventData = this.getEventData(e);
        const action = eventData.action;
        switch (action) {
            case 'selecting': {
                const data = eventData;
                if (data.moving !== true) {
                    this.$container.appendTo(this.graph.container);
                    this.showRubberband();
                    data.moving = true;
                }
                const { scrollerX, scrollerY } = this.autoScrollGraph(e.clientX, e.clientY);
                data.scrollerX += scrollerX;
                data.scrollerY += scrollerY;
                const dx = e.clientX - data.clientX + data.scrollerX;
                const dy = e.clientY - data.clientY + data.scrollerY;
                const left = parseInt(this.$container.css('left'), 10);
                const top = parseInt(this.$container.css('top'), 10);
                this.$container.css({
                    left: dx < 0 ? data.offsetX + dx : left,
                    top: dy < 0 ? data.offsetY + dy : top,
                    width: Math.abs(dx),
                    height: Math.abs(dy),
                });
                break;
            }
            case 'translating': {
                const client = this.graph.snapToGrid(e.clientX, e.clientY);
                const data = eventData;
                const offset = this.getSelectionOffset(client, data);
                if (this.options.following) {
                    this.updateSelectedNodesPosition(offset);
                }
                else {
                    this.updateContainerPosition(offset);
                }
                if (offset.dx) {
                    data.clientX = client.x;
                }
                if (offset.dy) {
                    data.clientY = client.y;
                }
                this.notifyBoxEvent('box:mousemove', evt, client.x, client.y);
                break;
            }
            default:
                break;
        }
        this.boxesUpdated = false;
    }
    translateSelectedNodes(dx, dy, exclude, otherOptions) {
        const map = {};
        const excluded = [];
        if (exclude) {
            map[exclude.id] = true;
        }
        this.collection.toArray().forEach((cell) => {
            cell.getDescendants({ deep: true }).forEach((child) => {
                map[child.id] = true;
            });
        });
        if (otherOptions && otherOptions.translateBy) {
            const currentCell = this.graph.getCellById(otherOptions.translateBy);
            if (currentCell) {
                map[currentCell.id] = true;
                currentCell.getDescendants({ deep: true }).forEach((child) => {
                    map[child.id] = true;
                });
                excluded.push(currentCell);
            }
        }
        this.collection.toArray().forEach((cell) => {
            if (!map[cell.id]) {
                const options = Object.assign(Object.assign({}, otherOptions), { selection: this.cid, exclude: excluded });
                cell.translate(dx, dy, options);
                this.graph.model.getConnectedEdges(cell).forEach((edge) => {
                    if (!map[edge.id]) {
                        edge.translate(dx, dy, options);
                        map[edge.id] = true;
                    }
                });
            }
        });
    }
    getCellViewsInArea(rect) {
        const graph = this.graph;
        const options = {
            strict: this.options.strict,
        };
        let views = [];
        if (this.options.rubberNode) {
            if (this.options.useCellGeometry) {
                views = views.concat(graph.model
                    .getNodesInArea(rect, options)
                    .map((node) => graph.renderer.findViewByCell(node))
                    .filter((view) => view != null));
            }
            else {
                views = views.concat(graph.renderer.findViewsInArea(rect, options));
            }
        }
        if (this.options.rubberEdge) {
            if (this.options.useCellGeometry) {
                views = views.concat(graph.model
                    .getEdgesInArea(rect, options)
                    .map((edge) => graph.renderer.findViewByCell(edge))
                    .filter((view) => view != null));
            }
            else {
                views = views.concat(graph.renderer.findEdgeViewsInArea(rect, options));
            }
        }
        return views;
    }
    notifyBoxEvent(name, e, x, y) {
        const data = this.getEventData(e);
        const view = data.activeView;
        this.trigger(name, { e, view, x, y, cell: view.cell });
    }
    getSelectedClassName(cell) {
        return this.prefixClassName(`${cell.isNode() ? 'node' : 'edge'}-selected`);
    }
    addCellSelectedClassName(cell) {
        const view = this.graph.renderer.findViewByCell(cell);
        if (view) {
            view.addClass(this.getSelectedClassName(cell));
        }
    }
    removeCellUnSelectedClassName(cell) {
        const view = this.graph.renderer.findViewByCell(cell);
        if (view) {
            view.removeClass(this.getSelectedClassName(cell));
        }
    }
    destroySelectionBox(cell) {
        this.removeCellUnSelectedClassName(cell);
        if (this.canShowSelectionBox(cell)) {
            this.$container.find(`[data-cell-id="${cell.id}"]`).remove();
            if (this.$boxes.length === 0) {
                this.hide();
            }
            this.boxCount = Math.max(0, this.boxCount - 1);
        }
    }
    destroyAllSelectionBoxes(cells) {
        cells.forEach((cell) => this.removeCellUnSelectedClassName(cell));
        this.hide();
        this.$boxes.remove();
        this.boxCount = 0;
    }
    hide() {
        this.$container
            .removeClass(this.prefixClassName(Private.classNames.rubberband))
            .removeClass(this.prefixClassName(Private.classNames.selected));
    }
    showRubberband() {
        this.$container.addClass(this.prefixClassName(Private.classNames.rubberband));
    }
    hideRubberband() {
        this.$container.removeClass(this.prefixClassName(Private.classNames.rubberband));
    }
    showSelected() {
        this.$container
            .removeAttr('style')
            .addClass(this.prefixClassName(Private.classNames.selected));
    }
    createContainer() {
        this.container = document.createElement('div');
        this.$container = this.$(this.container);
        this.$container.addClass(this.prefixClassName(Private.classNames.root));
        if (this.options.className) {
            this.$container.addClass(this.options.className);
        }
        this.$selectionContainer = this.$('<div/>').addClass(this.prefixClassName(Private.classNames.inner));
        this.$selectionContent = this.$('<div/>').addClass(this.prefixClassName(Private.classNames.content));
        this.$selectionContainer.append(this.$selectionContent);
        this.$selectionContainer.attr('data-selection-length', this.collection.length);
        this.$container.prepend(this.$selectionContainer);
        this.$handleContainer = this.$selectionContainer;
    }
    updateContainerPosition(offset) {
        if (offset.dx || offset.dy) {
            this.$selectionContainer.css({
                left: `+=${offset.dx}`,
                top: `+=${offset.dy}`,
            });
        }
    }
    updateContainer() {
        const origin = { x: Infinity, y: Infinity };
        const corner = { x: 0, y: 0 };
        const cells = this.collection
            .toArray()
            .filter((cell) => this.canShowSelectionBox(cell));
        cells.forEach((cell) => {
            const view = this.graph.renderer.findViewByCell(cell);
            if (view) {
                const bbox = view.getBBox({
                    useCellGeometry: this.options.useCellGeometry,
                });
                origin.x = Math.min(origin.x, bbox.x);
                origin.y = Math.min(origin.y, bbox.y);
                corner.x = Math.max(corner.x, bbox.x + bbox.width);
                corner.y = Math.max(corner.y, bbox.y + bbox.height);
            }
        });
        this.$selectionContainer
            .css({
            position: 'absolute',
            pointerEvents: 'none',
            left: origin.x,
            top: origin.y,
            width: corner.x - origin.x,
            height: corner.y - origin.y,
        })
            .attr('data-selection-length', this.collection.length);
        const boxContent = this.options.content;
        if (boxContent) {
            if (typeof boxContent === 'function') {
                const content = FunctionExt.call(boxContent, this.graph, this, this.$selectionContent[0]);
                if (content) {
                    this.$selectionContent.html(content);
                }
            }
            else {
                this.$selectionContent.html(boxContent);
            }
        }
        if (this.collection.length > 0 && !this.container.parentNode) {
            this.$container.appendTo(this.graph.container);
        }
        else if (this.collection.length <= 0 && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
    canShowSelectionBox(cell) {
        return ((cell.isNode() && this.options.showNodeSelectionBox === true) ||
            (cell.isEdge() && this.options.showEdgeSelectionBox === true));
    }
    createSelectionBox(cell) {
        this.addCellSelectedClassName(cell);
        if (this.canShowSelectionBox(cell)) {
            const view = this.graph.renderer.findViewByCell(cell);
            if (view) {
                const bbox = view.getBBox({
                    useCellGeometry: this.options.useCellGeometry,
                });
                const className = this.boxClassName;
                this.$('<div/>')
                    .addClass(className)
                    .addClass(`${className}-${cell.isNode() ? 'node' : 'edge'}`)
                    .attr('data-cell-id', cell.id)
                    .css({
                    position: 'absolute',
                    left: bbox.x,
                    top: bbox.y,
                    width: bbox.width,
                    height: bbox.height,
                    pointerEvents: this.options.pointerEvents || 'auto',
                })
                    .appendTo(this.container);
                this.showSelected();
                this.boxCount += 1;
            }
        }
    }
    updateSelectionBoxes(options = {}) {
        if (this.collection.length > 0) {
            this.boxesUpdated = true;
            this.graph.renderer.requestViewUpdate(this, 1, 2, options);
        }
    }
    confirmUpdate() {
        if (this.boxCount) {
            this.hide();
            this.$boxes.each((_, elem) => {
                const cellId = this.$(elem).remove().attr('data-cell-id');
                const cell = this.collection.get(cellId);
                if (cell) {
                    this.createSelectionBox(cell);
                }
            });
            this.updateContainer();
        }
        return 0;
    }
    getCellViewFromElem(elem) {
        const id = elem.getAttribute('data-cell-id');
        if (id) {
            const cell = this.collection.get(id);
            if (cell) {
                return this.graph.renderer.findViewByCell(cell);
            }
        }
        return null;
    }
    onCellRemoved({ cell }) {
        this.destroySelectionBox(cell);
        this.updateContainer();
    }
    onReseted({ previous, current }) {
        this.destroyAllSelectionBoxes(previous);
        current.forEach((cell) => {
            this.listenCellRemoveEvent(cell);
            this.createSelectionBox(cell);
        });
        this.updateContainer();
    }
    onCellAdded({ cell }) {
        // The collection do not known the cell was removed when cell was
        // removed by interaction(such as, by "delete" shortcut), so we should
        // manually listen to cell's remove evnet.
        this.listenCellRemoveEvent(cell);
        this.createSelectionBox(cell);
        this.updateContainer();
    }
    listenCellRemoveEvent(cell) {
        cell.off('removed', this.onCellRemoved, this);
        cell.on('removed', this.onCellRemoved, this);
    }
    onCollectionUpdated({ added, removed, options, }) {
        added.forEach((cell) => {
            this.trigger('cell:selected', { cell, options });
            this.graph.trigger('cell:selected', { cell, options });
            if (cell.isNode()) {
                this.trigger('node:selected', { cell, options, node: cell });
                this.graph.trigger('node:selected', { cell, options, node: cell });
            }
            else if (cell.isEdge()) {
                this.trigger('edge:selected', { cell, options, edge: cell });
                this.graph.trigger('edge:selected', { cell, options, edge: cell });
            }
        });
        removed.forEach((cell) => {
            this.trigger('cell:unselected', { cell, options });
            this.graph.trigger('cell:unselected', { cell, options });
            if (cell.isNode()) {
                this.trigger('node:unselected', { cell, options, node: cell });
                this.graph.trigger('node:unselected', { cell, options, node: cell });
            }
            else if (cell.isEdge()) {
                this.trigger('edge:unselected', { cell, options, edge: cell });
                this.graph.trigger('edge:unselected', { cell, options, edge: cell });
            }
        });
        const args = {
            added,
            removed,
            options,
            selected: this.cells.filter((cell) => !!this.graph.getCellById(cell.id)),
        };
        this.trigger('selection:changed', args);
        this.graph.trigger('selection:changed', args);
    }
    // #region handle
    deleteSelectedCells() {
        const cells = this.collection.toArray();
        this.clean();
        this.graph.model.removeCells(cells, { selection: this.cid });
    }
    startRotate({ e }) {
        const cells = this.collection.toArray();
        const center = Cell.getCellsBBox(cells).getCenter();
        const client = this.graph.snapToGrid(e.clientX, e.clientY);
        const angles = cells.reduce((memo, cell) => {
            memo[cell.id] = Angle.normalize(cell.getAngle());
            return memo;
        }, {});
        this.setEventData(e, {
            center,
            angles,
            start: client.theta(center),
        });
    }
    doRotate({ e }) {
        const data = this.getEventData(e);
        const grid = this.graph.options.rotating.grid;
        const gridSize = typeof grid === 'function'
            ? FunctionExt.call(grid, this.graph, null)
            : grid;
        const client = this.graph.snapToGrid(e.clientX, e.clientY);
        const delta = data.start - client.theta(data.center);
        if (!data.rotated) {
            data.rotated = true;
        }
        if (Math.abs(delta) > 0.001) {
            this.collection.toArray().forEach((node) => {
                const angle = Util.snapToGrid(data.angles[node.id] + delta, gridSize || 15);
                node.rotate(angle, {
                    absolute: true,
                    center: data.center,
                    selection: this.cid,
                });
            });
            this.updateSelectionBoxes();
        }
    }
    stopRotate({ e }) {
        const data = this.getEventData(e);
        if (data.rotated) {
            data.rotated = false;
            this.collection.toArray().forEach((node) => {
                notify('node:rotated', e, this.graph.findViewByCell(node));
            });
        }
    }
    startResize({ e }) {
        const gridSize = this.graph.getGridSize();
        const cells = this.collection.toArray();
        const bbox = Cell.getCellsBBox(cells);
        const bboxes = cells.map((cell) => cell.getBBox());
        const maxWidth = bboxes.reduce((maxWidth, bbox) => {
            return bbox.width < maxWidth ? bbox.width : maxWidth;
        }, Infinity);
        const maxHeight = bboxes.reduce((maxHeight, bbox) => {
            return bbox.height < maxHeight ? bbox.height : maxHeight;
        }, Infinity);
        this.setEventData(e, {
            bbox,
            cells: this.graph.model.getSubGraph(cells),
            minWidth: (gridSize * bbox.width) / maxWidth,
            minHeight: (gridSize * bbox.height) / maxHeight,
        });
    }
    doResize({ e, dx, dy }) {
        const data = this.eventData(e);
        const bbox = data.bbox;
        const width = bbox.width;
        const height = bbox.height;
        const newWidth = Math.max(width + dx, data.minWidth);
        const newHeight = Math.max(height + dy, data.minHeight);
        if (!data.resized) {
            data.resized = true;
        }
        if (Math.abs(width - newWidth) > 0.001 ||
            Math.abs(height - newHeight) > 0.001) {
            this.graph.model.resizeCells(newWidth, newHeight, data.cells, {
                selection: this.cid,
            });
            bbox.width = newWidth;
            bbox.height = newHeight;
            this.updateSelectionBoxes();
        }
    }
    stopResize({ e }) {
        const data = this.eventData(e);
        if (data.resized) {
            data.resized = false;
            this.collection.toArray().forEach((node) => {
                notify('node:resized', e, this.graph.findViewByCell(node));
            });
        }
    }
    // #endregion
    dispose() {
        this.clean();
        this.remove();
    }
}
__decorate([
    View.dispose()
], Selection.prototype, "dispose", null);
ObjectExt.applyMixins(Selection, Handle);
// private
// -------
var Private;
(function (Private) {
    const base = 'widget-selection';
    Private.classNames = {
        root: base,
        inner: `${base}-inner`,
        box: `${base}-box`,
        content: `${base}-content`,
        rubberband: `${base}-rubberband`,
        selected: `${base}-selected`,
    };
    Private.documentEvents = {
        mousemove: 'adjustSelection',
        touchmove: 'adjustSelection',
        mouseup: 'onMouseUp',
        touchend: 'onMouseUp',
        touchcancel: 'onMouseUp',
    };
    Private.defaultOptions = {
        movable: true,
        following: true,
        strict: false,
        useCellGeometry: false,
        content(selection) {
            return StringExt.template('<%= length %> node<%= length > 1 ? "s":"" %> selected.')({ length: selection.length });
        },
        handles: [
            {
                name: 'remove',
                position: 'nw',
                events: {
                    mousedown: 'deleteSelectedCells',
                },
            },
            {
                name: 'rotate',
                position: 'sw',
                events: {
                    mousedown: 'startRotate',
                    mousemove: 'doRotate',
                    mouseup: 'stopRotate',
                },
            },
            {
                name: 'resize',
                position: 'se',
                events: {
                    mousedown: 'startResize',
                    mousemove: 'doResize',
                    mouseup: 'stopResize',
                },
            },
        ],
    };
    function depthComparator(cell) {
        return cell.getAncestors().length;
    }
    Private.depthComparator = depthComparator;
})(Private || (Private = {}));
//# sourceMappingURL=index.js.map