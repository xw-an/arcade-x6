import { StringExt, FunctionExt, Platform } from '../util';
export class Registry {
    constructor(options) {
        this.options = Object.assign({}, options);
        this.data = this.options.data || {};
        this.register = this.register.bind(this);
        this.unregister = this.unregister.bind(this);
    }
    get names() {
        return Object.keys(this.data);
    }
    register(name, options, force = false) {
        if (typeof name === 'object') {
            Object.keys(name).forEach((key) => {
                this.register(key, name[key], options);
            });
            return;
        }
        if (this.exist(name) && !force && !Platform.isApplyingHMR()) {
            this.onDuplicated(name);
        }
        const process = this.options.process;
        const entity = process
            ? FunctionExt.call(process, this, name, options)
            : options;
        this.data[name] = entity;
        return entity;
    }
    unregister(name) {
        const entity = name ? this.data[name] : null;
        delete this.data[name];
        return entity;
    }
    get(name) {
        return name ? this.data[name] : null;
    }
    exist(name) {
        return name ? this.data[name] != null : false;
    }
    onDuplicated(name) {
        // eslint-disable-next-line no-useless-catch
        try {
            // race
            if (this.options.onConflict) {
                FunctionExt.call(this.options.onConflict, this, name);
            }
            throw new Error(`${StringExt.upperFirst(this.options.type)} with name '${name}' already registered.`);
        }
        catch (err) {
            throw err;
        }
    }
    onNotFound(name, prefix) {
        throw new Error(this.getSpellingSuggestion(name, prefix));
    }
    getSpellingSuggestion(name, prefix) {
        const suggestion = this.getSpellingSuggestionForName(name);
        const prefixed = prefix
            ? `${prefix} ${StringExt.lowerFirst(this.options.type)}`
            : this.options.type;
        return (
        // eslint-disable-next-line
        `${StringExt.upperFirst(prefixed)} with name '${name}' does not exist.${suggestion ? ` Did you mean '${suggestion}'?` : ''}`);
    }
    getSpellingSuggestionForName(name) {
        return StringExt.getSpellingSuggestion(name, Object.keys(this.data), (candidate) => candidate);
    }
}
(function (Registry) {
    function create(options) {
        return new Registry(options);
    }
    Registry.create = create;
})(Registry || (Registry = {}));
//# sourceMappingURL=registry.js.map