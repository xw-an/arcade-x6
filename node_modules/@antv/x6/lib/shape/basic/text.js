"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
var view_1 = require("../../view");
var util_1 = require("./util");
var viewName = (0, util_1.getName)('text');
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Text;
}((0, util_1.createShape)('text', {
    view: viewName,
    attrs: {
        text: {
            fontSize: 18,
            fill: '#000000',
            stroke: null,
            refX: 0.5,
            refY: 0.5,
        },
    },
}, { noText: true })));
exports.Text = Text;
(function (Text) {
    var View = /** @class */ (function (_super) {
        __extends(View, _super);
        function View() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        View.prototype.confirmUpdate = function (flag, options) {
            if (options === void 0) { options = {}; }
            var ret = _super.prototype.confirmUpdate.call(this, flag, options);
            if (this.hasAction(ret, 'scale')) {
                this.resize();
                ret = this.removeAction(ret, 'scale');
            }
            return ret;
        };
        return View;
    }(view_1.NodeView));
    Text.View = View;
    View.config({
        actions: {
            attrs: ['scale'],
        },
    });
    view_1.NodeView.registry.register(viewName, View);
})(Text = exports.Text || (exports.Text = {}));
exports.Text = Text;
//# sourceMappingURL=text.js.map