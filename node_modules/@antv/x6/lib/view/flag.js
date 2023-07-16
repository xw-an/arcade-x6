"use strict";
/* eslint-disable no-bitwise */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagManager = void 0;
var FlagManager = /** @class */ (function () {
    function FlagManager(view, actions, bootstrap) {
        if (bootstrap === void 0) { bootstrap = []; }
        this.view = view;
        var flags = {};
        var attrs = {};
        var shift = 0;
        Object.keys(actions).forEach(function (attr) {
            var labels = actions[attr];
            if (!Array.isArray(labels)) {
                labels = [labels];
            }
            labels.forEach(function (label) {
                var flag = flags[label];
                if (!flag) {
                    shift += 1;
                    flag = flags[label] = 1 << shift;
                }
                attrs[attr] |= flag;
            });
        });
        var labels = bootstrap;
        if (!Array.isArray(labels)) {
            labels = [labels];
        }
        labels.forEach(function (label) {
            if (!flags[label]) {
                shift += 1;
                flags[label] = 1 << shift;
            }
        });
        // 26 - 30 are reserved for paper flags
        // 31+ overflows maximal number
        if (shift > 25) {
            throw new Error('Maximum number of flags exceeded.');
        }
        this.flags = flags;
        this.attrs = attrs;
        this.bootstrap = bootstrap;
    }
    Object.defineProperty(FlagManager.prototype, "cell", {
        get: function () {
            return this.view.cell;
        },
        enumerable: false,
        configurable: true
    });
    FlagManager.prototype.getFlag = function (label) {
        var flags = this.flags;
        if (flags == null) {
            return 0;
        }
        if (Array.isArray(label)) {
            return label.reduce(function (memo, key) { return memo | flags[key]; }, 0);
        }
        return flags[label] | 0;
    };
    FlagManager.prototype.hasAction = function (flag, label) {
        return flag & this.getFlag(label);
    };
    FlagManager.prototype.removeAction = function (flag, label) {
        return flag ^ (flag & this.getFlag(label));
    };
    FlagManager.prototype.getBootstrapFlag = function () {
        return this.getFlag(this.bootstrap);
    };
    FlagManager.prototype.getChangedFlag = function () {
        var _this = this;
        var flag = 0;
        if (!this.attrs) {
            return flag;
        }
        Object.keys(this.attrs).forEach(function (attr) {
            if (_this.cell.hasChanged(attr)) {
                flag |= _this.attrs[attr];
            }
        });
        return flag;
    };
    return FlagManager;
}());
exports.FlagManager = FlagManager;
//# sourceMappingURL=flag.js.map