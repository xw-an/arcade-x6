"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.er = void 0;
var er = function (vertices, options, edgeView) {
    var offsetRaw = options.offset || 32;
    var min = options.min == null ? 16 : options.min;
    var offset = 0;
    var direction = options.direction;
    var sourceBBox = edgeView.sourceBBox;
    var targetBBox = edgeView.targetBBox;
    var sourcePoint = sourceBBox.getCenter();
    var targetPoint = targetBBox.getCenter();
    if (typeof offsetRaw === 'number') {
        offset = offsetRaw;
    }
    if (direction == null) {
        var dx = targetBBox.left - sourceBBox.right;
        var dy = targetBBox.top - sourceBBox.bottom;
        if (dx >= 0 && dy >= 0) {
            direction = dx >= dy ? 'L' : 'T';
        }
        else if (dx <= 0 && dy >= 0) {
            dx = sourceBBox.left - targetBBox.right;
            if (dx >= 0) {
                direction = dx >= dy ? 'R' : 'T';
            }
            else {
                direction = 'T';
            }
        }
        else if (dx >= 0 && dy <= 0) {
            dy = sourceBBox.top - targetBBox.bottom;
            if (dy >= 0) {
                direction = dx >= dy ? 'L' : 'B';
            }
            else {
                direction = 'L';
            }
        }
        else {
            dx = sourceBBox.left - targetBBox.right;
            dy = sourceBBox.top - targetBBox.bottom;
            if (dx >= 0 && dy >= 0) {
                direction = dx >= dy ? 'R' : 'B';
            }
            else if (dx <= 0 && dy >= 0) {
                direction = 'B';
            }
            else if (dx >= 0 && dy <= 0) {
                direction = 'R';
            }
            else {
                direction = Math.abs(dx) > Math.abs(dy) ? 'R' : 'B';
            }
        }
    }
    if (direction === 'H') {
        direction = targetPoint.x - sourcePoint.x >= 0 ? 'L' : 'R';
    }
    else if (direction === 'V') {
        direction = targetPoint.y - sourcePoint.y >= 0 ? 'T' : 'B';
    }
    if (offsetRaw === 'center') {
        if (direction === 'L') {
            offset = (targetBBox.left - sourceBBox.right) / 2;
        }
        else if (direction === 'R') {
            offset = (sourceBBox.left - targetBBox.right) / 2;
        }
        else if (direction === 'T') {
            offset = (targetBBox.top - sourceBBox.bottom) / 2;
        }
        else if (direction === 'B') {
            offset = (sourceBBox.top - targetBBox.bottom) / 2;
        }
    }
    var coord;
    var dim;
    var factor;
    var horizontal = direction === 'L' || direction === 'R';
    if (horizontal) {
        if (targetPoint.y === sourcePoint.y) {
            return __spreadArray([], vertices, true);
        }
        factor = direction === 'L' ? 1 : -1;
        coord = 'x';
        dim = 'width';
    }
    else {
        if (targetPoint.x === sourcePoint.x) {
            return __spreadArray([], vertices, true);
        }
        factor = direction === 'T' ? 1 : -1;
        coord = 'y';
        dim = 'height';
    }
    var source = sourcePoint.clone();
    var target = targetPoint.clone();
    source[coord] += factor * (sourceBBox[dim] / 2 + offset);
    target[coord] -= factor * (targetBBox[dim] / 2 + offset);
    if (horizontal) {
        var sourceX = source.x;
        var targetX = target.x;
        var sourceDelta = sourceBBox.width / 2 + min;
        var targetDelta = targetBBox.width / 2 + min;
        if (targetPoint.x > sourcePoint.x) {
            if (targetX <= sourceX) {
                source.x = Math.max(targetX, sourcePoint.x + sourceDelta);
                target.x = Math.min(sourceX, targetPoint.x - targetDelta);
            }
        }
        else if (targetX >= sourceX) {
            source.x = Math.min(targetX, sourcePoint.x - sourceDelta);
            target.x = Math.max(sourceX, targetPoint.x + targetDelta);
        }
    }
    else {
        var sourceY = source.y;
        var targetY = target.y;
        var sourceDelta = sourceBBox.height / 2 + min;
        var targetDelta = targetBBox.height / 2 + min;
        if (targetPoint.y > sourcePoint.y) {
            if (targetY <= sourceY) {
                source.y = Math.max(targetY, sourcePoint.y + sourceDelta);
                target.y = Math.min(sourceY, targetPoint.y - targetDelta);
            }
        }
        else if (targetY >= sourceY) {
            source.y = Math.min(targetY, sourcePoint.y - sourceDelta);
            target.y = Math.max(sourceY, targetPoint.y + targetDelta);
        }
    }
    return __spreadArray(__spreadArray([source.toJSON()], vertices, true), [target.toJSON()], false);
};
exports.er = er;
//# sourceMappingURL=er.js.map