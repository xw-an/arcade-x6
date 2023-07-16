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
exports.Node = void 0;
var registry_1 = require("../registry");
var geometry_1 = require("../geometry");
var util_1 = require("../util");
var markup_1 = require("../view/markup");
var cell_1 = require("./cell");
var registry_2 = require("./registry");
var port_1 = require("./port");
var common_1 = require("../common");
var Node = /** @class */ (function (_super) {
    __extends(Node, _super);
    function Node(metadata) {
        if (metadata === void 0) { metadata = {}; }
        var _this = _super.call(this, metadata) || this;
        _this.initPorts();
        return _this;
    }
    Object.defineProperty(Node.prototype, Symbol.toStringTag, {
        get: function () {
            return Node.toStringTag;
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.preprocess = function (metadata, ignoreIdCheck) {
        var x = metadata.x, y = metadata.y, width = metadata.width, height = metadata.height, others = __rest(metadata, ["x", "y", "width", "height"]);
        if (x != null || y != null) {
            var position = others.position;
            others.position = __assign(__assign({}, position), { x: x != null ? x : position ? position.x : 0, y: y != null ? y : position ? position.y : 0 });
        }
        if (width != null || height != null) {
            var size = others.size;
            others.size = __assign(__assign({}, size), { width: width != null ? width : size ? size.width : 0, height: height != null ? height : size ? size.height : 0 });
        }
        return _super.prototype.preprocess.call(this, others, ignoreIdCheck);
    };
    Node.prototype.isNode = function () {
        return true;
    };
    Node.prototype.size = function (width, height, options) {
        if (width === undefined) {
            return this.getSize();
        }
        if (typeof width === 'number') {
            return this.setSize(width, height, options);
        }
        return this.setSize(width, height);
    };
    Node.prototype.getSize = function () {
        var size = this.store.get('size');
        return size ? __assign({}, size) : { width: 1, height: 1 };
    };
    Node.prototype.setSize = function (width, height, options) {
        if (typeof width === 'object') {
            this.resize(width.width, width.height, height);
        }
        else {
            this.resize(width, height, options);
        }
        return this;
    };
    Node.prototype.resize = function (width, height, options) {
        if (options === void 0) { options = {}; }
        this.startBatch('resize', options);
        var direction = options.direction;
        if (direction) {
            var currentSize = this.getSize();
            switch (direction) {
                case 'left':
                case 'right':
                    // Don't change height when resizing horizontally.
                    height = currentSize.height; // eslint-disable-line
                    break;
                case 'top':
                case 'bottom':
                    // Don't change width when resizing vertically.
                    width = currentSize.width; // eslint-disable-line
                    break;
                default:
                    break;
            }
            var map = {
                right: 0,
                'top-right': 0,
                top: 1,
                'top-left': 1,
                left: 2,
                'bottom-left': 2,
                bottom: 3,
                'bottom-right': 3,
            };
            var quadrant = map[direction];
            var angle = geometry_1.Angle.normalize(this.getAngle() || 0);
            if (options.absolute) {
                // We are taking the node's rotation into account
                quadrant += Math.floor((angle + 45) / 90);
                quadrant %= 4;
            }
            // This is a rectangle in size of the un-rotated node.
            var bbox = this.getBBox();
            // Pick the corner point on the node, which meant to stay on its
            // place before and after the rotation.
            var fixedPoint = void 0;
            if (quadrant === 0) {
                fixedPoint = bbox.getBottomLeft();
            }
            else if (quadrant === 1) {
                fixedPoint = bbox.getCorner();
            }
            else if (quadrant === 2) {
                fixedPoint = bbox.getTopRight();
            }
            else {
                fixedPoint = bbox.getOrigin();
            }
            // Find an image of the previous indent point. This is the position,
            // where is the point actually located on the screen.
            var imageFixedPoint = fixedPoint
                .clone()
                .rotate(-angle, bbox.getCenter());
            // Every point on the element rotates around a circle with the centre of
            // rotation in the middle of the element while the whole element is being
            // rotated. That means that the distance from a point in the corner of
            // the element (supposed its always rect) to the center of the element
            // doesn't change during the rotation and therefore it equals to a
            // distance on un-rotated element.
            // We can find the distance as DISTANCE = (ELEMENTWIDTH/2)^2 + (ELEMENTHEIGHT/2)^2)^0.5.
            var radius = Math.sqrt(width * width + height * height) / 2;
            // Now we are looking for an angle between x-axis and the line starting
            // at image of fixed point and ending at the center of the element.
            // We call this angle `alpha`.
            // The image of a fixed point is located in n-th quadrant. For each
            // quadrant passed going anti-clockwise we have to add 90 degrees.
            // Note that the first quadrant has index 0.
            //
            // 3 | 2
            // --c-- Quadrant positions around the element's center `c`
            // 0 | 1
            //
            var alpha = (quadrant * Math.PI) / 2;
            // Add an angle between the beginning of the current quadrant (line
            // parallel with x-axis or y-axis going through the center of the
            // element) and line crossing the indent of the fixed point and the
            // center of the element. This is the angle we need but on the
            // un-rotated element.
            alpha += Math.atan(quadrant % 2 === 0 ? height / width : width / height);
            // Lastly we have to deduct the original angle the element was rotated
            // by and that's it.
            alpha -= geometry_1.Angle.toRad(angle);
            // With this angle and distance we can easily calculate the centre of
            // the un-rotated element.
            // Note that fromPolar constructor accepts an angle in radians.
            var center = geometry_1.Point.fromPolar(radius, alpha, imageFixedPoint);
            // The top left corner on the un-rotated element has to be half a width
            // on the left and half a height to the top from the center. This will
            // be the origin of rectangle we were looking for.
            var origin_1 = center.clone().translate(width / -2, height / -2);
            this.store.set('size', { width: width, height: height }, options);
            this.setPosition(origin_1.x, origin_1.y, options);
        }
        else {
            this.store.set('size', { width: width, height: height }, options);
        }
        this.stopBatch('resize', options);
        return this;
    };
    Node.prototype.scale = function (sx, sy, origin, options) {
        if (options === void 0) { options = {}; }
        var scaledBBox = this.getBBox().scale(sx, sy, origin == null ? undefined : origin);
        this.startBatch('scale', options);
        this.setPosition(scaledBBox.x, scaledBBox.y, options);
        this.resize(scaledBBox.width, scaledBBox.height, options);
        this.stopBatch('scale');
        return this;
    };
    Node.prototype.position = function (arg0, arg1, arg2) {
        if (typeof arg0 === 'number') {
            return this.setPosition(arg0, arg1, arg2);
        }
        return this.getPosition(arg0);
    };
    Node.prototype.getPosition = function (options) {
        if (options === void 0) { options = {}; }
        if (options.relative) {
            var parent_1 = this.getParent();
            if (parent_1 != null && parent_1.isNode()) {
                var currentPosition = this.getPosition();
                var parentPosition = parent_1.getPosition();
                return {
                    x: currentPosition.x - parentPosition.x,
                    y: currentPosition.y - parentPosition.y,
                };
            }
        }
        var pos = this.store.get('position');
        return pos ? __assign({}, pos) : { x: 0, y: 0 };
    };
    Node.prototype.setPosition = function (arg0, arg1, arg2) {
        if (arg2 === void 0) { arg2 = {}; }
        var x;
        var y;
        var options;
        if (typeof arg0 === 'object') {
            x = arg0.x;
            y = arg0.y;
            options = arg1 || {};
        }
        else {
            x = arg0;
            y = arg1;
            options = arg2 || {};
        }
        if (options.relative) {
            var parent_2 = this.getParent();
            if (parent_2 != null && parent_2.isNode()) {
                var parentPosition = parent_2.getPosition();
                x += parentPosition.x;
                y += parentPosition.y;
            }
        }
        if (options.deep) {
            var currentPosition = this.getPosition();
            this.translate(x - currentPosition.x, y - currentPosition.y, options);
        }
        else {
            this.store.set('position', { x: x, y: y }, options);
        }
        return this;
    };
    Node.prototype.translate = function (tx, ty, options) {
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        if (options === void 0) { options = {}; }
        if (tx === 0 && ty === 0) {
            return this;
        }
        // Pass the initiator of the translation.
        options.translateBy = options.translateBy || this.id;
        var position = this.getPosition();
        if (options.restrict != null && options.translateBy === this.id) {
            // We are restricting the translation for the element itself only. We get
            // the bounding box of the element including all its embeds.
            // All embeds have to be translated the exact same way as the element.
            var bbox = this.getBBox({ deep: true });
            var ra = options.restrict;
            // - - - - - - - - - - - - -> ra.x + ra.width
            // - - - -> position.x      |
            // -> bbox.x
            //                ▓▓▓▓▓▓▓   |
            //         ░░░░░░░▓▓▓▓▓▓▓
            //         ░░░░░░░░░        |
            //   ▓▓▓▓▓▓▓▓░░░░░░░
            //   ▓▓▓▓▓▓▓▓               |
            //   <-dx->                     | restricted area right border
            //         <-width->        |   ░ translated element
            //   <- - bbox.width - ->       ▓ embedded element
            var dx = position.x - bbox.x;
            var dy = position.y - bbox.y;
            // Find the maximal/minimal coordinates that the element can be translated
            // while complies the restrictions.
            var x = Math.max(ra.x + dx, Math.min(ra.x + ra.width + dx - bbox.width, position.x + tx));
            var y = Math.max(ra.y + dy, Math.min(ra.y + ra.height + dy - bbox.height, position.y + ty));
            // recalculate the translation taking the restrictions into account.
            tx = x - position.x; // eslint-disable-line
            ty = y - position.y; // eslint-disable-line
        }
        var translatedPosition = {
            x: position.x + tx,
            y: position.y + ty,
        };
        // To find out by how much an element was translated in event
        // 'change:position' handlers.
        options.tx = tx;
        options.ty = ty;
        if (options.transition) {
            if (typeof options.transition !== 'object') {
                options.transition = {};
            }
            this.transition('position', translatedPosition, __assign(__assign({}, options.transition), { interp: common_1.Interp.object }));
            this.eachChild(function (child) {
                var _a;
                var excluded = (_a = options.exclude) === null || _a === void 0 ? void 0 : _a.includes(child);
                if (!excluded) {
                    child.translate(tx, ty, options);
                }
            });
        }
        else {
            this.startBatch('translate', options);
            this.store.set('position', translatedPosition, options);
            this.eachChild(function (child) {
                var _a;
                var excluded = (_a = options.exclude) === null || _a === void 0 ? void 0 : _a.includes(child);
                if (!excluded) {
                    child.translate(tx, ty, options);
                }
            });
            this.stopBatch('translate', options);
        }
        return this;
    };
    Node.prototype.angle = function (val, options) {
        if (val == null) {
            return this.getAngle();
        }
        return this.rotate(val, options);
    };
    Node.prototype.getAngle = function () {
        return this.store.get('angle', 0);
    };
    Node.prototype.rotate = function (angle, options) {
        if (options === void 0) { options = {}; }
        var currentAngle = this.getAngle();
        if (options.center) {
            var size = this.getSize();
            var position = this.getPosition();
            var center = this.getBBox().getCenter();
            center.rotate(currentAngle - angle, options.center);
            var dx = center.x - size.width / 2 - position.x;
            var dy = center.y - size.height / 2 - position.y;
            this.startBatch('rotate', { angle: angle, options: options });
            this.setPosition(position.x + dx, position.y + dy, options);
            this.rotate(angle, __assign(__assign({}, options), { center: null }));
            this.stopBatch('rotate');
        }
        else {
            this.store.set('angle', options.absolute ? angle : (currentAngle + angle) % 360, options);
        }
        return this;
    };
    // #endregion
    // #region common
    Node.prototype.getBBox = function (options) {
        if (options === void 0) { options = {}; }
        if (options.deep) {
            var cells = this.getDescendants({ deep: true, breadthFirst: true });
            cells.push(this);
            return cell_1.Cell.getCellsBBox(cells);
        }
        return geometry_1.Rectangle.fromPositionAndSize(this.getPosition(), this.getSize());
    };
    Node.prototype.getConnectionPoint = function (edge, type) {
        var bbox = this.getBBox();
        var center = bbox.getCenter();
        var terminal = edge.getTerminal(type);
        if (terminal == null) {
            return center;
        }
        var portId = terminal.port;
        if (!portId || !this.hasPort(portId)) {
            return center;
        }
        var port = this.getPort(portId);
        if (!port || !port.group) {
            return center;
        }
        var layouts = this.getPortsPosition(port.group);
        var position = layouts[portId].position;
        var portCenter = geometry_1.Point.create(position).translate(bbox.getOrigin());
        var angle = this.getAngle();
        if (angle) {
            portCenter.rotate(-angle, center);
        }
        return portCenter;
    };
    /**
     * Sets cell's size and position based on the children bbox and given padding.
     */
    Node.prototype.fit = function (options) {
        if (options === void 0) { options = {}; }
        var children = this.getChildren() || [];
        var embeds = children.filter(function (cell) { return cell.isNode(); });
        if (embeds.length === 0) {
            return this;
        }
        this.startBatch('fit-embeds', options);
        if (options.deep) {
            embeds.forEach(function (cell) { return cell.fit(options); });
        }
        var _a = cell_1.Cell.getCellsBBox(embeds), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        var padding = util_1.NumberExt.normalizeSides(options.padding);
        x -= padding.left;
        y -= padding.top;
        width += padding.left + padding.right;
        height += padding.bottom + padding.top;
        this.store.set({
            position: { x: x, y: y },
            size: { width: width, height: height },
        }, options);
        this.stopBatch('fit-embeds');
        return this;
    };
    Object.defineProperty(Node.prototype, "portContainerMarkup", {
        // #endregion
        // #region ports
        get: function () {
            return this.getPortContainerMarkup();
        },
        set: function (markup) {
            this.setPortContainerMarkup(markup);
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.getDefaultPortContainerMarkup = function () {
        return (this.store.get('defaultPortContainerMarkup') ||
            markup_1.Markup.getPortContainerMarkup());
    };
    Node.prototype.getPortContainerMarkup = function () {
        return (this.store.get('portContainerMarkup') ||
            this.getDefaultPortContainerMarkup());
    };
    Node.prototype.setPortContainerMarkup = function (markup, options) {
        if (options === void 0) { options = {}; }
        this.store.set('portContainerMarkup', markup_1.Markup.clone(markup), options);
        return this;
    };
    Object.defineProperty(Node.prototype, "portMarkup", {
        get: function () {
            return this.getPortMarkup();
        },
        set: function (markup) {
            this.setPortMarkup(markup);
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.getDefaultPortMarkup = function () {
        return this.store.get('defaultPortMarkup') || markup_1.Markup.getPortMarkup();
    };
    Node.prototype.getPortMarkup = function () {
        return this.store.get('portMarkup') || this.getDefaultPortMarkup();
    };
    Node.prototype.setPortMarkup = function (markup, options) {
        if (options === void 0) { options = {}; }
        this.store.set('portMarkup', markup_1.Markup.clone(markup), options);
        return this;
    };
    Object.defineProperty(Node.prototype, "portLabelMarkup", {
        get: function () {
            return this.getPortLabelMarkup();
        },
        set: function (markup) {
            this.setPortLabelMarkup(markup);
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.getDefaultPortLabelMarkup = function () {
        return (this.store.get('defaultPortLabelMarkup') || markup_1.Markup.getPortLabelMarkup());
    };
    Node.prototype.getPortLabelMarkup = function () {
        return this.store.get('portLabelMarkup') || this.getDefaultPortLabelMarkup();
    };
    Node.prototype.setPortLabelMarkup = function (markup, options) {
        if (options === void 0) { options = {}; }
        this.store.set('portLabelMarkup', markup_1.Markup.clone(markup), options);
        return this;
    };
    Object.defineProperty(Node.prototype, "ports", {
        get: function () {
            var res = this.store.get('ports', { items: [] });
            if (res.items == null) {
                res.items = [];
            }
            return res;
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.getPorts = function () {
        return util_1.ObjectExt.cloneDeep(this.ports.items);
    };
    Node.prototype.getPortsByGroup = function (groupName) {
        return this.getPorts().filter(function (port) { return port.group === groupName; });
    };
    Node.prototype.getPort = function (portId) {
        return util_1.ObjectExt.cloneDeep(this.ports.items.find(function (port) { return port.id && port.id === portId; }));
    };
    Node.prototype.getPortAt = function (index) {
        return this.ports.items[index] || null;
    };
    Node.prototype.hasPorts = function () {
        return this.ports.items.length > 0;
    };
    Node.prototype.hasPort = function (portId) {
        return this.getPortIndex(portId) !== -1;
    };
    Node.prototype.getPortIndex = function (port) {
        var portId = typeof port === 'string' ? port : port.id;
        return portId != null
            ? this.ports.items.findIndex(function (item) { return item.id === portId; })
            : -1;
    };
    Node.prototype.getPortsPosition = function (groupName) {
        var size = this.getSize();
        var layouts = this.port.getPortsLayoutByGroup(groupName, new geometry_1.Rectangle(0, 0, size.width, size.height));
        return layouts.reduce(function (memo, item) {
            var layout = item.portLayout;
            memo[item.portId] = {
                position: __assign({}, layout.position),
                angle: layout.angle || 0,
            };
            return memo;
        }, {});
    };
    Node.prototype.getPortProp = function (portId, path) {
        return this.getPropByPath(this.prefixPortPath(portId, path));
    };
    Node.prototype.setPortProp = function (portId, arg1, arg2, arg3) {
        if (typeof arg1 === 'string' || Array.isArray(arg1)) {
            var path_1 = this.prefixPortPath(portId, arg1);
            var value_1 = arg2;
            return this.setPropByPath(path_1, value_1, arg3);
        }
        var path = this.prefixPortPath(portId);
        var value = arg1;
        return this.setPropByPath(path, value, arg2);
    };
    Node.prototype.removePortProp = function (portId, path, options) {
        if (typeof path === 'string' || Array.isArray(path)) {
            return this.removePropByPath(this.prefixPortPath(portId, path), options);
        }
        return this.removePropByPath(this.prefixPortPath(portId), path);
    };
    Node.prototype.portProp = function (portId, path, value, options) {
        if (path == null) {
            return this.getPortProp(portId);
        }
        if (typeof path === 'string' || Array.isArray(path)) {
            if (arguments.length === 2) {
                return this.getPortProp(portId, path);
            }
            if (value == null) {
                return this.removePortProp(portId, path, options);
            }
            return this.setPortProp(portId, path, value, options);
        }
        return this.setPortProp(portId, path, value);
    };
    Node.prototype.prefixPortPath = function (portId, path) {
        var index = this.getPortIndex(portId);
        if (index === -1) {
            throw new Error("Unable to find port with id: \"" + portId + "\"");
        }
        if (path == null || path === '') {
            return ['ports', 'items', "" + index];
        }
        if (Array.isArray(path)) {
            return __spreadArray(['ports', 'items', "" + index], path, true);
        }
        return "ports/items/" + index + "/" + path;
    };
    Node.prototype.addPort = function (port, options) {
        var ports = __spreadArray([], this.ports.items, true);
        ports.push(port);
        this.setPropByPath('ports/items', ports, options);
        return this;
    };
    Node.prototype.addPorts = function (ports, options) {
        this.setPropByPath('ports/items', __spreadArray(__spreadArray([], this.ports.items, true), ports, true), options);
        return this;
    };
    Node.prototype.insertPort = function (index, port, options) {
        var ports = __spreadArray([], this.ports.items, true);
        ports.splice(index, 0, port);
        this.setPropByPath('ports/items', ports, options);
        return this;
    };
    Node.prototype.removePort = function (port, options) {
        if (options === void 0) { options = {}; }
        return this.removePortAt(this.getPortIndex(port), options);
    };
    Node.prototype.removePortAt = function (index, options) {
        if (options === void 0) { options = {}; }
        if (index >= 0) {
            var ports = __spreadArray([], this.ports.items, true);
            ports.splice(index, 1);
            options.rewrite = true;
            this.setPropByPath('ports/items', ports, options);
        }
        return this;
    };
    Node.prototype.removePorts = function (portsForRemoval, opt) {
        var options;
        if (Array.isArray(portsForRemoval)) {
            options = opt || {};
            if (portsForRemoval.length) {
                options.rewrite = true;
                var currentPorts = __spreadArray([], this.ports.items, true);
                var remainingPorts = currentPorts.filter(function (cp) {
                    return !portsForRemoval.some(function (p) {
                        var id = typeof p === 'string' ? p : p.id;
                        return cp.id === id;
                    });
                });
                this.setPropByPath('ports/items', remainingPorts, options);
            }
        }
        else {
            options = portsForRemoval || {};
            options.rewrite = true;
            this.setPropByPath('ports/items', [], options);
        }
        return this;
    };
    Node.prototype.getParsedPorts = function () {
        return this.port.getPorts();
    };
    Node.prototype.getParsedGroups = function () {
        return this.port.groups;
    };
    Node.prototype.getPortsLayoutByGroup = function (groupName, bbox) {
        return this.port.getPortsLayoutByGroup(groupName, bbox);
    };
    Node.prototype.initPorts = function () {
        var _this = this;
        this.updatePortData();
        this.on('change:ports', function () {
            _this.processRemovedPort();
            _this.updatePortData();
        });
    };
    Node.prototype.processRemovedPort = function () {
        var current = this.ports;
        var currentItemsMap = {};
        current.items.forEach(function (item) {
            if (item.id) {
                currentItemsMap[item.id] = true;
            }
        });
        var removed = {};
        var previous = this.store.getPrevious('ports') || {
            items: [],
        };
        previous.items.forEach(function (item) {
            if (item.id && !currentItemsMap[item.id]) {
                removed[item.id] = true;
            }
        });
        var model = this.model;
        if (model && !util_1.ObjectExt.isEmpty(removed)) {
            var incomings = model.getConnectedEdges(this, { incoming: true });
            incomings.forEach(function (edge) {
                var portId = edge.getTargetPortId();
                if (portId && removed[portId]) {
                    edge.remove();
                }
            });
            var outgoings = model.getConnectedEdges(this, { outgoing: true });
            outgoings.forEach(function (edge) {
                var portId = edge.getSourcePortId();
                if (portId && removed[portId]) {
                    edge.remove();
                }
            });
        }
    };
    Node.prototype.validatePorts = function () {
        var _this = this;
        var ids = {};
        var errors = [];
        this.ports.items.forEach(function (p) {
            if (typeof p !== 'object') {
                errors.push("Invalid port " + p + ".");
            }
            if (p.id == null) {
                p.id = _this.generatePortId();
            }
            if (ids[p.id]) {
                errors.push('Duplicitied port id.');
            }
            ids[p.id] = true;
        });
        return errors;
    };
    Node.prototype.generatePortId = function () {
        return util_1.StringExt.uuid();
    };
    Node.prototype.updatePortData = function () {
        var err = this.validatePorts();
        if (err.length > 0) {
            this.store.set('ports', this.store.getPrevious('ports'));
            throw new Error(err.join(' '));
        }
        var prev = this.port ? this.port.getPorts() : null;
        this.port = new port_1.PortManager(this.ports);
        var curr = this.port.getPorts();
        var added = prev
            ? curr.filter(function (item) {
                if (!prev.find(function (prevPort) { return prevPort.id === item.id; })) {
                    return item;
                }
                return null;
            })
            : __spreadArray([], curr, true);
        var removed = prev
            ? prev.filter(function (item) {
                if (!curr.find(function (curPort) { return curPort.id === item.id; })) {
                    return item;
                }
                return null;
            })
            : [];
        if (added.length > 0) {
            this.notify('ports:added', { added: added, cell: this, node: this });
        }
        if (removed.length > 0) {
            this.notify('ports:removed', { removed: removed, cell: this, node: this });
        }
    };
    Node.defaults = {
        angle: 0,
        position: { x: 0, y: 0 },
        size: { width: 1, height: 1 },
    };
    return Node;
}(cell_1.Cell));
exports.Node = Node;
(function (Node) {
    Node.toStringTag = "X6." + Node.name;
    function isNode(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Node) {
            return true;
        }
        var tag = instance[Symbol.toStringTag];
        var node = instance;
        if ((tag == null || tag === Node.toStringTag) &&
            typeof node.isNode === 'function' &&
            typeof node.isEdge === 'function' &&
            typeof node.prop === 'function' &&
            typeof node.attr === 'function' &&
            typeof node.size === 'function' &&
            typeof node.position === 'function') {
            return true;
        }
        return false;
    }
    Node.isNode = isNode;
})(Node = exports.Node || (exports.Node = {}));
exports.Node = Node;
(function (Node) {
    Node.config({
        propHooks: function (_a) {
            var ports = _a.ports, metadata = __rest(_a, ["ports"]);
            if (ports) {
                metadata.ports = Array.isArray(ports) ? { items: ports } : ports;
            }
            return metadata;
        },
    });
})(Node = exports.Node || (exports.Node = {}));
exports.Node = Node;
(function (Node) {
    Node.registry = registry_1.Registry.create({
        type: 'node',
        process: function (shape, options) {
            if (registry_2.ShareRegistry.exist(shape, true)) {
                throw new Error("Node with name '" + shape + "' was registered by anthor Edge");
            }
            if (typeof options === 'function') {
                options.config({ shape: shape });
                return options;
            }
            var parent = Node;
            var inherit = options.inherit, config = __rest(options, ["inherit"]);
            if (inherit) {
                if (typeof inherit === 'string') {
                    var base = this.get(inherit);
                    if (base == null) {
                        this.onNotFound(inherit, 'inherited');
                    }
                    else {
                        parent = base;
                    }
                }
                else {
                    parent = inherit;
                }
            }
            if (config.constructorName == null) {
                config.constructorName = shape;
            }
            var ctor = parent.define.call(parent, config);
            ctor.config({ shape: shape });
            return ctor;
        },
    });
    registry_2.ShareRegistry.setNodeRegistry(Node.registry);
})(Node = exports.Node || (exports.Node = {}));
exports.Node = Node;
(function (Node) {
    var counter = 0;
    function getClassName(name) {
        if (name) {
            return util_1.StringExt.pascalCase(name);
        }
        counter += 1;
        return "CustomNode" + counter;
    }
    function define(config) {
        var constructorName = config.constructorName, overwrite = config.overwrite, others = __rest(config, ["constructorName", "overwrite"]);
        var ctor = util_1.ObjectExt.createClass(getClassName(constructorName || others.shape), this);
        ctor.config(others);
        if (others.shape) {
            Node.registry.register(others.shape, ctor, overwrite);
        }
        return ctor;
    }
    Node.define = define;
    function create(options) {
        var shape = options.shape || 'rect';
        var Ctor = Node.registry.get(shape);
        if (Ctor) {
            return new Ctor(options);
        }
        return Node.registry.onNotFound(shape);
    }
    Node.create = create;
})(Node = exports.Node || (exports.Node = {}));
exports.Node = Node;
//# sourceMappingURL=node.js.map