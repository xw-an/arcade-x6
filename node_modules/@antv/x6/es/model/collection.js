import { ArrayExt } from '../util';
import { Basecoat } from '../common';
export class Collection extends Basecoat {
    constructor(cells, options = {}) {
        super();
        this.length = 0;
        this.comparator = options.comparator || 'zIndex';
        this.clean();
        if (cells) {
            this.reset(cells, { silent: true });
        }
    }
    toJSON() {
        return this.cells.map((cell) => cell.toJSON());
    }
    add(cells, index, options) {
        let localIndex;
        let localOptions;
        if (typeof index === 'number') {
            localIndex = index;
            localOptions = Object.assign({ merge: false }, options);
        }
        else {
            localIndex = this.length;
            localOptions = Object.assign({ merge: false }, index);
        }
        if (localIndex > this.length) {
            localIndex = this.length;
        }
        if (localIndex < 0) {
            localIndex += this.length + 1;
        }
        const entities = Array.isArray(cells) ? cells : [cells];
        const sortable = this.comparator &&
            typeof index !== 'number' &&
            localOptions.sort !== false;
        const sortAttr = this.comparator || null;
        let sort = false;
        const added = [];
        const merged = [];
        entities.forEach((cell) => {
            const existing = this.get(cell);
            if (existing) {
                if (localOptions.merge && !cell.isSameStore(existing)) {
                    existing.setProp(cell.getProp(), options); // merge
                    merged.push(existing);
                    if (sortable && !sort) {
                        if (sortAttr == null || typeof sortAttr === 'function') {
                            sort = existing.hasChanged();
                        }
                        else if (typeof sortAttr === 'string') {
                            sort = existing.hasChanged(sortAttr);
                        }
                        else {
                            sort = sortAttr.some((key) => existing.hasChanged(key));
                        }
                    }
                }
            }
            else {
                added.push(cell);
                this.reference(cell);
            }
        });
        if (added.length) {
            if (sortable) {
                sort = true;
            }
            this.cells.splice(localIndex, 0, ...added);
            this.length = this.cells.length;
        }
        if (sort) {
            this.sort({ silent: true });
        }
        if (!localOptions.silent) {
            added.forEach((cell, i) => {
                const args = {
                    cell,
                    index: localIndex + i,
                    options: localOptions,
                };
                this.trigger('added', args);
                if (!localOptions.dryrun) {
                    cell.notify('added', Object.assign({}, args));
                }
            });
            if (sort) {
                this.trigger('sorted');
            }
            if (added.length || merged.length) {
                this.trigger('updated', {
                    added,
                    merged,
                    removed: [],
                    options: localOptions,
                });
            }
        }
        return this;
    }
    remove(cells, options = {}) {
        const arr = Array.isArray(cells) ? cells : [cells];
        const removed = this.removeCells(arr, options);
        if (!options.silent && removed.length > 0) {
            this.trigger('updated', {
                options,
                removed,
                added: [],
                merged: [],
            });
        }
        return Array.isArray(cells) ? removed : removed[0];
    }
    removeCells(cells, options) {
        const removed = [];
        for (let i = 0; i < cells.length; i += 1) {
            const cell = this.get(cells[i]);
            if (cell == null) {
                continue;
            }
            const index = this.cells.indexOf(cell);
            this.cells.splice(index, 1);
            this.length -= 1;
            delete this.map[cell.id];
            removed.push(cell);
            this.unreference(cell);
            if (!options.dryrun) {
                cell.remove();
            }
            if (!options.silent) {
                this.trigger('removed', { cell, index, options });
                if (!options.dryrun) {
                    cell.notify('removed', { cell, index, options });
                }
            }
        }
        return removed;
    }
    reset(cells, options = {}) {
        const previous = this.cells.slice();
        previous.forEach((cell) => this.unreference(cell));
        this.clean();
        this.add(cells, Object.assign({ silent: true }, options));
        if (!options.silent) {
            const current = this.cells.slice();
            this.trigger('reseted', {
                options,
                previous,
                current,
            });
            const added = [];
            const removed = [];
            current.forEach((a) => {
                const exist = previous.some((b) => b.id === a.id);
                if (!exist) {
                    added.push(a);
                }
            });
            previous.forEach((a) => {
                const exist = current.some((b) => b.id === a.id);
                if (!exist) {
                    removed.push(a);
                }
            });
            this.trigger('updated', { options, added, removed, merged: [] });
        }
        return this;
    }
    push(cell, options) {
        return this.add(cell, this.length, options);
    }
    pop(options) {
        const cell = this.at(this.length - 1);
        return this.remove(cell, options);
    }
    unshift(cell, options) {
        return this.add(cell, 0, options);
    }
    shift(options) {
        const cell = this.at(0);
        return this.remove(cell, options);
    }
    get(cell) {
        if (cell == null) {
            return null;
        }
        const id = typeof cell === 'string' || typeof cell === 'number' ? cell : cell.id;
        return this.map[id] || null;
    }
    has(cell) {
        return this.get(cell) != null;
    }
    at(index) {
        if (index < 0) {
            index += this.length; // eslint-disable-line
        }
        return this.cells[index] || null;
    }
    first() {
        return this.at(0);
    }
    last() {
        return this.at(-1);
    }
    indexOf(cell) {
        return this.cells.indexOf(cell);
    }
    toArray() {
        return this.cells.slice();
    }
    sort(options = {}) {
        if (this.comparator != null) {
            this.cells = ArrayExt.sortBy(this.cells, this.comparator);
            if (!options.silent) {
                this.trigger('sorted');
            }
        }
        return this;
    }
    clone() {
        const constructor = this.constructor;
        return new constructor(this.cells.slice(), {
            comparator: this.comparator,
        });
    }
    reference(cell) {
        this.map[cell.id] = cell;
        cell.on('*', this.notifyCellEvent, this);
    }
    unreference(cell) {
        cell.off('*', this.notifyCellEvent, this);
        delete this.map[cell.id];
    }
    notifyCellEvent(name, args) {
        const cell = args.cell;
        this.trigger(`cell:${name}`, args);
        if (cell) {
            if (cell.isNode()) {
                this.trigger(`node:${name}`, Object.assign(Object.assign({}, args), { node: cell }));
            }
            else if (cell.isEdge()) {
                this.trigger(`edge:${name}`, Object.assign(Object.assign({}, args), { edge: cell }));
            }
        }
    }
    clean() {
        this.length = 0;
        this.cells = [];
        this.map = {};
    }
}
//# sourceMappingURL=collection.js.map