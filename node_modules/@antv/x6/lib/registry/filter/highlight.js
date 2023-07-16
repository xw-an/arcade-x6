"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlight = void 0;
var util_1 = require("./util");
function highlight(args) {
    if (args === void 0) { args = {}; }
    var color = (0, util_1.getString)(args.color, 'red');
    var blur = (0, util_1.getNumber)(args.blur, 0);
    var width = (0, util_1.getNumber)(args.width, 1);
    var opacity = (0, util_1.getNumber)(args.opacity, 1);
    return ("\n      <filter>\n        <feFlood flood-color=\"" + color + "\" flood-opacity=\"" + opacity + "\" result=\"colored\"/>\n        <feMorphology result=\"morphed\" in=\"SourceGraphic\" operator=\"dilate\" radius=\"" + width + "\"/>\n        <feComposite result=\"composed\" in=\"colored\" in2=\"morphed\" operator=\"in\"/>\n        <feGaussianBlur result=\"blured\" in=\"composed\" stdDeviation=\"" + blur + "\"/>\n        <feBlend in=\"SourceGraphic\" in2=\"blured\" mode=\"normal\"/>\n      </filter>\n    ").trim();
}
exports.highlight = highlight;
//# sourceMappingURL=highlight.js.map