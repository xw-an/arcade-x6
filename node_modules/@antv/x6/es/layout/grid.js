import { Model } from '../model/model';
export function grid(cells, options = {}) {
    const model = Model.isModel(cells)
        ? cells
        : new Model().resetCells(cells, {
            sort: false,
            dryrun: true,
        });
    const nodes = model.getNodes();
    const columns = options.columns || 1;
    const rows = Math.ceil(nodes.length / columns);
    const dx = options.dx || 0;
    const dy = options.dy || 0;
    const centre = options.center !== false;
    const resizeToFit = options.resizeToFit === true;
    const marginX = options.marginX || 0;
    const marginY = options.marginY || 0;
    const columnWidths = [];
    let columnWidth = options.columnWidth;
    if (columnWidth === 'compact') {
        for (let j = 0; j < columns; j += 1) {
            const items = GridLayout.getNodesInColumn(nodes, j, columns);
            columnWidths.push(GridLayout.getMaxDim(items, 'width') + dx);
        }
    }
    else {
        if (columnWidth == null || columnWidth === 'auto') {
            columnWidth = GridLayout.getMaxDim(nodes, 'width') + dx;
        }
        for (let i = 0; i < columns; i += 1) {
            columnWidths.push(columnWidth);
        }
    }
    const columnLefts = GridLayout.accumulate(columnWidths, marginX);
    const rowHeights = [];
    let rowHeight = options.rowHeight;
    if (rowHeight === 'compact') {
        for (let i = 0; i < rows; i += 1) {
            const items = GridLayout.getNodesInRow(nodes, i, columns);
            rowHeights.push(GridLayout.getMaxDim(items, 'height') + dy);
        }
    }
    else {
        if (rowHeight == null || rowHeight === 'auto') {
            rowHeight = GridLayout.getMaxDim(nodes, 'height') + dy;
        }
        for (let i = 0; i < rows; i += 1) {
            rowHeights.push(rowHeight);
        }
    }
    const rowTops = GridLayout.accumulate(rowHeights, marginY);
    model.startBatch('layout');
    nodes.forEach((node, index) => {
        const rowIndex = index % columns;
        const columnIndex = Math.floor(index / columns);
        const columnWidth = columnWidths[rowIndex];
        const rowHeight = rowHeights[columnIndex];
        let cx = 0;
        let cy = 0;
        let size = node.getSize();
        if (resizeToFit) {
            let width = columnWidth - 2 * dx;
            let height = rowHeight - 2 * dy;
            const calcHeight = size.height * (size.width ? width / size.width : 1);
            const calcWidth = size.width * (size.height ? height / size.height : 1);
            if (rowHeight < calcHeight) {
                width = calcWidth;
            }
            else {
                height = calcHeight;
            }
            size = {
                width,
                height,
            };
            node.setSize(size, options);
        }
        if (centre) {
            cx = (columnWidth - size.width) / 2;
            cy = (rowHeight - size.height) / 2;
        }
        node.position(columnLefts[rowIndex] + dx + cx, rowTops[columnIndex] + dy + cy, options);
    });
    model.stopBatch('layout');
}
var GridLayout;
(function (GridLayout) {
    function getMaxDim(nodes, name) {
        return nodes.reduce((memo, node) => Math.max(node.getSize()[name], memo), 0);
    }
    GridLayout.getMaxDim = getMaxDim;
    function getNodesInRow(nodes, rowIndex, columnCount) {
        const res = [];
        for (let i = columnCount * rowIndex, ii = i + columnCount; i < ii; i += 1) {
            res.push(nodes[i]);
        }
        return res;
    }
    GridLayout.getNodesInRow = getNodesInRow;
    function getNodesInColumn(nodes, columnIndex, columnCount) {
        const res = [];
        for (let i = columnIndex, ii = nodes.length; i < ii; i += columnCount) {
            res.push(nodes[i]);
        }
        return res;
    }
    GridLayout.getNodesInColumn = getNodesInColumn;
    function accumulate(items, start) {
        return items.reduce((memo, item, i) => {
            memo.push(memo[i] + item);
            return memo;
        }, [start || 0]);
    }
    GridLayout.accumulate = accumulate;
})(GridLayout || (GridLayout = {}));
//# sourceMappingURL=grid.js.map