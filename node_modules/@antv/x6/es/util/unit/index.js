import jQuery from 'jquery';
let millimeterSize;
const supportedUnits = {
    px(val) {
        return val;
    },
    mm(val) {
        return millimeterSize * val;
    },
    cm(val) {
        return millimeterSize * val * 10;
    },
    in(val) {
        return millimeterSize * val * 25.4;
    },
    pt(val) {
        return millimeterSize * ((25.4 * val) / 72);
    },
    pc(val) {
        return millimeterSize * ((25.4 * val) / 6);
    },
};
// eslint-disable-next-line
export var Unit;
(function (Unit) {
    function measure(cssWidth, cssHeight, unit) {
        const div = jQuery('<div/>')
            .css({
            display: 'inline-block',
            position: 'absolute',
            left: -15000,
            top: -15000,
            width: cssWidth + (unit || ''),
            height: cssHeight + (unit || ''),
        })
            .appendTo(document.body);
        const size = {
            width: div.width() || 0,
            height: div.height() || 0,
        };
        div.remove();
        return size;
    }
    Unit.measure = measure;
    function toPx(val, unit) {
        if (millimeterSize == null) {
            millimeterSize = measure(`1`, `1`, 'mm').width;
        }
        const convert = unit ? supportedUnits[unit] : null;
        if (convert) {
            return convert(val);
        }
        return val;
    }
    Unit.toPx = toPx;
})(Unit || (Unit = {}));
//# sourceMappingURL=index.js.map