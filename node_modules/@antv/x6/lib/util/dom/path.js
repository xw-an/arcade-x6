"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlicePathData = exports.toPathData = exports.toPath = exports.rectToPathData = exports.rectangleToPathData = exports.ellipseToPathData = exports.circleToPathData = exports.getPointsFromSvgElement = exports.polylineToPathData = exports.polygonToPathData = exports.lineToPathData = exports.sample = exports.KAPPA = void 0;
var attr_1 = require("./attr");
var elem_1 = require("./elem");
exports.KAPPA = 0.551784;
function getNumbericAttribute(elem, attr, defaultValue) {
    if (defaultValue === void 0) { defaultValue = NaN; }
    var v = elem.getAttribute(attr);
    if (v == null) {
        return defaultValue;
    }
    var n = parseFloat(v);
    return Number.isNaN(n) ? defaultValue : n;
}
function sample(elem, interval) {
    if (interval === void 0) { interval = 1; }
    var length = elem.getTotalLength();
    var samples = [];
    var distance = 0;
    var sample;
    while (distance < length) {
        sample = elem.getPointAtLength(distance);
        samples.push({ distance: distance, x: sample.x, y: sample.y });
        distance += interval;
    }
    return samples;
}
exports.sample = sample;
function lineToPathData(line) {
    return [
        'M',
        getNumbericAttribute(line, 'x1'),
        getNumbericAttribute(line, 'y1'),
        'L',
        getNumbericAttribute(line, 'x2'),
        getNumbericAttribute(line, 'y2'),
    ].join(' ');
}
exports.lineToPathData = lineToPathData;
function polygonToPathData(polygon) {
    var points = getPointsFromSvgElement(polygon);
    if (points.length === 0) {
        return null;
    }
    return svgPointsToPath(points) + " Z";
}
exports.polygonToPathData = polygonToPathData;
function polylineToPathData(polyline) {
    var points = getPointsFromSvgElement(polyline);
    if (points.length === 0) {
        return null;
    }
    return svgPointsToPath(points);
}
exports.polylineToPathData = polylineToPathData;
function svgPointsToPath(points) {
    var arr = points.map(function (p) { return p.x + " " + p.y; });
    return "M " + arr.join(' L');
}
function getPointsFromSvgElement(elem) {
    var points = [];
    var nodePoints = elem.points;
    if (nodePoints) {
        for (var i = 0, ii = nodePoints.numberOfItems; i < ii; i += 1) {
            points.push(nodePoints.getItem(i));
        }
    }
    return points;
}
exports.getPointsFromSvgElement = getPointsFromSvgElement;
function circleToPathData(circle) {
    var cx = getNumbericAttribute(circle, 'cx', 0);
    var cy = getNumbericAttribute(circle, 'cy', 0);
    var r = getNumbericAttribute(circle, 'r');
    var cd = r * exports.KAPPA; // Control distance.
    return [
        'M',
        cx,
        cy - r,
        'C',
        cx + cd,
        cy - r,
        cx + r,
        cy - cd,
        cx + r,
        cy,
        'C',
        cx + r,
        cy + cd,
        cx + cd,
        cy + r,
        cx,
        cy + r,
        'C',
        cx - cd,
        cy + r,
        cx - r,
        cy + cd,
        cx - r,
        cy,
        'C',
        cx - r,
        cy - cd,
        cx - cd,
        cy - r,
        cx,
        cy - r,
        'Z',
    ].join(' ');
}
exports.circleToPathData = circleToPathData;
function ellipseToPathData(ellipse) {
    var cx = getNumbericAttribute(ellipse, 'cx', 0);
    var cy = getNumbericAttribute(ellipse, 'cy', 0);
    var rx = getNumbericAttribute(ellipse, 'rx');
    var ry = getNumbericAttribute(ellipse, 'ry') || rx;
    var cdx = rx * exports.KAPPA; // Control distance x.
    var cdy = ry * exports.KAPPA; // Control distance y.
    var d = [
        'M',
        cx,
        cy - ry,
        'C',
        cx + cdx,
        cy - ry,
        cx + rx,
        cy - cdy,
        cx + rx,
        cy,
        'C',
        cx + rx,
        cy + cdy,
        cx + cdx,
        cy + ry,
        cx,
        cy + ry,
        'C',
        cx - cdx,
        cy + ry,
        cx - rx,
        cy + cdy,
        cx - rx,
        cy,
        'C',
        cx - rx,
        cy - cdy,
        cx - cdx,
        cy - ry,
        cx,
        cy - ry,
        'Z',
    ].join(' ');
    return d;
}
exports.ellipseToPathData = ellipseToPathData;
function rectangleToPathData(rect) {
    return rectToPathData({
        x: getNumbericAttribute(rect, 'x', 0),
        y: getNumbericAttribute(rect, 'y', 0),
        width: getNumbericAttribute(rect, 'width', 0),
        height: getNumbericAttribute(rect, 'height', 0),
        rx: getNumbericAttribute(rect, 'rx', 0),
        ry: getNumbericAttribute(rect, 'ry', 0),
    });
}
exports.rectangleToPathData = rectangleToPathData;
function rectToPathData(r) {
    var d;
    var x = r.x;
    var y = r.y;
    var width = r.width;
    var height = r.height;
    var topRx = Math.min(r.rx || r['top-rx'] || 0, width / 2);
    var bottomRx = Math.min(r.rx || r['bottom-rx'] || 0, width / 2);
    var topRy = Math.min(r.ry || r['top-ry'] || 0, height / 2);
    var bottomRy = Math.min(r.ry || r['bottom-ry'] || 0, height / 2);
    if (topRx || bottomRx || topRy || bottomRy) {
        d = [
            'M',
            x,
            y + topRy,
            'v',
            height - topRy - bottomRy,
            'a',
            bottomRx,
            bottomRy,
            0,
            0,
            0,
            bottomRx,
            bottomRy,
            'h',
            width - 2 * bottomRx,
            'a',
            bottomRx,
            bottomRy,
            0,
            0,
            0,
            bottomRx,
            -bottomRy,
            'v',
            -(height - bottomRy - topRy),
            'a',
            topRx,
            topRy,
            0,
            0,
            0,
            -topRx,
            -topRy,
            'h',
            -(width - 2 * topRx),
            'a',
            topRx,
            topRy,
            0,
            0,
            0,
            -topRx,
            topRy,
            'Z',
        ];
    }
    else {
        d = ['M', x, y, 'H', x + width, 'V', y + height, 'H', x, 'V', y, 'Z'];
    }
    return d.join(' ');
}
exports.rectToPathData = rectToPathData;
function toPath(elem) {
    var path = (0, elem_1.createSvgElement)('path');
    (0, attr_1.attr)(path, (0, attr_1.attr)(elem));
    var d = toPathData(elem);
    if (d) {
        path.setAttribute('d', d);
    }
    return path;
}
exports.toPath = toPath;
function toPathData(elem) {
    var tagName = elem.tagName.toLowerCase();
    switch (tagName) {
        case 'path':
            return elem.getAttribute('d');
        case 'line':
            return lineToPathData(elem);
        case 'polygon':
            return polygonToPathData(elem);
        case 'polyline':
            return polylineToPathData(elem);
        case 'ellipse':
            return ellipseToPathData(elem);
        case 'circle':
            return circleToPathData(elem);
        case 'rect':
            return rectangleToPathData(elem);
        default:
            break;
    }
    throw new Error("\"" + tagName + "\" cannot be converted to svg path element.");
}
exports.toPathData = toPathData;
// Inspired by d3.js https://github.com/mbostock/d3/blob/master/src/svg/arc.js
function createSlicePathData(innerRadius, outerRadius, startAngle, endAngle) {
    var svgArcMax = 2 * Math.PI - 1e-6;
    var r0 = innerRadius;
    var r1 = outerRadius;
    var a0 = startAngle;
    var a1 = endAngle;
    if (a1 < a0) {
        var tmp = a0;
        a0 = a1;
        a1 = tmp;
    }
    var da = a1 - a0;
    var df = da < Math.PI ? '0' : '1';
    var c0 = Math.cos(a0);
    var s0 = Math.sin(a0);
    var c1 = Math.cos(a1);
    var s1 = Math.sin(a1);
    return da >= svgArcMax
        ? r0
            ? // eslint-disable-next-line
                "M0," + r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + -r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + r1 + "M0," + r0 + "A" + r0 + "," + r0 + " 0 1,0 0," + -r0 + "A" + r0 + "," + r0 + " 0 1,0 0," + r0 + "Z"
            : // eslint-disable-next-line
                "M0," + r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + -r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + r1 + "Z"
        : r0
            ? // eslint-disable-next-line
                "M" + r1 * c0 + "," + r1 * s0 + "A" + r1 + "," + r1 + " 0 " + df + ",1 " + r1 * c1 + "," + r1 * s1 + "L" + r0 * c1 + "," + r0 * s1 + "A" + r0 + "," + r0 + " 0 " + df + ",0 " + r0 * c0 + "," + r0 * s0 + "Z"
            : // eslint-disable-next-line
                "M" + r1 * c0 + "," + r1 * s0 + "A" + r1 + "," + r1 + " 0 " + df + ",1 " + r1 * c1 + "," + r1 * s1 + "L0,0" +
                    "Z";
}
exports.createSlicePathData = createSlicePathData;
//# sourceMappingURL=path.js.map