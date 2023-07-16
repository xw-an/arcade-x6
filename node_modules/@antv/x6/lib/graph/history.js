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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryManager = void 0;
var util_1 = require("../util");
var common_1 = require("../common");
var model_1 = require("../model/model");
var HistoryManager = /** @class */ (function (_super) {
    __extends(HistoryManager, _super);
    function HistoryManager(options) {
        var _this = _super.call(this) || this;
        _this.batchCommands = null;
        _this.batchLevel = 0;
        _this.lastBatchIndex = -1;
        _this.freezed = false;
        _this.handlers = [];
        _this.graph = options.graph;
        _this.model = options.graph.model;
        _this.options = Util.getOptions(options);
        _this.validator = new HistoryManager.Validator({
            history: _this,
            cancelInvalid: _this.options.cancelInvalid,
        });
        _this.clean();
        _this.startListening();
        return _this;
    }
    Object.defineProperty(HistoryManager.prototype, "disabled", {
        get: function () {
            return this.options.enabled !== true;
        },
        enumerable: false,
        configurable: true
    });
    HistoryManager.prototype.enable = function () {
        if (this.disabled) {
            this.options.enabled = true;
        }
    };
    HistoryManager.prototype.disable = function () {
        if (!this.disabled) {
            this.options.enabled = false;
        }
    };
    HistoryManager.prototype.undo = function (options) {
        if (options === void 0) { options = {}; }
        if (!this.disabled) {
            var cmd = this.undoStack.pop();
            if (cmd) {
                this.revertCommand(cmd, options);
                this.redoStack.push(cmd);
                this.notify('undo', cmd, options);
            }
        }
        return this;
    };
    HistoryManager.prototype.redo = function (options) {
        if (options === void 0) { options = {}; }
        if (!this.disabled) {
            var cmd = this.redoStack.pop();
            if (cmd) {
                this.applyCommand(cmd, options);
                this.undoStack.push(cmd);
                this.notify('redo', cmd, options);
            }
        }
        return this;
    };
    /**
     * Same as `undo()` but does not store the undo-ed command to the
     * `redoStack`. Canceled command therefore cannot be redo-ed.
     */
    HistoryManager.prototype.cancel = function (options) {
        if (options === void 0) { options = {}; }
        if (!this.disabled) {
            var cmd = this.undoStack.pop();
            if (cmd) {
                this.revertCommand(cmd, options);
                this.redoStack = [];
                this.notify('cancel', cmd, options);
            }
        }
        return this;
    };
    HistoryManager.prototype.clean = function (options) {
        if (options === void 0) { options = {}; }
        this.undoStack = [];
        this.redoStack = [];
        this.notify('clean', null, options);
        return this;
    };
    HistoryManager.prototype.canUndo = function () {
        return !this.disabled && this.undoStack.length > 0;
    };
    HistoryManager.prototype.canRedo = function () {
        return !this.disabled && this.redoStack.length > 0;
    };
    HistoryManager.prototype.validate = function (events) {
        var _a;
        var callbacks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            callbacks[_i - 1] = arguments[_i];
        }
        (_a = this.validator).validate.apply(_a, __spreadArray([events], callbacks, false));
        return this;
    };
    HistoryManager.prototype.dispose = function () {
        this.validator.dispose();
        this.clean();
        this.stopListening();
    };
    HistoryManager.prototype.startListening = function () {
        var _this = this;
        this.model.on('batch:start', this.initBatchCommand, this);
        this.model.on('batch:stop', this.storeBatchCommand, this);
        if (this.options.eventNames) {
            this.options.eventNames.forEach(function (name, index) {
                _this.handlers[index] = _this.addCommand.bind(_this, name);
                _this.model.on(name, _this.handlers[index]);
            });
        }
        this.validator.on('invalid', function (args) { return _this.trigger('invalid', args); });
    };
    HistoryManager.prototype.stopListening = function () {
        var _this = this;
        this.model.off('batch:start', this.initBatchCommand, this);
        this.model.off('batch:stop', this.storeBatchCommand, this);
        if (this.options.eventNames) {
            this.options.eventNames.forEach(function (name, index) {
                _this.model.off(name, _this.handlers[index]);
            });
            this.handlers.length = 0;
        }
        this.validator.off('invalid');
    };
    HistoryManager.prototype.createCommand = function (options) {
        return {
            batch: options ? options.batch : false,
            data: {},
        };
    };
    HistoryManager.prototype.revertCommand = function (cmd, options) {
        this.freezed = true;
        var cmds = Array.isArray(cmd) ? Util.sortBatchCommands(cmd) : [cmd];
        for (var i = cmds.length - 1; i >= 0; i -= 1) {
            var cmd_1 = cmds[i];
            var localOptions = __assign(__assign({}, options), util_1.ObjectExt.pick(cmd_1.options, this.options.revertOptionsList || []));
            this.executeCommand(cmd_1, true, localOptions);
        }
        this.freezed = false;
    };
    HistoryManager.prototype.applyCommand = function (cmd, options) {
        this.freezed = true;
        var cmds = Array.isArray(cmd) ? Util.sortBatchCommands(cmd) : [cmd];
        for (var i = 0; i < cmds.length; i += 1) {
            var cmd_2 = cmds[i];
            var localOptions = __assign(__assign({}, options), util_1.ObjectExt.pick(cmd_2.options, this.options.applyOptionsList || []));
            this.executeCommand(cmd_2, false, localOptions);
        }
        this.freezed = false;
    };
    HistoryManager.prototype.executeCommand = function (cmd, revert, options) {
        var model = this.model;
        // const cell = cmd.modelChange ? model : model.getCell(cmd.data.id!)
        var cell = model.getCell(cmd.data.id);
        var event = cmd.event;
        if ((Util.isAddEvent(event) && revert) ||
            (Util.isRemoveEvent(event) && !revert)) {
            cell && cell.remove(options);
        }
        else if ((Util.isAddEvent(event) && !revert) ||
            (Util.isRemoveEvent(event) && revert)) {
            var data = cmd.data;
            if (data.node) {
                model.addNode(data.props, options);
            }
            else if (data.edge) {
                model.addEdge(data.props, options);
            }
        }
        else if (Util.isChangeEvent(event)) {
            var data = cmd.data;
            var key = data.key;
            if (key && cell) {
                var value = revert ? data.prev[key] : data.next[key];
                cell.prop(key, value, options);
            }
        }
        else {
            var executeCommand = this.options.executeCommand;
            if (executeCommand) {
                util_1.FunctionExt.call(executeCommand, this, cmd, revert, options);
            }
        }
    };
    HistoryManager.prototype.addCommand = function (event, args) {
        if (this.freezed || this.disabled) {
            return;
        }
        var eventArgs = args;
        var options = eventArgs.options || {};
        if (options.dryrun) {
            return;
        }
        if ((Util.isAddEvent(event) && this.options.ignoreAdd) ||
            (Util.isRemoveEvent(event) && this.options.ignoreRemove) ||
            (Util.isChangeEvent(event) && this.options.ignoreChange)) {
            return;
        }
        // before
        // ------
        var before = this.options.beforeAddCommand;
        if (before != null &&
            util_1.FunctionExt.call(before, this, event, args) === false) {
            return;
        }
        if (event === 'cell:change:*') {
            // eslint-disable-next-line
            event = "cell:change:" + eventArgs.key;
        }
        var cell = eventArgs.cell;
        var isModelChange = model_1.Model.isModel(cell);
        var cmd;
        if (this.batchCommands) {
            // In most cases we are working with same object, doing
            // same action etc. translate an object piece by piece.
            cmd = this.batchCommands[Math.max(this.lastBatchIndex, 0)];
            // Check if we are start working with new object or performing different
            // action with it. Note, that command is uninitialized when lastCmdIndex
            // equals -1. In that case we are done, command we were looking for is
            // already set
            var diffId = (isModelChange && !cmd.modelChange) || cmd.data.id !== cell.id;
            var diffName = cmd.event !== event;
            if (this.lastBatchIndex >= 0 && (diffId || diffName)) {
                // Trying to find command first, which was performing same
                // action with the object as we are doing now with cell.
                var index = this.batchCommands.findIndex(function (cmd) {
                    return ((isModelChange && cmd.modelChange) || cmd.data.id === cell.id) &&
                        cmd.event === event;
                });
                if (index < 0 || Util.isAddEvent(event) || Util.isRemoveEvent(event)) {
                    cmd = this.createCommand({ batch: true });
                }
                else {
                    cmd = this.batchCommands[index];
                    this.batchCommands.splice(index, 1);
                }
                this.batchCommands.push(cmd);
                this.lastBatchIndex = this.batchCommands.length - 1;
            }
        }
        else {
            cmd = this.createCommand({ batch: false });
        }
        // add & remove
        // ------------
        if (Util.isAddEvent(event) || Util.isRemoveEvent(event)) {
            var data = cmd.data;
            cmd.event = event;
            cmd.options = options;
            data.id = cell.id;
            data.props = util_1.ObjectExt.cloneDeep(cell.toJSON());
            if (cell.isEdge()) {
                data.edge = true;
            }
            else if (cell.isNode()) {
                data.node = true;
            }
            return this.push(cmd, options);
        }
        // change:*
        // --------
        if (Util.isChangeEvent(event)) {
            var key = args.key;
            var data = cmd.data;
            if (!cmd.batch || !cmd.event) {
                // Do this only once. Set previous data and action (also
                // serves as a flag so that we don't repeat this branche).
                cmd.event = event;
                cmd.options = options;
                data.key = key;
                if (data.prev == null) {
                    data.prev = {};
                }
                data.prev[key] = util_1.ObjectExt.clone(cell.previous(key));
                if (isModelChange) {
                    cmd.modelChange = true;
                }
                else {
                    data.id = cell.id;
                }
            }
            if (data.next == null) {
                data.next = {};
            }
            data.next[key] = util_1.ObjectExt.clone(cell.prop(key));
            return this.push(cmd, options);
        }
        // others
        // ------
        var afterAddCommand = this.options.afterAddCommand;
        if (afterAddCommand) {
            util_1.FunctionExt.call(afterAddCommand, this, event, args, cmd);
        }
        this.push(cmd, options);
    };
    /**
     * Gather multiple changes into a single command. These commands could
     * be reverted with single `undo()` call. From the moment the function
     * is called every change made on model is not stored into the undoStack.
     * Changes are temporarily kept until `storeBatchCommand()` is called.
     */
    // eslint-disable-next-line
    HistoryManager.prototype.initBatchCommand = function (options) {
        if (this.freezed) {
            return;
        }
        if (this.batchCommands) {
            this.batchLevel += 1;
        }
        else {
            this.batchCommands = [this.createCommand({ batch: true })];
            this.batchLevel = 0;
            this.lastBatchIndex = -1;
        }
    };
    /**
     * Store changes temporarily kept in the undoStack. You have to call this
     * function as many times as `initBatchCommand()` been called.
     */
    HistoryManager.prototype.storeBatchCommand = function (options) {
        if (this.freezed) {
            return;
        }
        if (this.batchCommands && this.batchLevel <= 0) {
            var cmds = this.filterBatchCommand(this.batchCommands);
            if (cmds.length > 0) {
                this.redoStack = [];
                this.undoStack.push(cmds);
                this.consolidateCommands();
                this.notify('add', cmds, options);
            }
            this.batchCommands = null;
            this.lastBatchIndex = -1;
            this.batchLevel = 0;
        }
        else if (this.batchCommands && this.batchLevel > 0) {
            this.batchLevel -= 1;
        }
    };
    HistoryManager.prototype.filterBatchCommand = function (batchCommands) {
        var cmds = batchCommands.slice();
        var result = [];
        var _loop_1 = function () {
            var cmd = cmds.shift();
            var evt = cmd.event;
            var id = cmd.data.id;
            if (evt != null && (id != null || cmd.modelChange)) {
                if (Util.isAddEvent(evt)) {
                    var index_1 = cmds.findIndex(function (c) { return Util.isRemoveEvent(c.event) && c.data.id === id; });
                    if (index_1 >= 0) {
                        cmds = cmds.filter(function (c, i) { return index_1 < i || c.data.id !== id; });
                        return "continue";
                    }
                }
                else if (Util.isRemoveEvent(evt)) {
                    var index = cmds.findIndex(function (c) { return Util.isAddEvent(c.event) && c.data.id === id; });
                    if (index >= 0) {
                        cmds.splice(index, 1);
                        return "continue";
                    }
                }
                else if (Util.isChangeEvent(evt)) {
                    var data = cmd.data;
                    if (util_1.ObjectExt.isEqual(data.prev, data.next)) {
                        return "continue";
                    }
                }
                else {
                    // pass
                }
                result.push(cmd);
            }
        };
        while (cmds.length > 0) {
            _loop_1();
        }
        return result;
    };
    HistoryManager.prototype.notify = function (event, cmd, options) {
        var cmds = cmd == null ? null : Array.isArray(cmd) ? cmd : [cmd];
        this.emit(event, { cmds: cmds, options: options });
        this.emit('change', { cmds: cmds, options: options });
    };
    HistoryManager.prototype.push = function (cmd, options) {
        this.redoStack = [];
        if (cmd.batch) {
            this.lastBatchIndex = Math.max(this.lastBatchIndex, 0);
            this.emit('batch', { cmd: cmd, options: options });
        }
        else {
            this.undoStack.push(cmd);
            this.consolidateCommands();
            this.notify('add', cmd, options);
        }
    };
    /**
     * Conditionally combine multiple undo items into one.
     *
     * Currently this is only used combine a `cell:changed:position` event
     * followed by multiple `cell:change:parent` and `cell:change:children`
     * events, such that a "move + embed" action can be undone in one step.
     *
     * See https://github.com/antvis/X6/issues/2421
     *
     * This is an ugly WORKAROUND. It does not solve deficiencies in the batch
     * system itself.
     */
    HistoryManager.prototype.consolidateCommands = function () {
        var _a;
        var lastCommandGroup = this.undoStack[this.undoStack.length - 1];
        var penultimateCommandGroup = this.undoStack[this.undoStack.length - 2];
        // We are looking for at least one cell:change:parent
        // and one cell:change:children
        if (!Array.isArray(lastCommandGroup)) {
            return;
        }
        var eventTypes = new Set(lastCommandGroup.map(function (cmd) { return cmd.event; }));
        if (eventTypes.size !== 2 ||
            !eventTypes.has('cell:change:parent') ||
            !eventTypes.has('cell:change:children')) {
            return;
        }
        // We are looking for events from user interactions
        if (!lastCommandGroup.every(function (cmd) { var _a; return cmd.batch && ((_a = cmd.options) === null || _a === void 0 ? void 0 : _a.ui); })) {
            return;
        }
        // We are looking for a command group with exactly one event, whose event
        // type is cell:change:position, and is from user interactions
        if (!Array.isArray(penultimateCommandGroup) ||
            penultimateCommandGroup.length !== 1) {
            return;
        }
        var maybePositionChange = penultimateCommandGroup[0];
        if (maybePositionChange.event !== 'cell:change:position' ||
            !((_a = maybePositionChange.options) === null || _a === void 0 ? void 0 : _a.ui)) {
            return;
        }
        // Actually consolidating the commands we get
        penultimateCommandGroup.push.apply(penultimateCommandGroup, lastCommandGroup);
        this.undoStack.pop();
    };
    __decorate([
        common_1.Basecoat.dispose()
    ], HistoryManager.prototype, "dispose", null);
    return HistoryManager;
}(common_1.Basecoat));
exports.HistoryManager = HistoryManager;
(function (HistoryManager) {
    /**
     * Runs a set of callbacks to determine if a command is valid. This is
     * useful for checking if a certain action in your application does
     * lead to an invalid state of the graph.
     */
    var Validator = /** @class */ (function (_super) {
        __extends(Validator, _super);
        function Validator(options) {
            var _this = _super.call(this) || this;
            _this.map = {};
            _this.command = options.history;
            _this.cancelInvalid = options.cancelInvalid !== false;
            _this.command.on('add', _this.onCommandAdded, _this);
            return _this;
        }
        Validator.prototype.onCommandAdded = function (_a) {
            var _this = this;
            var cmds = _a.cmds;
            return Array.isArray(cmds)
                ? cmds.every(function (cmd) { return _this.isValidCommand(cmd); })
                : this.isValidCommand(cmds);
        };
        Validator.prototype.isValidCommand = function (cmd) {
            if (cmd.options && cmd.options.validation === false) {
                return true;
            }
            var callbacks = (cmd.event && this.map[cmd.event]) || [];
            var handoverErr = null;
            callbacks.forEach(function (routes) {
                var i = 0;
                var rollup = function (err) {
                    var fn = routes[i];
                    i += 1;
                    try {
                        if (fn) {
                            fn(err, cmd, rollup);
                        }
                        else {
                            handoverErr = err;
                            return;
                        }
                    }
                    catch (err) {
                        rollup(err);
                    }
                };
                rollup(handoverErr);
            });
            if (handoverErr) {
                if (this.cancelInvalid) {
                    this.command.cancel();
                }
                this.emit('invalid', { err: handoverErr });
                return false;
            }
            return true;
        };
        Validator.prototype.validate = function (events) {
            var _this = this;
            var callbacks = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                callbacks[_i - 1] = arguments[_i];
            }
            var evts = Array.isArray(events) ? events : events.split(/\s+/);
            callbacks.forEach(function (callback) {
                if (typeof callback !== 'function') {
                    throw new Error(evts.join(' ') + " requires callback functions.");
                }
            });
            evts.forEach(function (event) {
                if (_this.map[event] == null) {
                    _this.map[event] = [];
                }
                _this.map[event].push(callbacks);
            });
            return this;
        };
        Validator.prototype.dispose = function () {
            this.command.off('add', this.onCommandAdded, this);
        };
        __decorate([
            common_1.Basecoat.dispose()
        ], Validator.prototype, "dispose", null);
        return Validator;
    }(common_1.Basecoat));
    HistoryManager.Validator = Validator;
})(HistoryManager = exports.HistoryManager || (exports.HistoryManager = {}));
exports.HistoryManager = HistoryManager;
var Util;
(function (Util) {
    function isAddEvent(event) {
        return event === 'cell:added';
    }
    Util.isAddEvent = isAddEvent;
    function isRemoveEvent(event) {
        return event === 'cell:removed';
    }
    Util.isRemoveEvent = isRemoveEvent;
    function isChangeEvent(event) {
        return event != null && event.startsWith('cell:change:');
    }
    Util.isChangeEvent = isChangeEvent;
    function getOptions(options) {
        var graph = options.graph, others = __rest(options, ["graph"]);
        var reservedNames = [
            'cell:added',
            'cell:removed',
            'cell:change:*',
        ];
        var batchEvents = [
            'batch:start',
            'batch:stop',
        ];
        var eventNames = options.eventNames
            ? options.eventNames.filter(function (event) {
                return !(Util.isChangeEvent(event) ||
                    reservedNames.includes(event) ||
                    batchEvents.includes(event));
            })
            : reservedNames;
        return __assign(__assign({}, others), { eventNames: eventNames, applyOptionsList: options.applyOptionsList || ['propertyPath'], revertOptionsList: options.revertOptionsList || ['propertyPath'] });
    }
    Util.getOptions = getOptions;
    function sortBatchCommands(cmds) {
        var results = [];
        for (var i = 0, ii = cmds.length; i < ii; i += 1) {
            var cmd = cmds[i];
            var index = null;
            if (Util.isAddEvent(cmd.event)) {
                var id = cmd.data.id;
                for (var j = 0; j < i; j += 1) {
                    if (cmds[j].data.id === id) {
                        index = j;
                        break;
                    }
                }
            }
            if (index !== null) {
                results.splice(index, 0, cmd);
            }
            else {
                results.push(cmd);
            }
        }
        return results;
    }
    Util.sortBatchCommands = sortBatchCommands;
})(Util || (Util = {}));
//# sourceMappingURL=history.js.map