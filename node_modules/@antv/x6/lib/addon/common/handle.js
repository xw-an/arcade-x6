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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = void 0;
var util_1 = require("../../util");
var view_1 = require("../../view/view");
var geometry_1 = require("../../geometry");
var Handle = /** @class */ (function () {
    function Handle() {
    }
    Object.defineProperty(Handle.prototype, "handleClassName", {
        get: function () {
            return ClassNames.handle;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Handle.prototype, "pie", {
        get: function () {
            return __assign(__assign({}, Handle.defaultPieOptions), this.handleOptions.pie);
        },
        enumerable: false,
        configurable: true
    });
    Handle.prototype.initHandles = function () {
        var _a;
        var _this = this;
        this.handles = [];
        if (this.handleOptions.handles) {
            this.handleOptions.handles.forEach(function (handle) { return _this.addHandle(handle); });
        }
        if (this.handleOptions.type === 'pie') {
            if (this.pie.toggles) {
                var className_1 = ClassNames.pieToggle;
                this.$pieToggles = {};
                this.pie.toggles.forEach(function (item) {
                    var $elem = _this.$('<div/>');
                    _this.applyAttrs($elem, item.attrs);
                    $elem
                        .addClass(className_1)
                        .addClass(className_1 + "-pos-" + (item.position || 'e'))
                        .attr('data-name', item.name)
                        .appendTo(_this.container);
                    _this.$pieToggles[item.name] = $elem;
                });
            }
            this.setPieIcons();
        }
        if (this.$handleContainer) {
            var type = this.handleOptions.type || 'surround';
            this.$handleContainer
                .addClass(ClassNames.wrap)
                .addClass(ClassNames.animate)
                .addClass(ClassNames.handle + "-" + type);
        }
        this.delegateEvents((_a = {},
            _a["mousedown ." + ClassNames.handle] = 'onHandleMouseDown',
            _a["touchstart ." + ClassNames.handle] = 'onHandleMouseDown',
            _a["mousedown ." + ClassNames.pieToggle] = 'onPieToggleMouseDown',
            _a["touchstart ." + ClassNames.pieToggle] = 'onPieToggleMouseDown',
            _a));
    };
    Handle.prototype.onHandleMouseDown = function (evt) {
        var action = this.$(evt.currentTarget)
            .closest("." + ClassNames.handle)
            .attr('data-action');
        if (action) {
            evt.preventDefault();
            evt.stopPropagation();
            this.setEventData(evt, {
                action: action,
                clientX: evt.clientX,
                clientY: evt.clientY,
                startX: evt.clientX,
                startY: evt.clientY,
            });
            if (evt.type === 'mousedown' && evt.button === 2) {
                this.triggerHandleAction(action, 'contextmenu', evt);
            }
            else {
                this.triggerHandleAction(action, 'mousedown', evt);
                this.delegateDocumentEvents({
                    mousemove: 'onHandleMouseMove',
                    touchmove: 'onHandleMouseMove',
                    mouseup: 'onHandleMouseUp',
                    touchend: 'onHandleMouseUp',
                    touchcancel: 'onHandleMouseUp',
                }, evt.data);
            }
        }
    };
    Handle.prototype.onHandleMouseMove = function (evt) {
        var data = this.getEventData(evt);
        var action = data.action;
        if (action) {
            this.triggerHandleAction(action, 'mousemove', evt);
        }
    };
    Handle.prototype.onHandleMouseUp = function (evt) {
        var data = this.getEventData(evt);
        var action = data.action;
        if (action) {
            this.triggerHandleAction(action, 'mouseup', evt);
            this.undelegateDocumentEvents();
        }
    };
    Handle.prototype.triggerHandleAction = function (action, eventName, evt, args) {
        evt.preventDefault();
        evt.stopPropagation();
        var e = this.normalizeEvent(evt);
        var data = this.getEventData(e);
        var local = this.graph.snapToGrid(e.clientX, e.clientY);
        var origin = this.graph.snapToGrid(data.clientX, data.clientY);
        var dx = local.x - origin.x;
        var dy = local.y - origin.y;
        this.trigger("action:" + action + ":" + eventName, __assign({ e: e, dx: dx, dy: dy, x: local.x, y: local.y, offsetX: evt.clientX - data.startX, offsetY: evt.clientY - data.startY }, args));
        data.clientX = evt.clientX;
        data.clientY = evt.clientY;
    };
    Handle.prototype.onPieToggleMouseDown = function (evt) {
        evt.stopPropagation();
        var name = this.$(evt.target)
            .closest("." + ClassNames.pieToggle)
            .attr('data-name');
        if (!this.isOpen(name)) {
            if (this.isOpen()) {
                this.toggleState();
            }
        }
        this.toggleState(name);
    };
    Handle.prototype.setPieIcons = function () {
        var _this = this;
        if (this.handleOptions.type === 'pie') {
            this.$handleContainer.find("." + ClassNames.handle).each(function (_, elem) {
                var $elem = _this.$(elem);
                var action = $elem.attr('data-action');
                var className = ClassNames.pieSlice;
                var handle = _this.getHandle(action);
                if (!handle || !handle.icon) {
                    var contect = window
                        .getComputedStyle(elem, ':before')
                        .getPropertyValue('content');
                    if (contect && contect !== 'none') {
                        var $icons = $elem.find("." + className + "-txt");
                        if ($icons.length) {
                            util_1.Vector.create($icons[0]).text(contect.replace(/['"]/g, ''));
                        }
                    }
                    var bgImg = $elem.css('background-image');
                    if (bgImg) {
                        var matches = bgImg.match(/url\(['"]?([^'"]+)['"]?\)/);
                        if (matches) {
                            var href = matches[1];
                            var $imgs = $elem.find("." + className + "-img");
                            if ($imgs.length > 0) {
                                util_1.Vector.create($imgs[0]).attr('xlink:href', href);
                            }
                        }
                    }
                }
            });
        }
    };
    Handle.prototype.getHandleIdx = function (name) {
        return this.handles.findIndex(function (item) { return item.name === name; });
    };
    Handle.prototype.hasHandle = function (name) {
        return this.getHandleIdx(name) >= 0;
    };
    Handle.prototype.getHandle = function (name) {
        return this.handles.find(function (item) { return item.name === name; });
    };
    Handle.prototype.renderHandle = function (handle) {
        var $handle = this.$('<div/>')
            .addClass(ClassNames.handle + " " + ClassNames.handle + "-" + handle.name)
            .attr('data-action', handle.name)
            .prop('draggable', false);
        if (this.handleOptions.type === 'pie') {
            var index = this.getHandleIdx(handle.name);
            var pie = this.pie;
            var outerRadius = pie.outerRadius;
            var innerRadius = pie.innerRadius;
            var offset = (outerRadius + innerRadius) / 2;
            var ratio = new geometry_1.Point(outerRadius, outerRadius);
            var delta = geometry_1.Angle.toRad(pie.sliceAngle);
            var curRad = index * delta + geometry_1.Angle.toRad(pie.startAngle);
            var nextRad = curRad + delta;
            var pathData = util_1.Dom.createSlicePathData(innerRadius, outerRadius, curRad, nextRad);
            var vSvg = util_1.Vector.create('svg').addClass(ClassNames.pieSlice + "-svg");
            var vPath = util_1.Vector.create('path')
                .addClass(ClassNames.pieSlice)
                .attr('d', pathData)
                .translate(outerRadius, outerRadius);
            var pos = geometry_1.Point.fromPolar(offset, -curRad - delta / 2, ratio).toJSON();
            var iconSize = pie.iconSize;
            var vImg = util_1.Vector.create('image')
                .attr(pos)
                .addClass(ClassNames.pieSlice + "-img");
            pos.y = pos.y + iconSize - 2;
            var vText = util_1.Vector.create('text', { 'font-size': iconSize })
                .attr(pos)
                .addClass(ClassNames.pieSlice + "-txt");
            vImg.attr({
                width: iconSize,
                height: iconSize,
            });
            vImg.translate(-iconSize / 2, -iconSize / 2);
            vText.translate(-iconSize / 2, -iconSize / 2);
            vSvg.append([vPath, vImg, vText]);
            $handle.append(vSvg.node);
        }
        else {
            $handle.addClass(ClassNames.handle + "-pos-" + handle.position);
            if (handle.content) {
                if (typeof handle.content === 'string') {
                    $handle.html(handle.content);
                }
                else {
                    $handle.append(handle.content);
                }
            }
        }
        this.updateHandleIcon($handle, handle.icon);
        this.applyAttrs($handle, handle.attrs);
        return $handle;
    };
    Handle.prototype.addHandle = function (handle) {
        var _this = this;
        if (!this.hasHandle(handle.name)) {
            this.handles.push(handle);
            var events_1 = handle.events;
            if (events_1) {
                Object.keys(events_1).forEach(function (action) {
                    var callback = events_1[action];
                    var name = "action:" + handle.name + ":" + action;
                    if (typeof callback === 'string') {
                        _this.on(name, _this[callback], _this);
                    }
                    else {
                        _this.on(name, callback);
                    }
                });
            }
            if (this.$handleContainer) {
                this.$handleContainer.append(this.renderHandle(handle));
            }
        }
        return this;
    };
    Handle.prototype.addHandles = function (handles) {
        var _this = this;
        handles.forEach(function (handle) { return _this.addHandle(handle); });
        return this;
    };
    Handle.prototype.removeHandles = function () {
        while (this.handles.length) {
            this.removeHandle(this.handles[0].name);
        }
        return this;
    };
    Handle.prototype.removeHandle = function (name) {
        var _this = this;
        var index = this.getHandleIdx(name);
        var handle = this.handles[index];
        if (handle) {
            if (handle.events) {
                Object.keys(handle.events).forEach(function (event) {
                    _this.off("action:" + name + ":" + event);
                });
            }
            this.getHandleElem(name).remove();
            this.handles.splice(index, 1);
        }
        return this;
    };
    Handle.prototype.changeHandle = function (name, newHandle) {
        var handle = this.getHandle(name);
        if (handle) {
            this.removeHandle(name);
            this.addHandle(__assign(__assign({}, handle), newHandle));
        }
        return this;
    };
    Handle.prototype.toggleHandle = function (name, selected) {
        var handle = this.getHandle(name);
        if (handle) {
            var $handle = this.getHandleElem(name);
            var className = ClassNames.handle + "-selected";
            if (selected === undefined) {
                selected = !$handle.hasClass(className); // eslint-disable-line
            }
            $handle.toggleClass(className, selected);
            var icon = selected ? handle.iconSelected : handle.icon;
            if (icon) {
                this.updateHandleIcon($handle, icon);
            }
        }
        return this;
    };
    Handle.prototype.selectHandle = function (name) {
        return this.toggleHandle(name, true);
    };
    Handle.prototype.deselectHandle = function (name) {
        return this.toggleHandle(name, false);
    };
    Handle.prototype.deselectAllHandles = function () {
        var _this = this;
        this.handles.forEach(function (handle) { return _this.deselectHandle(handle.name); });
        return this;
    };
    Handle.prototype.getHandleElem = function (name) {
        return this.$handleContainer.find("." + ClassNames.handle + "-" + name);
    };
    Handle.prototype.updateHandleIcon = function ($handle, icon) {
        if (this.handleOptions.type === 'pie') {
            var $icons = $handle.find("." + ClassNames.pieSliceImg);
            this.$($icons[0]).attr('xlink:href', icon || '');
        }
        else {
            $handle.css('background-image', icon ? "url(" + icon + ")" : '');
        }
    };
    Handle.prototype.isRendered = function () {
        return this.$handleContainer != null;
    };
    Handle.prototype.isOpen = function (name) {
        if (this.isRendered()) {
            return name
                ? this.$pieToggles[name].hasClass(ClassNames.pieToggleOpened)
                : this.$handleContainer.hasClass("" + ClassNames.pieOpended);
        }
        return false;
    };
    Handle.prototype.toggleState = function (name) {
        var _this = this;
        if (this.isRendered()) {
            var $handleContainer = this.$handleContainer;
            Object.keys(this.$pieToggles).forEach(function (key) {
                var $toggle = _this.$pieToggles[key];
                $toggle.removeClass(ClassNames.pieToggleOpened);
            });
            if (this.isOpen()) {
                this.trigger('pie:close', { name: name });
                $handleContainer.removeClass(ClassNames.pieOpended);
            }
            else {
                this.trigger('pie:open', { name: name });
                if (name) {
                    var toggles = this.pie.toggles;
                    var toggle = toggles && toggles.find(function (i) { return i.name === name; });
                    if (toggle) {
                        $handleContainer.attr({
                            'data-pie-toggle-name': toggle.name,
                            'data-pie-toggle-position': toggle.position,
                        });
                    }
                    this.$pieToggles[name].addClass(ClassNames.pieToggleOpened);
                }
                $handleContainer.addClass(ClassNames.pieOpended);
            }
        }
    };
    Handle.prototype.applyAttrs = function (elem, attrs) {
        if (attrs) {
            var $elem_1 = view_1.View.$(elem);
            Object.keys(attrs).forEach(function (selector) {
                var $element = $elem_1.find(selector).addBack().filter(selector);
                var _a = attrs[selector], cls = _a.class, attr = __rest(_a, ["class"]);
                if (cls) {
                    $element.addClass(cls);
                }
                $element.attr(attr);
            });
        }
    };
    return Handle;
}());
exports.Handle = Handle;
(function (Handle) {
    Handle.defaultPieOptions = {
        innerRadius: 20,
        outerRadius: 50,
        sliceAngle: 45,
        startAngle: 0,
        iconSize: 14,
        toggles: [
            {
                name: 'default',
                position: 'e',
            },
        ],
    };
})(Handle = exports.Handle || (exports.Handle = {}));
exports.Handle = Handle;
var ClassNames;
(function (ClassNames) {
    ClassNames.handle = view_1.View.prototype.prefixClassName('widget-handle');
    ClassNames.wrap = ClassNames.handle + "-wrap";
    ClassNames.animate = ClassNames.handle + "-animate";
    ClassNames.pieOpended = ClassNames.handle + "-pie-opened";
    ClassNames.pieToggle = ClassNames.handle + "-pie-toggle";
    ClassNames.pieToggleOpened = ClassNames.handle + "-pie-toggle-opened";
    ClassNames.pieSlice = ClassNames.handle + "-pie-slice";
    ClassNames.pieSliceImg = ClassNames.handle + "-pie-slice-img";
})(ClassNames || (ClassNames = {}));
//# sourceMappingURL=handle.js.map