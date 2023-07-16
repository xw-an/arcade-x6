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
exports.Renderer = void 0;
var util_1 = require("../util");
var geometry_1 = require("../geometry");
var model_1 = require("../model");
var view_1 = require("../view");
var base_1 = require("./base");
var Renderer = /** @class */ (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Renderer.prototype.init = function () {
        this.resetUpdates();
        this.startListening();
        // Renders existing cells in the model.
        this.resetViews(this.model.getCells());
        // Starts rendering loop.
        if (!this.isFrozen() && this.isAsync()) {
            this.updateViewsAsync();
        }
    };
    Renderer.prototype.startListening = function () {
        this.model.on('sorted', this.onSortModel, this);
        this.model.on('reseted', this.onModelReseted, this);
        this.model.on('batch:stop', this.onBatchStop, this);
        this.model.on('cell:added', this.onCellAdded, this);
        this.model.on('cell:removed', this.onCellRemoved, this);
        this.model.on('cell:change:zIndex', this.onCellZIndexChanged, this);
        this.model.on('cell:change:visible', this.onCellVisibleChanged, this);
    };
    Renderer.prototype.stopListening = function () {
        this.model.off('sorted', this.onSortModel, this);
        this.model.off('reseted', this.onModelReseted, this);
        this.model.off('batch:stop', this.onBatchStop, this);
        this.model.off('cell:added', this.onCellAdded, this);
        this.model.off('cell:removed', this.onCellRemoved, this);
        this.model.off('cell:change:zIndex', this.onCellZIndexChanged, this);
        this.model.off('cell:change:visible', this.onCellVisibleChanged, this);
    };
    Renderer.prototype.resetUpdates = function () {
        this.updates = {
            priorities: [{}, {}, {}],
            mounted: {},
            mountedCids: [],
            unmounted: {},
            unmountedCids: [],
            count: 0,
            sort: false,
            frozen: false,
            freezeKey: null,
            animationId: null,
        };
    };
    Renderer.prototype.onSortModel = function () {
        if (this.model.hasActiveBatch(Renderer.SORT_DELAYING_BATCHES)) {
            return;
        }
        this.sortViews();
    };
    Renderer.prototype.onModelReseted = function (_a) {
        var options = _a.options;
        this.removeZPivots();
        this.resetViews(this.model.getCells(), options);
    };
    Renderer.prototype.onBatchStop = function (_a) {
        var name = _a.name, data = _a.data;
        if (this.isFrozen()) {
            return;
        }
        var model = this.model;
        if (!this.isAsync()) {
            var updateDelayingBatches = Renderer.UPDATE_DELAYING_BATCHES;
            if (updateDelayingBatches.includes(name) &&
                !model.hasActiveBatch(updateDelayingBatches)) {
                this.updateViews(data);
            }
        }
        var sortDelayingBatches = Renderer.SORT_DELAYING_BATCHES;
        if (sortDelayingBatches.includes(name) &&
            !model.hasActiveBatch(sortDelayingBatches)) {
            this.sortViews();
        }
    };
    Renderer.prototype.onCellAdded = function (_a) {
        var cell = _a.cell, options = _a.options;
        var position = options.position;
        if (this.isAsync() || typeof position !== 'number') {
            this.renderView(cell, options);
        }
        else {
            if (options.maxPosition === position) {
                this.freeze({ key: 'addCells' });
            }
            this.renderView(cell, options);
            if (position === 0) {
                this.unfreeze({ key: 'addCells' });
            }
        }
    };
    Renderer.prototype.onCellRemoved = function (_a) {
        var cell = _a.cell, options = _a.options;
        var view = this.findViewByCell(cell);
        if (view) {
            this.requestViewUpdate(view, Renderer.FLAG_REMOVE, view.priority, options);
        }
    };
    Renderer.prototype.onCellZIndexChanged = function (_a) {
        var cell = _a.cell, options = _a.options;
        if (this.options.sorting === 'approx') {
            var view = this.findViewByCell(cell);
            if (view) {
                this.requestViewUpdate(view, Renderer.FLAG_INSERT, view.priority, options);
            }
        }
    };
    Renderer.prototype.onCellVisibleChanged = function (_a) {
        var cell = _a.cell, visible = _a.current, options = _a.options;
        // Hide connected edges before cell
        if (!visible) {
            this.processEdgeOnTerminalVisibleChanged(cell, false);
        }
        var view = this.findViewByCell(cell);
        if (!visible && view) {
            this.removeView(cell);
        }
        else if (visible && view == null) {
            this.renderView(cell, options);
        }
        // Show connected edges after cell rendered
        if (visible) {
            this.processEdgeOnTerminalVisibleChanged(cell, true);
        }
        // this.sortViews()
    };
    Renderer.prototype.processEdgeOnTerminalVisibleChanged = function (node, visible) {
        var getOpposite = function (edge, currentTerminal) {
            var sourceId = edge.getSourceCellId();
            if (sourceId !== currentTerminal.id) {
                return edge.getSourceCell();
            }
            var targetId = edge.getTargetCellId();
            if (targetId !== currentTerminal.id) {
                return edge.getTargetCell();
            }
            return null;
        };
        this.model.getConnectedEdges(node).forEach(function (edge) {
            var opposite = getOpposite(edge, node);
            if (opposite == null || opposite.isVisible()) {
                visible ? edge.show() : edge.hide();
            }
        });
    };
    Renderer.prototype.isEdgeTerminalVisible = function (edge, terminal) {
        var cellId = terminal === 'source' ? edge.getSourceCellId() : edge.getTargetCellId();
        var cell = cellId ? this.model.getCell(cellId) : null;
        if (cell && !cell.isVisible()) {
            return false;
        }
        return true;
    };
    Renderer.prototype.requestConnectedEdgesUpdate = function (view, options) {
        if (options === void 0) { options = {}; }
        if (view_1.CellView.isCellView(view)) {
            var cell = view.cell;
            var edges = this.model.getConnectedEdges(cell);
            for (var j = 0, n = edges.length; j < n; j += 1) {
                var edge = edges[j];
                var edgeView = this.findViewByCell(edge);
                if (!edgeView) {
                    continue;
                }
                var flagLabels = ['update'];
                if (edge.getTargetCell() === cell) {
                    flagLabels.push('target');
                }
                if (edge.getSourceCell() === cell) {
                    flagLabels.push('source');
                }
                this.scheduleViewUpdate(edgeView, edgeView.getFlag(flagLabels), edgeView.priority, options);
            }
        }
    };
    Renderer.prototype.forcePostponedViewUpdate = function (view, flag) {
        if (!view || !view_1.CellView.isCellView(view)) {
            return false;
        }
        var cell = view.cell;
        if (cell.isNode()) {
            return false;
        }
        var edgeView = view;
        if (cell.isEdge() && (flag & view.getFlag(['source', 'target'])) === 0) {
            // EdgeView is waiting for the source/target cellView to be rendered.
            // This can happen when the cells are not in the viewport.
            var sourceFlag = 0;
            var sourceView = this.findViewByCell(cell.getSourceCell());
            if (sourceView && !this.isViewMounted(sourceView)) {
                sourceFlag = this.dumpView(sourceView);
                edgeView.updateTerminalMagnet('source');
            }
            var targetFlag = 0;
            var targetView = this.findViewByCell(cell.getTargetCell());
            if (targetView && !this.isViewMounted(targetView)) {
                targetFlag = this.dumpView(targetView);
                edgeView.updateTerminalMagnet('target');
            }
            if (sourceFlag === 0 && targetFlag === 0) {
                // If leftover flag is 0, all view updates were done.
                return !this.dumpView(edgeView);
            }
        }
        return false;
    };
    Renderer.prototype.scheduleViewUpdate = function (view, flag, priority, options) {
        if (options === void 0) { options = {}; }
        var cid = view.cid;
        var updates = this.updates;
        var cache = updates.priorities[priority];
        if (!cache) {
            cache = updates.priorities[priority] = {};
        }
        var currentFlag = cache[cid] || 0;
        if ((currentFlag & flag) === flag) {
            return;
        }
        if (!currentFlag) {
            updates.count += 1;
        }
        if (flag & Renderer.FLAG_REMOVE && currentFlag & Renderer.FLAG_INSERT) {
            // When a view is removed we need to remove the
            // insert flag as this is a reinsert.
            cache[cid] ^= Renderer.FLAG_INSERT;
        }
        else if (flag & Renderer.FLAG_INSERT &&
            currentFlag & Renderer.FLAG_REMOVE) {
            // When a view is added we need to remove the remove
            // flag as this is view was previously removed.
            cache[cid] ^= Renderer.FLAG_REMOVE;
        }
        cache[cid] |= flag;
        this.graph.hook.onViewUpdated(view, flag, options);
    };
    Renderer.prototype.requestViewUpdate = function (view, flag, priority, options) {
        if (options === void 0) { options = {}; }
        this.scheduleViewUpdate(view, flag, priority, options);
        var isAsync = this.isAsync();
        if (this.isFrozen() ||
            (isAsync && options.async !== false) ||
            this.model.hasActiveBatch(Renderer.UPDATE_DELAYING_BATCHES)) {
            return;
        }
        var stats = this.updateViews(options);
        if (isAsync) {
            this.graph.trigger('render:done', { stats: stats, options: options });
        }
    };
    /**
     * Adds view into the DOM and update it.
     */
    Renderer.prototype.dumpView = function (view, options) {
        if (options === void 0) { options = {}; }
        if (view == null) {
            return 0;
        }
        var cid = view.cid;
        var updates = this.updates;
        var cache = updates.priorities[view.priority];
        var flag = this.registerMountedView(view) | cache[cid];
        delete cache[cid];
        if (!flag) {
            return 0;
        }
        return this.updateView(view, flag, options);
    };
    /**
     * Adds all views into the DOM and update them.
     */
    Renderer.prototype.dumpViews = function (options) {
        if (options === void 0) { options = {}; }
        this.checkView(options);
        this.updateViews(options);
    };
    /**
     * Ensure the view associated with the cell is attached
     * to the DOM and updated.
     */
    Renderer.prototype.requireView = function (cell, options) {
        if (options === void 0) { options = {}; }
        var view = this.findViewByCell(cell);
        if (view == null) {
            return null;
        }
        this.dumpView(view, options);
        return view;
    };
    Renderer.prototype.updateView = function (view, flag, options) {
        if (options === void 0) { options = {}; }
        if (view == null) {
            return 0;
        }
        if (view_1.CellView.isCellView(view)) {
            if (flag & Renderer.FLAG_REMOVE) {
                this.removeView(view.cell);
                return 0;
            }
            if (flag & Renderer.FLAG_INSERT) {
                this.insertView(view);
                flag ^= Renderer.FLAG_INSERT; // eslint-disable-line
            }
        }
        if (!flag) {
            return 0;
        }
        return view.confirmUpdate(flag, options);
    };
    Renderer.prototype.updateViews = function (options) {
        if (options === void 0) { options = {}; }
        var result;
        var batchCount = 0;
        var updatedCount = 0;
        var priority = Renderer.MIN_PRIORITY;
        do {
            result = this.updateViewsBatch(options);
            batchCount += 1;
            updatedCount += result.updatedCount;
            priority = Math.min(result.priority, priority);
        } while (!result.empty);
        return {
            priority: priority,
            batchCount: batchCount,
            updatedCount: updatedCount,
        };
    };
    Renderer.prototype.updateViewsBatch = function (options) {
        if (options === void 0) { options = {}; }
        var updates = this.updates;
        var priorities = updates.priorities;
        var batchSize = options.batchSize || Renderer.UPDATE_BATCH_SIZE;
        var empty = true;
        var priority = Renderer.MIN_PRIORITY;
        var mountedCount = 0;
        var unmountedCount = 0;
        var updatedCount = 0;
        var postponedCount = 0;
        var checkView = options.checkView || this.options.checkView;
        if (typeof checkView !== 'function') {
            checkView = null;
        }
        // eslint-disable-next-line
        main: for (var p = 0, n = priorities.length; p < n; p += 1) {
            var cache = priorities[p];
            // eslint-disable-next-line
            for (var cid in cache) {
                if (updatedCount >= batchSize) {
                    empty = false; // goto next batch
                    break main; // eslint-disable-line no-labels
                }
                var view = view_1.View.views[cid];
                if (!view) {
                    delete cache[cid];
                    continue;
                }
                var currentFlag = cache[cid];
                // Do not check a view for viewport if we are about to remove the view.
                if ((currentFlag & Renderer.FLAG_REMOVE) === 0) {
                    var isUnmounted = cid in updates.unmounted;
                    if (checkView &&
                        !util_1.FunctionExt.call(checkView, this.graph, {
                            view: view,
                            unmounted: isUnmounted,
                        })) {
                        // Unmount view
                        if (!isUnmounted) {
                            this.registerUnmountedView(view);
                            view.unmount();
                        }
                        updates.unmounted[cid] |= currentFlag;
                        delete cache[cid];
                        unmountedCount += 1;
                        continue;
                    }
                    // Mount view
                    if (isUnmounted) {
                        currentFlag |= Renderer.FLAG_INSERT;
                        mountedCount += 1;
                    }
                    currentFlag |= this.registerMountedView(view);
                }
                var cellView = view;
                var leftoverFlag = this.updateView(view, currentFlag, options);
                if (leftoverFlag > 0) {
                    var cell = cellView.cell;
                    if (cell && cell.isEdge()) {
                        // remove edge view when source cell is invisible
                        if (cellView.hasAction(leftoverFlag, 'source') &&
                            !this.isEdgeTerminalVisible(cell, 'source')) {
                            leftoverFlag = cellView.removeAction(leftoverFlag, 'source');
                            leftoverFlag |= Renderer.FLAG_REMOVE;
                        }
                        // remove edge view when target cell is invisible
                        if (cellView.hasAction(leftoverFlag, 'target') &&
                            !this.isEdgeTerminalVisible(cell, 'target')) {
                            leftoverFlag = cellView.removeAction(leftoverFlag, 'target');
                            leftoverFlag |= Renderer.FLAG_REMOVE;
                        }
                    }
                }
                if (leftoverFlag > 0) {
                    // update has not finished
                    cache[cid] = leftoverFlag;
                    if (!this.graph.hook.onViewPostponed(cellView, leftoverFlag, options) ||
                        cache[cid]) {
                        postponedCount += 1;
                        empty = false;
                        continue;
                    }
                }
                if (priority > p) {
                    priority = p;
                }
                updatedCount += 1;
                delete cache[cid];
            }
        }
        return {
            empty: empty,
            priority: priority,
            mountedCount: mountedCount,
            unmountedCount: unmountedCount,
            updatedCount: updatedCount,
            postponedCount: postponedCount,
        };
    };
    Renderer.prototype.updateViewsAsync = function (options, data) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (data === void 0) { data = {
            processed: 0,
            priority: Renderer.MIN_PRIORITY,
        }; }
        var updates = this.updates;
        var animationId = updates.animationId;
        if (animationId) {
            util_1.Dom.cancelAnimationFrame(animationId);
            if (data.processed === 0) {
                var beforeFn = options.before;
                if (typeof beforeFn === 'function') {
                    util_1.FunctionExt.call(beforeFn, this.graph, this.graph);
                }
            }
            var stats = this.updateViewsBatch(options);
            var checkout = this.checkViewImpl({
                checkView: options.checkView,
                mountedBatchSize: Renderer.MOUNT_BATCH_SIZE - stats.mountedCount,
                unmountedBatchSize: Renderer.MOUNT_BATCH_SIZE - stats.unmountedCount,
            });
            var processed = data.processed;
            var total = updates.count;
            var mountedCount = checkout.mountedCount;
            var unmountedCount = checkout.unmountedCount;
            if (stats.updatedCount > 0) {
                // Some updates have been just processed
                processed += stats.updatedCount + stats.unmountedCount;
                data.priority = Math.min(stats.priority, data.priority);
                if (stats.empty && mountedCount === 0) {
                    stats.priority = data.priority;
                    stats.mountedCount += mountedCount;
                    stats.unmountedCount += unmountedCount;
                    this.graph.trigger('render:done', { stats: stats, options: options });
                    data.processed = 0;
                    updates.count = 0;
                }
                else {
                    data.processed = processed;
                }
            }
            // Progress callback
            var progressFn = options.progress;
            if (total && typeof progressFn === 'function') {
                util_1.FunctionExt.call(progressFn, this.graph, {
                    total: total,
                    done: stats.empty,
                    current: processed,
                });
            }
            // The current frame could have been canceled in a callback
            if (updates.animationId !== animationId) {
                return;
            }
        }
        updates.animationId = util_1.Dom.requestAnimationFrame(function () {
            _this.updateViewsAsync(options, data);
        });
    };
    Renderer.prototype.registerMountedView = function (view) {
        var cid = view.cid;
        var updates = this.updates;
        if (cid in updates.mounted) {
            return 0;
        }
        updates.mounted[cid] = true;
        updates.mountedCids.push(cid);
        var flag = updates.unmounted[cid] || 0;
        delete updates.unmounted[cid];
        return flag;
    };
    Renderer.prototype.registerUnmountedView = function (view) {
        var cid = view.cid;
        var updates = this.updates;
        if (cid in updates.unmounted) {
            return 0;
        }
        updates.unmounted[cid] |= Renderer.FLAG_INSERT;
        var flag = updates.unmounted[cid];
        updates.unmountedCids.push(cid);
        delete updates.mounted[cid];
        return flag;
    };
    Renderer.prototype.isViewMounted = function (view) {
        if (view == null) {
            return false;
        }
        var cid = view.cid;
        return cid in this.updates.mounted;
    };
    Renderer.prototype.getMountedViews = function () {
        return Object.keys(this.updates.mounted).map(function (cid) { return view_1.CellView.views[cid]; });
    };
    Renderer.prototype.getUnmountedViews = function () {
        return Object.keys(this.updates.unmounted).map(function (cid) { return view_1.CellView.views[cid]; });
    };
    Renderer.prototype.checkMountedViews = function (viewportFn, batchSize) {
        var unmountCount = 0;
        if (typeof viewportFn !== 'function') {
            return unmountCount;
        }
        var updates = this.updates;
        var mounted = updates.mounted;
        var mountedCids = updates.mountedCids;
        var size = batchSize == null
            ? mountedCids.length
            : Math.min(mountedCids.length, batchSize);
        for (var i = 0; i < size; i += 1) {
            var cid = mountedCids[i];
            if (!(cid in mounted)) {
                continue;
            }
            var view = view_1.CellView.views[cid];
            if (view == null) {
                continue;
            }
            var shouldMount = util_1.FunctionExt.call(viewportFn, this.graph, {
                view: view,
                unmounted: true,
            });
            if (shouldMount) {
                // Push at the end of all mounted ids
                mountedCids.push(cid);
                continue;
            }
            unmountCount += 1;
            var flag = this.registerUnmountedView(view);
            if (flag) {
                view.unmount();
            }
        }
        // Get rid of views, that have been unmounted
        mountedCids.splice(0, size);
        return unmountCount;
    };
    Renderer.prototype.checkUnmountedViews = function (checkView, batchSize) {
        var mountCount = 0;
        if (typeof checkView !== 'function') {
            checkView = null; // eslint-disable-line
        }
        var updates = this.updates;
        var unmounted = updates.unmounted;
        var unmountedCids = updates.unmountedCids;
        var size = batchSize == null
            ? unmountedCids.length
            : Math.min(unmountedCids.length, batchSize);
        for (var i = 0; i < size; i += 1) {
            var cid = unmountedCids[i];
            if (!(cid in unmounted)) {
                continue;
            }
            var view = view_1.CellView.views[cid];
            if (view == null) {
                continue;
            }
            if (checkView &&
                !util_1.FunctionExt.call(checkView, this.graph, { view: view, unmounted: false })) {
                unmountedCids.push(cid);
                continue;
            }
            mountCount += 1;
            var flag = this.registerMountedView(view);
            if (flag) {
                this.scheduleViewUpdate(view, flag, view.priority, {
                    mounting: true,
                });
            }
        }
        // Get rid of views, that have been mounted
        unmountedCids.splice(0, size);
        return mountCount;
    };
    Renderer.prototype.checkViewImpl = function (options) {
        if (options === void 0) { options = {
            mountedBatchSize: Number.MAX_SAFE_INTEGER,
            unmountedBatchSize: Number.MAX_SAFE_INTEGER,
        }; }
        var checkView = options.checkView || this.options.checkView;
        var unmountedCount = this.checkMountedViews(checkView, options.unmountedBatchSize);
        var mountedCount = this.checkUnmountedViews(checkView, 
        // Do not check views, that have been just unmounted
        // and pushed at the end of the cids array
        unmountedCount > 0
            ? Math.min(this.updates.unmountedCids.length - unmountedCount, options.mountedBatchSize)
            : options.mountedBatchSize);
        return { mountedCount: mountedCount, unmountedCount: unmountedCount };
    };
    /**
     * Determine every view in the graph should be attached/detached.
     */
    Renderer.prototype.checkView = function (options) {
        if (options === void 0) { options = {}; }
        return this.checkViewImpl(options);
    };
    Renderer.prototype.isFrozen = function () {
        return !!this.options.frozen;
    };
    /**
     * Freeze the graph then the graph does not automatically re-render upon
     * changes in the graph. This is useful when adding large numbers of cells.
     */
    Renderer.prototype.freeze = function (options) {
        if (options === void 0) { options = {}; }
        var key = options.key;
        var updates = this.updates;
        var frozen = this.options.frozen;
        var freezeKey = updates.freezeKey;
        if (key && key !== freezeKey) {
            if (frozen && freezeKey) {
                // key passed, but the graph is already freezed with another key
                return;
            }
            updates.frozen = frozen;
            updates.freezeKey = key;
        }
        this.options.frozen = true;
        var animationId = updates.animationId;
        updates.animationId = null;
        if (this.isAsync() && animationId != null) {
            util_1.Dom.cancelAnimationFrame(animationId);
        }
        this.graph.trigger('freeze', { key: key });
    };
    Renderer.prototype.unfreeze = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var key = options.key;
        var updates = this.updates;
        var freezeKey = updates.freezeKey;
        // key passed, but the graph is already freezed with another key
        if (key && freezeKey && key !== freezeKey) {
            return;
        }
        updates.freezeKey = null;
        // key passed, but the graph is already freezed
        if (key && key === freezeKey && updates.frozen) {
            return;
        }
        var callback = function () {
            _this.options.frozen = updates.frozen = false;
            if (updates.sort) {
                _this.sortViews();
                updates.sort = false;
            }
            var afterFn = options.after;
            if (afterFn) {
                util_1.FunctionExt.call(afterFn, _this.graph, _this.graph);
            }
            _this.graph.trigger('unfreeze', { key: key });
        };
        if (this.isAsync()) {
            this.freeze();
            var onProgress_1 = options.progress;
            this.updateViewsAsync(__assign(__assign({}, options), { progress: function (_a) {
                    var done = _a.done, current = _a.current, total = _a.total;
                    if (onProgress_1) {
                        util_1.FunctionExt.call(onProgress_1, _this.graph, { done: done, current: current, total: total });
                    }
                    // sort views after async render
                    if (done) {
                        callback();
                    }
                } }));
        }
        else {
            this.updateViews(options);
            callback();
        }
    };
    Renderer.prototype.isAsync = function () {
        return !!this.options.async;
    };
    Renderer.prototype.setAsync = function (async) {
        this.options.async = async;
    };
    Renderer.prototype.onRemove = function () {
        this.freeze();
        this.removeViews();
    };
    Renderer.prototype.resetViews = function (cells, options) {
        if (cells === void 0) { cells = []; }
        if (options === void 0) { options = {}; }
        this.resetUpdates();
        this.removeViews();
        this.freeze({ key: 'reset' });
        for (var i = 0, n = cells.length; i < n; i += 1) {
            this.renderView(cells[i], options);
        }
        this.unfreeze({ key: 'reset' });
        this.sortViews();
    };
    Renderer.prototype.removeView = function (cell) {
        var view = this.views[cell.id];
        if (view) {
            var cid = view.cid;
            var updates = this.updates;
            var mounted = updates.mounted;
            var unmounted = updates.unmounted;
            view.remove();
            delete this.views[cell.id];
            delete mounted[cid];
            delete unmounted[cid];
        }
        return view;
    };
    Renderer.prototype.removeViews = function () {
        var _this = this;
        if (this.views) {
            Object.keys(this.views).forEach(function (id) {
                var view = _this.views[id];
                if (view) {
                    _this.removeView(view.cell);
                }
            });
        }
        this.views = {};
    };
    Renderer.prototype.renderView = function (cell, options) {
        if (options === void 0) { options = {}; }
        var id = cell.id;
        var views = this.views;
        var flag = 0;
        var view = views[id];
        if (!cell.isVisible()) {
            return;
        }
        if (cell.isEdge()) {
            if (!this.isEdgeTerminalVisible(cell, 'source') ||
                !this.isEdgeTerminalVisible(cell, 'target')) {
                return;
            }
        }
        if (view) {
            flag = Renderer.FLAG_INSERT;
        }
        else {
            var tmp = this.graph.hook.createCellView(cell);
            if (tmp) {
                view = views[cell.id] = tmp;
                view.graph = this.graph;
                flag = this.registerUnmountedView(view) | view.getBootstrapFlag();
            }
        }
        if (view) {
            this.requestViewUpdate(view, flag, view.priority, options);
        }
    };
    Renderer.prototype.isExactSorting = function () {
        return this.options.sorting === 'exact';
    };
    Renderer.prototype.sortViews = function () {
        if (!this.isExactSorting()) {
            return;
        }
        if (this.isFrozen()) {
            // sort views once unfrozen
            this.updates.sort = true;
            return;
        }
        this.sortViewsExact();
    };
    Renderer.prototype.sortElements = function (elems, comparator) {
        // Highly inspired by the jquery.sortElements plugin by Padolsey.
        // See http://james.padolsey.com/javascript/sorting-elements-with-jquery/.
        var placements = elems.map(function (elem) {
            var parentNode = elem.parentNode;
            // Since the element itself will change position, we have
            // to have some way of storing it's original position in
            // the DOM. The easiest way is to have a 'flag' node:
            var nextSibling = parentNode.insertBefore(document.createTextNode(''), elem.nextSibling);
            return function (targetNode) {
                if (parentNode === targetNode) {
                    throw new Error("You can't sort elements if any one is a descendant of another.");
                }
                // Insert before flag
                parentNode.insertBefore(targetNode, nextSibling);
                // Remove flag
                parentNode.removeChild(nextSibling);
            };
        });
        elems.sort(comparator).forEach(function (elem, index) { return placements[index](elem); });
    };
    Renderer.prototype.sortViewsExact = function () {
        // const elems = this.view.stage.querySelectorAll('[data-cell-id]')
        // const length = elems.length
        // const cells = []
        // for (let i = 0; i < length; i++) {
        //   const cell = this.model.getCell(elems[i].getAttribute('data-cell-id') || '')
        //   cells.push({
        //     id: cell.id,
        //     zIndex: cell.getZIndex() || 0,
        //     elem: elems[i],
        //   })
        // }
        // const sortedCells = [...cells].sort((cell1, cell2) => cell1.zIndex - cell2.zIndex)
        // const moves = ArrayExt.diff(cells, sortedCells, 'zIndex').moves
        // if (moves && moves.length) {
        //   moves.forEach((move) => {
        //     if (move.type) {
        //       const elem = move.item.elem as Element
        //       const parentNode = elem.parentNode
        //       const index = move.index
        //       if (parentNode) {
        //         if (index === length - 1) {
        //           parentNode.appendChild(elem)
        //         } else if (index < length - 1) {
        //           parentNode.insertBefore(elem, elems[index + 1])
        //         }
        //       }
        //     }
        //   })
        // }
        // Run insertion sort algorithm in order to efficiently sort DOM
        // elements according to their associated cell `zIndex` attribute.
        var elems = this.view
            .$(this.view.stage)
            .children('[data-cell-id]')
            .toArray();
        var model = this.model;
        this.sortElements(elems, function (a, b) {
            var cellA = model.getCell(a.getAttribute('data-cell-id') || '');
            var cellB = model.getCell(b.getAttribute('data-cell-id') || '');
            var z1 = cellA.getZIndex() || 0;
            var z2 = cellB.getZIndex() || 0;
            return z1 === z2 ? 0 : z1 < z2 ? -1 : 1;
        });
    };
    Renderer.prototype.addZPivot = function (zIndex) {
        if (zIndex === void 0) { zIndex = 0; }
        if (this.zPivots == null) {
            this.zPivots = {};
        }
        var pivots = this.zPivots;
        var pivot = pivots[zIndex];
        if (pivot) {
            return pivot;
        }
        pivot = pivots[zIndex] = document.createComment("z-index:" + (zIndex + 1));
        var neighborZ = -Infinity;
        // eslint-disable-next-line
        for (var key in pivots) {
            var currentZ = +key;
            if (currentZ < zIndex && currentZ > neighborZ) {
                neighborZ = currentZ;
                if (neighborZ === zIndex - 1) {
                    continue;
                }
            }
        }
        var layer = this.view.stage;
        if (neighborZ !== -Infinity) {
            var neighborPivot = pivots[neighborZ];
            layer.insertBefore(pivot, neighborPivot.nextSibling);
        }
        else {
            layer.insertBefore(pivot, layer.firstChild);
        }
        return pivot;
    };
    Renderer.prototype.removeZPivots = function () {
        var _this = this;
        if (this.zPivots) {
            Object.keys(this.zPivots).forEach(function (z) {
                var elem = _this.zPivots[z];
                if (elem && elem.parentNode) {
                    elem.parentNode.removeChild(elem);
                }
            });
        }
        this.zPivots = {};
    };
    Renderer.prototype.insertView = function (view) {
        var stage = this.view.stage;
        switch (this.options.sorting) {
            case 'approx': {
                var zIndex = view.cell.getZIndex();
                var pivot = this.addZPivot(zIndex);
                stage.insertBefore(view.container, pivot);
                break;
            }
            case 'exact':
            default:
                stage.appendChild(view.container);
                break;
        }
    };
    Renderer.prototype.findViewByCell = function (cell) {
        if (cell == null) {
            return null;
        }
        var id = model_1.Cell.isCell(cell) ? cell.id : cell;
        return this.views[id];
    };
    Renderer.prototype.findViewByElem = function (elem) {
        if (elem == null) {
            return null;
        }
        var target = typeof elem === 'string'
            ? this.view.stage.querySelector(elem)
            : elem instanceof Element
                ? elem
                : elem[0];
        if (target) {
            var id = this.view.findAttr('data-cell-id', target);
            if (id) {
                return this.views[id];
            }
        }
        return null;
    };
    Renderer.prototype.findViewsFromPoint = function (p) {
        var _this = this;
        var ref = { x: p.x, y: p.y };
        return this.model
            .getCells()
            .map(function (cell) { return _this.findViewByCell(cell); })
            .filter(function (view) {
            if (view != null) {
                return util_1.Dom.getBBox(view.container, {
                    target: _this.view.stage,
                }).containsPoint(ref);
            }
            return false;
        });
    };
    Renderer.prototype.findEdgeViewsInArea = function (rect, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var area = geometry_1.Rectangle.create(rect);
        return this.model
            .getEdges()
            .map(function (edge) { return _this.findViewByCell(edge); })
            .filter(function (view) {
            if (view) {
                var bbox = util_1.Dom.getBBox(view.container, {
                    target: _this.view.stage,
                });
                if (bbox.width === 0) {
                    bbox.inflate(1, 0);
                }
                else if (bbox.height === 0) {
                    bbox.inflate(0, 1);
                }
                return options.strict
                    ? area.containsRect(bbox)
                    : area.isIntersectWithRect(bbox);
            }
            return false;
        });
    };
    Renderer.prototype.findViewsInArea = function (rect, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var area = geometry_1.Rectangle.create(rect);
        return this.model
            .getNodes()
            .map(function (node) { return _this.findViewByCell(node); })
            .filter(function (view) {
            if (view) {
                var bbox = util_1.Dom.getBBox(view.container, {
                    target: _this.view.stage,
                });
                return options.strict
                    ? area.containsRect(bbox)
                    : area.isIntersectWithRect(bbox);
            }
            return false;
        });
    };
    Renderer.prototype.dispose = function () {
        this.resetUpdates();
        this.stopListening();
    };
    __decorate([
        base_1.Base.dispose()
    ], Renderer.prototype, "dispose", null);
    return Renderer;
}(base_1.Base));
exports.Renderer = Renderer;
(function (Renderer) {
    Renderer.FLAG_INSERT = 1 << 30;
    Renderer.FLAG_REMOVE = 1 << 29;
    Renderer.MOUNT_BATCH_SIZE = 1000;
    Renderer.UPDATE_BATCH_SIZE = 1000;
    Renderer.MIN_PRIORITY = 2;
    Renderer.SORT_DELAYING_BATCHES = [
        'add',
        'to-front',
        'to-back',
    ];
    Renderer.UPDATE_DELAYING_BATCHES = ['translate'];
})(Renderer = exports.Renderer || (exports.Renderer = {}));
exports.Renderer = Renderer;
//# sourceMappingURL=renderer.js.map