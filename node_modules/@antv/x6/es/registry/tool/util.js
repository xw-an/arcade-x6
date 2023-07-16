import { FunctionExt } from '../../util';
import { ConnectionStrategy } from '../connection-strategy';
export function getAnchor(pos, terminalView, terminalMagnet, type) {
    const end = FunctionExt.call(ConnectionStrategy.presets.pinRelative, this.graph, {}, terminalView, terminalMagnet, pos, this.cell, type, {});
    return end.anchor;
}
export function getViewBBox(view, quick) {
    if (quick) {
        return view.cell.getBBox();
    }
    return view.cell.isEdge()
        ? view.getConnection().bbox()
        : view.getUnrotatedBBoxOfElement(view.container);
}
//# sourceMappingURL=util.js.map