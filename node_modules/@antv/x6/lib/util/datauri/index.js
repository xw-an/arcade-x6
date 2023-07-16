"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataUri = void 0;
var DataUri;
(function (DataUri) {
    function isDataUrl(url) {
        var prefix = 'data:';
        return url.substr(0, prefix.length) === prefix;
    }
    DataUri.isDataUrl = isDataUrl;
    /**
     * Converts an image at `url` to base64-encoded data uri.
     * The mime type of the image is inferred from the `url` file extension.
     */
    function imageToDataUri(url, callback) {
        // No need to convert to data uri if it is already in data uri.
        if (!url || isDataUrl(url)) {
            // Keep the async nature of the function.
            setTimeout(function () { return callback(null, url); });
            return;
        }
        var onError = function () {
            callback(new Error("Failed to load image: " + url));
        };
        var onLoad = window.FileReader
            ? // chrome, IE10+
                function (xhr) {
                    if (xhr.status === 200) {
                        var reader = new FileReader();
                        reader.onload = function (evt) {
                            var dataUri = evt.target.result;
                            callback(null, dataUri);
                        };
                        reader.onerror = onError;
                        reader.readAsDataURL(xhr.response);
                    }
                    else {
                        onError();
                    }
                }
            : function (xhr) {
                var toString = function (u8a) {
                    var CHUNK_SZ = 0x8000;
                    var c = [];
                    for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
                        c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
                    }
                    return c.join('');
                };
                if (xhr.status === 200) {
                    var suffix = url.split('.').pop() || 'png';
                    if (suffix === 'svg') {
                        suffix = 'svg+xml';
                    }
                    var meta = "data:image/" + suffix + ";base64,";
                    var bytes = new Uint8Array(xhr.response);
                    var base64 = meta + btoa(toString(bytes));
                    callback(null, base64);
                }
                else {
                    onError();
                }
            };
        var xhr = new XMLHttpRequest();
        xhr.responseType = window.FileReader ? 'blob' : 'arraybuffer';
        xhr.open('GET', url, true);
        xhr.addEventListener('error', onError);
        xhr.addEventListener('load', function () { return onLoad(xhr); });
        xhr.send();
    }
    DataUri.imageToDataUri = imageToDataUri;
    function dataUriToBlob(dataUrl) {
        var uri = dataUrl.replace(/\s/g, '');
        uri = decodeURIComponent(uri);
        var index = uri.indexOf(',');
        var dataType = uri.slice(0, index); // e.g. 'data:image/jpeg;base64'
        var mime = dataType.split(':')[1].split(';')[0]; // e.g. 'image/jpeg'
        var data = uri.slice(index + 1);
        var decodedString;
        if (dataType.indexOf('base64') >= 0) {
            // data may be encoded in base64
            decodedString = atob(data);
        }
        else {
            // convert the decoded string to UTF-8
            decodedString = unescape(encodeURIComponent(data));
        }
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(decodedString.length);
        for (var i = 0; i < decodedString.length; i += 1) {
            ia[i] = decodedString.charCodeAt(i);
        }
        return new Blob([ia], { type: mime });
    }
    DataUri.dataUriToBlob = dataUriToBlob;
    function downloadBlob(blob, fileName) {
        var msSaveBlob = window.navigator.msSaveBlob;
        if (msSaveBlob) {
            // requires IE 10+
            // pulls up a save dialog
            msSaveBlob(blob, fileName);
        }
        else {
            // other browsers
            // downloads directly in Chrome and Safari
            // presents a save/open dialog in Firefox
            // Firefox bug: `from` field in save dialog always shows `from:blob:`
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1053327
            var url = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // mark the url for garbage collection
            window.URL.revokeObjectURL(url);
        }
    }
    DataUri.downloadBlob = downloadBlob;
    function downloadDataUri(dataUrl, fileName) {
        var blob = dataUriToBlob(dataUrl);
        downloadBlob(blob, fileName);
    }
    DataUri.downloadDataUri = downloadDataUri;
    function parseViewBox(svg) {
        var matches = svg.match(/<svg[^>]*viewBox\s*=\s*(["']?)(.+?)\1[^>]*>/i);
        if (matches && matches[2]) {
            return matches[2].replace(/\s+/, ' ').split(' ');
        }
        return null;
    }
    function getNumber(str) {
        var ret = parseFloat(str);
        return Number.isNaN(ret) ? null : ret;
    }
    function svgToDataUrl(svg, options) {
        if (options === void 0) { options = {}; }
        var viewBox = null;
        var getNumberFromViewBox = function (index) {
            if (viewBox == null) {
                viewBox = parseViewBox(svg);
            }
            if (viewBox != null) {
                return getNumber(viewBox[index]);
            }
            return null;
        };
        var getNumberFromMatches = function (reg) {
            var matches = svg.match(reg);
            if (matches && matches[2]) {
                return getNumber(matches[2]);
            }
            return null;
        };
        var w = options.width;
        if (w == null) {
            w = getNumberFromMatches(/<svg[^>]*width\s*=\s*(["']?)(.+?)\1[^>]*>/i);
        }
        if (w == null) {
            w = getNumberFromViewBox(2);
        }
        if (w == null) {
            throw new Error('Can not parse width from svg string');
        }
        var h = options.height;
        if (h == null) {
            h = getNumberFromMatches(/<svg[^>]*height\s*=\s*(["']?)(.+?)\1[^>]*>/i);
        }
        if (h == null) {
            h = getNumberFromViewBox(3);
        }
        if (h == null) {
            throw new Error('Can not parse height from svg string');
        }
        var decoded = encodeURIComponent(svg)
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');
        var header = 'data:image/svg+xml';
        var dataUrl = header + "," + decoded;
        return dataUrl;
    }
    DataUri.svgToDataUrl = svgToDataUrl;
})(DataUri = exports.DataUri || (exports.DataUri = {}));
//# sourceMappingURL=index.js.map