import { PortLayout, PortLabelLayout } from '../registry';
import { ObjectExt } from '../util';
import { Point } from '../geometry';
export class PortManager {
    constructor(data) {
        this.ports = [];
        this.groups = {};
        this.init(ObjectExt.cloneDeep(data));
    }
    getPorts() {
        return this.ports;
    }
    getGroup(groupName) {
        return groupName != null ? this.groups[groupName] : null;
    }
    getPortsByGroup(groupName) {
        return this.ports.filter((p) => p.group === groupName || (p.group == null && groupName == null));
    }
    getPortsLayoutByGroup(groupName, elemBBox) {
        const ports = this.getPortsByGroup(groupName);
        const group = groupName ? this.getGroup(groupName) : null;
        const groupPosition = group ? group.position : null;
        const groupPositionName = groupPosition ? groupPosition.name : null;
        let layoutFn;
        if (groupPositionName != null) {
            const fn = PortLayout.registry.get(groupPositionName);
            if (fn == null) {
                return PortLayout.registry.onNotFound(groupPositionName);
            }
            layoutFn = fn;
        }
        else {
            layoutFn = PortLayout.presets.left;
        }
        const portsArgs = ports.map((port) => (port && port.position && port.position.args) || {});
        const groupArgs = (groupPosition && groupPosition.args) || {};
        const layouts = layoutFn(portsArgs, elemBBox, groupArgs);
        return layouts.map((portLayout, index) => {
            const port = ports[index];
            return {
                portLayout,
                portId: port.id,
                portSize: port.size,
                portAttrs: port.attrs,
                labelSize: port.label.size,
                labelLayout: this.getPortLabelLayout(port, Point.create(portLayout.position), elemBBox),
            };
        });
    }
    init(data) {
        const { groups, items } = data;
        if (groups != null) {
            Object.keys(groups).forEach((key) => {
                this.groups[key] = this.parseGroup(groups[key]);
            });
        }
        if (Array.isArray(items)) {
            items.forEach((item) => {
                this.ports.push(this.parsePort(item));
            });
        }
    }
    parseGroup(group) {
        return Object.assign(Object.assign({}, group), { label: this.getLabel(group, true), position: this.getPortPosition(group.position, true) });
    }
    parsePort(port) {
        const result = Object.assign({}, port);
        const group = this.getGroup(port.group) || {};
        result.markup = result.markup || group.markup;
        result.attrs = ObjectExt.merge({}, group.attrs, result.attrs);
        result.position = this.createPosition(group, result);
        result.label = ObjectExt.merge({}, group.label, this.getLabel(result));
        result.zIndex = this.getZIndex(group, result);
        result.size = Object.assign(Object.assign({}, group.size), result.size);
        return result;
    }
    getZIndex(group, port) {
        if (typeof port.zIndex === 'number') {
            return port.zIndex;
        }
        if (typeof group.zIndex === 'number' || group.zIndex === 'auto') {
            return group.zIndex;
        }
        return 'auto';
    }
    createPosition(group, port) {
        return ObjectExt.merge({
            name: 'left',
            args: {},
        }, group.position, { args: port.args });
    }
    getPortPosition(position, setDefault = false) {
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
    }
    getPortLabelPosition(position, setDefault = false) {
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
    }
    getLabel(item, setDefaults = false) {
        const label = item.label || {};
        label.position = this.getPortLabelPosition(label.position, setDefaults);
        return label;
    }
    getPortLabelLayout(port, portPosition, elemBBox) {
        const name = port.label.position.name || 'left';
        const args = port.label.position.args || {};
        const layoutFn = PortLabelLayout.registry.get(name) || PortLabelLayout.presets.left;
        if (layoutFn) {
            return layoutFn(portPosition, elemBBox, args);
        }
        return null;
    }
}
//# sourceMappingURL=port.js.map