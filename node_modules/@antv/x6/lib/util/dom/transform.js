"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateAndAutoOrient = exports.scale = exports.rotate = exports.translate = exports.transform = void 0;
var geometry_1 = require("../../geometry");
var attr_1 = require("./attr");
var geom_1 = require("./geom");
var matrix_1 = require("./matrix");
function transform(elem, matrix, options) {
    if (options === void 0) { options = {}; }
    if (matrix == null) {
        return (0, matrix_1.transformStringToMatrix)((0, attr_1.attr)(elem, 'transform'));
    }
    if (options.absolute) {
        elem.setAttribute('transform', (0, matrix_1.matrixToTransformString)(matrix));
        return;
    }
    var transformList = elem.transform;
    var svgTransform = (0, matrix_1.createSVGTransform)(matrix);
    transformList.baseVal.appendItem(svgTransform);
}
exports.transform = transform;
function translate(elem, tx, ty, options) {
    if (ty === void 0) { ty = 0; }
    if (options === void 0) { options = {}; }
    var transformAttr = (0, attr_1.attr)(elem, 'transform');
    var transform = (0, matrix_1.parseTransformString)(transformAttr);
    if (tx == null) {
        return transform.translation;
    }
    transformAttr = transform.raw;
    transformAttr = transformAttr.replace(/translate\([^)]*\)/g, '').trim();
    var newTx = options.absolute ? tx : transform.translation.tx + tx;
    var newTy = options.absolute ? ty : transform.translation.ty + ty;
    var newTranslate = "translate(" + newTx + "," + newTy + ")";
    // Note that `translate()` is always the first transformation. This is
    // usually the desired case.
    elem.setAttribute('transform', (newTranslate + " " + transformAttr).trim());
}
exports.translate = translate;
function rotate(elem, angle, cx, cy, options) {
    if (options === void 0) { options = {}; }
    var transformAttr = (0, attr_1.attr)(elem, 'transform');
    var transform = (0, matrix_1.parseTransformString)(transformAttr);
    if (angle == null) {
        return transform.rotation;
    }
    transformAttr = transform.raw;
    transformAttr = transformAttr.replace(/rotate\([^)]*\)/g, '').trim();
    angle %= 360; // eslint-disable-line
    var newAngle = options.absolute ? angle : transform.rotation.angle + angle;
    var newOrigin = cx != null && cy != null ? "," + cx + "," + cy : '';
    var newRotate = "rotate(" + newAngle + newOrigin + ")";
    elem.setAttribute('transform', (transformAttr + " " + newRotate).trim());
}
exports.rotate = rotate;
function scale(elem, sx, sy) {
    var transformAttr = (0, attr_1.attr)(elem, 'transform');
    var transform = (0, matrix_1.parseTransformString)(transformAttr);
    if (sx == null) {
        return transform.scale;
    }
    sy = sy == null ? sx : sy; // eslint-disable-line
    transformAttr = transform.raw;
    transformAttr = transformAttr.replace(/scale\([^)]*\)/g, '').trim();
    var newScale = "scale(" + sx + "," + sy + ")";
    elem.setAttribute('transform', (transformAttr + " " + newScale).trim());
}
exports.scale = scale;
function translateAndAutoOrient(elem, position, reference, target) {
    var pos = geometry_1.Point.create(position);
    var ref = geometry_1.Point.create(reference);
    if (!target) {
        var svg = elem instanceof SVGSVGElement ? elem : elem.ownerSVGElement;
        target = svg; // eslint-disable-line
    }
    // Clean-up previously set transformations except the scale.
    // If we didn't clean up the previous transformations then they'd
    // add up with the old ones. Scale is an exception as it doesn't
    // add up, consider: `this.scale(2).scale(2).scale(2)`. The result
    // is that the element is scaled by the factor 2, not 8.
    var s = scale(elem);
    elem.setAttribute('transform', '');
    var bbox = (0, geom_1.getBBox)(elem, { target: target }).scale(s.sx, s.sy);
    // 1. Translate to origin.
    var translateToOrigin = (0, matrix_1.createSVGTransform)();
    translateToOrigin.setTranslate(-bbox.x - bbox.width / 2, -bbox.y - bbox.height / 2);
    // 2. Rotate around origin.
    var rotateAroundOrigin = (0, matrix_1.createSVGTransform)();
    var angle = pos.angleBetween(ref, pos.clone().translate(1, 0));
    if (angle)
        rotateAroundOrigin.setRotate(angle, 0, 0);
    // 3. Translate to the `position` + the offset (half my width)
    //    towards the `reference` point.
    var translateFromOrigin = (0, matrix_1.createSVGTransform)();
    var finalPosition = pos.clone().move(ref, bbox.width / 2);
    translateFromOrigin.setTranslate(2 * pos.x - finalPosition.x, 2 * pos.y - finalPosition.y);
    // 4. Get the current transformation matrix of this node
    var ctm = (0, geom_1.getTransformToElement)(elem, target);
    // 5. Apply transformations and the scale
    var transform = (0, matrix_1.createSVGTransform)();
    transform.setMatrix(translateFromOrigin.matrix.multiply(rotateAroundOrigin.matrix.multiply(translateToOrigin.matrix.multiply(ctm.scale(s.sx, s.sy)))));
    elem.setAttribute('transform', (0, matrix_1.matrixToTransformString)(transform.matrix));
}
exports.translateAndAutoOrient = translateAndAutoOrient;
//# sourceMappingURL=transform.js.map