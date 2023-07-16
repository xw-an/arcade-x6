"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outline = void 0;
var util_1 = require("./util");
function outline(args) {
    if (args === void 0) { args = {}; }
    var color = (0, util_1.getString)(args.color, 'blue');
    var width = (0, util_1.getNumber)(args.width, 1);
    var margin = (0, util_1.getNumber)(args.margin, 2);
    var opacity = (0, util_1.getNumber)(args.opacity, 1);
    var innerRadius = margin;
    var outerRadius = margin + width;
    return ("\n    <filter>\n      <feFlood flood-color=\"" + color + "\" flood-opacity=\"" + opacity + "\" result=\"colored\"/>\n      <feMorphology in=\"SourceAlpha\" result=\"morphedOuter\" operator=\"dilate\" radius=\"" + outerRadius + "\" />\n      <feMorphology in=\"SourceAlpha\" result=\"morphedInner\" operator=\"dilate\" radius=\"" + innerRadius + "\" />\n      <feComposite result=\"morphedOuterColored\" in=\"colored\" in2=\"morphedOuter\" operator=\"in\"/>\n      <feComposite operator=\"xor\" in=\"morphedOuterColored\" in2=\"morphedInner\" result=\"outline\"/>\n      <feMerge>\n        <feMergeNode in=\"outline\"/>\n        <feMergeNode in=\"SourceGraphic\"/>\n      </feMerge>\n    </filter>\n  ").trim();
}
exports.outline = outline;
//# sourceMappingURL=outline.js.map