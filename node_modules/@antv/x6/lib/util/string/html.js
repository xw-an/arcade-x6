"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeHTML = void 0;
var jquery_1 = __importDefault(require("jquery"));
function sanitizeHTML(html, options) {
    // If documentContext (second parameter) is not specified or given as
    // `null` or `undefined`, a new document is used. Inline events will not
    // execute when the HTML is parsed; this includes, for example, sending
    // GET requests for images.
    if (options === void 0) { options = {}; }
    // If keepScripts (last parameter) is `false`, scripts are not executed.
    var nodes = jquery_1.default.parseHTML(html, null, false);
    nodes.forEach(function (node) {
        var elem = node;
        if (elem) {
            var attrs = elem.attributes;
            if (attrs) {
                for (var i = 0, ii = attrs.length; i < ii; i += 1) {
                    var attr = attrs.item(i);
                    if (attr) {
                        var val = attr.value.toLowerCase();
                        var name_1 = attr.name.toLowerCase();
                        // Removes attribute name starts with "on" (e.g. onload,
                        // onerror...).
                        // Removes attribute value starts with "javascript:" pseudo
                        // protocol (e.g. `href="javascript:alert(1)"`).
                        if (name_1.startsWith('on') ||
                            val.startsWith('javascript:') || // eslint-disable-line no-script-url
                            // ref: https://lgtm.com/rules/1510852698359/
                            val.startsWith('data:') ||
                            val.startsWith('vbscript:')) {
                            elem.removeAttribute(name_1);
                        }
                    }
                }
            }
        }
    });
    if (options.raw) {
        return nodes;
    }
    return (0, jquery_1.default)('<div/>').append(nodes).html();
}
exports.sanitizeHTML = sanitizeHTML;
//# sourceMappingURL=html.js.map