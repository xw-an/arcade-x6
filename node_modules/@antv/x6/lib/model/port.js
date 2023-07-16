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
exports.PortManager = void 0;
var registry_1 = require("../registry");
var util_1 = require("../util");
var geometry_1 = require("../geometry");
var PortManager = /** @class */ (function () {
    function PortManager(data) {
        this.ports = [];
        this.groups = {};
        this.init(util_1.ObjectExt.cloneDeep(data));
    }
    PortManager.prototype.getPorts = function () {
        return this.ports;
    };
    PortManager.prototype.getGroup = function (groupName) {
        return groupName != null ? this.groups[groupName] : null;
    };
    PortManager.prototype.getPortsByGroup = function (groupName) {
        return this.ports.filter(function (p) { return p.group === groupName || (p.group == null && groupName == null); });
    };
    PortManager.prototype.getPortsLayoutByGroup = function (groupName, elemBBox) {
        var _this = this;
        var ports = this.getPortsByGroup(groupName);
        var group = groupName ? this.getGroup(groupName) : null;
        var groupPosition = group ? group.position : null;
        var groupPositionName = groupPosition ? groupPosition.name : null;
        var layoutFn;
        if (groupPositionName != null) {
            var fn = registry_1.PortLayout.registry.get(groupPositionName);
            if (fn == null) {
                return registry_1.PortLayout.registry.onNotFound(groupPositionName);
            }
            layoutFn = fn;
        }
        else {
            layoutFn = registry_1.PortLayout.presets.left;
        }
        var portsArgs = ports.map(function (port) { return (port && port.position && port.position.args) || {}; });
        var groupArgs = (groupPosition && groupPosition.args) || {};
        var layouts = layoutFn(portsArgs, elemBBox, groupArgs);
        return layouts.map(function (portLayout, index) {
            var port = ports[index];
            return {
                portLayout: portLayout,
                portId: port.id,
                portSize: port.size,
                portAttrs: port.attrs,
                labelSize: port.label.size,
                labelLayout: _this.getPortLabelLayout(port, geometry_1.Point.create(portLayout.position), elemBBox),
            };
        });
    };
    PortManager.prototype.init = function (data) {
        var _this = this;
        var groups = data.groups, items = data.items;
        if (groups != null) {
            Object.keys(groups).forEach(function (key) {
                _this.groups[key] = _this.parseGroup(groups[key]);
            });
        }
        if (Array.isArray(items)) {
            items.forEach(function (item) {
                _this.ports.push(_this.parsePort(item));
            });
        }
    };
    PortManager.prototype.parseGroup = function (group) {
        return __assign(__assign({}, group), { label: this.getLabel(group, true), position: this.getPortPosition(group.position, true) });
    };
    PortManager.prototype.parsePort = function (port) {
        var result = __assign({}, port);
        var group = this.getGroup(port.group) || {};
        result.markup = result.markup || group.markup;
        result.attrs = util_1.ObjectExt.merge({}, group.attrs, result.attrs);
        result.position = this.createPosition(group, result);
        result.label = util_1.ObjectExt.merge({}, group.label, this.getLabel(result));
        result.zIndex = this.getZIndex(group, result);
        result.size = __assign(__assign({}, group.size), result.size);
        return result;
    };
    PortManager.prototype.getZIndex = function (group, port) {
        if (typeof port.zIndex === 'number') {
            return port.zIndex;
        }
        if (typeof group.zIndex === 'number' || group.zIndex === 'auto') {
            return group.zIndex;
        }
        return 'auto';
    };
    PortManager.prototype.createPosition = function (group, port) {
        return util_1.ObjectExt.merge({
            name: 'left',
            args: {},
        }, group.position, { args: port.args });
    };
    PortManager.prototype.getPortPosition = function (position, setDefault) {
        if (setDefault === void 0) { setDefault = false; }
        if (position == null) {
            if (setDefault) {
                return { name: 'left', args: {} };
            }
        }
        else {
            if (typeof position === 'string') {
                return {
                    name: position,
                    args: {},
                };
            }
            if (Array.isArray(position)) {
                return {
                    name: 'absolute',
                    args: { x: position[0], y: position[1] },
                };
            }
            if (typeof position === 'object') {
                return position;
            }
        }
        return { args: {} };
    };
    PortManager.prototype.getPortLabelPosition = function (position, setDefault) {
        if (setDefault === void 0) { setDefault = false; }
        if (position == null) {
            if (setDefault) {
                return { name: 'left', args: {} };
            }
        }
        else {
            if (typeof position === 'string') {
                return {
                    name: position,
                    args: {},
                };
            }
            if (typeof position === 'object') {
                return position;
            }
        }
        return { args: {} };
    };
    PortManager.prototype.getLabel = function (item, setDefaults) {
        if (setDefaults === void 0) { setDefaults = false; }
        var label = item.label || {};
        label.position = this.getPortLabelPosition(label.position, setDefaults);
        return label;
    };
    PortManager.prototype.getPortLabelLayout = function (port, portPosition, elemBBox) {
        var name = port.label.position.name || 'left';
        var args = port.label.position.args || {};
        var layoutFn = registry_1.PortLabelLayout.registry.get(name) || registry_1.PortLabelLayout.presets.left;
        if (layoutFn) {
            return layoutFn(portPosition, elemBBox, args);
        }
        return null;
    };
    return PortManager;
}());
exports.PortManager = PortManager;
//# sourceMappingURL=port.js.map