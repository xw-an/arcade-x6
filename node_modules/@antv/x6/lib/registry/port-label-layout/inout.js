"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insideOriented = exports.inside = exports.outsideOriented = exports.outside = void 0;
var util_1 = require("./util");
var outside = function (portPosition, elemBBox, args) { return outsideLayout(portPosition, elemBBox, false, args); };
exports.outside = outside;
var outsideOriented = function (portPosition, elemBBox, args) { return outsideLayout(portPosition, elemBBox, true, args); };
exports.outsideOriented = outsideOriented;
var inside = function (portPosition, elemBBox, args) { return insideLayout(portPosition, elemBBox, false, args); };
exports.inside = inside;
var insideOriented = function (portPosition, elemBBox, args) { return insideLayout(portPosition, elemBBox, true, args); };
exports.insideOriented = insideOriented;
function outsideLayout(portPosition, elemBBox, autoOrient, args) {
    var offset = args.offset != null ? args.offset : 15;
    var angle = elemBBox.getCenter().theta(portPosition);
    var bboxAngles = getBBoxAngles(elemBBox);
    var y;
    var tx;
    var ty;
    var textAnchor;
    var orientAngle = 0;
    if (angle < bboxAngles[1] || angle > bboxAngles[2]) {
        y = '.3em';
        tx = offset;
        ty = 0;
        textAnchor = 'start';
    }
    else if (angle < bboxAngles[0]) {
        y = '0';
        tx = 0;
        ty = -offset;
        if (autoOrient) {
            orientAngle = -90;
            textAnchor = 'start';
        }
        else {
            textAnchor = 'middle';
        }
    }
    else if (angle < bboxAngles[3]) {
        y = '.3em';
        tx = -offset;
        ty = 0;
        textAnchor = 'end';
    }
    else {
        y = '.6em';
        tx = 0;
        ty = offset;
        if (autoOrient) {
            orientAngle = 90;
            textAnchor = 'start';
        }
        else {
            textAnchor = 'middle';
        }
    }
    return (0, util_1.toResult)({
        position: {
            x: Math.round(tx),
            y: Math.round(ty),
        },
        angle: orientAngle,
        attrs: {
            '.': {
                y: y,
                'text-anchor': textAnchor,
            },
        },
    }, args);
}
function insideLayout(portPosition, elemBBox, autoOrient, args) {
    var offset = args.offset != null ? args.offset : 15;
    var angle = elemBBox.getCenter().theta(portPosition);
    var bboxAngles = getBBoxAngles(elemBBox);
    var y;
    var tx;
    var ty;
    var textAnchor;
    var orientAngle = 0;
    if (angle < bboxAngles[1] || angle > bboxAngles[2]) {
        y = '.3em';
        tx = -offset;
        ty = 0;
        textAnchor = 'end';
    }
    else if (angle < bboxAngles[0]) {
        y = '.6em';
        tx = 0;
        ty = offset;
        if (autoOrient) {
            orientAngle = 90;
            textAnchor = 'start';
        }
        else {
            textAnchor = 'middle';
        }
    }
    else if (angle < bboxAngles[3]) {
        y = '.3em';
        tx = offset;
        ty = 0;
        textAnchor = 'start';
    }
    else {
        y = '0em';
        tx = 0;
        ty = -offset;
        if (autoOrient) {
            orientAngle = -90;
            textAnchor = 'start';
        }
        else {
            textAnchor = 'middle';
        }
    }
    return (0, util_1.toResult)({
        position: {
            x: Math.round(tx),
            y: Math.round(ty),
        },
        angle: orientAngle,
        attrs: {
            '.': {
                y: y,
                'text-anchor': textAnchor,
            },
        },
    }, args);
}
function getBBoxAngles(elemBBox) {
    var center = elemBBox.getCenter();
    var tl = center.theta(elemBBox.getTopLeft());
    var bl = center.theta(elemBBox.getBottomLeft());
    var br = center.theta(elemBBox.getBottomRight());
    var tr = center.theta(elemBBox.getTopRight());
    return [tl, tr, br, bl];
}
//# sourceMappingURL=inout.js.map