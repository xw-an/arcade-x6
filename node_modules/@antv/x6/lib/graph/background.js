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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundManager = void 0;
var util_1 = require("../util");
var geometry_1 = require("../geometry");
var registry_1 = require("../registry");
var base_1 = require("./base");
var BackgroundManager = /** @class */ (function (_super) {
    __extends(BackgroundManager, _super);
    function BackgroundManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BackgroundManager.prototype, "elem", {
        get: function () {
            return this.view.background;
        },
        enumerable: false,
        configurable: true
    });
    BackgroundManager.prototype.init = function () {
        this.startListening();
        if (this.options.background) {
            this.draw(this.options.background);
        }
    };
    BackgroundManager.prototype.startListening = function () {
        this.graph.on('scale', this.update, this);
        this.graph.on('translate', this.update, this);
    };
    BackgroundManager.prototype.stopListening = function () {
        this.graph.off('scale', this.update, this);
        this.graph.off('translate', this.update, this);
    };
    BackgroundManager.prototype.updateBackgroundImage = function (options) {
        if (options === void 0) { options = {}; }
        var backgroundSize = options.size || 'auto auto';
        var backgroundPosition = options.position || 'center';
        var scale = this.graph.transform.getScale();
        var ts = this.graph.translate();
        // backgroundPosition
        if (typeof backgroundPosition === 'object') {
            var x = ts.tx + scale.sx * (backgroundPosition.x || 0);
            var y = ts.ty + scale.sy * (backgroundPosition.y || 0);
            backgroundPosition = x + "px " + y + "px";
        }
        // backgroundSize
        if (typeof backgroundSize === 'object') {
            backgroundSize = geometry_1.Rectangle.fromSize(backgroundSize).scale(scale.sx, scale.sy);
            backgroundSize = backgroundSize.width + "px " + backgroundSize.height + "px";
        }
        this.elem.style.backgroundSize = backgroundSize;
        this.elem.style.backgroundPosition = backgroundPosition;
    };
    BackgroundManager.prototype.drawBackgroundImage = function (img, options) {
        if (options === void 0) { options = {}; }
        if (!(img instanceof HTMLImageElement)) {
            this.elem.style.backgroundImage = '';
            return;
        }
        // draw multiple times to show the last image
        var cache = this.optionsCache;
        if (cache && cache.image !== options.image) {
            return;
        }
        var uri;
        var opacity = options.opacity;
        var backgroundSize = options.size;
        var backgroundRepeat = options.repeat || 'no-repeat';
        var pattern = registry_1.Background.registry.get(backgroundRepeat);
        if (typeof pattern === 'function') {
            var quality = options.quality || 1;
            img.width *= quality;
            img.height *= quality;
            var canvas = pattern(img, options);
            if (!(canvas instanceof HTMLCanvasElement)) {
                throw new Error('Background pattern must return an HTML Canvas instance');
            }
            uri = canvas.toDataURL('image/png');
            // `repeat` was changed in pattern function
            if (options.repeat && backgroundRepeat !== options.repeat) {
                backgroundRepeat = options.repeat;
            }
            else {
                backgroundRepeat = 'repeat';
            }
            if (typeof backgroundSize === 'object') {
                // recalculate the tile size if an object passed in
                backgroundSize.width *= canvas.width / img.width;
                backgroundSize.height *= canvas.height / img.height;
            }
            else if (backgroundSize === undefined) {
                // calcule the tile size if no provided
                options.size = {
                    width: canvas.width / quality,
                    height: canvas.height / quality,
                };
            }
        }
        else {
            uri = img.src;
            if (backgroundSize === undefined) {
                options.size = {
                    width: img.width,
                    height: img.height,
                };
            }
        }
        if (cache != null &&
            typeof options.size === 'object' &&
            options.image === cache.image &&
            options.repeat === cache.repeat &&
            options.quality ===
                cache.quality) {
            cache.size = util_1.ObjectExt.clone(options.size);
        }
        var style = this.elem.style;
        style.backgroundImage = "url(" + uri + ")";
        style.backgroundRepeat = backgroundRepeat;
        style.opacity = opacity == null || opacity >= 1 ? '' : "" + opacity;
        this.updateBackgroundImage(options);
    };
    BackgroundManager.prototype.updateBackgroundColor = function (color) {
        this.elem.style.backgroundColor = color || '';
    };
    BackgroundManager.prototype.updateBackgroundOptions = function (options) {
        this.graph.options.background = options;
    };
    BackgroundManager.prototype.update = function () {
        if (this.optionsCache) {
            this.updateBackgroundImage(this.optionsCache);
        }
    };
    BackgroundManager.prototype.draw = function (options) {
        var _this = this;
        var opts = options || {};
        this.updateBackgroundOptions(options);
        this.updateBackgroundColor(opts.color);
        if (opts.image) {
            this.optionsCache = util_1.ObjectExt.clone(opts);
            var img_1 = document.createElement('img');
            img_1.onload = function () { return _this.drawBackgroundImage(img_1, options); };
            img_1.setAttribute('crossorigin', 'anonymous');
            img_1.src = opts.image;
        }
        else {
            this.drawBackgroundImage(null);
            this.optionsCache = null;
        }
    };
    BackgroundManager.prototype.clear = function () {
        this.draw();
    };
    BackgroundManager.prototype.dispose = function () {
        this.clear();
        this.stopListening();
    };
    __decorate([
        base_1.Base.dispose()
    ], BackgroundManager.prototype, "dispose", null);
    return BackgroundManager;
}(base_1.Base));
exports.BackgroundManager = BackgroundManager;
//# sourceMappingURL=background.js.map