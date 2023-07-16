"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
var jquery_1 = __importDefault(require("jquery"));
var millimeterSize;
var supportedUnits = {
    px: function (val) {
        return val;
    },
    mm: function (val) {
        return millimeterSize * val;
    },
    cm: function (val) {
        return millimeterSize * val * 10;
    },
    in: function (val) {
        return millimeterSize * val * 25.4;
    },
    pt: function (val) {
        return millimeterSize * ((25.4 * val) / 72);
    },
    pc: function (val) {
        return millimeterSize * ((25.4 * val) / 6);
    },
};
// eslint-disable-next-line
var Unit;
(function (Unit) {
    function measure(cssWidth, cssHeight, unit) {
        var div = (0, jquery_1.default)('<div/>')
            .css({
            display: 'inline-block',
            position: 'absolute',
            left: -15000,
            top: -15000,
            width: cssWidth + (unit || ''),
            height: cssHeight + (unit || ''),
        })
            .appendTo(document.body);
        var size = {
            width: div.width() || 0,
            height: div.height() || 0,
        };
        div.remove();
        return size;
    }
    Unit.measure = measure;
    function toPx(val, unit) {
        if (millimeterSize == null) {
            millimeterSize = measure("1", "1", 'mm').width;
        }
        var convert = unit ? supportedUnits[unit] : null;
        if (convert) {
            return convert(val);
        }
        return val;
    }
    Unit.toPx = toPx;
})(Unit = exports.Unit || (exports.Unit = {}));
//# sourceMappingURL=index.js.map