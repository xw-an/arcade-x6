import { Point } from './point';
import { Geometry } from './geometry';
import { Rectangle } from './rectangle';
export class Line extends Geometry {
    constructor(x1, y1, x2, y2) {
        super();
        if (typeof x1 === 'number' && typeof y1 === 'number') {
            this.start = new Point(x1, y1);
            this.end = new Point(x2, y2);
        }
        else {
            this.start = Point.create(x1);
            this.end = Point.create(y1);
        }
    }
    get [Symbol.toStringTag]() {
        return Line.toStringTag;
    }
    get center() {
        return new Point((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
    }
    getCenter() {
        return this.center;
    }
    /**
     * Rounds the line to the given `precision`.
     */
    round(precision = 0) {
        this.start.round(precision);
        this.end.round(precision);
        return this;
    }
    translate(tx, ty) {
        if (typeof tx === 'number') {
            this.start.translate(tx, ty);
            this.end.translate(tx, ty);
        }
        else {
            this.start.translate(tx);
            this.end.translate(tx);
        }
        return this;
    }
    /**
     * Rotate the line by `angle` around `origin`.
     */
    rotate(angle, origin) {
        this.start.rotate(angle, origin);
        this.end.rotate(angle, origin);
        return this;
    }
    /**
     * Scale the line by `sx` and `sy` about the given `origin`. If origin is not
     * specified, the line is scaled around `0,0`.
     */
    scale(sx, sy, origin) {
        this.start.scale(sx, sy, origin);
        this.end.scale(sx, sy, origin);
        return this;
    }
    /**
     * Returns the length of the line.
     */
    length() {
        return Math.sqrt(this.squaredLength());
    }
    /**
     * Useful for distance comparisons in which real length is not necessary
     * (saves one `Math.sqrt()` operation).
     */
    squaredLength() {
        const dx = this.start.x - this.end.x;
        const dy = this.start.y - this.end.y;
        return dx * dx + dy * dy;
    }
    /**
     * Scale the line so that it has the requested length. The start point of
     * the line is preserved.
     */
    setLength(length) {
        const total = this.length();
        if (!total) {
            return this;
        }
        const scale = length / total;
        return this.scale(scale, scale, this.start);
    }
    parallel(distance) {
        const line = this.clone();
        if (!line.isDifferentiable()) {
            return line;
        }
        const { start, end } = line;
        const eRef = start.clone().rotate(270, end);
        const sRef = end.clone().rotate(90, start);
        start.move(sRef, distance);
        end.move(eRef, distance);
        return line;
    }
    /**
     * Returns the vector of the line with length equal to length of the line.
     */
    vector() {
        return new Point(this.end.x - this.start.x, this.end.y - this.start.y);
    }
    /**
     * Returns the angle of incline of the line.
     *
     * The function returns `NaN` if the start and end endpoints of the line
     * both lie at the same coordinates(it is impossible to determine the angle
     * of incline of a line that appears to be a point). The
     * `line.isDifferentiable()` function may be used in advance to determine
     * whether the angle of incline can be computed for a given line.
     */
    angle() {
        const horizontal = new Point(this.start.x + 1, this.start.y);
        return this.start.angleBetween(this.end, horizontal);
    }
    /**
     * Returns a rectangle that is the bounding box of the line.
     */
    bbox() {
        const left = Math.min(this.start.x, this.end.x);
        const top = Math.min(this.start.y, this.end.y);
        const right = Math.max(this.start.x, this.end.x);
        const bottom = Math.max(this.start.y, this.end.y);
        return new Rectangle(left, top, right - left, bottom - top);
    }
    /**
     * Returns the bearing (cardinal direction) of the line.
     *
     * The return value is one of the following strings:
     * 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW' and 'N'.
     *
     * The function returns 'N' if the two endpoints of the line are coincident.
     */
    bearing() {
        return this.start.bearing(this.end);
    }
    /**
     * Returns the point on the line that lies closest to point `p`.
     */
    closestPoint(p) {
        return this.pointAt(this.closestPointNormalizedLength(p));
    }
    /**
     * Returns the length of the line up to the point that lies closest to point `p`.
     */
    closestPointLength(p) {
        return this.closestPointNormalizedLength(p) * this.length();
    }
    /**
     * Returns a line that is tangent to the line at the point that lies closest
     * to point `p`.
     */
    closestPointTangent(p) {
        return this.tangentAt(this.closestPointNormalizedLength(p));
    }
    /**
     * Returns the normalized length (distance from the start of the line / total
     * line length) of the line up to the point that lies closest to point.
     */
    closestPointNormalizedLength(p) {
        const product = this.vector().dot(new Line(this.start, p).vector());
        const normalized = Math.min(1, Math.max(0, product / this.squaredLength()));
        // normalized returns `NaN` if this line has zero length
        if (Number.isNaN(normalized)) {
            return 0;
        }
        return normalized;
    }
    /**
     * Returns a point on the line that lies `rate` (normalized length) away from
     * the beginning of the line.
     */
    pointAt(ratio) {
        const start = this.start;
        const end = this.end;
        if (ratio <= 0) {
            return start.clone();
        }
        if (ratio >= 1) {
            return end.clone();
        }
        return start.lerp(end, ratio);
    }
    /**
     * Returns a point on the line that lies length away from the beginning of
     * the line.
     */
    pointAtLength(length) {
        const start = this.start;
        const end = this.end;
        let fromStart = true;
        if (length < 0) {
            fromStart = false; // start calculation from end point
            length = -length; // eslint-disable-line
        }
        const total = this.length();
        if (length >= total) {
            return fromStart ? end.clone() : start.clone();
        }
        const rate = (fromStart ? length : total - length) / total;
        return this.pointAt(rate);
    }
    /**
     * Divides the line into two lines at the point that lies `rate` (normalized
     * length) away from the beginning of the line.
     */
    divideAt(ratio) {
        const dividerPoint = this.pointAt(ratio);
        return [
            new Line(this.start, dividerPoint),
            new Line(dividerPoint, this.end),
        ];
    }
    /**
     * Divides the line into two lines at the point that lies length away from
     * the beginning of the line.
     */
    divideAtLength(length) {
        const dividerPoint = this.pointAtLength(length);
        return [
            new Line(this.start, dividerPoint),
            new Line(dividerPoint, this.end),
        ];
    }
    /**
     * Returns `true` if the point `p` lies on the line. Return `false` otherwise.
     */
    containsPoint(p) {
        const start = this.start;
        const end = this.end;
        // cross product of 0 indicates that this line and
        // the vector to `p` are collinear.
        if (start.cross(p, end) !== 0) {
            return false;
        }
        const length = this.length();
        if (new Line(start, p).length() > length) {
            return false;
        }
        if (new Line(p, end).length() > length) {
            return false;
        }
        return true;
    }
    intersect(shape, options) {
        const ret = shape.intersectsWithLine(this, options);
        if (ret) {
            return Array.isArray(ret) ? ret : [ret];
        }
        return null;
    }
    /**
     * Returns the intersection point of the line with another line. Returns
     * `null` if no intersection exists.
     */
    intersectsWithLine(line) {
        const pt1Dir = new Point(this.end.x - this.start.x, this.end.y - this.start.y);
        const pt2Dir = new Point(line.end.x - line.start.x, line.end.y - line.start.y);
        const det = pt1Dir.x * pt2Dir.y - pt1Dir.y * pt2Dir.x;
        const deltaPt = new Point(line.start.x - this.start.x, line.start.y - this.start.y);
        const alpha = deltaPt.x * pt2Dir.y - deltaPt.y * pt2Dir.x;
        const beta = deltaPt.x * pt1Dir.y - deltaPt.y * pt1Dir.x;
        if (det === 0 || alpha * det < 0 || beta * det < 0) {
            return null;
        }
        if (det > 0) {
            if (alpha > det || beta > det) {
                return null;
            }
        }
        else if (alpha < det || beta < det) {
            return null;
        }
        return new Point(this.start.x + (alpha * pt1Dir.x) / det, this.start.y + (alpha * pt1Dir.y) / det);
    }
    /**
     * Returns `true` if a tangent line can be found for the line.
     *
     * Tangents cannot be found if both of the line endpoints are coincident
     * (the line appears to be a point).
     */
    isDifferentiable() {
        return !this.start.equals(this.end);
    }
    /**
     * Returns the perpendicular distance between the line and point. The
     * distance is positive if the point lies to the right of the line, negative
     * if the point lies to the left of the line, and `0` if the point lies on
     * the line.
     */
    pointOffset(p) {
        const ref = Point.clone(p);
        const start = this.start;
        const end = this.end;
        const determinant = (end.x - start.x) * (ref.y - start.y) -
            (end.y - start.y) * (ref.x - start.x);
        return determinant / this.length();
    }
    pointSquaredDistance(x, y) {
        const p = Point.create(x, y);
        return this.closestPoint(p).squaredDistance(p);
    }
    pointDistance(x, y) {
        const p = Point.create(x, y);
        return this.closestPoint(p).distance(p);
    }
    /**
     * Returns a line tangent to the line at point that lies `rate` (normalized
     * length) away from the beginning of the line.
     */
    tangentAt(ratio) {
        if (!this.isDifferentiable()) {
            return null;
        }
        const start = this.start;
        const end = this.end;
        const tangentStart = this.pointAt(ratio);
        const tangentLine = new Line(start, end);
        tangentLine.translate(tangentStart.x - start.x, tangentStart.y - start.y);
        return tangentLine;
    }
    /**
     * Returns a line tangent to the line at point that lies `length` away from
     * the beginning of the line.
     */
    tangentAtLength(length) {
        if (!this.isDifferentiable()) {
            return null;
        }
        const start = this.start;
        const end = this.end;
        const tangentStart = this.pointAtLength(length);
        const tangentLine = new Line(start, end);
        tangentLine.translate(tangentStart.x - start.x, tangentStart.y - start.y);
        return tangentLine;
    }
    relativeCcw(x, y) {
        const ref = Point.create(x, y);
        let dx1 = ref.x - this.start.x;
        let dy1 = ref.y - this.start.y;
        const dx2 = this.end.x - this.start.x;
        const dy2 = this.end.y - this.start.y;
        let ccw = dx1 * dy2 - dy1 * dx2;
        if (ccw === 0) {
            ccw = dx1 * dx2 + dy1 * dy2;
            if (ccw > 0.0) {
                dx1 -= dx2;
                dy1 -= dy2;
                ccw = dx1 * dx2 + dy1 * dy2;
                if (ccw < 0.0) {
                    ccw = 0.0;
                }
            }
        }
        return ccw < 0.0 ? -1 : ccw > 0.0 ? 1 : 0;
    }
    /**
     * Return `true` if the line equals the other line.
     */
    equals(l) {
        return (l != null &&
            this.start.x === l.start.x &&
            this.start.y === l.start.y &&
            this.end.x === l.end.x &&
            this.end.y === l.end.y);
    }
    /**
     * Returns another line which is a clone of the line.
     */
    clone() {
        return new Line(this.start, this.end);
    }
    toJSON() {
        return { start: this.start.toJSON(), end: this.end.toJSON() };
    }
    serialize() {
        return [this.start.serialize(), this.end.serialize()].join(' ');
    }
}
(function (Line) {
    Line.toStringTag = `X6.Geometry.${Line.name}`;
    function isLine(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Line) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const line = instance;
        try {
            if ((tag == null || tag === Line.toStringTag) &&
                Point.isPoint(line.start) &&
                Point.isPoint(line.end) &&
                typeof line.vector === 'function' &&
                typeof line.bearing === 'function' &&
                typeof line.parallel === 'function' &&
                typeof line.intersect === 'function') {
                return true;
            }
        }
        catch (e) {
            return false;
        }
        return false;
    }
    Line.isLine = isLine;
})(Line || (Line = {}));
//# sourceMappingURL=line.js.map