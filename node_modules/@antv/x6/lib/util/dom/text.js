"use strict";
/* eslint-disable no-control-regex */
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
exports.breakText = exports.text = void 0;
var number_1 = require("../number");
var text_1 = require("../text");
var attr_1 = require("./attr");
var vector_1 = require("../vector");
var elem_1 = require("./elem");
var platform_1 = require("../platform");
function createTextPathNode(attrs, elem) {
    var vel = vector_1.Vector.create(elem);
    var textPath = vector_1.Vector.create('textPath');
    var d = attrs.d;
    if (d && attrs['xlink:href'] === undefined) {
        var path = vector_1.Vector.create('path').attr('d', d).appendTo(vel.defs());
        textPath.attr('xlink:href', "#" + path.id);
    }
    if (typeof attrs === 'object') {
        textPath.attr(attrs);
    }
    return textPath.node;
}
function annotateTextLine(lineNode, lineAnnotations, options) {
    var eol = options.eol;
    var baseSize = options.baseSize;
    var lineHeight = options.lineHeight;
    var maxFontSize = 0;
    var tspanNode;
    var fontMetrics = {};
    var lastJ = lineAnnotations.length - 1;
    for (var j = 0; j <= lastJ; j += 1) {
        var annotation = lineAnnotations[j];
        var fontSize = null;
        if (typeof annotation === 'object') {
            var annotationAttrs = annotation.attrs;
            var vTSpan = vector_1.Vector.create('tspan', annotationAttrs);
            tspanNode = vTSpan.node;
            var t = annotation.t;
            if (eol && j === lastJ) {
                t += eol;
            }
            tspanNode.textContent = t;
            // Per annotation className
            var annotationClass = annotationAttrs.class;
            if (annotationClass) {
                vTSpan.addClass(annotationClass);
            }
            // set the list of indices of all the applied annotations
            // in the `annotations` attribute. This list is a comma
            // separated list of indices.
            if (options.includeAnnotationIndices) {
                vTSpan.attr('annotations', annotation.annotations.join(','));
            }
            // Check for max font size
            fontSize = parseFloat(annotationAttrs['font-size']);
            if (fontSize === undefined)
                fontSize = baseSize;
            if (fontSize && fontSize > maxFontSize)
                maxFontSize = fontSize;
        }
        else {
            if (eol && j === lastJ) {
                annotation += eol;
            }
            tspanNode = document.createTextNode(annotation || ' ');
            if (baseSize && baseSize > maxFontSize) {
                maxFontSize = baseSize;
            }
        }
        lineNode.appendChild(tspanNode);
    }
    if (maxFontSize) {
        fontMetrics.maxFontSize = maxFontSize;
    }
    if (lineHeight) {
        fontMetrics.lineHeight = lineHeight;
    }
    else if (maxFontSize) {
        fontMetrics.lineHeight = maxFontSize * 1.2;
    }
    return fontMetrics;
}
var emRegex = /em$/;
function emToPx(em, fontSize) {
    var numerical = parseFloat(em);
    if (emRegex.test(em)) {
        return numerical * fontSize;
    }
    return numerical;
}
function calculateDY(alignment, linesMetrics, baseSizePx, lineHeight) {
    if (!Array.isArray(linesMetrics)) {
        return 0;
    }
    var n = linesMetrics.length;
    if (!n)
        return 0;
    var lineMetrics = linesMetrics[0];
    var flMaxFont = emToPx(lineMetrics.maxFontSize, baseSizePx) || baseSizePx;
    var rLineHeights = 0;
    var lineHeightPx = emToPx(lineHeight, baseSizePx);
    for (var i = 1; i < n; i += 1) {
        lineMetrics = linesMetrics[i];
        var iLineHeight = emToPx(lineMetrics.lineHeight, baseSizePx) || lineHeightPx;
        rLineHeights += iLineHeight;
    }
    var llMaxFont = emToPx(lineMetrics.maxFontSize, baseSizePx) || baseSizePx;
    var dy;
    switch (alignment) {
        case 'middle':
            dy = flMaxFont / 2 - 0.15 * llMaxFont - rLineHeights / 2;
            break;
        case 'bottom':
            dy = -(0.25 * llMaxFont) - rLineHeights;
            break;
        default:
        case 'top':
            dy = 0.8 * flMaxFont;
            break;
    }
    return dy;
}
function text(elem, content, options) {
    if (options === void 0) { options = {}; }
    content = text_1.Text.sanitize(content); // eslint-disable-line
    var eol = options.eol;
    var textPath = options.textPath;
    var verticalAnchor = options.textVerticalAnchor;
    var namedVerticalAnchor = verticalAnchor === 'middle' ||
        verticalAnchor === 'bottom' ||
        verticalAnchor === 'top';
    // Horizontal shift applied to all the lines but the first.
    var x = options.x;
    if (x === undefined) {
        x = elem.getAttribute('x') || 0;
    }
    // Annotations
    var iai = options.includeAnnotationIndices;
    var annotations = options.annotations;
    if (annotations && !Array.isArray(annotations)) {
        annotations = [annotations];
    }
    // Shift all the <tspan> but first by one line (`1em`)
    var defaultLineHeight = options.lineHeight;
    var autoLineHeight = defaultLineHeight === 'auto';
    var lineHeight = autoLineHeight ? '1.5em' : defaultLineHeight || '1em';
    (0, elem_1.empty)(elem);
    (0, attr_1.attr)(elem, {
        // Preserve spaces, do not consecutive spaces to get collapsed to one.
        'xml:space': 'preserve',
        // An empty text gets rendered into the DOM in webkit-based browsers.
        // In order to unify this behaviour across all browsers
        // we rather hide the text element when it's empty.
        display: content || options.displayEmpty ? null : 'none',
    });
    // Set default font-size if none
    var strFontSize = (0, attr_1.attr)(elem, 'font-size');
    var fontSize = parseFloat(strFontSize);
    if (!fontSize) {
        fontSize = 16;
        if ((namedVerticalAnchor || annotations) && !strFontSize) {
            (0, attr_1.attr)(elem, 'font-size', "" + fontSize);
        }
    }
    var containerNode;
    if (textPath) {
        // Now all the `<tspan>`s will be inside the `<textPath>`.
        if (typeof textPath === 'string') {
            textPath = { d: textPath };
        }
        containerNode = createTextPathNode(textPath, elem);
    }
    else {
        containerNode = document.createDocumentFragment();
    }
    var dy;
    var offset = 0;
    var annotatedY;
    var lines = content.split('\n');
    var linesMetrics = [];
    var lastI = lines.length - 1;
    for (var i = 0; i <= lastI; i += 1) {
        dy = lineHeight;
        var lineClassName = 'v-line';
        var lineNode = (0, elem_1.createSvgElement)('tspan');
        var lineMetrics = void 0;
        var line = lines[i];
        if (line) {
            if (annotations) {
                // Find the *compacted* annotations for this line.
                var lineAnnotations = text_1.Text.annotate(line, annotations, {
                    offset: -offset,
                    includeAnnotationIndices: iai,
                });
                lineMetrics = annotateTextLine(lineNode, lineAnnotations, {
                    eol: i !== lastI && eol,
                    baseSize: fontSize,
                    lineHeight: autoLineHeight ? null : lineHeight,
                    includeAnnotationIndices: iai,
                });
                // Get the line height based on the biggest font size
                // in the annotations for this line.
                var iLineHeight = lineMetrics.lineHeight;
                if (iLineHeight && autoLineHeight && i !== 0) {
                    dy = iLineHeight;
                }
                if (i === 0) {
                    annotatedY = lineMetrics.maxFontSize * 0.8;
                }
            }
            else {
                if (eol && i !== lastI) {
                    line += eol;
                }
                lineNode.textContent = line;
            }
        }
        else {
            // Make sure the textContent is never empty. If it is, add a dummy
            // character and make it invisible, making the following lines correctly
            // relatively positioned. `dy=1em` won't work with empty lines otherwise.
            lineNode.textContent = '-';
            lineClassName += ' v-empty-line';
            var lineNodeStyle = lineNode.style;
            lineNodeStyle.fillOpacity = 0;
            lineNodeStyle.strokeOpacity = 0;
            if (annotations) {
                lineMetrics = {};
            }
        }
        if (lineMetrics) {
            linesMetrics.push(lineMetrics);
        }
        if (i > 0) {
            lineNode.setAttribute('dy', dy);
        }
        // Firefox requires 'x' to be set on the first line
        if (i > 0 || textPath) {
            lineNode.setAttribute('x', x);
        }
        lineNode.className.baseVal = lineClassName;
        containerNode.appendChild(lineNode);
        offset += line.length + 1; // + 1 = newline character.
    }
    // Y Alignment calculation
    if (namedVerticalAnchor) {
        if (annotations) {
            dy = calculateDY(verticalAnchor, linesMetrics, fontSize, lineHeight);
        }
        else if (verticalAnchor === 'top') {
            // A shortcut for top alignment. It does not depend on font-size nor line-height
            dy = '0.8em';
        }
        else {
            var rh = void 0; // remaining height
            if (lastI > 0) {
                rh = parseFloat(lineHeight) || 1;
                rh *= lastI;
                if (!emRegex.test(lineHeight))
                    rh /= fontSize;
            }
            else {
                // Single-line text
                rh = 0;
            }
            switch (verticalAnchor) {
                case 'middle':
                    dy = 0.3 - rh / 2 + "em";
                    break;
                case 'bottom':
                    dy = -rh - 0.3 + "em";
                    break;
                default:
                    break;
            }
        }
    }
    else if (verticalAnchor === 0) {
        dy = '0em';
    }
    else if (verticalAnchor) {
        dy = verticalAnchor;
    }
    else {
        // No vertical anchor is defined
        dy = 0;
        // Backwards compatibility - we change the `y` attribute instead of `dy`.
        if (elem.getAttribute('y') == null) {
            elem.setAttribute('y', "" + (annotatedY || '0.8em'));
        }
    }
    var firstLine = containerNode.firstChild;
    firstLine.setAttribute('dy', dy);
    elem.appendChild(containerNode);
}
exports.text = text;
function splitText(text, separator, eol, hyphen) {
    var words = [];
    var separators = [];
    if (separator != null) {
        var parts = text.split(separator);
        words.push.apply(words, parts);
        if (typeof separator === 'string') {
            for (var i = 0, l = parts.length - 1; i < l; i += 1) {
                separators.push(separator);
            }
        }
        else {
            var seps = text.match(new RegExp(separator, 'g'));
            for (var i = 0, l = parts.length - 1; i < l; i += 1) {
                separators.push(seps ? seps[i] : '');
            }
        }
    }
    else {
        var word = '';
        for (var i = 0, l = text.length; i < l; i += 1) {
            var char = text[i];
            if (char === ' ') {
                words.push(word);
                separators.push(' ');
                word = '';
            }
            else if (char.match(/[^\x00-\xff]/)) {
                // split double byte character
                if (word.length) {
                    words.push(word);
                    separators.push('');
                }
                words.push(char);
                separators.push('');
                word = '';
            }
            else {
                word += char;
            }
        }
        if (word.length) {
            words.push(word);
        }
    }
    // end-of-line
    for (var i = 0; i < words.length; i += 1) {
        var word = words[i];
        if (word.indexOf(eol) >= 0 && word.length > 1) {
            var parts = word.split(eol);
            for (var j = 0, k = parts.length - 1; j < k; j += 1) {
                parts.splice(2 * j + 1, 0, eol);
            }
            var valids = parts.filter(function (part) { return part !== ''; });
            words.splice.apply(words, __spreadArray([i, 1], valids, false));
            var seps = valids.map(function () { return ''; });
            seps.pop();
            separators.splice.apply(separators, __spreadArray([i, 0], seps, false));
        }
    }
    // hyphen
    for (var i = 0; i < words.length; i += 1) {
        var word = words[i];
        var index = word.search(hyphen);
        if (index > 0 && index < word.length - 1) {
            words.splice(i, 1, word.substring(0, index + 1), word.substring(index + 1));
            separators.splice(i, 0, '');
        }
    }
    return { words: words, separators: separators };
}
function breakText(text, size, styles, options) {
    if (styles === void 0) { styles = {}; }
    if (options === void 0) { options = {}; }
    var width = size.width;
    var height = size.height;
    var svgDocument = options.svgDocument || (0, elem_1.createSvgElement)('svg');
    var telem = (0, elem_1.createSvgElement)('text');
    var tspan = (0, elem_1.createSvgElement)('tspan');
    var tnode = document.createTextNode('');
    (0, attr_1.attr)(telem, styles);
    telem.appendChild(tspan);
    // Prevent flickering
    telem.style.opacity = '0';
    // Prevent FF from throwing an uncaught exception when `getBBox()`
    // called on element that is not in the render tree (is not measurable).
    // <tspan>.getComputedTextLength() returns always 0 in this case.
    // Note that the `textElement` resp. `textSpan` can become hidden
    // when it's appended to the DOM and a `display: none` CSS stylesheet
    // rule gets applied.
    telem.style.display = 'block';
    tspan.style.display = 'block';
    tspan.appendChild(tnode);
    svgDocument.appendChild(telem);
    var shouldAppend = svgDocument.parentNode == null;
    if (shouldAppend) {
        document.body.appendChild(svgDocument);
    }
    var eol = options.eol || '\n';
    var separator = options.separator || ' ';
    var hyphen = options.hyphen ? new RegExp(options.hyphen) : /[^\w\d]/;
    var breakWord = options.breakWord !== false;
    var full = [];
    var lineSeprators = {};
    var lines = [];
    var partIndex;
    // let hyphenIndex
    var lineHeight;
    var currentSeparator;
    var _a = splitText(text, options.separator, eol, hyphen), words = _a.words, separators = _a.separators;
    for (var wordIndex = 0, lineIndex = 0, wordCount = words.length; wordIndex < wordCount; wordIndex += 1) {
        var word = words[wordIndex];
        // empty word
        if (!word) {
            continue;
        }
        // end of line
        if (word === eol) {
            full[lineIndex] = true;
            // start a new line
            lineIndex += 1;
            lines[lineIndex] = '';
            continue;
        }
        if (lines[lineIndex] != null) {
            currentSeparator = separators[wordIndex - 1] || '';
            tnode.data = "" + lines[lineIndex] + currentSeparator + word;
        }
        else {
            tnode.data = word;
        }
        if (tspan.getComputedTextLength() <= width) {
            // update line
            lines[lineIndex] = tnode.data;
            lineSeprators[lineIndex] = separators[wordIndex];
            // when is partitioning, put rest of the word onto next line
            if (partIndex) {
                full[lineIndex] = true;
                lineIndex += 1;
                partIndex = 0;
            }
        }
        else {
            if (breakWord) {
                // word is too long to put in one line or is partitioning
                if (!lines[lineIndex] || partIndex) {
                    var isPartition = !!partIndex;
                    var isCharacter = word.length === 1;
                    partIndex = word.length - 1;
                    if (isPartition || isCharacter) {
                        // word has only one character.
                        if (isCharacter) {
                            if (!lines[lineIndex]) {
                                // can't fit this text within our rect
                                lines = [];
                                break;
                            }
                            // partitioning didn't help on the non-empty line
                            // try again, but this time start with a new line
                            // cancel partitions created
                            words.splice(wordIndex, 2, word + words[wordIndex + 1]);
                            separators.splice(wordIndex + 1, 1);
                            full[lineIndex] = true;
                            lineIndex += 1;
                            wordCount -= 1;
                            wordIndex -= 1;
                            continue;
                        }
                        // update the partitioning words
                        words[wordIndex] = word.substring(0, partIndex);
                        words[wordIndex + 1] =
                            word.substring(partIndex) + words[wordIndex + 1];
                    }
                    else {
                        // partitioning the long word into two words
                        words.splice(wordIndex, 1, word.substring(0, partIndex), word.substring(partIndex));
                        separators.splice(wordIndex, 0, '');
                        wordCount += 1;
                        // if the previous line is not full
                        if (lineIndex && !full[lineIndex - 1]) {
                            lineIndex -= 1;
                        }
                    }
                    wordIndex -= 1;
                    continue;
                }
            }
            else if (!lines[lineIndex]) {
                lines[lineIndex] = word;
                full[lineIndex] = true;
                lineIndex += 1;
                continue;
            }
            lineIndex += 1;
            wordIndex -= 1;
        }
        // check whether the height of the entire text exceeds the rect height
        if (height != null) {
            // ensure line height
            if (lineHeight == null) {
                var heightValue 
                // use the same defaults as in V.prototype.text
                = void 0;
                // use the same defaults as in V.prototype.text
                if (styles.lineHeight === 'auto') {
                    heightValue = { value: 1.5, unit: 'em' };
                }
                else {
                    heightValue = number_1.NumberExt.parseCssNumeric(styles.lineHeight, [
                        'em',
                    ]) || {
                        value: 1,
                        unit: 'em',
                    };
                }
                lineHeight = heightValue.value;
                if (heightValue.unit === 'em') {
                    if (platform_1.Platform.IS_FIREFOX) {
                        lineHeight *= tspan.getBBox().height;
                    }
                    else {
                        lineHeight *= telem.getBBox().height;
                    }
                }
            }
            if (lineHeight * lines.length > height) {
                // remove overflowing lines
                var lastLineIndex = Math.floor(height / lineHeight) - 1;
                var lastLine = lines[lastLineIndex];
                var overflowLine = lines[lastLineIndex + 1];
                lines.splice(lastLineIndex + 1);
                if (lastLine == null) {
                    break;
                }
                // add ellipsis
                var ellipsis = options.ellipsis;
                if (!ellipsis) {
                    break;
                }
                if (typeof ellipsis !== 'string') {
                    ellipsis = '\u2026';
                }
                var fullLastLine = lastLine;
                if (overflowLine && breakWord) {
                    fullLastLine += currentSeparator + overflowLine;
                }
                var lastCharIndex = fullLastLine.length;
                var fixedLastLine = void 0;
                var lastChar = void 0;
                do {
                    lastChar = fullLastLine[lastCharIndex];
                    fixedLastLine = fullLastLine.substring(0, lastCharIndex);
                    if (!lastChar) {
                        fixedLastLine += lineSeprators[lastLineIndex];
                    }
                    else if (lastChar.match(separator)) {
                        fixedLastLine += lastChar;
                    }
                    fixedLastLine += ellipsis;
                    tnode.data = fixedLastLine;
                    if (tspan.getComputedTextLength() <= width) {
                        lines[lastLineIndex] = fixedLastLine;
                        break;
                    }
                    lastCharIndex -= 1;
                } while (lastCharIndex >= 0);
                break;
            }
        }
    }
    if (shouldAppend) {
        (0, elem_1.remove)(svgDocument);
    }
    else {
        (0, elem_1.remove)(telem);
    }
    return lines.join(eol);
}
exports.breakText = breakText;
//# sourceMappingURL=text.js.map