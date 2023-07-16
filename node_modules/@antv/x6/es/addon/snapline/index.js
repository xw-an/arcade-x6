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
import { Angle, Point, Rectangle } from '../../geometry';
import { ArrayExt, FunctionExt } from '../../util';
import { Vector } from '../../util/vector';
import { View } from '../../view/view';
export class Snapline extends View {
    constructor(options) {
        super();
        const { graph } = options, others = __rest(options, ["graph"]);
        this.graph = graph;
        this.options = Object.assign({ tolerance: 10 }, others);
        this.offset = { x: 0, y: 0 };
        this.render();
        this.parseFilter();
        if (!this.disabled) {
            this.startListening();
        }
    }
    get model() {
        return this.graph.model;
    }
    get containerClassName() {
        return this.prefixClassName('widget-snapline');
    }
    get verticalClassName() {
        return `${this.containerClassName}-vertical`;
    }
    get horizontalClassName() {
        return `${this.containerClassName}-horizontal`;
    }
    get disabled() {
        return (this.options.enabled !== true ||
            this.graph.options.snapline.enabled !== true);
    }
    enable() {
        if (this.disabled) {
            this.options.enabled = true;
            this.graph.options.snapline.enabled = true;
            this.startListening();
        }
    }
    disable() {
        if (!this.disabled) {
            this.options.enabled = false;
            this.graph.options.snapline.enabled = false;
            this.stopListening();
        }
    }
    setFilter(filter) {
        this.options.filter = filter;
        this.parseFilter();
    }
    render() {
        const container = (this.containerWrapper = new Vector('svg'));
        const horizontal = (this.horizontal = new Vector('line'));
        const vertical = (this.vertical = new Vector('line'));
        container.addClass(this.containerClassName);
        horizontal.addClass(this.horizontalClassName);
        vertical.addClass(this.verticalClassName);
        container.setAttribute('width', '100%');
        container.setAttribute('height', '100%');
        horizontal.setAttribute('display', 'none');
        vertical.setAttribute('display', 'none');
        container.append([horizontal, vertical]);
        if (this.options.className) {
            container.addClass(this.options.className);
        }
        this.container = this.containerWrapper.node;
    }
    startListening() {
        this.stopListening();
        this.graph.on('node:mousedown', this.captureCursorOffset, this);
        this.graph.on('node:mousemove', this.snapOnMoving, this);
        this.model.on('batch:stop', this.onBatchStop, this);
        this.delegateDocumentEvents({
            mouseup: 'hide',
            touchend: 'hide',
        });
    }
    stopListening() {
        this.graph.off('node:mousedown', this.captureCursorOffset, this);
        this.graph.off('node:mousemove', this.snapOnMoving, this);
        this.model.off('batch:stop', this.onBatchStop, this);
        this.undelegateDocumentEvents();
    }
    parseFilter() {
        this.filterShapes = {};
        this.filterCells = {};
        this.filterFunction = null;
        const filter = this.options.filter;
        if (Array.isArray(filter)) {
            filter.forEach((item) => {
                if (typeof item === 'string') {
                    this.filterShapes[item] = true;
                }
                else {
                    this.filterCells[item.id] = true;
                }
            });
        }
        else if (typeof filter === 'function') {
            this.filterFunction = filter;
        }
    }
    onBatchStop({ name, data }) {
        if (name === 'resize') {
            this.snapOnResizing(data.cell, data);
        }
    }
    captureCursorOffset({ view, x, y }) {
        const targetView = view.getDelegatedView();
        if (targetView && this.isNodeMovable(targetView)) {
            const pos = view.cell.getPosition();
            this.offset = {
                x: x - pos.x,
                y: y - pos.y,
            };
        }
    }
    isNodeMovable(view) {
        return view && view.cell.isNode() && view.can('nodeMovable');
    }
    snapOnResizing(node, options) {
        if (this.options.resizing &&
            !options.snapped &&
            options.ui &&
            options.direction &&
            options.trueDirection) {
            const view = this.graph.renderer.findViewByCell(node);
            if (view && view.cell.isNode()) {
                const nodeBbox = node.getBBox();
                const nodeBBoxRotated = nodeBbox.bbox(node.getAngle());
                const nodeTopLeft = nodeBBoxRotated.getTopLeft();
                const nodeBottomRight = nodeBBoxRotated.getBottomRight();
                const angle = Angle.normalize(node.getAngle());
                const tolerance = this.options.tolerance || 0;
                let verticalLeft;
                let verticalTop;
                let verticalHeight;
                let horizontalTop;
                let horizontalLeft;
                let horizontalWidth;
                const snapOrigin = {
                    vertical: 0,
                    horizontal: 0,
                };
                const direction = options.direction;
                const trueDirection = options.trueDirection;
                const relativeDirection = options.relativeDirection;
                if (trueDirection.indexOf('right') !== -1) {
                    snapOrigin.vertical = nodeBottomRight.x;
                }
                else {
                    snapOrigin.vertical = nodeTopLeft.x;
                }
                if (trueDirection.indexOf('bottom') !== -1) {
                    snapOrigin.horizontal = nodeBottomRight.y;
                }
                else {
                    snapOrigin.horizontal = nodeTopLeft.y;
                }
                this.model.getNodes().some((cell) => {
                    if (this.isIgnored(node, cell)) {
                        return false;
                    }
                    const snapBBox = cell.getBBox().bbox(cell.getAngle());
                    const snapTopLeft = snapBBox.getTopLeft();
                    const snapBottomRight = snapBBox.getBottomRight();
                    const groups = {
                        vertical: [snapTopLeft.x, snapBottomRight.x],
                        horizontal: [snapTopLeft.y, snapBottomRight.y],
                    };
                    const distances = {};
                    Object.keys(groups).forEach((k) => {
                        const key = k;
                        const list = groups[key]
                            .map((value) => ({
                            position: value,
                            distance: Math.abs(value - snapOrigin[key]),
                        }))
                            .filter((item) => item.distance <= tolerance);
                        distances[key] = ArrayExt.sortBy(list, (item) => item.distance);
                    });
                    if (verticalLeft == null && distances.vertical.length > 0) {
                        verticalLeft = distances.vertical[0].position;
                        verticalTop = Math.min(nodeBBoxRotated.y, snapBBox.y);
                        verticalHeight =
                            Math.max(nodeBottomRight.y, snapBottomRight.y) - verticalTop;
                    }
                    if (horizontalTop == null && distances.horizontal.length > 0) {
                        horizontalTop = distances.horizontal[0].position;
                        horizontalLeft = Math.min(nodeBBoxRotated.x, snapBBox.x);
                        horizontalWidth =
                            Math.max(nodeBottomRight.x, snapBottomRight.x) - horizontalLeft;
                    }
                    return verticalLeft != null && horizontalTop != null;
                });
                this.hide();
                let dx = 0;
                let dy = 0;
                if (horizontalTop != null || verticalLeft != null) {
                    if (verticalLeft != null) {
                        dx =
                            trueDirection.indexOf('right') !== -1
                                ? verticalLeft - nodeBottomRight.x
                                : nodeTopLeft.x - verticalLeft;
                    }
                    if (horizontalTop != null) {
                        dy =
                            trueDirection.indexOf('bottom') !== -1
                                ? horizontalTop - nodeBottomRight.y
                                : nodeTopLeft.y - horizontalTop;
                    }
                }
                let dWidth = 0;
                let dHeight = 0;
                if (angle % 90 === 0) {
                    if (angle === 90 || angle === 270) {
                        dWidth = dy;
                        dHeight = dx;
                    }
                    else {
                        dWidth = dx;
                        dHeight = dy;
                    }
                }
                else {
                    const quadrant = angle >= 0 && angle < 90
                        ? 1
                        : angle >= 90 && angle < 180
                            ? 4
                            : angle >= 180 && angle < 270
                                ? 3
                                : 2;
                    if (horizontalTop != null && verticalLeft != null) {
                        if (dx < dy) {
                            dy = 0;
                            horizontalTop = undefined;
                        }
                        else {
                            dx = 0;
                            verticalLeft = undefined;
                        }
                    }
                    const rad = Angle.toRad(angle % 90);
                    if (dx) {
                        dWidth = quadrant === 3 ? dx / Math.cos(rad) : dx / Math.sin(rad);
                    }
                    if (dy) {
                        dHeight = quadrant === 3 ? dy / Math.cos(rad) : dy / Math.sin(rad);
                    }
                    const quadrant13 = quadrant === 1 || quadrant === 3;
                    switch (relativeDirection) {
                        case 'top':
                        case 'bottom':
                            dHeight = dy
                                ? dy / (quadrant13 ? Math.cos(rad) : Math.sin(rad))
                                : dx / (quadrant13 ? Math.sin(rad) : Math.cos(rad));
                            break;
                        case 'left':
                        case 'right':
                            dWidth = dx
                                ? dx / (quadrant13 ? Math.cos(rad) : Math.sin(rad))
                                : dy / (quadrant13 ? Math.sin(rad) : Math.cos(rad));
                            break;
                        default:
                            break;
                    }
                }
                switch (relativeDirection) {
                    case 'top':
                    case 'bottom':
                        dWidth = 0;
                        break;
                    case 'left':
                    case 'right':
                        dHeight = 0;
                        break;
                    default:
                        break;
                }
                const gridSize = this.graph.getGridSize();
                let newWidth = Math.max(nodeBbox.width + dWidth, gridSize);
                let newHeight = Math.max(nodeBbox.height + dHeight, gridSize);
                if (options.minWidth && options.minWidth > gridSize) {
                    newWidth = Math.max(newWidth, options.minWidth);
                }
                if (options.minHeight && options.minHeight > gridSize) {
                    newHeight = Math.max(newHeight, options.minHeight);
                }
                if (options.maxWidth) {
                    newWidth = Math.min(newWidth, options.maxWidth);
                }
                if (options.maxHeight) {
                    newHeight = Math.min(newHeight, options.maxHeight);
                }
                if (options.preserveAspectRatio) {
                    if (dHeight < dWidth) {
                        newHeight = newWidth * (nodeBbox.height / nodeBbox.width);
                    }
                    else {
                        newWidth = newHeight * (nodeBbox.width / nodeBbox.height);
                    }
                }
                if (newWidth !== nodeBbox.width || newHeight !== nodeBbox.height) {
                    node.resize(newWidth, newHeight, {
                        direction,
                        relativeDirection,
                        trueDirection,
                        snapped: true,
                        snaplines: this.cid,
                        restrict: this.graph.hook.getRestrictArea(view),
                    });
                    if (verticalHeight) {
                        verticalHeight += newHeight - nodeBbox.height;
                    }
                    if (horizontalWidth) {
                        horizontalWidth += newWidth - nodeBbox.width;
                    }
                }
                const newRotatedBBox = node.getBBox().bbox(angle);
                if (verticalLeft &&
                    Math.abs(newRotatedBBox.x - verticalLeft) > 1 &&
                    Math.abs(newRotatedBBox.width + newRotatedBBox.x - verticalLeft) > 1) {
                    verticalLeft = undefined;
                }
                if (horizontalTop &&
                    Math.abs(newRotatedBBox.y - horizontalTop) > 1 &&
                    Math.abs(newRotatedBBox.height + newRotatedBBox.y - horizontalTop) > 1) {
                    horizontalTop = undefined;
                }
                this.update({
                    verticalLeft,
                    verticalTop,
                    verticalHeight,
                    horizontalTop,
                    horizontalLeft,
                    horizontalWidth,
                });
            }
        }
    }
    snapOnMoving({ view, e, x, y }) {
        const targetView = view.getEventData(e).delegatedView || view;
        if (!this.isNodeMovable(targetView)) {
            return;
        }
        const node = targetView.cell;
        const size = node.getSize();
        const position = node.getPosition();
        const cellBBox = new Rectangle(x - this.offset.x, y - this.offset.y, size.width, size.height);
        const angle = node.getAngle();
        const nodeCenter = cellBBox.getCenter();
        const nodeBBoxRotated = cellBBox.bbox(angle);
        const nodeTopLeft = nodeBBoxRotated.getTopLeft();
        const nodeBottomRight = nodeBBoxRotated.getBottomRight();
        const distance = this.options.tolerance || 0;
        let verticalLeft;
        let verticalTop;
        let verticalHeight;
        let horizontalTop;
        let horizontalLeft;
        let horizontalWidth;
        let verticalFix = 0;
        let horizontalFix = 0;
        this.model.getNodes().some((targetNode) => {
            if (this.isIgnored(node, targetNode)) {
                return false;
            }
            const snapBBox = targetNode.getBBox().bbox(targetNode.getAngle());
            const snapCenter = snapBBox.getCenter();
            const snapTopLeft = snapBBox.getTopLeft();
            const snapBottomRight = snapBBox.getBottomRight();
            if (verticalLeft == null) {
                if (Math.abs(snapCenter.x - nodeCenter.x) < distance) {
                    verticalLeft = snapCenter.x;
                    verticalFix = 0.5;
                }
                else if (Math.abs(snapTopLeft.x - nodeTopLeft.x) < distance) {
                    verticalLeft = snapTopLeft.x;
                    verticalFix = 0;
                }
                else if (Math.abs(snapTopLeft.x - nodeBottomRight.x) < distance) {
                    verticalLeft = snapTopLeft.x;
                    verticalFix = 1;
                }
                else if (Math.abs(snapBottomRight.x - nodeBottomRight.x) < distance) {
                    verticalLeft = snapBottomRight.x;
                    verticalFix = 1;
                }
                else if (Math.abs(snapBottomRight.x - nodeTopLeft.x) < distance) {
                    verticalLeft = snapBottomRight.x;
                }
                if (verticalLeft != null) {
                    verticalTop = Math.min(nodeBBoxRotated.y, snapBBox.y);
                    verticalHeight =
                        Math.max(nodeBottomRight.y, snapBottomRight.y) - verticalTop;
                }
            }
            if (horizontalTop == null) {
                if (Math.abs(snapCenter.y - nodeCenter.y) < distance) {
                    horizontalTop = snapCenter.y;
                    horizontalFix = 0.5;
                }
                else if (Math.abs(snapTopLeft.y - nodeTopLeft.y) < distance) {
                    horizontalTop = snapTopLeft.y;
                }
                else if (Math.abs(snapTopLeft.y - nodeBottomRight.y) < distance) {
                    horizontalTop = snapTopLeft.y;
                    horizontalFix = 1;
                }
                else if (Math.abs(snapBottomRight.y - nodeBottomRight.y) < distance) {
                    horizontalTop = snapBottomRight.y;
                    horizontalFix = 1;
                }
                else if (Math.abs(snapBottomRight.y - nodeTopLeft.y) < distance) {
                    horizontalTop = snapBottomRight.y;
                }
                if (horizontalTop != null) {
                    horizontalLeft = Math.min(nodeBBoxRotated.x, snapBBox.x);
                    horizontalWidth =
                        Math.max(nodeBottomRight.x, snapBottomRight.x) - horizontalLeft;
                }
            }
            return verticalLeft != null && horizontalTop != null;
        });
        this.hide();
        if (horizontalTop != null || verticalLeft != null) {
            if (horizontalTop != null) {
                nodeBBoxRotated.y =
                    horizontalTop - horizontalFix * nodeBBoxRotated.height;
            }
            if (verticalLeft != null) {
                nodeBBoxRotated.x = verticalLeft - verticalFix * nodeBBoxRotated.width;
            }
            const newCenter = nodeBBoxRotated.getCenter();
            const newX = newCenter.x - cellBBox.width / 2;
            const newY = newCenter.y - cellBBox.height / 2;
            const dx = newX - position.x;
            const dy = newY - position.y;
            if (dx !== 0 || dy !== 0) {
                node.translate(dx, dy, {
                    snapped: true,
                    restrict: this.graph.hook.getRestrictArea(targetView),
                });
                if (horizontalWidth) {
                    horizontalWidth += dx;
                }
                if (verticalHeight) {
                    verticalHeight += dy;
                }
            }
            this.update({
                verticalLeft,
                verticalTop,
                verticalHeight,
                horizontalTop,
                horizontalLeft,
                horizontalWidth,
            });
        }
    }
    isIgnored(snapNode, targetNode) {
        return (targetNode.id === snapNode.id ||
            targetNode.isDescendantOf(snapNode) ||
            this.filterShapes[targetNode.shape] ||
            this.filterCells[targetNode.id] ||
            (this.filterFunction &&
                FunctionExt.call(this.filterFunction, this.graph, targetNode)));
    }
    update(metadata) {
        // https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations
        if (metadata.horizontalTop) {
            const start = this.graph.localToGraph(new Point(metadata.horizontalLeft, metadata.horizontalTop));
            const end = this.graph.localToGraph(new Point(metadata.horizontalLeft + metadata.horizontalWidth, metadata.horizontalTop));
            this.horizontal.setAttributes({
                x1: this.options.sharp ? `${start.x}` : '0',
                y1: `${start.y}`,
                x2: this.options.sharp ? `${end.x}` : '100%',
                y2: `${end.y}`,
                display: 'inherit',
            });
        }
        else {
            this.horizontal.setAttribute('display', 'none');
        }
        if (metadata.verticalLeft) {
            const start = this.graph.localToGraph(new Point(metadata.verticalLeft, metadata.verticalTop));
            const end = this.graph.localToGraph(new Point(metadata.verticalLeft, metadata.verticalTop + metadata.verticalHeight));
            this.vertical.setAttributes({
                x1: `${start.x}`,
                y1: this.options.sharp ? `${start.y}` : '0',
                x2: `${end.x}`,
                y2: this.options.sharp ? `${end.y}` : '100%',
                display: 'inherit',
            });
        }
        else {
            this.vertical.setAttribute('display', 'none');
        }
        this.show();
    }
    resetTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
    show() {
        this.resetTimer();
        if (this.container.parentNode == null) {
            this.graph.container.appendChild(this.container);
        }
        return this;
    }
    hide() {
        this.resetTimer();
        this.vertical.setAttribute('display', 'none');
        this.horizontal.setAttribute('display', 'none');
        const clean = this.options.clean;
        const delay = typeof clean === 'number' ? clean : clean !== false ? 3000 : 0;
        if (delay > 0) {
            this.timer = window.setTimeout(() => {
                if (this.container.parentNode !== null) {
                    this.unmount();
                }
            }, delay);
        }
        return this;
    }
    onRemove() {
        this.stopListening();
        this.hide();
    }
    dispose() {
        this.remove();
    }
}
__decorate([
    View.dispose()
], Snapline.prototype, "dispose", null);
//# sourceMappingURL=index.js.map