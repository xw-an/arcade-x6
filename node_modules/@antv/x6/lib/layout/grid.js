"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grid = void 0;
var model_1 = require("../model/model");
function grid(cells, options) {
    if (options === void 0) { options = {}; }
    var model = model_1.Model.isModel(cells)
        ? cells
        : new model_1.Model().resetCells(cells, {
            sort: false,
            dryrun: true,
        });
    var nodes = model.getNodes();
    var columns = options.columns || 1;
    var rows = Math.ceil(nodes.length / columns);
    var dx = options.dx || 0;
    var dy = options.dy || 0;
    var centre = options.center !== false;
    var resizeToFit = options.resizeToFit === true;
    var marginX = options.marginX || 0;
    var marginY = options.marginY || 0;
    var columnWidths = [];
    var columnWidth = options.columnWidth;
    if (columnWidth === 'compact') {
        for (var j = 0; j < columns; j += 1) {
            var items = GridLayout.getNodesInColumn(nodes, j, columns);
            columnWidths.push(GridLayout.getMaxDim(items, 'width') + dx);
        }
    }
    else {
        if (columnWidth == null || columnWidth === 'auto') {
            columnWidth = GridLayout.getMaxDim(nodes, 'width') + dx;
        }
        for (var i = 0; i < columns; i += 1) {
            columnWidths.push(columnWidth);
        }
    }
    var columnLefts = GridLayout.accumulate(columnWidths, marginX);
    var rowHeights = [];
    var rowHeight = options.rowHeight;
    if (rowHeight === 'compact') {
        for (var i = 0; i < rows; i += 1) {
            var items = GridLayout.getNodesInRow(nodes, i, columns);
            rowHeights.push(GridLayout.getMaxDim(items, 'height') + dy);
        }
    }
    else {
        if (rowHeight == null || rowHeight === 'auto') {
            rowHeight = GridLayout.getMaxDim(nodes, 'height') + dy;
        }
        for (var i = 0; i < rows; i += 1) {
            rowHeights.push(rowHeight);
        }
    }
    var rowTops = GridLayout.accumulate(rowHeights, marginY);
    model.startBatch('layout');
    nodes.forEach(function (node, index) {
        var rowIndex = index % columns;
        var columnIndex = Math.floor(index / columns);
        var columnWidth = columnWidths[rowIndex];
        var rowHeight = rowHeights[columnIndex];
        var cx = 0;
        var cy = 0;
        var size = node.getSize();
        if (resizeToFit) {
            var width = columnWidth - 2 * dx;
            var height = rowHeight - 2 * dy;
            var calcHeight = size.height * (size.width ? width / size.width : 1);
            var calcWidth = size.width * (size.height ? height / size.height : 1);
            if (rowHeight < calcHeight) {
                width = calcWidth;
            }
            else {
                height = calcHeight;
            }
            size = {
                width: width,
                height: height,
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
exports.grid = grid;
var GridLayout;
(function (GridLayout) {
    function getMaxDim(nodes, name) {
        return nodes.reduce(function (memo, node) { return Math.max(node.getSize()[name], memo); }, 0);
    }
    GridLayout.getMaxDim = getMaxDim;
    function getNodesInRow(nodes, rowIndex, columnCount) {
        var res = [];
        for (var i = columnCount * rowIndex, ii = i + columnCount; i < ii; i += 1) {
            res.push(nodes[i]);
        }
        return res;
    }
    GridLayout.getNodesInRow = getNodesInRow;
    function getNodesInColumn(nodes, columnIndex, columnCount) {
        var res = [];
        for (var i = columnIndex, ii = nodes.length; i < ii; i += columnCount) {
            res.push(nodes[i]);
        }
        return res;
    }
    GridLayout.getNodesInColumn = getNodesInColumn;
    function accumulate(items, start) {
        return items.reduce(function (memo, item, i) {
            memo.push(memo[i] + item);
            return memo;
        }, [start || 0]);
    }
    GridLayout.accumulate = accumulate;
})(GridLayout || (GridLayout = {}));
//# sourceMappingURL=grid.js.map