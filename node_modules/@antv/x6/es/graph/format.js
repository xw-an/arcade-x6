import JQuery from 'jquery';
import { DataUri, NumberExt, FunctionExt, Vector } from '../util';
import { Rectangle } from '../geometry';
import { Base } from './base';
export class FormatManager extends Base {
    toSVG(callback, options = {}) {
        this.graph.trigger('before:export', options);
        const rawSVG = this.view.svg;
        const vSVG = Vector.create(rawSVG).clone();
        let clonedSVG = vSVG.node;
        const vStage = vSVG.findOne(`.${this.view.prefixClassName('graph-svg-stage')}`);
        const viewBox = options.viewBox || this.graph.graphToLocal(this.graph.getContentBBox());
        const dimension = options.preserveDimensions;
        if (dimension) {
            const size = typeof dimension === 'boolean' ? viewBox : dimension;
            vSVG.attr({
                width: size.width,
                height: size.height,
            });
        }
        vSVG
            .removeAttribute('style')
            .attr('viewBox', [viewBox.x, viewBox.y, viewBox.width, viewBox.height].join(' '));
        vStage.removeAttribute('transform');
        // Stores all the CSS declarations from external stylesheets to the
        // `style` attribute of the SVG document nodes.
        // This is achieved in three steps.
        // -----------------------------------
        // 1. Disabling all the stylesheets in the page and therefore collecting
        //    only default style values. This, together with the step 2, makes it
        //    possible to discard default CSS property values and store only those
        //    that differ.
        //
        // 2. Enabling back all the stylesheets in the page and collecting styles
        //    that differ from the default values.
        //
        // 3. Applying the difference between default values and the ones set by
        //    custom stylesheets onto the `style` attribute of each of the nodes
        //    in SVG.
        if (options.copyStyles !== false) {
            const document = rawSVG.ownerDocument;
            const raws = Array.from(rawSVG.querySelectorAll('*'));
            const clones = Array.from(clonedSVG.querySelectorAll('*'));
            const styleSheetCount = document.styleSheets.length;
            const styleSheetsCopy = [];
            for (let k = styleSheetCount - 1; k >= 0; k -= 1) {
                // There is a bug (bugSS) in Chrome 14 and Safari. When you set
                // `stylesheet.disable = true` it will also remove it from
                // `document.styleSheets`. So we need to store all stylesheets before
                // we disable them. Later on we put them back to `document.styleSheets`
                // if needed.
                // See the bug `https://code.google.com/p/chromium/issues/detail?id=88310`.
                styleSheetsCopy[k] = document.styleSheets[k];
                document.styleSheets[k].disabled = true;
            }
            const defaultComputedStyles = {};
            raws.forEach((elem, index) => {
                const computedStyle = window.getComputedStyle(elem, null);
                // We're making a deep copy of the `computedStyle` so that it's not affected
                // by that next step when all the stylesheets are re-enabled again.
                const defaultComputedStyle = {};
                Object.keys(computedStyle).forEach((property) => {
                    defaultComputedStyle[property] =
                        computedStyle.getPropertyValue(property);
                });
                defaultComputedStyles[index] = defaultComputedStyle;
            });
            // Copy all stylesheets back
            if (styleSheetCount !== document.styleSheets.length) {
                styleSheetsCopy.forEach((copy, index) => {
                    document.styleSheets[index] = copy;
                });
            }
            for (let i = 0; i < styleSheetCount; i += 1) {
                document.styleSheets[i].disabled = false;
            }
            const customStyles = {};
            raws.forEach((elem, index) => {
                const computedStyle = window.getComputedStyle(elem, null);
                const defaultComputedStyle = defaultComputedStyles[index];
                const customStyle = {};
                Object.keys(computedStyle).forEach((property) => {
                    if (!NumberExt.isNumeric(property) &&
                        computedStyle.getPropertyValue(property) !==
                            defaultComputedStyle[property]) {
                        customStyle[property] = computedStyle.getPropertyValue(property);
                    }
                });
                customStyles[index] = customStyle;
            });
            clones.forEach((elem, index) => {
                JQuery(elem).css(customStyles[index]);
            });
        }
        const stylesheet = options.stylesheet;
        if (typeof stylesheet === 'string') {
            const cDATASection = rawSVG
                .ownerDocument.implementation.createDocument(null, 'xml', null)
                .createCDATASection(stylesheet);
            vSVG.prepend(Vector.create('style', {
                type: 'text/css',
            }, [cDATASection]));
        }
        const format = () => {
            const beforeSerialize = options.beforeSerialize;
            if (typeof beforeSerialize === 'function') {
                const ret = FunctionExt.call(beforeSerialize, this.graph, clonedSVG);
                if (ret instanceof SVGSVGElement) {
                    clonedSVG = ret;
                }
            }
            const dataUri = new XMLSerializer()
                .serializeToString(clonedSVG)
                .replace(/&nbsp;/g, '\u00a0');
            this.graph.trigger('after:export', options);
            callback(dataUri);
        };
        if (options.serializeImages) {
            const deferrals = vSVG.find('image').map((vImage) => {
                return new Promise((resolve) => {
                    const url = vImage.attr('xlink:href') || vImage.attr('href');
                    DataUri.imageToDataUri(url, (err, dataUri) => {
                        if (!err && dataUri) {
                            vImage.attr('xlink:href', dataUri);
                        }
                        resolve();
                    });
                });
            });
            Promise.all(deferrals).then(format);
        }
        else {
            format();
        }
    }
    toDataURL(callback, options) {
        let viewBox = options.viewBox || this.graph.getContentBBox();
        const padding = NumberExt.normalizeSides(options.padding);
        if (options.width && options.height) {
            if (padding.left + padding.right >= options.width) {
                padding.left = padding.right = 0;
            }
            if (padding.top + padding.bottom >= options.height) {
                padding.top = padding.bottom = 0;
            }
        }
        const expanding = new Rectangle(-padding.left, -padding.top, padding.left + padding.right, padding.top + padding.bottom);
        if (options.width && options.height) {
            const width = viewBox.width + padding.left + padding.right;
            const height = viewBox.height + padding.top + padding.bottom;
            expanding.scale(width / options.width, height / options.height);
        }
        viewBox = Rectangle.create(viewBox).moveAndExpand(expanding);
        const rawSize = typeof options.width === 'number' && typeof options.height === 'number'
            ? { width: options.width, height: options.height }
            : viewBox;
        let scale = options.ratio ? parseFloat(options.ratio) : 1;
        if (!Number.isFinite(scale) || scale === 0) {
            scale = 1;
        }
        const size = {
            width: Math.max(Math.round(rawSize.width * scale), 1),
            height: Math.max(Math.round(rawSize.height * scale), 1),
        };
        {
            const imgDataCanvas = document.createElement('canvas');
            const context2D = imgDataCanvas.getContext('2d');
            imgDataCanvas.width = size.width;
            imgDataCanvas.height = size.height;
            const x = size.width - 1;
            const y = size.height - 1;
            context2D.fillStyle = 'rgb(1,1,1)';
            context2D.fillRect(x, y, 1, 1);
            const data = context2D.getImageData(x, y, 1, 1).data;
            if (data[0] !== 1 || data[1] !== 1 || data[2] !== 1) {
                throw new Error('size exceeded');
            }
        }
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            const context = canvas.getContext('2d');
            context.fillStyle = options.backgroundColor || 'white';
            context.fillRect(0, 0, size.width, size.height);
            try {
                context.drawImage(img, 0, 0, size.width, size.height);
                const dataUri = canvas.toDataURL(options.type, options.quality);
                callback(dataUri);
            }
            catch (error) {
                // pass
            }
        };
        this.toSVG((dataUri) => {
            img.src = `data:image/svg+xml,${encodeURIComponent(dataUri)}`;
        }, Object.assign(Object.assign({}, options), { viewBox, serializeImages: true, preserveDimensions: Object.assign({}, size) }));
    }
    toPNG(callback, options = {}) {
        this.toDataURL(callback, Object.assign(Object.assign({}, options), { type: 'image/png' }));
    }
    toJPEG(callback, options = {}) {
        this.toDataURL(callback, Object.assign(Object.assign({}, options), { type: 'image/jpeg' }));
    }
}
//# sourceMappingURL=format.js.map