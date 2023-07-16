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
import { Dom, Vector } from '../../util';
import { View } from '../../view/view';
import { Point, Angle } from '../../geometry';
export class Handle {
    get handleClassName() {
        return ClassNames.handle;
    }
    get pie() {
        return Object.assign(Object.assign({}, Handle.defaultPieOptions), this.handleOptions.pie);
    }
    initHandles() {
        this.handles = [];
        if (this.handleOptions.handles) {
            this.handleOptions.handles.forEach((handle) => this.addHandle(handle));
        }
        if (this.handleOptions.type === 'pie') {
            if (this.pie.toggles) {
                const className = ClassNames.pieToggle;
                this.$pieToggles = {};
                this.pie.toggles.forEach((item) => {
                    const $elem = this.$('<div/>');
                    this.applyAttrs($elem, item.attrs);
                    $elem
                        .addClass(className)
                        .addClass(`${className}-pos-${item.position || 'e'}`)
                        .attr('data-name', item.name)
                        .appendTo(this.container);
                    this.$pieToggles[item.name] = $elem;
                });
            }
            this.setPieIcons();
        }
        if (this.$handleContainer) {
            const type = this.handleOptions.type || 'surround';
            this.$handleContainer
                .addClass(ClassNames.wrap)
                .addClass(ClassNames.animate)
                .addClass(`${ClassNames.handle}-${type}`);
        }
        this.delegateEvents({
            [`mousedown .${ClassNames.handle}`]: 'onHandleMouseDown',
            [`touchstart .${ClassNames.handle}`]: 'onHandleMouseDown',
            [`mousedown .${ClassNames.pieToggle}`]: 'onPieToggleMouseDown',
            [`touchstart .${ClassNames.pieToggle}`]: 'onPieToggleMouseDown',
        });
    }
    onHandleMouseDown(evt) {
        const action = this.$(evt.currentTarget)
            .closest(`.${ClassNames.handle}`)
            .attr('data-action');
        if (action) {
            evt.preventDefault();
            evt.stopPropagation();
            this.setEventData(evt, {
                action,
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
    }
    onHandleMouseMove(evt) {
        const data = this.getEventData(evt);
        const action = data.action;
        if (action) {
            this.triggerHandleAction(action, 'mousemove', evt);
        }
    }
    onHandleMouseUp(evt) {
        const data = this.getEventData(evt);
        const action = data.action;
        if (action) {
            this.triggerHandleAction(action, 'mouseup', evt);
            this.undelegateDocumentEvents();
        }
    }
    triggerHandleAction(action, eventName, evt, args) {
        evt.preventDefault();
        evt.stopPropagation();
        const e = this.normalizeEvent(evt);
        const data = this.getEventData(e);
        const local = this.graph.snapToGrid(e.clientX, e.clientY);
        const origin = this.graph.snapToGrid(data.clientX, data.clientY);
        const dx = local.x - origin.x;
        const dy = local.y - origin.y;
        this.trigger(`action:${action}:${eventName}`, Object.assign({ e,
            dx,
            dy, x: local.x, y: local.y, offsetX: evt.clientX - data.startX, offsetY: evt.clientY - data.startY }, args));
        data.clientX = evt.clientX;
        data.clientY = evt.clientY;
    }
    onPieToggleMouseDown(evt) {
        evt.stopPropagation();
        const name = this.$(evt.target)
            .closest(`.${ClassNames.pieToggle}`)
            .attr('data-name');
        if (!this.isOpen(name)) {
            if (this.isOpen()) {
                this.toggleState();
            }
        }
        this.toggleState(name);
    }
    setPieIcons() {
        if (this.handleOptions.type === 'pie') {
            this.$handleContainer.find(`.${ClassNames.handle}`).each((_, elem) => {
                const $elem = this.$(elem);
                const action = $elem.attr('data-action');
                const className = ClassNames.pieSlice;
                const handle = this.getHandle(action);
                if (!handle || !handle.icon) {
                    const contect = window
                        .getComputedStyle(elem, ':before')
                        .getPropertyValue('content');
                    if (contect && contect !== 'none') {
                        const $icons = $elem.find(`.${className}-txt`);
                        if ($icons.length) {
                            Vector.create($icons[0]).text(contect.replace(/['"]/g, ''));
                        }
                    }
                    const bgImg = $elem.css('background-image');
                    if (bgImg) {
                        const matches = bgImg.match(/url\(['"]?([^'"]+)['"]?\)/);
                        if (matches) {
                            const href = matches[1];
                            const $imgs = $elem.find(`.${className}-img`);
                            if ($imgs.length > 0) {
                                Vector.create($imgs[0]).attr('xlink:href', href);
                            }
                        }
                    }
                }
            });
        }
    }
    getHandleIdx(name) {
        return this.handles.findIndex((item) => item.name === name);
    }
    hasHandle(name) {
        return this.getHandleIdx(name) >= 0;
    }
    getHandle(name) {
        return this.handles.find((item) => item.name === name);
    }
    renderHandle(handle) {
        const $handle = this.$('<div/>')
            .addClass(`${ClassNames.handle} ${ClassNames.handle}-${handle.name}`)
            .attr('data-action', handle.name)
            .prop('draggable', false);
        if (this.handleOptions.type === 'pie') {
            const index = this.getHandleIdx(handle.name);
            const pie = this.pie;
            const outerRadius = pie.outerRadius;
            const innerRadius = pie.innerRadius;
            const offset = (outerRadius + innerRadius) / 2;
            const ratio = new Point(outerRadius, outerRadius);
            const delta = Angle.toRad(pie.sliceAngle);
            const curRad = index * delta + Angle.toRad(pie.startAngle);
            const nextRad = curRad + delta;
            const pathData = Dom.createSlicePathData(innerRadius, outerRadius, curRad, nextRad);
            const vSvg = Vector.create('svg').addClass(`${ClassNames.pieSlice}-svg`);
            const vPath = Vector.create('path')
                .addClass(ClassNames.pieSlice)
                .attr('d', pathData)
                .translate(outerRadius, outerRadius);
            const pos = Point.fromPolar(offset, -curRad - delta / 2, ratio).toJSON();
            const iconSize = pie.iconSize;
            const vImg = Vector.create('image')
                .attr(pos)
                .addClass(`${ClassNames.pieSlice}-img`);
            pos.y = pos.y + iconSize - 2;
            const vText = Vector.create('text', { 'font-size': iconSize })
                .attr(pos)
                .addClass(`${ClassNames.pieSlice}-txt`);
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
            $handle.addClass(`${ClassNames.handle}-pos-${handle.position}`);
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
    }
    addHandle(handle) {
        if (!this.hasHandle(handle.name)) {
            this.handles.push(handle);
            const events = handle.events;
            if (events) {
                Object.keys(events).forEach((action) => {
                    const callback = events[action];
                    const name = `action:${handle.name}:${action}`;
                    if (typeof callback === 'string') {
                        this.on(name, this[callback], this);
                    }
                    else {
                        this.on(name, callback);
                    }
                });
            }
            if (this.$handleContainer) {
                this.$handleContainer.append(this.renderHandle(handle));
            }
        }
        return this;
    }
    addHandles(handles) {
        handles.forEach((handle) => this.addHandle(handle));
        return this;
    }
    removeHandles() {
        while (this.handles.length) {
            this.removeHandle(this.handles[0].name);
        }
        return this;
    }
    removeHandle(name) {
        const index = this.getHandleIdx(name);
        const handle = this.handles[index];
        if (handle) {
            if (handle.events) {
                Object.keys(handle.events).forEach((event) => {
                    this.off(`action:${name}:${event}`);
                });
            }
            this.getHandleElem(name).remove();
            this.handles.splice(index, 1);
        }
        return this;
    }
    changeHandle(name, newHandle) {
        const handle = this.getHandle(name);
        if (handle) {
            this.removeHandle(name);
            this.addHandle(Object.assign(Object.assign({}, handle), newHandle));
        }
        return this;
    }
    toggleHandle(name, selected) {
        const handle = this.getHandle(name);
        if (handle) {
            const $handle = this.getHandleElem(name);
            const className = `${ClassNames.handle}-selected`;
            if (selected === undefined) {
                selected = !$handle.hasClass(className); // eslint-disable-line
            }
            $handle.toggleClass(className, selected);
            const icon = selected ? handle.iconSelected : handle.icon;
            if (icon) {
                this.updateHandleIcon($handle, icon);
            }
        }
        return this;
    }
    selectHandle(name) {
        return this.toggleHandle(name, true);
    }
    deselectHandle(name) {
        return this.toggleHandle(name, false);
    }
    deselectAllHandles() {
        this.handles.forEach((handle) => this.deselectHandle(handle.name));
        return this;
    }
    getHandleElem(name) {
        return this.$handleContainer.find(`.${ClassNames.handle}-${name}`);
    }
    updateHandleIcon($handle, icon) {
        if (this.handleOptions.type === 'pie') {
            const $icons = $handle.find(`.${ClassNames.pieSliceImg}`);
            this.$($icons[0]).attr('xlink:href', icon || '');
        }
        else {
            $handle.css('background-image', icon ? `url(${icon})` : '');
        }
    }
    isRendered() {
        return this.$handleContainer != null;
    }
    isOpen(name) {
        if (this.isRendered()) {
            return name
                ? this.$pieToggles[name].hasClass(ClassNames.pieToggleOpened)
                : this.$handleContainer.hasClass(`${ClassNames.pieOpended}`);
        }
        return false;
    }
    toggleState(name) {
        if (this.isRendered()) {
            const $handleContainer = this.$handleContainer;
            Object.keys(this.$pieToggles).forEach((key) => {
                const $toggle = this.$pieToggles[key];
                $toggle.removeClass(ClassNames.pieToggleOpened);
            });
            if (this.isOpen()) {
                this.trigger('pie:close', { name });
                $handleContainer.removeClass(ClassNames.pieOpended);
            }
            else {
                this.trigger('pie:open', { name });
                if (name) {
                    const toggles = this.pie.toggles;
                    const toggle = toggles && toggles.find((i) => i.name === name);
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
    }
    applyAttrs(elem, attrs) {
        if (attrs) {
            const $elem = View.$(elem);
            Object.keys(attrs).forEach((selector) => {
                const $element = $elem.find(selector).addBack().filter(selector);
                const _a = attrs[selector], { class: cls } = _a, attr = __rest(_a, ["class"]);
                if (cls) {
                    $element.addClass(cls);
                }
                $element.attr(attr);
            });
        }
    }
}
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
})(Handle || (Handle = {}));
var ClassNames;
(function (ClassNames) {
    ClassNames.handle = View.prototype.prefixClassName('widget-handle');
    ClassNames.wrap = `${ClassNames.handle}-wrap`;
    ClassNames.animate = `${ClassNames.handle}-animate`;
    ClassNames.pieOpended = `${ClassNames.handle}-pie-opened`;
    ClassNames.pieToggle = `${ClassNames.handle}-pie-toggle`;
    ClassNames.pieToggleOpened = `${ClassNames.handle}-pie-toggle-opened`;
    ClassNames.pieSlice = `${ClassNames.handle}-pie-slice`;
    ClassNames.pieSliceImg = `${ClassNames.handle}-pie-slice-img`;
})(ClassNames || (ClassNames = {}));
//# sourceMappingURL=handle.js.map