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
exports.Color = void 0;
var number_1 = require("../util/number");
var Color = /** @class */ (function () {
    function Color(color, g, b, a) {
        if (color == null) {
            return this.set(255, 255, 255, 1);
        }
        if (typeof color === 'number') {
            return this.set(color, g, b, a);
        }
        if (typeof color === 'string') {
            return Color.fromString(color) || this;
        }
        if (Array.isArray(color)) {
            return this.set(color);
        }
        this.set(color.r, color.g, color.b, color.a == null ? 1 : color.a);
    }
    Color.prototype.blend = function (start, end, weight) {
        this.set(start.r + (end.r - start.r) * weight, start.g + (end.g - start.g) * weight, start.b + (end.b - start.b) * weight, start.a + (end.a - start.a) * weight);
    };
    Color.prototype.lighten = function (amount) {
        var rgba = Color.lighten(this.toArray(), amount);
        this.r = rgba[0];
        this.g = rgba[1];
        this.b = rgba[2];
        this.a = rgba[3];
    };
    Color.prototype.darken = function (amount) {
        this.lighten(-amount);
    };
    Color.prototype.set = function (arg0, arg1, arg2, arg3) {
        var r = Array.isArray(arg0) ? arg0[0] : arg0;
        var g = Array.isArray(arg0) ? arg0[1] : arg1;
        var b = Array.isArray(arg0) ? arg0[2] : arg2;
        var a = Array.isArray(arg0) ? arg0[3] : arg3;
        this.r = Math.round(number_1.NumberExt.clamp(r, 0, 255));
        this.g = Math.round(number_1.NumberExt.clamp(g, 0, 255));
        this.b = Math.round(number_1.NumberExt.clamp(b, 0, 255));
        this.a = a == null ? 1 : number_1.NumberExt.clamp(a, 0, 1);
        return this;
    };
    Color.prototype.toHex = function () {
        var _this = this;
        var hex = ['r', 'g', 'b'].map(function (key) {
            var str = _this[key].toString(16);
            return str.length < 2 ? "0" + str : str;
        });
        return "#" + hex.join('');
    };
    Color.prototype.toRGBA = function () {
        return this.toArray();
    };
    Color.prototype.toHSLA = function () {
        return Color.rgba2hsla(this.r, this.g, this.b, this.a);
    };
    Color.prototype.toCSS = function (ignoreAlpha) {
        var rgb = this.r + "," + this.g + "," + this.b + ",";
        return ignoreAlpha ? "rgb(" + rgb + ")" : "rgba(" + rgb + "," + this.a + ")";
    };
    Color.prototype.toGrey = function () {
        return Color.makeGrey(Math.round((this.r + this.g + this.b) / 3), this.a);
    };
    Color.prototype.toArray = function () {
        return [this.r, this.g, this.b, this.a];
    };
    Color.prototype.toString = function () {
        return this.toCSS();
    };
    return Color;
}());
exports.Color = Color;
(function (Color) {
    function fromArray(arr) {
        return new Color(arr);
    }
    Color.fromArray = fromArray;
    function fromHex(color) {
        return new Color(__spreadArray(__spreadArray([], hex2rgb(color), true), [1], false));
    }
    Color.fromHex = fromHex;
    function fromRGBA(color) {
        var matches = color.toLowerCase().match(/^rgba?\(([\s.,0-9]+)\)/);
        if (matches) {
            var arr = matches[1].split(/\s*,\s*/).map(function (v) { return parseInt(v, 10); });
            return new Color(arr);
        }
        return null;
    }
    Color.fromRGBA = fromRGBA;
    function hue2rgb(m1, m2, h) {
        if (h < 0) {
            ++h; // eslint-disable-line
        }
        if (h > 1) {
            --h; // eslint-disable-line
        }
        var h6 = 6 * h;
        if (h6 < 1) {
            return m1 + (m2 - m1) * h6;
        }
        if (2 * h < 1) {
            return m2;
        }
        if (3 * h < 2) {
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        }
        return m1;
    }
    function fromHSLA(color) {
        var matches = color.toLowerCase().match(/^hsla?\(([\s.,0-9]+)\)/);
        if (matches) {
            var arr = matches[2].split(/\s*,\s*/);
            var h = (((parseFloat(arr[0]) % 360) + 360) % 360) / 360;
            var s = parseFloat(arr[1]) / 100;
            var l = parseFloat(arr[2]) / 100;
            var a = arr[3] == null ? 1 : parseInt(arr[3], 10);
            return new Color(hsla2rgba(h, s, l, a));
        }
        return null;
    }
    Color.fromHSLA = fromHSLA;
    function fromString(color) {
        if (color.startsWith('#')) {
            return fromHex(color);
        }
        if (color.startsWith('rgb')) {
            return fromRGBA(color);
        }
        var preset = Color.named[color];
        if (preset) {
            return fromHex(preset);
        }
        return fromHSLA(color);
    }
    Color.fromString = fromString;
    function makeGrey(g, a) {
        return Color.fromArray([g, g, g, a]);
    }
    Color.makeGrey = makeGrey;
    function rgba2hsla(arg0, arg1, arg2, arg3) {
        var r = Array.isArray(arg0) ? arg0[0] : arg0;
        var g = Array.isArray(arg0) ? arg0[1] : arg1;
        var b = Array.isArray(arg0) ? arg0[2] : arg2;
        var a = Array.isArray(arg0) ? arg0[3] : arg3;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var l = (max + min) / 2;
        var h = 0;
        var s = 0;
        if (min !== max) {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
                default:
                    break;
            }
            h /= 6;
        }
        return [h, s, l, a == null ? 1 : a];
    }
    Color.rgba2hsla = rgba2hsla;
    function hsla2rgba(arg0, arg1, arg2, arg3) {
        var h = Array.isArray(arg0) ? arg0[0] : arg0;
        var s = Array.isArray(arg0) ? arg0[1] : arg1;
        var l = Array.isArray(arg0) ? arg0[2] : arg2;
        var a = Array.isArray(arg0) ? arg0[3] : arg3;
        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        var m1 = 2 * l - m2;
        return [
            hue2rgb(m1, m2, h + 1 / 3) * 256,
            hue2rgb(m1, m2, h) * 256,
            hue2rgb(m1, m2, h - 1 / 3) * 256,
            a == null ? 1 : a,
        ];
    }
    Color.hsla2rgba = hsla2rgba;
    function random(ignoreAlpha) {
        return new Color(Math.round(Math.random() * 256), Math.round(Math.random() * 256), Math.round(Math.random() * 256), ignoreAlpha ? undefined : parseFloat(Math.random().toFixed(2)));
    }
    Color.random = random;
    function randomHex() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i += 1) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    Color.randomHex = randomHex;
    function randomRGBA(ignoreAlpha) {
        return random(ignoreAlpha).toString();
    }
    Color.randomRGBA = randomRGBA;
    function invert(color, bw) {
        if (typeof color === 'string') {
            var pound = color[0] === '#';
            var _a = hex2rgb(color), r_1 = _a[0], g_1 = _a[1], b_1 = _a[2];
            if (bw) {
                // http://stackoverflow.com/a/3943023/112731
                return r_1 * 0.299 + g_1 * 0.587 + b_1 * 0.114 > 186 ? '#000000' : '#ffffff';
            }
            return "" + (pound ? '#' : '') + rgb2hex(255 - r_1, 255 - g_1, 255 - b_1);
        }
        var r = color[0];
        var g = color[1];
        var b = color[2];
        var a = color[3];
        if (bw) {
            return r * 0.299 + g * 0.587 + b * 0.114 > 186
                ? [0, 0, 0, a]
                : [255, 255, 255, a];
        }
        return [255 - r, 255 - g, 255 - b, a];
    }
    Color.invert = invert;
    function hex2rgb(hex) {
        var color = hex.indexOf('#') === 0 ? hex : "#" + hex;
        var val = Number("0x" + color.substr(1));
        if (!(color.length === 4 || color.length === 7) || Number.isNaN(val)) {
            throw new Error('Invalid hex color.');
        }
        var bits = color.length === 4 ? 4 : 8;
        var mask = (1 << bits) - 1;
        var bgr = ['b', 'g', 'r'].map(function () {
            var c = val & mask;
            val >>= bits;
            return bits === 4 ? 17 * c : c;
        });
        return [bgr[2], bgr[1], bgr[0]];
    }
    function rgb2hex(r, g, b) {
        var pad = function (hex) { return (hex.length < 2 ? "0" + hex : hex); };
        return "" + pad(r.toString(16)) + pad(g.toString(16)) + pad(b.toString(16));
    }
    function lighten(color, amt) {
        return lum(color, amt);
    }
    Color.lighten = lighten;
    function darken(color, amt) {
        return lum(color, -amt);
    }
    Color.darken = darken;
    function lum(color, amt) {
        if (typeof color === 'string') {
            var pound = color[0] === '#';
            var num = parseInt(pound ? color.substr(1) : color, 16);
            var r = number_1.NumberExt.clamp((num >> 16) + amt, 0, 255);
            var g = number_1.NumberExt.clamp(((num >> 8) & 0x00ff) + amt, 0, 255);
            var b = number_1.NumberExt.clamp((num & 0x0000ff) + amt, 0, 255);
            return "" + (pound ? '#' : '') + (b | (g << 8) | (r << 16)).toString(16);
        }
        var hex = rgb2hex(color[0], color[1], color[2]);
        var arr = hex2rgb(lum(hex, amt));
        return [arr[0], arr[1], arr[2], color[3]];
    }
})(Color = exports.Color || (exports.Color = {}));
exports.Color = Color;
(function (Color) {
    Color.named = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        burntsienna: '#ea7e5d',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32',
    };
})(Color = exports.Color || (exports.Color = {}));
exports.Color = Color;
//# sourceMappingURL=color.js.map