var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ObjectExt } from '../util';
import { Rectangle } from '../geometry';
import { Background } from '../registry';
import { Base } from './base';
export class BackgroundManager extends Base {
    get elem() {
        return this.view.background;
    }
    init() {
        this.startListening();
        if (this.options.background) {
            this.draw(this.options.background);
        }
    }
    startListening() {
        this.graph.on('scale', this.update, this);
        this.graph.on('translate', this.update, this);
    }
    stopListening() {
        this.graph.off('scale', this.update, this);
        this.graph.off('translate', this.update, this);
    }
    updateBackgroundImage(options = {}) {
        let backgroundSize = options.size || 'auto auto';
        let backgroundPosition = options.position || 'center';
        const scale = this.graph.transform.getScale();
        const ts = this.graph.translate();
        // backgroundPosition
        if (typeof backgroundPosition === 'object') {
            const x = ts.tx + scale.sx * (backgroundPosition.x || 0);
            const y = ts.ty + scale.sy * (backgroundPosition.y || 0);
            backgroundPosition = `${x}px ${y}px`;
        }
        // backgroundSize
        if (typeof backgroundSize === 'object') {
            backgroundSize = Rectangle.fromSize(backgroundSize).scale(scale.sx, scale.sy);
            backgroundSize = `${backgroundSize.width}px ${backgroundSize.height}px`;
        }
        this.elem.style.backgroundSize = backgroundSize;
        this.elem.style.backgroundPosition = backgroundPosition;
    }
    drawBackgroundImage(img, options = {}) {
        if (!(img instanceof HTMLImageElement)) {
            this.elem.style.backgroundImage = '';
            return;
        }
        // draw multiple times to show the last image
        const cache = this.optionsCache;
        if (cache && cache.image !== options.image) {
            return;
        }
        let uri;
        const opacity = options.opacity;
        const backgroundSize = options.size;
        let backgroundRepeat = options.repeat || 'no-repeat';
        const pattern = Background.registry.get(backgroundRepeat);
        if (typeof pattern === 'function') {
            const quality = options.quality || 1;
            img.width *= quality;
            img.height *= quality;
            const canvas = pattern(img, options);
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
            cache.size = ObjectExt.clone(options.size);
        }
        const style = this.elem.style;
        style.backgroundImage = `url(${uri})`;
        style.backgroundRepeat = backgroundRepeat;
        style.opacity = opacity == null || opacity >= 1 ? '' : `${opacity}`;
        this.updateBackgroundImage(options);
    }
    updateBackgroundColor(color) {
        this.elem.style.backgroundColor = color || '';
    }
    updateBackgroundOptions(options) {
        this.graph.options.background = options;
    }
    update() {
        if (this.optionsCache) {
            this.updateBackgroundImage(this.optionsCache);
        }
    }
    draw(options) {
        const opts = options || {};
        this.updateBackgroundOptions(options);
        this.updateBackgroundColor(opts.color);
        if (opts.image) {
            this.optionsCache = ObjectExt.clone(opts);
            const img = document.createElement('img');
            img.onload = () => this.drawBackgroundImage(img, options);
            img.setAttribute('crossorigin', 'anonymous');
            img.src = opts.image;
        }
        else {
            this.drawBackgroundImage(null);
            this.optionsCache = null;
        }
    }
    clear() {
        this.draw();
    }
    dispose() {
        this.clear();
        this.stopListening();
    }
}
__decorate([
    Base.dispose()
], BackgroundManager.prototype, "dispose", null);
//# sourceMappingURL=background.js.map