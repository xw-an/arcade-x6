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
import { ObjectExt, FunctionExt } from '../util';
import { Basecoat } from '../common';
import { Model } from '../model/model';
export class HistoryManager extends Basecoat {
    constructor(options) {
        super();
        this.batchCommands = null;
        this.batchLevel = 0;
        this.lastBatchIndex = -1;
        this.freezed = false;
        this.handlers = [];
        this.graph = options.graph;
        this.model = options.graph.model;
        this.options = Util.getOptions(options);
        this.validator = new HistoryManager.Validator({
            history: this,
            cancelInvalid: this.options.cancelInvalid,
        });
        this.clean();
        this.startListening();
    }
    get disabled() {
        return this.options.enabled !== true;
    }
    enable() {
        if (this.disabled) {
            this.options.enabled = true;
        }
    }
    disable() {
        if (!this.disabled) {
            this.options.enabled = false;
        }
    }
    undo(options = {}) {
        if (!this.disabled) {
            const cmd = this.undoStack.pop();
            if (cmd) {
                this.revertCommand(cmd, options);
                this.redoStack.push(cmd);
                this.notify('undo', cmd, options);
            }
        }
        return this;
    }
    redo(options = {}) {
        if (!this.disabled) {
            const cmd = this.redoStack.pop();
            if (cmd) {
                this.applyCommand(cmd, options);
                this.undoStack.push(cmd);
                this.notify('redo', cmd, options);
            }
        }
        return this;
    }
    /**
     * Same as `undo()` but does not store the undo-ed command to the
     * `redoStack`. Canceled command therefore cannot be redo-ed.
     */
    cancel(options = {}) {
        if (!this.disabled) {
            const cmd = this.undoStack.pop();
            if (cmd) {
                this.revertCommand(cmd, options);
                this.redoStack = [];
                this.notify('cancel', cmd, options);
            }
        }
        return this;
    }
    clean(options = {}) {
        this.undoStack = [];
        this.redoStack = [];
        this.notify('clean', null, options);
        return this;
    }
    canUndo() {
        return !this.disabled && this.undoStack.length > 0;
    }
    canRedo() {
        return !this.disabled && this.redoStack.length > 0;
    }
    validate(events, ...callbacks) {
        this.validator.validate(events, ...callbacks);
        return this;
    }
    dispose() {
        this.validator.dispose();
        this.clean();
        this.stopListening();
    }
    startListening() {
        this.model.on('batch:start', this.initBatchCommand, this);
        this.model.on('batch:stop', this.storeBatchCommand, this);
        if (this.options.eventNames) {
            this.options.eventNames.forEach((name, index) => {
                this.handlers[index] = this.addCommand.bind(this, name);
                this.model.on(name, this.handlers[index]);
            });
        }
        this.validator.on('invalid', (args) => this.trigger('invalid', args));
    }
    stopListening() {
        this.model.off('batch:start', this.initBatchCommand, this);
        this.model.off('batch:stop', this.storeBatchCommand, this);
        if (this.options.eventNames) {
            this.options.eventNames.forEach((name, index) => {
                this.model.off(name, this.handlers[index]);
            });
            this.handlers.length = 0;
        }
        this.validator.off('invalid');
    }
    createCommand(options) {
        return {
            batch: options ? options.batch : false,
            data: {},
        };
    }
    revertCommand(cmd, options) {
        this.freezed = true;
        const cmds = Array.isArray(cmd) ? Util.sortBatchCommands(cmd) : [cmd];
        for (let i = cmds.length - 1; i >= 0; i -= 1) {
            const cmd = cmds[i];
            const localOptions = Object.assign(Object.assign({}, options), ObjectExt.pick(cmd.options, this.options.revertOptionsList || []));
            this.executeCommand(cmd, true, localOptions);
        }
        this.freezed = false;
    }
    applyCommand(cmd, options) {
        this.freezed = true;
        const cmds = Array.isArray(cmd) ? Util.sortBatchCommands(cmd) : [cmd];
        for (let i = 0; i < cmds.length; i += 1) {
            const cmd = cmds[i];
            const localOptions = Object.assign(Object.assign({}, options), ObjectExt.pick(cmd.options, this.options.applyOptionsList || []));
            this.executeCommand(cmd, false, localOptions);
        }
        this.freezed = false;
    }
    executeCommand(cmd, revert, options) {
        const model = this.model;
        // const cell = cmd.modelChange ? model : model.getCell(cmd.data.id!)
        const cell = model.getCell(cmd.data.id);
        const event = cmd.event;
        if ((Util.isAddEvent(event) && revert) ||
            (Util.isRemoveEvent(event) && !revert)) {
            cell && cell.remove(options);
        }
        else if ((Util.isAddEvent(event) && !revert) ||
            (Util.isRemoveEvent(event) && revert)) {
            const data = cmd.data;
            if (data.node) {
                model.addNode(data.props, options);
            }
            else if (data.edge) {
                model.addEdge(data.props, options);
            }
        }
        else if (Util.isChangeEvent(event)) {
            const data = cmd.data;
            const key = data.key;
            if (key && cell) {
                const value = revert ? data.prev[key] : data.next[key];
                cell.prop(key, value, options);
            }
        }
        else {
            const executeCommand = this.options.executeCommand;
            if (executeCommand) {
                FunctionExt.call(executeCommand, this, cmd, revert, options);
            }
        }
    }
    addCommand(event, args) {
        if (this.freezed || this.disabled) {
            return;
        }
        const eventArgs = args;
        const options = eventArgs.options || {};
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
        const before = this.options.beforeAddCommand;
        if (before != null &&
            FunctionExt.call(before, this, event, args) === false) {
            return;
        }
        if (event === 'cell:change:*') {
            // eslint-disable-next-line
            event = `cell:change:${eventArgs.key}`;
        }
        const cell = eventArgs.cell;
        const isModelChange = Model.isModel(cell);
        let cmd;
        if (this.batchCommands) {
            // In most cases we are working with same object, doing
            // same action etc. translate an object piece by piece.
            cmd = this.batchCommands[Math.max(this.lastBatchIndex, 0)];
            // Check if we are start working with new object or performing different
            // action with it. Note, that command is uninitialized when lastCmdIndex
            // equals -1. In that case we are done, command we were looking for is
            // already set
            const diffId = (isModelChange && !cmd.modelChange) || cmd.data.id !== cell.id;
            const diffName = cmd.event !== event;
            if (this.lastBatchIndex >= 0 && (diffId || diffName)) {
                // Trying to find command first, which was performing same
                // action with the object as we are doing now with cell.
                const index = this.batchCommands.findIndex((cmd) => ((isModelChange && cmd.modelChange) || cmd.data.id === cell.id) &&
                    cmd.event === event);
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
            const data = cmd.data;
            cmd.event = event;
            cmd.options = options;
            data.id = cell.id;
            data.props = ObjectExt.cloneDeep(cell.toJSON());
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
            const key = args.key;
            const data = cmd.data;
            if (!cmd.batch || !cmd.event) {
                // Do this only once. Set previous data and action (also
                // serves as a flag so that we don't repeat this branche).
                cmd.event = event;
                cmd.options = options;
                data.key = key;
                if (data.prev == null) {
                    data.prev = {};
                }
                data.prev[key] = ObjectExt.clone(cell.previous(key));
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
            data.next[key] = ObjectExt.clone(cell.prop(key));
            return this.push(cmd, options);
        }
        // others
        // ------
        const afterAddCommand = this.options.afterAddCommand;
        if (afterAddCommand) {
            FunctionExt.call(afterAddCommand, this, event, args, cmd);
        }
        this.push(cmd, options);
    }
    /**
     * Gather multiple changes into a single command. These commands could
     * be reverted with single `undo()` call. From the moment the function
     * is called every change made on model is not stored into the undoStack.
     * Changes are temporarily kept until `storeBatchCommand()` is called.
     */
    // eslint-disable-next-line
    initBatchCommand(options) {
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
    }
    /**
     * Store changes temporarily kept in the undoStack. You have to call this
     * function as many times as `initBatchCommand()` been called.
     */
    storeBatchCommand(options) {
        if (this.freezed) {
            return;
        }
        if (this.batchCommands && this.batchLevel <= 0) {
            const cmds = this.filterBatchCommand(this.batchCommands);
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
    }
    filterBatchCommand(batchCommands) {
        let cmds = batchCommands.slice();
        const result = [];
        while (cmds.length > 0) {
            const cmd = cmds.shift();
            const evt = cmd.event;
            const id = cmd.data.id;
            if (evt != null && (id != null || cmd.modelChange)) {
                if (Util.isAddEvent(evt)) {
                    const index = cmds.findIndex((c) => Util.isRemoveEvent(c.event) && c.data.id === id);
                    if (index >= 0) {
                        cmds = cmds.filter((c, i) => index < i || c.data.id !== id);
                        continue;
                    }
                }
                else if (Util.isRemoveEvent(evt)) {
                    const index = cmds.findIndex((c) => Util.isAddEvent(c.event) && c.data.id === id);
                    if (index >= 0) {
                        cmds.splice(index, 1);
                        continue;
                    }
                }
                else if (Util.isChangeEvent(evt)) {
                    const data = cmd.data;
                    if (ObjectExt.isEqual(data.prev, data.next)) {
                        continue;
                    }
                }
                else {
                    // pass
                }
                result.push(cmd);
            }
        }
        return result;
    }
    notify(event, cmd, options) {
        const cmds = cmd == null ? null : Array.isArray(cmd) ? cmd : [cmd];
        this.emit(event, { cmds, options });
        this.emit('change', { cmds, options });
    }
    push(cmd, options) {
        this.redoStack = [];
        if (cmd.batch) {
            this.lastBatchIndex = Math.max(this.lastBatchIndex, 0);
            this.emit('batch', { cmd, options });
        }
        else {
            this.undoStack.push(cmd);
            this.consolidateCommands();
            this.notify('add', cmd, options);
        }
    }
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
    consolidateCommands() {
        var _a;
        const lastCommandGroup = this.undoStack[this.undoStack.length - 1];
        const penultimateCommandGroup = this.undoStack[this.undoStack.length - 2];
        // We are looking for at least one cell:change:parent
        // and one cell:change:children
        if (!Array.isArray(lastCommandGroup)) {
            return;
        }
        const eventTypes = new Set(lastCommandGroup.map((cmd) => cmd.event));
        if (eventTypes.size !== 2 ||
            !eventTypes.has('cell:change:parent') ||
            !eventTypes.has('cell:change:children')) {
            return;
        }
        // We are looking for events from user interactions
        if (!lastCommandGroup.every((cmd) => { var _a; return cmd.batch && ((_a = cmd.options) === null || _a === void 0 ? void 0 : _a.ui); })) {
            return;
        }
        // We are looking for a command group with exactly one event, whose event
        // type is cell:change:position, and is from user interactions
        if (!Array.isArray(penultimateCommandGroup) ||
            penultimateCommandGroup.length !== 1) {
            return;
        }
        const maybePositionChange = penultimateCommandGroup[0];
        if (maybePositionChange.event !== 'cell:change:position' ||
            !((_a = maybePositionChange.options) === null || _a === void 0 ? void 0 : _a.ui)) {
            return;
        }
        // Actually consolidating the commands we get
        penultimateCommandGroup.push(...lastCommandGroup);
        this.undoStack.pop();
    }
}
__decorate([
    Basecoat.dispose()
], HistoryManager.prototype, "dispose", null);
(function (HistoryManager) {
    /**
     * Runs a set of callbacks to determine if a command is valid. This is
     * useful for checking if a certain action in your application does
     * lead to an invalid state of the graph.
     */
    class Validator extends Basecoat {
        constructor(options) {
            super();
            this.map = {};
            this.command = options.history;
            this.cancelInvalid = options.cancelInvalid !== false;
            this.command.on('add', this.onCommandAdded, this);
        }
        onCommandAdded({ cmds }) {
            return Array.isArray(cmds)
                ? cmds.every((cmd) => this.isValidCommand(cmd))
                : this.isValidCommand(cmds);
        }
        isValidCommand(cmd) {
            if (cmd.options && cmd.options.validation === false) {
                return true;
            }
            const callbacks = (cmd.event && this.map[cmd.event]) || [];
            let handoverErr = null;
            callbacks.forEach((routes) => {
                let i = 0;
                const rollup = (err) => {
                    const fn = routes[i];
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
        }
        validate(events, ...callbacks) {
            const evts = Array.isArray(events) ? events : events.split(/\s+/);
            callbacks.forEach((callback) => {
                if (typeof callback !== 'function') {
                    throw new Error(`${evts.join(' ')} requires callback functions.`);
                }
            });
            evts.forEach((event) => {
                if (this.map[event] == null) {
                    this.map[event] = [];
                }
                this.map[event].push(callbacks);
            });
            return this;
        }
        dispose() {
            this.command.off('add', this.onCommandAdded, this);
        }
    }
    __decorate([
        Basecoat.dispose()
    ], Validator.prototype, "dispose", null);
    HistoryManager.Validator = Validator;
})(HistoryManager || (HistoryManager = {}));
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
        const { graph } = options, others = __rest(options, ["graph"]);
        const reservedNames = [
            'cell:added',
            'cell:removed',
            'cell:change:*',
        ];
        const batchEvents = [
            'batch:start',
            'batch:stop',
        ];
        const eventNames = options.eventNames
            ? options.eventNames.filter((event) => !(Util.isChangeEvent(event) ||
                reservedNames.includes(event) ||
                batchEvents.includes(event)))
            : reservedNames;
        return Object.assign(Object.assign({}, others), { eventNames, applyOptionsList: options.applyOptionsList || ['propertyPath'], revertOptionsList: options.revertOptionsList || ['propertyPath'] });
    }
    Util.getOptions = getOptions;
    function sortBatchCommands(cmds) {
        const results = [];
        for (let i = 0, ii = cmds.length; i < ii; i += 1) {
            const cmd = cmds[i];
            let index = null;
            if (Util.isAddEvent(cmd.event)) {
                const id = cmd.data.id;
                for (let j = 0; j < i; j += 1) {
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