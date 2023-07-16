import { Line } from '../line';
import { Curve } from '../curve';
import { Point } from '../point';
import { LineTo } from './lineto';
import { Segment } from './segment';
export class MoveTo extends Segment {
    constructor(x, y) {
        super();
        this.isVisible = false;
        this.isSubpathStart = true;
        if (Line.isLine(x) || Curve.isCurve(x)) {
            this.endPoint = x.end.clone().round(2);
        }
        else {
            this.endPoint = Point.create(x, y).round(2);
        }
    }
    get start() {
        throw new Error('Illegal access. Moveto segments should not need a start property.');
    }
    get type() {
        return 'M';
    }
    bbox() {
        return null;
    }
    closestPoint() {
        return this.end.clone();
    }
    closestPointLength() {
        return 0;
    }
    closestPointNormalizedLength() {
        return 0;
    }
    closestPointT() {
        return 1;
    }
    closestPointTangent() {
        return null;
    }
    length() {
        return 0;
    }
    lengthAtT() {
        return 0;
    }
    divideAt() {
        return [this.clone(), this.clone()];
    }
    divideAtLength() {
        return [this.clone(), this.clone()];
    }
    getSubdivisions() {
        return [];
    }
    pointAt() {
        return this.end.clone();
    }
    pointAtLength() {
        return this.end.clone();
    }
    pointAtT() {
        return this.end.clone();
    }
    tangentAt() {
        return null;
    }
    tangentAtLength() {
        return null;
    }
    tangentAtT() {
        return null;
    }
    isDifferentiable() {
        return false;
    }
    scale(sx, sy, origin) {
        this.end.scale(sx, sy, origin);
        return this;
    }
    rotate(angle, origin) {
        this.end.rotate(angle, origin);
        return this;
    }
    translate(tx, ty) {
        if (typeof tx === 'number') {
            this.end.translate(tx, ty);
        }
        else {
            this.end.translate(tx);
        }
        return this;
    }
    clone() {
        return new MoveTo(this.end);
    }
    equals(s) {
        return this.type === s.type && this.end.equals(s.end);
    }
    toJSON() {
        return {
            type: this.type,
            end: this.end.toJSON(),
        };
    }
    serialize() {
        const end = this.end;
        return `${this.type} ${end.x} ${end.y}`;
    }
}
(function (MoveTo) {
    function create(...args) {
        const len = args.length;
        const arg0 = args[0];
        // line provided
        if (Line.isLine(arg0)) {
            return new MoveTo(arg0);
        }
        // curve provided
        if (Curve.isCurve(arg0)) {
            return new MoveTo(arg0);
        }
        // points provided
        if (Point.isPointLike(arg0)) {
            if (len === 1) {
                return new MoveTo(arg0);
            }
            // this is a moveto-with-subsequent-poly-line segment
            const segments = [];
            // points come one by one
            for (let i = 0; i < len; i += 1) {
                if (i === 0) {
                    segments.push(new MoveTo(args[i]));
                }
                else {
                    segments.push(new LineTo(args[i]));
                }
            }
            return segments;
        }
        // coordinates provided
        if (len === 2) {
            return new MoveTo(+args[0], +args[1]);
        }
        // this is a moveto-with-subsequent-poly-line segment
        const segments = [];
        for (let i = 0; i < len; i += 2) {
            const x = +args[i];
            const y = +args[i + 1];
            if (i === 0) {
                segments.push(new MoveTo(x, y));
            }
            else {
                segments.push(new LineTo(x, y));
            }
        }
        return segments;
    }
    MoveTo.create = create;
})(MoveTo || (MoveTo = {}));
//# sourceMappingURL=moveto.js.map