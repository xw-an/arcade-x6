"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoundingOffsetRect = exports.animateAlongPath = exports.animateTransform = exports.animate = exports.getIntersection = exports.toGeometryShape = exports.toLocalPoint = exports.getTransformToElement = exports.getMatrixByElementAttr = exports.getBBoxByElementAttr = exports.getBBox = exports.bbox = void 0;
var geometry_1 = require("../../geometry");
var attr_1 = require("./attr");
var path_1 = require("./path");
var elem_1 = require("./elem");
var style_1 = require("./style");
var matrix_1 = require("./matrix");
/**
 * Returns the bounding box of the element after transformations are
 * applied. If `withoutTransformations` is `true`, transformations of
 * the element will not be considered when computing the bounding box.
 * If `target` is specified, bounding box will be computed relatively
 * to the `target` element.
 */
function bbox(elem, withoutTransformations, target) {
    var box;
    var ownerSVGElement = elem.ownerSVGElement;
    // If the element is not in the live DOM, it does not have a bounding
    // box defined and so fall back to 'zero' dimension element.
    if (!ownerSVGElement) {
        return new geometry_1.Rectangle(0, 0, 0, 0);
    }
    try {
        box = elem.getBBox();
    }
    catch (e) {
        // Fallback for IE.
        box = {
            x: elem.clientLeft,
            y: elem.clientTop,
            width: elem.clientWidth,
            height: elem.clientHeight,
        };
    }
    if (withoutTransformations) {
        return geometry_1.Rectangle.create(box);
    }
    var matrix = getTransformToElement(elem, target || ownerSVGElement);
    return (0, matrix_1.transformRectangle)(box, matrix);
}
exports.bbox = bbox;
/**
 * Returns the bounding box of the element after transformations are
 * applied. Unlike `bbox()`, this function fixes a browser implementation
 * bug to return the correct bounding box if this elemenent is a group of
 * svg elements (if `options.recursive` is specified).
 */
function getBBox(elem, options) {
    if (options === void 0) { options = {}; }
    var outputBBox;
    var ownerSVGElement = elem.ownerSVGElement;
    // If the element is not in the live DOM, it does not have a bounding box
    // defined and so fall back to 'zero' dimension element.
    // If the element is not an SVGGraphicsElement, we could not measure the
    // bounding box either
    if (!ownerSVGElement || !(0, elem_1.isSVGGraphicsElement)(elem)) {
        if ((0, elem_1.isHTMLElement)(elem)) {
            // If the element is a HTMLElement, return the position relative to the body
            var _a = getBoundingOffsetRect(elem), left = _a.left, top_1 = _a.top, width = _a.width, height = _a.height;
            return new geometry_1.Rectangle(left, top_1, width, height);
        }
        return new geometry_1.Rectangle(0, 0, 0, 0);
    }
    var target = options.target;
    var recursive = options.recursive;
    if (!recursive) {
        try {
            outputBBox = elem.getBBox();
        }
        catch (e) {
            outputBBox = {
                x: elem.clientLeft,
                y: elem.clientTop,
                width: elem.clientWidth,
                height: elem.clientHeight,
            };
        }
        if (!target) {
            return geometry_1.Rectangle.create(outputBBox);
        }
        // transform like target
        var matrix = getTransformToElement(elem, target);
        return (0, matrix_1.transformRectangle)(outputBBox, matrix);
    }
    // recursive
    {
        var children = elem.childNodes;
        var n = children.length;
        if (n === 0) {
            return getBBox(elem, { target: target });
        }
        if (!target) {
            target = elem; // eslint-disable-line
        }
        for (var i = 0; i < n; i += 1) {
            var child = children[i];
            var childBBox = void 0;
            if (child.childNodes.length === 0) {
                childBBox = getBBox(child, { target: target });
            }
            else {
                // if child is a group element, enter it with a recursive call
                childBBox = getBBox(child, { target: target, recursive: true });
            }
            if (!outputBBox) {
                outputBBox = childBBox;
            }
            else {
                outputBBox = outputBBox.union(childBBox);
            }
        }
        return outputBBox;
    }
}
exports.getBBox = getBBox;
// BBox is calculated by the attribute on the node
function getBBoxByElementAttr(elem) {
    var node = elem;
    var tagName = node ? node.tagName.toLowerCase() : '';
    // find shape node
    while (tagName === 'g') {
        node = node.firstElementChild;
        tagName = node ? node.tagName.toLowerCase() : '';
    }
    var attr = function (name) {
        var s = node.getAttribute(name);
        var v = s ? parseFloat(s) : 0;
        return Number.isNaN(v) ? 0 : v;
    };
    var r;
    var bbox;
    switch (tagName) {
        case 'rect':
            bbox = new geometry_1.Rectangle(attr('x'), attr('y'), attr('width'), attr('height'));
            break;
        case 'circle':
            r = attr('r');
            bbox = new geometry_1.Rectangle(attr('cx') - r, attr('cy') - r, 2 * r, 2 * r);
            break;
        default:
            break;
    }
    return bbox;
}
exports.getBBoxByElementAttr = getBBoxByElementAttr;
// Matrix is calculated by the transform attribute on the node
function getMatrixByElementAttr(elem, target) {
    var matrix = (0, matrix_1.createSVGMatrix)();
    if ((0, elem_1.isSVGGraphicsElement)(target) && (0, elem_1.isSVGGraphicsElement)(elem)) {
        var node = elem;
        var matrixList = [];
        while (node && node !== target) {
            var transform = node.getAttribute('transform') || null;
            var nodeMatrix = (0, matrix_1.transformStringToMatrix)(transform);
            matrixList.push(nodeMatrix);
            node = node.parentNode;
        }
        matrixList.reverse().forEach(function (m) {
            matrix = matrix.multiply(m);
        });
    }
    return matrix;
}
exports.getMatrixByElementAttr = getMatrixByElementAttr;
/**
 * Returns an DOMMatrix that specifies the transformation necessary
 * to convert `elem` coordinate system into `target` coordinate system.
 */
function getTransformToElement(elem, target) {
    if ((0, elem_1.isSVGGraphicsElement)(target) && (0, elem_1.isSVGGraphicsElement)(elem)) {
        var targetCTM = target.getScreenCTM();
        var nodeCTM = elem.getScreenCTM();
        if (targetCTM && nodeCTM) {
            return targetCTM.inverse().multiply(nodeCTM);
        }
    }
    // Could not get actual transformation matrix
    return (0, matrix_1.createSVGMatrix)();
}
exports.getTransformToElement = getTransformToElement;
/**
 * Converts a global point with coordinates `x` and `y` into the
 * coordinate space of the element.
 */
function toLocalPoint(elem, x, y) {
    var svg = elem instanceof SVGSVGElement
        ? elem
        : elem.ownerSVGElement;
    var p = svg.createSVGPoint();
    p.x = x;
    p.y = y;
    try {
        var ctm = svg.getScreenCTM();
        var globalPoint = p.matrixTransform(ctm.inverse());
        var globalToLocalMatrix = getTransformToElement(elem, svg).inverse();
        return globalPoint.matrixTransform(globalToLocalMatrix);
    }
    catch (e) {
        return p;
    }
}
exports.toLocalPoint = toLocalPoint;
/**
 * Convert the SVGElement to an equivalent geometric shape. The element's
 * transformations are not taken into account.
 *
 * SVGRectElement      => Rectangle
 *
 * SVGLineElement      => Line
 *
 * SVGCircleElement    => Ellipse
 *
 * SVGEllipseElement   => Ellipse
 *
 * SVGPolygonElement   => Polyline
 *
 * SVGPolylineElement  => Polyline
 *
 * SVGPathElement      => Path
 *
 * others              => Rectangle
 */
function toGeometryShape(elem) {
    var attr = function (name) {
        var s = elem.getAttribute(name);
        var v = s ? parseFloat(s) : 0;
        return Number.isNaN(v) ? 0 : v;
    };
    switch (elem instanceof SVGElement && elem.nodeName.toLowerCase()) {
        case 'rect':
            return new geometry_1.Rectangle(attr('x'), attr('y'), attr('width'), attr('height'));
        case 'circle':
            return new geometry_1.Ellipse(attr('cx'), attr('cy'), attr('r'), attr('r'));
        case 'ellipse':
            return new geometry_1.Ellipse(attr('cx'), attr('cy'), attr('rx'), attr('ry'));
        case 'polyline': {
            var points = (0, path_1.getPointsFromSvgElement)(elem);
            return new geometry_1.Polyline(points);
        }
        case 'polygon': {
            var points = (0, path_1.getPointsFromSvgElement)(elem);
            if (points.length > 1) {
                points.push(points[0]);
            }
            return new geometry_1.Polyline(points);
        }
        case 'path': {
            var d = elem.getAttribute('d');
            if (!geometry_1.Path.isValid(d)) {
                d = geometry_1.Path.normalize(d);
            }
            return geometry_1.Path.parse(d);
        }
        case 'line': {
            return new geometry_1.Line(attr('x1'), attr('y1'), attr('x2'), attr('y2'));
        }
        default:
            break;
    }
    // Anything else is a rectangle
    return getBBox(elem);
}
exports.toGeometryShape = toGeometryShape;
function getIntersection(elem, ref, target) {
    var svg = elem instanceof SVGSVGElement ? elem : elem.ownerSVGElement;
    target = target || svg; // eslint-disable-line
    var bbox = getBBox(target);
    var center = bbox.getCenter();
    if (!bbox.intersectsWithLineFromCenterToPoint(ref)) {
        return null;
    }
    var spot = null;
    var tagName = elem.tagName.toLowerCase();
    // Little speed up optimization for `<rect>` element. We do not do convert
    // to path element and sampling but directly calculate the intersection
    // through a transformed geometrical rectangle.
    if (tagName === 'rect') {
        var gRect = new geometry_1.Rectangle(parseFloat(elem.getAttribute('x') || '0'), parseFloat(elem.getAttribute('y') || '0'), parseFloat(elem.getAttribute('width') || '0'), parseFloat(elem.getAttribute('height') || '0'));
        // Get the rect transformation matrix with regards to the SVG document.
        var rectMatrix = getTransformToElement(elem, target);
        var rectMatrixComponents = (0, matrix_1.decomposeMatrix)(rectMatrix);
        // Rotate the rectangle back so that we can use
        // `intersectsWithLineFromCenterToPoint()`.
        var reseted = svg.createSVGTransform();
        reseted.setRotate(-rectMatrixComponents.rotation, center.x, center.y);
        var rect = (0, matrix_1.transformRectangle)(gRect, reseted.matrix.multiply(rectMatrix));
        spot = geometry_1.Rectangle.create(rect).intersectsWithLineFromCenterToPoint(ref, rectMatrixComponents.rotation);
    }
    else if (tagName === 'path' ||
        tagName === 'polygon' ||
        tagName === 'polyline' ||
        tagName === 'circle' ||
        tagName === 'ellipse') {
        var pathNode = tagName === 'path' ? elem : (0, path_1.toPath)(elem);
        var samples = (0, path_1.sample)(pathNode);
        var minDistance = Infinity;
        var closestSamples = [];
        for (var i = 0, ii = samples.length; i < ii; i += 1) {
            var sample_1 = samples[i];
            // Convert the sample point in the local coordinate system
            // to the global coordinate system.
            var gp = (0, matrix_1.createSVGPoint)(sample_1.x, sample_1.y);
            gp = gp.matrixTransform(getTransformToElement(elem, target));
            var ggp = geometry_1.Point.create(gp);
            var centerDistance = ggp.distance(center);
            // Penalize a higher distance to the reference point by 10%.
            // This gives better results. This is due to
            // inaccuracies introduced by rounding errors and getPointAtLength() returns.
            var refDistance = ggp.distance(ref) * 1.1;
            var distance = centerDistance + refDistance;
            if (distance < minDistance) {
                minDistance = distance;
                closestSamples = [{ sample: sample_1, refDistance: refDistance }];
            }
            else if (distance < minDistance + 1) {
                closestSamples.push({ sample: sample_1, refDistance: refDistance });
            }
        }
        closestSamples.sort(function (a, b) { return a.refDistance - b.refDistance; });
        if (closestSamples[0]) {
            spot = geometry_1.Point.create(closestSamples[0].sample);
        }
    }
    return spot;
}
exports.getIntersection = getIntersection;
function animate(elem, options) {
    return createAnimation(elem, options, 'animate');
}
exports.animate = animate;
function animateTransform(elem, options) {
    return createAnimation(elem, options, 'animateTransform');
}
exports.animateTransform = animateTransform;
function createAnimation(elem, options, type) {
    // @see
    // https://www.w3.org/TR/SVG11/animate.html#AnimateElement
    // https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimateElement
    // https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimateTransformElement
    var animate = (0, elem_1.createSvgElement)(type);
    elem.appendChild(animate);
    try {
        return setupAnimation(animate, options);
    }
    catch (error) {
        // pass
    }
    return function () { };
}
function setupAnimation(animate, options) {
    var start = options.start, complete = options.complete, repeat = options.repeat, attrs = __rest(options, ["start", "complete", "repeat"]);
    (0, attr_1.attr)(animate, attrs);
    start && animate.addEventListener('beginEvent', start);
    complete && animate.addEventListener('endEvent', complete);
    repeat && animate.addEventListener('repeatEvent', repeat);
    var ani = animate;
    setTimeout(function () {
        ani.beginElement();
    });
    return function () { return ani.endElement(); };
}
/**
 * Animate the element along the path SVG element (or Vector object).
 * `attrs` contain Animation Timing attributes describing the animation.
 */
function animateAlongPath(elem, options, path) {
    var id = (0, elem_1.ensureId)(path);
    // https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimationElement
    var animate = (0, elem_1.createSvgElement)('animateMotion');
    var mpath = (0, elem_1.createSvgElement)('mpath');
    (0, attr_1.attr)(mpath, { 'xlink:href': "#" + id });
    animate.appendChild(mpath);
    elem.appendChild(animate);
    try {
        return setupAnimation(animate, options);
    }
    catch (e) {
        // Fallback for IE 9.
        if (document.documentElement.getAttribute('smiling') === 'fake') {
            // Register the animation. (See `https://answers.launchpad.net/smil/+question/203333`)
            var ani = animate;
            ani.animators = [];
            var win = window;
            var animationID = ani.getAttribute('id');
            if (animationID) {
                win.id2anim[animationID] = ani;
            }
            var targets = win.getTargets(ani);
            for (var i = 0, ii = targets.length; i < ii; i += 1) {
                var target = targets[i];
                var animator = new win.Animator(ani, target, i);
                win.animators.push(animator);
                ani.animators[i] = animator;
                animator.register();
            }
        }
    }
    return function () { };
}
exports.animateAlongPath = animateAlongPath;
function getBoundingOffsetRect(elem) {
    var left = 0;
    var top = 0;
    var width = 0;
    var height = 0;
    if (elem) {
        var current = elem;
        while (current) {
            left += current.offsetLeft;
            top += current.offsetTop;
            current = current.offsetParent;
            if (current) {
                left += parseInt((0, style_1.getComputedStyle)(current, 'borderLeft'), 10);
                top += parseInt((0, style_1.getComputedStyle)(current, 'borderTop'), 10);
            }
        }
        width = elem.offsetWidth;
        height = elem.offsetHeight;
    }
    return { left: left, top: top, width: width, height: height };
}
exports.getBoundingOffsetRect = getBoundingOffsetRect;
//# sourceMappingURL=geom.js.map