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
exports.AttrManager = void 0;
var util_1 = require("../util");
var geometry_1 = require("../geometry");
var common_1 = require("../common");
var attr_1 = require("../registry/attr");
var view_1 = require("./view");
var AttrManager = /** @class */ (function () {
    function AttrManager(view) {
        this.view = view;
    }
    Object.defineProperty(AttrManager.prototype, "cell", {
        get: function () {
            return this.view.cell;
        },
        enumerable: false,
        configurable: true
    });
    AttrManager.prototype.getDefinition = function (attrName) {
        return this.cell.getAttrDefinition(attrName);
    };
    AttrManager.prototype.processAttrs = function (elem, raw) {
        var _this = this;
        var normal;
        var set;
        var offset;
        var position;
        var delay;
        var specials = [];
        // divide the attributes between normal and special
        Object.keys(raw).forEach(function (name) {
            var val = raw[name];
            var definition = _this.getDefinition(name);
            var isValid = util_1.FunctionExt.call(attr_1.Attr.isValidDefinition, _this.view, definition, val, {
                elem: elem,
                attrs: raw,
                cell: _this.cell,
                view: _this.view,
            });
            if (definition && isValid) {
                if (typeof definition === 'string') {
                    if (normal == null) {
                        normal = {};
                    }
                    normal[definition] = val;
                }
                else if (val !== null) {
                    specials.push({ name: name, definition: definition });
                }
            }
            else {
                if (normal == null) {
                    normal = {};
                }
                var normalName = util_1.Dom.CASE_SENSITIVE_ATTR.includes(name)
                    ? name
                    : util_1.StringExt.kebabCase(name);
                normal[normalName] = val;
            }
        });
        specials.forEach(function (_a) {
            var name = _a.name, definition = _a.definition;
            var val = raw[name];
            var setDefine = definition;
            if (typeof setDefine.set === 'function') {
                if (!util_1.Dom.isHTMLElement(elem) &&
                    AttrManager.DELAY_ATTRS.includes(name)) {
                    if (delay == null) {
                        delay = {};
                    }
                    delay[name] = val;
                }
                else {
                    if (set == null) {
                        set = {};
                    }
                    set[name] = val;
                }
            }
            var offsetDefine = definition;
            if (typeof offsetDefine.offset === 'function') {
                if (offset == null) {
                    offset = {};
                }
                offset[name] = val;
            }
            var positionDefine = definition;
            if (typeof positionDefine.position === 'function') {
                if (position == null) {
                    position = {};
                }
                position[name] = val;
            }
        });
        return {
            raw: raw,
            normal: normal,
            set: set,
            offset: offset,
            position: position,
            delay: delay,
        };
    };
    AttrManager.prototype.mergeProcessedAttrs = function (allProcessedAttrs, roProcessedAttrs) {
        allProcessedAttrs.set = __assign(__assign({}, allProcessedAttrs.set), roProcessedAttrs.set);
        allProcessedAttrs.position = __assign(__assign({}, allProcessedAttrs.position), roProcessedAttrs.position);
        allProcessedAttrs.offset = __assign(__assign({}, allProcessedAttrs.offset), roProcessedAttrs.offset);
        // Handle also the special transform property.
        var transform = allProcessedAttrs.normal && allProcessedAttrs.normal.transform;
        if (transform != null && roProcessedAttrs.normal) {
            roProcessedAttrs.normal.transform = transform;
        }
        allProcessedAttrs.normal = roProcessedAttrs.normal;
    };
    AttrManager.prototype.findAttrs = function (cellAttrs, rootNode, selectorCache, selectors) {
        var merge = [];
        var result = new common_1.Dictionary();
        Object.keys(cellAttrs).forEach(function (selector) {
            var attrs = cellAttrs[selector];
            if (!util_1.ObjectExt.isPlainObject(attrs)) {
                return;
            }
            var _a = view_1.View.find(selector, rootNode, selectors), isCSSSelector = _a.isCSSSelector, elems = _a.elems;
            selectorCache[selector] = elems;
            for (var i = 0, l = elems.length; i < l; i += 1) {
                var elem = elems[i];
                var unique = selectors && selectors[selector] === elem;
                var prev = result.get(elem);
                if (prev) {
                    if (!prev.array) {
                        merge.push(elem);
                        prev.array = true;
                        prev.attrs = [prev.attrs];
                        prev.priority = [prev.priority];
                    }
                    var attributes = prev.attrs;
                    var selectedLength = prev.priority;
                    if (unique) {
                        // node referenced by `selector`
                        attributes.unshift(attrs);
                        selectedLength.unshift(-1);
                    }
                    else {
                        // node referenced by `groupSelector` or CSSSelector
                        var sortIndex = util_1.ArrayExt.sortedIndex(selectedLength, isCSSSelector ? -1 : l);
                        attributes.splice(sortIndex, 0, attrs);
                        selectedLength.splice(sortIndex, 0, l);
                    }
                }
                else {
                    result.set(elem, {
                        elem: elem,
                        attrs: attrs,
                        priority: unique ? -1 : l,
                        array: false,
                    });
                }
            }
        });
        merge.forEach(function (node) {
            var item = result.get(node);
            var arr = item.attrs;
            item.attrs = arr.reduceRight(function (memo, attrs) { return util_1.ObjectExt.merge(memo, attrs); }, {});
        });
        return result;
    };
    AttrManager.prototype.updateRelativeAttrs = function (elem, processedAttrs, refBBox, options) {
        var _this = this;
        var rawAttrs = processedAttrs.raw || {};
        var nodeAttrs = processedAttrs.normal || {};
        var setAttrs = processedAttrs.set;
        var positionAttrs = processedAttrs.position;
        var offsetAttrs = processedAttrs.offset;
        var delayAttrs = processedAttrs.delay;
        var getOptions = function () { return ({
            elem: elem,
            cell: _this.cell,
            view: _this.view,
            attrs: rawAttrs,
            refBBox: refBBox.clone(),
        }); };
        if (setAttrs != null) {
            Object.keys(setAttrs).forEach(function (name) {
                var val = setAttrs[name];
                var def = _this.getDefinition(name);
                if (def != null) {
                    var ret = util_1.FunctionExt.call(def.set, _this.view, val, getOptions());
                    if (typeof ret === 'object') {
                        nodeAttrs = __assign(__assign({}, nodeAttrs), ret);
                    }
                    else if (ret != null) {
                        nodeAttrs[name] = ret;
                    }
                }
            });
        }
        if (util_1.Dom.isHTMLElement(elem)) {
            // TODO: setting the `transform` attribute on HTMLElements
            // via `node.style.transform = 'matrix(...)';` would introduce
            // a breaking change (e.g. basic.TextBlock).
            this.view.setAttrs(nodeAttrs, elem);
            return;
        }
        // The final translation of the subelement.
        var nodeTransform = nodeAttrs.transform;
        var transform = nodeTransform ? "" + nodeTransform : null;
        var nodeMatrix = util_1.Dom.transformStringToMatrix(transform);
        var nodePosition = new geometry_1.Point(nodeMatrix.e, nodeMatrix.f);
        if (nodeTransform) {
            delete nodeAttrs.transform;
            nodeMatrix.e = 0;
            nodeMatrix.f = 0;
        }
        // Calculates node scale determined by the scalable group.
        var sx = 1;
        var sy = 1;
        if (positionAttrs || offsetAttrs) {
            var scale = this.view.getScaleOfElement(elem, options.scalableNode);
            sx = scale.sx;
            sy = scale.sy;
        }
        var positioned = false;
        if (positionAttrs != null) {
            Object.keys(positionAttrs).forEach(function (name) {
                var val = positionAttrs[name];
                var def = _this.getDefinition(name);
                if (def != null) {
                    var ts = util_1.FunctionExt.call(def.position, _this.view, val, getOptions());
                    if (ts != null) {
                        positioned = true;
                        nodePosition.translate(geometry_1.Point.create(ts).scale(sx, sy));
                    }
                }
            });
        }
        // The node bounding box could depend on the `size`
        // set from the previous loop.
        this.view.setAttrs(nodeAttrs, elem);
        var offseted = false;
        if (offsetAttrs != null) {
            // Check if the node is visible
            var nodeBoundingRect = this.view.getBoundingRectOfElement(elem);
            if (nodeBoundingRect.width > 0 && nodeBoundingRect.height > 0) {
                var nodeBBox_1 = util_1.Dom.transformRectangle(nodeBoundingRect, nodeMatrix).scale(1 / sx, 1 / sy);
                Object.keys(offsetAttrs).forEach(function (name) {
                    var val = offsetAttrs[name];
                    var def = _this.getDefinition(name);
                    if (def != null) {
                        var ts = util_1.FunctionExt.call(def.offset, _this.view, val, {
                            elem: elem,
                            cell: _this.cell,
                            view: _this.view,
                            attrs: rawAttrs,
                            refBBox: nodeBBox_1,
                        });
                        if (ts != null) {
                            offseted = true;
                            nodePosition.translate(geometry_1.Point.create(ts).scale(sx, sy));
                        }
                    }
                });
            }
        }
        if (nodeTransform != null || positioned || offseted) {
            nodePosition.round(1);
            nodeMatrix.e = nodePosition.x;
            nodeMatrix.f = nodePosition.y;
            elem.setAttribute('transform', util_1.Dom.matrixToTransformString(nodeMatrix));
        }
        // delay render
        var updateDelayAttrs = function () {
            if (delayAttrs != null) {
                Object.keys(delayAttrs).forEach(function (name) {
                    var _a;
                    var val = delayAttrs[name];
                    var def = _this.getDefinition(name);
                    if (def != null) {
                        var ret = util_1.FunctionExt.call(def.set, _this.view, val, getOptions());
                        if (typeof ret === 'object') {
                            _this.view.setAttrs(ret, elem);
                        }
                        else if (ret != null) {
                            _this.view.setAttrs((_a = {},
                                _a[name] = ret,
                                _a), elem);
                        }
                    }
                });
            }
        };
        if (options.forceSync) {
            updateDelayAttrs();
        }
        else {
            util_1.Scheduler.scheduleTask(updateDelayAttrs);
        }
    };
    AttrManager.prototype.update = function (rootNode, attrs, options) {
        var _this = this;
        var selectorCache = {};
        var nodesAttrs = this.findAttrs(options.attrs || attrs, rootNode, selectorCache, options.selectors);
        // `nodesAttrs` are different from all attributes, when
        // rendering only attributes sent to this method.
        var nodesAllAttrs = options.attrs
            ? this.findAttrs(attrs, rootNode, selectorCache, options.selectors)
            : nodesAttrs;
        var specialItems = [];
        nodesAttrs.each(function (data) {
            var node = data.elem;
            var nodeAttrs = data.attrs;
            var processed = _this.processAttrs(node, nodeAttrs);
            if (processed.set == null &&
                processed.position == null &&
                processed.offset == null &&
                processed.delay == null) {
                _this.view.setAttrs(processed.normal, node);
            }
            else {
                var data_1 = nodesAllAttrs.get(node);
                var nodeAllAttrs = data_1 ? data_1.attrs : null;
                var refSelector = nodeAllAttrs && nodeAttrs.ref == null
                    ? nodeAllAttrs.ref
                    : nodeAttrs.ref;
                var refNode = void 0;
                if (refSelector) {
                    refNode = (selectorCache[refSelector] ||
                        _this.view.find(refSelector, rootNode, options.selectors))[0];
                    if (!refNode) {
                        throw new Error("\"" + refSelector + "\" reference does not exist.");
                    }
                }
                else {
                    refNode = null;
                }
                var item = {
                    node: node,
                    refNode: refNode,
                    attributes: nodeAllAttrs,
                    processedAttributes: processed,
                };
                // If an element in the list is positioned relative to this one, then
                // we want to insert this one before it in the list.
                var index = specialItems.findIndex(function (item) { return item.refNode === node; });
                if (index > -1) {
                    specialItems.splice(index, 0, item);
                }
                else {
                    specialItems.push(item);
                }
            }
        });
        var bboxCache = new common_1.Dictionary();
        var rotatableMatrix;
        specialItems.forEach(function (item) {
            var node = item.node;
            var refNode = item.refNode;
            var unrotatedRefBBox;
            var isRefNodeRotatable = refNode != null &&
                options.rotatableNode != null &&
                util_1.Dom.contains(options.rotatableNode, refNode);
            // Find the reference element bounding box. If no reference was
            // provided, we use the optional bounding box.
            if (refNode) {
                unrotatedRefBBox = bboxCache.get(refNode);
            }
            if (!unrotatedRefBBox) {
                var target = (isRefNodeRotatable ? options.rotatableNode : rootNode);
                unrotatedRefBBox = refNode
                    ? util_1.Dom.getBBox(refNode, { target: target })
                    : options.rootBBox;
                if (refNode) {
                    bboxCache.set(refNode, unrotatedRefBBox);
                }
            }
            var processedAttrs;
            if (options.attrs && item.attributes) {
                // If there was a special attribute affecting the position amongst
                // passed-in attributes we have to merge it with the rest of the
                // element's attributes as they are necessary to update the position
                // relatively (i.e `ref-x` && 'ref-dx').
                processedAttrs = _this.processAttrs(node, item.attributes);
                _this.mergeProcessedAttrs(processedAttrs, item.processedAttributes);
            }
            else {
                processedAttrs = item.processedAttributes;
            }
            var refBBox = unrotatedRefBBox;
            if (isRefNodeRotatable &&
                options.rotatableNode != null &&
                !options.rotatableNode.contains(node)) {
                // If the referenced node is inside the rotatable group while the
                // updated node is outside, we need to take the rotatable node
                // transformation into account.
                if (!rotatableMatrix) {
                    rotatableMatrix = util_1.Dom.transformStringToMatrix(util_1.Dom.attr(options.rotatableNode, 'transform'));
                }
                refBBox = util_1.Dom.transformRectangle(unrotatedRefBBox, rotatableMatrix);
            }
            var caller = specialItems.find(function (item) { return item.refNode === node; });
            if (caller) {
                options.forceSync = true;
            }
            _this.updateRelativeAttrs(node, processedAttrs, refBBox, options);
        });
    };
    return AttrManager;
}());
exports.AttrManager = AttrManager;
(function (AttrManager) {
    AttrManager.DELAY_ATTRS = [
        'text',
        'textWrap',
        'sourceMarker',
        'targetMarker',
    ];
})(AttrManager = exports.AttrManager || (exports.AttrManager = {}));
exports.AttrManager = AttrManager;
//# sourceMappingURL=attr.js.map