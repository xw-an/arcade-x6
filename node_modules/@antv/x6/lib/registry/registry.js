"use strict";
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
exports.Registry = void 0;
var util_1 = require("../util");
var Registry = /** @class */ (function () {
    function Registry(options) {
        this.options = __assign({}, options);
        this.data = this.options.data || {};
        this.register = this.register.bind(this);
        this.unregister = this.unregister.bind(this);
    }
    Object.defineProperty(Registry.prototype, "names", {
        get: function () {
            return Object.keys(this.data);
        },
        enumerable: false,
        configurable: true
    });
    Registry.prototype.register = function (name, options, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (typeof name === 'object') {
            Object.keys(name).forEach(function (key) {
                _this.register(key, name[key], options);
            });
            return;
        }
        if (this.exist(name) && !force && !util_1.Platform.isApplyingHMR()) {
            this.onDuplicated(name);
        }
        var process = this.options.process;
        var entity = process
            ? util_1.FunctionExt.call(process, this, name, options)
            : options;
        this.data[name] = entity;
        return entity;
    };
    Registry.prototype.unregister = function (name) {
        var entity = name ? this.data[name] : null;
        delete this.data[name];
        return entity;
    };
    Registry.prototype.get = function (name) {
        return name ? this.data[name] : null;
    };
    Registry.prototype.exist = function (name) {
        return name ? this.data[name] != null : false;
    };
    Registry.prototype.onDuplicated = function (name) {
        // eslint-disable-next-line no-useless-catch
        try {
            // race
            if (this.options.onConflict) {
                util_1.FunctionExt.call(this.options.onConflict, this, name);
            }
            throw new Error(util_1.StringExt.upperFirst(this.options.type) + " with name '" + name + "' already registered.");
        }
        catch (err) {
            throw err;
        }
    };
    Registry.prototype.onNotFound = function (name, prefix) {
        throw new Error(this.getSpellingSuggestion(name, prefix));
    };
    Registry.prototype.getSpellingSuggestion = function (name, prefix) {
        var suggestion = this.getSpellingSuggestionForName(name);
        var prefixed = prefix
            ? prefix + " " + util_1.StringExt.lowerFirst(this.options.type)
            : this.options.type;
        return (
        // eslint-disable-next-line
        util_1.StringExt.upperFirst(prefixed) + " with name '" + name + "' does not exist." + (suggestion ? " Did you mean '" + suggestion + "'?" : ''));
    };
    Registry.prototype.getSpellingSuggestionForName = function (name) {
        return util_1.StringExt.getSpellingSuggestion(name, Object.keys(this.data), function (candidate) { return candidate; });
    };
    return Registry;
}());
exports.Registry = Registry;
(function (Registry) {
    function create(options) {
        return new Registry(options);
    }
    Registry.create = create;
})(Registry = exports.Registry || (exports.Registry = {}));
exports.Registry = Registry;
//# sourceMappingURL=registry.js.map