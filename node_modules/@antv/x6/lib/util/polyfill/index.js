"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jquery_1 = __importDefault(require("jquery"));
require("jquery-mousewheel");
var platform_1 = require("../platform");
if (platform_1.Platform.SUPPORT_PASSIVE) {
    jquery_1.default.event.special.touchstart = {
        setup: function (data, ns, handle) {
            if (!this.addEventListener) {
                return false;
            }
            this.addEventListener('touchstart', handle, {
                passive: true,
            });
        },
    };
    var hook = jquery_1.default.event.special.mousewheel;
    if (hook) {
        var setup_1 = hook.setup;
        hook.setup = function () {
            var _this = this;
            var addEventListener = this.addEventListener;
            if (!addEventListener) {
                return false;
            }
            this.addEventListener = function (name, handler) {
                addEventListener.call(_this, name, handler, { passive: true });
            };
            setup_1.call(this);
            this.addEventListener = addEventListener;
        };
    }
}
// compatible with NodeList.prototype.forEach() before chrome 51
// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}
// compatible with ParentNode.append() before chrome 54
// https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
;
(function (arr) {
    arr.forEach(function (item) {
        if (Object.prototype.hasOwnProperty.call(item, 'append')) {
            return;
        }
        Object.defineProperty(item, 'append', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var docFrag = document.createDocumentFragment();
                args.forEach(function (arg) {
                    var isNode = arg instanceof Node;
                    docFrag.appendChild(isNode ? arg : document.createTextNode(String(arg)));
                });
                this.appendChild(docFrag);
            },
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
//# sourceMappingURL=index.js.map