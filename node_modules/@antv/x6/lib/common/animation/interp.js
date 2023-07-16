"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interp = void 0;
var Interp;
(function (Interp) {
    Interp.number = function (a, b) {
        var d = b - a;
        return function (t) {
            return a + d * t;
        };
    };
    Interp.object = function (a, b) {
        var keys = Object.keys(a);
        return function (t) {
            var ret = {};
            for (var i = keys.length - 1; i !== -1; i -= 1) {
                var key = keys[i];
                ret[key] = a[key] + (b[key] - a[key]) * t;
            }
            return ret;
        };
    };
    Interp.unit = function (a, b) {
        var reg = /(-?[0-9]*.[0-9]*)(px|em|cm|mm|in|pt|pc|%)/;
        var ma = reg.exec(a);
        var mb = reg.exec(b);
        var pb = mb ? mb[1] : '';
        var aa = ma ? +ma[1] : 0;
        var bb = mb ? +mb[1] : 0;
        var index = pb.indexOf('.');
        var precision = index > 0 ? pb[1].length - index - 1 : 0;
        var d = bb - aa;
        var u = ma ? ma[2] : '';
        return function (t) {
            return (aa + d * t).toFixed(precision) + u;
        };
    };
    Interp.color = function (a, b) {
        var ca = parseInt(a.slice(1), 16);
        var cb = parseInt(b.slice(1), 16);
        var ra = ca & 0x0000ff;
        var rd = (cb & 0x0000ff) - ra;
        var ga = ca & 0x00ff00;
        var gd = (cb & 0x00ff00) - ga;
        var ba = ca & 0xff0000;
        var bd = (cb & 0xff0000) - ba;
        return function (t) {
            var r = (ra + rd * t) & 0x000000ff;
            var g = (ga + gd * t) & 0x0000ff00;
            var b = (ba + bd * t) & 0x00ff0000;
            return "#" + ((1 << 24) | r | g | b).toString(16).slice(1);
        };
    };
})(Interp = exports.Interp || (exports.Interp = {}));
//# sourceMappingURL=interp.js.map