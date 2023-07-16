import { Geometry } from '../geometry';
export class Segment extends Geometry {
    constructor() {
        super(...arguments);
        this.isVisible = true;
        this.isSegment = true;
        this.isSubpathStart = false;
    }
    get end() {
        return this.endPoint;
    }
    get start() {
        if (this.previousSegment == null) {
            throw new Error('Missing previous segment. (This segment cannot be the ' +
                'first segment of a path, or segment has not yet been ' +
                'added to a path.)');
        }
        return this.previousSegment.end;
    }
    closestPointT(p, options) {
        if (this.closestPointNormalizedLength) {
            return this.closestPointNormalizedLength(p);
        }
        throw new Error('Neither `closestPointT` nor `closestPointNormalizedLength` method is implemented.');
    }
    // eslint-disable-next-line
    lengthAtT(t, options) {
        if (t <= 0) {
            return 0;
        }
        const length = this.length();
        if (t >= 1) {
            return length;
        }
        return length * t;
    }
    divideAtT(t) {
        if (this.divideAt) {
            return this.divideAt(t);
        }
        throw new Error('Neither `divideAtT` nor `divideAt` method is implemented.');
    }
    pointAtT(t) {
        if (this.pointAt) {
            return this.pointAt(t);
        }
        throw new Error('Neither `pointAtT` nor `pointAt` method is implemented.');
    }
    tangentAtT(t) {
        if (this.tangentAt) {
            return this.tangentAt(t);
        }
        throw new Error('Neither `tangentAtT` nor `tangentAt` method is implemented.');
    }
}
//# sourceMappingURL=segment.js.map