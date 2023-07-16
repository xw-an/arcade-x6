"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropShadow = void 0;
var util_1 = require("./util");
function dropShadow(args) {
    if (args === void 0) { args = {}; }
    var dx = (0, util_1.getNumber)(args.dx, 0);
    var dy = (0, util_1.getNumber)(args.dy, 0);
    var color = (0, util_1.getString)(args.color, 'black');
    var blur = (0, util_1.getNumber)(args.blur, 4);
    var opacity = (0, util_1.getNumber)(args.opacity, 1);
    return 'SVGFEDropShadowElement' in window
        ? ("<filter>\n         <feDropShadow stdDeviation=\"" + blur + "\" dx=\"" + dx + "\" dy=\"" + dy + "\" flood-color=\"" + color + "\" flood-opacity=\"" + opacity + "\" />\n       </filter>").trim()
        : ("<filter>\n         <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"" + blur + "\" />\n         <feOffset dx=\"" + dx + "\" dy=\"" + dy + "\" result=\"offsetblur\" />\n         <feFlood flood-color=\"" + color + "\" />\n         <feComposite in2=\"offsetblur\" operator=\"in\" />\n         <feComponentTransfer>\n           <feFuncA type=\"linear\" slope=\"" + opacity + "\" />\n         </feComponentTransfer>\n         <feMerge>\n           <feMergeNode/>\n           <feMergeNode in=\"SourceGraphic\"/>\n         </feMerge>\n       </filter>").trim();
}
exports.dropShadow = dropShadow;
//# sourceMappingURL=drop-shadow.js.map