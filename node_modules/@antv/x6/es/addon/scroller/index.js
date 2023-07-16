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
import { Platform, NumberExt, ObjectExt, Dom, FunctionExt } from '../../util';
import { Point, Rectangle } from '../../geometry';
import { View } from '../../view/view';
import { Renderer } from '../../graph/renderer';
import { GraphView } from '../../graph/view';
import { BackgroundManager } from '../../graph/background';
export class Scroller extends View {
    constructor(options) {
        super();
        this.padding = { left: 0, top: 0, right: 0, bottom: 0 };
        this.options = Util.getOptions(options);
        const scale = this.graph.transform.getScale();
        this.sx = scale.sx;
        this.sy = scale.sy;
        const width = this.options.width || this.graph.options.width;
        const height = this.options.height || this.graph.options.height;
        this.container = document.createElement('div');
        this.$container = this.$(this.container)
            .addClass(this.prefixClassName(Util.containerClass))
            .css({ width, height });
        if (this.options.pageVisible) {
            this.$container.addClass(this.prefixClassName(Util.pagedClass));
        }
        if (this.options.className) {
            this.$container.addClass(this.options.className);
        }
        const graphContainer = this.graph.container;
        if (graphContainer.parentNode) {
            this.$container.insertBefore(graphContainer);
        }
        // copy style
        const style = graphContainer.getAttribute('style');
        if (style) {
            const obj = {};
            const styles = style.split(';');
            styles.forEach((item) => {
                const section = item.trim();
                if (section) {
                    const pair = section.split(':');
                    if (pair.length) {
                        obj[pair[0].trim()] = pair[1] ? pair[1].trim() : '';
                    }
                }
            });
            Object.keys(obj).forEach((key) => {
                if (key === 'width' || key === 'height') {
                    return;
                }
                graphContainer.style[key] = '';
                this.container.style[key] = obj[key];
            });
        }
        this.content = document.createElement('div');
        this.$content = this.$(this.content)
            .addClass(this.prefixClassName(Util.contentClass))
            .css({
            width: this.graph.options.width,
            height: this.graph.options.height,
        });
        // custom background
        this.background = document.createElement('div');
        this.$background = this.$(this.background).addClass(this.prefixClassName(Util.backgroundClass));
        this.$content.append(this.background);
        if (!this.options.pageVisible) {
            this.$content.append(this.graph.view.grid);
        }
        this.$content.append(graphContainer);
        this.$content.appendTo(this.container);
        this.startListening();
        if (!this.options.pageVisible) {
            this.graph.grid.update();
        }
        this.backgroundManager = new Scroller.Background(this);
        if (!this.options.autoResize) {
            this.update();
        }
    }
    get graph() {
        return this.options.graph;
    }
    get model() {
        return this.graph.model;
    }
    startListening() {
        const graph = this.graph;
        const model = this.model;
        graph.on('scale', this.onScale, this);
        graph.on('resize', this.onResize, this);
        graph.on('before:print', this.storeScrollPosition, this);
        graph.on('before:export', this.storeScrollPosition, this);
        graph.on('after:print', this.restoreScrollPosition, this);
        graph.on('after:export', this.restoreScrollPosition, this);
        graph.on('render:done', this.onRenderDone, this);
        graph.on('unfreeze', this.onUpdate, this);
        model.on('reseted', this.onUpdate, this);
        model.on('cell:added', this.onUpdate, this);
        model.on('cell:removed', this.onUpdate, this);
        model.on('cell:changed', this.onUpdate, this);
        model.on('batch:stop', this.onBatchStop, this);
        this.delegateBackgroundEvents();
    }
    stopListening() {
        const graph = this.graph;
        const model = this.model;
        graph.off('scale', this.onScale, this);
        graph.off('resize', this.onResize, this);
        graph.off('beforeprint', this.storeScrollPosition, this);
        graph.off('beforeexport', this.storeScrollPosition, this);
        graph.off('afterprint', this.restoreScrollPosition, this);
        graph.off('afterexport', this.restoreScrollPosition, this);
        graph.off('render:done', this.onRenderDone, this);
        graph.off('unfreeze', this.onUpdate, this);
        model.off('reseted', this.onUpdate, this);
        model.off('cell:added', this.onUpdate, this);
        model.off('cell:removed', this.onUpdate, this);
        model.off('cell:changed', this.onUpdate, this);
        model.off('batch:stop', this.onBatchStop, this);
        this.undelegateBackgroundEvents();
    }
    enableAutoResize() {
        this.options.autoResize = true;
    }
    disableAutoResize() {
        this.options.autoResize = false;
    }
    onUpdate() {
        if (this.graph.isAsync() || !this.options.autoResize) {
            return;
        }
        this.update();
    }
    onBatchStop(args) {
        if (this.graph.isAsync() || !this.options.autoResize) {
            return;
        }
        if (Renderer.UPDATE_DELAYING_BATCHES.includes(args.name)) {
            this.update();
        }
    }
    delegateBackgroundEvents(events) {
        const evts = events || GraphView.events;
        this.delegatedHandlers = Object.keys(evts).reduce((memo, name) => {
            const handler = evts[name];
            if (name.indexOf(' ') === -1) {
                if (typeof handler === 'function') {
                    memo[name] = handler;
                }
                else {
                    let method = this.graph.view[handler];
                    if (typeof method === 'function') {
                        method = method.bind(this.graph.view);
                        memo[name] = method;
                    }
                }
            }
            return memo;
        }, {});
        this.onBackgroundEvent = this.onBackgroundEvent.bind(this);
        Object.keys(this.delegatedHandlers).forEach((name) => {
            this.delegateEvent(name, {
                guarded: false,
            }, this.onBackgroundEvent);
        });
    }
    undelegateBackgroundEvents() {
        Object.keys(this.delegatedHandlers).forEach((name) => {
            this.undelegateEvent(name, this.onBackgroundEvent);
        });
    }
    onBackgroundEvent(e) {
        let valid = false;
        const target = e.target;
        if (!this.options.pageVisible) {
            const view = this.graph.view;
            valid = view.background === target || view.grid === target;
        }
        else if (this.options.background) {
            valid = this.background === target;
        }
        else {
            valid = this.content === target;
        }
        if (valid) {
            const handler = this.delegatedHandlers[e.type];
            if (typeof handler === 'function') {
                handler.apply(this.graph, arguments); // eslint-disable-line
            }
        }
    }
    onRenderDone({ stats }) {
        if (this.options.autoResize && stats.priority < 2) {
            this.update();
        }
    }
    onResize() {
        if (this.cachedCenterPoint) {
            this.centerPoint(this.cachedCenterPoint.x, this.cachedCenterPoint.y);
            this.updatePageBreak();
        }
    }
    onScale({ sx, sy, ox, oy }) {
        this.updateScale(sx, sy);
        if (ox || oy) {
            this.centerPoint(ox, oy);
            this.updatePageBreak();
        }
        const autoResizeOptions = this.options.autoResizeOptions || this.options.fitTocontentOptions;
        if (typeof autoResizeOptions === 'function') {
            this.update();
        }
    }
    storeScrollPosition() {
        this.cachedScrollLeft = this.container.scrollLeft;
        this.cachedScrollTop = this.container.scrollTop;
    }
    restoreScrollPosition() {
        this.container.scrollLeft = this.cachedScrollLeft;
        this.container.scrollTop = this.cachedScrollTop;
        this.cachedScrollLeft = null;
        this.cachedScrollTop = null;
    }
    storeClientSize() {
        this.cachedClientSize = {
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        };
    }
    restoreClientSize() {
        this.cachedClientSize = null;
    }
    beforeManipulation() {
        if (Platform.IS_IE || Platform.IS_EDGE) {
            this.$container.css('visibility', 'hidden');
        }
    }
    afterManipulation() {
        if (Platform.IS_IE || Platform.IS_EDGE) {
            this.$container.css('visibility', 'visible');
        }
    }
    updatePageSize(width, height) {
        if (width != null) {
            this.options.pageWidth = width;
        }
        if (height != null) {
            this.options.pageHeight = height;
        }
        this.updatePageBreak();
    }
    updatePageBreak() {
        if (this.pageBreak && this.pageBreak.parentNode) {
            this.pageBreak.parentNode.removeChild(this.pageBreak);
        }
        this.pageBreak = null;
        if (this.options.pageVisible && this.options.pageBreak) {
            const graphWidth = this.graph.options.width;
            const graphHeight = this.graph.options.height;
            const pageWidth = this.options.pageWidth * this.sx;
            const pageHeight = this.options.pageHeight * this.sy;
            if (pageWidth === 0 || pageHeight === 0) {
                return;
            }
            if (graphWidth > pageWidth || graphHeight > pageHeight) {
                let hasPageBreak = false;
                const container = document.createElement('div');
                for (let i = 1, l = Math.floor(graphWidth / pageWidth); i < l; i += 1) {
                    this.$('<div/>')
                        .addClass(this.prefixClassName(`graph-pagebreak-vertical`))
                        .css({ left: i * pageWidth })
                        .appendTo(container);
                    hasPageBreak = true;
                }
                for (let i = 1, l = Math.floor(graphHeight / pageHeight); i < l; i += 1) {
                    this.$('<div/>')
                        .addClass(this.prefixClassName(`graph-pagebreak-horizontal`))
                        .css({ top: i * pageHeight })
                        .appendTo(container);
                    hasPageBreak = true;
                }
                if (hasPageBreak) {
                    Dom.addClass(container, this.prefixClassName('graph-pagebreak'));
                    this.$(this.graph.view.grid).after(container);
                    this.pageBreak = container;
                }
            }
        }
    }
    update() {
        const size = this.getClientSize();
        this.cachedCenterPoint = this.clientToLocalPoint(size.width / 2, size.height / 2);
        let resizeOptions = this.options.autoResizeOptions || this.options.fitTocontentOptions;
        if (typeof resizeOptions === 'function') {
            resizeOptions = FunctionExt.call(resizeOptions, this, this);
        }
        const options = Object.assign({ gridWidth: this.options.pageWidth, gridHeight: this.options.pageHeight, allowNewOrigin: 'negative', contentArea: this.calcContextArea(resizeOptions) }, resizeOptions);
        this.graph.fitToContent(this.getFitToContentOptions(options));
    }
    calcContextArea(resizeOptions) {
        const direction = resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.direction;
        if (!direction) {
            return this.graph.transform.getContentArea(resizeOptions);
        }
        function getCellBBox(cell) {
            let rect = cell.getBBox();
            if (rect) {
                if (cell.isNode()) {
                    const angle = cell.getAngle();
                    if (angle != null && angle !== 0) {
                        rect = rect.bbox(angle);
                    }
                }
            }
            return rect;
        }
        const gridWidth = this.options.pageWidth || 1;
        const gridHeight = this.options.pageHeight || 1;
        let calculativeCells = this.graph.getCells();
        if (!direction.includes('top')) {
            calculativeCells = calculativeCells.filter((cell) => {
                const bbox = getCellBBox(cell);
                return bbox.y >= 0;
            });
        }
        if (!direction.includes('left')) {
            calculativeCells = calculativeCells.filter((cell) => {
                const bbox = getCellBBox(cell);
                return bbox.x >= 0;
            });
        }
        if (!direction.includes('right')) {
            calculativeCells = calculativeCells.filter((cell) => {
                const bbox = getCellBBox(cell);
                return bbox.x + bbox.width <= gridWidth;
            });
        }
        if (!direction.includes('bottom')) {
            calculativeCells = calculativeCells.filter((cell) => {
                const bbox = getCellBBox(cell);
                return bbox.y + bbox.height <= gridHeight;
            });
        }
        return this.model.getCellsBBox(calculativeCells) || new Rectangle();
    }
    getFitToContentOptions(options) {
        const sx = this.sx;
        const sy = this.sy;
        options.gridWidth && (options.gridWidth *= sx);
        options.gridHeight && (options.gridHeight *= sy);
        options.minWidth && (options.minWidth *= sx);
        options.minHeight && (options.minHeight *= sy);
        if (typeof options.padding === 'object') {
            options.padding = {
                left: (options.padding.left || 0) * sx,
                right: (options.padding.right || 0) * sx,
                top: (options.padding.top || 0) * sy,
                bottom: (options.padding.bottom || 0) * sy,
            };
        }
        else if (typeof options.padding === 'number') {
            options.padding *= sx;
        }
        if (!this.options.autoResize) {
            options.contentArea = Rectangle.create();
        }
        return options;
    }
    updateScale(sx, sy) {
        const options = this.graph.options;
        const dx = sx / this.sx;
        const dy = sy / this.sy;
        this.sx = sx;
        this.sy = sy;
        this.graph.translate(options.x * dx, options.y * dy);
        this.graph.resizeGraph(options.width * dx, options.height * dy);
    }
    scrollbarPosition(left, top, options) {
        if (left == null && top == null) {
            return {
                left: this.container.scrollLeft,
                top: this.container.scrollTop,
            };
        }
        const prop = {};
        if (typeof left === 'number') {
            prop.scrollLeft = left;
        }
        if (typeof top === 'number') {
            prop.scrollTop = top;
        }
        if (options && options.animation) {
            this.$container.animate(prop, options.animation);
        }
        else {
            this.$container.prop(prop);
        }
        return this;
    }
    /**
     * Try to scroll to ensure that the position (x,y) on the graph (in local
     * coordinates) is at the center of the viewport. If only one of the
     * coordinates is specified, only scroll in the specified dimension and
     * keep the other coordinate unchanged.
     */
    scrollToPoint(x, y, options) {
        const size = this.getClientSize();
        const ctm = this.graph.matrix();
        const prop = {};
        if (typeof x === 'number') {
            prop.scrollLeft = x - size.width / 2 + ctm.e + (this.padding.left || 0);
        }
        if (typeof y === 'number') {
            prop.scrollTop = y - size.height / 2 + ctm.f + (this.padding.top || 0);
        }
        if (options && options.animation) {
            this.$container.animate(prop, options.animation);
        }
        else {
            this.$container.prop(prop);
        }
        return this;
    }
    /**
     * Try to scroll to ensure that the center of graph content is at the
     * center of the viewport.
     */
    scrollToContent(options) {
        const sx = this.sx;
        const sy = this.sy;
        const center = this.graph.getContentArea().getCenter();
        return this.scrollToPoint(center.x * sx, center.y * sy, options);
    }
    /**
     * Try to scroll to ensure that the center of cell is at the center of
     * the viewport.
     */
    scrollToCell(cell, options) {
        const sx = this.sx;
        const sy = this.sy;
        const center = cell.getBBox().getCenter();
        return this.scrollToPoint(center.x * sx, center.y * sy, options);
    }
    /**
     * The center methods are more aggressive than the scroll methods. These
     * methods position the graph so that a specific point on the graph lies
     * at the center of the viewport, adding paddings around the paper if
     * necessary (e.g. if the requested point lies in a corner of the paper).
     * This means that the requested point will always move into the center
     * of the viewport. (Use the scroll functions to avoid adding paddings
     * and only scroll the viewport as far as the graph boundary.)
     */
    /**
     * Position the center of graph to the center of the viewport.
     */
    center(optons) {
        return this.centerPoint(optons);
    }
    centerPoint(x, y, options) {
        const ctm = this.graph.matrix();
        const sx = ctm.a;
        const sy = ctm.d;
        const tx = -ctm.e;
        const ty = -ctm.f;
        const tWidth = tx + this.graph.options.width;
        const tHeight = ty + this.graph.options.height;
        let localOptions;
        this.storeClientSize(); // avoid multilple reflow
        if (typeof x === 'number' || typeof y === 'number') {
            localOptions = options;
            const visibleCenter = this.getVisibleArea().getCenter();
            if (typeof x === 'number') {
                x *= sx; // eslint-disable-line
            }
            else {
                x = visibleCenter.x; // eslint-disable-line
            }
            if (typeof y === 'number') {
                y *= sy; // eslint-disable-line
            }
            else {
                y = visibleCenter.y; // eslint-disable-line
            }
        }
        else {
            localOptions = x;
            x = (tx + tWidth) / 2; // eslint-disable-line
            y = (ty + tHeight) / 2; // eslint-disable-line
        }
        if (localOptions && localOptions.padding) {
            return this.positionPoint({ x, y }, '50%', '50%', localOptions);
        }
        const padding = this.getPadding();
        const clientSize = this.getClientSize();
        const cx = clientSize.width / 2;
        const cy = clientSize.height / 2;
        const left = cx - padding.left - x + tx;
        const right = cx - padding.right + x - tWidth;
        const top = cy - padding.top - y + ty;
        const bottom = cy - padding.bottom + y - tHeight;
        this.addPadding(Math.max(left, 0), Math.max(right, 0), Math.max(top, 0), Math.max(bottom, 0));
        const result = this.scrollToPoint(x, y, localOptions || undefined);
        this.restoreClientSize();
        return result;
    }
    centerContent(options) {
        return this.positionContent('center', options);
    }
    centerCell(cell, options) {
        return this.positionCell(cell, 'center', options);
    }
    /**
     * The position methods are a more general version of the center methods.
     * They position the graph so that a specific point on the graph lies at
     * requested coordinates inside the viewport.
     */
    /**
     *
     */
    positionContent(pos, options) {
        const rect = this.graph.getContentArea(options);
        return this.positionRect(rect, pos, options);
    }
    positionCell(cell, pos, options) {
        const bbox = cell.getBBox();
        return this.positionRect(bbox, pos, options);
    }
    positionRect(rect, pos, options) {
        const bbox = Rectangle.create(rect);
        switch (pos) {
            case 'center':
                return this.positionPoint(bbox.getCenter(), '50%', '50%', options);
            case 'top':
                return this.positionPoint(bbox.getTopCenter(), '50%', 0, options);
            case 'top-right':
                return this.positionPoint(bbox.getTopRight(), '100%', 0, options);
            case 'right':
                return this.positionPoint(bbox.getRightMiddle(), '100%', '50%', options);
            case 'bottom-right':
                return this.positionPoint(bbox.getBottomRight(), '100%', '100%', options);
            case 'bottom':
                return this.positionPoint(bbox.getBottomCenter(), '50%', '100%', options);
            case 'bottom-left':
                return this.positionPoint(bbox.getBottomLeft(), 0, '100%', options);
            case 'left':
                return this.positionPoint(bbox.getLeftMiddle(), 0, '50%', options);
            case 'top-left':
                return this.positionPoint(bbox.getTopLeft(), 0, 0, options);
            default:
                return this;
        }
    }
    positionPoint(point, x, y, options = {}) {
        const { padding: pad } = options, localOptions = __rest(options, ["padding"]);
        const padding = NumberExt.normalizeSides(pad);
        const clientRect = Rectangle.fromSize(this.getClientSize());
        const targetRect = clientRect.clone().moveAndExpand({
            x: padding.left,
            y: padding.top,
            width: -padding.right - padding.left,
            height: -padding.top - padding.bottom,
        });
        // eslint-disable-next-line
        x = NumberExt.normalizePercentage(x, Math.max(0, targetRect.width));
        if (x < 0) {
            x = targetRect.width + x; // eslint-disable-line
        }
        // eslint-disable-next-line
        y = NumberExt.normalizePercentage(y, Math.max(0, targetRect.height));
        if (y < 0) {
            y = targetRect.height + y; // eslint-disable-line
        }
        const origin = targetRect.getTopLeft().translate(x, y);
        const diff = clientRect.getCenter().diff(origin);
        const scale = this.zoom();
        const rawDiff = diff.scale(1 / scale, 1 / scale);
        const result = Point.create(point).translate(rawDiff);
        return this.centerPoint(result.x, result.y, localOptions);
    }
    zoom(factor, options) {
        if (factor == null) {
            return this.sx;
        }
        options = options || {}; // eslint-disable-line
        let cx;
        let cy;
        const clientSize = this.getClientSize();
        const center = this.clientToLocalPoint(clientSize.width / 2, clientSize.height / 2);
        let sx = factor;
        let sy = factor;
        if (!options.absolute) {
            sx += this.sx;
            sy += this.sy;
        }
        if (options.scaleGrid) {
            sx = Math.round(sx / options.scaleGrid) * options.scaleGrid;
            sy = Math.round(sy / options.scaleGrid) * options.scaleGrid;
        }
        if (options.maxScale) {
            sx = Math.min(options.maxScale, sx);
            sy = Math.min(options.maxScale, sy);
        }
        if (options.minScale) {
            sx = Math.max(options.minScale, sx);
            sy = Math.max(options.minScale, sy);
        }
        sx = this.graph.transform.clampScale(sx);
        sy = this.graph.transform.clampScale(sy);
        if (options.center) {
            const fx = sx / this.sx;
            const fy = sy / this.sy;
            cx = options.center.x - (options.center.x - center.x) / fx;
            cy = options.center.y - (options.center.y - center.y) / fy;
        }
        else {
            cx = center.x;
            cy = center.y;
        }
        this.beforeManipulation();
        this.graph.transform.scale(sx, sy);
        this.centerPoint(cx, cy);
        this.afterManipulation();
        return this;
    }
    zoomToRect(rect, options = {}) {
        const area = Rectangle.create(rect);
        const graph = this.graph;
        options.contentArea = area;
        if (options.viewportArea == null) {
            options.viewportArea = {
                x: graph.options.x,
                y: graph.options.y,
                width: this.$container.width(),
                height: this.$container.height(),
            };
        }
        this.beforeManipulation();
        graph.transform.scaleContentToFitImpl(options, false);
        const center = area.getCenter();
        this.centerPoint(center.x, center.y);
        this.afterManipulation();
        return this;
    }
    zoomToFit(options = {}) {
        return this.zoomToRect(this.graph.getContentArea(options), options);
    }
    transitionToPoint(x, y, options) {
        if (typeof x === 'object') {
            options = y; // eslint-disable-line
            y = x.y; // eslint-disable-line
            x = x.x; // eslint-disable-line
        }
        else {
            y = y; // eslint-disable-line
        }
        if (options == null) {
            options = {}; // eslint-disable-line
        }
        let transform;
        let transformOrigin;
        const scale = this.sx;
        const targetScale = Math.max(options.scale || scale, 0.000001);
        const clientSize = this.getClientSize();
        const targetPoint = new Point(x, y);
        const localPoint = this.clientToLocalPoint(clientSize.width / 2, clientSize.height / 2);
        if (scale === targetScale) {
            const translate = localPoint.diff(targetPoint).scale(scale, scale).round();
            transform = `translate(${translate.x}px,${translate.y}px)`;
        }
        else {
            const delta = (targetScale / (scale - targetScale)) * targetPoint.distance(localPoint);
            const range = localPoint.clone().move(targetPoint, delta);
            const origin = this.localToBackgroundPoint(range).round();
            transform = `scale(${targetScale / scale})`;
            transformOrigin = `${origin.x}px ${origin.y}px`;
        }
        const onTransitionEnd = options.onTransitionEnd;
        this.$container.addClass(Util.transitionClassName);
        this.$content
            .off(Util.transitionEventName)
            .on(Util.transitionEventName, (e) => {
            this.syncTransition(targetScale, { x: x, y: y });
            if (typeof onTransitionEnd === 'function') {
                FunctionExt.call(onTransitionEnd, this, e.originalEvent);
            }
        })
            .css({
            transform,
            transformOrigin,
            transition: 'transform',
            transitionDuration: options.duration || '1s',
            transitionDelay: options.delay,
            transitionTimingFunction: options.timing,
        });
        return this;
    }
    syncTransition(scale, p) {
        this.beforeManipulation();
        this.graph.scale(scale);
        this.removeTransition();
        this.centerPoint(p.x, p.y);
        this.afterManipulation();
        return this;
    }
    removeTransition() {
        this.$container.removeClass(Util.transitionClassName);
        this.$content.off(Util.transitionEventName).css({
            transform: '',
            transformOrigin: '',
            transition: '',
            transitionDuration: '',
            transitionDelay: '',
            transitionTimingFunction: '',
        });
        return this;
    }
    transitionToRect(rectangle, options = {}) {
        const rect = Rectangle.create(rectangle);
        const maxScale = options.maxScale || Infinity;
        const minScale = options.minScale || Number.MIN_VALUE;
        const scaleGrid = options.scaleGrid || null;
        const PIXEL_SIZE = options.visibility || 1;
        const center = options.center
            ? Point.create(options.center)
            : rect.getCenter();
        const clientSize = this.getClientSize();
        const w = clientSize.width * PIXEL_SIZE;
        const h = clientSize.height * PIXEL_SIZE;
        let scale = new Rectangle(center.x - w / 2, center.y - h / 2, w, h).getMaxUniformScaleToFit(rect, center);
        scale = Math.min(scale, maxScale);
        if (scaleGrid) {
            scale = Math.floor(scale / scaleGrid) * scaleGrid;
        }
        scale = Math.max(minScale, scale);
        return this.transitionToPoint(center, Object.assign({ scale }, options));
    }
    startPanning(evt) {
        const e = this.normalizeEvent(evt);
        this.clientX = e.clientX;
        this.clientY = e.clientY;
        this.trigger('pan:start', { e });
        this.$(document.body).on({
            'mousemove.panning touchmove.panning': this.pan.bind(this),
            'mouseup.panning touchend.panning': this.stopPanning.bind(this),
            'mouseleave.panning': this.stopPanning.bind(this),
        });
        this.$(window).on('mouseup.panning', this.stopPanning.bind(this));
    }
    pan(evt) {
        const e = this.normalizeEvent(evt);
        const dx = e.clientX - this.clientX;
        const dy = e.clientY - this.clientY;
        this.container.scrollTop -= dy;
        this.container.scrollLeft -= dx;
        this.clientX = e.clientX;
        this.clientY = e.clientY;
        this.trigger('panning', { e });
    }
    stopPanning(e) {
        this.$(document.body).off('.panning');
        this.$(window).off('.panning');
        this.trigger('pan:stop', { e });
    }
    clientToLocalPoint(a, b) {
        let x = typeof a === 'object' ? a.x : a;
        let y = typeof a === 'object' ? a.y : b;
        const ctm = this.graph.matrix();
        x += this.container.scrollLeft - this.padding.left - ctm.e;
        y += this.container.scrollTop - this.padding.top - ctm.f;
        return new Point(x / ctm.a, y / ctm.d);
    }
    localToBackgroundPoint(x, y) {
        const p = typeof x === 'object' ? Point.create(x) : new Point(x, y);
        const ctm = this.graph.matrix();
        const padding = this.padding;
        return Dom.transformPoint(p, ctm).translate(padding.left, padding.top);
    }
    resize(width, height) {
        let w = width != null ? width : this.container.offsetWidth;
        let h = height != null ? height : this.container.offsetHeight;
        if (typeof w === 'number') {
            w = Math.round(w);
        }
        if (typeof h === 'number') {
            h = Math.round(h);
        }
        this.options.width = w;
        this.options.height = h;
        this.$container.css({ width: w, height: h });
        this.update();
    }
    getClientSize() {
        if (this.cachedClientSize) {
            return this.cachedClientSize;
        }
        return {
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        };
    }
    autoScroll(clientX, clientY) {
        const buffer = 10;
        const container = this.container;
        const rect = container.getBoundingClientRect();
        let dx = 0;
        let dy = 0;
        if (clientX <= rect.left + buffer) {
            dx = -buffer;
        }
        if (clientY <= rect.top + buffer) {
            dy = -buffer;
        }
        if (clientX >= rect.right - buffer) {
            dx = buffer;
        }
        if (clientY >= rect.bottom - buffer) {
            dy = buffer;
        }
        if (dx !== 0) {
            container.scrollLeft += dx;
        }
        if (dy !== 0) {
            container.scrollTop += dy;
        }
        return {
            scrollerX: dx,
            scrollerY: dy,
        };
    }
    addPadding(left, right, top, bottom) {
        let padding = this.getPadding();
        this.padding = {
            left: Math.round(padding.left + (left || 0)),
            top: Math.round(padding.top + (top || 0)),
            bottom: Math.round(padding.bottom + (bottom || 0)),
            right: Math.round(padding.right + (right || 0)),
        };
        padding = this.padding;
        this.$content.css({
            width: padding.left + this.graph.options.width + padding.right,
            height: padding.top + this.graph.options.height + padding.bottom,
        });
        const container = this.graph.container;
        container.style.left = `${this.padding.left}px`;
        container.style.top = `${this.padding.top}px`;
        return this;
    }
    getPadding() {
        const padding = this.options.padding;
        if (typeof padding === 'function') {
            return NumberExt.normalizeSides(FunctionExt.call(padding, this, this));
        }
        return NumberExt.normalizeSides(padding);
    }
    /**
     * Returns the untransformed size and origin of the current viewport.
     */
    getVisibleArea() {
        const ctm = this.graph.matrix();
        const size = this.getClientSize();
        const box = {
            x: this.container.scrollLeft || 0,
            y: this.container.scrollTop || 0,
            width: size.width,
            height: size.height,
        };
        const area = Dom.transformRectangle(box, ctm.inverse());
        area.x -= (this.padding.left || 0) / this.sx;
        area.y -= (this.padding.top || 0) / this.sy;
        return area;
    }
    isCellVisible(cell, options = {}) {
        const bbox = cell.getBBox();
        const area = this.getVisibleArea();
        return options.strict
            ? area.containsRect(bbox)
            : area.isIntersectWithRect(bbox);
    }
    isPointVisible(point) {
        return this.getVisibleArea().containsPoint(point);
    }
    /**
     * Lock the current viewport by disabling user scrolling.
     */
    lock() {
        this.$container.css('overflow', 'hidden');
        return this;
    }
    /**
     * Enable user scrolling if previously locked.
     */
    unlock() {
        this.$container.css('overflow', 'scroll');
        return this;
    }
    onRemove() {
        this.stopListening();
    }
    dispose() {
        this.$(this.graph.container).insertBefore(this.$container);
        this.remove();
    }
}
__decorate([
    View.dispose()
], Scroller.prototype, "dispose", null);
(function (Scroller) {
    class Background extends BackgroundManager {
        constructor(scroller) {
            super(scroller.graph);
            this.scroller = scroller;
            if (scroller.options.background) {
                this.draw(scroller.options.background);
            }
        }
        get elem() {
            return this.scroller.background;
        }
        init() {
            this.graph.on('scale', this.update, this);
            this.graph.on('translate', this.update, this);
        }
        updateBackgroundOptions(options) {
            this.scroller.options.background = options;
        }
    }
    Scroller.Background = Background;
})(Scroller || (Scroller = {}));
var Util;
(function (Util) {
    Util.containerClass = 'graph-scroller';
    Util.panningClass = `${Util.containerClass}-panning`;
    Util.pannableClass = `${Util.containerClass}-pannable`;
    Util.pagedClass = `${Util.containerClass}-paged`;
    Util.contentClass = `${Util.containerClass}-content`;
    Util.backgroundClass = `${Util.containerClass}-background`;
    Util.transitionClassName = 'transition-in-progress';
    Util.transitionEventName = 'transitionend.graph-scroller-transition';
    Util.defaultOptions = {
        padding() {
            const size = this.getClientSize();
            const minWidth = Math.max(this.options.minVisibleWidth || 0, 1) || 1;
            const minHeight = Math.max(this.options.minVisibleHeight || 0, 1) || 1;
            const left = Math.max(size.width - minWidth, 0);
            const top = Math.max(size.height - minHeight, 0);
            return { left, top, right: left, bottom: top };
        },
        minVisibleWidth: 50,
        minVisibleHeight: 50,
        pageVisible: false,
        pageBreak: false,
        autoResize: true,
    };
    function getOptions(options) {
        const result = ObjectExt.merge({}, Util.defaultOptions, options);
        if (result.pageWidth == null) {
            result.pageWidth = options.graph.options.width;
        }
        if (result.pageHeight == null) {
            result.pageHeight = options.graph.options.height;
        }
        return result;
    }
    Util.getOptions = getOptions;
})(Util || (Util = {}));
//# sourceMappingURL=index.js.map