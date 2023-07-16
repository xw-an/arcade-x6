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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintManager = void 0;
var geometry_1 = require("../geometry");
var util_1 = require("../util");
var base_1 = require("./base");
var PrintManager = /** @class */ (function (_super) {
    __extends(PrintManager, _super);
    function PrintManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrintManager.prototype.show = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var localOptions = __assign(__assign({}, PrintManager.defaultOptions), options);
        var $pages = this.createPrintPages(localOptions);
        localOptions.ready($pages, function ($pages) { return _this.showPrintWindow($pages, localOptions); }, {
            sheetSize: this.getSheetSize(localOptions),
        });
    };
    Object.defineProperty(PrintManager.prototype, "className", {
        get: function () {
            return this.view.prefixClassName('graph-print');
        },
        enumerable: false,
        configurable: true
    });
    PrintManager.prototype.showPrintWindow = function ($pages, options) {
        var _this = this;
        if ($pages) {
            var $body_1 = (0, util_1.JQuery)(document.body);
            var $container_1 = (0, util_1.JQuery)(this.view.container);
            var bodyClassName_1 = this.view.prefixClassName('graph-printing');
            $body_1.addClass(bodyClassName_1);
            var $detached_1 = $container_1.children().detach();
            $pages.forEach(function ($page) {
                $page
                    .removeClass(_this.className + "-preview")
                    .addClass(_this.className + "-ready")
                    .appendTo($body_1);
            });
            var ret_1 = false;
            var cb_1 = function () {
                if (!ret_1) {
                    ret_1 = true;
                    $body_1.removeClass(bodyClassName_1);
                    $pages.forEach(function ($page) { return $page.remove(); });
                    $container_1.append($detached_1);
                    (0, util_1.JQuery)("#" + _this.styleSheetId).remove();
                    _this.graph.trigger('after:print', options);
                    (0, util_1.JQuery)(window).off('afterprint', cb_1);
                }
            };
            (0, util_1.JQuery)(window).one('afterprint', cb_1);
            setTimeout(cb_1, 200);
            window.print();
        }
    };
    PrintManager.prototype.createPrintPage = function (pageArea, options) {
        this.graph.trigger('before:print', options);
        var $page = (0, util_1.JQuery)('<div/>').addClass(this.className);
        var $wrap = (0, util_1.JQuery)('<div/>')
            .addClass(this.view.prefixClassName('graph-print-inner'))
            .css('position', 'relative');
        if (options.size) {
            $page.addClass(this.className + "-size-" + options.size);
        }
        var vSVG = util_1.Vector.create(this.view.svg).clone();
        var vStage = vSVG.findOne("." + this.view.prefixClassName('graph-svg-stage'));
        $wrap.append(vSVG.node);
        var sheetSize = this.getSheetSize(options);
        var graphArea = this.graph.transform.getGraphArea();
        var s = this.graph.transform.getScale();
        var ts = this.graph.translate();
        var matrix = util_1.Dom.createSVGMatrix().translate(ts.tx / s.sx, ts.ty / s.sy);
        var info = this.getPageInfo(graphArea, pageArea, sheetSize);
        var scale = info.scale;
        var bbox = info.bbox;
        $wrap.css({
            left: 0,
            top: 0,
        });
        vSVG.attr({
            width: bbox.width * scale,
            height: bbox.height * scale,
            style: 'position:relative',
            viewBox: [bbox.x, bbox.y, bbox.width, bbox.height].join(' '),
        });
        vStage.attr('transform', util_1.Dom.matrixToTransformString(matrix));
        $page.append($wrap);
        $page.addClass(this.className + "-preview");
        return {
            $page: $page,
            sheetSize: sheetSize,
        };
    };
    PrintManager.prototype.createPrintPages = function (options) {
        var _this = this;
        var ret;
        var area = this.getPrintArea(options);
        var $pages = [];
        if (options.page) {
            var pageSize = this.getPageSize(area, options.page);
            var pageAreas = this.getPageAreas(area, pageSize);
            pageAreas.forEach(function (pageArea) {
                ret = _this.createPrintPage(pageArea, options);
                $pages.push(ret.$page);
            });
        }
        else {
            ret = this.createPrintPage(area, options);
            $pages.push(ret.$page);
        }
        if (ret) {
            var size = {
                width: ret.sheetSize.cssWidth,
                height: ret.sheetSize.cssHeight,
            };
            this.updatePrintStyle(size, options);
        }
        return $pages;
    };
    Object.defineProperty(PrintManager.prototype, "styleSheetId", {
        get: function () {
            return this.view.prefixClassName('graph-print-style');
        },
        enumerable: false,
        configurable: true
    });
    PrintManager.prototype.updatePrintStyle = function (size, options) {
        var sizeCSS = Object.keys(size).reduce(function (memo, key) { return memo + " " + key + ":" + size[key] + ";"; }, '');
        var margin = util_1.NumberExt.normalizeSides(options.margin);
        var marginUnit = options.marginUnit || '';
        var sheetUnit = options.sheetUnit || '';
        var css = "\n      @media print {\n        ." + this.className + "." + this.className + "-ready {\n          " + sizeCSS + "\n        }\n\n        @page {\n          margin:\n          " + [
            margin.top + marginUnit,
            margin.right + marginUnit,
            margin.bottom + marginUnit,
            margin.left + marginUnit,
        ].join(' ') + ";\n          size: " + (options.sheet.width + sheetUnit) + " " + (options.sheet.height + sheetUnit) + ";\n\n        ." + this.className + "." + this.className + "-preview {\n          " + sizeCSS + "\n        }\n      }";
        var id = this.styleSheetId;
        var $style = (0, util_1.JQuery)("#" + id);
        if ($style.length) {
            $style.html(css);
        }
        else {
            (0, util_1.JQuery)('head').append("'<style type=\"text/css\" id=\"" + id + "\">" + css + "</style>'");
        }
    };
    PrintManager.prototype.getPrintArea = function (options) {
        var area = options.area;
        if (!area) {
            var padding = util_1.NumberExt.normalizeSides(options.padding);
            area = this.graph.getContentArea().moveAndExpand({
                x: -padding.left,
                y: -padding.top,
                width: padding.left + padding.right,
                height: padding.top + padding.bottom,
            });
        }
        return area;
    };
    PrintManager.prototype.getPageSize = function (area, poster) {
        if (typeof poster === 'object') {
            var raw = poster;
            var page = {
                width: raw.width,
                height: raw.height,
            };
            if (page.width == null) {
                page.width = Math.ceil(area.width / (raw.columns || 1));
            }
            if (page.height == null) {
                page.height = Math.ceil(area.height / (raw.rows || 1));
            }
            return page;
        }
        return {
            width: area.width,
            height: area.height,
        };
    };
    PrintManager.prototype.getPageAreas = function (area, pageSize) {
        var pages = [];
        var width = pageSize.width;
        var height = pageSize.height;
        for (var w = 0, n = 0; w < area.height && n < 200; w += height, n += 1) {
            for (var h = 0, m = 0; h < area.width && m < 200; h += width, m += 1) {
                pages.push(new geometry_1.Rectangle(area.x + h, area.y + w, width, height));
            }
        }
        return pages;
    };
    PrintManager.prototype.getSheetSize = function (options) {
        var sheet = options.sheet;
        var margin = util_1.NumberExt.normalizeSides(options.margin);
        var marginUnit = options.marginUnit || '';
        var sheetUnit = options.sheetUnit || '';
        var cssWidth = 
        // eslint-disable-next-line
        "calc(" + sheet.width + sheetUnit + " - " + (margin.left + margin.right) + marginUnit + ")";
        var cssHeight = 
        // eslint-disable-next-line
        "calc(" + sheet.height + sheetUnit + " - " + (margin.top + margin.bottom) + marginUnit + ")";
        var ret = util_1.Unit.measure(cssWidth, cssHeight);
        return {
            cssWidth: cssWidth,
            cssHeight: cssHeight,
            width: ret.width,
            height: ret.height,
        };
    };
    PrintManager.prototype.getPageInfo = function (graphArea, pageArea, sheetSize) {
        var bbox = new geometry_1.Rectangle(pageArea.x - graphArea.x, pageArea.y - graphArea.y, pageArea.width, pageArea.height);
        var pageRatio = bbox.width / bbox.height;
        var graphRatio = sheetSize.width / sheetSize.height;
        return {
            bbox: bbox,
            scale: graphRatio < pageRatio
                ? sheetSize.width / bbox.width
                : sheetSize.height / bbox.height,
            fitHorizontal: graphRatio < pageRatio,
        };
    };
    PrintManager.prototype.dispose = function () { };
    __decorate([
        base_1.Base.dispose()
    ], PrintManager.prototype, "dispose", null);
    return PrintManager;
}(base_1.Base));
exports.PrintManager = PrintManager;
(function (PrintManager) {
    PrintManager.defaultOptions = {
        page: false,
        sheet: {
            width: 210,
            height: 297,
        },
        sheetUnit: 'mm',
        margin: 0.4,
        marginUnit: 'in',
        padding: 5,
        ready: function ($pages, readyToPrint) { return readyToPrint($pages); },
    };
})(PrintManager = exports.PrintManager || (exports.PrintManager = {}));
exports.PrintManager = PrintManager;
//# sourceMappingURL=print.js.map