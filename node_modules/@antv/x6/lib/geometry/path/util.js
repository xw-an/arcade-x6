"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawArc = exports.arcToCurves = exports.drawPoints = exports.isValid = void 0;
var point_1 = require("../point");
var regexSupportedData = new RegExp("^[\\s\\dLMCZz,.]*$");
function isValid(data) {
    if (typeof data !== 'string') {
        return false;
    }
    return regexSupportedData.test(data);
}
exports.isValid = isValid;
/**
 * Returns the remainder of division of `n` by `m`. You should use this
 * instead of the built-in operation as the built-in operation does not
 * properly handle negative numbers.
 */
function mod(n, m) {
    return ((n % m) + m) % m;
}
function draw(points, round, initialMove, close, exclude) {
    var data = [];
    var end = points[points.length - 1];
    var rounded = round != null && round > 0;
    var arcSize = round || 0;
    // Adds virtual waypoint in the center between start and end point
    if (close && rounded) {
        points = points.slice(); // eslint-disable-line
        var p0 = points[0];
        var wp = new point_1.Point(end.x + (p0.x - end.x) / 2, end.y + (p0.y - end.y) / 2);
        points.splice(0, 0, wp);
    }
    var pt = points[0];
    var i = 1;
    // Draws the line segments
    if (initialMove) {
        data.push('M', pt.x, pt.y);
    }
    else {
        data.push('L', pt.x, pt.y);
    }
    while (i < (close ? points.length : points.length - 1)) {
        var tmp = points[mod(i, points.length)];
        var dx = pt.x - tmp.x;
        var dy = pt.y - tmp.y;
        if (rounded &&
            (dx !== 0 || dy !== 0) &&
            (exclude == null || exclude.indexOf(i - 1) < 0)) {
            // Draws a line from the last point to the current
            // point with a spacing of size off the current point
            // into direction of the last point
            var dist = Math.sqrt(dx * dx + dy * dy);
            var nx1 = (dx * Math.min(arcSize, dist / 2)) / dist;
            var ny1 = (dy * Math.min(arcSize, dist / 2)) / dist;
            var x1 = tmp.x + nx1;
            var y1 = tmp.y + ny1;
            data.push('L', x1, y1);
            // Draws a curve from the last point to the current
            // point with a spacing of size off the current point
            // into direction of the next point
            var next = points[mod(i + 1, points.length)];
            // Uses next non-overlapping point
            while (i < points.length - 2 &&
                Math.round(next.x - tmp.x) === 0 &&
                Math.round(next.y - tmp.y) === 0) {
                next = points[mod(i + 2, points.length)];
                i += 1;
            }
            dx = next.x - tmp.x;
            dy = next.y - tmp.y;
            dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
            var nx2 = (dx * Math.min(arcSize, dist / 2)) / dist;
            var ny2 = (dy * Math.min(arcSize, dist / 2)) / dist;
            var x2 = tmp.x + nx2;
            var y2 = tmp.y + ny2;
            data.push('Q', tmp.x, tmp.y, x2, y2);
            tmp = new point_1.Point(x2, y2);
        }
        else {
            data.push('L', tmp.x, tmp.y);
        }
        pt = tmp;
        i += 1;
    }
    if (close) {
        data.push('Z');
    }
    else {
        data.push('L', end.x, end.y);
    }
    return data.map(function (v) { return (typeof v === 'string' ? v : +v.toFixed(3)); }).join(' ');
}
function drawPoints(points, options) {
    if (options === void 0) { options = {}; }
    var pts = [];
    if (points && points.length) {
        points.forEach(function (p) {
            if (Array.isArray(p)) {
                pts.push({ x: p[0], y: p[1] });
            }
            else {
                pts.push({ x: p.x, y: p.y });
            }
        });
    }
    return draw(pts, options.round, options.initialMove == null || options.initialMove, options.close, options.exclude);
}
exports.drawPoints = drawPoints;
/**
 * Converts the given arc to a series of curves.
 */
function arcToCurves(x0, y0, r1, r2, angle, largeArcFlag, sweepFlag, x, y) {
    if (angle === void 0) { angle = 0; }
    if (largeArcFlag === void 0) { largeArcFlag = 0; }
    if (sweepFlag === void 0) { sweepFlag = 0; }
    if (r1 === 0 || r2 === 0) {
        return [];
    }
    x -= x0; // eslint-disable-line
    y -= y0; // eslint-disable-line
    r1 = Math.abs(r1); // eslint-disable-line
    r2 = Math.abs(r2); // eslint-disable-line
    var ctx = -x / 2;
    var cty = -y / 2;
    var cpsi = Math.cos((angle * Math.PI) / 180);
    var spsi = Math.sin((angle * Math.PI) / 180);
    var rxd = cpsi * ctx + spsi * cty;
    var ryd = -1 * spsi * ctx + cpsi * cty;
    var rxdd = rxd * rxd;
    var rydd = ryd * ryd;
    var r1x = r1 * r1;
    var r2y = r2 * r2;
    var lamda = rxdd / r1x + rydd / r2y;
    var sds;
    if (lamda > 1) {
        r1 = Math.sqrt(lamda) * r1; // eslint-disable-line
        r2 = Math.sqrt(lamda) * r2; // eslint-disable-line
        sds = 0;
    }
    else {
        var seif = 1;
        if (largeArcFlag === sweepFlag) {
            seif = -1;
        }
        sds =
            seif *
                Math.sqrt((r1x * r2y - r1x * rydd - r2y * rxdd) / (r1x * rydd + r2y * rxdd));
    }
    var txd = (sds * r1 * ryd) / r2;
    var tyd = (-1 * sds * r2 * rxd) / r1;
    var tx = cpsi * txd - spsi * tyd + x / 2;
    var ty = spsi * txd + cpsi * tyd + y / 2;
    var rad = Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1) - Math.atan2(0, 1);
    var s1 = rad >= 0 ? rad : 2 * Math.PI + rad;
    rad =
        Math.atan2((-ryd - tyd) / r2, (-rxd - txd) / r1) -
            Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1);
    var dr = rad >= 0 ? rad : 2 * Math.PI + rad;
    if (sweepFlag === 0 && dr > 0) {
        dr -= 2 * Math.PI;
    }
    else if (sweepFlag !== 0 && dr < 0) {
        dr += 2 * Math.PI;
    }
    var sse = (dr * 2) / Math.PI;
    var seg = Math.ceil(sse < 0 ? -1 * sse : sse);
    var segr = dr / seg;
    var t = ((8 / 3) * Math.sin(segr / 4) * Math.sin(segr / 4)) / Math.sin(segr / 2);
    var cpsir1 = cpsi * r1;
    var cpsir2 = cpsi * r2;
    var spsir1 = spsi * r1;
    var spsir2 = spsi * r2;
    var mc = Math.cos(s1);
    var ms = Math.sin(s1);
    var x2 = -t * (cpsir1 * ms + spsir2 * mc);
    var y2 = -t * (spsir1 * ms - cpsir2 * mc);
    var x3 = 0;
    var y3 = 0;
    var result = [];
    for (var n = 0; n < seg; n += 1) {
        s1 += segr;
        mc = Math.cos(s1);
        ms = Math.sin(s1);
        x3 = cpsir1 * mc - spsir2 * ms + tx;
        y3 = spsir1 * mc + cpsir2 * ms + ty;
        var dx = -t * (cpsir1 * ms + spsir2 * mc);
        var dy = -t * (spsir1 * ms - cpsir2 * mc);
        // CurveTo updates x0, y0 so need to restore it
        var index = n * 6;
        result[index] = Number(x2 + x0);
        result[index + 1] = Number(y2 + y0);
        result[index + 2] = Number(x3 - dx + x0);
        result[index + 3] = Number(y3 - dy + y0);
        result[index + 4] = Number(x3 + x0);
        result[index + 5] = Number(y3 + y0);
        x2 = x3 + dx;
        y2 = y3 + dy;
    }
    return result.map(function (num) { return +num.toFixed(2); });
}
exports.arcToCurves = arcToCurves;
function drawArc(startX, startY, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, stopX, stopY) {
    if (xAxisRotation === void 0) { xAxisRotation = 0; }
    if (largeArcFlag === void 0) { largeArcFlag = 0; }
    if (sweepFlag === void 0) { sweepFlag = 0; }
    var data = [];
    var points = arcToCurves(startX, startY, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, stopX, stopY);
    if (points != null) {
        for (var i = 0, ii = points.length; i < ii; i += 6) {
            data.push('C', points[i], points[i + 1], points[i + 2], points[i + 3], points[i + 4], points[i + 5]);
        }
    }
    return data.join(' ');
}
exports.drawArc = drawArc;
//# sourceMappingURL=util.js.map