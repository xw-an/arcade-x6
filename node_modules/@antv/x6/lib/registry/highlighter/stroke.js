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
exports.stroke = void 0;
var util_1 = require("../../util");
var global_1 = require("../../global");
var defaultOptions = {
    padding: 3,
    rx: 0,
    ry: 0,
    attrs: {
        'stroke-width': 3,
        stroke: '#FEB663',
    },
};
exports.stroke = {
    highlight: function (cellView, magnet, options) {
        var id = Private.getHighlighterId(magnet, options);
        if (Private.hasCache(id)) {
            return;
        }
        // eslint-disable-next-line
        options = util_1.ObjectExt.defaultsDeep({}, options, defaultOptions);
        var magnetVel = util_1.Vector.create(magnet);
        var pathData;
        var magnetBBox;
        try {
            pathData = magnetVel.toPathData();
        }
        catch (error) {
            // Failed to get path data from magnet element.
            // Draw a rectangle around the entire cell view instead.
            magnetBBox = magnetVel.bbox(true /* without transforms */);
            pathData = util_1.Dom.rectToPathData(__assign(__assign({}, options), magnetBBox));
        }
        var path = util_1.Dom.createSvgElement('path');
        util_1.Dom.attr(path, __assign({ d: pathData, 'pointer-events': 'none', 'vector-effect': 'non-scaling-stroke', fill: 'none' }, (options.attrs ? util_1.Dom.kebablizeAttrs(options.attrs) : null)));
        // const highlightVel = v.create('path').attr()
        if (cellView.isEdgeElement(magnet)) {
            util_1.Dom.attr(path, 'd', cellView.getConnectionPathData());
        }
        else {
            var highlightMatrix = magnetVel.getTransformToElement(cellView.container);
            // Add padding to the highlight element.
            var padding = options.padding;
            if (padding) {
                if (magnetBBox == null) {
                    magnetBBox = magnetVel.bbox(true);
                }
                var cx = magnetBBox.x + magnetBBox.width / 2;
                var cy = magnetBBox.y + magnetBBox.height / 2;
                magnetBBox = util_1.Dom.transformRectangle(magnetBBox, highlightMatrix);
                var width = Math.max(magnetBBox.width, 1);
                var height = Math.max(magnetBBox.height, 1);
                var sx = (width + padding) / width;
                var sy = (height + padding) / height;
                var paddingMatrix = util_1.Dom.createSVGMatrix({
                    a: sx,
                    b: 0,
                    c: 0,
                    d: sy,
                    e: cx - sx * cx,
                    f: cy - sy * cy,
                });
                highlightMatrix = highlightMatrix.multiply(paddingMatrix);
            }
            util_1.Dom.transform(path, highlightMatrix);
        }
        util_1.Dom.addClass(path, global_1.Util.prefix('highlight-stroke'));
        var cell = cellView.cell;
        var removeHandler = function () { return Private.removeHighlighter(id); };
        cell.on('removed', removeHandler);
        if (cell.model) {
            cell.model.on('reseted', removeHandler);
        }
        cellView.container.appendChild(path);
        Private.setCache(id, path);
    },
    unhighlight: function (cellView, magnet, opt) {
        Private.removeHighlighter(Private.getHighlighterId(magnet, opt));
    },
};
var Private;
(function (Private) {
    function getHighlighterId(magnet, options) {
        util_1.Dom.ensureId(magnet);
        return magnet.id + JSON.stringify(options);
    }
    Private.getHighlighterId = getHighlighterId;
    var cache = {};
    function setCache(id, elem) {
        cache[id] = elem;
    }
    Private.setCache = setCache;
    function hasCache(id) {
        return cache[id] != null;
    }
    Private.hasCache = hasCache;
    function removeHighlighter(id) {
        var elem = cache[id];
        if (elem) {
            util_1.Dom.remove(elem);
            delete cache[id];
        }
    }
    Private.removeHighlighter = removeHighlighter;
})(Private || (Private = {}));
//# sourceMappingURL=stroke.js.map