import { clamp, squaredLength } from '../util';
import { Line } from '../line';
import { Point } from '../point';
import { Curve } from '../curve';
import { Polyline } from '../polyline';
import { Rectangle } from '../rectangle';
import { Geometry } from '../geometry';
import { Close } from './close';
import { LineTo } from './lineto';
import { MoveTo } from './moveto';
import { CurveTo } from './curveto';
import { normalizePathData } from './normalize';
import * as Util from './util';
export class Path extends Geometry {
    constructor(args) {
        super();
        this.PRECISION = 3;
        this.segments = [];
        if (Array.isArray(args)) {
            if (Line.isLine(args[0]) || Curve.isCurve(args[0])) {
                let previousObj = null;
                const arr = args;
                arr.forEach((o, i) => {
                    if (i === 0) {
                        this.appendSegment(Path.createSegment('M', o.start));
                    }
                    if (previousObj != null && !previousObj.end.equals(o.start)) {
                        this.appendSegment(Path.createSegment('M', o.start));
                    }
                    if (Line.isLine(o)) {
                        this.appendSegment(Path.createSegment('L', o.end));
                    }
                    else if (Curve.isCurve(o)) {
                        this.appendSegment(Path.createSegment('C', o.controlPoint1, o.controlPoint2, o.end));
                    }
                    previousObj = o;
                });
            }
            else {
                const arr = args;
                arr.forEach((s) => {
                    if (s.isSegment) {
                        this.appendSegment(s);
                    }
                });
            }
        }
        else if (args != null) {
            if (Line.isLine(args)) {
                this.appendSegment(Path.createSegment('M', args.start));
                this.appendSegment(Path.createSegment('L', args.end));
            }
            else if (Curve.isCurve(args)) {
                this.appendSegment(Path.createSegment('M', args.start));
                this.appendSegment(Path.createSegment('C', args.controlPoint1, args.controlPoint2, args.end));
            }
            else if (Polyline.isPolyline(args)) {
                if (args.points && args.points.length) {
                    args.points.forEach((point, index) => {
                        const segment = index === 0
                            ? Path.createSegment('M', point)
                            : Path.createSegment('L', point);
                        this.appendSegment(segment);
                    });
                }
            }
            else if (args.isSegment) {
                this.appendSegment(args);
            }
        }
    }
    get [Symbol.toStringTag]() {
        return Path.toStringTag;
    }
    get start() {
        const segments = this.segments;
        const count = segments.length;
        if (count === 0) {
            return null;
        }
        for (let i = 0; i < count; i += 1) {
            const segment = segments[i];
            if (segment.isVisible) {
                return segment.start;
            }
        }
        // if no visible segment, return last segment end point
        return segments[count - 1].end;
    }
    get end() {
        const segments = this.segments;
        const count = segments.length;
        if (count === 0) {
            return null;
        }
        for (let i = count - 1; i >= 0; i -= 1) {
            const segment = segments[i];
            if (segment.isVisible) {
                return segment.end;
            }
        }
        // if no visible segment, return last segment end point
        return segments[count - 1].end;
    }
    moveTo(...args) {
        return this.appendSegment(MoveTo.create.call(null, ...args));
    }
    lineTo(...args) {
        return this.appendSegment(LineTo.create.call(null, ...args));
    }
    curveTo(...args) {
        return this.appendSegment(CurveTo.create.call(null, ...args));
    }
    arcTo(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, endX, endY) {
        const start = this.end || new Point();
        const points = typeof endX === 'number'
            ? Util.arcToCurves(start.x, start.y, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, endX, endY)
            : Util.arcToCurves(start.x, start.y, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, endX.x, endX.y);
        if (points != null) {
            for (let i = 0, ii = points.length; i < ii; i += 6) {
                this.curveTo(points[i], points[i + 1], points[i + 2], points[i + 3], points[i + 4], points[i + 5]);
            }
        }
        return this;
    }
    quadTo(x1, y1, x, y) {
        const start = this.end || new Point();
        const data = ['M', start.x, start.y];
        if (typeof x1 === 'number') {
            data.push('Q', x1, y1, x, y);
        }
        else {
            const p = y1;
            data.push(`Q`, x1.x, x1.y, p.x, p.y);
        }
        const path = Path.parse(data.join(' '));
        this.appendSegment(path.segments.slice(1));
        return this;
    }
    close() {
        return this.appendSegment(Close.create());
    }
    drawPoints(points, options = {}) {
        const raw = Util.drawPoints(points, options);
        const sub = Path.parse(raw);
        if (sub && sub.segments) {
            this.appendSegment(sub.segments);
        }
    }
    bbox() {
        const segments = this.segments;
        const count = segments.length;
        if (count === 0) {
            return null;
        }
        let bbox;
        for (let i = 0; i < count; i += 1) {
            const segment = segments[i];
            if (segment.isVisible) {
                const segmentBBox = segment.bbox();
                if (segmentBBox != null) {
                    bbox = bbox ? bbox.union(segmentBBox) : segmentBBox;
                }
            }
        }
        if (bbox != null) {
            return bbox;
        }
        // if the path has only invisible elements, return end point of last segment
        const lastSegment = segments[count - 1];
        return new Rectangle(lastSegment.end.x, lastSegment.end.y, 0, 0);
    }
    appendSegment(seg) {
        const count = this.segments.length;
        let previousSegment = count !== 0 ? this.segments[count - 1] : null;
        let currentSegment;
        const nextSegment = null;
        if (Array.isArray(seg)) {
            for (let i = 0, ii = seg.length; i < ii; i += 1) {
                const segment = seg[i];
                currentSegment = this.prepareSegment(segment, previousSegment, nextSegment);
                this.segments.push(currentSegment);
                previousSegment = currentSegment;
            }
        }
        else if (seg != null && seg.isSegment) {
            currentSegment = this.prepareSegment(seg, previousSegment, nextSegment);
            this.segments.push(currentSegment);
        }
        return this;
    }
    insertSegment(index, seg) {
        const count = this.segments.length;
        if (index < 0) {
            index = count + index + 1; // eslint-disable-line
        }
        if (index > count || index < 0) {
            throw new Error('Index out of range.');
        }
        let currentSegment;
        let previousSegment = null;
        let nextSegment = null;
        if (count !== 0) {
            if (index >= 1) {
                previousSegment = this.segments[index - 1];
                nextSegment = previousSegment.nextSegment;
            }
            else {
                previousSegment = null;
                nextSegment = this.segments[0];
            }
        }
        if (!Array.isArray(seg)) {
            currentSegment = this.prepareSegment(seg, previousSegment, nextSegment);
            this.segments.splice(index, 0, currentSegment);
        }
        else {
            for (let i = 0, ii = seg.length; i < ii; i += 1) {
                const segment = seg[i];
                currentSegment = this.prepareSegment(segment, previousSegment, nextSegment);
                this.segments.splice(index + i, 0, currentSegment);
                previousSegment = currentSegment;
            }
        }
        return this;
    }
    removeSegment(index) {
        const idx = this.fixIndex(index);
        const removedSegment = this.segments.splice(idx, 1)[0];
        const previousSegment = removedSegment.previousSegment;
        const nextSegment = removedSegment.nextSegment;
        // link the previous and next segments together (if present)
        if (previousSegment) {
            previousSegment.nextSegment = nextSegment;
        }
        if (nextSegment) {
            nextSegment.previousSegment = previousSegment;
        }
        if (removedSegment.isSubpathStart && nextSegment) {
            this.updateSubpathStartSegment(nextSegment);
        }
        return removedSegment;
    }
    replaceSegment(index, seg) {
        const idx = this.fixIndex(index);
        let currentSegment;
        const replacedSegment = this.segments[idx];
        let previousSegment = replacedSegment.previousSegment;
        const nextSegment = replacedSegment.nextSegment;
        let updateSubpathStart = replacedSegment.isSubpathStart;
        if (!Array.isArray(seg)) {
            currentSegment = this.prepareSegment(seg, previousSegment, nextSegment);
            this.segments.splice(idx, 1, currentSegment);
            if (updateSubpathStart && currentSegment.isSubpathStart) {
                // already updated by `prepareSegment`
                updateSubpathStart = false;
            }
        }
        else {
            this.segments.splice(index, 1);
            for (let i = 0, ii = seg.length; i < ii; i += 1) {
                const segment = seg[i];
                currentSegment = this.prepareSegment(segment, previousSegment, nextSegment);
                this.segments.splice(index + i, 0, currentSegment);
                previousSegment = currentSegment;
                if (updateSubpathStart && currentSegment.isSubpathStart) {
                    updateSubpathStart = false;
                }
            }
        }
        if (updateSubpathStart && nextSegment) {
            this.updateSubpathStartSegment(nextSegment);
        }
    }
    getSegment(index) {
        const idx = this.fixIndex(index);
        return this.segments[idx];
    }
    fixIndex(index) {
        const length = this.segments.length;
        if (length === 0) {
            throw new Error('Path has no segments.');
        }
        let i = index;
        while (i < 0) {
            i = length + i;
        }
        if (i >= length || i < 0) {
            throw new Error('Index out of range.');
        }
        return i;
    }
    segmentAt(ratio, options = {}) {
        const index = this.segmentIndexAt(ratio, options);
        if (!index) {
            return null;
        }
        return this.getSegment(index);
    }
    segmentAtLength(length, options = {}) {
        const index = this.segmentIndexAtLength(length, options);
        if (!index)
            return null;
        return this.getSegment(index);
    }
    segmentIndexAt(ratio, options = {}) {
        if (this.segments.length === 0) {
            return null;
        }
        const rate = clamp(ratio, 0, 1);
        const opt = this.getOptions(options);
        const len = this.length(opt);
        const length = len * rate;
        return this.segmentIndexAtLength(length, opt);
    }
    segmentIndexAtLength(length, options = {}) {
        const count = this.segments.length;
        if (count === 0) {
            return null;
        }
        let fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        const precision = this.getPrecision(options);
        const segmentSubdivisions = this.getSubdivisions(options);
        let memo = 0;
        let lastVisibleIndex = null;
        for (let i = 0; i < count; i += 1) {
            const index = fromStart ? i : count - 1 - i;
            const segment = this.segments[index];
            const subdivisions = segmentSubdivisions[index];
            const len = segment.length({ precision, subdivisions });
            if (segment.isVisible) {
                if (length <= memo + len) {
                    return index;
                }
                lastVisibleIndex = index;
            }
            memo += len;
        }
        // If length requested is higher than the length of the path, return
        // last visible segment index. If no visible segment, return null.
        return lastVisibleIndex;
    }
    getSegmentSubdivisions(options = {}) {
        const precision = this.getPrecision(options);
        const segmentSubdivisions = [];
        for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
            const segment = this.segments[i];
            const subdivisions = segment.getSubdivisions({ precision });
            segmentSubdivisions.push(subdivisions);
        }
        return segmentSubdivisions;
    }
    updateSubpathStartSegment(segment) {
        let previous = segment.previousSegment;
        let current = segment;
        while (current && !current.isSubpathStart) {
            // assign previous segment's subpath start segment to this segment
            if (previous != null) {
                current.subpathStartSegment = previous.subpathStartSegment;
            }
            else {
                current.subpathStartSegment = null;
            }
            previous = current;
            current = current.nextSegment;
        }
    }
    prepareSegment(segment, previousSegment, nextSegment) {
        segment.previousSegment = previousSegment;
        segment.nextSegment = nextSegment;
        if (previousSegment != null) {
            previousSegment.nextSegment = segment;
        }
        if (nextSegment != null) {
            nextSegment.previousSegment = segment;
        }
        let updateSubpathStart = segment;
        if (segment.isSubpathStart) {
            // move to
            segment.subpathStartSegment = segment;
            updateSubpathStart = nextSegment;
        }
        // assign previous segment's subpath start (or self if it is a subpath start) to subsequent segments
        if (updateSubpathStart != null) {
            this.updateSubpathStartSegment(updateSubpathStart);
        }
        return segment;
    }
    closestPoint(p, options = {}) {
        const t = this.closestPointT(p, options);
        if (!t) {
            return null;
        }
        return this.pointAtT(t);
    }
    closestPointLength(p, options = {}) {
        const opts = this.getOptions(options);
        const t = this.closestPointT(p, opts);
        if (!t) {
            return 0;
        }
        return this.lengthAtT(t, opts);
    }
    closestPointNormalizedLength(p, options = {}) {
        const opts = this.getOptions(options);
        const cpLength = this.closestPointLength(p, opts);
        if (cpLength === 0) {
            return 0;
        }
        const length = this.length(opts);
        if (length === 0) {
            return 0;
        }
        return cpLength / length;
    }
    closestPointT(p, options = {}) {
        if (this.segments.length === 0) {
            return null;
        }
        const precision = this.getPrecision(options);
        const segmentSubdivisions = this.getSubdivisions(options);
        let closestPointT;
        let minSquaredDistance = Infinity;
        for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
            const segment = this.segments[i];
            const subdivisions = segmentSubdivisions[i];
            if (segment.isVisible) {
                const segmentClosestPointT = segment.closestPointT(p, {
                    precision,
                    subdivisions,
                });
                const segmentClosestPoint = segment.pointAtT(segmentClosestPointT);
                const squaredDistance = squaredLength(segmentClosestPoint, p);
                if (squaredDistance < minSquaredDistance) {
                    closestPointT = { segmentIndex: i, value: segmentClosestPointT };
                    minSquaredDistance = squaredDistance;
                }
            }
        }
        if (closestPointT) {
            return closestPointT;
        }
        return { segmentIndex: this.segments.length - 1, value: 1 };
    }
    closestPointTangent(p, options = {}) {
        if (this.segments.length === 0) {
            return null;
        }
        const precision = this.getPrecision(options);
        const segmentSubdivisions = this.getSubdivisions(options);
        let closestPointTangent;
        let minSquaredDistance = Infinity;
        for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
            const segment = this.segments[i];
            const subdivisions = segmentSubdivisions[i];
            if (segment.isDifferentiable()) {
                const segmentClosestPointT = segment.closestPointT(p, {
                    precision,
                    subdivisions,
                });
                const segmentClosestPoint = segment.pointAtT(segmentClosestPointT);
                const squaredDistance = squaredLength(segmentClosestPoint, p);
                if (squaredDistance < minSquaredDistance) {
                    closestPointTangent = segment.tangentAtT(segmentClosestPointT);
                    minSquaredDistance = squaredDistance;
                }
            }
        }
        if (closestPointTangent) {
            return closestPointTangent;
        }
        return null;
    }
    containsPoint(p, options = {}) {
        const polylines = this.toPolylines(options);
        if (!polylines) {
            return false;
        }
        let numIntersections = 0;
        for (let i = 0, ii = polylines.length; i < ii; i += 1) {
            const polyline = polylines[i];
            if (polyline.containsPoint(p)) {
                numIntersections += 1;
            }
        }
        // returns `true` for odd numbers of intersections (even-odd algorithm)
        return numIntersections % 2 === 1;
    }
    pointAt(ratio, options = {}) {
        if (this.segments.length === 0) {
            return null;
        }
        if (ratio <= 0) {
            return this.start.clone();
        }
        if (ratio >= 1) {
            return this.end.clone();
        }
        const opts = this.getOptions(options);
        const pathLength = this.length(opts);
        const length = pathLength * ratio;
        return this.pointAtLength(length, opts);
    }
    pointAtLength(length, options = {}) {
        if (this.segments.length === 0) {
            return null;
        }
        if (length === 0) {
            return this.start.clone();
        }
        let fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        const precision = this.getPrecision(options);
        const segmentSubdivisions = this.getSubdivisions(options);
        let lastVisibleSegment;
        let memo = 0;
        for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
            const index = fromStart ? i : ii - 1 - i;
            const segment = this.segments[index];
            const subdivisions = segmentSubdivisions[index];
            const d = segment.length({
                precision,
                subdivisions,
            });
            if (segment.isVisible) {
                if (length <= memo + d) {
                    return segment.pointAtLength((fromStart ? 1 : -1) * (length - memo), {
                        precision,
                        subdivisions,
                    });
                }
                lastVisibleSegment = segment;
            }
            memo += d;
        }
        // if length requested is higher than the length of the path,
        // return last visible segment endpoint
        if (lastVisibleSegment) {
            return fromStart ? lastVisibleSegment.end : lastVisibleSegment.start;
        }
        // if no visible segment, return last segment end point
        const lastSegment = this.segments[this.segments.length - 1];
        return lastSegment.end.clone();
    }
    pointAtT(t) {
        const segments = this.segments;
        const numSegments = segments.length;
        if (numSegments === 0)
            return null; // if segments is an empty array
        const segmentIndex = t.segmentIndex;
        if (segmentIndex < 0)
            return segments[0].pointAtT(0);
        if (segmentIndex >= numSegments) {
            return segments[numSegments - 1].pointAtT(1);
        }
        const tValue = clamp(t.value, 0, 1);
        return segments[segmentIndex].pointAtT(tValue);
    }
    divideAt(ratio, options = {}) {
        if (this.segments.length === 0) {
            return null;
        }
        const rate = clamp(ratio, 0, 1);
        const opts = this.getOptions(options);
        const len = this.length(opts);
        const length = len * rate;
        return this.divideAtLength(length, opts);
    }
    divideAtLength(length, options = {}) {
        if (this.segments.length === 0) {
            return null;
        }
        let fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        const precision = this.getPrecision(options);
        const segmentSubdivisions = this.getSubdivisions(options);
        let memo = 0;
        let divided;
        let dividedSegmentIndex;
        let lastValidSegment;
        let lastValidSegmentIndex;
        let t;
        for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
            const index = fromStart ? i : ii - 1 - i;
            const segment = this.getSegment(index);
            const subdivisions = segmentSubdivisions[index];
            const opts = { precision, subdivisions };
            const len = segment.length(opts);
            if (segment.isDifferentiable()) {
                lastValidSegment = segment;
                lastValidSegmentIndex = index;
                if (length <= memo + len) {
                    dividedSegmentIndex = index;
                    divided = segment.divideAtLength((fromStart ? 1 : -1) * (length - memo), opts);
                    break;
                }
            }
            memo += len;
        }
        if (!lastValidSegment) {
            return null;
        }
        if (!divided) {
            dividedSegmentIndex = lastValidSegmentIndex;
            t = fromStart ? 1 : 0;
            divided = lastValidSegment.divideAtT(t);
        }
        // create a copy of this path and replace the identified segment with its two divided parts:
        const pathCopy = this.clone();
        const index = dividedSegmentIndex;
        pathCopy.replaceSegment(index, divided);
        const divisionStartIndex = index;
        let divisionMidIndex = index + 1;
        let divisionEndIndex = index + 2;
        // do not insert the part if it looks like a point
        if (!divided[0].isDifferentiable()) {
            pathCopy.removeSegment(divisionStartIndex);
            divisionMidIndex -= 1;
            divisionEndIndex -= 1;
        }
        // insert a Moveto segment to ensure secondPath will be valid:
        const movetoEnd = pathCopy.getSegment(divisionMidIndex).start;
        pathCopy.insertSegment(divisionMidIndex, Path.createSegment('M', movetoEnd));
        divisionEndIndex += 1;
        // do not insert the part if it looks like a point
        if (!divided[1].isDifferentiable()) {
            pathCopy.removeSegment(divisionEndIndex - 1);
            divisionEndIndex -= 1;
        }
        // ensure that Closepath segments in secondPath will be assigned correct subpathStartSegment:
        const secondPathSegmentIndexConversion = divisionEndIndex - divisionStartIndex - 1;
        for (let i = divisionEndIndex, ii = pathCopy.segments.length; i < ii; i += 1) {
            const originalSegment = this.getSegment(i - secondPathSegmentIndexConversion);
            const segment = pathCopy.getSegment(i);
            if (segment.type === 'Z' &&
                !originalSegment.subpathStartSegment.end.equals(segment.subpathStartSegment.end)) {
                // pathCopy segment's subpathStartSegment is different from original segment's one
                // convert this Closepath segment to a Lineto and replace it in pathCopy
                const convertedSegment = Path.createSegment('L', originalSegment.end);
                pathCopy.replaceSegment(i, convertedSegment);
            }
        }
        // distribute pathCopy segments into two paths and return those:
        const firstPath = new Path(pathCopy.segments.slice(0, divisionMidIndex));
        const secondPath = new Path(pathCopy.segments.slice(divisionMidIndex));
        return [firstPath, secondPath];
    }
    intersectsWithLine(line, options = {}) {
        const polylines = this.toPolylines(options);
        if (polylines == null) {
            return null;
        }
        let intersections = null;
        for (let i = 0, ii = polylines.length; i < ii; i += 1) {
            const polyline = polylines[i];
            const intersection = line.intersect(polyline);
            if (intersection) {
                if (intersections == null) {
                    intersections = [];
                }
                if (Array.isArray(intersection)) {
                    intersections.push(...intersection);
                }
                else {
                    intersections.push(intersection);
                }
            }
        }
        return intersections;
    }
    isDifferentiable() {
        for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
            const segment = this.segments[i];
            if (segment.isDifferentiable()) {
                return true;
            }
        }
        return false;
    }
    isValid() {
        const segments = this.segments;
        const isValid = segments.length === 0 || segments[0].type === 'M';
        return isValid;
    }
    length(options = {}) {
        if (this.segments.length === 0) {
            return 0;
        }
        const segmentSubdivisions = this.getSubdivisions(options);
        let length = 0;
        for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
            const segment = this.segments[i];
            const subdivisions = segmentSubdivisions[i];
            length += segment.length({ subdivisions });
        }
        return length;
    }
    lengthAtT(t, options = {}) {
        const count = this.segments.length;
        if (count === 0) {
            return 0;
        }
        let segmentIndex = t.segmentIndex;
        if (segmentIndex < 0) {
            return 0;
        }
        let tValue = clamp(t.value, 0, 1);
        if (segmentIndex >= count) {
            segmentIndex = count - 1;
            tValue = 1;
        }
        const precision = this.getPrecision(options);
        const segmentSubdivisions = this.getSubdivisions(options);
        let length = 0;
        for (let i = 0; i < segmentIndex; i += 1) {
            const segment = this.segments[i];
            const subdivisions = segmentSubdivisions[i];
            length += segment.length({ precision, subdivisions });
        }
        const segment = this.segments[segmentIndex];
        const subdivisions = segmentSubdivisions[segmentIndex];
        length += segment.lengthAtT(tValue, { precision, subdivisions });
        return length;
    }
    tangentAt(ratio, options = {}) {
        if (this.segments.length === 0) {
            return null;
        }
        const rate = clamp(ratio, 0, 1);
        const opts = this.getOptions(options);
        const len = this.length(opts);
        const length = len * rate;
        return this.tangentAtLength(length, opts);
    }
    tangentAtLength(length, options = {}) {
        if (this.segments.length === 0) {
            return null;
        }
        let fromStart = true;
        if (length < 0) {
            fromStart = false;
            length = -length; // eslint-disable-line
        }
        const precision = this.getPrecision(options);
        const segmentSubdivisions = this.getSubdivisions(options);
        let lastValidSegment;
        let memo = 0;
        for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
            const index = fromStart ? i : ii - 1 - i;
            const segment = this.segments[index];
            const subdivisions = segmentSubdivisions[index];
            const len = segment.length({ precision, subdivisions });
            if (segment.isDifferentiable()) {
                if (length <= memo + len) {
                    return segment.tangentAtLength((fromStart ? 1 : -1) * (length - memo), {
                        precision,
                        subdivisions,
                    });
                }
                lastValidSegment = segment;
            }
            memo += len;
        }
        // if length requested is higher than the length of the path, return tangent of endpoint of last valid segment
        if (lastValidSegment) {
            const t = fromStart ? 1 : 0;
            return lastValidSegment.tangentAtT(t);
        }
        // if no valid segment, return null
        return null;
    }
    tangentAtT(t) {
        const count = this.segments.length;
        if (count === 0) {
            return null;
        }
        const segmentIndex = t.segmentIndex;
        if (segmentIndex < 0) {
            return this.segments[0].tangentAtT(0);
        }
        if (segmentIndex >= count) {
            return this.segments[count - 1].tangentAtT(1);
        }
        const tValue = clamp(t.value, 0, 1);
        return this.segments[segmentIndex].tangentAtT(tValue);
    }
    getPrecision(options = {}) {
        return options.precision == null ? this.PRECISION : options.precision;
    }
    getSubdivisions(options = {}) {
        if (options.segmentSubdivisions == null) {
            const precision = this.getPrecision(options);
            return this.getSegmentSubdivisions({ precision });
        }
        return options.segmentSubdivisions;
    }
    getOptions(options = {}) {
        const precision = this.getPrecision(options);
        const segmentSubdivisions = this.getSubdivisions(options);
        return { precision, segmentSubdivisions };
    }
    toPoints(options = {}) {
        const segments = this.segments;
        const count = segments.length;
        if (count === 0) {
            return null;
        }
        const segmentSubdivisions = this.getSubdivisions(options);
        const points = [];
        let partialPoints = [];
        for (let i = 0; i < count; i += 1) {
            const segment = segments[i];
            if (segment.isVisible) {
                const divisions = segmentSubdivisions[i];
                if (divisions.length > 0) {
                    // eslint-disable-next-line no-loop-func
                    divisions.forEach((c) => partialPoints.push(c.start));
                }
                else {
                    partialPoints.push(segment.start);
                }
            }
            else if (partialPoints.length > 0) {
                partialPoints.push(segments[i - 1].end);
                points.push(partialPoints);
                partialPoints = [];
            }
        }
        if (partialPoints.length > 0) {
            partialPoints.push(this.end);
            points.push(partialPoints);
        }
        return points;
    }
    toPolylines(options = {}) {
        const points = this.toPoints(options);
        if (!points) {
            return null;
        }
        return points.map((arr) => new Polyline(arr));
    }
    scale(sx, sy, origin) {
        this.segments.forEach((s) => s.scale(sx, sy, origin));
        return this;
    }
    rotate(angle, origin) {
        this.segments.forEach((segment) => segment.rotate(angle, origin));
        return this;
    }
    translate(tx, ty) {
        if (typeof tx === 'number') {
            this.segments.forEach((s) => s.translate(tx, ty));
        }
        else {
            this.segments.forEach((s) => s.translate(tx));
        }
        return this;
    }
    clone() {
        const path = new Path();
        this.segments.forEach((s) => path.appendSegment(s.clone()));
        return path;
    }
    equals(p) {
        if (p == null) {
            return false;
        }
        const segments = this.segments;
        const otherSegments = p.segments;
        const count = segments.length;
        if (otherSegments.length !== count) {
            return false;
        }
        for (let i = 0; i < count; i += 1) {
            const a = segments[i];
            const b = otherSegments[i];
            if (a.type !== b.type || !a.equals(b)) {
                return false;
            }
        }
        return true;
    }
    toJSON() {
        return this.segments.map((s) => s.toJSON());
    }
    serialize() {
        if (!this.isValid()) {
            throw new Error('Invalid path segments.');
        }
        return this.segments.map((s) => s.serialize()).join(' ');
    }
    toString() {
        return this.serialize();
    }
}
(function (Path) {
    Path.toStringTag = `X6.Geometry.${Path.name}`;
    function isPath(instance) {
        if (instance == null) {
            return false;
        }
        if (instance instanceof Path) {
            return true;
        }
        const tag = instance[Symbol.toStringTag];
        const path = instance;
        if ((tag == null || tag === Path.toStringTag) &&
            Array.isArray(path.segments) &&
            typeof path.moveTo === 'function' &&
            typeof path.lineTo === 'function' &&
            typeof path.curveTo === 'function') {
            return true;
        }
        return false;
    }
    Path.isPath = isPath;
})(Path || (Path = {}));
(function (Path) {
    function parse(pathData) {
        if (!pathData) {
            return new Path();
        }
        const path = new Path();
        const commandRe = /(?:[a-zA-Z] *)(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)? *,? *)|(?:-?\.\d+ *,? *))+|(?:[a-zA-Z] *)(?! |\d|-|\.)/g;
        const commands = Path.normalize(pathData).match(commandRe);
        if (commands != null) {
            for (let i = 0, ii = commands.length; i < ii; i += 1) {
                const command = commands[i];
                const argRe = /(?:[a-zA-Z])|(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)?))|(?:(?:-?\.\d+))/g;
                // args = [type, coordinate1, coordinate2...]
                const args = command.match(argRe);
                if (args != null) {
                    const type = args[0];
                    const coords = args.slice(1).map((a) => +a);
                    const segment = createSegment.call(null, type, ...coords);
                    path.appendSegment(segment);
                }
            }
        }
        return path;
    }
    Path.parse = parse;
    function createSegment(type, ...args) {
        if (type === 'M') {
            return MoveTo.create.call(null, ...args);
        }
        if (type === 'L') {
            return LineTo.create.call(null, ...args);
        }
        if (type === 'C') {
            return CurveTo.create.call(null, ...args);
        }
        if (type === 'z' || type === 'Z') {
            return Close.create();
        }
        throw new Error(`Invalid path segment type "${type}"`);
    }
    Path.createSegment = createSegment;
})(Path || (Path = {}));
(function (Path) {
    Path.normalize = normalizePathData;
    Path.isValid = Util.isValid;
    Path.drawArc = Util.drawArc;
    Path.drawPoints = Util.drawPoints;
    Path.arcToCurves = Util.arcToCurves;
})(Path || (Path = {}));
//# sourceMappingURL=path.js.map