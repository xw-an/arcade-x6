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
exports.boundary = void 0;
var util_1 = require("../../util");
var geometry_1 = require("../../geometry");
var util_2 = require("./util");
/**
 * Places the connection point at the intersection between the
 * edge path end segment and the actual shape of the target magnet.
 */
var boundary = function (line, view, magnet, options) {
    var node;
    var intersection;
    var anchor = line.end;
    var selector = options.selector;
    if (typeof selector === 'string') {
        node = view.findOne(selector);
    }
    else if (Array.isArray(selector)) {
        node = util_1.ObjectExt.getByPath(magnet, selector);
    }
    else {
        node = (0, util_2.findShapeNode)(magnet);
    }
    if (!util_1.Dom.isSVGGraphicsElement(node)) {
        if (node === magnet || !util_1.Dom.isSVGGraphicsElement(magnet)) {
            return anchor;
        }
        node = magnet;
    }
    var localShape = view.getShapeOfElement(node);
    var magnetMatrix = view.getMatrixOfElement(node);
    var translateMatrix = view.getRootTranslatedMatrix();
    var rotateMatrix = view.getRootRotatedMatrix();
    var targetMatrix = translateMatrix
        .multiply(rotateMatrix)
        .multiply(magnetMatrix);
    var localMatrix = targetMatrix.inverse();
    var localLine = util_1.Dom.transformLine(line, localMatrix);
    var localRef = localLine.start.clone();
    var data = view.getDataOfElement(node);
    if (options.insideout === false) {
        if (data.shapeBBox == null) {
            data.shapeBBox = localShape.bbox();
        }
        var localBBox = data.shapeBBox;
        if (localBBox != null && localBBox.containsPoint(localRef)) {
            return anchor;
        }
    }
    if (options.extrapolate === true) {
        localLine.setLength(1e6);
    }
    // Caching segment subdivisions for paths
    var pathOptions;
    if (geometry_1.Path.isPath(localShape)) {
        var precision = options.precision || 2;
        if (data.segmentSubdivisions == null) {
            data.segmentSubdivisions = localShape.getSegmentSubdivisions({
                precision: precision,
            });
        }
        pathOptions = {
            precision: precision,
            segmentSubdivisions: data.segmentSubdivisions,
        };
        intersection = localLine.intersect(localShape, pathOptions);
    }
    else {
        intersection = localLine.intersect(localShape);
    }
    if (intersection) {
        if (Array.isArray(intersection)) {
            intersection = localRef.closest(intersection);
        }
    }
    else if (options.sticky === true) {
        // No intersection, find the closest point instead
        if (geometry_1.Rectangle.isRectangle(localShape)) {
            intersection = localShape.getNearestPointToPoint(localRef);
        }
        else if (geometry_1.Ellipse.isEllipse(localShape)) {
            intersection = localShape.intersectsWithLineFromCenterToPoint(localRef);
        }
        else {
            intersection = localShape.closestPoint(localRef, pathOptions);
        }
    }
    var cp = intersection
        ? util_1.Dom.transformPoint(intersection, targetMatrix)
        : anchor;
    var cpOffset = options.offset || 0;
    if (options.stroked !== false) {
        if (typeof cpOffset === 'object') {
            cpOffset = __assign({}, cpOffset);
            if (cpOffset.x == null) {
                cpOffset.x = 0;
            }
            cpOffset.x += (0, util_2.getStrokeWidth)(node) / 2;
        }
        else {
            cpOffset += (0, util_2.getStrokeWidth)(node) / 2;
        }
    }
    return (0, util_2.offset)(cp, line.start, cpOffset);
};
exports.boundary = boundary;
//# sourceMappingURL=boundary.js.map