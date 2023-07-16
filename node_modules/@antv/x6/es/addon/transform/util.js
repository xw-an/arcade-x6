export function notify(name, evt, view, args = {}) {
    if (view) {
        const graph = view.graph;
        const e = graph.view.normalizeEvent(evt);
        const localPoint = graph.snapToGrid(e.clientX, e.clientY);
        view.notify(name, Object.assign({ e,
            view, node: view.cell, cell: view.cell, x: localPoint.x, y: localPoint.y }, args));
    }
}
//# sourceMappingURL=util.js.map