"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftAnnotations = exports.findAnnotationsBetweenIndexes = exports.findAnnotationsAtIndex = exports.annotate = void 0;
var object_1 = require("../object");
var attr_1 = require("../dom/attr");
function annotate(t, annotations, opt) {
    if (opt === void 0) { opt = {}; }
    var offset = opt.offset || 0;
    var compacted = [];
    var ret = [];
    var curr;
    var prev;
    var batch = null;
    for (var i = 0; i < t.length; i += 1) {
        curr = ret[i] = t[i];
        for (var j = 0, jj = annotations.length; j < jj; j += 1) {
            var annotation = annotations[j];
            var start = annotation.start + offset;
            var end = annotation.end + offset;
            if (i >= start && i < end) {
                if (typeof curr === 'string') {
                    curr = ret[i] = {
                        t: t[i],
                        attrs: annotation.attrs,
                    };
                }
                else {
                    curr.attrs = (0, attr_1.mergeAttrs)((0, attr_1.mergeAttrs)({}, curr.attrs), annotation.attrs);
                }
                if (opt.includeAnnotationIndices) {
                    if (curr.annotations == null) {
                        curr.annotations = [];
                    }
                    curr.annotations.push(j);
                }
            }
        }
        prev = ret[i - 1];
        if (!prev) {
            batch = curr;
        }
        else if (object_1.ObjectExt.isObject(curr) && object_1.ObjectExt.isObject(prev)) {
            batch = batch;
            // Both previous item and the current one are annotations.
            // If the attributes didn't change, merge the text.
            if (JSON.stringify(curr.attrs) === JSON.stringify(prev.attrs)) {
                batch.t += curr.t;
            }
            else {
                compacted.push(batch);
                batch = curr;
            }
        }
        else if (object_1.ObjectExt.isObject(curr)) {
            // Previous item was a string, current item is an annotation.
            batch = batch;
            compacted.push(batch);
            batch = curr;
        }
        else if (object_1.ObjectExt.isObject(prev)) {
            // Previous item was an annotation, current item is a string.
            batch = batch;
            compacted.push(batch);
            batch = curr;
        }
        else {
            // Both previous and current item are strings.
            batch = (batch || '') + curr;
        }
    }
    if (batch != null) {
        compacted.push(batch);
    }
    return compacted;
}
exports.annotate = annotate;
function findAnnotationsAtIndex(annotations, index) {
    return annotations
        ? annotations.filter(function (a) { return a.start < index && index <= a.end; })
        : [];
}
exports.findAnnotationsAtIndex = findAnnotationsAtIndex;
function findAnnotationsBetweenIndexes(annotations, start, end) {
    return annotations
        ? annotations.filter(function (a) {
            return (start >= a.start && start < a.end) ||
                (end > a.start && end <= a.end) ||
                (a.start >= start && a.end < end);
        })
        : [];
}
exports.findAnnotationsBetweenIndexes = findAnnotationsBetweenIndexes;
function shiftAnnotations(annotations, index, offset) {
    if (annotations) {
        annotations.forEach(function (a) {
            if (a.start < index && a.end >= index) {
                a.end += offset;
            }
            else if (a.start >= index) {
                a.start += offset;
                a.end += offset;
            }
        });
    }
    return annotations;
}
exports.shiftAnnotations = shiftAnnotations;
//# sourceMappingURL=annotate.js.map